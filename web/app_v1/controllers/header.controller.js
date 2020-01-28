'use strict';
/**
 * @name CustomizeController
 */
angular.module(module)
	.controller('HeaderController', [
		'$scope',
		'Authentication',
		'$http',
		'$state',
		'$rootScope',
		'$stateParams',
		'$translate',
		'$window',
		'$location',
		function($scope, Authentication, $http, $state, $rootScope, $stateParams, $translate, $window, $location) {
			// user information
			$scope.user = Authentication.user;
			$scope.timer = Authentication.timer;
			$scope.user_id = $scope.user.id;
			if ($scope.user.language) {
				$translate.use($scope.user.language);
			}
			$rootScope.$watch('user', function(newValue) {
				if (newValue) {
					$scope.user = newValue;
				}
			}, true);


			$scope.isActive = function (viewLocation) {
				var active =false;
				if($location.path() !=viewLocation) {
					var location = $location.path().replace('app','');
					active = (location.indexOf(viewLocation) > -1);
				} else if ($location.path() === viewLocation){
					active =true;
				} else {
					active = false;
				}
			    return active;
			};
			$scope.logout = function() {
				$rootScope.$emit('DisableTimer', {});
				// if (Authentication.timer != '00:00:00'){
				// 	//$rootScope.$emit('DisableTimer', {});
				// 	$http.get('api/user/clearinsruction?id=' + $scope.user.id+'&show_instruction=1')
				// 	.success(function(response, status, headers, config) {
				// 		$scope.loader = false;
				// 		if (response.success) {
				// 			console.log('success');
				// 		}
				// 	})
				// 	.error(function(response, status, headers, config) {
				// 		// $scope.loader = false;
				// 		console.log('fail');
				// 	});
				// 	$http.post('api/question/updatetime?id='+$scope.user_id+'&time='+Authentication.timer)
				// 	.success(function(response){
				// 	});
				// }
				$http.post('api/user/logout?id='+$scope.user_id)
					.success(function(response) {
						if (response.success) {
							Authentication.user = null;
							$window.localStorage.removeItem('test-category');
							$window.localStorage.removeItem('test');
							$window.localStorage.removeItem('user_lang');
							$window.localStorage.clear();
							if ($scope.user.isAdmin) {
								$state.go('admin');
							} else {
								$state.go('login');
							}
						}
					});
			};

			$scope.setUserLanguage = function(lang) {
				var data = {
					code: lang.code
				};
				$http({
					url: 'api/user/language',
					method: 'POST',
					data: data
				})
				.success(function(response) {
					$scope.prevLang = setLanguageCode();
					$translate.use(lang.code);
					$scope.userLanguage = lang;
					$rootScope.userLanguage = lang;
					$rootScope.$emit('language-changed', lang);
					$window.localStorage.setItem('user_lang', lang.code);
					$scope.currLang = setLanguageCode();
					if ( $scope.prevLang != $scope.currLang){
						$window.localStorage.setItem('home_reload', 2);
						// $http.post('api/question/updatetime?id='+$scope.user_id+'&time='+Authentication.timer)
						// .success(function(response){
						// });
						$window.location.reload();
					}
				})
				.error(function(response) {

				});
			};

			function getLanguage(code) {
				return $scope.languages.find(function(elem) {
					if (elem.code === code) {
						return elem;
					}
				});
			}

			$scope.loadAssets = function() {
				$http.get('api/language/getall')
				.success(function(response) {
					if (response.success) {
						$scope.languages = response.data;
						$scope.setUserLanguage(getLanguage($translate.use()));
					}
				});
			};
			// set languageCode
			function setLanguageCode(){
				$scope.userLang = $window.localStorage.getItem('user_lang');
				if ($scope.userLang == 'ar-ar' || $scope.userLang == 'ur-ur' || $scope.userLang == 'fa-fa')
					return 1;
				else
					return 2;
			}

		}
	]);
