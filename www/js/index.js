// If you want to prevent dragging, uncomment this section
                /*
                 function preventBehavior(e) {
                 e.preventDefault();
                 };
                 document.addEventListener("touchmove", preventBehavior, false);
                 */

// add a listener for when the app is ready (to be called from the <body> tag
/*
function onBodyLoad() {
    document.addEventListener("deviceready",onDeviceReady,false);
}
*/

//fastclick.js instantiation to get rid of 300ms delay on click events...
window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

/* pull to refresh stuff */



function cbMapCallback(lat,lon) {
    alert('youve clicked ' + lat + ',' + lon);
}



// calculate the radius of the viewport in meters
calculateRadius = function(viewportLat, viewportLon, latitudeDelta, longitudeDelta, callback) {
	//console.log('start calc radius with viewportLat=' + viewportLat + ' viewportLon=' + viewportLon + ' latitudeDelta=' + latitudeDelta + ' longitudeDelta=' + longitudeDelta);
	// r = radius of the earth in meters
	var r = 6378100;  
    
	// Convert lat or lng from decimal degrees into radians (divide by 57.2958)
	var lat1 = viewportLat / 57.2958;
	//console.log(lat1); 
	var lon1 = viewportLon / 57.2958;
	///console.log(lon1); 
	var lat2 = (parseFloat(viewportLat) + parseFloat(latitudeDelta)) / 57.2958;
	//console.log(lat2); 
	var lon2 = (parseFloat(viewportLon) + parseFloat(longitudeDelta)) / 57.2958;
	//console.log(lon2); 
	
	// distance = circle radius from center to Northeast corner of bounds
	var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
	
	// the above actually gets us diameter, we want to halve it for radius
	dis = dis / 2;
	
	//console.log('distance calculated = ' + dis);
	
	if (callback && typeof(callback) === "function") {
		//console.log('done with calc radius, callback');
		callback(viewportLat, viewportLon, dis);
		
	}
	
}


// get a list of stops nearby
getStops = function(latitude,longitude,radius) {
	//console.log('getstops start, lat=' + latitude + ' long=' + longitude + ' radius=' + radius);
	
	$.mobile.loading( 'show' );
	
	getStopsJSON = $.getJSON('http://api.wmata.com/Bus.svc/json/JStops?lat=' + latitude + '&lon=' + longitude + '&radius=' + radius + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
		//console.log('ajax call done');
		$.mobile.loading( 'hide' );
		
		if (data.toString() == "<h1>504 Gateway Timeout</h1>") {
			console.log(data);
		} else {
			stops = data;
			//console.log(stops);

			// output to log
			markerStops(stops);
	
			//console.log(stops.Stops[0].Lat);
		}
		
	});
	
}


getStopsForRoute = function(routeID) {
	//console.log('getstops start');
	
	/* it's unclear why this one doesn't work, but all the other ones right before AJAX calls do. Anyway, we load this on on the pageshow event for the #route_map page instead.
	$.mobile.loading( 'show', {
		text: 'Loading',
		textVisible: false,
		theme: 'a',
		html: ""
	});
	*/
	getStopsForRouteFlag = false;
		
	getStopsForRouteJSON = $.getJSON('http://api.wmata.com/Bus.svc/json/JRouteDetails?routeID=' + routeID + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
		//console.log('ajax call done');
		console.log('getstopsforroute hide');
		getStopsForRouteFlag = true;
		$.mobile.loading( 'hide' );
		
		if (data.toString() == "<h1>504 Gateway Timeout</h1>") {
			console.log(data);
		} else {
			//console.log('getstopsforroute callback hide');
			//$.mobile.loading( 'hide' );
			stopsForRoute = data;
			
			//console.log(stopsForRoute);
			
			mapOptions2 = {

		        diameter: 1500,
		        lat: currentLatitude,
		        lon: currentLongitude

		    };
		    
		    //console.log('call mapoptions');
		    window.plugins.mapKit.setMapData(mapOptions2);
			
			markerStopPoints(stopsForRoute);
			
		}
		
	});
	
}



// make markers for each stop on a route (different functions for coming and going to do different colors)
markerStopPoints = function(data) {
	//console.log('start markerStopPoints');
	var pins0 = [];
	var pins1 = [];
	
	var inRangeLatitude = false;
	var inRangeLongitude = false;

	
	$.each(data.Direction0.Stops, function(i, object) {

		console.log('done with pin0 ' + i);
		
		pins0.push(
			{
				lat: data.Direction0.Stops[i].Lat,
				lon: data.Direction0.Stops[i].Lon,
				title: data.Direction0.Stops[i].Name,
				subTitle: data.Direction0.Stops[i].StopID,
				pinColor: "green",
				selected: false,
				index: i
			}
		);
	});
	
	$.each(data.Direction1.Stops, function(i, object) {
		//console.log('done with pin1 ' + i);
		
		pins1.push(
			{
				lat: data.Direction1.Stops[i].Lat,
				lon: data.Direction1.Stops[i].Lon,
				title: data.Direction1.Stops[i].Name,
				subTitle: data.Direction1.Stops[i].StopID,
				pinColor: "green",
				selected: false,
				index: i
			}
		);
	});


	
	
	//console.log(inRangeLongitude + ',' + inRangeLatitude);
	window.plugins.mapKit.addMapPins(pins0);
	window.plugins.mapKit.addMapPins(pins1);
	//console.log('markerstoppoints hide');
	//$.mobile.loading( 'hide' );
	//console.log(inRangeLongitude + ',' + inRangeLatitude);
	
	var pinLength = pins0.length;
	//console.log(pinLength);
	pinLength = parseInt(pinLength * 0.5);

	
}


