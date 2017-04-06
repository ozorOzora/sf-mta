busApp.directive('busMap', function(){
	return{
		restrict: 'E',
		scope: { data: "="},
		controller: controller,
		link: link,
	};

	function controller($scope, $window, $rootScope){
		console.log($scope);

		// We load two GEOjson
		d3.json('data/streets.json', function(err, streets){
			if(err) return console.log(err);
			$scope.mapDataStreets = streets;
			$scope.$broadcast("mapLoadedEvent");
		});

		d3.json('data/neighborhoods.json', function(err, land){
			if(err) return console.log(err);
			$scope.mapDataLand = land;
			$scope.$broadcast("mapLoadedEvent");
		});

		// We watch for user window resize
		angular.element($window).on('resize', function(){ $scope.$apply() });

	}
	function link(scope, el){
		el = el[0];
		var w, h, projection;
		var loadedMaps=0;
		var drawnMaps = false;
		var svg = d3.select(el).append('svg');
		var gLandMap = svg.append('g')
			.attr('class', 'land-map');
		var gStreetsMap = svg.append('g')
				.attr('class', 'streets-map');
		var gBuses = svg.append('g')
			.attr('class', 'buses');

		// This triggers the resize of the window
		scope.$watch(function(){
			w = el.clientWidth;
		   h = el.clientHeight;
	      return w + h;
	    }, resize);

		 function resize(){
			 svg.attrs({"width":w,"height":h});
		 }

		 // When both the geoJSON files are loaded, drawMaps fires
		 scope.$on('mapLoadedEvent', function(){
			 if(++loadedMaps==2)drawMaps();
		 });
		 function drawMaps(){
			 var streets = scope.mapDataStreets,
				 land = scope.mapDataLand;
			 var bounds = d3.geoBounds(streets);
			 var centerX = d3.sum(bounds, function(d) {return d[0];})/2;
			 var centerY = d3.sum(bounds, function(d) {return d[1];})/2;
			 projection = d3.geoMercator()
				 .scale(350000)
				 .center([centerX,centerY])
				 .translate([w/2,h/2]);

			 var path = d3.geoPath().projection(projection);

			 gLandMap.selectAll("path")
				 .data(land.features)
				 .enter().append("path")
				 .style("stroke", "#126563")
				 .style("fill", "#01130c")
				 .style("stroke-width", "1")
				 .attr("d", path);

			 gStreetsMap.selectAll("path")
				 .data(streets.features)
				 .enter().append("path")
				 .style("stroke", "#00351d")
				 .style("fill", "none")
				 .style("stroke-width", "1")
				 .attr("d", path);

				scope.$broadcast("mapsDrawn");
		 }
		 scope.$on('mapsDrawn', function(){
			 drawnMaps = true;
		});

		var listener = scope.$watch('data', function(data){
			!d3.select('g.route').size() ? initBuses(data):updateBuses(data);
		}, true);

		function initBuses(data){
			if(typeof data!="object" || !drawnMaps) return;
			gBuses = gBuses.selectAll('g.route')
				.data(data, d=>{return d ? d.key : this.id}).enter().append('g')
					.attr('class', 'route')
					.attr('id', d =>{return d.key});

			gBuses.selectAll('circle')
				.data(d =>{ return d.values }, d=>{return d? d.id : this.id})
				.enter().append('circle')
				.attr('class', 'bus')
				.attr('id', d =>{return d.id})
				.attr('cx', function(d){return projection([d.lon,0])[0]})
				.attr('cy', function(d){return projection([0,d.lat])[1]})
				.attr('r', 1.5)
				.attr('fill', 'red');
		}

		function updateBuses(data){
			//console.log(data);


			gBuses.selectAll('g.route')
				.data(data, d => {return d ? d.key : this.id});

			gBuses.enter().append('g')
				.attr('class', 'route')
				.attr('id', d => { return d.key});
			gBuses.exit().remove();

			gBuses.selectAll('circle')
				.data( (d,i) => {return data[i].values; }, d=>{return d? d.id : this.id})
				.transition()  // Transition from old to new
            .duration(1000)
			  	.attr('cx', function(d){return projection([d.lon,0])[0]})
			 	.attr('cy', function(d){return projection([0,d.lat])[1]});
		}
	}
});