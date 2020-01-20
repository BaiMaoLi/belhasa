'use strict';

angular.module(module)
	.controller('LoginController', [
		'$scope', '$location', '$http', '$state', 'Authentication', '$timeout',
		function($scope, $location, $http, $state, Authentication, $timeout) {
			// style adjustments
			$('body').attr('style', 'background-color:#F7F7F7;');
			$scope.user = {};

			// page navigation
			$scope.showPage = function(pagename) {
				$scope.page = pagename;
				$scope.user = {};
				$scope.error = null;

				if (pagename === 'register') {
					$scope.user = {
						gender: 'Male',
						maritalStatus: 'Single',
						photo: ''
					};

					$scope.nextPage('account');
				}
			};

			$scope.nextPage = function(page) {
				$scope.registerPage = page;
			};

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

			// login
			$scope.login = function() {
				$scope.showLoader = true;
				$http({
					method: 'POST',
					url: '/api/user/login',
					data: $scope.user
				})
				.success(function(response, status, header, config) {
					$scope.showLoader = false;
					if (response.success) {
						Authentication.user = response.data;
						$state.go('app');
					} else {
						$scope.error = 'Username / Password is Incorrect';
					}
				})
				.error(function(data, status, header, config) {
					$scope.showLoader = false;
					$scope.error = 'Username / Password is Incorrect';
				});
			};

			// Register a new user
			$scope.register = function() {
				$scope.user._csrf = csrf;
				$scope.showLoader = true;
				$scope.user.dateofbirth = ($scope.user.dob).getFullYear() + '-' + ($scope.user.dob).getMonth() + '-' + ($scope.user.dob).getDate();				
				$http({
						method: 'POST',
						url: '/api/user/register',
						data: $scope.user, 
					})
					.success(function(response, status, header, config) {
						$scope.showLoader = false;
						if (response.success) {
							if (response.message) {
								$scope.showPage('register');
								$scope.error = response.message;
							} else {
								Authentication.user = response.data;
								$state.go('app');
							}
						} else {
							$scope.error = 'Unable to create an Account. Please contact Administrator.';
						}
					})
					.error(function(data, status, header, config) {
						$scope.showLoader = false;
						$scope.error = 'Unable to create an Account. Please contact Administrator.';
					});
			};

			$scope.showPage(($location.path()).substr(1));


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
		}
	]);