//when a pin is deselected, kill any ajax calls
function annotationDeselect() {
	annotationTapJSON.abort();
};

// when a pin is clicked...
function annotationTap(text, latitude, longitude) {
	console.log('annotation tap');
	console.log(latitude);
	
	// if we just clicked a route map pin, we need to get the stops data loaded first to make a good infowindow, so do that then loop back to this function and show the infowindow
	if (routeMapView == true) {
		notInRangeStopID = text;
		favoriteBtnClickedFlag = true;
		getStops(latitude, longitude, '50');
	} else {
	
		self2 = this;
		//console.log('click!');
		stopID = text;
		var self2 = this;
		
	
		
		
		// only get this stuff if the annotation tapped is a stop, rather than part of a route map
		if (text != '(null)') {
			$.mobile.loading( 'show', {
				text: 'Loading',
				textVisible: false,
				theme: 'a',
				html: ""
			});
			annotationTapJSON = $.getJSON('http://api.wmata.com/NextBusService.svc/json/JPredictions?StopID=' + stopID + '&api_key=' + wmata_api_key + '&callback=?', function(data2, self4) {
				//console.log('predictions=' + data2.Predictions.length);
				//sorted = data2.Predictions.sort(function(a,b) {return b - a; });
				
				$.mobile.loading( 'hide' );
				// thanks to Vlad Lyga for this part: http://stackoverflow.com/questions/14308149/how-do-i-merge-two-json-objects-in-javascript-jquery
				predictions = data2;
				
				routeTimes = {
					minutes: {},
					directionText: {}
				};
	
		
				for (var index in predictions.Predictions) {
		
			        if(!routeTimes.minutes.hasOwnProperty(predictions.Predictions[index].RouteID)) {
		
			            routeTimes.minutes[predictions.Predictions[index].RouteID] = [];
			            routeTimes.directionText[predictions.Predictions[index].RouteID] = [];
		
			            if (predictions.Predictions[index].Minutes != 'undefined') {
		
			            	routeTimes.minutes[predictions.Predictions[index].RouteID].push(predictions.Predictions[index].Minutes);
		
			            }
			            routeTimes.directionText[predictions.Predictions[index].RouteID].push(predictions.Predictions[index].DirectionText);
		
			        } else {
		
			        	if (predictions.Predictions[index].Minutes != 'undefined') {
		
			        		routeTimes.minutes[predictions.Predictions[index].RouteID].push(predictions.Predictions[index].Minutes);
		
			        	}
			            routeTimes.directionText[predictions.Predictions[index].RouteID].push(predictions.Predictions[index].DirectionText);
		
			        }
			    }
			
			    // this function needs nearby stops already loaded to load all stops for the route, not just predictions, but maybe it shouldn't in case you want to see your favorite stops and they're not in range? Right now, I'll just make it load only routes with predictions, but eventually would be nice to do the second AJAX call to load this stop into memory
			    if (stops.length) {
			    	//console.log(stops.length);
			    	var 
			        	routes = stops.Stops[0].Routes,
			        	routesVsMinutes = {};
			    }
			    
			    if (stops.length) {
				    for(var i in routes) {
				        if (!routesVsMinutes.hasOwnProperty(routes[i])) {
				            routesVsMinutes[routes[i]] = {Minutes: []};
				        } 
				        if (routeTimes[routes[i]]) {
				            routesVsMinutes[routes[i]].Minutes = routeTimes[routes[i]];
				        }
				    } 
				}     
			    
			    //stops.Stops[0].Routes = routesVsMinutes;
			    //console.log(routeTimes);
			    //console.log('now to creatRouteList');
			    // create HTML for the infowindow
			    createRouteList(routeTimes);
			    //console.log(routeList);
			    $('#infowindow-routes').html(routeList);
			    
			    
			    // pass some variables to the next page if a button is clicked
			    $('.route-detail-btn').click(function() {
			    
			    	console.log('route btn clicked');
			
			    	routeClicked = $(this).attr('id');
			    	$('#route_map_title').html('Route ' + routeClicked);
			    
			    	$.mobile.changePage( "#route_map", { transition: "fade" } );
	
			    	
			    	
			    	
			    });
			    
			    //$( "#infowindow" ).popup( "open" );
			    
			    //console.log('show page');
			    // show the page
			    annotationTapJSON.abort();
			    
			    $.mobile.changePage( "#infowindow", { transition: "fade"} );
			    $('#infowindow-routes').listview('refresh');
			    $("#infowindow-content").iscrollview("refresh");
			    $('#infowindow-content').css('height', $('#infowindow').css('min-height'));
			    
			    	
		    });
		}
	}
}





