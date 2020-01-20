'use strict';
/**
 * @name Testing App
 */

// translations
var translationConfig = [
							'$translateProvider',
							function($translateProvider) {
								$translateProvider.useStaticFilesLoader({
								    prefix: '/app_v1/assets/i18n/',
								    suffix: '.json'
								});
								$translateProvider.preferredLanguage('en-en');
							}
						];

// App states and routes
var stateConfig = [
					'$stateProvider',
					'$urlRouterProvider',
					function($stateProvider, $urlRouterProvider) {
						$stateProvider
							.state('splash', {
								url: '/loading',
								templateUrl: '/app_v1/templates/loading.tpl.html',
								controller: 'LoadingController',
								onEnter: function(Authentication, $state) {
									if (Authentication.user) {
										$state.go('customize');
									}
								}
							})
							.state('login', {
								url: '/login',
								templateUrl: '/app_v1/templates/login.tpl.html',
								controller: 'LoginController',
								onEnter: function(Authentication, $state) {
									if (Authentication.user) {
										$state.go('customize');
									}
								}
							})
							.state('admin', {
								url: '/admin',
								templateUrl: '/app_v1/templates/adminlogin.tpl.html',
								controller: 'LoginController',
								onEnter: function(Authentication, $state) {
									if (Authentication.user) {
										$state.go('customize');
									}
								}
							})
							.state('register', {
								url: '/register',
								templateUrl: '/app_v1/templates/register.tpl.html',
								controller: 'LoginController',
								onEnter: function(Authentication, $state) {
									if (Authentication.user) {
										$state.go('customize');
									}
								}
							})
							.state('customize', {
								url: '/choose-options',
								templateUrl: '/app_v1/templates/customize.tpl.html',
								controller: 'CustomizeController',
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login');
									}
								}
							})
							.state('app', {
								url: '/app?test',
								views: {
									'': {
										templateUrl: '/app_v1/templates/home.tpl.html',
										controller: 'HomeController'
									},
									'left_panel@app': {
										templateUrl: '/app_v1/templates/left_panel.tpl.html',
										controller: 'HeaderController'
									},
									'header@app': {
										templateUrl: '/app_v1/templates/header.tpl.html',
										controller: 'HeaderController'
									},
									'section@app': {
										templateUrl: '/app_v1/templates/homepage.tpl.html'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.practise', {
								url: '/practise',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/practise.tpl.html'										
									}
								}
							})
							.state('app.topic_area', {
								url: '/topic_area?save',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/topic_area.tpl.html',
										controller: 'TopicsController'
									}
								}
							})
							.state('app.topic_area_add', {
								url: '/topic_area_add',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/topic_area_add.tpl.html',
										controller: 'TopicsController'
									}
								}
							})
							.state('app.topic_area_update', {
								url: '/topic_area_update?id',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/topic_area_update.tpl.html',
										controller: 'TopicsController'
									}
								}
							})
							.state('app.category', {
								url: '/category?save',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/category.tpl.html',
										controller: 'CategoryController'
									}
								}
							})
							.state('app.category_add', {
								url: '/category_add',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/category_add.tpl.html',
										controller: 'CategoryController'
									}
								}
							})
							.state('app.category_update', {
								url: '/category_update?id',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/category_update.tpl.html',
										controller: 'CategoryController'
									}
								}
							})
							.state('app.questionmanagement', {
								url: '/questionmanagement',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/question_management.tpl.html',
										controller: 'QuestionController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.questions', {
								url: '/questions?save&category&type',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/question.tpl.html',
										controller: 'QuestionController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.questions_add', {
								url: '/questions/add?category&type',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/question_add.tpl.html',
										controller: 'QuestionController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.questions_edit', {
								url: '/questions/edit?id',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/question_edit.tpl.html',
										controller: 'QuestionController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.profile', {
								url: '/profile',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/profile.tpl.html',
										controller: 'ProfileController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.students', {
								url: '/students?save',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/students.tpl.html',
										controller: 'AdminStudentController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.students_add', {
								url: '/students/create',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/students_add.tpl.html',
										controller: 'AdminStudentController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.students_profile', {
								url: '/students/profile?id',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/students_profile.tpl.html',
										controller: 'AdminStudentController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.testconfig', {
								url: '/testconfig',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/testconfig.tpl.html',
										controller: 'HomeController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.test_results', {
								url: '/results',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/result.tpl.html',
										controller: 'ResultController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.test_results_view', {
								url: '/results/view?id',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/result_view.tpl.html',
										controller: 'ResultController'
									}
								},
								onEnter: function(Authentication, $state) {
									if (!Authentication.user) {
										$state.go('login')
									}
								}
							})
							.state('app.logs', {
								url: '/logs',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/logs.tpl.html',
										controller: 'LogsController'
									}
								}
							})
							.state('app.reports', {
								url: '/reports',
								views: {
									'section@app': {
										templateUrl: '/app_v1/templates/reports.tpl.html',
										controller: 'ReportsController'
									}
								}
							})
							;

						$urlRouterProvider.otherwise('/loading');
					}
				];

// Authentication
var userAuthentication = [
					'$window',
					function($window) {
						return {
							user: $window.user,
							timer: '00:00:00'
						}
					}
				];


var $app = angular
				.module(module, [
					'ui.router',
					'pascalprecht.translate',
					'ngImgCrop',
					'ui.bootstrap',
					'ngMaterial'
				])
				.config(translationConfig)
				.config(stateConfig)
				.factory('Authentication', userAuthentication);

angular.element(document).ready(function() {
	angular.bootstrap(document, [module]);
});
