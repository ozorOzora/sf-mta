busApp.directive('sfMap', function(BusService){
	//This is in charge of querying the NextBus Api throught the BusService every 15secs.
	return{
		restrict: 'E',
		scope: {data : "="},
		template: '<bus-map data="busData"></bus-map>',
		controller: function($scope, $interval){
			$interval(function thisInterval(){
				BusService.getBuses()
					.then(function(response){
						response.vehicle.forEach(function(d){
							d.startPosition=[d.lon,d.lat];
							d.color; //TODO: set a color corresponding to each bus line
							d.endPosition; //TODO: predicted position of the bus
						})
						$scope.busData=response;
						console.log($scope.busData);
					});
				return thisInterval;
			}(), 15000);

		}
	}
})