// make a stop marker and info window
markerStops = function(data) {
	// make a new pins array to store new pins being added
	newPins = [];
	newPins.length = 0;
	
	//console.log('start markerStops');
	if (data.Stops.length) {
		$.each(data.Stops, function(i, object) {
	
			// our match function to see if a pin already exists in the global pin array
			matches = jQuery.grep(pins, function(obj) {
				//console.log(data.Stops[i].StopID + ' == ' + obj.subTitle + '?');
				return parseInt(obj.subTitle) == data.Stops[i].StopID;
			});
			
			if (matches.length == 0) {
				
				//console.log('no matches');
				//console.log(matches);
				
				// if this is a new pin, add it to the global pin array AND the new pin array
				pins.push(
					{
						lat: data.Stops[i].Lat,
						lon: data.Stops[i].Lon,
						title: data.Stops[i].Name,
						subTitle: data.Stops[i].StopID,
						pinColor: "green",
						selected: false,
						index: i
					}
				);
				
				newPins.push(
					{
						lat: data.Stops[i].Lat,
						lon: data.Stops[i].Lon,
						title: data.Stops[i].Name,
						subTitle: data.Stops[i].StopID,
						pinColor: "green",
						selected: false,
						index: i
					}
				);
			
			}
			
	
	
	        // loop through all routes in this stop and create a string from all of them
	        createRouteList = function(data) {
	        	console.log('createRouteList start');
				routeList = '';
				routeList.replace(routeList, '');
				potentialRouteList = [];
				potentialRouteList.length = 0;
				actualRouteList = [];
				potentialVsActual = [];
				
				// create a list of all possible routes at this stop
				$.each(stops.Stops, function(i2, object2) {
					if (stopID == stops.Stops[i2].StopID) {
						stopIDfocus = stops.Stops[i2].StopID;
						stopName = stops.Stops[i2].Name;
						potentialRouteList = stops.Stops[i2].Routes;
						stopLat = stops.Stops[i2].Lat;
						stopLon = stops.Stops[i2].Lon;
						//potentialRouteList.push(routeID);
					}
					
				});
				
				
				//potentialRouteList.length = 0;
				
				
				// make a diff method for determining the difference in arrays
				Array.prototype.diff = function(a) {
				    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
				};
				
				// make HTML for infowindow for actual buses that are coming
				if (predictions.Predictions.length) {
					//console.log('true');
					//console.log(data);
					dataWorld = data;
					$.each(data.minutes, function(i3, object) {
						
						// weed out undefined routes
						if (i3 != 'undefined'){
							//console.log('i3= ' + i3);
							routeList = routeList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>' + data.directionText[i3][0].replace(/North/,'N').replace(/South/,'S').replace(/East/,'E').replace(/West/,'W') + ' arrives in:</p><p><strong>' + data.minutes[i3].join(', ') + '</strong> minutes</p><span class="ui-li-count">' + i3 + '</span></li>';
						actualRouteList.push(i3);
						potentialVsActual = potentialRouteList.diff(actualRouteList);
						}
					});
					
					// then after, loop through routes with no predictions and add to the end
					$.each(potentialVsActual, function(i4, object4) {
						// check for the routes with a lowercase c or v in their name, they are variation routes and should be ignored
						if (/([cv])/.exec(potentialVsActual[i4]) == null) {
							routeList = routeList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + potentialVsActual[i4] + '"><p>no prediction available</p><span class="ui-li-count">' + potentialVsActual[i4] + '</span></a></li>';
						}
						
					});
				} else {
					
					// if there are no predictions at all, just do the stops
					$.each(potentialRouteList, function(i4, object4) {
						// check for the routes with a lowercase c or v in their name, they are variation routes and should be ignored
						if (/([cv])/.exec(potentialRouteList[i4]) == null) {			
							routeList = routeList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + potentialRouteList[i4] + '"><p>no prediction available</p><span class="ui-li-count">' + potentialRouteList[i4] + '</span></a></li>';
						}
					});
					
					actualRouteList.length = 0;
					potentialVsActual.length = 0;
	
				}
				
				//console.log('potential routes for stop ' + stopIDfocus + ': ' + potentialRouteList + ' and actual routes: ' + actualRouteList);
				//console.log(stopName);
	
				routeList = '<li data-role="list-divider" class="stopTitle" id="' + stopID + '" data-lat=' + stopLat + '" data-lon=' + stopLon + '"><span class="stopName">' + stopName + '</span></li>' + routeList;
				//console.log(routeList);
				
	        }
	
		});
		
		//console.log('add new pins');
		// show the new pins, but only if this is a real stop get, and not a favorite button or route annotation being clicked
		//if (favoriteBtnClickedFlag != true) {
			window.plugins.mapKit.addMapPins(newPins);
		//}
		
		// if we've clicked a favorite or route annotation, show the predictions
		if (favoriteBtnClickedFlag == true) {
			routeMapView = false;
			annotationTap(notInRangeStopID);
			favoriteBtnClickedFlag = false;
			
		}
		
	} else {
		
		// loop through all routes in this stop and create a string from all of them (this is a version for no stops in range)
        createRouteList = function(data) {
        	//console.log('createRouteList start');
			routeList = '';
			routeList.replace(routeList, '');
			potentialRouteList = [];
			potentialRouteList.length = 0;
			actualRouteList = [];
			potentialVsActual = [];
			
			//potentialRouteList.length = 0;
			
			
			// make a diff method for determining the difference in arrays
			Array.prototype.diff = function(a) {
			    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
			};
			
			// make HTML for infowindow for actual buses that are coming
			if (predictions.Predictions.length) {
				//console.log('true');
				//console.log(data);
				dataWorld = data;
				$.each(data.minutes, function(i3, object) {
					
					// weed out undefined routes
					if (i3 != 'undefined'){
						//console.log('i3= ' + i3);
						routeList = routeList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>' + data.directionText[i3][0].replace(/North/,'N').replace(/South/,'S').replace(/East/,'E').replace(/West/,'W') + ' arrives in:</p><p><strong>' + data.minutes[i3].join(', ') + '</strong> minutes</p><span class="ui-li-count">' + i3 + '</span></li>';
					actualRouteList.push(i3);
					potentialVsActual = potentialRouteList.diff(actualRouteList);
					}
				});
				
			} else {
				
				routeList = routeList + '<h2 class="center">No predictions available</h2>';

			}
			
			//console.log('potential routes for stop ' + stopIDfocus + ': ' + potentialRouteList + ' and actual routes: ' + actualRouteList);
			//console.log(stopName);

			routeList = '<li data-role="list-divider" class="stopTitle" id="' + stopID + '" data-lat=' + notInRangeStopLat + '" data-lon=' + notInRangeStopLon + '"><span class="stopName">' + notInRangeStopName + '</span></li>' + routeList;
			//console.log(routeList);
			
        }
	}
	
}






