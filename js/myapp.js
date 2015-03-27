(function(){
	var app = angular.module('list', []);
	
	var cats = [
	{name: "Cat1", year: 2000, pic: "img/cat1.jpg"},
	{name: "Cat2", year: 2014, pic: "img/default.png", breed: "Maine Coon"},
	{name: "Cat3", pic: "img/cat3.jpg", breed: "Sphynx"}
	];
	var maxYear = new Date().getFullYear();
	var minYear = maxYear-45;
	
	app.controller('CatController', function(){
	
		this.cats = cats;
		this.curCat;
		
		this.setCurCat = function(index){
			this.curCat = this.cats[index];
		};
		this.countAge = function(year){
			var age = maxYear - year;
			if (age==1) return age+' year';
			else return age+' years';
		};
	});
	
	app.controller('TabController', function(){
		
		this.tab = 1;
		
		this.setTab = function(tab){
			this.tab = tab;
		};
		this.checkTab = function(tab){
			return (this.tab === tab);
		};
	});
	
	app.controller('AddController', function(){
		
		this.catsToAdd = [{name: ""}];
		this.minYear = minYear;
		this.maxYear = maxYear;
		
		this.setPreview = function(valid, curInput){
			if (valid && curInput) return curInput;
			else return 'img/default.png';
		}
		
		this.addCats = function(valid, form){
			if(valid) {
				for(var i = 0; i < this.catsToAdd.length; i++){
					if (!this.catsToAdd[i].pic) {
						this.catsToAdd[i].pic = "img/default.png";
					}
					cats.push(this.catsToAdd[i]);
					form.$setPristine();
				}
				this.catsToAdd = [{name: ""}];
			}
		};
		this.addMore = function(form){
			this.catsToAdd.push({name: ""});
			form.$setPristine();
		};
		this.moreThenOne = function(){
			return this.catsToAdd.length > 1;
		};
		this.deleteCat = function(index){
			this.catsToAdd.splice(index, 1);
		};
	});
	
	app.directive('year', function(){
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$validators.year = function(modelValue, viewValue) {
					if (ctrl.$isEmpty(modelValue)) {
						// consider empty models to be valid
						return true;
					}
					if (!isNaN(parseInt(viewValue)) && (parseInt(viewValue) >= minYear) && (parseInt(viewValue) <= maxYear)) {
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
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				var validExtensions = [".jpeg", ".jpg", ".png", ".gif"];
				ctrl.$validators.image = function(modelValue, viewValue) {
					if (ctrl.$isEmpty(modelValue)) {
						// consider empty models to be valid
						return true;
					}
					var pointIndex = viewValue.lastIndexOf('.');
					if (pointIndex === -1) {
						// URL does not have an extension, invalid
						return false;
					}
					var extension = viewValue.slice(pointIndex);
					if (validExtensions.indexOf(extension) !== -1) {
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