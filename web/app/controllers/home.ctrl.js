'use strict';
/**
 * @name HomeController
 */
angular.module(module)
	.controller('HomeController', [
		'$scope', 'Authentication', '$rootScope', '$http', '$state', '$stateParams', '$uibModal',
		function($scope, Authentication, $rootScope, $http, $state, $stateParams, $uibModal) {
			// Styles Adjustments
			$('body').attr('style', 'background-color:none;');
			
			$scope.user = Authentication.user;
			$scope.userCount = 0;
			$scope.userRequests = 0;
			$scope.questionsCount = 0;
			$scope.testCount = 0;
			$scope.testOptions = {};
			$scope.categories = ['LMV', 'MC', 'HVT and LB', 'FRLK', 'Instructor'];
			

			$scope.closeAlert = function(option) {
				switch(option) {
					case 'test':
						$scope.testAlert = false;
						break;
				}
			};

			$rootScope.$on('language-changed', function(event, data) {
				$scope.userLanguage = data;
			});

			$scope.chooseTest = function() {
				$scope.showTests = true;
			};

			function openTest() {
				var modal = $uibModal.open({
					templateUrl: 'app/templates/tests.tpl.html',
					controller: 'TestController',
					size: 'lg',
					backdrop: 'static',
					keyboard: false,
					resolve: {
						testOptions: function () {
							return $scope.testOptions;
						}
					}
				});

				modal.result.then(function(data) {
					$scope.resetDisplay();
					console.log(data);
				}, function(data) {
					$scope.resetDisplay();
					$scope.testAlert = true;
				});
			};

			$scope.chooseTestType = function(type) {
				$scope.testOptions.t = type;
				openTest();
			};

			$scope.chooseTestCategory = function(category) {
				$scope.testOptions.c = category;
			};

			$scope.resetDisplay = function() {
				$scope.showTests = false;
				$scope.testOptions = {};
				$scope.testAlert = false;
			};


			$scope.loadCounts = function() {
				if ($scope.user.isAdmin) {
					// user counts
					$http.get('/api/count/user')
						.success(function(response, status, headers, config) {
							if (response.success) {
								$scope.userCount = response.data;
							}
						});

					// user requests
					$http.get('/api/count/user?field=status&value=0')
						.success(function(response, status, headers, config) {
							if (response.success) {
								$scope.userRequests = response.data;
							}
						});

					// questions
					$http.get('/api/count/questions')
						.success(function(response, status, headers, config) {
							if (response.success) {
								$scope.questionsCount = response.data;
							}
						});

					// tests
					$http.get('/api/count/tests')
						.success(function(response, status, headers, config) {
							if (response.success) {
								$scope.testCount = response.data;
							}
						});
				}
			};

		}
	]);