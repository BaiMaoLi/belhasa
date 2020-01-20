'use strict';
/**
 * @name CustomizeController
 */
angular.module(module)
	.controller('TopicsController', [
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
				$http.get('/api/topics/getall')
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

			$scope.saveTopic = function() {
				$http({
					method: 'POST',
					url: '/api/topics/create',
					data: $scope.newItem
				})
				.success(function(response) {
					if (response.success) {
						$state.go('app.topic_area', {save: true});
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

			$scope.removeItem = function(item, $index) {
				var flag = confirm('Questions associated with this topic area will also be deleted .Do you want to continue ?');
				if (flag) {
					$http({
						method: 'DELETE',
						url: '/api/topics/delete?id=' + item.id
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
				$state.go('app.topic_area_update', {id: item.id});
			};

			$scope.loadDataById = function() {
				var id = $stateParams.id;
				$http.get('/api/topics/getbyid?id=' + id)
					.success(function(response) {
						if (response.success) {
							$scope.newItem = response.data;
						}
					})
					.error(function(response) {});
			};

			$scope.updateTopic = function() {
				$http({
					method: 'PUT',
					url: '/api/topics/update?id=' + $scope.newItem.id,
					data: $scope.newItem
				})
				.success(function(response) {
					if (response.success) {
						$state.go('app.topic_area', {save: true});
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
