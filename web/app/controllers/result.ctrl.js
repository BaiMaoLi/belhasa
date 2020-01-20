'use strict';
/**
 * @name Result Controller
 */
angular.module(module)
	.controller('ResultController', [
		'$scope', '$stateParams', '$http', 'Authentication', '$state',
		function($scope, $stateParams, $http, Authentication, $state) {
			$scope.user = Authentication.user;
			$scope.loadResult = function() {
				$scope.loader = true;

				function  getAnswers(flag) {
					var items = $scope.testResult.questions
					var count = 0;
					items.forEach(function(data, index) {
						if (data.status === flag) {
							count++;
						}
					});
					return count;
				}

				$scope.printResult = function() {
					var printContents = document.getElementById('test-result').innerHTML;
					var popupWin = window.open('', '_blank', 'width=300,height=300');
					popupWin.document.open();
					popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
					popupWin.document.close();
				};

				$http.get('/api/question/testinfo?id=' + $stateParams.id)
					.success(function(response, status, headers, config) {
						$scope.loader = false;
						if (response.success) {
							$scope.testResult = response.data;
							$scope.correctResults = getAnswers(1)
							$scope.incorrectResults = getAnswers(0)
						}
					})
					.error(function(response, status, headers, config) {
						$scope.loader = false;
					});
			};

			$scope.viewResult = function(item) {
				$state.go('app.test_results_view', {id: item.id});
			};

			$scope.loadResults = function() {
				$scope.loader = true;
				var $query = '';
				if (!$scope.user.isAdmin) {
					$query  = '?userId=' + $scope.user.id;
				}
				$http.get('/api/question/testall' + $query)
					.success(function(response) {
						$scope.loader = false;
						if (response.success) {
							$scope.items = response.data;
						}
					});
			};
		}
	]);