// if we get current position, set variables for current lat/long
onCurrentLocationSuccess = function(position) {
    currentLat = position.coords.latitude;
    currentLong = position.coords.longitude;
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;
    //currlocsuccess = currlocsuccess + 1;
    //console.log('currloc success!');
    mapOptions = {
        buttonCallback: "cbMapCallback",
        height: window.innerHeight - 92,
        diameter: 400,
        offsetTop: 43,
        lat: currentLat,
        lon: currentLong
    };
    
    window.plugins.mapKit.setMapData(mapOptions);
    

    
    //console.log('time to calculate radius!');
    
    // when we first call this, we can use the current location variables directly
    getStops(currentLat, currentLong, mapOptions.diameter);
    
   
    
    
   


	
	
	
 
};





// if we can't get current position, callback receives a PositionError object
function onCurrentLocationError(error) {
	//console.log('currloc error');
    navigator.notification.alert(
	    'Please allow BusTrackDC to access your current location by going to Settings > Privacy > Location Services and allowing BusTrackDC to use your current location.',  // message
	    console.log('currlocerror'),         // callback
	    "Couldn't find current location",            // title
	    'OK'                  // buttonName
	);
}


// function to store a favorite if the favorite button is tapped
function favoriteTap(favorite) { 
	//console.log('click ' + favorite);
	
	if (window.localStorage.getItem("favorites")) {
	//if (favoritesStorage) {
		//console.log('there is storage');
		
		var favorites = JSON.parse(window.localStorage.getItem("favorites"));
		//var favorites = JSON.parse(favoritesStorage);
		
		var favoriteMatches = jQuery.grep(favorites, function(obj) {
			//console.log(data.Stops[i].StopID + ' == ' + obj.subTitle + '?');
			return parseInt(obj.id) == favorite;
		});
		
		//console.log(favorites);
		if (favoriteMatches.length) {
			//console.log('match! remove');
			$( "#favorite" ).buttonMarkup({theme: 'd'});
			
			favorites = favorites.filter(function(el){ return el.id != favorite; });
			
			window.localStorage.setItem("favorites", JSON.stringify(favorites));
			//favoritesStorage = JSON.stringify(favorites);
			
			//console.log(favorites);
		} else {
			//console.log('no match! add');
			$( "#favorite" ).buttonMarkup({theme: 'e'});
			
			favorites.push({
				id: favorite,
				name: $('#infowindow .stopName').html(),
				lat: $('#infowindow .stopTitle').data('lat'),
				lon: $('#infowindow .stopTitle').data('lon')
			});
			
			window.localStorage.setItem("favorites", JSON.stringify(favorites));
			//favoritesStorage = JSON.stringify(favorites);
			
			//console.log(favorites);
			
		}
		
		
		
		
		
		
		
	} else {
		//console.log('no storage');
		//console.log(favorite);
		
		$( "#favorite" ).buttonMarkup({theme: 'e'});
		
		var favorites = [];
		
		favorites.push({
			id: favorite,
			name: $('#infowindow .stopName').html(),
			lat: $('#infowindow .stopTitle').data('lat'),
			lon: $('#infowindow .stopTitle').data('lon')
		});
		
		window.localStorage.setItem("favorites", JSON.stringify(favorites));
		//favoritesStorage = JSON.stringify(favorites);
		
		
	}

};


