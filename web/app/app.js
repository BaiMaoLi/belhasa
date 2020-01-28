'use strict';
/**
 * @name MyTest
 * @description Testing App module
 */
var $app = angular.module(module, ['ui.router', 'pascalprecht.translate', 'ngImgCrop', 'ui.bootstrap']);

// Routing configurations
$app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'app/templates/login.tpl.html',
				controller: 'LoginController',
				onEnter: function(Authentication, $state) {
					if (Authentication.user) {
						$state.go('app');
					}
				}
			})
			.state('register', {
				url: '/register',
				templateUrl: 'app/templates/login.tpl.html',
				controller: 'LoginController',
				onEnter: function(Authentication, $state) {
					if (Authentication.user) {
						$state.go('app');
					}
				}
			})
			.state('splash', {
				url: '/splash',
				templateUrl: 'app/templates/splash.tpl.html',
				controller: 'SplashController',
				onEnter: function(Authentication, $state) {
				}
			})
			.state('app', {
				url: 'app?test',
				views: {
					'': {
						templateUrl: 'app/templates/home.tpl.html',
						controller: 'HomeController'
					},
					'left_panel@app': {
						templateUrl: 'app/templates/left_panel.tpl.html',
						controller: 'HeaderController'
					},
					'header@app': {
						templateUrl: 'app/templates/header.tpl.html',
						controller: 'HeaderController'
					},
					'section@app': {
						templateUrl: 'app/templates/admin_homepage.tpl.html'
					}
				},
				onEnter: function(Authentication, $state) {
					if (!Authentication.user) {
						$state.go('login')
					}
				}
			})
			.state('app.language', {
				url: '/language?save',
				views: {
					'section@app': {
						templateUrl: 'app/templates/language.tpl.html',
						controller: 'LanguageController'
					}
				},
				onEnter: function(Authentication, $state) {
					if (!Authentication.user) {
						$state.go('login')
					}
				}
			})
			.state('app.language_save', {
				url: '/language/save?id',
				views: {
					'section@app': {
						templateUrl: 'app/templates/language_save.tpl.html',
						controller: 'LanguageController'
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
						templateUrl: 'app/templates/profile.tpl.html',
						controller: 'ProfileController'
					}
				},
				onEnter: function(Authentication, $state) {
					if (!Authentication.user) {
						$state.go('login')
					}
				}
			})
			.state('app.questions', {
				url: '/questions?save',
				views: {
					'section@app': {
						templateUrl: 'app/templates/question.tpl.html',
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
				url: '/questions/add',
				views: {
					'section@app': {
						templateUrl: 'app/templates/question_add.tpl.html',
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
						templateUrl: 'app/templates/question_edit.tpl.html',
						controller: 'QuestionController'
					}
				},
				onEnter: function(Authentication, $state) {
					if (!Authentication.user) {
						$state.go('login')
					}
				}
			})
			.state('app.test', {
				url: '/test?t&c',
				views: {
					'section@app': {
						templateUrl: 'app/templates/test.tpl.html',
						controller: 'TestController'
					}
				},
				onEnter: function(Authentication, $state) {
					if (!Authentication.user) {
						$state.go('login')
					}
				}
			})
			.state('app.students', {
				url: '/students',
				views: {
					'section@app': {
						templateUrl: 'app/templates/students.tpl.html',
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
						templateUrl: 'app/templates/students_profile.tpl.html',
						controller: 'AdminStudentController'
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
						templateUrl: 'app/templates/result.tpl.html',
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
						templateUrl: 'app/templates/result_view.tpl.html',
						controller: 'ResultController'
					}
				},
				onEnter: function(Authentication, $state) {
					if (!Authentication.user) {
						$state.go('login')
					}
				}
			})
			;

		$urlRouterProvider.otherwise('/splash')
	}
]);

$app.config([
	'$translateProvider',
	function($translateProvider) {
		$translateProvider.useStaticFilesLoader({
		    prefix: 'app/assets/i18n/',
		    suffix: '.json'
		});

		$translateProvider.preferredLanguage('en-en');
	}
]);

$app.factory('Authentication', [
	'$window',
	function($window) {
		return {
			user: $window.user
		}
	}
]);

angular.element(document).ready(function() {
	angular.bootstrap(document, [module]);
});