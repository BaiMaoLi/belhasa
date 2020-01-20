'use strict';
/**
 * @name HomeController
 */
angular.module(module)
	.controller('TestController', [
		'$scope', 'Authentication', '$rootScope', '$http', '$state', '$stateParams', '$uibModalInstance', 'testOptions',
		function($scope, Authentication, $rootScope, $http, $state, $stateParams, $uibModalInstance, testOptions) { 
			// Styles Adjustments
			$('body').attr('style', 'background-color:none;');
			var $element = angular.element(document.querySelector('#test-question'));
			
			switch(testOptions.t) {
				case 's':
					$scope.title = 'Short duration';
					break;
				case 'l':
					$scope.title = 'Long duration';
					break;
			}
			var category = testOptions.c || 'Instructor';
			$scope.user = Authentication.user;
			$scope.qustionId = null;
			$scope.form = {};
			$scope.timer = '00:00';
			$scope.stop = false;

			$scope.userLanguage = $rootScope.userLanguage;

			$scope.finishTest = function() {
				$uibModalInstance.dismiss('ok');
			};

			$rootScope.$on('language-changed', function(event, data) {
				$scope.userLanguage = data;
				if (angular.isNumber($scope.questionId)) {
					$scope.getQuestion();
				}
			});

			var interval;
			function disableTimer() {
				if (interval) {
					clearInterval(interval);
				}
			}
			function enableTimer() {
				var date = new Date();
				var feature = new Date(date.getTime() + ((30)*60000));
				interval = setInterval(function() {
					var diff = Math.floor (feature .getTime() - new Date().getTime()) / 1000;

					var t = diff;
					var minutes = Math.floor(t / 60) % 60;
					t -= minutes * 60;
					var seconds = Math.floor(t % 60);

					$scope.$apply(function() {
						$scope.timer = minutes + ':' + seconds;
					}, true);
					
					if ($scope.timer === '0:0') {
						disableTimer();
						$scope.$apply(function() {
							$scope.testExpiry = true;
						}, true);
						$scope.viewResults();
					}
				}, 1000);
			}

			$scope.loadTest = function() {
				$scope.loader = true;
				var query = '?type=' + testOptions.t + '&category=' + category;
				$http.get('/api/question/test' + query)
					.success(function(response) {
						if (response.success) {
							if (response.data.length) {
								$scope.loader = false;
								if (testOptions.t === 's') {
									enableTimer();
								}
								$scope.test = response.data;
								$scope.question = $scope.test[0];
								$scope.questionId = 0;
							} else {
								// $state.go('app', {test: true});
								$uibModalInstance.dismiss('testalert');
							}
							// $scope.getQuestion();
						}
					});
			};

			$scope.playAudio = function(id) {
			    var audio = document.getElementById(id);
				if(!$scope.stop){
			    	audio.play();
			    	$scope.stop = true;
				} else {
					audio.pause();
					$scope.stop = false;
				}
			};

			$scope.getQuestion = function() {
				if ($scope.userLanguage) {
					$scope.loader = true;
					var question = $scope.question.id;
					$http.get('/api/question/getbyid?id=' + question + '&language=' + $scope.userLanguage.code)
						.success(function(response) {
							$scope.loader = false;
							if (response.success) {
								$scope.question = response.data;
								if ($element.hasClass('animated')) {
									$element.removeClass('animated fadeOutLeft');
									$element.addClass('animated fadeInRight');
								}
							}
						});
				}
			}

			$scope.testResults = [];

			function getAnswer() {
				switch($scope.question.answer) {
					case '1':
						return $scope.question.choice1;
						break;
					case '2':
						return $scope.question.choice2;
						break;
					case '3':
						return $scope.question.choice3;
						break;
					case '4':
						return $scope.question.choice4;
						break;
				}
			}

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
				$element.addClass('animated fadeOutLeft');
				saveAnswer();
				$scope.questionId++;
				$scope.question = $scope.test[$scope.questionId];
				$scope.form.choice = '';
				if ($scope.test.length  !== $scope.questionId) {
					$scope.getQuestion();
				} else {
					$scope.viewResults();
				}
			};

			$scope.viewResults = function() {
				$scope.loader = true;
				// saveAnswer();
				disableTimer();
				$http({
					method: 'POST',
					url: '/api/question/testcomplete',
					data: $scope.testResults
				})
				.success(function(response, status, headers, config) {
					$uibModalInstance.close('testdone');
					if (response.success) {
						$state.go('app.test_results_view', {id: response.data});
					}
				})
				.error(function(response, status, headers, config) {
					$uibModalInstance.close('testdone');
				});
			}

			$scope.closePopup = function() {
				disableTimer();
				$uibModalInstance.close('test-cancel');
			};

		}
	]);