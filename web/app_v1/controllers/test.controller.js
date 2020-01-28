'use strict';
/**
 * @name HomeController
 */
angular.module(module)
	.controller('TestController', [
		'$scope', 'Authentication', '$rootScope', '$http', '$state', '$stateParams', '$uibModalInstance', '$uibModal', 'testOptions', '$window', '$translate', '$mdDialog','$sce',
		function($scope, Authentication, $rootScope, $http, $state, $stateParams, $uibModalInstance, $uibModal, testOptions, $window, $translate, $mdDialog,$sce) {
			// Styles Adjustments
			$('body').attr('style', 'background-color:none;');
			var popupMsg = '';
			var alert;
			$scope.animatedClass = 'slideInRight';
			$scope.user = Authentication.user;
			$scope.user_id = $scope.user.id;
			$scope.qustionId = null;
			$scope.form = {};
			$scope.form.choice = '';
			$scope.realtimetest = '0';
			$scope.stop = false;
			$scope.stopOption1 = false;
			$scope.stopOption2 = false;
			$scope.stopOption3 = false;
			$scope.audioClass = 'fa-play-circle'
			$scope.okpop_finish = false;
			$scope.okpop_timeout = false;
			$scope.selectoption = false;
			$scope.tempCheck = "";
			$scope.rtl_screen = false;
			var settings = JSON.parse($window.localStorage.getItem('test-category'));
			$scope.userLanguage = $rootScope.userLanguage;

			if (!JSON.parse($window.localStorage.getItem('resume'))) {
				var testConfig = {
					category: settings.category,
	                type: testOptions.category,
					limit: testOptions.noofquestion,
					specific: testOptions.noofspecificquestion,
					common:testOptions.noofcommonquestion
				};
			} else {
				var testConfig = {
					type : 'practise',
					category: settings.category,
					user_id : $scope.user_id
				};

			}

			if (testOptions.category === 'practise') {
				$window.localStorage.removeItem("test");
				$scope.realtimetest = '0';
				if (testOptions.id === 2) {
					testConfig.test = 'common';
				} else {
					testConfig.test = 'specific';
				}
			} else if(testOptions.category === 'realtime') {
				$scope.realtimetest = '1';
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
				$window.localStorage.setItem('test',true);
				clearShowInstruction (0);
				if (interval) {
					clearInterval(interval);
				}
			}

			$scope.trustUrl=function(url) {
				return function() {
					return $sce.trustAsResourceUrl(url);
				}
			};


			function enableTimer() {
				var date = new Date();

				if (!JSON.parse($window.localStorage.getItem('resume')) && $scope.user.time == '00:00:00' && Authentication.timer == '00:00:00') {

					var feature = new Date(date.getTime() + ((testOptions.duration)*60000));
					console.log('inside if');
				}else if($scope.user.time=='00:00:00' && $scope.user.resume_test && Authentication.user == '00:00:00') {
					console.log('inside if else');
					if (!isNaN(testOptions)){
						console.log('duration is empty');
						var feature = new Date(date.getTime() + ((testOptions.duration)*60000));
					} else {
						$http.get('api/count/testconfig?category='+settings.category)
						.success(function(response) {
							console.log('if');
							if (response.success) {
								$scope.items = response.data;
								$scope.testConfig = response.data;
								$scope.testTime = response.data[1];
								feature = new Date(date.getTime() + (parseInt($scope.testTime.duration)*60000));
							}
						})
						.error(function(response) {});
					}

				}else {
					console.log('inside else');
					var timeArr = Authentication.timer.split(':');
					console.log('timerarray');
					console.log(timeArr);
					var hrs = parseInt(timeArr[0]);
					var mins = parseInt(timeArr[1]);
					var secs = parseInt(timeArr[2]);
					if (hrs>0){
						hrs = hrs *60;
					}
					if (secs>0){
						mins = mins + (secs/60);
					}
					mins = hrs + mins;
					console.log(mins);
					var feature = new Date(date.getTime() + (mins*60000));
				}
				//var feature = new Date(date.getTime() + ((testOptions.duration)*60000));
				interval = setInterval(function() {
					var diff = Math.floor (feature.getTime() - new Date().getTime()) / 1000;
					// console.log(diff);
					var t = diff;
					var hours = Math.floor(t / 3600) % 24;
					var minutes = Math.floor(t / 60) % 60;
					t -= minutes * 60;
					var seconds = Math.floor(t % 60);
					$scope.$apply(function() {
						if(hours < 10){
							hours = '0' + hours;
						}
						if(minutes < 10){
							minutes = '0' + minutes;
						}
						if(seconds < 10){
							seconds = '0' + seconds;
						}

						$scope.timer = hours + ':' + minutes + ':' + seconds;
						Authentication.timer = hours + ':' + minutes + ':' + seconds;
					}, true);
					if ($scope.timer === '00:00:00') {
						// $window.localStorage.setItem('popup',true);
						//var time = $scope.timer;

						$scope.$apply(function() {
							$scope.testExpiry = true;
						}, true);
						disableTimer();
						if (testConfig.test != 'realtime') {
							popupMsg = 'Time over for practice test! You can resume the remaining questions next time. Click OK to log out';
							$scope.showAlert(popupMsg);
						}
						if (testConfig.test == 'realtime') {

							//$window.localStorage.setItem('popup',true);
							if ($scope.test.length  !== $scope.questionId) {
								for(var i = $scope.questionId ; i<$scope.test.length;i++){
									var questionid = $scope.test[i];
									var question = {
										question: questionid.id,
										input: "0",
										status: false
									};
									$scope.testResults.push(question);
								}
								console.log($scope.testResults);
								$scope.loader = true;
								$scope.okpop_timeout = true;
								// $scope.viewResults();
			                } else {
								$scope.loader = true;
								$scope.okpop_timeout = true;
			                	// $scope.viewResults();
			                }
						}
						else if ($scope.quescount > $scope.testResults.length) {
							console.log('inside question');
							$scope.leftQuestions = [];
						 	if (!$scope.testResults.length){
								$scope.count = 0
							} else {
								$scope.count = $scope.quescount;
							}
							$scope.answerCount = 0;

							angular.forEach($scope.test, function(key,value){
								if ($scope.answerCount >= $scope.count){
									var qustion = $scope.test[$scope.answerCount];
									var questions = {
										user_id : $scope.user_id,
										questionId : qustion.id,
										category : $scope.titlecategory,
										time : '00:00:00'
									}
									console.log(questions);
									$scope.leftQuestions.push(questions);
								}
								$scope.answerCount = $scope.answerCount + 1;
								});

							// if ($scope.leftQuestions.length){
							// 	$http({
					        //         method: 'POST',
					        //         url: 'api/question/questionstate',
					        //         data: $scope.leftQuestions
					        //         })
					        //     .success(function(response) {
					        //         if (response.success) {
							// 			console.log('success');
					        //         }
					        //     })
					        //     .error(function(response) {
					        //         console.log('fail');
					        //     });
							// }
							$uibModalInstance.dismiss('ok');
						}
					    else {
							// close screen
							//$uibModalInstance.dismiss('ok');

							$uibModalInstance.dismiss("Timeout….Please retry the practice test!");
							//set timer to 00:00:00
							// $http.post('api/question/updatetime?id='+$scope.user_id+'&time='+$scope.timer)
							// .success(function(response){
							// });
							//logout when time is up
							$http.post('api/user/logout?id='+$scope.user_id)
							.success(function(response) {
								if (response.success) {
									$translate.use("en-en");
									$rootScope.$emit('language-changed', "en-en");
									Authentication.user = null;
									$window.localStorage.removeItem('test-category');
									$window.localStorage.removeItem('test');
									$window.localStorage.removeItem('resume');
									$window.localStorage.clear();
									$state.go('login');
								}
							});
						}
					}
				}, 200);
			}
			$scope.MsgOk = function(){
				// $window.localStorage.setItem('test',true);
				$scope.okpop_finish = false;
				$scope.okpop_timeout = false;
				$scope.endReview();
			};
			$scope.loadTest = function() {
				$scope.loader = true;
				testConfig.language = $window.localStorage.getItem('screen_lang');
				testConfig.audiolang = $window.localStorage.getItem('user_audio_lang');
				var l = $window.localStorage.getItem('screen_lang');
				$translate.use(l);
				$rootScope.$emit('language-changed', l);
				if(l == 'ar-ar' || l == 'ur-ur' || l == 'fa-fa'){
					$scope.rtl_screen = true;
				}
				$http({
						method: 'POST',
						url: 'api/question/test',
						data: testConfig
					})
					.success(function(response) {
						if (response.success) {
							$scope.quescount = 1;
							$scope.totalcount = response.data.length;
							$scope.titlecategory = testConfig.category;
							if(testConfig.type == "realtime"){
								$scope.titletype = "Mock Test";
							}else if(testConfig.type == "common"){
								$scope.titletype = "Practice common";
							}else if(testConfig.type == "specific"){
								$scope.titletype = "Practice Specific";
							}
							var settings = JSON.parse(window.localStorage.getItem('test-category'));
							$scope.user_name = settings.name;
							if (response.data.length) {
								$scope.loader = false;
								enableTimer();
								$scope.test = response.data;
								$scope.test.map(function(item){
									item.audio="https://www.computerhope.com/jargon/m/example.mp3";
									item.option1audio="https://www.computerhope.com/jargon/m/example.mp3";
									item.option2audio="https://www.computerhope.com/jargon/m/example.mp3";
									item.option3audio="https://www.computerhope.com/jargon/m/example.mp3";
								});
								$scope.question = $scope.test[0];
								$scope.questionId = 0;
								console.log($scope.test);

								setTimeout(function () {
									// $scope.playOption($scope.question.id,1,true);
									$scope.playAudio($scope.question.id,true);
								},1000);
							} else {
								$scope.closePopup('There is no tests available for this category.');
							}
						} else {
							$scope.closePopup('Unable to load test. Please try again later1.');
						}
					})
					.error(function(response) {
						$scope.closePopup('Unable to load test. Please try again later2.');
					});
			};

			$scope.getQuestion = function() {
				if ($scope.userLanguage) {
					$scope.loader = true;
					var audiolang = $window.localStorage.getItem('user_audio_lang');
					var screenlang = $window.localStorage.getItem('screen_lang');
					var question = $scope.question.id;
					$http.get('api/question/getbyid?id=' + question + '&language=' + screenlang + '&audiolang=' + audiolang)
						.success(function(response) {
							$scope.loader = false;
							if (response.success) {
								//$scope.quescount++;
								$scope.question = response.data;
								$scope.question.audio="https://www.computerhope.com/jargon/m/example.mp3";
								$scope.question.option1audio="https://www.computerhope.com/jargon/m/example.mp3";
								$scope.question.option2audio="https://www.computerhope.com/jargon/m/example.mp3";
								$scope.question.option3audio="https://www.computerhope.com/jargon/m/example.mp3";
								$scope.animatedClass = 'flipInY';
							}
						});
				}
			};

			$scope.mapOption = function(){
				angular.forEach($scope.testResults, function(value,key){
					if(value.question == $scope.question.id){
						$scope.form.choice = value.input;
					}
				});
			};

			$scope.playAudio = function(id, auto_play=false) {
			    var audio = document.getElementById(id);
				var src=$scope.question['audio'];
				for(let i=1;i<=3;i++){
					$scope['stopOption'+i] = false;
					var audio_temp = document.getElementById(id+"option"+i);
					audio_temp.pause();
				}
				if(src!=='' && src!=null && src!=='null') {
					audio.src = src;
					audio.load();
					if(!$scope.stop){
						audio.play();
						$scope.audioClass = 'fa-stop-circle';
						$scope.stop = true;
						audio.onended = function() {
							audio.pause();
							$scope.audioClass = 'fa-play-circle';
							audio.currentTime = 0;
							$scope.stop = false;
							if(auto_play){
								$scope.playOption(id,1,true);
							}
						};
					} else {
						audio.pause();
						$scope.audioClass = 'fa-play-circle';
						audio.currentTime = 0;
						$scope.stop = false;
					}
				}else{
					$scope.playOption(id,1,true);
				}
			};

			$scope.playOption = function(id,option_number, auto_next_play=false) {
			    var audio = document.getElementById(id+"option"+option_number);
			    var src=$scope.question['option'+option_number+'audio'];

			    var audio = document.getElementById(id);
				audio.pause();
				$scope.stop = false;

			    if(src!=='' && src!=null && src!=='null'){
					audio.src = src;
					audio.load();
					for(let i=1;i<=3;i++){
						if(i!=option_number){
							$scope['stopOption'+i] = false;
							var audio_temp = document.getElementById(id+"option"+i);
							audio_temp.pause();
						}
					}
					if(!$scope['stopOption'+option_number]){
						audio.play();
						$scope.audioClass = 'fa-stop-circle';
						$scope.audioPlay = true;
						$scope['stopOption'+option_number] = true;
						audio.onended = function() {
							audio.pause();
							$scope.audioClass = 'fa-play-circle';
							$scope.audioPlay = false;
							audio.currentTime = 0;
							if(!auto_next_play)
								$scope['stopOption'+option_number] = false;
							else{
								if(option_number<3)
								{
									var next_option=option_number+1;
									$scope.playOption(id,next_option, auto_next_play);
								}
							}
						};
					} else {
						audio.pause();
						$scope.audioClass = 'fa-play-circle';
						$scope.audioPlay = false;
						audio.currentTime = 0;
						$scope['stopOption'+option_number] = false;
					}
				}
			    else{
                    if(option_number<3)
                    {
                        var next_option=option_number+1;
                        $scope.playOption(id,next_option, auto_next_play);
                    }
                }
			};

			$scope.playOption2 = function(id) {
			    var audio = document.getElementById(id+"option2");
				if(!$scope.stopOption2){
			    	audio.play();
			    	$scope.audioClass = 'fa-stop-circle';
					$scope.audioPlay = true;
			    	$scope.stopOption2 = true;
					audio.onended = function() {
						audio.pause();
						$scope.audioClass = 'fa-play-circle';
						$scope.audioPlay = false;
						audio.currentTime = 0;
						$scope.stopOption2 = false;
					};
				} else {
					audio.pause();
					$scope.audioClass = 'fa-play-circle';
					$scope.audioPlay = false;
					audio.currentTime = 0;
					$scope.stopOption2 = false;
				}
			};

			$scope.playOption3 = function(id) {
			    var audio = document.getElementById(id+"option3");
				if(!$scope.stopOption3){
			    	audio.play();
			    	$scope.audioClass = 'fa-stop-circle';
					$scope.audioPlay = true;
			    	$scope.stopOption3 = true;
					audio.onended = function() {
						audio.pause();
						$scope.audioClass = 'fa-play-circle';
						$scope.audioPlay = false;
						audio.currentTime = 0;
						$scope.stopOption3 = false;
					};
				} else {
					audio.pause();
					$scope.audioClass = 'fa-play-circle';
					$scope.audioPlay = false;
					audio.currentTime = 0;
					$scope.stopOption3 = false;
				}
			};

			$scope.finishTest = function() {
				console.log('ok');
				$window.localStorage.removeItem('resume');
				// $http.post('api/question/updatetime?id='+$scope.user_id+'&time='+$scope.timer)
				// 	.success(function(response){
				// 	});
				$translate.use("en-en");
				$rootScope.$emit('language-changed', "en-en");
				disableTimer();
				if ($scope.timer == '00:00:00' ) {
					// disableTimer();
					$uibModalInstance.close('testdone');
					$http.post('api/user/logout?id='+$scope.user_id)
						.success(function(response) {
							if (response.success) {
								$translate.use("en-en");
								$rootScope.$emit('language-changed', "en-en");
								Authentication.user = null;
								$window.localStorage.removeItem('test-category');
								$window.localStorage.removeItem('test');
								$window.localStorage.removeItem('resume');
								$window.localStorage.clear();
								$state.go('login');
							}
						});

				}
				// disableTimer();
				$uibModalInstance.close('testdone');

			};

			$scope.closePopup = function(msg) {
				// disableTimer();
				if (!msg) {
					var flag = confirm('Are  You Sure You Want To Quit The Test?');
					if (flag) {
						// $uibModalInstance.dismiss(msg);
						$window.localStorage.removeItem('resume');
						// $http.post('api/question/updatetime?id='+$scope.user_id+'&time='+$scope.timer)
						// 	.success(function(response){
						// });
						$http.post('api/user/logout?id='+$scope.user_id)
							.success(function(response) {
								if (response.success) {
									$translate.use("en-en");
									$rootScope.$emit('language-changed', "en-en");
									Authentication.user = null;
									$window.localStorage.removeItem('test-category');
									$window.localStorage.removeItem('test');
									$window.localStorage.removeItem('resume');
									$window.localStorage.clear();
									$uibModalInstance.dismiss(msg);
									$state.go('login');
								}
							});
					}
				} else {
					$uibModalInstance.dismiss(msg);
				}
			};

			$scope.checkAnswer = function() {
				$scope.selectoption = false;
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
				}else{
					if($scope.form.choice == $scope.tempCheck){
						console.log($scope.form.choice);
						console.log($scope.tempCheck);
						$scope.tempCheck = "0";
						$scope.form.choice = null;
					}else{
						console.log($scope.form.choice);
						console.log($scope.tempCheck);
						$scope.tempCheck = $scope.form.choice;
					}
				}
			};

			$scope.testResults = [];
			// Next Question
			function saveAnswer() {
                var question = {
                    question: $scope.question.id,
                    input: $scope.form.choice || "0"
                };
				if ($scope.question.answer === $scope.form.choice) {
                    question.status = true;
                } else {
                    question.status = false
                }
				if($scope.testResults.length){
					// $scope.testResults.push(question);
					var temp = false;
					var qkey = null;
					angular.forEach($scope.testResults, function(value,key){
						console.log(value.question);
						if(value.question == $scope.question.id){
							qkey = key;
							temp = true;
						}
					});
					if(!temp){
						$scope.testResults.push(question);
					}else{
						$scope.testResults[qkey].input = question.input;
						$scope.testResults[qkey].status = question.status;
					}
				}else{
					$scope.testResults.push(question);
				}
            }

            $scope.nextQuestion = function() {
				$scope.stop = false;
				$scope.stopOption1 = false;
				$scope.stopOption2 = false;
				$scope.stopOption3 = false;
				if(testConfig.type != 'realtime' && $scope.form.choice == ''){
					$scope.selectoption = true;
				}else{
					$scope.selectoption = false;
					$scope.animatedClass = 'slideOutLeft';
	                $scope.optionResult = {};
	                $scope.optionDisabled = false;
	                $scope.stop = false;
	                $scope.audioClass = 'fa-play-circle'
					if(testConfig.type == 'realtime'){
						saveAnswer();
					}
	                $scope.questionId++;
	                $scope.question = $scope.test[$scope.questionId];
	                $scope.form.choice = '';
					if ($scope.test.length  !== $scope.questionId) {
						$scope.quescount++;
	                    $scope.getQuestion();
						$scope.mapOption();
						setTimeout(function () {
							// $scope.playOption($scope.question.id,1,true);
							$scope.playAudio($scope.question.id,true);
						},1000);

	                } else {
	                	if (testConfig.test !== 'realtime') {
	                		popupMsg = 'You have reached end of practice. Click Ok to continue...';
	                		$scope.showAlert(popupMsg);
	                		$scope.finishTest();
	                	} else {
	                		popupMsg = 'You have reached end of the test... Click to see the result';
	                		//$scope.showConfirm(popupMsg);
							$scope.loader = true;
							// $scope.okpop_finish = true;
							$scope.viewResults();
	                	}
	                }
				}
            };

			$scope.prevQuestion = function() {
				//$scope.quescount++;
				$scope.stop = false;
				$scope.stopOption1 = false;
				$scope.stopOption2 = false;
				$scope.stopOption3 = false;
				$scope.selectoption = false;
                $scope.animatedClass = 'slideOutRight';
                $scope.optionResult = {};
                $scope.optionDisabled = false;
                $scope.stop = false;
                $scope.audioClass = 'fa-play-circle'
				if(testConfig.type == 'realtime'){
					saveAnswer();
				}
                $scope.questionId--;
                $scope.question = $scope.test[$scope.questionId];
                $scope.form.choice = '';
				if ($scope.test.length  !== $scope.questionId) {
					$scope.quescount--;
                    $scope.getQuestion();
					$scope.mapOption();
                } else {
                	if (testConfig.test !== 'realtime') {
                		$scope.finishTest();
                	} else {
						$scope.loader = true;
						$scope.okpop_finish = true;
						// $scope.viewResults();
                	}
                }
            };

            $window.onbeforeunload = function () {

	            $scope.leftQuestions = [];
	            console.log(testOptions.category);
				if (testOptions.category !== 'realtime'){

				  	if ($scope.quescount > $scope.testResults.length) {
					 	if (!$scope.testResults.length){
							$scope.count = 0
						} else {
							$scope.count = $scope.quescount;
						}

						$scope.answerCount = 0;

						angular.forEach($scope.test, function(key,value){
							if ($scope.answerCount >= $scope.count){
								var qustion = $scope.test[$scope.answerCount];
								var questions = {
									user_id : $scope.user_id,
									questionId : qustion.id,
									category : $scope.titlecategory,
									time : $scope.timer
								}
								console.log(questions);
								$scope.leftQuestions.push(questions);
							}
							$scope.answerCount = $scope.answerCount + 1;
							});

						// if ($scope.leftQuestions.length){
						// 	$http({
				        //         method: 'POST',
				        //         url: 'api/question/questionstate',
				        //         data: $scope.leftQuestions
				        //         })
				        //     .success(function(response) {
				        //         if (response.success) {
						// 			console.log('success');
				        //         }
				        //     })
				        //     .error(function(response) {
				        //         console.log('fail');
				        //     });
						// }
				   	}
			    } else{
			    	console.log('realtime');
				}

			};

			$scope.endReview = function(){
				$scope.loader = true;
                disableTimer();
                // clearShowInstruction (0);

                var data = {
                	category: settings.category,
                	result: $scope.testResults,
					admin_id: $window.localStorage.getItem('admin_id')
                };
				console.log(data);
                $http({
                    method: 'POST',
                    url: 'api/question/testcomplete',
                    data: data
                })
                .success(function(response, status, headers, config) {
                    if (response.success) {
                        // $uibModalInstance.close('testdone');
                        // $scope.showAlert(popupMsg);
						var popupWin = window.location.origin + '/site/testprint?id='+response.data+"&lang="+$window.localStorage.getItem('screen_lang');;
						var id = response.data;
						location.href = popupWin;
						//$http.post('api/user/logout')
						$http.post('api/user/logout?id='+$scope.user_id)
						.success(function(response) {
							if (response.success) {
								$translate.use("en-en");
								$rootScope.$emit('language-changed', "en-en");
								Authentication.user = null;
								$window.localStorage.removeItem('test-category');
								$window.localStorage.removeItem('test');
								$window.localStorage.clear();
							}
						});
                    }
                    //$uibModalInstance.close('testdone');
                })
                .error(function(response, status, headers, config) {
                    $uibModalInstance.close('testdone');
                });
			};

            $scope.viewResults = function() {
                $scope.loader = true;
                disableTimer();
                clearShowInstruction (0);

                var data = {
                	category: settings.category,
                	result: $scope.testResults,
					test: $scope.test
                };
				console.log(data);
				$window.localStorage.setItem('reviewOption',  JSON.stringify(data));
				$uibModalInstance.close('testdone');
				var config;
				var modal = $uibModal.open({
					templateUrl: 'app_v1/templates/test_review.tpl.html',
					controller: 'ReviewController',
					size: 'lg',
					backdrop: 'static',
					keyboard: false,
					resolve: {
						testOptions: function () {
							return config;
						}
					}
				});
				// $uibModalInstance.close('testdone');
                // $http({
                //     method: 'POST',
                //     url: 'api/question/testcomplete',
                //     data: data
                // })
                // .success(function(response, status, headers, config) {
                //     if (response.success) {
                //         // $uibModalInstance.close('testdone');
                //         // $scope.showAlert(popupMsg);
				// 		var popupWin = window.location.origin + '/site/testprint?id='+response.data+"&lang="+$window.localStorage.getItem('user_lang');
				// 		var id = response.data;
				// 		location.href = popupWin;
				// 		//$http.post('api/user/logout')
				// 		$http.post('api/user/logout?id='+$scope.user_id)
				// 		.success(function(response) {
				// 			if (response.success) {
				// 				Authentication.user = null;
				// 				$window.localStorage.removeItem('test-category');
				// 				$window.localStorage.removeItem('test');
				// 			}
				// 		});
                //     }
                //     //$uibModalInstance.close('testdone');
                // })
                // .error(function(response, status, headers, config) {
                //     $uibModalInstance.close('testdone');
                // });
            }

			$scope.closeAlert = function(){
				$scope.selectoption = false;
			}

            $scope.showAlert = function(msg) {
               $mdDialog.show(
                  $mdDialog.alert()
                     .parent(angular.element(document.querySelector('#dialogContainer')))
                     .clickOutsideToClose(false)
                     .title()
                     .textContent(msg)
                     .ariaLabel('Belhasa Driving Center')
                     .ok('Ok!')
                     //.targetEvent()
               );
            };

            $scope.showConfirm = function(msg) {
               var confirm = $mdDialog.confirm()
                  .title()
                  .textContent(msg)
                  .ariaLabel('Belhasa Driving Center')
                  .targetEvent(event)
                  .ok('Yes')
                  .cancel('No');
                  $mdDialog.show(confirm).then(function() {
                     $scope.status = 'Record deleted successfully!';
                     //$scope.viewResults();
                     }, function() {
                        $scope.status = 'You decided to keep your record.';
                  });
            };

            function clearShowInstruction (instruction){
            	$http.get('api/user/clearinsruction?id=' + $scope.user.id+'&show_instruction='+instruction)
					.success(function(response, status, headers, config) {
						// $scope.loader = false;
						if (response.success) {
							console.log('success');
						}
					})
					.error(function(response, status, headers, config) {
						// $scope.loader = false;
						console.log('fail');
					});
            }
		}
	]);
