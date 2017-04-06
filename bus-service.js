var busApp = angular.module('busApp', []);

busApp.factory('BusService',function($http, $q, $cacheFactory){

	var busUrl  ="//webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni";
	var routesUrl = "//webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=sf-muni";

	function _getData(url){
		var deferred = $q.defer();
		$http({
			method: 'GET',
			url: url
			})
			.then(function(response){
				deferred.resolve(response.data);
			})
			.catch(function(e){
				deferred.reject(e);
			});
		return deferred.promise;
	};

	return{
		getBuses: function(){
			return _getData(busUrl);
		},
		getRoutes: function(){
			return _getData(routesUrl);
		}

	}

});
