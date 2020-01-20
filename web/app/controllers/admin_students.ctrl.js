'use strict';
/**
 * @name AdminStudent controllers
 */
angular.module(module)
	.controller('AdminStudentController', [
		'$scope', 'Authentication', '$http', '$stateParams', '$state', '$uibModal',
		function($scope, Authentication, $http, $stateParams, $state, $uibModal) {
			// Styles Adjustments
			$('body').attr('style', 'background-color:none;');

			$scope.loadStudents = function() {
				$scope.loader = true;
				$http.get('/api/user/getall')
					.success(function(response, status, headers, config) {
						$scope.loader = false;
						if (response.success) {
							$scope.students = response.data;
						}
					})
					.error(function(response, status, headers, config) {
						$scope.loader = false;
					});
			};

			$scope.viewStudent = function(data) {
				$state.go('app.students_profile', {id: data.id});
			};

			$scope.activateUser = function(student) {
				$http({
					method: 'PUT',
					url: '/api/user/activate',
					data: {id: student.id}
				})
				.success(function(response, status, headers, config) {
					student.status = !student.status;
				})
				.error(function(response, status, headers, config) {});
			};

			$scope.loadStudentById = function() {
				$scope.loader = true;
				$http({
					method: 'GET',
					url: '/api/user/getbyid?id=' + $stateParams.id
				})
				.success(function(response, status, headers, config) {
					$scope.loader = false;
					if (response.success) {
						$scope.student = response.data;
					} else {
						console.log(response.message);
					}
				})
				.error(function(response, status, headers, config) {
					$scope.loader = false;
				});
			};

			$scope.restPassword = function() {
				$scope.data.id = $stateParams.id;
				$http({
					method: 'POST',
					url: '/api/user/resetpassword',
					data: $scope.data
				})
				.success(function(response, status, headers, config) {
					if (response.success) {
						// $scope.student = response.data;
						$scope.enablePassword(false);
						$scope.passwordSuccessAlert = true;
					} else {
						console.log(response.message);
					}
				})
				.error(function(response, status, headers, config) {
					$scope.loader = false;
				});
			};

			$scope.enablePassword = function(option) {
				$scope.data = {};
				$scope.pwdFlag = option;
			};

			$scope.closeAlert = function() {
				$scope.passwordSuccessAlert = false;
			};

			// Edit view
			$scope.editView = false;

			$scope.enableEdit = function(option) {
				$scope.user = angular.copy($scope.student);
				$scope.user.dob = new Date(Date.parse($scope.user.dob));
				$scope.editView = option;
			};

			// Time Picker
			$scope.popup1 = {
				opened: false
			};
			$scope.openPicker = function() {
			    $scope.popup1.opened  = true;
			};

			$scope.updateInfo = function() {
				var data = $scope.user.dob;
				var dob = data.getFullYear() + '-';
				dob += ('0' + (data.getMonth() + 1)).slice(-2);
				dob += '-' + ('0' + (data.getDate())).slice(-2);
				$scope.user.dob = dob;
				$http({
						method: 'POST',
						url: '/api/user/update?id=' + $scope.user.id,
						data: $scope.user
					})
					.success(function(response) {
						if (response.success) {
							Authentication.user = $scope.user;
							$scope.student = Authentication.user;
							$scope.enableEdit(false);
						}
					})
					.error(function(response) {
						console.log(response);
					});
			};

			$scope.uploadPhoto = function() {
				var modal = $uibModal.open({
					templateUrl: '/app/templates/upload_photo.tpl.html',
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
		}
	]);