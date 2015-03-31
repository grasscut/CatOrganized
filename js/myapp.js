(function(){
	var app = angular.module('list', []);
	
	var maxYear = new Date().getFullYear();
	var minYear = maxYear-30;
	
	app.service('CatsService', function($http, $q) {
	
		var deferred = $q.defer();
		$http.get('json_data/cats.json').then(function(data) {
			deferred.resolve(data);
		});
		
		this.getCats = function() {
			return deferred.promise;
		};
	})
	
	app.service('BreedsService', function($http, $q) {
	
		var deferred = $q.defer();
		$http.get('json_data/breeds.json').then(function(data) {
			deferred.resolve(data);
		});
		
		this.getBreeds = function() {
			return deferred.promise;
		};
	})	
	
	app.controller('CatController', function($scope, CatsService, BreedsService){
	
		var promiseCats = CatsService.getCats();
		promiseCats.then(function(data) {
			$scope.cats = [];
			var jsonLength = data.data.length;
			for (var i = 0; i < jsonLength; i++) {
				var cat = data.data[i];
				$scope.cats.push(cat);
			}	
		});
		
		var promiseBreeds = BreedsService.getBreeds();
		promiseBreeds.then(function(data) {
			$scope.breeds = [];
			var jsonLength = data.data.length;
			for (var i = 0; i < jsonLength; i++) {
				var breed = data.data[i];
				$scope.breeds.push(breed);
			}	
		});
		
		$scope.curCat;
		$scope.editCat;
		$scope.catsToAdd = [{name: ""}];
		$scope.minYear = minYear;
		$scope.maxYear = maxYear;
		
		this.setCurCat = function(index){
			$scope.curCat = angular.copy($scope.cats[index]);
		};
		
		this.setEditCat = function(form) {
			$scope.editCat = angular.copy($scope.curCat);
			this.clearForm(form);
		}
		
		this.countAge = function(year){
			var age = maxYear - year;
			if (age==1) return age+' year';
			else return age+' years';
		};
		
		this.setPreview = function(valid, curInput){
			if (valid && curInput) return curInput;
			else return 'http://www.tud.ttu.ee/web/Olga.Orlova1/portfolio/3/img/default.png';
		}
		
		this.addCats = function(valid, form){
			if(valid) {
				for(var i = 0; i < $scope.catsToAdd.length; i++){
					if (!$scope.catsToAdd[i].pic) {
						$scope.catsToAdd[i].pic = "http://www.tud.ttu.ee/web/Olga.Orlova1/portfolio/3/img/default.png";
					}
					$scope.catsToAdd[i].id = $scope.cats[$scope.cats.length-1].id + 1;
					$scope.cats.push($scope.catsToAdd[i]);
					form.$setPristine();
				}
				$scope.catsToAdd = [{name: ""}];
			}
		};
		
		this.addMore = function(form){
			$scope.catsToAdd.push({name: ""});
			form.$setPristine();
		};
		
		this.moreThenOne = function(){
			return $scope.catsToAdd.length > 1;
		};
		
		this.deleteCat = function(index){
			$scope.catsToAdd.splice(index, 1);
		};
		
		this.editCat = function(valid, model, form) {
			if (valid) {
				$scope.curCat = model;
				for (var i = 0; i < $scope.cats.length; i++) {
					if ($scope.curCat.id == $scope.cats[i].id) {
						$scope.cats[i] = $scope.curCat;
						break;
					}
				}
				this.clearForm(form);
				$('#editCurCat').modal('hide');
			}
		};
		
		this.clearForm = function(form) {
			form.$rollbackViewValue();
			form.$setUntouched();
			form.$setPristine();
		};
	});
	
	app.controller('TabController', function($scope){
		
		$scope.tab = 1;
		
		this.setTab = function(tab){
			$scope.tab = tab;
		};
		this.checkTab = function(tab){
			return ($scope.tab === tab);
		};
	});
	
	
	app.directive('year', function(){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$validators.year = function(modelValue, viewValue) {
					if (ctrl.$isEmpty(viewValue)) {
						// consider empty models to be valid
						return true;
					}
					if (!isNaN(viewValue) && (parseInt(viewValue) >= minYear) && (parseInt(viewValue) <= maxYear)) {
						// it is valid
						return true;
					}
				// it is invalid
				return false;
				};
			}
		};
	});
	
	app.directive('image', function(){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				var validExtensions = [".jpeg", ".jpg", ".png", ".gif"];
				ctrl.$validators.image = function(modelValue, viewValue) {
					if (ctrl.$isEmpty(modelValue)) {
						// consider empty models to be valid
						return true;
					}
					var pointIndex = viewValue.lastIndexOf('.');
					if (pointIndex == -1) {
						// URL does not have an extension, invalid
						return false;
					}
					var extension = viewValue.slice(pointIndex);
					if (validExtensions.indexOf(extension) != -1) {
						// it is valid
						return true;
					}
				// it is invalid
				return false;
				};
			}
		};
	});
})();