//our initial show map function
function showMap() {

	mapVisible = true;
    
    window.plugins.mapKit.showMap();
    //window.plugins.mapKit.setMapData(mapOptions);
    //window.plugins.mapKit.addMapPins(pins);
}

function hideMap() {
	mapVisible = false;
    window.plugins.mapKit.hideMap();
}

function clearPins() {
    window.plugins.mapKit.clearMapPins();
}

function resizeMap() {
    var mapOptions = {
        height:260
    }
    
    window.plugins.mapKit.setMapData(mapOptions);
}

function zoomIn() {
    var mapOptions = {
        diameter: 30
    }
    
    window.plugins.mapKit.setMapData(mapOptions);
}


function onDeviceReady() {
	
	deviceReadyFlag = true;
	//console.log('deviceready');
	
	mapOptions = {
        buttonCallback: "cbMapCallback",
        height: window.innerHeight - 92,
        diameter: 400,
        offsetTop: 43,
        lat: 38.8897,
        lon: -77.0089
    };
    
    showMap();
	
	//used for locally simulating local storage, comment out when not needed for debugging
	//favoritesStorage = '';
	
	// prevent some things from being scrollable
	$(document).delegate('.ui-footer', 'touchmove', false);
	$(document).delegate('.ui-header', 'touchmove', false);
	
	//('#infowindow').popup({ history: false });

	//console.log(device.model);
	// initialize a global pin array to store all pins onscreen
	pins = [];
	
	// show the map
	//showMap();
   
	
	//set the dark linen after the map is shown, so we don't see it on load (can also use darklinen-bg.png if you want...)
	/*
$('#gps_map').css('background-image','url("img/lightlinen-bg.png")');
	$('#gps_map').css('background-repeat-x','repeat');
	$('#gps_map').css('background-repeat-y','repeat');
*/

	currentLatitude = mapOptions.lat;
	currentLongitude = mapOptions.lon;
	
	currlocsuccess = 0;
		
	// set default page transition to slide
/*
	$("div[data-role=page]").bind("pagebeforeshow", function (e, data) {
    	$.mobile.silentScroll(0);
    	$.mobile.changePage.defaults.transition = 'fade';
    });
*/
    
    // get current position (which also shows nearby stops)
	navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
	
	// this needs to be in deviceReady so as not to make weird this website needs access to your location notices in the app...
	$(document).on('pageinit', '#gps_map', function() {
		
		if (deviceReadyFlag = true) {
			navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
		}
		
	});
	
	
	   
	    
	    // when the popup closes, restore the map view -- hopefully this can be removed later
	    /*
$( "#infowindow" ).bind({
		    popupafterclose: function(event, ui) { 
		    	if ($('#favorites_menu_content').css('display') == 'none') {
		    		window.plugins.mapKit.showMap();
		    	}/*
 else {
			    	$("#favorites_menu_btn").unbind("click");
			    	
			    	favoritesMenuBtnTap();
		    	}
*//*
				//history.back();
		    }
		});
*/
		
		
		
		//$(document).bind("mobileinit", function(){
			/*
			$.mobile.touchOverflowEnabled = true;
			$.mobile.buttonMarkup.hoverDelay = 100;
			console.log('init!');
*/
		//});
		
		
	
	    
	    /*
$('#close-btn').tap(function() {
		    window.plugins.mapKit.showMap();
	    });
*/

	//});
    
}

// initialization functions
/*
$(document).bind("mobileinit", function(){
  $.mobile.silentScroll(0);
    	$.mobile.changePage.defaults.transition = 'fade';
});
*/

$(document).on('pageinit', '#gps_map', function() {
	
	//console.log('init!');

	mapVisible = true;
	document.addEventListener("deviceready", onDeviceReady);
	
	routeMapView = false;
	
	// make the refresh button work
    $('.refresh_location').click(function() {
    	
    	/*
if ($('#favorites_menu_content').css('display') != 'none') {
			//console.log('true!');
			$( "#favorites_menu_btn" ).buttonMarkup({theme: 'd'});
			
			$('#favorites_menu_content').hide();
			$('#favorites_menu_header').hide();
		}
*/
    	
    	// when the refresh button is pressed, restore the map view -- hopefully this can be removed later
    	if (mapVisible == false) {
			showMap();
		}
    	navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
    });

});


