'use strict';

angular.module(module)
	.controller('LanguageController', [
		'$scope', '$http', '$state', '$stateParams', '$location',
		function($scope, $http, $state, $stateParams, $location) {
			$scope.item = {};
			$scope.section = 'New Language Form';
			$scope.getAll = function() {
				$http.get('/api/language/getall')
					.success(function(response, status, headers, config) {
						if (response.success === true) {
							$scope.items = response.data;
						} else {
							$scope.error = true;
						}
					})
					.error(function(response, status, headers, config) {
						$scope.error = true;
					});
			};

			$scope.getById = function() {
				if ($stateParams.id) {
					$http.get('/api/language/getbyid?id=' + $stateParams.id)
						.success(function(response, status, headers, config) {
							if (response.success === true) {
								$scope.item = response.data;
							} else {
								$scope.error = true;
							}
						})
						.error(function(response, status, headers, config) {
							$scope.error = true;
						});
				}
			};

			$scope.saveItem = function() {
				if ($scope.item.id) {
					$http({
						method: 'PUT',
						url: '/api/language/update',
						data: $scope.item
					})
					.success(function(response, status, headers, config) {
							if (response.success === true) {
								$state.go('app.language', {save: true});
							} else {
								$scope.error = true;
							}
						})
						.error(function(response, status, headers, config) {
							$scope.error = true;
						});
				} else {
					$http({
						method: 'POST',
						url: '/api/language/create',
						data: $scope.item
					})
					.success(function(response, status, headers, config) {
							if (response.success === true) {
								$state.go('app.language', {save: true});
							} else {
								$scope.error = true;
							}
						})
						.error(function(response, status, headers, config) {
							$scope.error = true;
						});
				}
			};

			$scope.removeItem = function(item) {
				$http.delete('/api/language/delete?id=' + item.id)
					.success(function(response, status, headers, config) {
							if (response.success === true) {
								$scope.items.splice(($scope.items).indexOf(item), 1);
							} else {
								$scope.error = true;
							}
						})
						.error(function(response, status, headers, config) {
							$scope.error = true;
						});
			};
		}
	]);