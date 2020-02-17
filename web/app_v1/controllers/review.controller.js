'use strict';
/**
 * @name HomeController
 */
angular.module(module)
	.controller('ReviewController', [
		'$scope', 'Authentication', '$rootScope', '$http', '$state', '$stateParams', '$uibModalInstance', 'testOptions', '$window', '$translate', '$mdDialog',
		function($scope, Authentication, $rootScope, $http, $state, $stateParams, $uibModalInstance, testOptions, $window, $translate, $mdDialog) {
			// Styles Adjustments
			$('body').attr('style', 'background-color:none;');
			var popupMsg = '';
			var alert;
			$scope.animatedClass = 'slideInRight';
			$scope.user = Authentication.user;
			$scope.user_id = $scope.user.id;
			$scope.qustionId = 0;
			$scope.form = {};
			$scope.unmark = {};
			$scope.unmark.marked = [];
			$scope.form.choice = '';
			$scope.realtimetest = '1';
			$scope.stop = false;
			$scope.stopOption1 = false;
			$scope.stopOption2 = false;
			$scope.stopOption3 = false;
			$scope.audioClass = 'fa-play-circle'
			$scope.okpop_finish = false;
			$scope.okpop_timeout = false;
			$scope.selectoption = false;
			$scope.tempCheck = "";
			$scope.question = {};
			$scope.showReview = true;
			$scope.testResults = [];
			$scope.question = {};
			$scope.reviewquestion = {};
			$scope.unansweredCount = 0;
			$scope.reviewIndex = -1;
			$scope.markedQuestion = [];
			$scope.markedQuestionIndex = -1;
			$scope.prevButton = true;
			$scope.okpop_unanswered = false;
			$scope.okpop_marked = false;
			$scope.okpop_endReview = false;
			$scope.r = 0;
			$scope.q = 0;
			$scope.tablerows = 0;
			$scope.loadscript = false;
			$scope.draw = [];
			$scope.rtl_screen = false;
			var settings = JSON.parse($window.localStorage.getItem('test-category'));
			$scope.userLanguage = $rootScope.userLanguage;
			$scope.user_name = settings.name;
			var testConfig = {
				category: settings.category,
				type: 'realtime',
				test: 'realtime'
			}
            // if (!JSON.parse($window.localStorage.getItem('resume'))) {
			// 	var testConfig = {
			// 		category: settings.category,
	        //         type: testOptions.category,
			// 		limit: testOptions.noofquestion,
			// 		specific: testOptions.noofspecificquestion,
			// 		common:testOptions.noofcommonquestion
			// 	};
			// } else {
			// 	var testConfig = {
			// 		type : 'practise',
			// 		category: settings.category,
			// 		user_id : $scope.user_id
			// 	};
            //
			// }
            //
			// if (testOptions.category === 'practise') {
			// 	$window.localStorage.removeItem("test");
			// 	$scope.realtimetest = '0';
			// 	if (testOptions.id === 2) {
			// 		testConfig.test = 'common';
			// 	} else {
			// 		testConfig.test = 'specific';
			// 	}
			// } else if(testOptions.category === 'realtime') {
			// 	$scope.realtimetest = '1';
			// 	testConfig.test = 'realtime'
			// }

			$rootScope.$on('language-changed', function(event, data) {
				$scope.userLanguage = data;
				if (angular.isNumber($scope.questionId)) {
					$scope.getQuestion();
				}
			});
            //
			/* Timers */
			var interval;
			function disableTimer() {
				$window.localStorage.setItem('test',true);
				if (interval) {
					clearInterval(interval);
				}
			}

			function enableTimer() {
				var date = new Date();
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
				//var feature = new Date(date.getTime() + ((testOptions.duration)*60000));
				interval = setInterval(function() {
					// console.log($scope.timer);
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
						console.log("Endedddd");
						if($scope.showReview){
							$scope.showReview = false;
							$scope.loader = true;
							$scope.okpop_timeout = true;
						}else{
							$scope.$apply(function() {
								$scope.testExpiry = true;
							}, true);
							disableTimer();
							$scope.showReview = false;
							$scope.loader = true;
							$scope.okpop_timeout = true;
				            // scope.viewResults();
						}

					}
				}, 200);
			}
			enableTimer();
			$scope.loadReview = function(){
				// $translate.use("en-en");
				// $rootScope.$emit('language-changed', "en-en");
				var l = $window.localStorage.getItem('screen_lang');
				if(l == 'ar-ar' || l == 'ur-ur' || l == 'fa-fa'){
					$scope.rtl_screen = true;
				}
				$scope.draw = [];
				var data = $window.localStorage.getItem('reviewOption');
				data =  JSON.parse(data);
				$scope.testResults = data.result;
				$scope.test = data.test;
				$scope.reviewquestion = data.result;
				$scope.q = Math.round($scope.testResults.length / 3);
				$scope.r = Math.round($scope.testResults.length % 3);
				if($scope.r != 0){
					$scope.tablerows = $scope.q + 1;
					for(var i = 0; i < $scope.tablerows; i++){
						$scope.draw.push(i);
					}
				}else{
					$scope.tablerows = $scope.q;
					for(var i = 0; i < $scope.tablerows; i++){
						$scope.draw.push(i);
					}
				}
				console.log("counting");
				var temp = 0;
				for(var i = 0; i < $scope.reviewquestion.length; i++){
					if($scope.reviewquestion[i].input == "0"){
						temp = temp + 1;
					}
				}
				$scope.unansweredCount = temp;
				$scope.loadscript = true;
			};
			$scope.reviewUnanswered = function(){
				$scope.markedQuestion = [];
				$scope.markedQuestionIndex = -1;
				var flag = 0;
				for(var i = 0;i < $scope.testResults.length;i++){
					if($scope.testResults[i].input == "0"){
						$scope.markedQuestion.push(i);
						flag = 1;
					}
				}
				$scope.unmark.marked = [];
				if(flag != 0){
					// var l = $window.localStorage.getItem('screen_lang');
					// $translate.use(l);
					// $rootScope.$emit('language-changed', l);
					$scope.loadscript = false;
					$scope.markedQuestionIndex = 0;
					$scope.qustionId = $scope.markedQuestion[$scope.markedQuestionIndex];
					console.log($scope.testResults[$scope.markedQuestion[$scope.markedQuestionIndex]].question);
					$scope.showReview = false;
					$scope.question.id = $scope.testResults[$scope.markedQuestion[$scope.markedQuestionIndex]].question;
				}else{
					$scope.okpop_unanswered = true;
				}
			};
			$scope.reviewMarked = function(){
				if($scope.unmark.marked.length != 0){
					$scope.markedQuestion = [];
					$scope.markedQuestionIndex = -1;
					var flag = 0;
					for(var i = 0;i < $scope.testResults.length;i++){
						if($scope.unmark.marked[i]){
							$scope.markedQuestion.push(i);
							flag = 1;
						}
					}
					$scope.unmark.marked = [];
					if(flag != 0){
						// var l = $window.localStorage.getItem('screen_lang');
						// $translate.use(l);
						// $rootScope.$emit('language-changed', l);
						$scope.loadscript = false;
						$scope.markedQuestionIndex = 0;
						$scope.qustionId = $scope.markedQuestion[$scope.markedQuestionIndex];
						console.log($scope.testResults[$scope.markedQuestion[$scope.markedQuestionIndex]].question);
						$scope.showReview = false;
						$scope.question.id = $scope.testResults[$scope.markedQuestion[$scope.markedQuestionIndex]].question;
					}
				}
				else{
					$scope.okpop_marked = true;
				}
			};
			$scope.reviewAll = function(){
				// var l = $window.localStorage.getItem('screen_lang');
				// $translate.use(l);
				// $rootScope.$emit('language-changed', l);
				$scope.loadscript = false;
				$scope.qustionId = 0;
				$scope.markedQuestion = [];
				$scope.markedQuestionIndex = -1;
				console.log($scope.testResults[0].question);
				$scope.showReview = false;
				$scope.question.id = $scope.testResults[0].question;
			};
			$scope.reviewByIndex = function(id){
				// var l = $window.localStorage.getItem('screen_lang');
				// $translate.use(l);
				// $rootScope.$emit('language-changed', l);
				$scope.loadscript = false;
				console.log(id);
				$scope.markedQuestion = [];
				$scope.markedQuestionIndex = -1;
				$scope.reviewIndex = id;
				$scope.showReview = false;
				$scope.question.id = $scope.testResults[id].question;
			};
			$scope.funShowReview = function(){
				//$scope.quescount++;
				$scope.stop = false;
				$scope.stopOption1 = false;
				$scope.stopOption2 = false;
				$scope.stopOption3 = false;
				console.log(testConfig.type);
				$scope.selectoption = false;
				$scope.animatedClass = 'slideOutLeft';
                $scope.optionResult = {};
                $scope.optionDisabled = false;
                $scope.audioClass = 'fa-play-circle'
                saveAnswer();
                $scope.form.choice = '';
				var data = {
					category: settings.category,
					result: $scope.testResults,
					test: $scope.test
				};
				console.log(data);
				$window.localStorage.setItem('reviewOption',  JSON.stringify(data));
				$scope.showReview = true;
			};
			$scope.endReview = function(){
				$window.localStorage.setItem('home_reload', 0);
				var data = {
                	category: settings.category,
                	result: $scope.testResults,
					test: $scope.test,
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
						var popupWin =base_url+'site/testprint?id='+response.data+"&lang="+$window.localStorage.getItem('screen_lang');
						var id = response.data;
						location.href = popupWin;
						//$http.post('api/user/logout')
						$http.post('api/user/logout?id='+$scope.user_id)
						.success(function(response) {
							if (response.success) {
								Authentication.user = null;
								$window.localStorage.removeItem('test-category');
								$window.localStorage.removeItem('test');
								$window.localStorage.removeItem('reviewOption');
								$window.localStorage.removeItem('user_audio_lang');
								$window.localStorage.removeItem('admin_id');
								$window.localStorage.removeItem('reload_lang');
								$window.localStorage.removeItem('reload_logout');
								$window.localStorage.clear();
								$uibModalInstance.close('testdone');
							}
						});
                    }
                    //$uibModalInstance.close('testdone');
                })
                .error(function(response, status, headers, config) {
                    $uibModalInstance.close('testdone');
                });
			};
			$scope.showEndMsg = function(){
				$scope.okpop_endReview = true;
			};
			$scope.endAllProcess = function(){
				$scope.okpop_endReview = false;
				$scope.endReview();
			};
			$scope.cancelEndAllProcess = function(){
				$scope.okpop_endReview = false;
			};
			$scope.MsgOk = function(){
				$window.localStorage.setItem('test',true);
				$scope.okpop_finish = false;
				$scope.okpop_timeout = false;
				$scope.endReview();
			};
			$scope.okMsg = function(){
				$scope.okpop_unanswered = false;
				$scope.okpop_marked = false;
			}
			$scope.loadTest = function() {
				$scope.loader = true;
				testConfig.language = $scope.userLanguage.code;
				testConfig.audiolang = $window.localStorage.getItem('user_audio_lang');
				console.log(testConfig);
				if ($scope.userLanguage) {
					$scope.loader = true;
					var audiolang = $window.localStorage.getItem('user_audio_lang');
					var screenlang = $window.localStorage.getItem('screen_lang');
					var question = $scope.testResults[0].question;
					if($scope.reviewIndex != -1){
						question = $scope.testResults[$scope.reviewIndex].question;
					}
					// if($scope.markedQuestion[$scope.markedQuestionIndex])
					if($scope.markedQuestionIndex != -1){
						question = $scope.testResults[$scope.markedQuestion[$scope.markedQuestionIndex]].question;
					}
					$http.get('api/question/getbyid?id=' + question + '&language=' + screenlang + '&audiolang=' + audiolang)
						.success(function(response) {
							$scope.loader = false;
							if (response.success) {
								//$scope.quescount++;
								$scope.question = response.data;
								console.log($scope.question);
								$scope.animatedClass = 'flipInY';
								if($scope.reviewIndex != -1){
									$scope.questionId = $scope.reviewIndex;
									$scope.quescount = $scope.reviewIndex + 1;
									$scope.reviewIndex = -1;
								}else if ($scope.markedQuestionIndex != -1) {
									$scope.questionId = $scope.markedQuestion[$scope.markedQuestionIndex];
									$scope.quescount = $scope.markedQuestion[$scope.markedQuestionIndex] + 1;
									$scope.prevButton = false;
								}
								else{
									$scope.questionId = 0;
									$scope.quescount = 1;
								}
								$scope.totalcount = $scope.testResults.length;
								$scope.mapOption();
							}
						});

				}
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
								console.log($scope.question);
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

			$scope.playAudio = function(id) {
			    var audio = document.getElementById(id);
				if(!$scope.stop){
			    	audio.play();
			    	$scope.audioClass = 'fa-stop-circle';
					$scope.stop = true;
					audio.onended = function() {
						audio.pause();
						$scope.audioClass = 'fa-play-circle';
						audio.currentTime = 0;
						$scope.stop = false;
					};
				} else {
					audio.pause();
					$scope.audioClass = 'fa-play-circle';
					audio.currentTime = 0;
					$scope.stop = false;
				}
			};

			$scope.playOption1 = function(id) {
			    var audio = document.getElementById(id);
				if(!$scope.stopOption1){
			    	audio.play();
			    	$scope.audioClass = 'fa-stop-circle';
					$scope.audioPlay = true;
			    	$scope.stopOption1 = true;
					audio.onended = function() {
						audio.pause();
						$scope.audioClass = 'fa-play-circle';
						$scope.audioPlay = false;
						audio.currentTime = 0;
						$scope.stopOption1 = false;
					};
				} else {
					audio.pause();
					$scope.audioClass = 'fa-play-circle';
					$scope.audioPlay = false;
					audio.currentTime = 0;
					$scope.stopOption1 = false;
				}
			};

			$scope.playOption2 = function(id) {
			    var audio = document.getElementById(id);
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
			    var audio = document.getElementById(id);
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

			// $scope.testResults = [];
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
            	//$scope.quescount++;
				$scope.stop = false;
				$scope.stopOption1 = false;
				$scope.stopOption2 = false;
				$scope.stopOption3 = false;
				console.log(testConfig.type);
				if(testConfig.type != 'realtime' && $scope.form.choice == ''){
					$scope.selectoption = true;
				}else{
					$scope.selectoption = false;
					$scope.animatedClass = 'slideOutLeft';
	                $scope.optionResult = {};
	                $scope.optionDisabled = false;
	                $scope.stop = false;
	                $scope.audioClass = 'fa-play-circle'
	                saveAnswer();
	                $scope.questionId++;
	                $scope.question = $scope.test[$scope.questionId];
	                $scope.form.choice = '';
					if ($scope.markedQuestionIndex != -1) {
						$scope.markedQuestionIndex++;
						if($scope.markedQuestion.length !== $scope.markedQuestionIndex){
							$scope.questionId = $scope.markedQuestion[$scope.markedQuestionIndex];
							$scope.quescount = $scope.markedQuestion[$scope.markedQuestionIndex];
							$scope.question = $scope.test[$scope.questionId];
						}else{
							$scope.questionId = $scope.test.length;
						}
						if($scope.markedQuestionIndex == 0){
							$scope.prevButton = false;
						}else{
							$scope.prevButton = true;
						}
					}
					if ($scope.test.length  !== $scope.questionId) {
						$scope.quescount++;
	                    $scope.getQuestion();
						$scope.mapOption();
	                } else {
	                	if (testConfig.test !== 'realtime') {
	                		popupMsg = 'You have reached end of practice. Click Ok to continue...';
	                		$scope.showAlert(popupMsg);
	                		$scope.finishTest();
	                	} else {
	                		popupMsg = 'You have reached end of the test... Click to see the result';
	                		//$scope.showConfirm(popupMsg);
							// $scope.loader = true;
							// $scope.okpop_finish = true;
							var data = {
			                	category: settings.category,
			                	result: $scope.testResults,
								test: $scope.test
			                };
							console.log(data);
							$window.localStorage.setItem('reviewOption',  JSON.stringify(data));
							$scope.showReview = true;
							// $scope.viewResults();

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
                saveAnswer();
                $scope.questionId--;
                $scope.question = $scope.test[$scope.questionId];
                $scope.form.choice = '';
				if ($scope.markedQuestionIndex != -1) {
					if ($scope.markedQuestionIndex != 0) {
						$scope.markedQuestionIndex--;
						if($scope.markedQuestionIndex != -1){
							$scope.questionId = $scope.markedQuestion[$scope.markedQuestionIndex];
							$scope.quescount = $scope.markedQuestion[$scope.markedQuestionIndex];
							$scope.question = $scope.test[$scope.questionId];
							$scope.quescount = $scope.quescount + 2;
						}
						if($scope.markedQuestionIndex > 0){
							$scope.prevButton = true;
						}else{
							$scope.prevButton = false;
						}
					}
				}
				if ($scope.test.length  !== $scope.questionId) {
					$scope.quescount--;
                    $scope.getQuestion();
					$scope.mapOption();
                } else {
                	if (testConfig.test !== 'realtime') {
                		$scope.finishTest();
                	} else {
						// $scope.loader = true;
						// $scope.okpop_finish = true;
						$scope.showReview = true;
						// $scope.viewResults();
                	}
                }
            };

            // $window.onbeforeunload = function () {
            //
	        //     $scope.leftQuestions = [];
	        //     console.log(testOptions.category);
			// 	if (testOptions.category !== 'realtime'){
            //
			// 	  	if ($scope.quescount > $scope.testResults.length) {
			// 		 	if (!$scope.testResults.length){
			// 				$scope.count = 0
			// 			} else {
			// 				$scope.count = $scope.quescount;
			// 			}
            //
			// 			$scope.answerCount = 0;
            //
			// 			angular.forEach($scope.test, function(key,value){
			// 				if ($scope.answerCount >= $scope.count){
			// 					var qustion = $scope.test[$scope.answerCount];
			// 					var questions = {
			// 						user_id : $scope.user_id,
			// 						questionId : qustion.id,
			// 						category : $scope.titlecategory,
			// 						time : $scope.timer
			// 					}
			// 					console.log(questions);
			// 					$scope.leftQuestions.push(questions);
			// 				}
			// 				$scope.answerCount = $scope.answerCount + 1;
			// 				});
            //
			// 			if ($scope.leftQuestions.length){
			// 				$http({
			// 	                method: 'POST',
			// 	                url: '/api/question/questionstate',
			// 	                data: $scope.leftQuestions
			// 	                })
			// 	            .success(function(response) {
			// 	                if (response.success) {
			// 						console.log('success');
			// 	                }
			// 	            })
			// 	            .error(function(response) {
			// 	                console.log('fail');
			// 	            });
			// 			}
			// 	   	}
			//     } else{
			//     	console.log('realtime');
			// 	}
            //
			// };
            //
            // $scope.viewResults = function() {
            //     $scope.loader = true;
            //     disableTimer();
            //     clearShowInstruction (0);
            //
            //     var data = {
            //     	category: settings.category,
            //     	result: $scope.testResults
            //     };
            //     $http({
            //         method: 'POST',
            //         url: '/api/question/testcomplete',
            //         data: data
            //     })
            //     .success(function(response, status, headers, config) {
            //         if (response.success) {
            //             // $uibModalInstance.close('testdone');
            //             // $scope.showAlert(popupMsg);
			// 			var popupWin = window.location.origin + '/site/testprint?id='+response.data+"&lang="+$window.localStorage.getItem('user_lang');
			// 			var id = response.data;
			// 			location.href = popupWin;
			// 			//$http.post('/api/user/logout')
			// 			$http.post('/api/user/logout?id='+$scope.user_id)
			// 			.success(function(response) {
			// 				if (response.success) {
			// 					Authentication.user = null;
			// 					$window.localStorage.removeItem('test-category');
			// 					$window.localStorage.removeItem('test');
			// 				}
			// 			});
            //         }
            //         //$uibModalInstance.close('testdone');
            //     })
            //     .error(function(response, status, headers, config) {
            //         $uibModalInstance.close('testdone');
            //     });
            // }
            //
			// $scope.closeAlert = function(){
			// 	$scope.selectoption = false;
			// }
            //
            // $scope.showAlert = function(msg) {
            //    $mdDialog.show(
            //       $mdDialog.alert()
            //          .parent(angular.element(document.querySelector('#dialogContainer')))
            //          .clickOutsideToClose(false)
            //          .title()
            //          .textContent(msg)
            //          .ariaLabel('Belhasa Driving Center')
            //          .ok('Ok!')
            //          //.targetEvent()
            //    );
            // };
            //
            // $scope.showConfirm = function(msg) {
            //    var confirm = $mdDialog.confirm()
            //       .title()
            //       .textContent(msg)
            //       .ariaLabel('Belhasa Driving Center')
            //       .targetEvent(event)
            //       .ok('Yes')
            //       .cancel('No');
            //       $mdDialog.show(confirm).then(function() {
            //          $scope.status = 'Record deleted successfully!';
            //          //$scope.viewResults();
            //          }, function() {
            //             $scope.status = 'You decided to keep your record.';
            //       });
            // };
            //
            // function clearShowInstruction (instruction){
            // 	$http.get('/api/user/clearinsruction?id=' + $scope.user.id+'&show_instruction='+instruction)
			// 		.success(function(response, status, headers, config) {
			// 			// $scope.loader = false;
			// 			if (response.success) {
			// 				console.log('success');
			// 			}
			// 		})
			// 		.error(function(response, status, headers, config) {
			// 			// $scope.loader = false;
			// 			console.log('fail');
			// 		});
            // }
		}
	]);
