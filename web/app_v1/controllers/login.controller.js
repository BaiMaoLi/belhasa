'use strict';
/**
 * @name LoginController
 */
angular
	.module(module)
	.controller('LoginController', [
		'$scope',
		'$state',
		'$http',
		'$location',
		'$timeout',
		'$translate',
		'$window',
		'Authentication',
		function($scope, $state, $http, $location, $timeout, $translate, $window, Authentication) {
			$('body').attr('style', 'background-color:#F7F7F7;');
			$scope.user = {};
			$scope.page = 'account';
			$scope.loader = false;
			$window.localStorage.removeItem('reload_logout');
			$window.localStorage.clear();

			$scope.closeAlert = function() {
				$scope.error = false;
				$scope.success = false;
			};

			$scope.login = function() {
				$scope.showLoader = true;
				$http({
					method: 'POST',
					url: 'api/user/studentlogin',
					data: $scope.user
				})
				.success(function(response) {
					$scope.showLoader = false;
					if (response.success) {
						Authentication.user = response.data;
						$window.localStorage.setItem('admin_id', response.admin_id);
						$state.go('customize');
					} else {
						$scope.user = {};
						$scope.error = 'Username / Passcode is Incorrect';
					}
				})
				.error(function(response) {
					$scope.showLoader = false;
					$scope.error = 'Unable to fetch User Information';
				});
			};

			$scope.nextPage = function(page) {
				$scope.error = false;
				if ($scope.user.password !== $scope.user.confirmPassword) {
					$scope.error = 'Passwords doesn\'t match';
				} else {
					$scope.page = page;
				}
			};


			// Register
			if (($location.path()).substr(1) === 'register') {
				$scope.user = {
						gender: 'Male',
						maritalStatus: 'Single',
						photo: ''
					};
			}
			$scope.instanLogin = function(flag) {
				$scope.showAdmin = flag;
			};

			// Time Picker
			$scope.popup1 = {
				opened: false
			};
			$scope.openPicker = function() {
			    $scope.popup1.opened  = true;
			};

			// Image Selection
			$scope.myImage='';
			$scope.myCroppedImage='';

			var handleFileSelect=function(evt) {
				var file=evt.currentTarget.files[0];
				var reader = new FileReader();
				reader.onload = function (evt) {
					$scope.$apply(function($scope){
						$scope.myImage=evt.target.result;
					});
				};
				reader.readAsDataURL(file);
			};

			$scope.initImage = function() {
				angular.element(document.querySelector('#fileInput')).ready(function() {
					$timeout(function() {
						angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
					}, 1000);
				});
			};

			$scope.register = function() {
				$scope.loader = true;
				$http({
					method: 'POST',
					url: 'api/user/register',
					data: $scope.user
				})
				.success(function(response) {
					$scope.loader = false;
					$scope.page = 'account';
					if (response.success) {
						$scope.user = {
							gender: 'Male',
							maritalStatus: 'Single',
							photo: ''
						};
						if (response.message) {
							$scope.success = true;
						} else {
							Authentication.user = response.data;
							$state.go('customize');
						}
					} else {
						$scope.error = true;
					}
				})
				.error(function(response) {
					$scope.loader = false;
					$scope.error = 'Unable to process your request!';
				})

				$scope.error = 'Unable to create account';
			};

			$scope.adminLogin = function() {
				$scope.showLoader = true;
				$http({
					method: 'POST',
					url: 'api/user/login',
					data: $scope.user
				})
				.success(function(response) {
					$scope.showLoader = false;
					if (response.success) {
						Authentication.user = response.data;
						// $state.go('customize');
						$scope.translate();
					} else {
						$scope.user = {};
						$scope.error = 'Email / Password is Incorrect';
					}
				})
				.error(function(response) {
					$scope.showLoader = false;
					$scope.error = 'Unable to fetch User Information';
				});
			};

			$scope.translate = function() {
				$scope.showLoader = true;
				$window.localStorage.setItem('user_lang', "en-en");
				var data = {
					code: "en-en"
				};
				$http({
					url: 'api/user/language',
					method: 'POST',
					data: data
				})
				.success(function(response) {
					$scope.showLoader = false;
					$translate.use("en-en");
					next();
				})
				.error(function(response) {
					$scope.showLoader = false;
				});
			};

			function next() {
				if($window.localStorage.getItem('user_lang') == "ar-ar" || $window.localStorage.getItem('user_lang') == "fa-fa" || $window.localStorage.getItem('user_lang') == "ur-ur" ){
					$window.localStorage.setItem('reload_lang', 1);
				}
				$state.go('app');
			}
		}
	]);