$(document).on('pageinit', '#infowindow', function() {	
	
	// make the favorite button work
    $('#favorite').click(function() {
    	//console.log('click!');
    	favoriteTap($('.stopTitle').prop('id'));
    });
    
    
    
    $(".iscroll-wrapper", this).bind( "iscroll_onpulldown" , function() { 
    	refreshStopID = parseInt($('.stopTitle').attr('id'));
    	annotationTap(refreshStopID); 
    });
    
    //$('#infowindow-routes').scrollz();
    
    //favoritesMenuBtnTap();
    
});

$(document).on('pageinit', '#favorite_menu_page', function() {
	editFlag = false;
	
	$('#edit').click(function() {
	//console.log(editFlag);
		
		if (editFlag) {
			//console.log('true');
			// undo the UI stuff
			$( "#edit" ).buttonMarkup({theme: 'd'});
			$('#edit .ui-btn-text').html('Edit');
			$('.ui-li-has-arrow .ui-btn-inner a.ui-link-inherit').css('padding-right','inherit');
			$('.ui-li-static.ui-li-has-arrow').css('padding-right','inherit');
			$('.stopTitle, .favoriteMenuStopTitle').css('min-width','inherit');
			
			// undo the sorting
			$("#favorites_menu").sortable("destroy");
			
			$( "#favorites_menu" ).enableSelection();
			
			$( "#favorites_menu" ).unbind( "sortstop");
			
			// change the ui
			$('#favorites_menu .ui-icon-arrow-r').fadeIn('fast');
			$('#favorites_menu .drag-handle').fadeOut('fast');
			$('#favorites_menu .delete-handle').fadeOut('fast');
			
			$('#favorites_menu').listview('refresh');
			
			// deal with the new favorites list for the new order
			if (window.localStorage.getItem("favorites")) {
				
				var favorites = [];
				
				$.each($('#favorites_menu li'), function() {
					var id = $(this).prop('id');
					/*
					console.log(id);
					console.log('#favorites_menu #' + id + ' h1');
					console.log($('#favorites_menu #' + id + ' h1').html());
					console.log('#favorites_menu #' + id + ' .favorite-stop-detail-btn');
					console.log($('#favorites_menu #' + id + ' .favorite-stop-detail-btn').data('lat'));
					console.log($('#favorites_menu #' + id + ' .favorite-stop-detail-btn').data('lon'));
					*/
					
					favorites.push({
						id: id,
						name: $('#favorites_menu #' + id + ' h1').html(),
						lat: $('#favorites_menu #' + id + ' .favorite-stop-detail-btn').data('lat'),
						lon: $('#favorites_menu #' + id + ' .favorite-stop-detail-btn').data('lon')
					});
				});
				
				//console.log(favorites);
					
				window.localStorage.setItem("favorites", JSON.stringify(favorites));
					
			}
			
			// rebind the click handler
			$('.favorite-stop-detail-btn').click(function() {
				console.log($(this).data('stopid'));
				
				/*
$.mobile.loading( 'show', {
					text: 'Loading',
					textVisible: false,
					theme: 'a',
					html: ""
				});
*/
		
				// store a variable on this stop's name in case we need to retrieve it later...
				notInRangeStopID = $(this).data('stopid');
				notInRangeStopName = $(this).data('stopname');
				notInRangeStopLat = $(this).data('lat');
				notInRangeStopLon = $(this).data('lon');
		
				// if we click a favorite, get the stop and populate the stops array really quick, so we can view all the data about the predictions
				favoriteBtnClickedFlag = true;
				getStops(notInRangeStopLat, notInRangeStopLon, '50');
	
			});
			
			editFlag = false;
		} else {
			//console.log('false');
			// ui stuff
			$( "#edit" ).buttonMarkup({theme: 'e'});
			$('#edit .ui-btn-text').html('Done');
			$('.ui-li-has-arrow .ui-btn-inner a.ui-link-inherit').css('padding-right','80px');
			$('.ui-li-static.ui-li-has-arrow').css('padding-right','80px');
			$('.stopTitle, .favoriteMenuStopTitle').css('min-width','220px');
			
			$('#favorites_menu .ui-icon-arrow-r').fadeOut('fast');
			$('#favorites_menu .drag-handle').fadeIn('fast');
			$('#favorites_menu .delete-handle').fadeIn('fast');
			
			//drag and drop sorting, adapted from http://forresst.github.com/2012/06/22/Make-a-list-jQuery-Mobile-sortable-by-drag-and-drop/
			$( "#favorites_menu" ).sortable({
				 handle: ".drag-handle",
				 axis: "y",
				 scrollSensitivity: 500,
				 scroll: true
			});
		    $( "#favorites_menu" ).disableSelection();
		    
		    $( "#favorites_menu" ).bind( "sortstop", function(event, ui) {
		    	$('#favorites_menu').listview('refresh');
		    });
		    
		    // take off the click handler while in edit mode to allow clicking on the delete button
		    $('.favorite-stop-detail-btn').off('click');
		    
		    $('.delete-handle').click(function() {
		    	//console.log($(this).parent().data('stopid'));
		    	var favorites = JSON.parse(window.localStorage.getItem("favorites"));
		    	
		    	console.log(favorites);
		    	
		    	var deletedElementID = $(this).parent().data('stopid');
		    	
		    	favorites = favorites.filter(function(el){ return el.id != deletedElementID });
		    	
		    	$('#favorites_menu #' + deletedElementID).remove();
		    	
		    	console.log(favorites);
			
		    	window.localStorage.setItem("favorites", JSON.stringify(favorites));
		    });

		    
		    editFlag = true;
		}
		
	});
});

