busApp.directive('busFilter', function(){
	return{
		restrict: 'E',
		scope: {'routesData': '=', filteredBuses: '='},
		controller: controller,
		templateUrl: 'filter.template.html'
	}
	function controller($scope){
		$scope.showOptions = false;
		$scope.toggle = function(){
			 $scope.showOptions = !$scope.showOptions;
		}

		$scope.$watch('routesData', function (routesData){
			if(!routesData) return;
			$scope.options = routesData.map( d => { return d.title});
			$scope.selected = $scope.options.map( () => { return true});
			$scope.count = $scope.selected.filter(isSelected).length;
			$scope.$parent.filteredRoutes = $scope.routesData.filter( (d,i) => {return $scope.selected[i]}).map(d => { return d.tag});
			$scope.update();
		});

		$scope.update = function(){
			if(!$scope.$parent.busData) return;
			$scope.count = $scope.selected.filter(isSelected).length;
			$scope.$parent.filteredRoutes = $scope.routesData.filter( (d,i) => {return $scope.selected[i]}).map(d => { return d.tag});
			$scope.$parent.filteredBuses = $scope.$parent.busData.filter( d => { return $scope.$parent.filteredRoutes.indexOf(d.routeTag)!=-1 });
		}
		function isSelected(element) {return element;}
	}
});
