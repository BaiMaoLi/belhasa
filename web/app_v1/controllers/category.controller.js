'use strict';
/**
 * @name CategoryController
 */
angular.module(module)
	.controller('CategoryController', [
		'$scope',
		'$state',
		'$stateParams',
		'$timeout',
		'Authentication',
		'$http',
		'$translate',
		'$rootScope',
		function($scope, $state, $stateParams, $timeout, Authentication, $http, $translate, $rootScope) {

			$scope.newItem = {};
			$scope.save = $stateParams.save;
			$scope.errorMsg = false;
			$scope.errorMsgString = "";
			$timeout(function (){
				$scope.save = false;
			}, 3000);

			$scope.closeAlert = function() {
				$scope.save = false;
				$scope.errorMsg = false;
			};

			$scope.getAll = function() {
				$scope.loader = true;
				$http.get('/api/category/getall')
					.success(function(response) {
						$scope.loader = false;
						if (response.success) {
							$scope.items = response.data;
						} else {
							$scope.error = true;
						}
					})
					.error(function(response) {
						// error
					});
			};

			$scope.saveCategory = function() {
				$http({
					method: 'POST',
					url: '/api/category/create',
					data: $scope.newItem
				})
				.success(function(response) {
					if (response.success) {
						$state.go('app.category', {save: true});
					}else{
						$scope.errorMsg = true;
						$scope.errorMsgString = response.message;
						$timeout(function (){
							$scope.errorMsg = false;
						}, 3000);
					}
				})
				.error(function(response) {});
			};

			$scope.changeStatus = function(item, $index, status){
				item.status = status;
				$http({
					method: 'PUT',
					url: '/api/category/updatestatus?id=' +item.id,
					data: item
				})
				.success(function(response) {
					if (response.success) {
						$state.go('app.category', {save: true});
					}
				})
				.error(function(response) {});
			};

			$scope.removeItem = function(item, $index) {
				var flag = confirm('Do you want to delete ?');
				if (flag) {
					$http({
						method: 'DELETE',
						url: '/api/category/delete?id=' + item.id
					})
					.success(function(response) {
						if (response.success) {
							($scope.items).splice($index, 1);
						}
					})
					.error(function(response) {});
				} else {
					// console.log('')
				}
			};

			$scope.editItem = function(item) {
				$state.go('app.category_update', {id: item.id});
			};

			$scope.loadDataById = function() {
				var id = $stateParams.id;
				$http.get('/api/category/getbyid?id=' + id)
					.success(function(response) {
						if (response.success) {
							$scope.newItem = response.data;
						}
					})
					.error(function(response) {});
			};

			$scope.updateCategory = function() {
				$http({
					method: 'PUT',
					url: '/api/category/update?id=' + $scope.newItem.id,
					data: $scope.newItem
				})
				.success(function(response) {
					if (response.success) {
						$state.go('app.category', {save: true});
					}else{
						$scope.errorMsg = true;
						$scope.errorMsgString = response.message;
						$timeout(function (){
							$scope.errorMsg = false;
						}, 3000);
					}
				})
				.error(function(response) {});
			};
		}
	]);
