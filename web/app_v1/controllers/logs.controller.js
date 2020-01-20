'use strict';
/**
 * @name CustomizeController
 */
angular.module(module)
	.controller('LogsController', [
		'$scope',
		'$state',
		'$stateParams',
		'$timeout',
		'Authentication',
		'$http',
		'$translate',
		'filterFilter',
		function($scope, $state, $stateParams, $timeout, Authentication, $http, $translate, filterFilter) {

			$scope.curPage = 0;
			$scope.newItem = {};
			$scope.save = $stateParams.save;
			$scope.search = {};
			$scope.filtered = {};

			$scope.closeAlert = function() {
				$scope.save = false;
			};

			$scope.getAll = function() {
				$scope.loader = true;
				$http.get('/api/user/logs')
					.success(function(response) {
						$scope.loader = false;
						if (response.success) {
							var log = response.log;
							var admin = response.admin;
							var student = response.student;
							var data = [];
							angular.forEach(log, function(value, key) {
							  var record = [];
							  record['login_time'] = value.login_time;
							  angular.forEach(student, function(svalue, skey) {
	  							  if(value.sid == svalue.studentId){
									  record['student'] = svalue;
								  }
	  						  });
							  angular.forEach(admin, function(avalue, akey) {
								  if(value.adminid == avalue.id){
									  record['admin'] = avalue;
								  }
	   						   });
							   data.push(record);
							});
							$scope.items = data;
							$scope.filtered = data;
							$scope.index = 0;
							$scope.curPage = 0;
						    $scope.pageSize = 10;
							$scope.numberOfPages = function() {
					   				return Math.ceil($scope.items.length / $scope.pageSize);
					   		};
							// $watch search to update pagination
							$scope.$watch('search', function (newVal, oldVal) {
								if(newVal.studentId){
									$scope.items = [];
									$scope.curPage = 0;
									angular.forEach($scope.filtered, function(value, key){
										if(angular.lowercase(value.student.studentId).indexOf(angular.lowercase(newVal.studentId)) > -1){
											$scope.items.push(value);
										}
									});
								}else{
									$scope.items = $scope.filtered;
								}
								$scope.curPage = 0;
							}, true);
						} else {
							$scope.error = true;
						}
					})
					.error(function(response) {
						// error
					});
			};


		}
	]);
	angular.module(module).filter('pagination', function()
	{
	 return function(input, start)
	 {
	  start = +start;
	  return input.slice(start);
	 };
	});
