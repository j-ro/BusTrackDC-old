// If you want to prevent dragging, uncomment this section
                /*
                 function preventBehavior(e) {
                 e.preventDefault();
                 };
                 document.addEventListener("touchmove", preventBehavior, false);
                 */

// add a listener for when the app is ready (to be called from the <body> tag
function onBodyLoad() {
    document.addEventListener("deviceready",onDeviceReady,false);
}

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
		
	$.getJSON('http://api.wmata.com/Bus.svc/json/JStops?lat=' + latitude + '&lon=' + longitude + '&radius=' + radius + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
		//console.log('ajax call done');
		
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
		
	$.getJSON('http://api.wmata.com/Bus.svc/json/JRouteDetails?routeID=' + routeID + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
		//console.log('ajax call done');
		
		if (data.toString() == "<h1>504 Gateway Timeout</h1>") {
			console.log(data);
		} else {
			stopsForRoute = data;
			
			//console.log(stopsForRoute);
			
			mapOptions2 = {
		        buttonCallback: "cbMapCallback",
		        height: window.innerHeight - 55,
		        diameter: 1500,
		        offsetTop: 0,
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
	//console.log(data);
	//console.log('start markerStopPoints');
	$.each(data.Direction0.Stops, function(i, object) {

		//console.log('done with pin0 ' + i);
		
		pins0.push(
			{
				lat: data.Direction0.Stops[i].Lat,
				lon: data.Direction0.Stops[i].Lon,
				title: data.Direction0.Stops[i].Name,
				pinColor: "green",
				selected: false,
				index: i
			}
		);
		
		/*
// create stop name UI
        var createStopName = function() {
			stopNameUI = '<li data-role="list-divider">' + data.Direction0.Stops[i].Name + '</li>';			
        }
		

		// add the marker and info window on click
	    $('#map_canvas2').gmap('addMarker', { 
	    	'position': data.Direction0.Stops[i].Lat + ', ' + data.Direction0.Stops[i].Lon, 
	    	'bounds': false, 
	    	'icon': pin2,
	    	'shadow': shadow2
	    }, function() { //console.log('done with marker ' + i + ' at ' + data.Direction0.Stops[i].Name + ' at ' + data.Direction0.Stops[i].Lat + ',' + data.Direction0.Stops[i].Lon); 
	    }).click(function() {
	    	//console.log('click!');

		    createStopName();
		    
		    $('#infowindow2-routes').html(stopNameUI).listview( 'refresh' );
		    
		    $( "#infowindow2" ).popup( "open" );
	
       });
*/
            
	});
	
	$.each(data.Direction1.Stops, function(i, object) {
		//console.log('done with pin1 ' + i);
		
		pins1.push(
			{
				lat: data.Direction1.Stops[i].Lat,
				lon: data.Direction1.Stops[i].Lon,
				title: data.Direction1.Stops[i].Name,
				pinColor: "green",
				selected: false,
				index: i
			}
		);
		
		// create stop name UI
       /*
 var createStopName = function() {
			stopNameUI2 = '<li data-role="list-divider">' + data.Direction1.Stops[i].Name + '</li>';	
		}		
        

		// add the marker and info window on click
	    $('#map_canvas2').gmap('addMarker', { 
	    	'position': data.Direction1.Stops[i].Lat + ', ' + data.Direction1.Stops[i].Lon, 
	    	'bounds': false, 
	    	'icon': pin3,
	    	'shadow': shadow3
	    }, function() { //console.log('done with marker ' + i + ' at ' + data.Direction1.Stops[i].Name + ' at ' + data.Direction1.Stops[i].Lat + ',' + data.Direction0.Stops[i].Lon); 
	    }).click(function() {
	    	//console.log('click!');
	    	createStopName();
		    
		    $('#infowindow2-routes').html(stopNameUI2).listview( 'refresh' );
		    
		    $( "#infowindow2" ).popup( "open" );
	
       });
*/
	});
	
	window.plugins.mapKit.addMapPins(pins0);
	window.plugins.mapKit.addMapPins(pins1);
	
	
	
}


// when a pin is clicked...
function annotationTap(text) {
	//console.log('start annotationTap');
	
	self2 = this;
	//console.log('click!');
	stopID = text;
	var self2 = this;
	
	// only get this stuff if the annotation tapped is a stop, rather than part of a route map
	if (text != '(null)') {
		$.getJSON('http://api.wmata.com/NextBusService.svc/json/JPredictions?StopID=' + stopID + '&api_key=' + wmata_api_key + '&callback=?', function(data2, self4) {
			//console.log('predictions=' + data2.Predictions.length);
			//sorted = data2.Predictions.sort(function(a,b) {return b - a; });
			
			
			// thanks to Vlad Lyga for this part: http://stackoverflow.com/questions/14308149/how-do-i-merge-two-json-objects-in-javascript-jquery
			predictions = data2;
			
			routeTimes = {
				minutes: {},
				directionText: {}
			};
	
		    /* working version...
	for (var index in predictions.Predictions) {
		        if(!routeTimes.hasOwnProperty(predictions.Predictions[index].RouteID)) {
		            routeTimes[predictions.Predictions[index].RouteID] = [];
		            routeTimes[predictions.Predictions[index].RouteID].push(predictions.Predictions[index].Minutes);
		        } else {
		            routeTimes[predictions.Predictions[index].RouteID].push(predictions.Predictions[index].Minutes);
		        }
		    }
	*/
	
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
		
		    var 
		        routes = stops.Stops[0].Routes,
		        routesVsMinutes = {};
		
		    for(var i in routes) {
		        if (!routesVsMinutes.hasOwnProperty(routes[i])) {
		            routesVsMinutes[routes[i]] = {Minutes: []};
		        } 
		        if (routeTimes[routes[i]]) {
		            routesVsMinutes[routes[i]].Minutes = routeTimes[routes[i]];
		        }
		    }      
		    
		    //stops.Stops[0].Routes = routesVsMinutes;
		    //console.log(routeTimes);
		    //console.log('now to creatRouteList');
		    // create HTML for the infowindow
		    createRouteList(routeTimes);
		    //console.log(routeList);
		    $('#infowindow-routes').html(routeList).listview( 'refresh' );
		    
		    $( "#infowindow" ).popup( "open" );
		    
		    // pass some variables to the next page if a button is clicked
		    $('.route-detail-btn').tap(function() {
		    	//console.log('clicked!');
			    $( "#infowindow" ).popup( "close" )
		    	window.plugins.mapKit.clearMapPins();
		    	pins.length = 0;
		    	
		    	/*
	if (!currentLatitude) {
		    		oldLatitude = mapOptions.lat;
		    	} else {
		    		oldLatitude = currentLatitude;
		    	}
		    	
		    	if (!currentLongitude) {
		    		oldLongitude = mapOptions.lon;
		    	} else {
		    		oldLongitude = currentLongitude;
		    	}
	*/
		    	
	
		    	routeClicked = $(this).attr('id');
		    	$('.footer_title').html('Route ' + routeClicked);
		    	
		    	$('#button_container').html('<a href="#" data-role="button" data-icon="arrow-l" data-iconpos="notext" data-mini="true" data-inline="true" id="back_btn">Back</a>').trigger( "create" );
		    	
		    	$('#back_btn').tap(function() {
		    		window.plugins.mapKit.clearMapPins();
			    	//console.log('back clicked!');
			    	$('.footer_title').html("BusTrackDC");
			    	$('#button_container').html('<a href="#" data-role="button" data-icon="currloc" data-iconpos="notext" data-mini="true" id="refresh_location" data-inline="true">Refresh Location</a>').trigger( "create" );
			    	
			    	 // recreate the refresh functionality after we programatically create it
			    	 $('#refresh_location').tap(function() {
				    	//console.log('refresh click!');
				    	
				    	// when the refresh button is pressed, restore the map view -- hopefully this can be removed later
				    	window.plugins.mapKit.showMap();
				    	navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
				    });
			    });
		    	
		    	getStopsForRoute(routeClicked);
		    });
		    
		    
		    
		    // hide the map when we show the jQuery stuff, hopefully this can be eliminated in the future...
		    window.plugins.mapKit.hideMap();
		    	
	    });
	}
}





// make a stop marker and info window
markerStops = function(data) {
	// make a new pins array to store new pins being added
	newPins = [];
	newPins.length = 0;
	
	//console.log('start markerStops');
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
					title: 'Loading...',
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
					title: 'Loading...',
					subTitle: data.Stops[i].StopID,
					pinColor: "green",
					selected: false,
					index: i
				}
			);
		
		}
		


        // loop through all routes in this stop and create a string from all of them
        createRouteList = function(data) {
        	//console.log('createRouteList start');
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
						routeList = routeList + '<li data-theme="d"><a href="#" data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>' + data.directionText[i3][0].replace(/North/,'N').replace(/South/,'S').replace(/East/,'E').replace(/West/,'W') + ' arrives in:</p><p><strong>' + data.minutes[i3].join(', ') + '</strong> minutes</p><span class="ui-li-count">' + i3 + '</span></li>';
					actualRouteList.push(i3);
					potentialVsActual = potentialRouteList.diff(actualRouteList);
					}
				});
				
				// then after, loop through routes with no predictions and add to the end
				$.each(potentialVsActual, function(i4, object4) {
					// check for the routes with a lowercase c or v in their name, they are variation routes and should be ignored
					if (/([cv])/.exec(potentialVsActual[i4]) == null) {
						routeList = routeList + '<li data-theme="d"><a href="#" data-transition="slide" class="route-detail-btn" id="' + potentialVsActual[i4] + '"><p>no prediction available</p><span class="ui-li-count">' + potentialVsActual[i4] + '</span></a></li>';
					}
					
				});
			} else {
				
				// if there are no predictions at all, just do the stops
				$.each(potentialRouteList, function(i4, object4) {
					// check for the routes with a lowercase c or v in their name, they are variation routes and should be ignored
					if (/([cv])/.exec(potentialRouteList[i4]) == null) {			
						routeList = routeList + '<li data-theme="d"><a href="#" data-transition="slide" class="route-detail-btn" id="' + potentialRouteList[i4] + '"><p>no prediction available</p><span class="ui-li-count">' + potentialRouteList[i4] + '</span></a></li>';
					}
				});
				
				actualRouteList.length = 0;
				potentialVsActual.length = 0;

			}
			
			//console.log('potential routes for stop ' + stopIDfocus + ': ' + potentialRouteList + ' and actual routes: ' + actualRouteList);
			//console.log(stopName);
			// add in title
			routeList = '<li data-role="list-divider" class="stopTitle">' + stopName + '</li>' + routeList;
			//console.log(routeList);
			
        }
        
        

		/*
// add the marker and info window on click
	    $('#map_canvas').gmap('addMarker', { 
	    	'position': data.Stops[i].Lat + ', ' + data.Stops[i].Lon, 
	    	'bounds': false, 
	    	'icon': pin,
	    	'shadow': shadow
	    }, function() { //console.log('done with marker ' + i + ' at ' + data.Stops[i].Name); 
	    }).click(function() {
	    	
	    	 
            
           
        });
*/
	});
	
	// clear pins before we add more... (if we can check if pins exist, we can get rid of this, which would be nice.)
	//window.plugins.mapKit.clearMapPins();
	
	// show the new pins
	window.plugins.mapKit.addMapPins(newPins);
	
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
        height: window.innerHeight - 55,
        diameter: 400,
        offsetTop: 0,
        lat: currentLat,
        lon: currentLong
    };
    
    window.plugins.mapKit.setMapData(mapOptions);
    

    
    //console.log('time to calculate radius!');
    
    // when we first call this, we can use the current location variables directly
    getStops(currentLat, currentLong, mapOptions.diameter);
    
   
    
    
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
				if ($('#refresh_location').length) {
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


//our initial show map function
function showMap() {
	
	// set initial location to Capitol building in DC
    mapOptions = {
        buttonCallback: "cbMapCallback",
        height: window.innerHeight - 55,
        diameter: 400,
        offsetTop: 0,
        lat: 38.8897,
        lon: -77.0089
    };
    
    window.plugins.mapKit.showMap();
    //window.plugins.mapKit.setMapData(mapOptions);
    //window.plugins.mapKit.addMapPins(pins);
}

function hideMap() {
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






/* When this function is called, PhoneGap has been initialized and is ready to roll */
function onDeviceReady() {
	//console.log(device.model);
	// initialize a global pin array to store all pins onscreen
	pins = [];
	
	// show the map
	showMap();
	
	//set the dark linen after the map is shown, so we don't see it on load (can also use darklinen-bg.png if you want...)
	$('#gps_map').css('background-image','url("img/lightlinen-bg.png")');
	$('#gps_map').css('background-repeat','repeat-x repeat-y');

	currentLatitude = mapOptions.lat;
	currentLongitude = mapOptions.lon;
	
	currlocsuccess = 0;
	// get current position (which also shows nearby stops)
    navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
    
    
	
	
	
    
    //on page load... this doesn't work, but I don't think we need it
	//$('#gps_map').live('pageinit', function() {
		
		// set default page transition to slide
		$("div[data-role=page]").bind("pagebeforeshow", function (e, data) {
	    	$.mobile.silentScroll(0);
	    	$.mobile.changePage.defaults.transition = 'slide';
	    });
	
	    // make the refresh button work
	    $('#refresh_location').tap(function() {
	    	//console.log('click!');
	    	
	    	// when the refresh button is pressed, restore the map view -- hopefully this can be removed later
	    	window.plugins.mapKit.showMap();
	    	navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
	    });
	    
	    // when the popup closes, restore the map view -- hopefully this can be removed later
	    $( "#infowindow" ).bind({
		    popupafterclose: function(event, ui) { 
		    	window.plugins.mapKit.showMap(); 
		    }
		});
		
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


//useful for later, detects map movements

/*
var geo = geo || {};
geo.onMapMove = function(currentLat,currentLon,latitudeDelta,longitudeDelta) {
  console.log([currentLat,currentLon,latitudeDelta,longitudeDelta]);
};
*/




/***********************************************************************************************/


/*
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};
*/





// helper function for debugging
logStops = function(data) {
	$.each(data.Stops, function(i, object) {
	    $.each(object, function(property, value) {
	        console.log(property + "=" + value);
	    });
	});
}

// create a new color pin image and shadow
createPinImage = function (color) {
	pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
   
   return pinImage;
}

createPinShadow = function() {
	pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));
   return pinShadow;
}
















/*
//on page load...
$('#route_detail').live('pageshow', function() {	
	$('#map_canvas2').gmap('destroy');
	
	//console.log('route detail show!');
	// set height and width of the map for fullscreen
	height = $('body').height();
	width = $('body').width();
	$('#map_canvas2').css({height: height}); 
	
	
	
	
 	
 	// get the last map center location and set zoom level and marker stops
    getLastLocation = function(callback) {
    	
	    $('#map_canvas2').gmap({'center': mapCenter, 'zoom': 14, 'disableDefaultUI':true, 'callback': function(map) {
			var self = this;
			//$('#map_canvas2').gmap('clear', 'markers');
			getStopsForRoute(routeClicked);

		}});
		
		//console.log('refresh');
		$('#map_canvas2').gmap('refresh');
		
		
		
		if (callback && typeof(callback) === "function") {
			callback();
		}
	};
	
	
	getLastLocation(function() {
		
		$('#map_canvas2').gmap().bind('init', function(event, map) { 
	        
	        map2 = $('#map_canvas2').gmap('get', 'map');
	        //console.log('get map');
	        map2.setCenter(mapCenter);  
	        //console.log('set center');                                                                                                                                                                                                
	    });
		
	});
	
	

    
    
});
*/