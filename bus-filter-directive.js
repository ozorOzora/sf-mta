busApp.directive('busFilter', function(){
	return{
		restrict: 'E',
		scope: {'filteredBuses': '=', 'routesData': '='},
		controller: controller,
		templateUrl: 'filter.template.html',
		link: link
	}
	function controller($scope){
		$scope.showOptions = false;
		$scope.toggle = function(){
			 $scope.showOptions = !$scope.showOptions;
		}
		$scope.$watch('routesData', function (routesData){
			if(!routesData) return;
			$scope.options = routesData.map(function(d){ return d.title});
			$scope.selected = $scope.options.map(function(){ return true});
			$scope.count = $scope.selected.filter(isSelected).length
		});


		$scope.update = function(){
			  $scope.count = $scope.selected.filter(isSelected).length
			  console.log($scope.selected);
		}
		function isSelected(element) {return element;}
	}
	function link(scope, el){

	}
});
