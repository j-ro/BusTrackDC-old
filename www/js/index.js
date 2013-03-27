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

//on resume function to autorefresh bus times if the infowindow is active
function onResume() {
	if ($.mobile.activePage[0].id == 'infowindow') {
		resumeStopID = $('.stopTitle').attr('id');
    	annotationTap(resumeStopID); 
	}
}


//date functions
function DateTime() {
    function getDaySuffix(a) {
        var b = "" + a,
            c = b.length,
            d = parseInt(b.substring(c-2, c-1)),
            e = parseInt(b.substring(c-1));
        if (c == 2 && d == 1) return "th";
        switch(e) {
            case 1:
                return "st";
                break;
            case 2:
                return "nd";
                break;
            case 3:
                return "rd";
                break;
            default:
                return "th";
                break;
        };
    };

    this.getDoY = function(a) {
        var b = new Date(a.getFullYear(),0,1);
    return Math.ceil((a - b) / 86400000);
    }

    this.date = arguments.length == 0 ? new Date() : new Date(arguments);

    this.weekdays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    this.months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    this.daySuf = new Array( "st", "nd", "rd", "th" );

    this.day = {
        index: {
            week: "0" + this.date.getDay(),
            month: (this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate()
        },
        name: this.weekdays[this.date.getDay()],
        of: {
            week: ((this.date.getDay() < 10) ? "0" + this.date.getDay() : this.date.getDay()) + getDaySuffix(this.date.getDay()),
            month: ((this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate()) + getDaySuffix(this.date.getDate())
        }
    }

    this.month = {
        index: (this.date.getMonth() + 1) < 10 ? "0" + (this.date.getMonth() + 1) : this.date.getMonth() + 1,
        name: this.months[this.date.getMonth()]
    };

    this.year = this.date.getFullYear();

    this.time = {
        hour: {
            meridiem: (this.date.getHours() > 12) ? (this.date.getHours() - 12) < 10 ? "0" + (this.date.getHours() - 12) : this.date.getHours() - 12 : (this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours(),
            military: (this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours(),
            noLeadZero: {
                meridiem: (this.date.getHours() > 12) ? this.date.getHours() - 12 : this.date.getHours(),
                military: this.date.getHours()
            }
        },
        minute: (this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes(),
        seconds: (this.date.getSeconds() < 10) ? "0" + this.date.getSeconds() : this.date.getSeconds(),
        milliseconds: (this.date.getMilliseconds() < 100) ? (this.date.getMilliseconds() < 10) ? "00" + this.date.getMilliseconds() : "0" + this.date.getMilliseconds() : this.date.getMilliseconds(),
        meridiem: (this.date.getHours() >= 12) ? "PM" : "AM"
    };

    this.sym = {
        d: {
            d: this.date.getDate(),
            dd: (this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate(),
            ddd: this.weekdays[this.date.getDay()].substring(0, 3),
            dddd: this.weekdays[this.date.getDay()],
            ddddd: ((this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate()) + getDaySuffix(this.date.getDate()),
            m: this.date.getMonth() + 1,
            mm: (this.date.getMonth() + 1) < 10 ? "0" + (this.date.getMonth() + 1) : this.date.getMonth() + 1,
            mmm: this.months[this.date.getMonth()].substring(0, 3),
            mmmm: this.months[this.date.getMonth()],
            yy: (""+this.date.getFullYear()).substr(2, 2),
            yyyy: this.date.getFullYear()
        },
        t: {
            h: (this.date.getHours() > 12) ? this.date.getHours() - 12 : this.date.getHours(),
            hh: (this.date.getHours() > 12) ? (this.date.getHours() - 12) < 10 ? "0" + (this.date.getHours() - 12) : this.date.getHours() - 12 : (this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours(),
            hhh: this.date.getHours(),
            m: this.date.getMinutes(),
            mm: (this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes(),
            s: this.date.getSeconds(),
            ss: (this.date.getSeconds() < 10) ? "0" + this.date.getSeconds() : this.date.getSeconds(),
            ms: this.date.getMilliseconds(),
            mss: Math.round(this.date.getMilliseconds()/10) < 10 ? "0" + Math.round(this.date.getMilliseconds()/10) : Math.round(this.date.getMilliseconds()/10),
            msss: (this.date.getMilliseconds() < 100) ? (this.date.getMilliseconds() < 10) ? "00" + this.date.getMilliseconds() : "0" + this.date.getMilliseconds() : this.date.getMilliseconds()
        }
    };

    this.formats = {
        compound: {
            commonLogFormat: this.sym.d.dd + "/" + this.sym.d.mmm + "/" + this.sym.d.yyyy + ":" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            exif: this.sym.d.yyyy + ":" + this.sym.d.mm + ":" + this.sym.d.dd + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            /*iso1: "",
            iso2: "",*/
            mySQL: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            postgreSQL1: this.sym.d.yyyy + "." + this.getDoY(this.date),
            postgreSQL2: this.sym.d.yyyy + "" + this.getDoY(this.date),
            soap: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss + "." + this.sym.t.mss,
            //unix: "",
            xmlrpc: this.sym.d.yyyy + "" + this.sym.d.mm + "" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            xmlrpcCompact: this.sym.d.yyyy + "" + this.sym.d.mm + "" + this.sym.d.dd + "T" + this.sym.t.hhh + "" + this.sym.t.mm + "" + this.sym.t.ss,
            wddx: this.sym.d.yyyy + "-" + this.sym.d.m + "-" + this.sym.d.d + "T" + this.sym.t.h + ":" + this.sym.t.m + ":" + this.sym.t.s
        },
        constants: {
            atom: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            cookie: this.sym.d.dddd + ", " + this.sym.d.dd + "-" + this.sym.d.mmm + "-" + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            iso8601: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc822: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc850: this.sym.d.dddd + ", " + this.sym.d.dd + "-" + this.sym.d.mmm + "-" + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc1036: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc1123: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yyyy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc2822: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yyyy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc3339: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rss: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            w3c: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss
        },
        pretty: {
            a: this.sym.t.hh + ":" + this.sym.t.mm + "." + this.sym.t.ss + this.time.meridiem + " " + this.sym.d.dddd + " " + this.sym.d.ddddd + " of " + this.sym.d.mmmm + ", " + this.sym.d.yyyy,
            b: this.sym.t.hh + ":" + this.sym.t.mm + " " + this.sym.d.dddd + " " + this.sym.d.ddddd + " of " + this.sym.d.mmmm + ", " + this.sym.d.yyyy
        },
        busTrackDateTime: {
            a: ((this.sym.t.h == 0) ? '12' : this.sym.t.h) + ":" + this.sym.t.mm + " " + this.time.meridiem,
            b: this.sym.d.m + "/" + this.sym.d.d + "/" + this.sym.d.yy + ' ' + ((this.sym.t.h == 0) ? '12' : this.sym.t.h) + ":" + this.sym.t.mm + " " + this.time.meridiem
        }
    };
};

// title case function
function toTitleCase(str) {
    var arr = str.split(/\s|_/);
    for(var i=0,l=arr.length; i<l; i++) {
        arr[i] = arr[i].substr(0,1).toUpperCase() + 
                 (arr[i].length > 1 ? arr[i].substr(1).toLowerCase() : "");
    }
    
    arr = arr.join(" ");
    
    //fully capitalize NW, SW, SE, and NE
    arr = arr + ' ';
    arr = arr.replace(/ Nw /g,' NW ').replace(/ Sw /g,' SW ').replace(/ Ne /g,' NE ').replace(/ Se /g,' SE ') + ' ';
    arr = arr.trim();
    
    return arr;
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


// get all routes for route search -- way to slow on jQuery mobile do to huge listview, so commenting out for now...

getRoutes = function() {
	//$.mobile.loading( 'show' );
	
	function getRoutesConfirm(buttonIndex) {
        if (buttonIndex == 1) {
        	getRoutes();
        }
    }
    
    routeListFlag = false;
    
    ajaxCount++;
    if (ajaxCount > 0) {
    	$.mobile.loading( 'show' );
    }
	
	getRoutesJSON = $.getJSON('http://api.wmata.com/Bus.svc/json/JRoutes?api_key=' + wmata_api_key + '&callback=?', function(data) {
	
		ajaxCount--;
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
	
		//console.log('ajax call done');

		
		routes = data;
		//console.log(routes);

		// output to log
		buildRouteMenu(routes);

		//console.log(stops.Stops[0].Lat);

		
	}).error(function(jqXHR, textStatus, errorThrown) {
		//$.mobile.loading( 'hide' );
		
		ajaxCount--;
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
		
		$('#route_list_menu').html('<h2 class="center">No routes available at this time.<br/>Please try again later.</h2>');
		$('#route_list_menu').listview('refresh');
		
		if (errorThrown != 'abort') {
			navigator.notification.confirm(
			    'An error occured fetching the data you requested.',  // message
			    getRoutesConfirm,         // callback
			    "There was an error",            // title
			    'Try again,Cancel'                  // buttonName
		    ); 
		}
	});
}



buildRouteMenu = function(data) {
	//console.log('build start');
	//console.log(data);
	
	$('#route_list_content').html('<h2 class="center">Type in the search box above<br/>to search for routes.</h2>');
	
	$('<ul/>',{'data-role':'listview','data-filter-reveal':true,'data-filter':true, 'data-filter-placeholder':'Search...'}).prependTo( '#route_list_content' );
	
	//routeMenuHTML = '<ul data-role="listview" data-filter="true" data-filter-placeholder="Search..." id="route_list_menu" data-filter-reveal="true">';

	$.each(data.Routes, function(i, object) {
		//filter out WMATA's weird half-routes
		if (/([cv])/.exec(object.RouteID) == null) {
			$('<li/>').html('<a href="#" data-routeid="' + object.RouteID + '" class="route_menu_btn">' + object.RouteID + '</a>').prependTo( '#route_list_content ul' );
			//routeMenuHTML = routeMenuHTML + '<li><a href="#" data-routeid="' + object.RouteID + '" class="route_manu_btn">' + object.RouteID + '</a></li>';
		}
		
	});
	
	//routeMenuHTML = routeMenuHTML + '</ul>';
	
	//console.log(routeMenuHTML);
	
	//$('#route_list_content').html(routeMenuHTML);
	//$('#route_list_menu').listview('refresh');
	$('#route_list_content').trigger('create');
	//$('#route_list_content ul').listview('refresh');
	routeListFlag = true;
	//$.mobile.loading( 'hide' );
	
	$('#route_list_content .route_menu_btn').click(function() {
		routeClicked = $(this).data('routeid');
		$('#route_map_title').html('Route ' + routeClicked);
			    
		$.mobile.changePage( "#route_map", { transition: "fade" } );
	});
	
}



// get a list of stops nearby
getStops = function(latitude,longitude,radius) {
	//console.log('getstops start, lat=' + latitude + ' long=' + longitude + ' radius=' + radius);
	
	//$.mobile.loading( 'show' );
	
	//console.log($.ajax());

	function getStopsConfirm(buttonIndex) {
        if (buttonIndex == 1) {
        	getStops(latitude,longitude,radius);
        }
    }
    
    ajaxCount++;
    if (ajaxCount > 0) {
    	$.mobile.loading( 'show' );
    }
	
	getStopsJSON = $.getJSON('http://api.wmata.com/Bus.svc/json/JStops?lat=' + latitude + '&lon=' + longitude + '&radius=' + radius + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
		//console.log('ajax call done');
		//$.mobile.loading( 'hide' );
		
		//console.log($.ajax());
		
		ajaxCount--;
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
		
		stops = data;
		//console.log(stops);

		// output to log
		markerStops(stops);

		//console.log(stops.Stops[0].Lat);

		
	}).error(function(jqXHR, textStatus, errorThrown) {
		//$.mobile.loading( 'hide' );
		
		ajaxCount--;
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
		
		if (errorThrown != 'abort') {
			navigator.notification.confirm(
			    'An error occured fetching the data you requested.',  // message
			    getStopsConfirm,         // callback
			    "There was an error",            // title
			    'Try again,Cancel'                  // buttonName
		    ); 
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
	
	// retry function on error
	function getStopsForRouteConfirm(buttonIndex) {
        if (buttonIndex == 1) {
        	getStopsForRoute(routeID);
        }
    }
    
    ajaxCount++;
    if (ajaxCount > 0) {
    	$.mobile.loading( 'show' );
    }
		
	getStopsForRouteJSON = $.getJSON('http://api.wmata.com/Bus.svc/json/JRouteDetails?routeID=' + routeID + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
		
		ajaxCount--;
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
	
		//console.log('ajax call done');
		//console.log('getstopsforroute hide');
		getStopsForRouteFlag = true;
		//$.mobile.loading( 'hide' );
		
		//console.log('getstopsforroute callback hide');
		//$.mobile.loading( 'hide' );
		stopsForRoute = data;
		
		// custom error handling for baffling blank route maps...
		if (stopsForRoute.Direction0 == null && stopsForRoute.Direction1 == null) {
			navigator.notification.confirm(
			    'The route map for this line is not available. Sorry!',  // message
			    null,         // callback
			    "Route map not available",            // title
			    'OK'                  // buttonName
		    ); 
		}
		
		//console.log(stopsForRoute);
		
		mapOptions2 = {

	        diameter: 1500,
	        lat: currentLatitude,
	        lon: currentLongitude

	    };
	    
	    //console.log('call mapoptions');
	    window.plugins.mapKit.setMapData(mapOptions2);
		
		markerStopPoints(stopsForRoute);

	}).error(function(jqXHR, textStatus, errorThrown) {
		//$.mobile.loading( 'hide' );
		
		ajaxCount--;
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
		
		if (errorThrown != 'abort') {
			navigator.notification.confirm(
			    'An error occured fetching the data you requested.',  // message
			    getStopsForRouteConfirm,         // callback
			    "There was an error",            // title
			    'Try again,Cancel'                  // buttonName
		    ); 
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

		//console.log('done with pin0 ' + i);
		
		pins0.push(
			{
				lat: data.Direction0.Stops[i].Lat,
				lon: data.Direction0.Stops[i].Lon,
				title: toTitleCase(data.Direction0.Stops[i].Name),
				subTitle: 'WMATA Bus Stop #' + data.Direction0.Stops[i].StopID,
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
				title: toTitleCase(data.Direction1.Stops[i].Name),
				subTitle: 'WMATA Bus Stop #' + data.Direction1.Stops[i].StopID,
				pinColor: "005534",
				selected: false,
				index: i
			}
		);
	});


	
	
	//console.log(inRangeLongitude + ',' + inRangeLatitude);
	//console.log(pins0);
	//console.log(pins1);
	window.plugins.mapKit.addMapPins(pins0);
	window.plugins.mapKit.addMapPins(pins1);
	//console.log('markerstoppoints hide');
	//$.mobile.loading( 'hide' );
	//console.log(inRangeLongitude + ',' + inRangeLatitude);
	
	var pinLength = pins0.length;
	//console.log(pinLength);
	pinLength = parseInt(pinLength * 0.5);

	
}


// get a list of stops nearby
getRailStops = function(latitude,longitude,radius) {
	//console.log('getstops start, lat=' + latitude + ' long=' + longitude + ' radius=' + radius);
	
	//$.mobile.loading( 'show' );

	function getRailStopsConfirm(buttonIndex) {
        if (buttonIndex == 1) {
        	getRailStops(latitude,longitude,radius);
        }
    }
    
    ajaxCount++;
    if (ajaxCount > 0) {
    	$.mobile.loading( 'show' );
    }
	
	getRailStopsJSON = $.getJSON('http://api.wmata.com/Rail.svc/json/JStationEntrances?lat=' + latitude + '&lon=' + longitude + '&radius=' + radius + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
	
		ajaxCount--;
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
	    
		//console.log('ajax call done');
		//$.mobile.loading( 'hide' );
		
		railStops = data;
		//console.log(railStops);

		// output to log
		markerRailStops(railStops);

		//console.log(stops.Stops[0].Lat);

		
	}).error(function(jqXHR, textStatus, errorThrown) {
		//$.mobile.loading( 'hide' );
		
		ajaxCount--;
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
		
		if (errorThrown != 'abort') {
			navigator.notification.confirm(
			    'An error occured fetching the data you requested.',  // message
			    getRailStopsConfirm,         // callback
			    "There was an error",            // title
			    'Try again,Cancel'                  // buttonName
		    ); 
		}
	});
	
}


//when a pin is deselected, kill any ajax calls
function annotationDeselect() {
	annotationTapJSON.abort();
};

// when a pin is clicked...
function annotationTap(text, latitude, longitude) {
	//console.log('annotation tap');
	//console.log(latitude);
	
	text = text.toString().replace(/Metro Rail Station #/,'').replace(/WMATA Bus Stop #/,'');
	
	
	
	//console.log(routeMapView);
	// if we just clicked a route map pin, we need to get the stops data loaded first to make a good infowindow, so do that then loop back to this function and show the infowindow
	if (routeMapView == true) {
		notInRangeStopID = text.toString();
		favoriteBtnClickedFlag = true;
		getStops(latitude, longitude, '50');
	} else {
	
		// if this is a rail stop, do that function
		if (isNaN(text)) {
	
			self2 = this;
			//console.log('click!');;
			stopID = text;
			//console.log(stopID);
			var self2 = this;
			
		
			
			
			// only get this stuff if the annotation tapped is a stop, rather than part of a route map
			if (text != '(null)') {
				/*
	$.mobile.loading( 'show', {
					text: 'Loading',
					textVisible: false,
					theme: 'a',
					html: ""
				});
	*/
				
				// retry function on error
				function annotationTapJSONConfirm(buttonIndex) {
			        if (buttonIndex == 1) {
			        	annotationTap(text, latitude, longitude);
			        }
			    }
			    
			    console.log('rail!')
			    
			    
			    ajaxCount++;
			    if (ajaxCount > 0) {
				    $.mobile.loading( 'show' );
				}
				//console.log('http://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + stopID + '?api_key=' + wmata_api_key + '&callback=?');
				
				annotationTapJSON = $.getJSON('http://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + stopID + '?api_key=' + wmata_api_key + '&callback=?', function(data2, self4) {
					
					ajaxCount--;
					if (ajaxCount == 0) {
						$.mobile.loading( 'hide' );
					}
				
					//console.log('predictions=' + data2.Predictions.length);
					//sorted = data2.Predictions.sort(function(a,b) {return b - a; });
					
					//$.mobile.loading( 'hide' );
					// thanks to Vlad Lyga for this part: http://stackoverflow.com/questions/14308149/how-do-i-merge-two-json-objects-in-javascript-jquery
					predictions = data2;
					
					routeTimes = {
						minutes: {},
						directionText: {}
					};
		
			
					for (var index in predictions.Trains) {
			
				        if(!routeTimes.minutes.hasOwnProperty(predictions.Trains[index].Line)) {
			
				            routeTimes.minutes[predictions.Trains[index].Line] = [];
				            routeTimes.directionText[predictions.Trains[index].Line] = [];
			
				            if (predictions.Trains[index].Min != 'undefined') {
			
				            	routeTimes.minutes[predictions.Trains[index].Line].push(predictions.Trains[index].Min);
			
				            }
				            routeTimes.directionText[predictions.Trains[index].Line].push(predictions.Trains[index].DestinationName);
			
				        } else {
			
				        	if (predictions.Trains[index].Min != 'undefined') {
			
				        		routeTimes.minutes[predictions.Trains[index].Line].push(predictions.Trains[index].Min);
			
				        	}
				            routeTimes.directionText[predictions.Trains[index].Line].push(predictions.Trains[index].DestinationName);
			
				        }
				    }
				    
				    //console.log(routeTimes);
				
				    // this function needs nearby stops already loaded to load all stops for the route, not just predictions, but maybe it shouldn't in case you want to see your favorite stops and they're not in range? Right now, I'll just make it load only routes with predictions, but eventually would be nice to do the second AJAX call to load this stop into memory
				    
				    /*
if (railStops.length) {
				    	//console.log(stops.length);
				    	var 
				        	railRoutes = stops.Stops[0].Routes,
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
*/
   
				    
				    //stops.Stops[0].Routes = routesVsMinutes;
				    //console.log(routeTimes);
				    //console.log('now to creatRouteList');
				    // create HTML for the infowindow
				    createRailRouteList(routeTimes,stopID);
				    
				    	
			    }).error(function(jqXHR, textStatus, errorThrown) {
					//$.mobile.loading( 'hide' );
					console.log(errorThrown);
					ajaxCount--;
					if (ajaxCount == 0) {
						$.mobile.loading( 'hide' );
					}
					
					if (errorThrown != 'abort') {
						navigator.notification.confirm(
						    'An error occured fetching the data you requested.',  // message
						    annotationTapJSONConfirm,         // callback
						    "There was an error",            // title
						    'Try again,Cancel'                  // buttonName
					    ); 
					}
				});

			}
		} else {
	
			self2 = this;
			//console.log('click!');
			stopID = text;
			console.log(stopID);
			var self2 = this;
			
		
			
			
			// only get this stuff if the annotation tapped is a stop, rather than part of a route map
			if (text != '(null)') {
				/*
	$.mobile.loading( 'show', {
					text: 'Loading',
					textVisible: false,
					theme: 'a',
					html: ""
				});
	*/
				
				// retry function on error
				function annotationTapJSONConfirm(buttonIndex) {
			        if (buttonIndex == 1) {
			        	annotationTap(text, latitude, longitude);
			        }
			    }
			    
			    console.log('bus!');
			    
			    ajaxCount++;
			    if (ajaxCount > 0) {
				    $.mobile.loading( 'show' );
				}
				
				annotationTapJSON = $.getJSON('http://api.wmata.com/NextBusService.svc/json/JPredictions?StopID=' + stopID + '&api_key=' + wmata_api_key + '&callback=?', function(data2, self4) {
					
					ajaxCount--;
					if (ajaxCount == 0) {
						$.mobile.loading( 'hide' );
					}
				
					//console.log('predictions=' + data2.Predictions.length);
					//sorted = data2.Predictions.sort(function(a,b) {return b - a; });
					
					//$.mobile.loading( 'hide' );
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
				    
				    	//console.log('route btn clicked');
				
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
				    
				    	
			    }).error(function(jqXHR, textStatus, errorThrown) {
					//$.mobile.loading( 'hide' );
					//console.log(errorThrown);
					ajaxCount--;
					if (ajaxCount == 0) {
						$.mobile.loading( 'hide' );
					}
					
					if (errorThrown != 'abort') {
						navigator.notification.confirm(
						    'An error occured fetching the data you requested.',  // message
						    annotationTapJSONConfirm,         // callback
						    "There was an error",            // title
						    'Try again,Cancel'                  // buttonName
					    ); 
					}	
				});
			}
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
				//console.log('WMATA Bus Stop #' + data.Stops[i].StopID + ' == ' + obj.subTitle + '?');
				return obj.subTitle == 'WMATA Bus Stop #' + data.Stops[i].StopID;
			});
			
			if (matches.length == 0) {
				
				//console.log('no matches');
				//console.log(matches);
				
				// if this is a new pin, add it to the global pin array AND the new pin array
				pins.push(
					{
						lat: data.Stops[i].Lat,
						lon: data.Stops[i].Lon,
						title: toTitleCase(data.Stops[i].Name),
						subTitle: 'WMATA Bus Stop #' + data.Stops[i].StopID,
						pinColor: "green",
						selected: false,
						index: i
					}
				);
				
				newPins.push(
					{
						lat: data.Stops[i].Lat,
						lon: data.Stops[i].Lon,
						title: toTitleCase(data.Stops[i].Name),
						subTitle: 'WMATA Bus Stop #' + data.Stops[i].StopID,
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
				var dt = new DateTime();
				routeList = '<li data-role="list-divider" class="stopTitle" id="' + stopID + '" data-lat=' + stopLat + '" data-lon=' + stopLon + '"><span class="stopName">' + toTitleCase(stopName) + '</span></li>' + routeList + '<div class="updated">Updated ' + dt.formats.busTrackDateTime.b + ' - Pull to refresh</div>';
				//console.log(routeList);
				
	        }
	
		});
		
		//console.log('add new pins');
		// show the new pins, but only if this is a real stop get, and not a favorite button or route annotation being clicked
		//if (favoriteBtnClickedFlag != true) {
			//console.log(newPins);
			window.plugins.mapKit.addMapPins(newPins);
		//}
		
		// if we've clicked a favorite or route annotation, show the predictions
		//console.log(favoriteBtnClickedFlag);
		//console.log('notinrange=' + notInRangeStopID);
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
			var dt = new DateTime();
			routeList = '<li data-role="list-divider" class="stopTitle" id="' + stopID + '" data-lat=' + notInRangeStopLat + '" data-lon=' + notInRangeStopLon + '"><span class="stopName">' + notInRangeStopName + '</span></li>' + routeList + '<div class="updated">Updated ' + dt.formats.busTrackDateTime.b + ' - Pull to refresh</div>';
			//console.log(routeList);
			
        }
	}
	
}



// make a stop marker and info window
markerRailStops = function(data) {
	// make a new pins array to store new pins being added
	newRailPins = [];
	newRailPins.length = 0;
	
	//console.log('start markerStops');
	//console.log(data.Entrances.length);
	if (data.Entrances.length) {
		//console.log('start loop');
		$.each(data.Entrances, function(i, object) {
	
			
			// the pins are not unique! AAAAAAHHHHHH Now I need more complex data structures in these damn pins...
			railMatches = jQuery.grep(pins, function(obj) {
				// our match function to see if a pin already exists in the global pin array
				return obj.index == data.Entrances[i].ID;
			});
			
			if (railMatches.length == 0) {
				
				//console.log('no matches');
				//console.log(matches);
				
				if (data.Entrances[i].StationCode2 != "") {
					var stationCode = data.Entrances[i].StationCode1 + ',' + data.Entrances[i].StationCode2;
				} else {
					var stationCode = data.Entrances[i].StationCode1;
				}
				
				
				
				// if this is a new pin, add it to the global pin array AND the new pin array
				pins.push(
					{
						lat: data.Entrances[i].Lat,
						lon: data.Entrances[i].Lon,
						title: data.Entrances[i].Name,
						subTitle: 'Metro Rail Station #' + stationCode,
						pinColor: "red",
						selected: false,
						index: data.Entrances[i].ID
					}
				);
				
				newRailPins.push(
					{
						lat: data.Entrances[i].Lat,
						lon: data.Entrances[i].Lon,
						title: data.Entrances[i].Name,
						subTitle: 'Metro Rail Station #' + stationCode,
						pinColor: "red",
						selected: false,
						index: data.Entrances[i].ID
					}
				);
			
			}
			
	
	
	        // loop through all routes in this stop and create a string from all of them
	        createRailRouteList = function(data, station) {
	        	//console.log('createRouteList start');
				railRouteList = '';
				railRouteList.replace(railRouteList, '');
				potentialRailRouteList = [];
				potentialRailRouteList.length = 0;
				actualRailRouteList = [];
				railPotentialVsActual = [];
				
				station = station.split(',');
				
				//railRouteList = data;
				stationList = station;
				
				railStationInfo = [];
				railStationInfo.length = 0;
				
				railStationInfoCount = 0;
				
				
				$.each(station, function(i, object) {
					function getRailStationInfoConfirm(buttonIndex) {
				        if (buttonIndex == 1) {
				        	createRailRouteList(railRouteList,stationList);
				        }
				    }

				    ajaxCount++;
				    if (ajaxCount > 0) {
				    	$.mobile.loading( 'show' );
				    }
					
					getRailStationInfoJSON = $.getJSON('http://api.wmata.com/Rail.svc/json/JStationInfo?StationCode=' + object + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
					
						ajaxCount--;
					    if (ajaxCount == 0) {
					    	$.mobile.loading( 'hide' );
					    }
					    
					    //console.log(data);

						railStationInfo.push(data);
						
						//increment our AJAX count and see if we've got all the station info we need...
						railStationInfoCount++;
						
						if (railStationInfoCount == station.length) {
							// create a list of all possible routes at this stop
							$.each(railStationInfo, function(i2, object2) {
								//if (stopID == stops.Stops[i2].StopID) {
									railStopIDfocus = object2.Code;
									railStopName = object2.Name;
									potentialRailRouteList.push(object2.LineCode1);
									if (object2.LineCode2 != null) {
										potentialRailRouteList.push(object2.LineCode2);
									}
									
									//potentialRailRouteList.push(object2.LineCode3);
									//potentialRailRouteList.push(object2.LineCode4);
									railStopLat = object2.Lat;
									railStopLon = object2.Lon;
									//potentialRouteList.push(routeID);
								//}
								
							});
							
							//console.log(potentialRailRouteList);
							//potentialRouteList.length = 0;
							
							
							// make a diff method for determining the difference in arrays
							
							Array.prototype.diff = function(a) {
							    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
							};
							
							railDirectionTracker = [];
							
							// make HTML for infowindow for actual buses that are coming
							if (predictions.Trains.length) {
								//console.log('true');
								//console.log(data);
								//dataWorld = railStationInfo;
								
								
								
								$.each(predictions.Trains, function(i3, object) {
								
									objDestName = object.DestinationCode;
									//console.log(objDestName);
									
									if (object.DestinationCode != null) {
									
										
										railPredictionMatches = jQuery.grep(railDirectionTracker, function(obj) {
											// our match function to see if a pin already exists in the global pin array
											return obj.DestinationCode == objDestName;
										});
									
										/*
										// if the destination is already in the array, add to it, if not create from scratch
										if (railPredictionMatches.length == 0) {
											railDirectionTracker.push({ 
													
													DestinationCode: object.DestinationCode,
													DestinationName: object.DestinationName,
													Line: object.Line,
													Min: object.Min
												
											});
											
										
										} else {
										
											matchID = railPredictionMatches[0].DestinationCode;
											//railDirectionTracker.objDestName = objDestName;
											railDirectionTracker[matchID].Min = railDirectionTracker[matchID].Min + ', ' + object.Min;
											
										}
*/
										
										if (railPredictionMatches.length == 0) {
											railDirectionTracker.push({ 
													
													DestinationCode: object.DestinationCode,
													DestinationName: object.DestinationName,
													Line: object.Line,
													Min: object.Min
												
											});
										} else {
											$.each(railDirectionTracker, function(i, object2) {
												if (railDirectionTracker[i].DestinationCode == object.DestinationCode) {
													object2.Min = object2.Min  + ', ' + object.Min;
												}
											});
										}
									}
								});
								
								$.each(railDirectionTracker, function(i, object) {
									railRouteList = railRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + object.Line + '"><p>to ' + object.DestinationName + ' arrives in:</p><p><strong>' + object.Min + '</strong> minutes</p><span class="ui-li-count">' + object.Line + '</span></li>';
								});
								
								// then after, loop through routes with no predictions and add to the end
								/*
$.each(potentialVsActual, function(i4, object4) {
									// check for the routes with a lowercase c or v in their name, they are variation routes and should be ignored
									if (/([cv])/.exec(potentialVsActual[i4]) == null) {
										routeList = routeList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + potentialVsActual[i4] + '"><p>no prediction available</p><span class="ui-li-count">' + potentialVsActual[i4] + '</span></a></li>';
									}
									
								});
*/
		/*					} else { */
								
								// if there are no predictions at all, just do the stops
								/*
$.each(potentialRouteList, function(i4, object4) {
									// check for the routes with a lowercase c or v in their name, they are variation routes and should be ignored
									if (/([cv])/.exec(potentialRouteList[i4]) == null) {			
										routeList = routeList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + potentialRouteList[i4] + '"><p>no prediction available</p><span class="ui-li-count">' + potentialRouteList[i4] + '</span></a></li>';
									}
								});
								
								actualRouteList.length = 0;
								potentialVsActual.length = 0;
*/
				
							}
							
							//console.log('potential routes for stop ' + stopIDfocus + ': ' + potentialRouteList + ' and actual routes: ' + actualRouteList);
							//console.log(stopName);
							console.log(stationList.join().toString());
							var dt = new DateTime();
							railRouteList = '<li data-role="list-divider" class="stopTitle" id="' + stationList.join().toString() + '" data-lat=' + railStopLat + '" data-lon=' + railStopLon + '"><span class="stopName">' + railStopName + '</span></li>' + railRouteList + '<div class="updated">Updated ' + dt.formats.busTrackDateTime.b + ' - Pull to refresh</div>';

							//console.log(railRouteList);
							
						}
						//console.log(routes);
						
						
						$('#infowindow-routes').html(railRouteList);
				    
				    
					    // pass some variables to the next page if a button is clicked
					    $('.route-detail-btn').click(function() {
					    
					    	//console.log('route btn clicked');
					
					    	routeClicked = $(this).data('line');
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
						
						
						
					}).error(function(jqXHR, textStatus, errorThrown) {
						//$.mobile.loading( 'hide' );
						
						ajaxCount--;
					    if (ajaxCount == 0) {
					    	$.mobile.loading( 'hide' );
					    }
						
						if (errorThrown != 'abort') {
							navigator.notification.confirm(
							    'An error occured fetching the data you requested.',  // message
							    getRailStationInfoConfirm,         // callback
							    "There was an error",            // title
							    'Try again,Cancel'                  // buttonName
						    ); 
						}
					});
				});
				
				
				

	        }

	
		});
		
		//console.log('add new pins');
		// show the new pins, but only if this is a real stop get, and not a favorite button or route annotation being clicked
		//if (favoriteBtnClickedFlag != true) {
			//console.log(newRailPins);
			window.plugins.mapKit.addMapPins(newRailPins);
		//}
		
		// if we've clicked a favorite or route annotation, show the predictions
		//console.log(favoriteBtnClickedFlag);
		if (favoriteBtnClickedFlag == true) {
			routeMapView = false;
			annotationTap(notInRangeStopID);
			favoriteBtnClickedFlag = false;
			
		}

		
	} else {
		
		// loop through all routes in this stop and create a string from all of them (this is a version for no stops in range)

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
    getRailStops(currentLat, currentLong, mapOptions.diameter);
 
};





// if we can't get current position, callback receives a PositionError object
function onCurrentLocationError(error) {
	//console.log('currloc error');
    navigator.notification.alert(
	    'Please allow BusTrackDC to access your current location by going to Settings > Privacy > Location Services and allowing BusTrackDC to use your current location.',  // message
	    //console.log('currlocerror'),         // callback
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
			return obj.id == favorite;
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

	window.GA.trackerWithTrackingId("UA-39138450-1");
    window.GA.trackView("/index");
	
	deviceReadyFlag = true;
	//console.log('deviceready');
	
	// add an on resume event to call an autorefresh if the app becomes active again...
	document.addEventListener("resume", onResume, false);
	
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

	currentLatitude = mapOptions.lat;
	currentLongitude = mapOptions.lon;
	
	currlocsuccess = 0;

    
    // get current position (which also shows nearby stops)
	navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
	
	// this needs to be in deviceReady so as not to make weird this website needs access to your location notices in the app...
	$(document).on('pageinit', '#gps_map', function() {
		
		if (deviceReadyFlag = true) {
			navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
		}
		
	});
	
	

    
}

/*
$.ajaxPrefilter(function (options){options.global = true;});
$(document).ajaxStart(function(){ console.log('ajax start'); $.mobile.loading( 'show' ); });
$(document).ajaxStop(function(){ console.log('ajax stop'); $.mobile.loading( 'hide' ); });
*/


$(document).on('pageinit', '#gps_map', function() {

	ajaxCount = 0;
	
	favoriteBtnClickedFlag = false;
	
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
    	//console.log($('.stopTitle').attr('id'));
    	refreshStopID = $('.stopTitle').attr('id');
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
				//console.log($(this).data('stopid'));
				
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
				if (isNaN(notInRangeStopID)) {
					getRailStops(notInRangeStopLat, notInRangeStopLon, '500');
				} else {
					getStops(notInRangeStopLat, notInRangeStopLon, '50');
				}
	
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
		    	
		    	//console.log(favorites);
		    	
		    	var deletedElementID = $(this).parent().data('stopid');
		    	
		    	favorites = favorites.filter(function(el){ return el.id != deletedElementID });
		    	
		    	$('#favorites_menu #' + deletedElementID).remove();
		    	
		    	//console.log(favorites);
			
		    	window.localStorage.setItem("favorites", JSON.stringify(favorites));
		    });

		    
		    editFlag = true;
		}
		
	});
});



$(document).on('pageinit', '#route_list', function() {

	$('#route_list_content').html('<h2 class="center">Loading...</h2>');
	//$('#route_list_content').listview('refresh');
	
	//$.mobile.loading( 'show' );

	getRoutes();
});


//page show functions
$(document).on('pagebeforeshow', '#gps_map', function() {

	//console.log(window.history);
	if (mapVisible == false) {
		showMap();
	}

	if (typeof(currentLatitude) === 'undefined') {
		//console.log('true');
	} else {
		//console.log(currentLatitude);
		//console.log(currentLongitude);
		//console.log(pins.length);
		//if (pins.length == 0) {
			getStops(currentLatitude, currentLongitude, '800');
			getRailStops(currentLatitude, currentLongitude, '800');
		//}
		
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
							getRailStops(viewportLat, viewportLon, radius);
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
			if (isNaN(object.id)) {
				favoritesListHTML = favoritesListHTML + '<li id="' + object.id + '"><a data-transition="slide" class="favorite-stop-detail-btn" data-stopid="' + object.id + '" data-stopname="' + object.name + '" data-lat="' + object.lat + '" data-lon="' + object.lon + '"><h1 class="favoriteMenuStopTitle">' + toTitleCase(object.name) +'</h1><p>Metro Rail Station #'+ object.id + '</p><p class="delete-handle">Delete</p><p class="drag-handle">Sort</p></a></li>';
			} else {
				favoritesListHTML = favoritesListHTML + '<li id="' + object.id + '"><a data-transition="slide" class="favorite-stop-detail-btn" data-stopid="' + object.id + '" data-stopname="' + object.name + '" data-lat="' + object.lat + '" data-lon="' + object.lon + '"><h1 class="favoriteMenuStopTitle">' + toTitleCase(object.name) +'</h1><p>WMATA Bus Stop #'+ object.id + '</p><p class="delete-handle">Delete</p><p class="drag-handle">Sort</p></a></li>';
			}
		});
		
		
		
		//console.log(favoritesListHTML);
		$('#favorites_menu').html(favoritesListHTML).listview('refresh');
		
		$('.favorite-stop-detail-btn').click(function() {
			//console.log($(this).data('stopid'));
			
			/*
$.mobile.loading( 'show', {
				text: 'Loading',
				textVisible: false,
				theme: 'a',
				html: ""
			});
*/
	
			// store a variable on this stop's name in case we need to retrieve it later...
			notInRangeStopID = $(this).data('stopid'); // this will need to be edited to figure out if the stop is rail...
			notInRangeStopName = $(this).data('stopname');
			notInRangeStopLat = $(this).data('lat');
			notInRangeStopLon = $(this).data('lon');
	
			// if we click a favorite, get the stop and populate the stops array really quick, so we can view all the data about the predictions
			favoriteBtnClickedFlag = true;
			if (isNaN(notInRangeStopID)) {
				getRailStops(notInRangeStopLat, notInRangeStopLon, '500');
			} else {
				getStops(notInRangeStopLat, notInRangeStopLon, '50');
			}
			

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
				return obj.id == stopID;
			} else {
				return obj.id == notInRangeStopID;
			}
			
		});
		
		//console.log(favoriteMatches);
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
	//console.log(getStopsForRouteFlag);
	
	if (getStopsForRouteFlag == false) {
		if (ajaxCount > 0) {
    		$.mobile.loading( 'show' );
    	}
	}
	
});


// way to slow on jQuery mobile do to huge listview, so commenting out for now...
$(document).on('pagebeforeshow', '#route_list', function() {
	
	//console.log(window.localStorage.getItem("favorites"));
	
	if (mapVisible == true) {
		hideMap();
	}
	

	
	//getRoutes();
});



//on page hide functions
$(document).on('pagebeforehide', '#route_map', function() {
	routeMapView = false;
	
	window.plugins.mapKit.clearMapPins();
	//console.log('getstopsjson abort!');
	getStopsForRouteJSON.abort();
});

$(document).on('pagebeforehide', '#infowindow', function() {
	annotationTapJSON.abort();
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