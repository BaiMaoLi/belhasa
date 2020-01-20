'use strict';
/**
 * @name LoadingController
 */
angular.module(module)
	.controller('LoadingController', [
		'$scope',
		'$state',
		'$timeout',
		'Authentication',
		function($scope, $state, $timeout, Authentication) {
			var user = Authentication.user;

			var navigate = function() {
				$timeout(function() {
					if (angular.isObject(user)) {
						$state.go('app');
					} else {
						$state.go('login');
					}
				}, 2000);
			};

			var loader = function() {
				$timeout(function() {
					$scope.loader = true;
					navigate();
				}, 1000);
			};

			$timeout(function() {
				$scope.showSubImage = true;
				loader();
			}, 1500);
		}
	]);