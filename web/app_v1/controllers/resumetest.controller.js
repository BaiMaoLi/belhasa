'use strict';
/**
 * @name ResumeTestController
 */
angular.module(module)
	.controller('ResumeTestController', [
		'$scope', 'Authentication', '$rootScope', '$http', '$state', '$stateParams', '$uibModalInstance', 'testOptions', '$window','$uibModal',
		function($scope, Authentication,  $rootScope, $http, $state, $stateParams, $uibModalInstance, testOptions, $window, $uibModal) {
			// Styles Adjustments
			$('body').attr('style', 'background-color:none;');
			$scope.animatedClass = 'slideInRight';

			$scope.user = Authentication.user;
			$scope.qustionId = null;
			$scope.form = {};
			$scope.timer = '00:00';
			$scope.stop = false;
			$scope.audioClass = 'fa-play-circle'
			var settings = JSON.parse($window.localStorage.getItem('test-category'));

			$scope.userLanguage = $rootScope.userLanguage;


			$scope.cancel = function () {
				$http.get('/api/question/clearstate?id=' + $scope.user.id)
					.success(function(response, status, headers, config) {
						$scope.loader = false;
						if (response.success) {
							$uibModalInstance.dismiss('ok');
						}
					})
					.error(function(response, status, headers, config) {
						$scope.loader = false;
					});
    			$uibModalInstance.dismiss('ok');
  			};

  			$scope.continue = function(){
  				$window.localStorage.setItem('resume',true);
  				var modal = $uibModal.open({
					templateUrl: '/app_v1/templates/tests.tpl.html',
					controller: 'TestController',
					size: 'lg',
					backdrop: 'static',
					keyboard: false,
					resolve: {
						testOptions: function () {
							// $uibModalInstance.close('ok');
							return 'ok';
						}
					}
				});
  				$uibModalInstance.close('ok');
				modal.result.then(function(data) {
					//$uibModalInstance.close('ok');
					console.log(data);
					//$scope.resetDisplay();
					$scope.testSuccess = true;
				}, function(data) {
					//$scope.resetDisplay();
					// $uibModalInstance.dismiss('ok');
					if (data) {
						$scope.testError = data;
					} else {
						$scope.testError = 'Test has been terminated due to user\'s interupt!';
					}
				});
			

  			}
  	// 		$rootScope.$on('language-changed', function(event, data) {
			// 	$scope.userLanguage = data;
			// 	if (angular.isNumber($scope.questionId)) {
			// 		$scope.getQuestion();
			// 	}
			// });
		}
	]);


