'use strict';
/**
 * @name HomeController
 */
angular.module(module)
	.controller('ProfileController', [
		'$scope', 'Authentication', '$rootScope', '$http', '$state', '$stateParams', '$uibModal',
		function($scope, Authentication, $rootScope, $http, $state, $stateParams, $uibModal) {
			// Styles Adjustments
			$('body').attr('style', 'background-color:none;');

			var newdate = new Date();
			newdate.setFullYear(newdate.getFullYear() - 18);

			$scope.date_valid = {
			    startDate: new Date(newdate),
			    endDate: new Date()
			};
			$scope.student = Authentication.user;

			$scope.editView = false;

			if($scope.student.dob != null){
				$scope.enableDob = 1;
			}else{
				$scope.enableDob = 0;
				$scope.student.dob = '';
			}

			$scope.enableEdit = function(option) {
				$scope.user = angular.copy($scope.student);
				//$scope.user.dob = new Date(Date.parse($scope.user.dob));
				if($scope.user.dob != ''){
					$scope.enableDob = 1;
					$scope.user.dob = new Date(Date.parse($scope.user.dob));
					console.log($scope.user.dob);
				}else{
					$scope.enableDob = 0;
					$scope.user.dob = '';
				}
				$scope.editView = option;
			};

			// Time Picker
			$scope.popup1 = {
				opened: false
			};
			$scope.openPicker = function() {
			    $scope.popup1.opened  = true;
			};

			$scope.EnableDobAdd = function(){
				var newdate = new Date();
				newdate.setFullYear(newdate.getFullYear() - 18);
				$scope.user.dob = new Date(Date.parse(newdate));
				$scope.enableDob = 1;
				$scope.openPicker();
			};

			$scope.updateUser = function() {
				if($scope.user.dob){
					var data = $scope.user.dob;
					var dob = data.getFullYear() + '-';
					dob += ('0' + (data.getMonth() + 1)).slice(-2);
					dob += '-' + ('0' + (data.getDate())).slice(-2);
					$scope.user.dob = new Date(dob);
				}else{
					$scope.user.dob = '';
				}

				$http({
						method: 'POST',
						url: '/api/user/update?id=' + $scope.user.id,
						data: $scope.user
					})
					.success(function(response) {
						if (response.success) {
							Authentication.user = $scope.user;
							$scope.student = Authentication.user;
							$rootScope.user = $scope.user;
							if(response.data.dob){
								var data = new Date(response.data.dob);
								var dob = data.getFullYear() + '-';
								dob += ('0' + (data.getMonth() + 1)).slice(-2);
								dob += '-' + ('0' + (data.getDate())).slice(-2);
								$scope.student.dob = dob;
								$scope.enableEdit(false);
							}else{
								$scope.student.dob = "";
								$scope.enableEdit(false);
							}

						}
					})
					.error(function(response) {
						alert("testing");
						console.log(response);
					});
			};


			$scope.myImage='';
	        $scope.myCroppedImage='';

	        $scope.uploadPhoto = function() {
				var modal = $uibModal.open({
					templateUrl: '/app_v1/templates/upload_photo.tpl.html',
					controller: 'UploadController',
					size: 'lg',
					backdrop: 'static',
					keyboard: false,
					resolve: {
						testOptions: function () {
							return {};
						}
					}
				});

				modal.result.then(function(data) {
					$scope.user.photo = data;
				}, function(data) {
					// console.log(data);
				});
			};

			$scope.resetPassword = function() {

				//$scope.errorMessage = "New passwords are mismatch.. Please check your Input";

				if($scope.data.newPassword === $scope.data.confirmPassword) {
					$scope.data.id = $scope.student.id;
					$http({
						method: 'POST',
						url: '/api/user/resetpassword',
						data: $scope.data
					})
					.success(function(response, status, headers, config) {
						if (response.success) {
							$scope.enablePassword(false);
							$scope.passwordSuccessAlert = true;
						} else {
							console.log(response.message);
							if (response.message == 'Incorrect user') {
								$scope.errorMessage = "Incorrect current password.. Please check your Input"
								$scope.passwordErrorAlert = true;
								$scope.data = {};
							}
							if (response.message == 'Passcode already exists. Please, try a different passcode') {
								//$scope.errorMessage = "Passcode already exists. Please, try a different passcode"
								$scope.passwordErrorAlert_exists = true;
								$scope.data = {};
							}
						}
					})
					.error(function(response, status, headers, config) {
						$scope.loader = false;
					});
				} else {
					$scope.passwordErrorAlert = true;

					$scope.data = {};
				}
			};

			$scope.enablePassword = function(option) {
				$scope.data = {};
				$scope.pwdFlag = option;
			};

			$scope.closeAlert = function() {
				$scope.passwordSuccessAlert = false;
				$scope.passwordErrorAlert = false;
				$scope.passwordErrorAlert_exists = false;

			};


		}
	]);
