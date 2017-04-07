busApp.directive('sfMap', function(BusService){
	//This is in charge of querying the NextBus Api throught the BusService every 15secs.
	return{
		restrict: 'E',
		scope: true,
		templateUrl: 'sf-map.template.html',
		controller: function($scope, $interval){
			BusService.getRoutes()
				.then(function(response){
					 $scope.routesData=response.route;
				 });

			$interval(function thisInterval(){
				BusService.getBuses()
					.then(function(response){
						$scope.busData = response.vehicle;
					});
				return thisInterval;
			}(), 8000);
		}
	}

	function sortByRoute(data){
		return d3.nest()
			.key(function(d) {return d.routeTag})
			.entries(data);
	};
})
