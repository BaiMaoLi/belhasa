'use strict';
angular.module(module)
	.controller('HeaderController', [
		'$scope', 'Authentication', '$http', '$state', '$rootScope', '$stateParams', '$translate',
		function($scope, Authentication, $http, $state, $rootScope, $stateParams, $translate) {
			// user information
			$scope.user = Authentication.user;
			$rootScope.$watch('user', function(newValue) {
				if (newValue) {
					$scope.user = newValue;
				}
			}, true);

			$scope.logout = function() {
				$http.post('/api/user/logout')
					.success(function(response) {
						if (response.success) {
							Authentication.user = null;
							$state.go('login');
						}
					});
			};

			$scope.setUserLanguage = function(lang) {
				$translate.use(lang.code);
				$scope.userLanguage = lang;
				$rootScope.userLanguage = lang;
				$rootScope.$emit('language-changed', lang)
			};

			function getLanguage(code) {
				return $scope.languages.find(function(elem) {
					if (elem.code === code) {
						return elem;
					}
				});
			}

			$scope.loadAssets = function() {
				$http.get('/api/language/getall')
				.success(function(response) {
					if (response.success) {
						$scope.languages = response.data;
						$scope.setUserLanguage(getLanguage($translate.use()));
					}
				});
			};
		}
	]);