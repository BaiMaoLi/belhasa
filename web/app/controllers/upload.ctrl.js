'use strict';

angular.module(module)
	.controller('UploadController', [
		'$scope', '$timeout', '$uibModalInstance',
		function($scope, $timeout, $uibModalInstance) {


			$scope.myImage='';
			$scope.myCroppedImage='';

			var handleFileSelect=function(evt) {
				var file=evt.currentTarget.files[0];
				var reader = new FileReader();
				reader.onload = function (evt) {
					$scope.$apply(function($scope){
						$scope.myImage=evt.target.result;
					});
				};
				reader.readAsDataURL(file);
			};

			$scope.initPlugin = function() {
				angular.element(document.querySelector('#fileInput')).ready(function() {
					$timeout(function() {
						angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
					}, 1000);
				});
			};

			$scope.save = function() {
				$uibModalInstance.close($scope.myCroppedImage);
			};
			$scope.cancel = function() {
				$uibModalInstance.dismiss();
			};
		}
	]);