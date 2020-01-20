'use strict';
/**
 * @name Result Controller
 */
angular.module(module)
	.controller('ResultController', [
		'$scope', '$stateParams', '$http', 'Authentication', '$state', '$window', '$filter',
		function($scope, $stateParams, $http, Authentication, $state, $window) {
			$scope.user = Authentication.user;
			// pagination
			$scope.curPage = 0;
			$scope.categories = [];//['LMV', 'MC', 'HVT and LB', 'FRLK', 'INSTRUCTOR'];
			$scope.practiseTypes = ['isCommon', 'isSpecific'];
			$scope.question = {
				queries: [],
				category: $stateParams.category,
			};
			$scope.selectedPractiseTypes = [];
			$scope.temp = {};
			// $scope.search = {
			// 	category: $stateParams.category
			// };
			$scope.search={};
			$scope.search.studentId = "";
			$scope.search.filterBy = "0";
			$scope.tempType = {};
			$scope.from = "";
			$scope.to = "";
			$scope.testError = false;
			$scope.filterError = false;

			$scope.index = 0;
			$scope.curPage = 0;
			$scope.pageSize = 10;
			$scope.responsePageSize = 0;
			$scope.exportButton = false;

			$scope.date_valid = {
			    endDate: new Date()
			};


			$http.get('/api/category/getall')
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

			$scope.filterQuery = {};
			if ($stateParams.type) {
				switch($stateParams.type) {
					case 'realtime':
						$scope.filterQuery.questionType = 'isRealtime';
						break;
					case 'common':
						$scope.filterQuery.questionType = 'isCommon';
						$scope.tempType.practiseType = 'common';
						break;
					case 'specific':
						$scope.filterQuery.questionType = 'isSpecific';
						$scope.tempType.practiseType = 'specific';
						break;
					case 'isRealtime':
						$scope.temp.testType = 'realtime';
						break;
					case 'isCommon':
						$scope.temp.testType = 'practise';
						$scope.tempType.practiseType = 'common';
						break;
					case 'isSpecific':
						$scope.temp.testType = 'practise';
						$scope.tempType.practiseType = 'specific';
						break;
				}
			}

			$scope.sort = function(keyname){
		        $scope.sortKey = keyname;   //set the sortKey to the param passed
		        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
		    }
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
					var popupWin = window.open(window.location.origin + '/site/testprint?id='+$stateParams.id+"&lang="+$window.localStorage.getItem('user_lang'));
					popupWin.print();
					//popupWin.close();
				};


				$http.get('/api/question/testinfo?id=' + $stateParams.id)
					.success(function(response, status, headers, config) {
						$scope.loader = false;
						if (response.success) {
							$scope.testResult = response.data;
							$scope.correctResults = getAnswers(1)
							$scope.incorrectResults = getAnswers(0)
							console.log(response);
						}
					})
					.error(function(response, status, headers, config) {
						$scope.loader = false;
					});
			};

			$scope.next = function(){
				$scope.curPage = $scope.curPage + 1;
				if($scope.from != "" && $scope.to != ""){
					$scope.dateFilter($scope.from,$scope.to, $scope.curPage);
				}else if($scope.search.studentId != ""){
					$scope.searchByStudent($scope.curPage);
				}else{
					$scope.loadResults();
				}
			}

			$scope.prev = function(){
				$scope.curPage = $scope.curPage - 1;
				if($scope.from != "" && $scope.to != ""){
					$scope.dateFilter($scope.from,$scope.to, $scope.curPage);
				}else if($scope.search.studentId != ""){
					$scope.searchByStudent($scope.curPage);
				}else{
					$scope.loadResults();
				}
			}

			$scope.reset = function(){
				$scope.curPage = 0;
				$scope.from = "";
				$scope.to = "";
				$scope.search.studentId = "";
				$scope.search.filterBy = "0";
				$scope.loadResults();
			}

			$scope.searchByStudent = function(cur){

				if($scope.search.studentId != "" && $scope.search.filterBy != "0"){
					$scope.loader = true;
					$scope.curPage = cur;
					$scope.from = "";
					$scope.to = "";
					var $query = '';
					var queryAdmin = false;
					if (!$scope.user.isAdmin) {
						$query  = '?userId=' + $scope.user.id;
						queryAdmin = true;
					}
					if($scope.user.isAdmin == 2){
						$query  = '?adminId=' + $scope.user.id;
						queryAdmin = true;
					}
					if(queryAdmin){
						$query  = $query + "&page=" + $scope.curPage + "&pageSize=" + $scope.pageSize + "&StudentId=" + $scope.search.studentId + "&filterBy=" + $scope.search.filterBy;
					}else{
						$query  = $query + "?page=" + $scope.curPage + "&pageSize=" + $scope.pageSize + "&StudentId=" + $scope.search.studentId + "&filterBy=" + $scope.search.filterBy;
					}

					$http.get('/api/question/testall' + $query)
						.success(function(response) {
							$scope.loader = false;
							if (response.success) {
								$scope.items = response.data;
								$scope.filtered = response.data;

								$scope.totalCount = response.totalCount;
								if($scope.totalCount % $scope.pageSize == 0){
									$scope.numberOfPages = $scope.totalCount / $scope.pageSize;
								}else{
									$scope.numberOfPages = parseInt($scope.totalCount / $scope.pageSize);
									$scope.numberOfPages = $scope.numberOfPages + 1;
								}
							}
						});
				}else{
					$scope.filterError = true;
				}
			}

			$scope.viewResult = function(item) {
				$state.go('app.test_results_view', {id: item.id});
			};

			$scope.exportData = function() {
				$scope.exportButton = true;


				var $query = '';
				var queryAdmin = false;
				if (!$scope.user.isAdmin) {
					$query  = '?userId=' + $scope.user.id;
					queryAdmin = true;
				}
				if($scope.user.isAdmin == 2){
					$query  = '?adminId=' + $scope.user.id;
					queryAdmin = true;
				}
				if(queryAdmin){
					$query  = $query + "&page=0&pageSize=" + $scope.responsePageSize;
				}else{
					$query  = $query + "?page=0&pageSize=" + $scope.responsePageSize;
				}

				$http.get('/api/question/testall' + $query)
					.success(function(response) {
						$scope.exportButton = false;
						if (response.success) {
							var report = [];
							var count = 1;
							angular.forEach(response.data, function(value, key){
								console.log(value.student);
								var data = {"S.No" : count,
											"Test Category" : value.category,
											"Student ID" : value.student != null ? value.student.studentId : "",
											"Student Name" : value.student != null ? value.student.name : "",
											"Email" : value.student != null ? value.student.email : "",
											"Result Status": value.result_status == 1 ? "PASS" : "FAIL",
											"Held On": value.testdate
										};
								count++;
								report.push(data);
							});
							alasql('SELECT * INTO XLSX("Report.xlsx",{headers:true}) FROM ?',[report]);
						}
					});
			};

			$scope.exportPDF = function() {
				$scope.exportButton = true;


				var $query = '';
				var queryAdmin = false;
				if (!$scope.user.isAdmin) {
					$query  = '?userId=' + $scope.user.id;
					queryAdmin = true;
				}
				if($scope.user.isAdmin == 2){
					$query  = '?adminId=' + $scope.user.id;
					queryAdmin = true;
				}
				if(queryAdmin){
					$query  = $query + "&page=0&pageSize=" + $scope.responsePageSize;
				}else{
					$query  = $query + "?page=0&pageSize=" + $scope.responsePageSize;
				}

				$http.get('/api/question/testall' + $query)
					.success(function(response) {
						$scope.exportButton = false;
						if (response.success) {
							var columns = ["S.No", "Test Category", "Student ID", "Student Name", "Email", "Result Status", "Held On"];
							var rows = [];
							var count = 1;
							angular.forEach(response.data, function(value, key){
								var row = [ count,
									 		value.category,
									 		value.student != null ? value.student.studentId : "",
											value.student != null ? value.student.name : "",
											value.student != null ? value.student.email : "",
											value.result_status == 1 ? "PASS" : "FAIL",
											value.testdate
										];
								count++;
								rows.push(row);
							});

							// Only pt supported (not mm or in)
							var doc = new jsPDF('p', 'pt');
							doc.autoTable(columns, rows);
							doc.save('table.pdf');
						}
					});
			};

			// Time Picker
			$scope.popupFrom = {
				opened: false
			};
			$scope.openPickerFrom = function() {
			    $scope.popupFrom.opened  = true;
			};

			// Time Picker
			$scope.popupTo = {
				opened: false
			};
			$scope.openPickerTo = function() {
			    $scope.popupTo.opened  = true;
			};

			$scope.closeAlert = function() {
				$scope.testError = false;
				$scope.filterError = false;
			};

			$scope.dateFilter = function(from, to, cur) {
				console.log(from);
				console.log(to);
				$scope.index = 0;
				$scope.search.studentId = "";
				$scope.search.filterBy = "0";
				$scope.curPage = cur;
				if(from == "" || to  == ""){
					$scope.testError = true;
				}else{
					$scope.loader = true;
					var fromDate = from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate()+ " 00:00:00";;
					var toDate = to.getFullYear() + "-" + (to.getMonth() + 1) + "-" + to.getDate()+ " 23:59:59";

					var $query = '';
					var setvalue = false;
					if (!$scope.user.isAdmin) {
						$query  = '?userId=' + $scope.user.id;
						setvalue = true;
					}
					if($scope.user.isAdmin == 2){
						$query  = '?adminId=' + $scope.user.id;
						setvalue = true;
					}
					if(setvalue){
						$query += "&from="+fromDate+"&to="+toDate + "&page=" + $scope.curPage + "&pageSize=" + $scope.pageSize;
					}else{
						$query += "?from="+fromDate+"&to="+toDate + "&page=" + $scope.curPage + "&pageSize=" + $scope.pageSize;
					}
					$http.get('/api/question/testall' + $query)
						.success(function(response) {
							$scope.loader = false;
							if (response.success) {
								$scope.items = response.data;
								$scope.filtered = response.data;
								$scope.from = from;
								$scope.to = to;
								$scope.totalCount = response.totalCount;
								if($scope.totalCount % $scope.pageSize == 0){
									$scope.numberOfPages = $scope.totalCount / $scope.pageSize;
								}else{
									$scope.numberOfPages = parseInt($scope.totalCount / $scope.pageSize);
									$scope.numberOfPages = $scope.numberOfPages + 1;
								}
							}
						});
				}

			};


			$scope.loadResults = function() {
				$scope.loader = true;


				var $query = '';
				var queryAdmin = false;
				if (!$scope.user.isAdmin) {
					$query  = '?userId=' + $scope.user.id;
					queryAdmin = true;
				}
				if($scope.user.isAdmin == 2){
					$query  = '?adminId=' + $scope.user.id;
					queryAdmin = true;
				}
				if(queryAdmin){
					$query  = $query + "&page=" + $scope.curPage + "&pageSize=" + $scope.pageSize;
				}else{
					$query  = $query + "?page=" + $scope.curPage + "&pageSize=" + $scope.pageSize;
				}

				$http.get('/api/question/testall' + $query)
					.success(function(response) {
						$scope.loader = false;
						if (response.success) {
							$scope.items = response.data;
							$scope.filtered = response.data;

							$scope.totalCount = response.totalCount;
							$scope.responsePageSize = response.totalCount;
							if($scope.totalCount % $scope.pageSize == 0){
								$scope.numberOfPages = $scope.totalCount / $scope.pageSize;
							}else{
								$scope.numberOfPages = parseInt($scope.totalCount / $scope.pageSize);
								$scope.numberOfPages = $scope.numberOfPages + 1;
							}

							// $watch search to update pagination
							// $scope.$watch('search', function (newVal, oldVal) {
							// 	if(newVal.studentId){
							// 		$scope.items = [];
							// 		angular.forEach($scope.filtered, function(value, key){
							// 			if(angular.lowercase(value.student.studentId).indexOf(angular.lowercase(newVal.studentId)) > -1){
							// 				$scope.items.push(value);
							// 			}else if (angular.lowercase(value.category).indexOf(angular.lowercase(newVal.studentId)) > -1) {
							// 				$scope.items.push(value);
							// 			}else if (angular.lowercase(value.testdate).indexOf(angular.lowercase(newVal.studentId)) > -1) {
							// 				$scope.items.push(value);
							// 			}else if (angular.lowercase(value.student.email).indexOf(angular.lowercase(newVal.studentId)) > -1) {
							// 				$scope.items.push(value);
							// 			}
							// 		});
							// 	}else{
							// 		$scope.items = $scope.filtered;
							// 	}
							// 	$scope.curPage = 0;
							// }, true);
						}
					});
			};
			}
	]);