/*

$(document).on('pageinit', '#route_map', function() {
	favoritesMenuBtnTap();
});
*/

//page show functions
$(document).on('pagebeforeshow', '#gps_map', function() {

	//console.log(window.history);
	if (mapVisible == false) {
		showMap();
	}

	if (typeof(currentLatitude) === 'undefined') {
		console.log('true');
	} else {
		console.log(currentLatitude);
		console.log(currentLongitude);
		if (pins.length == 0) {
			getStops(currentLatitude, currentLongitude, '800');
		}
		
	}
	

	
	 // timeout needed to prevent UI lock -- the onMapMove function is called a lot during initialization, so we want to bypass that
    window.setTimeout(function() {
    
	    geo = window.geo || {};
	    
	    // save some data on the previous location so we can see how much we move...
	    geo.beforeMapMove = function(currentLat,currentLon,latitudeDelta,longitudeDelta) {
			previousLat = currentLat;
			previousLon = currentLon;
	    }
	    
	    // whenever the map moves, get the new location and radius and show nearby stops
		geo.onMapMove = function(currentLat,currentLon,latitudeDelta,longitudeDelta) {
		
			
			currentLatitude = currentLat;
			currentLongitude = currentLon;
			
			// if the map doesn't move much, no need to redraw the pins...
			if (((Math.abs(previousLat - currentLat)*8) > latitudeDelta) || ((Math.abs(previousLon - currentLon)*8) > longitudeDelta)) {
				if ($('.refresh_location').length) {
					//console.log('TRUE! ' + previousLat + ' - ' + currentLat + ' = ' + (Math.abs(previousLat - currentLat)*2) + ' with latitudeDelta = ' + latitudeDelta + ' and ' + previousLon + ' - ' + currentLon + ' = ' + (Math.abs(previousLon - currentLon)*2) + ' with longitudeDelta = ' + longitudeDelta);
					
					//console.log('TRUE');
					
					calculateRadius(currentLat, currentLon, latitudeDelta, longitudeDelta, function(viewportLat, viewportLon, radius) {
						// prevent huge radii in the viewport from crashing the app
						//console.log(radius);
						if (radius < 2000) {
							getStops(viewportLat, viewportLon, radius);
						}
						
					});
				} else {
					//console.log('FALSE');
				}
			} else {
				//console.log('FALSE! ' + previousLat + ' - ' + currentLat + ' = ' + (Math.abs(previousLat - currentLat)*2) + ' with latitudeDelta = ' + latitudeDelta + ' and ' + previousLon + ' - ' + currentLon + ' = ' + (Math.abs(previousLon - currentLon)*2) + ' with longitudeDelta = ' + longitudeDelta);
			}
			
		};
		
		// use underscore.js to reate limit and debounce this function that gets called a ton of times when a user scrolls
		delay = 500;
		geo.onMapMove = _.debounce(geo.onMapMove, delay); // this is too long, set it long on startup but thereafter set it short
	}, 3000);
	
	/*
if (deviceReadyFlag = true) {
		navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
	}
*/
	
});



