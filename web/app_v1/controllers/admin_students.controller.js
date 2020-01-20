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
			$scope.user = {};

			var newdate = new Date();
			newdate.setFullYear(newdate.getFullYear() - 18);
			$scope.logUser = Authentication.user;
			$scope.user = {};//Authentication.user;
			$scope.newStudent = {
				isAdmin: 0
			};
			$scope.search = {};
			$scope.filtered = {};
			$scope.add_dob = 0;
			$scope.date_valid = {
			    startDate: new Date(newdate),
			    endDate: new Date()
			};

			$scope.success = $stateParams.save;

			$scope.loadCategory = function(){
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
			}

			$scope.loadStudents = function() {
				$scope.loader = true;
				$http.get('/api/user/getall')
					.success(function(response, status, headers, config) {
						$scope.loader = false;
						if (response.success) {
							if($scope.logUser.isAdmin == 1){
								$scope.students = response.data;
								$scope.filtered = response.data;
							}else if($scope.logUser.isAdmin == 2){
								$scope.students = [];
								angular.forEach(response.data, function(value, key){
									if(value.isAdmin == 0){
										$scope.students.push(value);
									}
								});
								$scope.filtered = $scope.students;
							}
							$scope.index = 0;
							$scope.curPage = 0;
						    $scope.pageSize = 10;
							$scope.numberOfPages = function() {
					   				return Math.ceil($scope.students.length / $scope.pageSize);
					   		};
							// $watch search to update pagination
							$scope.$watch('search', function (newVal, oldVal) {
								if(newVal.studentId){
									$scope.students = [];
									angular.forEach($scope.filtered, function(value, key){
										if(angular.lowercase(value.studentId).indexOf(angular.lowercase(newVal.studentId)) > -1){
											$scope.students.push(value);
										}
									});
								}else{
									$scope.students = $scope.filtered;
								}
								$scope.curPage = 0;
							}, true);
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
				console.log(student);
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
						if(response.data.dob != null){
							$scope.Enable_Stu_Pro = 1;
						}else{
							$scope.user.dob = '';
							$scope.Enable_Stu_Pro = 0;
						}

					} else {
						console.log(response.message);
					}
				})
				.error(function(response, status, headers, config) {
					$scope.loader = false;
				});
			};

			$scope.restPassword = function() {
				if($scope.data.newPassword === $scope.data.confirmPassword) {
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
							$scope.msg = '  Passcode has been reset successfully!';
						} else {
							$scope.passcodeErrorAlert = true;
							$scope.data = {};
							console.log(response.message);
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
				$scope.success = false;
				$scope.passwordErrorAlert = false;
				$scope.passcodeErrorAlert = false;
				$scope.profileUpdateSuccessAlert = false;
			};

			// Edit view
			$scope.editView = false;

			$scope.enableEdit = function(option) {
				$scope.user = angular.copy($scope.student);
				if($scope.student.dob != null){
					$scope.user.dob = new Date(Date.parse($scope.student.dob));
				}else{
					$scope.user.dob = '';
				}
				//$scope.user.dob = new Date(Date.parse($scope.user.dob));
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
				if($scope.user.dob){
					var data = $scope.user.dob;
					var dob = data.getFullYear() + '-';
					dob += ('0' + (data.getMonth() + 1)).slice(-2);
					dob += '-' + ('0' + (data.getDate())).slice(-2);
					$scope.user.dob = new Date(dob);
				}else {
					$scope.user.dob = '';
				}

				$http({
						method: 'POST',
						url: '/api/user/update?id=' + $scope.user.id,
						data: $scope.user
					})
					.success(function(response) {
						if (response.success) {
							//Authentication.user = response.data;
							$scope.student = response.data;
							var data = new Date(response.data.dob);
							var dob = data.getFullYear() + '-';
							dob += ('0' + (data.getMonth() + 1)).slice(-2);
							dob += '-' + ('0' + (data.getDate())).slice(-2);
							$scope.student.dob = dob;
							$scope.enableEdit(false);
							$scope.profileUpdateSuccessAlert = true;
							$scope.msg = '  Profile updated successfully!';
						}
					})
					.error(function(response) {
						console.log(response);
					});
			};

			$scope.EnableDobAdd = function(){
				var newdate = new Date();
				newdate.setFullYear(newdate.getFullYear() - 18);
				$scope.newStudent.dob = new Date(newdate);
				$scope.add_dob = 1;
				$scope.openPicker();
			};

			$scope.EnableDobStuPro = function(){
				var newdate = new Date();
				newdate.setFullYear(newdate.getFullYear() - 18);
				$scope.user.dob = new Date(newdate);
				$scope.Enable_Stu_Pro = 1;
				$scope.openPicker();
			};

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
					$scope.newStudent.photo = data;
				}, function(data) {
					// console.log(data);
				});
			};

			$scope.createUser = function() {
				$http({
					method: 'POST',
					url: '/api/user/student',
					data: $scope.newStudent
				})
				.success(function(response) {
					if (response.success) {
						$state.go('app.students', {save: true});
					} else {
						$scope.passwordSuccessAlert = response.message;
					}
				})
				.error(function(response) {
					//$scope.passwordSuccessAlert = 'Unable to create account for this Student';
					$scope.passwordSuccessAlert = response.message;
				});
			};
		}
	]);
	angular.module(module).filter('pagination', function()
	{
	 return function(input, start)
	 {
	  start = +start;
	  return input.slice(start);
	 };
	});
