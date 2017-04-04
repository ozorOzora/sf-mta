var busApp = angular.module('busApp', []);

busApp.factory('BusService',function($http, $q, $cacheFactory){

	var url  ="//webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni";
	// TODO: Angular won't allow any parameter to be concatenated
	// at the end of the url string. FIND WORKAROUND

	var myMethods = {};
	return{
		getBuses: function(){
			var epochTime = String((new Date).getTime() - 5*60*1000);

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
		}
	}

});