$(document).on('pagebeforeshow', '#favorite_menu_page', function() {
	
	//console.log(window.localStorage.getItem("favorites"));
	
	if (mapVisible == true) {
		hideMap();
	}
	
	if (window.localStorage.getItem("favorites") == '[]') {
		//console.log('empty array');
		$('#favorites_menu').html('<h2 class="center">You haven\'t added any<br/>favorite stops yet!</h2><h2 class="center">Click the star icon<br/>when viewing a stop to<br/>add it as a favorite.</h2>').listview('refresh');

	} else if (window.localStorage.getItem("favorites")) {
		
		//console.log('favoriates');
		
		var favorites = JSON.parse(window.localStorage.getItem("favorites"));
		//var favorites = JSON.parse(favoritesStorage);
		
	
		
		favoritesListHTML = '';
		
		$.each(favorites, function(i, object) {
			favoritesListHTML = favoritesListHTML + '<li id="' + object.id + '"><a data-transition="slide" class="favorite-stop-detail-btn" data-stopid="' + object.id + '" data-stopname="' + object.name + '" data-lat="' + object.lat + '" data-lon="' + object.lon + '"><h1 class="favoriteMenuStopTitle">' + object.name +'</h1><p>#'+ object.id + '</p><p class="delete-handle">Delete</p><p class="drag-handle">Sort</p></a></li>';
		});
		
		
		
		//console.log(favoritesListHTML);
		$('#favorites_menu').html(favoritesListHTML).listview('refresh');
		
		$('.favorite-stop-detail-btn').click(function() {
			console.log($(this).data('stopid'));
			
			$.mobile.loading( 'show', {
				text: 'Loading',
				textVisible: false,
				theme: 'a',
				html: ""
			});
	
			// store a variable on this stop's name in case we need to retrieve it later...
			notInRangeStopID = $(this).data('stopid');
			notInRangeStopName = $(this).data('stopname');
			notInRangeStopLat = $(this).data('lat');
			notInRangeStopLon = $(this).data('lon');
	
			// if we click a favorite, get the stop and populate the stops array really quick, so we can view all the data about the predictions
			favoriteBtnClickedFlag = true;
			getStops(notInRangeStopLat, notInRangeStopLon, '50');

		});
		
	} else {
		//console.log('nothing');
		$('#favorites_menu').html('<h2 class="center">You haven\'t added any<br/>favorite stops yet!</h2><h2 class="center">Click the star icon<br/>when viewing a stop to<br/>add it as a favorite.</h2>').listview('refresh');
	}
	
	

});

$(document).on('pagebeforeshow', '#infowindow', function() {
	
	//console.log(window.history);
	
	
	 // deal with favorite button UI
	if (window.localStorage.getItem("favorites")) {
	//if (favoritesStorage) {
		//console.log('true');
		
		var favorites = JSON.parse(window.localStorage.getItem("favorites"));
		//favorites = JSON.parse(favoritesStorage);
		
		var favoriteMatches = jQuery.grep(favorites, function(obj) {
			//console.log(data.Stops[i].StopID + ' == ' + obj.subTitle + '?');
			if (stopID) {
				return parseInt(obj.id) == stopID;
			} else {
				return parseInt(obj.id) == notInRangeStopID;
			}
			
		});
		
		console.log(favoriteMatches);
		if (favoriteMatches.length) {		
			$( "#favorite" ).buttonMarkup({theme: 'e'});
		} else {
			$( "#favorite" ).buttonMarkup({theme: 'd'});
		}	
	}
	
	 // hide the map when we show the jQuery stuff, hopefully this can be eliminated in the future...
    $('#infowindow-routes').listview('refresh');
    $("#infowindow-content").iscrollview("refresh");
    $('#infowindow-content').css('height', $('#infowindow').css('min-height'));
    
    
    
    if (mapVisible == true) {
		hideMap();
	}
	
	
	
});

$(document).on('pageshow', '#infowindow', function() {

	
	 // hide the map when we show the jQuery stuff, hopefully this can be eliminated in the future...
    $('#infowindow-routes').listview('refresh');
    $("#infowindow-content").iscrollview("refresh");
    $('#infowindow-content').css('height', $('#infowindow').css('min-height'));

	
});


$(document).on('pagebeforeshow', '#route_map', function() {
  	
  	//console.log(window.history);
  	
  	//console.log('route map show');
  	window.plugins.mapKit.clearMapPins();
    pins.length = 0;
  
    if (mapVisible == false) {
		showMap();
	}
	
	// for route map views, we don't want to be loading new pins all the time, so replace the home onMapMove function with this, which just updates the current lat/lon so the map view never moves
	geo.onMapMove = function(currentLat,currentLon,latitudeDelta,longitudeDelta) {
		currentLatitude = currentLat;
		currentLongitude = currentLon;		
	};
	
	routeMapView = true;
	
	//console.log(routeClicked);
	getStopsForRoute(routeClicked);
});

$(document).on('pageshow', '#route_map', function() {
	console.log(getStopsForRouteFlag);
	
	if (getStopsForRouteFlag == false) {
		$.mobile.loading( 'show', {
			text: 'Loading',
			textVisible: false,
			theme: 'a',
			html: ""
		});
	}
	
});



//on page hide functions
$(document).on('pagebeforehide', '#route_map', function() {
	routeMapView = false;
	
	window.plugins.mapKit.clearMapPins();
	//console.log('getstopsjson abort!');
	getStopsForRouteJSON.abort();
});

//on page hide functions
$(document).on('pagebeforehide', '#gps_map', function() {
	
	//annotationTapJSON.abort();
	//getStopsJSON.abort();

});

$(document).on('pagebeforehide', '#favorite_menu_page', function() {
	$( "#edit" ).buttonMarkup({theme: 'd'});
	$('#edit .ui-btn-text').html('Edit');
	$('.ui-li-has-arrow .ui-btn-inner a.ui-link-inherit').css('padding-right','inherit');
	$('.ui-li-static.ui-li-has-arrow').css('padding-right','inherit');
	$('.stopTitle, .favoriteMenuStopTitle').css('min-width','inherit');
	$('.ui-listview-filter input').val('');
});


/***********************************************************************************************/