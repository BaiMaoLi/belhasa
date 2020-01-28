'use strict';
/**
 * @name CustomizeController
 */
angular.module(module)
	.controller('ReportsController', [
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
				$http.get('api/user/logs')
					.success(function(response) {
						$scope.loader = false;
						if (response.success) {
							var log = response.log;
							var admin = response.admin;
							var student = response.student;
							var data = [];
							angular.forEach(admin, function(value, key) {
                                var count = 0;
                                var record = [];
                                if(value.isAdmin == 2){
                                    console.log(value.isAdmin);
                                    angular.forEach(log, function(lvalue, lkey){
                                        if(value.id == lvalue.adminid){
                                            count++;
                                        }
                                    });
                                    record['admin']=value;
                                    record['count']=count;
                                    data.push(record);
                                }
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
										if(angular.lowercase(value.admin.email).indexOf(angular.lowercase(newVal.studentId)) > -1){
											$scope.items.push(value);
										}else if (angular.lowercase(value.admin.name).indexOf(angular.lowercase(newVal.studentId)) > -1) {
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

			$scope.getReport = function() {
				$scope.loader = true;
				$http.get('api/question/report')
					.success(function(response) {
						$scope.loader = false;
						if (response.success) {
							$scope.items = response.data;
							$scope.filtered = response.data;
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
										if(angular.lowercase(value.id).indexOf(angular.lowercase(newVal.studentId)) > -1){
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
