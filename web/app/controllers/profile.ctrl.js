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

			$scope.student = Authentication.user;

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

			$scope.updateUser = function() {
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
							$rootScope.user = $scope.user;
							$scope.enableEdit(false);
						}
					})
					.error(function(response) {
						console.log(response);
					});
			};


			$scope.myImage='';
	        $scope.myCroppedImage='';

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