'use strict';
/**
 * @name Result Controller
 */
angular.module(module)
	.controller('SplashController', [
		'$scope', '$translate', '$state', '$http', '$timeout', 'Authentication',
		function($scope, $translate, $state, $http, $timeout, Authentication) {
			// Styles Adjustments
			$('body').attr('style', 'background-color:#F7F7F7;');
			$scope.user = Authentication.user;

			$scope.input = {
				language: ''
			};

			$scope.loadAssets = function() {
				$http.get('/api/language/getall')
					.success(function(response) {
						if (response.success) {
							$timeout(function() {
								$scope.languages = response.data;
								$scope.input.language = '';
							}, 500);
						}
					})
					.error(function(response) {});
			};

			$scope.translate = function() {
				if ($scope.input.language) {
					$translate.use($scope.input.language);
					if ($scope.user) {
						$state.go('app');	
					} else {
						$state.go('login');
					}
				}
			};
		}
	]);