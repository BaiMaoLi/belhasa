'use strict';
/**
 * @name CustomizeController
 */
angular.module(module)
	.controller('CustomizeController', [
		'$scope',
		'$state',
		'$timeout',
		'Authentication',
		'$http',
		'$translate',
		'$window',
		function($scope, $state, $timeout, Authentication, $http, $translate, $window) {
			var user = Authentication.user;
			$scope.isAdmin = Authentication.user.isAdmin;
			$scope.input = {};
			$scope.categories = [];//['LMV', 'MC', 'HVT and LB', 'FRLK', 'Instructor'];
			$scope.showCategory = true;
			if (!user.language) {
				$scope.language = true;
			} else {
				$translate.use(user.language);
				next();
			}


			$http.get('api/category/getall')
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

			$scope.loadLanguage = function() {

				$http.get('api/language/getall')
					.success(function(response) {
						if (response.success) {
							$scope.languages = response.data;
						}
					})
					.error(function(response) {
					});
			};

			$scope.translate = function() {
				$window.localStorage.setItem('user_lang', $scope.input.language);
				var data = {
					code: $scope.input.language
				};
				$http({
					url: 'api/user/language',
					method: 'POST',
					data: data
				})
				.success(function(response) {
					$translate.use($scope.input.language);
					$scope.language = false;
					next();
				})
				.error(function(response) {

				});
			};

			function next() {
				if($window.localStorage.getItem('user_lang') == "ar-ar" || $window.localStorage.getItem('user_lang') == "fa-fa" || $window.localStorage.getItem('user_lang') == "ur-ur" ){
					$window.localStorage.setItem('reload_lang', 1);
				}
				if (user.isAdmin) {
					$state.go('app');
				}
				else {
					if ($window.localStorage.getItem('test-category')) {
						$state.go('app');
					}
				}
			}

			$scope.chooseCategory = function() {
				$window.localStorage.setItem('test-category', JSON.stringify({
					userId: user.id,
					category: $scope.input.category,
					name : user.name
				}));
			};

			$scope.studentLogin = function() {
				$window.localStorage.setItem('user_lang', "en-en");
				$window.localStorage.setItem('screen_lang', $scope.input.language);
				$window.localStorage.setItem('user_audio_lang', $scope.input.audiolanguage);
				$translate.use("en-en");
				$scope.language = false;
				$window.localStorage.setItem('test-category', JSON.stringify({
					userId: user.id,
					category: user.category,
					name : user.name
				}));
				$state.go('app');
				next();
				// $scope.translate();
			}
		}
	]);
