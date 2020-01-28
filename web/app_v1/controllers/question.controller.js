'use strict';

angular.module(module)
	.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;

                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }])
	.service('fileUpload', ['$http', function ($http) {
			this.audioUrl = null;
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('file', file);

               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined, 'Process-Data': false}
               })
               .success(function(data){
               		this.audioUrl=data;
               })
               .error(function(){
               		this.audioUrl=data;
               });
               return this.audioUrl;
            }
         }])
	.controller('QuestionController', [
		'$scope', '$http', '$state', '$stateParams', '$q', '$window', '$location', '$rootScope', '$uibModal', 'fileUpload', '$interval', '$timeout', '$filter', '$filter',
		function($scope, $http, $state, $stateParams, $q, $window, $location, $rootScope, $uibModal, fileUpload, $interval, $timeout, $filter, appFilter) {
			$scope.item = {};
			$scope.section = 'New Language Form';
			$scope.categories = [];//['LMV', 'MC', 'HVT and LB', 'FRLK', 'INSTRUCTOR'];
			$scope.practiseTypes = ['isCommon', 'isSpecific'];
			$scope.question = {
				queries: [],
				category: $stateParams.category,
			};
			$scope.selectedQuestion = {};
			$scope.selectedPractiseTypes = [];
			$scope.selectedPractiseTypesEdit = '';
			$scope.temp = {};
			$scope.search = {
				category: $stateParams.category
			};
			$scope.tempType = {};
			$scope.titlemsg = $stateParams.type;
			$scope.addQuestionSave = false;
			$scope.editQuestionSave = false;
			$scope.tempTypeEdit = {};
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
				}
			);
			$scope.selectoption = function(){
				if($scope.question.queries[0].language == ""){
					$scope.question.queries[0].language = "en-en";
				}
			};

			$scope.filterQuery = {};
			if ($stateParams.type) {
				switch($stateParams.type) {
					case 'realtime':
						$scope.filterQuery.questionType = 'isRealtime';
						$scope.tempType.practiseType = 'specific';
						$window.localStorage.setItem('link_category',$stateParams.category);
						$window.localStorage.setItem('link_type',$stateParams.type);
						break;
					case 'common':
						$scope.filterQuery.questionType = 'isCommon';
						$scope.tempType.practiseType = 'common';
						$window.localStorage.setItem('link_category',$stateParams.category);
						$window.localStorage.setItem('link_type',$stateParams.type);
						break;
					case 'specific':
						$scope.filterQuery.questionType = 'isSpecific';
						$scope.tempType.practiseType = 'specific';
						$window.localStorage.setItem('link_category',$stateParams.category);
						$window.localStorage.setItem('link_type',$stateParams.type);
						break;
					case 'isRealtime':
						$scope.temp.testType = 'realtime';
						$scope.tempType.practiseType = 'specific';
						$window.localStorage.setItem('link_category',$stateParams.category);
						$window.localStorage.setItem('link_type',$stateParams.type);
						break;
					case 'isCommon':
						$scope.temp.testType = 'practise';
						$scope.tempType.practiseType = 'common';
						$window.localStorage.setItem('link_category',$stateParams.category);
						$window.localStorage.setItem('link_type',$stateParams.type);
						break;
					case 'isSpecific':
						$scope.temp.testType = 'practise';
						$scope.tempType.practiseType = 'specific';
						$window.localStorage.setItem('link_category',$stateParams.category);
						$window.localStorage.setItem('link_type',$stateParams.type);
						break;
				}
			}

			$scope.saveAlert = $stateParams.save;

			$scope.closeAlert = function() {
				$scope.saveAlert = false;
				$scope.configurationSuccessAlert = false;
			};

			$scope.language_validation = function(){
				var data = angular.copy($scope.question);
				var langdup = 0;
				angular.forEach(data.queries, function(value, key) {
					angular.forEach(data.queries, function(lvalue, lkey) {
						if(key != lkey){
							if(value.language == lvalue.language){
								langdup = 1;
							}
						}
					});
				});
				if(langdup != 0){
					var $translate = $filter('translate');
					alert($translate("table.ques_lang_msg"));
				}
			};

			$scope.language_validation_edit = function(){
				var langdup = 0;
				angular.forEach($scope.selectedQuestion.queries, function(value, key) {
					angular.forEach($scope.selectedQuestion.queries, function(lvalue, lkey) {
						if(key != lkey){
							if(value.language == lvalue.language){
								langdup = 1;
							}
						}
					});
				});
				if(langdup != 0){
					var $translate = $filter('translate');
					alert($translate("table.ques_lang_msg"));
				}
			};

			$scope.getAnswer = function(item) {
				switch (item.answer) {
					case '1':
						return item.choice1;
						break;
					case '2':
						return item.choice2;
						break;
					case '3':
						return item.choice3;
						break;
					case '4':
						return item.choice4;
						break;
				}
			};

			$scope.getDate = function(data) {
				return data;
			};
			$scope.language = $rootScope.userLanguage;
			$rootScope.$on('language-changed', function(event, data) {
				$scope.language = data;
				$http.get('api/language/getall')
					.success(function(response, status, headers, config) {
						if (response.success === true) {
							var $translate = $filter('translate');
							$scope.addselect = $translate("register.form.select");
							//console.log($scope.checking);
							$scope.languages = [];
							$scope.languages.push({"code": "", "name": $scope.addselect });
							//$scope.languages = response.data;
							angular.forEach(response.data, function(value, key) {
								$scope.languages.push(value);
							});
						} else {
							$scope.error = true;
						}
					})
					.error(function(response, status, headers, config) {
						$scope.error = true;
					});
				if (!$stateParams.id) {

					if ($state.current.name === 'app.questionmanagement') {
						$scope.getCount();
					} else {
						$scope.getAll();
					}
				}
			});

			$scope.insertNewTranslation = function() {
				var row = {
					language: $scope.languages[0].code,
					flag: 'new'
				};
				if (!$stateParams.id) {
					$scope.question.queries.push(row);
				} else {
					$scope.selectedQuestion.queries.push(row);
				}
			};

			$scope.getAll = function() {
				$scope.loader = true;
				if ($scope.userLanguage) {
					$http.get('api/question/getall?language=' + $scope.language.code)
					//$http.get('api/question/getcount')
						.success(function(response, status, headers, config) {
							$scope.loader = false;
							console.log(response);
							if (response.success === true) {
								//$scope.items = response.data;
								var result = [];
								angular.forEach(response.data, function(value, key) {
									if(value.isCommon){
										result.push(value);
									}else if (value.category === $scope.search.category) {
										result.push(value);
									}
								});
								$scope.items = result;
							} else {
								$scope.error = true;
							}
						})
						.error(function(response, status, headers, config) {
							$scope.error = true;
							$scope.loader = false;
						});
				}
			};

			$scope.getCount = function() {
				$scope.loader = true;
				if ($scope.userLanguage) {
					$http.get('api/question/getcount')
						.success(function(response, status, headers, config) {
							$scope.loader = false;
							if (response.success === true) {
								$scope.items = response.data;
							} else {
								$scope.error = true;
							}
						})
						.error(function(response, status, headers, config) {
							$scope.error = true;
							$scope.loader = false;
						});
				}
			};

			$scope.getById = function() {
				if ($stateParams.id) {
					$http.get('api/language/getbyid?id=' + $stateParams.id)
						.success(function(response, status, headers, config) {
							if (response.success === true) {
								$scope.item = response.data;
							} else {
								$scope.error = true;
							}
						})
						.error(function(response, status, headers, config) {
							$scope.error = true;
						});
				}
			};

			function createNewQuestion() {
				var data = angular.copy($scope.question);
				var langdup = 0;
				angular.forEach(data.queries, function(value, key) {
					angular.forEach(data.queries, function(lvalue, lkey) {
						if(key != lkey){
							if(value.language == lvalue.language){
								langdup = 1;
							}
						}
					});
				});
				if(langdup == 0){
					data.testType = $scope.temp.testType;
					if ($scope.tempType.practiseType === 'common') {
						data.isCommon = true;
					} else if ($scope.tempType.practiseType === 'specific') {
						data.isSpecific = true;
					}
					$http({
						method: 'POST',
						url: 'api/question/create',
						data: data
					})
					.success(function(response, status, headers, config) {
						var urltype = '';
						if($stateParams.type == "isRealtime"){
							urltype = "realtime";
						}else if ($stateParams.type == "isCommon") {
							urltype = "common";
						}else if ($stateParams.type == "isSpecific") {
							urltype = "specific";
						}
						if (response.success === true) {
							$scope.addQuestionSave = false;
							$state.go('app.questions', {category: $stateParams.category,type: urltype,save: true});
						} else {
							$scope.addQuestionSave = false;
							$scope.error = true;
						}
					})
					.error(function(response, status, headers, config) {
						$scope.error = true;
					});
				}else{
					var $translate = $filter('translate');
					alert($translate("table.ques_lang_msg"));
				}
			}


			$scope.changeType = function() {
				console.log($scope.temp);
			};

			$scope.isAllowed = function(flag) {
				// if ($scope.testConfig) {
					if ($stateParams.type === 'realtime') {
						return true;
					} else if ($stateParams.type === flag) {
						return true;
					} else {
						false;
					}
				// }
			};

			$scope.getLengh = function(questionType) {
				if ($scope.items && $scope.items.length) {
					// var data1 = ;
					//var data = appFilter('QuestionType')(appFilter('filter')($scope.items, $scope.search, 'strict'), $scope.filterQuery.questionType);
					var data = $scope.items;
					var count = 0;
					if(questionType == "isCommon"){
						angular.forEach(data, function(value, key) {
							if (value[questionType]) {
								count++;
							}
						});
					}else{
						angular.forEach(data, function(value, key) {
							if (value[questionType] && $scope.search.category == value["category"]) {
								count++;
							}
						});
					}

				}
				return count;
			};

			$scope.loadTestConfig = function() {
				$http.get('api/count/testconfigbycategory?category=' + $stateParams.category + '&type=' + $stateParams.type)
					.success(function(response) {
						if (response.success) {
							$scope.testConfig = response.data;
						}
					});
			};

			$scope.saveConfig = function() {
				$http({
						method: 'POST',
						url: 'api/count/testconfigsave',
						data: $scope.testConfig
					})
					.success(function(response) {
						if (response.success) {
							$scope.configurationSuccessAlert = true;
							$timeout(function() {
								$scope.configurationSuccessAlert = false;
							}, 3000);
						} else {
							// error
						}
					})
					.error(function(response) {});
			};

			$scope.newQuestion = function() {
				$scope.addQuestionSave = true;

				var audioLength = 0;
				var processedAudio = 0
				angular.forEach($scope.question.queries, function(value, key) {
					if (typeof value.audio !== 'undefined') {
						audioLength++;
					}
					if (typeof value.audio_option1 !== 'undefined') {
						audioLength++;
					}
					if (typeof value.audio_option2 !== 'undefined') {
						audioLength++;
					}
					if (typeof value.audio_option3 !== 'undefined') {
						audioLength++;
					}
				});

				if (audioLength) {
					angular.forEach($scope.question.queries, function(value, key) {
						if(value.audio){
							$scope.uploadFile(value.audio , (value.query + value.language))
								.then(function (res) {
									processedAudio++
									value.audioUrl = res.url;
								});
						}
						if(value.audio_option1){
							$scope.uploadFile(value.audio_option1 , (value.query + value.language))
								.then(function (res) {
									processedAudio++
									value.option1audio = res.url;
								});
						}
						if(value.audio_option2){
							$scope.uploadFile(value.audio_option2 , (value.query + value.language))
								.then(function (res) {
									processedAudio++
									value.option2audio = res.url;
								});
						}
						if(value.audio_option3){
							$scope.uploadFile(value.audio_option3 , (value.query + value.language))
								.then(function (res) {
									processedAudio++
									value.option3audio = res.url;
								});
						}
					});
					var interval = $interval(function(){
						if (processedAudio === audioLength) {
							createNewQuestion();
							$interval.cancel(interval);
						}
					}, 500);
				} else {
					createNewQuestion();
				}
			};


			///////////////////////////////////////////////////////////////////////////
			//////////////////  Excel Bulk Upload Part  /////////////////////////////////

				$scope.bulkUpload = function() {
					$scope.addQuestionSave = true;
					$scope.Upload();
				};

				$scope.Upload = function () {
					if (typeof (FileReader) != "undefined") {
						if($scope.bulk_upload_file){
							var reader = new FileReader();
							if (reader.readAsBinaryString) {
								reader.onload = function (e) {
									$scope.ProcessExcel(e.target.result);
								};
								reader.readAsBinaryString($scope.bulk_upload_file);
							} else {
								//For IE Browser.
								reader.onload = function (e) {
									var data = "";
									var bytes = new Uint8Array(e.target.result);
									for (var i = 0; i < bytes.byteLength; i++) {
										data += String.fromCharCode(bytes[i]);
									}
									$scope.ProcessExcel(data);
								};
								reader.readAsArrayBuffer($scope.SelectedFile);
							}
						}else{
							console.log("No Bulk Upload File");
						}
					} else {
						$window.alert("This browser does not support HTML5.");
					}
				};

				$scope.ProcessExcel = function (data) {
					var question_type={
						testType:$scope.temp.testType,
						isCommon:false,
						isSpecific:false
					};

					if ($scope.tempType.practiseType === 'common') {
						question_type.isCommon = true;
					} else if ($scope.tempType.practiseType === 'specific') {
						question_type.isSpecific = true;
					}
					//Read the Excel File data.
					var workbook = XLSX.read(data, {
						type: 'binary'
					});

					//Fetch the name of First Sheet.
					var firstSheet = workbook.SheetNames[0];

					//Read all rows from First Sheet into an JSON array.
					var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
					$http({
						method: 'POST',
						url: 'api/question/bulk',
						data: {
							data:excelRows,
							question_type:question_type
						}
					}).then(
						res=>{
							var urltype = '';
							if($stateParams.type == "isRealtime"){
								urltype = "realtime";
							}else if ($stateParams.type == "isCommon") {
								urltype = "common";
							}else if ($stateParams.type == "isSpecific") {
								urltype = "specific";
							}
							$scope.addQuestionSave = false;
							$state.go('app.questions', {category: $stateParams.category,type: urltype,save: true});

						},
						error=>{
							$scope.error = true;
							console.log(error);
						}
					)
				};
			/////////////////////// End Excel Uploading  ///////////////////////////////
			////////////////////////////////////////////////////////////////////////////





			$scope.saveItem = function() {
				if ($scope.item.id) {
					$http({
						method: 'PUT',
						url: 'api/language/update',
						data: $scope.item
					})
					.success(function(response, status, headers, config) {
							if (response.success === true) {
								$state.go('app.language', {save: true});
							} else {
								$scope.error = true;
							}
						})
						.error(function(response, status, headers, config) {
							$scope.error = true;
						});
				} else {

				}
			};

			$scope.removeItem = function(item) {
				var flag = confirm('Do you want to remove this element');
				if (flag) {
					$http.delete('api/question/delete?id=' + item.id)
						.success(function(response, status, headers, config) {
							if (response.success === true) {
								$scope.items.splice(($scope.items).indexOf(item), 1);
							} else {
								$scope.error = true;
							}
						})
						.error(function(response, status, headers, config) {
							$scope.error = true;
						});
				}
			};

			$scope.loadAssets = function() {
				$http.get('api/language/getall')
					.success(function(response, status, headers, config) {
						if (response.success === true) {
							var $translate = $filter('translate');
							$scope.addselect = $translate("register.form.select");
							//console.log($scope.checking);
							$scope.languages = [];
							$scope.languages.push({"code": "", "name": $scope.addselect });
							//$scope.languages = response.data;
							angular.forEach(response.data, function(value, key) {
								$scope.languages.push(value);
							});

							if (!$stateParams.id) {
								$scope.insertNewTranslation();
							}
						} else {
							$scope.error = true;
						}
					})
					.error(function(response, status, headers, config) {
						$scope.error = true;
					});

				$http.get('api/topics/getall')
					.success(function(response, status, headers, config) {
						if (response.success === true) {
							$scope.topics = response.data;
							$scope.question.topicArea = '';//$scope.topics[0];
						} else {
							$scope.error = true;
						}
					})
					.error(function(response, status, headers, config) {
						$scope.error = true;
					});
			};

			function uploadProgress(evt) {
                $scope.$apply(function(){
                    if (evt.lengthComputable) {
                        $scope.progress = Math.round(evt.loaded * 100 / evt.total)
                    } else {
                        $scope.progress = 'unable to compute'
                    }
                })
            }

             function uploadComplete(evt) {
                /* This event is raised when the server send back a response */
                //console.log(evt.target.responseText);
                return evt.target.responseText;

            }

            function uploadFailed(evt) {
                alert("There was an error attempting to upload the file.")
            }

            function uploadCanceled(evt) {
                scope.$apply(function(){
                    scope.progressVisible = false
                })
                alert("The upload has been canceled by the user or the browser dropped the connection.")
            }

            $scope.uploadFile = function(audio, questionName) {
                var defer = $q.defer()
                var uploadUrl = "api/question/audioupload";
                var fd = new FormData();
                fd.append('file', audio);
                fd.append('question_name', questionName);
                var xhr = new XMLHttpRequest()
                    xhr.upload.addEventListener("progress", uploadProgress, false)
                    xhr.addEventListener("load", function(evt){
                        var res = JSON.parse(evt.target.responseText);
                        console.log(res);
                        defer.resolve(res)

                    }, false)
                    xhr.addEventListener("error", function(err){

                        defer.reject(err)
                    }, false)
                    xhr.addEventListener("abort", uploadCanceled, false)
                    xhr.open("POST", uploadUrl)
                $scope.progressVisible = true
                xhr.send(fd)

                return defer.promise
                // return $http.post(uploadUrl, fd, {
                // transformRequest: angular.identity,
                // headers: {'Content-Type': undefined, 'Process-Data': false}
                // });

            }


			$scope.uploadPhoto = function() {
				var modal = $uibModal.open({
					templateUrl: 'app_v1/templates/upload_photo.tpl.html',
					controller: 'UploadController',
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
					$scope.question.photo = data;
					$scope.selectedQuestion.photo = data;
				}, function(data) {
					// console.log(data);
				});
			};

			$scope.removePhoto = function(){
				$scope.question.photo = "";
				$scope.selectedQuestion.photo = "";
			};

			$scope.uploadPhoto1 = function() {
				var modal = $uibModal.open({
					templateUrl: 'app_v1/templates/upload_photo.tpl.html',
					controller: 'UploadController',
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
					$scope.question.choice1photo = data;
					$scope.selectedQuestion.choice1photo = data;
				}, function(data) {
					// console.log(data);
				});
			};

			$scope.removeChoice1Photo = function(){
				$scope.question.choice1photo = "";
				$scope.selectedQuestion.choice1photo = "";
			};

			$scope.uploadPhoto2 = function() {
				var modal = $uibModal.open({
					templateUrl: 'app_v1/templates/upload_photo.tpl.html',
					controller: 'UploadController',
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
					$scope.question.choice2photo = data;
					$scope.selectedQuestion.choice2photo = data;
				}, function(data) {
					// console.log(data);
				});
			};

			$scope.removeChoice2Photo = function(){
				$scope.question.choice2photo = "";
				$scope.selectedQuestion.choice2photo = "";
			};

			$scope.uploadPhoto3 = function() {
				var modal = $uibModal.open({
					templateUrl: 'app_v1/templates/upload_photo.tpl.html',
					controller: 'UploadController',
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
					$scope.question.choice3photo = data;
					$scope.selectedQuestion.choice3photo = data;
				}, function(data) {
					// console.log(data);
				});
			};

			$scope.removeChoice3Photo = function(){
				$scope.question.choice3photo = "";
				$scope.selectedQuestion.choice3photo = "";
			};

			$scope.editItem = function(item) {
				$state.go('app.questions_edit', {id: item.id});
			};

			// Edit the Question
			$scope.loadQuestion = function() {
				$http.get('api/question/getinfo?id=' + $stateParams.id)
					.success(function(response) {
						if (response.success) {
							$scope.link_category = $window.localStorage.getItem('link_category');
							$scope.link_type = $window.localStorage.getItem('link_type');
							$scope.selectedQuestion = response.data;
							console.log(response.data);
							if ($scope.selectedQuestion.isRealtime) {
								$scope.test.type = 'realtime';
							} else {
								$scope.test.type = 'practise';
							}

							if ($scope.selectedQuestion.isCommon) {
								$scope.selectedPractiseTypesEdit = 'common';
								//$scope.selectedPractiseTypes.push('isCommon');
							}

							if ($scope.selectedQuestion.isSpecific) {
								$scope.selectedPractiseTypesEdit = 'specific';
								//$scope.selectedPractiseTypes.push('isSpecific');
							}

						}
					})
					.error(function(response) {
					});
			};

			function questionUpdate() {
				$scope.selectedQuestion.newTest = $scope.test;
				var langdup = 0;
				angular.forEach($scope.selectedQuestion.queries, function(value, key) {
					angular.forEach($scope.selectedQuestion.queries, function(lvalue, lkey) {
						if(key != lkey){
							if(value.language == lvalue.language){
								langdup = 1;
							}
						}
					});
				});
				if(langdup == 0){
					$http({
						method: 'POST',
						url: 'api/question/update',
						data: $scope.selectedQuestion
					})
					.success(function(response) {
						if(response.success) {
							$scope.editQuestionSave = false;
							$state.go('app.questions', {category: $scope.selectedQuestion.category,type: $scope.selectedQuestion.parent,save: true});
						}
					})
					.error(function(response) {$scope.editQuestionSave = false;});
				}else{
					var $translate = $filter('translate');
					alert($translate("table.ques_lang_msg"));
				}

			}

			$scope.test = {};
			$scope.updateQuestion = function() {
				$scope.editQuestionSave = true;
				// if ($scope.selectedPractiseTypes.length) {
				// 	for(var i=0; i< ($scope.selectedPractiseTypes.length); i++) {
				// 		if ($scope.selectedPractiseTypes[i] === 'isCommon') {
				// 			$scope.test.isCommon = true;
				// 		} else if ($scope.selectedPractiseTypes[i] === 'isSpecific') {
				// 			$scope.test.isSpecific = true;
				// 		}
				// 	}
				// }
				if ($scope.selectedPractiseTypesEdit === 'common') {
					$scope.test.isCommon = true;
				} else if ($scope.selectedPractiseTypesEdit === 'specific') {
					$scope.test.isSpecific = true;
				}

				var audioLength = 0;
				var processedAudio = 0
				angular.forEach($scope.selectedQuestion.queries, function(value, key) {
					if (typeof value.newAudio !== 'undefined') {
						audioLength++;
					}
					if (typeof value.newOption1Audio !== 'undefined') {
						audioLength++;
					}
					if (typeof value.newOption2Audio !== 'undefined') {
						audioLength++;
					}
					if (typeof value.newOption3Audio !== 'undefined') {
						audioLength++;
					}
				});

				if (audioLength) {
					angular.forEach($scope.selectedQuestion.queries, function(value, key) {

						if(value.newAudio){
							$scope.uploadFile(value.newAudio , (value.question + value.language))
								.then(function (res) {
									processedAudio++
									value.audioUrl = res.url;
								});
						}

						if(value.newOption1Audio){
							$scope.uploadFile(value.newOption1Audio , (value.question + value.language))
								.then(function (res) {
									processedAudio++
									value.option1audio = res.url;
								});
						}

						if(value.newOption2Audio){
							$scope.uploadFile(value.newOption2Audio , (value.question + value.language))
								.then(function (res) {
									processedAudio++
									value.option2audio = res.url;
								});
						}

						if(value.newOption3Audio){
							$scope.uploadFile(value.newOption3Audio , (value.question + value.language))
								.then(function (res) {
									processedAudio++
									value.option3audio = res.url;
								});
						}

					});
					var intervalEdit = $interval(function(){
						if (processedAudio === audioLength) {
							console.log("all file uploaded");
							questionUpdate();
							$interval.cancel(intervalEdit);
						}
					}, 500);
				} else {
					questionUpdate();
				}
			};

			$scope.removeQuestionElement = function($index) {
				if ($stateParams.id) {
					if (($scope.selectedQuestion.queries[$index].id)) {
						$scope.selectedQuestion.queries[$index].flag = 'deleted';
					} else {
						($scope.selectedQuestion.queries).splice($index, 1);
					}
				} else {
					($scope.question.queries).splice($index, 1)
				}
			};

			$scope.playAudio = function(id) {
			    var audio = document.getElementById(id);
				if(!$scope.stop){
			    	audio.play();
			    	$scope.stop = true;
				} else {
					audio.pause();
					audio.currentTime = 0;
					$scope.stop = false;
				}
			};

			$scope.toggleSelection = function toggleSelection(name) {
			    var idx = $scope.selectedPractiseTypes.indexOf(name);

			    // is currently selected
			    if (idx > -1) {
			      $scope.selectedPractiseTypes.splice(idx, 1);
			    }

			    // is newly selected
			    else {
			      $scope.selectedPractiseTypes.push(name);
			    }
			};

			$scope.toggleSelectionCommon = function toggleSelectionCommon(){
				$scope.selectedPractiseTypesEdit = 'common';
			};

			$scope.toggleSelectionSpecific = function toggleSelectionSpecific(){
				$scope.selectedPractiseTypesEdit = 'specific';
			};
			$scope.resetPractiseType = function () {
				$scope.selectedPractiseTypes = [];
			};
		}
	]);

angular.module(module)
	.filter('QuestionType', function() {
		return function(input, query) {
			if (!angular.isUndefined(input) && !angular.isUndefined(query)) {
				if (query) {
					var result = [];
					angular.forEach(input, function(value) {
						// var regx = new RegExp("(is)?("+value.parent+")","ig")
						// if (value[query] && regx.test(query)) {
						// 	result.push(value);
						// }
						if(query == "isRealtime"){
							if(value["isSpecific"]){
								result.push(value);
							}
						}else{
							if(value[query]){
								result.push(value);
							}
						}
					});
					return result;
				} else {
					return input;
				}
			} else {
				return input;
			}
		};
	});

angular.module(module)
	.filter('Language', function() {
		return function(input, question) {
			if (!angular.isUndefined(input) && !angular.isUndefined(question)) {
				if ((question.queries.length) > 1) {
					var selected = [];
					angular.forEach(question.queries, function(row) {
						selected.push(row.language);
					});

					var result = [];
					angular.forEach(input, function(row) {
						if (selected.indexOf(row.code) === -1) {
							result.push(row);
						}
					});
					return result;
				} else {
					return input;
				}
			} else {
				return input;
			}
		};
	});
