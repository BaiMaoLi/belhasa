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
		'$scope', '$http', '$state', '$stateParams', '$location', '$rootScope', '$uibModal', 'fileUpload',
		function($scope, $http, $state, $stateParams, $location, $rootScope, $uibModal, fileUpload) {
			$scope.item = {};
			$scope.section = 'New Language Form';
			$scope.categories = ['LMV', 'MC', 'HVT and LB', 'FRLK', 'Instructor'];
			$scope.question = {
				queries: [],
				category: $scope.categories[0]
			};

			$scope.saveAlert = $stateParams.save;

			$scope.closeAlert = function() {
				$scope.saveAlert = false;
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
				if (!$stateParams.id) {
					$scope.getAll();
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
					$http.get('/api/question/getall?language=' + $scope.language.code)
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
					$http.get('/api/language/getbyid?id=' + $stateParams.id)
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

			$scope.newQuestion = function() {
				angular.forEach($scope.question.queries, function(value, key) {

					$scope.uploadFile(value.audio , (value.query + value.language))
						.then(function (res) {
							value.audioUrl = res.data.url;
							if (key+1 === $scope.question.queries.length) {
								$http({
									method: 'POST',
									url: '/api/question/create',
									data: $scope.question
								})
								.success(function(response, status, headers, config) {
									if (response.success === true) {
										$state.go('app.questions', {save: true});
									} else {
										$scope.error = true;
									}
								})
								.error(function(response, status, headers, config) {
									$scope.error = true;
								});
							}
						});
				});
			};

			$scope.saveItem = function() {
				if ($scope.item.id) {
					$http({
						method: 'PUT',
						url: '/api/language/update',
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
					$http.delete('/api/question/delete?id=' + item.id)
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
				$http.get('/api/language/getall')
					.success(function(response, status, headers, config) {
						if (response.success === true) {
							$scope.languages = response.data;
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
			};

			$scope.uploadFile = function(audio, questionName) {
				var uploadUrl = "api/question/audioupload";
				var fd = new FormData();
				fd.append('file', audio);
				fd.append('question_name', questionName);
				return $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined, 'Process-Data': false}
              	});
              			
			}

			$scope.uploadPhoto = function() {
				var modal = $uibModal.open({
					templateUrl: '/app/templates/upload_photo.tpl.html',
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
				}, function(data) {
					// console.log(data);
				});
			};

			$scope.editItem = function(item) {
				$state.go('app.questions_edit', {id: item.id});
			};

			// Edit the Question
			$scope.loadQuestion = function() {
				$http.get('/api/question/getinfo?id=' + $stateParams.id)
					.success(function(response) {
						if (response.success) {
							$scope.selectedQuestion = response.data;
						}
					})
					.error(function(response) {
					});
			};

			function questionUpdate() {
				$http({
					method: 'POST',
					url: '/api/question/update',
					data: $scope.selectedQuestion
				})
				.success(function(response) {
					if(response.success) {
						$state.go('app.questions', {save: true});
					}
				})
				.error(function(response) {});
			}

			$scope.updateQuestion = function() {
				angular.forEach($scope.selectedQuestion.queries, function(value, key) {
					if (typeof value.newAudio !== 'undefined') {
						$scope.uploadFile(value.newAudio , (value.question + value.language))
						.then(function (res) {
							value.audioUrl = res.data.url;
							if (key+1 === $scope.selectedQuestion.queries.length) {
								questionUpdate();
							}
						});
					} else {
						if (key+1 === $scope.selectedQuestion.queries.length) {
							questionUpdate();
						}
					}
				});
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
		}
	]);