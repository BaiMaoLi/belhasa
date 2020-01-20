'use strict';
/**
 * @name HomeController
 */
angular.module(module)
	.controller('InstructionController', [
		'$scope', 'Authentication', '$rootScope', '$http', '$state', '$stateParams', '$uibModalInstance', 'testOptions', '$window',
		function($scope, Authentication, $rootScope, $http, $state, $stateParams, $uibModalInstance, testOptions, $window) {
			// Styles Adjustments
			$('body').attr('style', 'background-color:none;');
			$scope.animatedClass = 'slideInDown';
			console.log('testOptions');
			console.log(testOptions.category);
			$scope.user = Authentication.user;
			$scope.qustionId = null;
			$scope.form = {};
			$scope.timer = '00:00';
			$scope.stop = false;
			$scope.audioClass = 'fa-play-circle'
			$scope.index = 1;
			$scope.mins =0;
			$scope.hrs = 0;
			$scope.dismsg = testOptions.category;
			var settings = JSON.parse($window.localStorage.getItem('test-category'));
			if (testOptions.duration < 60 ){
				console.log('inside if');
				$scope.mins = testOptions.duration;
			} else if (testOptions.duration >= 60 ){
				console.log('inside else');
				$scope.hrs = testOptions.duration / 60;
				$scope.hrs = Math.floor($scope.hrs)
				console.log($scope.hrs);
				$scope.mins = testOptions.duration % 60;
			} else {
				console.log('inside else');
			}

			$scope.userLanguage = $rootScope.userLanguage;

			var testConfig = {
				category: settings.category,
                type: testOptions.category,
				limit: testOptions.noofquestion,
				specific: testOptions.noofspecificquestion,
				common:testOptions.noofcommonquestion
			};

			if (testOptions.category === 'practise') {
				if (testOptions.id === 2) {
					testConfig.test = 'common';
				} else {
					testConfig.test = 'specific';
				}
			} else if(testOptions.category === 'realtime') {
				testConfig.test = 'realtime'
			}

			$rootScope.$on('language-changed', function(event, data) {
				$scope.userLanguage = data;
				if (angular.isNumber($scope.questionId)) {
					$scope.getQuestion();
				}
			});

			/* Timers */
			var interval;
			function disableTimer() {
				if (interval) {
					clearInterval(interval);
				}
			}

			function enableTimer() {
				var date = new Date();
				var feature = new Date(date.getTime() + ((testOptions.duration)*60000));
				interval = setInterval(function() {
					var diff = Math.floor (feature .getTime() - new Date().getTime()) / 1000;

					var t = diff;
					var hours = Math.floor(t / 3600) % 24;
					var minutes = Math.floor(t / 60) % 60;
					t -= minutes * 60;
					var seconds = Math.floor(t % 60);

					$scope.$apply(function() {
						$scope.timer = hours + ':' + minutes + ':' + seconds;
					}, true);

					if ($scope.timer === '0:0:0') {
						disableTimer();
						$scope.$apply(function() {
							$scope.testExpiry = true;
						}, true);
						$scope.viewResults();
					}
				}, 1000);
			}

			function getInstruction(){
				var settings = JSON.parse(window.localStorage.getItem('test-category'));
				//$http.get('/api/count/testconfig')
				$http.get('/api/count/testconfig?category='+settings.category)
					.success(function(response) {
						if (response.success) {
							//$scope.items = response.data;
							$scope.testConfig = response.data;
							console.log(testConfig);
							angular.forEach(response.data, function(value, key) {
								if(testConfig.type == value.category){
									$scope.instructionmsg = value.instruction;
									console.log(value.instruction);
								}
							});

						}
					})
					.error(function(response) {});
			}


			$scope.loadTest = function() {
				$scope.loader = true;
				testConfig.language = $window.localStorage.getItem('screen_lang');
				$http({
						method: 'POST',
						url: '/api/question/test',
						data: testConfig
					})
					.success(function(response) {
						if (response.success) {
							$scope.quescount = 1;
							$scope.totalcount = response.data.length;
							$scope.titlecategory = testConfig.category;
							if (response.data.length) {
								$scope.loader = false;
								// enableTimer();
								getInstruction();
								$scope.test = response.data;
								$scope.question = $scope.test[0];
								$scope.questionId = 0;
							} else {
								$scope.closePopup('There is no tests available for this category.');
							}
						} else {
							$scope.closePopup('Unable to load test. Please try again later.');
						}
					})
					.error(function(response) {
						$scope.closePopup('Unable to load test. Please try again later.');
					});
			};

			$scope.getQuestion = function() {
				if ($scope.userLanguage) {
					$scope.loader = true;
					var question = $scope.question.id;
					$http.get('/api/question/getbyid?id=' + question + '&language=' + $window.localStorage.getItem('screen_lang'))
						.success(function(response) {
							$scope.loader = false;
							if (response.success) {
								$scope.quescount++;
								$scope.question = response.data;
								$scope.animatedClass = 'slideInRight';
							}
						});
				}
			};

			$scope.playAudio = function(id) {
			    var audio = document.getElementById(id);
				if(!$scope.stop){
			    	audio.play();
			    	$scope.audioClass = 'fa-stop-circle'
			    	$scope.stop = true;
				} else {
					audio.pause();
					$scope.audioClass = 'fa-play-circle'
					audio.currentTime = 0;
					$scope.stop = false;
				}
			};


			$scope.finishTest = function() {
				disableTimer();
				$uibModalInstance.dismiss('ok');
			};

			$scope.closePopup = function(msg) {
				disableTimer();
				if (!msg) {
					var flag = confirm('Are  You Sure You Want To Quit The Test?');
					if (flag) {
						$uibModalInstance.dismiss(msg);
					}
				} else {
					$uibModalInstance.dismiss(msg);
				}
			};

			$scope.accept = function(msg) {
				disableTimer();
				$scope.index = $scope.index + 1;
				console.log($scope.index);
				// $uibModalInstance.dismiss('ok');
				// if (!msg) {
				// 	var flag = confirm('Are  You Sure You Want To Quit The Test?');
				// 	if (flag) {
				// 		$uibModalInstance.dismiss(msg);
				// 	}
				// } else {
				// 	$uibModalInstance.dismiss(msg);
				// }
			};

			$scope.checkAnswer = function() {
				if (testConfig.test !== 'realtime') {
					$scope.optionResult = {};
					$scope.optionDisabled = true;
					var result = false;
					if($scope.form.choice === $scope.question.answer) {
						result = true;
						$scope.optionResult['successFlag' + $scope.form.choice] = true;
					} else {
						$scope.optionResult['successFlag' + $scope.question.answer] = true;
					}

					if (!$scope.optionResult['successFlag' + $scope.form.choice]) {
						$scope.optionResult['errorFlag' + $scope.form.choice] = true;
					}
				}
			};

			$scope.testResults = [];
			// Next Question
			function saveAnswer() {
                var question = {
                    question: $scope.question.id,
                    input: $scope.form.choice || ''
                };
                if ($scope.question.answer === $scope.form.choice) {
                    question.status = true;
                } else {
                    question.status = false
                }
                $scope.testResults.push(question);
            }

            $scope.nextQuestion = function() {
                $scope.animatedClass = 'slideOutLeft';
                $scope.optionResult = {};
                $scope.optionDisabled = false;
                saveAnswer();
                $scope.questionId++;
                $scope.question = $scope.test[$scope.questionId];
                $scope.form.choice = '';
                if ($scope.test.length  !== $scope.questionId) {
                    $scope.getQuestion();
                } else {
                	if (testConfig.test !== 'realtime') {
                		$scope.finishTest();
                	} else {
                		$scope.viewResults();
                	}
                }
            };

            $scope.viewResults = function() {
                $scope.loader = true;
                disableTimer();
                var data = {
                	category: settings.category,
                	result: $scope.testResults
                };
                $http({
                    method: 'POST',
                    url: '/api/question/testcomplete',
                    data: data
                })
                .success(function(response, status, headers, config) {
                    if (response.success) {
                        $state.go('app.test_results_view', {id: response.data});
                    }
                    $uibModalInstance.close('testdone');
                    window.open('/site/testprint?id=' + response.data, '_parent');
                })
                .error(function(response, status, headers, config) {
                    $uibModalInstance.close('testdone');
                });
            }

		}
	]);
