'use strict';
/**
 * @name CustomizeController
 */
angular.module(module)
	.controller('HomeController', [
		'$scope',
		'$state',
		'$timeout',
		'Authentication',
		'$http',
		'$translate',
		'$rootScope',
		'$uibModal',
		'$window', '$mdDialog',
		function($scope, $state, $timeout, Authentication, $http, $translate, $rootScope, $uibModal, $window, $mdDialog) {
			// Styles Adjustments
			$('body').attr('style', 'background-color:none;');

			$scope.blocked = 'cursor: no-drop;';
			$scope.testTime = '';
			var popupMsg = '';
			$scope.user = Authentication.user;
			$scope.user_id = $scope.user.id;
			$scope.mockTest = true;
			$scope.userCount = 0;
			$scope.userRequests = 0;
			$scope.questionsCount = 0;
			$scope.testCount = 0;
			$scope.testOptions = {};
			$scope.categories = [];//['LMV', 'MC', 'HVT and LB', 'FRLK', 'Instructor'];
			$scope.timer = '00:00:00';
			$scope.okpop = false;
			$scope.popreload = false;

			$http.get('/api/category/getall')
				.success(function(response) {
					if (response.success) {
						var arr = [];
						angular.forEach(response.data, function(value, key) {
							arr.push(value.name);
						});
						$scope.categories = arr;
					}
				})
				.error(function(response) {
				});
			$scope.instruction_time = $scope.user.show_instruction;
			$rootScope.$on('language-changed', function(event, data) {
				$scope.userLanguage = data;
			});

			if($window.localStorage.getItem('reload_lang') == 1){
				$window.localStorage.setItem('reload_lang', 0);
				$window.localStorage.setItem('home_reload', 2);
				$window.location.reload();
			}else{
				if($scope.user.isAdmin == 0){
					$window.localStorage.setItem('home_reload', 1);
				}
				// $window.localStorage.setItem('home_reload', 1);
			}

			if($window.localStorage.getItem('reload_logout') == 1){
				$window.localStorage.setItem('reload_logout', 0);
				$window.localStorage.setItem('home_reload', 0);
				$window.location.reload();
			}

			if ($scope.user.resume_test) {
				$scope.showpopup=1;
			}

			// share disableTimer() function between controllers
			$rootScope.$on('DisableTimer', function() {
				disableTimer();

			});

			// load assets
			$scope.loadCounts = function() {
				if ($scope.user.isAdmin) {
					// user counts
					$http.get('/api/count/user')
						.success(function(response, status, headers, config) {
							if (response.success) {
								$scope.userCount = response.data;
							}
						});

					// user requests
					$http.get('/api/count/user?field=status&value=0')
						.success(function(response, status, headers, config) {
							if (response.success) {
								$scope.userRequests = response.data;
							}
						});

					// questions
					$http.get('/api/count/questions')
						.success(function(response, status, headers, config) {
							if (response.success) {
								$scope.questionsCount = response.data;
							}
						});

					// tests
					$http.get('/api/count/tests')
						.success(function(response, status, headers, config) {
							if (response.success) {
								$scope.testCount = response.data;
							}
						});
				} //else if($scope.timer != '00:00:00' && Authentication.timer != '00:00:00') {
				else if($scope.user.time != '00:00:00') {
					enableTimer();

				} else if($scope.user.time == '00:00:00' && $scope.user.resume_test) {
					enableTimer();
					console.log('enable timer');
				}
			};

			$scope.isTestComplete = function() {
				var settings = JSON.parse(window.localStorage.getItem('test-category'));
				$http.get('/api/question/testiscomplete?category=' + settings.category)
					.success(function(response) {
						if (response.success) {
							//$scope.blocked = 'cursor: no-drop';
							$scope.blocked = '';
						} else {
							$scope.blocked = '';
						}
					})
					.error(function(response) {
						$scope.blocked = 'cursor: no-drop';
					});
			};


			$scope.loadTestconfig =  function() {
				var settings = JSON.parse(window.localStorage.getItem('test-category'));
				//$http.get('/api/count/testconfig')
				$http.get('/api/count/testconfig?category='+settings.category)
					.success(function(response) {
						if (response.success) {
							$scope.items = response.data;
							$scope.testConfig = response.data;
						}
					})
					.error(function(response) {});
			};

			var config;
			$scope.editConfig = function(flag, item, $index) {
				if (item) {
					config = $index;
					$scope.configItem = angular.copy(item);
				}
				$scope.editView = flag;
			};

			$scope.saveTestConfig = function() {
				$scope.errorMsg = "Required number of answers should not exceed the total number of questions";
				if (($scope.configItem.noofspecificquestion >= $scope.configItem.noofreqspecificanswer)
					&& ($scope.configItem.noofcommonquestion >= $scope.configItem.noofreqcommonanswer)) {
					$http({
						method: 'POST',
						url: '/api/count/testconfigsave',
						data: $scope.configItem
					})
					.success(function(response) {
						if (response.success) {
							$scope.items[config] = $scope.configItem;
							$scope.editConfig(false);
						}
					})
					.error(function(response) {});
				} else {
					$scope.questionErrorAlert = true;
					console.log("error caught");
					$scope.data = {};
				}
			};

			$scope.choosePractise = function() {
				// $scope.practiseTest = true;
				// $scope.mockTest = false;
				// enableTimer();
				$scope.okpop = true;
			};

			$scope.MsgOk = function(){
				$scope.okpop = false;
				$scope.practiseTest = true;
				$scope.mockTest = false;
				enableTimer();
			}

			$scope.startTest = function() {
				$scope.resetDisplay();				
				var  config = $scope.testConfig[0];
				openTest(config);
			};


			// $scope.startTest = function() {
			// 	if (!$scope.blocked) {
			// 		$scope.resetDisplay();
			// 		var  config = $scope.testConfig[0];
			// 		openTest(config);
			// 	} else {
			// 		$scope.testError = 'You already took this test!';
			// 	}
			// };

			$scope.choosePractiseTest = function(type) {
				var config;
				if (type === 'common') {
					config = $scope.testConfig[1];
				} else if (type === 'specific') {
					config = $scope.testConfig[2];
				}
				Authentication.timer = $scope.timer;

				openTest(config);
			};

			//show resume test popup
			if ($scope.user.resume_test) {
					var instruction = $uibModal.open({
						templateUrl: '/app_v1/templates/resume_test_popup.tpl.html',
						controller: 'ResumeTestController',
						size: 'lg',
						backdrop: 'static',
						keyboard: false,
						resolve: {
							testOptions: function () {
								return config;
							}
						}
					});
					instruction.result.then(function(data) {
					//open(config);
						$scope.resetDisplay();
						$scope.testSuccess = true;
					}, function(data) {
						// console.log(data);
						$scope.resetDisplay();
						if (data == "ok") {
							open(config);
							//$scope.testError = data;
						} else {
							//$scope.testError = 'Test has been terminated due to user\'s interupt!';
							$scope.testError = data;
						}
					});
				}
			function openTest(config) {
				if (config['noofquestion']>0 && $scope.instruction_time) {
					$scope.instruction_time = 0;
					clearShowInstruction(1);
					var instruction = $uibModal.open({
						templateUrl: '/app_v1/templates/instruction.tpl.html',
						controller: 'InstructionController',
						size: 'lg',
						backdrop: 'static',
						keyboard: false,
						resolve: {
							testOptions: function () {
								return config;
							}
						}
					});
					instruction.result.then(function(data) {
					//open(config);
						$scope.resetDisplay();
						$scope.testSuccess = true;
					}, function(data) {
						$scope.resetDisplay();
						if (data == "ok") {
							open(config);
							//$scope.testError = data;
						} else {
							//$scope.testError = 'Test has been terminated due to user\'s interupt!';
							$scope.testError = data;
						}
					});
				} else if(config['noofquestion']>0){
					var modal = $uibModal.open({
						templateUrl: '/app_v1/templates/tests.tpl.html',
						controller: 'TestController',
						size: 'lg',
						backdrop: 'static',
						keyboard: false,
						resolve: {
							testOptions: function () {
								return config;
							}
						}
					});

					modal.result.then(function(data) {
						$scope.resetDisplay();
						var settings = JSON.parse(window.localStorage.getItem('test-category'));
						$http.get('/api/count/testconfig?category='+settings.category)
						.success(function(response) {
							if (response.success) {
								$scope.items = response.data;
								$scope.testConfig = response.data;
								$scope.testTime = response.data[1];
								//feature = new Date(date.getTime() + (parseInt($scope.testTime.duration)*60000));
							}
						})
						.error(function(response) {});
						$scope.testSuccess = true;
						}, function(data) {
							$scope.resetDisplay();
							if (data) {
								$scope.testError = data;
							} else {
								$scope.testError = 'Test has been terminated due to user\'s interupt!';
							}
						});
					}else {
						$scope.testError = 'There is no tests available for this category.';
					}
			};

			function open(config){
				var modal = $uibModal.open({
					templateUrl: '/app_v1/templates/tests.tpl.html',
					controller: 'TestController',
					size: 'lg',
					backdrop: 'static',
					keyboard: false,
					resolve: {
						testOptions: function () {
							return config;
						}
					}
				});

				modal.result.then(function(data) {
					$scope.resetDisplay();
					var settings = JSON.parse(window.localStorage.getItem('test-category'));
					$http.get('/api/count/testconfig?category='+settings.category)
					.success(function(response) {
						if (response.success) {
							$scope.items = response.data;
							$scope.testConfig = response.data;
							$scope.testTime = response.data[1];
							//feature = new Date(date.getTime() + (parseInt($scope.testTime.duration)*60000));
						}
					})
					.error(function(response) {});
					$scope.testSuccess = true;
				}, function(data) {
					$scope.resetDisplay();
					if (data) {
						$scope.testError = data;
					} else {
						$scope.testError = 'Test has been terminated due to user\'s interupt!';
					}
				});
			};

			$scope.resetDisplay = function() {
				$scope.practiseTest = false;
				$scope.closeAlert();
			};


			$scope.closeAlert = function() {
				$scope.testError = false;
				$scope.testSuccess = false;
			};
			var interval;
			function disableTimer() {
				clearShowInstruction(0);
				//$window.localStorage.setItem('test',true);
				if (interval) {
					clearInterval(interval);
				}
			}
			function enableTimer() {
				var date = new Date();
				var feature = '';
				var settings = JSON.parse(window.localStorage.getItem('test-category'));


				if ($scope.user.time == '00:00:00' && !$scope.user.resume_test) {
					console.log('first time');
					Authentication.timer = $scope.user.time;
					$http.get('/api/count/testconfig?category='+settings.category)
					.success(function(response) {
						if (response.success) {
							$scope.items = response.data;
							$scope.testConfig = response.data;
							$scope.testTime = response.data[1];
							feature = new Date(date.getTime() + (parseInt($scope.testTime.duration)*60000));
						}
					})
					.error(function(response) {});
				} else if ($scope.user.resume_test) {
					console.log('If resume test');
					if ($scope.user.time != '00:00:00') {
						// console.log('reload while takeing test');

						var timeArr = $scope.user.time.split(':');
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
						//console.log(mins);
						feature = new Date(date.getTime() + (mins*60000));
					} else if ($scope.user.time == '00:00:00') {
						console.log('test questions not completed');
						//feature = new Date(date.getTime() + (mins*60000));
						$http.get('/api/count/testconfig?category='+settings.category)
						.success(function(response) {
							if (response.success) {
								$scope.items = response.data;
								$scope.testConfig = response.data;
								$scope.testTime = response.data[1];
								feature = new Date(date.getTime() + (parseInt($scope.testTime.duration)*60000));
							}
						})
						.error(function(response) {});
					} else {
						console.log('else state');
					}
				} else if ($scope.user.time != '00:00:00' && !$scope.user.resume_test) {
					console.log('taking test second or multiple time');
					//var timeArr = Authentication.timer.split(':');
					if (isNaN($scope.timer != '00:00:00') ||  Authentication.timer != '00:00:00') {
						if (isNaN($scope.timer != '00:00:00')) {
							var timeArr = $scope.timer.split(':');
						} else if (Authentication.timer != '00:00:00') {
							var timeArr = Authentication.timer.split(':');
						}
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
						//console.log(mins);
						feature = new Date(date.getTime() + (mins*60000));
					} else  {
						console.log('nowhere');
						if ($scope.user.time != '00:00:00') {
							var timeArr = $scope.user.time.split(':');
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
							//console.log(mins);
							feature = new Date(date.getTime() + (mins*60000));
						} else {
							$http.get('/api/count/testconfig?category='+settings.category)
							.success(function(response) {
								if (response.success) {
									$scope.items = response.data;
									$scope.testConfig = response.data;
									$scope.testTime = response.data[1];
									feature = new Date(date.getTime() + (parseInt($scope.testTime.duration)*60000));
								}
							})
							.error(function(response) {});
						}
						// $http.get('/api/count/testconfig?category='+settings.category)
						// .success(function(response) {
						// 	if (response.success) {
						// 		$scope.items = response.data;
						// 		$scope.testConfig = response.data;
						// 		$scope.testTime = response.data[1];
						// 		feature = new Date(date.getTime() + (parseInt($scope.testTime.duration)*60000));
						// 	}
						// })
						// .error(function(response) {});
					}

				} else {
					console.log('else state');
					var feature = new Date(date.getTime() + (mins*60000));
				}
				interval = setInterval(function() {
					var diff = Math.floor (feature .getTime() - new Date().getTime()) / 1000;
					//console.log(diff);
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
						//$window.localStorage.setItem('popup',true);
						//disableTimer();

						console.log('inside timer 00:00:00');
						$scope.$apply(function() {
							$scope.testExpiry = true;
						}, true);
						disableTimer();
						popupMsg = 'Time over for practice test! Click OK to log out';
						$scope.showAlert(popupMsg);
						//set timer to 00:00:00
						$http.post('api/question/updatetime?id='+$scope.user_id+'&time='+$scope.timer)
						.success(function(response){
						});

						//logout when time is up
						$http.post('/api/user/logout?id='+$scope.user_id)
							.success(function(response) {
								if (response.success) {
									Authentication.user = null;
									$window.localStorage.removeItem('test-category');
									$window.localStorage.removeItem('test');
									$window.localStorage.removeItem('resume');
									$window.localStorage.removeItem('popup');
									$window.localStorage.clear();
									$state.go('login');
								}
							});
					}
				}, 1000);
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

            $window.onbeforeunload = function(){
            	if ($scope.timer !== '00:00:00') {
            		// return 'Do you want to reload?';
            		console.log('inside home page');
            		Authentication.timer = $scope.timer;
            		console.log('home_reload');
            		console.log($window.localStorage.getItem('home_reload'));
            		if ($window.localStorage.getItem('home_reload') != 2){
            			console.log('inside condition');
            			$window.localStorage.setItem('home_reload', 1);
            		}
            		$http.post('api/question/updatetime?id='+$scope.user_id+'&time='+Authentication.timer)
					.success(function(response){
					});
            	}

            };

			$scope.popreloadcancel = function(){
				$scope.popreload = false;
			};

            function clearShowInstruction (instruction){
            	$http.get('/api/user/clearinsruction?id=' + $scope.user.id+'&show_instruction='+instruction)
					.success(function(response, status, headers, config) {
						$scope.loader = false;
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
