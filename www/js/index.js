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

//fastclick.js instantiation to get rid of 300ms delay on click events... DO WE NEED THIS AT ALL? WORKS FINE WITHOUT ON ANDROID
/*
window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);
*/

//on resume function to autorefresh bus times if the infowindow is active
function onResume() {
	ajaxCount = 0;
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
	
	circulatorLat = viewportLat;
	circulatorLon = viewportLon;
	circulatorLatDelta = Math.abs(latitudeDelta);
	circulatorLonDelta = Math.abs(longitudeDelta);
	
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
	
		/*
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}

	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
*/
	
		//console.log('ajax call done');

		
		routes = data;
		//console.log(routes);
		
		/*
ajaxCount++;
	    if (ajaxCount > 0) {
	    	$.mobile.loading( 'show' );
	    }
*/
		
		getRailRoutesJSON = $.getJSON('http://api.wmata.com/Rail.svc/json/JLines?api_key=' + wmata_api_key + '&callback=?', function(data) {
		
			/*
if (ajaxCount > 0 ) {
		    		ajaxCount--;
		    	} else {
			    	ajaxCount = 0;
		    	}
		    	
		    if (ajaxCount == 0) {
		    	$.mobile.loading( 'hide' );
		    }
*/
		    
		    railRoutes = data;
		    
		    /*
ajaxCount++;
		    if (ajaxCount > 0) {
		    	$.mobile.loading( 'show' );
		    }
*/
		    
		    getCirculatorRoutesJSON = $.get('http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=dc-circulator', function(data) {
		    
		    	if (ajaxCount > 0 ) {
		    		ajaxCount--;
		    	} else {
			    	ajaxCount = 0;
		    	}
		    	
			    if (ajaxCount == 0) {
			    	$.mobile.loading( 'hide' );
			    }
			    
			    circulatorRoutes = $.xml2json(data);
			    
			    // output to log
			    buildRouteMenu(routes, railRoutes, circulatorRoutes);
			    	
	    	}).error(function(jqXHR, textStatus, errorThrown) {
				//$.mobile.loading( 'hide' );
				
				if (ajaxCount > 0 ) {
		    		ajaxCount--;
		    	} else {
			    	ajaxCount = 0;
		    	}
		    	
			    if (ajaxCount == 0) {
			    	$.mobile.loading( 'hide' );
			    }
				
				$('#route_list_menu').html('<h2 class="center">No routes available at this time.<br/>Please try again later.</h2>').listview('refresh');
				
				if (errorThrown != 'abort') {
					navigator.notification.confirm(
					    'An error occured fetching the data you requested.',  // message
					    getRoutesConfirm,         // callback
					    "There was an error",            // title
					    'Try again,Cancel'                  // buttonName
				    ); 
				}
			});
		}).error(function(jqXHR, textStatus, errorThrown) {
			//$.mobile.loading( 'hide' );
			
			if (ajaxCount > 0 ) {
	    		ajaxCount--;
	    	} else {
		    	ajaxCount = 0;
	    	}
	    	
		    if (ajaxCount == 0) {
		    	$.mobile.loading( 'hide' );
		    }
			
			$('#route_list_menu').html('<h2 class="center">No routes available at this time.<br/>Please try again later.</h2>').listview('refresh');
			
			if (errorThrown != 'abort') {
				navigator.notification.confirm(
				    'An error occured fetching the data you requested.',  // message
				    getRoutesConfirm,         // callback
				    "There was an error",            // title
				    'Try again,Cancel'                  // buttonName
			    ); 
			}
		});

		//console.log(stops.Stops[0].Lat);

		
	}).error(function(jqXHR, textStatus, errorThrown) {
		//$.mobile.loading( 'hide' );
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}

	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
		
		$('#route_list_menu').html('<h2 class="center">No routes available at this time.<br/>Please try again later.</h2>').listview('refresh');
		
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



buildRouteMenu = function(dataBus, dataRail, dataCirculator) {
	//console.log('build start');
	//console.log(dataBus);
	//console.log(dataRail);
	//console.log(dataCirculator);
	
	$('#route_list_content').html('<h2 class="center">Type a Metro bus line number,<br/>Circulator bus line name, <br/>or Metro rail line name<br/>in the box above to search for routes.</h2>');
	
	$('<ul/>',{'data-role':'listview','data-filter-reveal':true,'data-filter':true, 'data-filter-placeholder':'Search...'}).prependTo( '#route_list_content' );
	
	//routeMenuHTML = '<ul data-role="listview" data-filter="true" data-filter-placeholder="Search..." id="route_list_menu" data-filter-reveal="true">';

	$.each(dataRail.Lines, function(i, object) {
		//console.log(object.LineCode);
		$('<li data-filtertext="' + object.LineCode + ' ' + object.DisplayName + '  Rail Line" />').html('<a href="#" data-routeid="' + object.LineCode + '" class="route_menu_btn">' + object.DisplayName + ' Rail Line</a>').prependTo( '#route_list_content ul' );
		//routeMenuHTML = routeMenuHTML + '<li><a href="#" data-routeid="' + object.RouteID + '" class="route_manu_btn">' + object.RouteID + '</a></li>';
	
	});

	$.each(dataBus.Routes, function(i, object) {
		//filter out WMATA's weird half-routes
		if (/([cv])/.exec(object.RouteID) == null) {
			$('<li data-filtertext="' + object.RouteID + '  Bus Route" />').html('<a href="#" data-routeid="' + object.RouteID + '" class="route_menu_btn">' + object.RouteID + ' Bus Route</a>').prependTo( '#route_list_content ul' );
			//routeMenuHTML = routeMenuHTML + '<li><a href="#" data-routeid="' + object.RouteID + '" class="route_manu_btn">' + object.RouteID + '</a></li>';
		}
		
	});
	

	$.each(dataCirculator.route, function(i, object) {
		//console.log(object.LineCode);
		if(typeof(object.shortTitle) !== 'undefined') {
			$('<li data-filtertext="' + object.tag + ' ' + object.title + ' ' + object.shortTitle + '  Circulator Route" />').html('<a href="#" data-routeid="' + object.tag + '" class="route_menu_btn">' + object.shortTitle + ' Circulator Route</a>').prependTo( '#route_list_content ul' );
		} else {
			$('<li data-filtertext="' + object.tag + ' ' + object.title + '  Circulator Route" />').html('<a href="#" data-routeid="' + object.tag + '" class="route_menu_btn">' + object.title + ' Circulator Route</a>').prependTo( '#route_list_content ul' );
		}
		
		//routeMenuHTML = routeMenuHTML + '<li><a href="#" data-routeid="' + object.RouteID + '" class="route_manu_btn">' + object.RouteID + '</a></li>';
	
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
		
		if (isNaN(routeClicked)) {
			
			if (routeClicked == 'RD') {
		    	routeTitle = 'Red';
		    	$('#route_map_title').html(routeTitle + ' Line');
	    	} else if (routeClicked == 'BL') {
		    	routeTitle = 'Blue';
		    	$('#route_map_title').html(routeTitle + ' Line');
	    	} else if (routeClicked == 'OR') {
		    	routeTitle = 'Orange';
		    	$('#route_map_title').html(routeTitle + ' Line');
	    	} else if (routeClicked == 'YL') {
		    	routeTitle = 'Yellow';
		    	$('#route_map_title').html(routeTitle + ' Line');
	    	} else if (routeClicked == 'GR') {
		    	routeTitle = 'Green';
		    	$('#route_map_title').html(routeTitle + ' Line');
	    	} else if (routeClicked == 'yellow') {
		    	routeTitle = 'Yellow';
		    	$('#route_map_title').html(routeTitle + ' Route');
	    	} else if (routeClicked == 'gtownpm') {
		    	routeTitle = 'Yellow';
		    	$('#route_map_title').html(routeTitle + ' Route');
	    	} else if (routeClicked == 'green') {
		    	routeTitle = 'Green';
		    	$('#route_map_title').html(routeTitle + ' Route');
	    	} else if (routeClicked == 'blue') {
		    	routeTitle = 'Blue';
		    	$('#route_map_title').html(routeTitle + ' Route');
	    	} else if (routeClicked == 'rosslyn') {
		    	routeTitle = 'Light Blue';
		    	$('#route_map_title').html(routeTitle + ' Route');
	    	} else if (routeClicked == 'potomac') {
		    	routeTitle = 'Orange';
		    	$('#route_map_title').html(routeTitle + ' Route');
	    	}
	    	
	    	
		} else {
			$('#route_map_title').html('Route ' + routeClicked);
		}
		
		if (device.platform == "iOS") {
			$.mobile.changePage( "#route_map", { transition: "fade"} );
		} else {
			$.mobile.changePage( "#route_map", { transition: "none"} );
		}
			    
	});
	
	//if (device.platform != "iOS") {
		//var initialScreenSize = window.innerHeight;
		//window.addEventListener("resize", function() {
	$( ".ui-footer" ).fixedtoolbar( "option", "hideDuringFocus" );
		//});
	//}
	
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
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}
		    	
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
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}
		    	
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
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}

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
		
		if (device.platform == "iOS") {
			mapOptions2 = {
				
		        diameter: 1500,
		        lat: currentLatitude,
		        lon: currentLongitude
	
		    };
		} else {
			mapOptions2 = {
				height: mapHeight, // changed for android, does this work on ios?
				offsetTop: mapOffsetTop, // changed for android, does this work on ios?
		        diameter: 1000,
		        lat: currentLatitude,
		        lon: currentLongitude
		    };
		}
		
	    
	    //console.log('call mapoptions');
	    window.plugins.mapKit.setMapData(mapOptions2);
		
		markerStopPoints(stopsForRoute);

	}).error(function(jqXHR, textStatus, errorThrown) {
		//$.mobile.loading( 'hide' );
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}
		    	
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
				subTitle: 'Metro Bus Stop #' + data.Direction0.Stops[i].StopID,
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
				subTitle: 'Metro Bus Stop #' + data.Direction1.Stops[i].StopID,
				//pinColor: "70f270",
				pinColor: "green",
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
	//console.log('getrailstops start, lat=' + latitude + ' long=' + longitude + ' radius=' + radius);
	
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
	
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}

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
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}

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


getRailStopsForRoute = function(routeID) {
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
	function getRailStopsForRouteConfirm(buttonIndex) {
        if (buttonIndex == 1) {
        	getRailStopsForRoute(routeID);
        }
    }
    
    ajaxCount++;
    if (ajaxCount > 0) {
    	$.mobile.loading( 'show' );
    }
		
	getRailStopsForRouteJSON = $.getJSON('http://api.wmata.com/Rail.svc/json/JStations?LineCode=' + routeID + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}
    	
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
	
		//console.log('ajax call done');
		//console.log('getstopsforroute hide');
		getStopsForRouteFlag = true;
		//$.mobile.loading( 'hide' );
		
		//console.log('getstopsforroute callback hide');
		//$.mobile.loading( 'hide' );
		railStopsForRoute = data;
		
		//console.log(stopsForRoute);
		
		if (device.platform == "iOS") {
			mapOptions2 = {
				
		        diameter: 1500,
		        lat: currentLatitude,
		        lon: currentLongitude
	
		    };
		} else {
			mapOptions2 = {
				height: mapHeight, // changed for android, does this work on ios?
				offsetTop: mapOffsetTop, // changed for android, does this work on ios?
		        diameter: 1000,
		        lat: currentLatitude,
		        lon: currentLongitude
		    };
		}
	    
	    //console.log('call mapoptions');
	    window.plugins.mapKit.setMapData(mapOptions2);
		
		markerRailStopPoints(railStopsForRoute);

	}).error(function(jqXHR, textStatus, errorThrown) {
		//$.mobile.loading( 'hide' );
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}
		    	
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
		
		if (errorThrown != 'abort') {
			navigator.notification.confirm(
			    'An error occured fetching the data you requested.',  // message
			    getRailStopsForRouteConfirm,         // callback
			    "There was an error",            // title
			    'Try again,Cancel'                  // buttonName
		    ); 
		}
	});
	
}



// make markers for each stop on a route (different functions for coming and going to do different colors)
markerRailStopPoints = function(data) {
	//console.log('start markerStopPoints');
	var pins0 = [];
	var pins1 = [];
	
	var inRangeLatitude = false;
	var inRangeLongitude = false;

	
	$.each(data.Stations, function(i, object) {

		//console.log('done with pin0 ' + i);
		
		if (object.StationTogether1 != "") {
			var stationCode = object.Code + ',' + object.StationTogether1;
		} else {
			var stationCode = object.Code;
		}
		
		pins0.push(
			{
				lat: object.Lat,
				lon: object.Lon,
				title: object.Name,
				subTitle: 'Metro Rail Station #' + stationCode,
				pinColor: "red",
				selected: false,
				index: i
			}
		);
	});


	
	
	//console.log(inRangeLongitude + ',' + inRangeLatitude);
	//console.log(pins0);
	//console.log(pins1);
	window.plugins.mapKit.addMapPins(pins0);
	//console.log('markerstoppoints hide');
	//$.mobile.loading( 'hide' );
	//console.log(inRangeLongitude + ',' + inRangeLatitude);
	
	var pinLength = pins0.length;
	//console.log(pinLength);
	pinLength = parseInt(pinLength * 0.5);

	
}


// get a list of stops nearby
getCirculatorStops = function(latitude,longitude,radius) {
	//console.log('getrailstops start, lat=' + latitude + ' long=' + longitude + ' radius=' + radius);
	
	//$.mobile.loading( 'show' );

	function getCirculatorStopsConfirm(buttonIndex) {
        if (buttonIndex == 1) {
        	getCirculatorStops(latitude,longitude,radius);
        }
    }
    
    getNewCirculatorData = function() {
    	
		window.localStorage.setItem("circulatorStopsDatestamp", currentTime);
	    
	    circulatorStopsArray = [];
	    circulatorStopsArray.length = 0;
	    
	    circulatorStops = [];
	    circulatorStops.length = 0;
	    
	    window.localStorage.removeItem("circulatorStops");
	    
	    // count for how many lines we've gotten via ajax, so we know when we're done
	    ajaxCirculatorCount = 0;
	    
	    function getCirculatorLineStops(lineTag) {
		    ajaxCount++;
		    if (ajaxCount > 0) {
		    	$.mobile.loading( 'show' );
		    }
		    
		    ajaxCirculatorCount++;
		    
	    	getCirculatorStopsJSON = $.get('http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=dc-circulator&r=' + lineTag + '', function(data) {
	    		if (ajaxCount > 0 ) {
		    		ajaxCount--;
		    	} else {
			    	ajaxCount = 0;
		    	}
		    	
			    if (ajaxCount == 0) {
			    	$.mobile.loading( 'hide' );
			    }
			    
			    circulatorStopsArray.push($.xml2json(data));
			    
			    $.each(circulatorStopsArray, function(i, object) {
			    
			    	circulatorStopsArrayObject = object;
		
				    $.each(object.route.stop, function(i, object2) {
				    
				    	circulatorStopsArrayStopObject = object2;
				    
				    	object2.route = circulatorStopsArrayObject.route.tag;
				    
				    	circulatorStops.push(object2);
			    
				    	window.localStorage.setItem("circulatorStops", JSON.stringify(circulatorStops));
				    	
				    	
				    });
				    
				   
				 });
				 
				 // only put pins on the map if they're all done loading
				 if (ajaxCirculatorCount == 6) {
					//console.log('marker time!');
					//console.log('marker circ stops from getcirculatorstopsJSON/getcirculatorLineStops');
					markerCirculatorStops(currentLatitude,currentLongitude, .01 , .01);
				 }
		 
				

			    
			    
	    	}).error(function(jqXHR, textStatus, errorThrown) {
				//$.mobile.loading( 'hide' );
				
				if (ajaxCount > 0 ) {
		    		ajaxCount--;
		    	} else {
			    	ajaxCount = 0;
		    	}
		    	
			    if (ajaxCount == 0) {
			    	$.mobile.loading( 'hide' );
			    }
				
				if (errorThrown != 'abort') {
					navigator.notification.confirm(
					    'An error occured fetching the data you requested.',  // message
					    getCirculatorStopsConfirm,         // callback
					    "There was an error",            // title
					    'Try again,Cancel'                  // buttonName
				    ); 
				}
			});
	    }
	    
	    // hard coded circulator line tags taken from http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=dc-circulator to speed this up, which works but only to a certain point...
	    getCirculatorLineStops('yellow');
	    getCirculatorLineStops('gtownpm');
	    getCirculatorLineStops('green');
	    getCirculatorLineStops('blue');
	    getCirculatorLineStops('rosslyn');
	    getCirculatorLineStops('potomac');

		
		/* we don't use this big AJAX-in-AJAX loop anymore because it tends to block the UI...
getCirculatorLineListJSON = $.get('http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=dc-circulator', function(data) {
	
			if (ajaxCount > 0 ) {
	    		ajaxCount--;
	    	} else {
		    	ajaxCount = 0;
	    	}

		    if (ajaxCount == 0) {
		    	$.mobile.loading( 'hide' );
		    }
		    
		    circulatorLineList = $.xml2json(data);
		    
		    circulatorStopsArray = [];
		    circulatorStopsArray.length = 0;
		    
		    circulatorStops = [];
		    circulatorStops.length = 0;
		    
		    window.localStorage.removeItem("circulatorStops");
		    
		    // count for how many lines we've gotten via ajax, so we know when we're done
		    ajaxCirculatorCount = 0;
		    
		    $.each(circulatorLineList.route, function(i, object) {
		    	//code to loop through each AJAX request used to go here, but no longer used.
		    });
		    
		    
			//console.log('ajax call done');
			//$.mobile.loading( 'hide' );
			
			//railStops = data;
			//console.log(railStops);
	
			// output to log
			
			//circulatorStopsJSON = JSON.parse(window.localStorage.getItem("circulatorStops"));
			//markerCirculatorStops(circulatorStopsJSON);
	
			//console.log(stops.Stops[0].Lat);
	
			
		}).error(function(jqXHR, textStatus, errorThrown) {
			//$.mobile.loading( 'hide' );
			
			if (ajaxCount > 0 ) {
	    		ajaxCount--;
	    	} else {
		    	ajaxCount = 0;
	    	}
		    	
		    if (ajaxCount == 0) {
		    	$.mobile.loading( 'hide' );
		    }
			
			if (errorThrown != 'abort') {
				navigator.notification.confirm(
				    'An error occured fetching the data you requested.',  // message
				    getCirculatorStopsConfirm,         // callback
				    "There was an error",            // title
				    'Try again,Cancel'                  // buttonName
			    ); 
			}
		});
*/
	}
    
    var currentTime = new Date();
    var lastWeek = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
    var datestamp = new Date(window.localStorage.getItem("circulatorStopsDatestamp"));
    
    // check for cached circulator data. If there is none, get it.
    if (window.localStorage.getItem("circulatorStopsDatestamp") && window.localStorage.getItem("circulatorStops")) {
    	//console.log('first if');
    
    	// if our circulator data is a week old, get new data
    	if (datestamp < lastWeek ) {
			//console.log('circulator data is old! get new data!');
			window.localStorage.setItem("circulatorStopsDatestamp", currentTime);
			getNewCirculatorData();
			
	    } else {
	    	//console.log('circulator data is not old!');
	    	//console.log('marker circ stops from getcirculatorstops');
	    	markerCirculatorStops(currentLatitude,currentLongitude, .01 , .01);
	    }
	    
    } else {
	    //console.log('circulator data is old! get new data!');
	    getNewCirculatorData();
    }
	
}


getCirculatorStopsForRoute = function(routeID) {
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
	function getCirculatorStopsForRouteConfirm(buttonIndex) {
        if (buttonIndex == 1) {
        	getCirculatorStopsForRoute(routeID);
        }
    }
    
    ajaxCount++;
    if (ajaxCount > 0) {
    	$.mobile.loading( 'show' );
    }
		
	getCirculatorStopsForRouteJSON = $.get('http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=dc-circulator&r=' + routeID, function(data) {
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}

	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
	
		//console.log('ajax call done');
		//console.log('getstopsforroute hide');
		getStopsForRouteFlag = true;
		//$.mobile.loading( 'hide' );
		
		//console.log('getstopsforroute callback hide');
		//$.mobile.loading( 'hide' );
		circulatorStopsForRoute = $.xml2json(data);
		
		//console.log(stopsForRoute);
		
		if (device.platform == "iOS") {
			mapOptions2 = {
				
		        diameter: 1500,
		        lat: currentLatitude,
		        lon: currentLongitude
	
		    };
		} else {
			mapOptions2 = {
				height: mapHeight, // changed for android, does this work on ios?
				offsetTop: mapOffsetTop, // changed for android, does this work on ios?
		        diameter: 1000,
		        lat: currentLatitude,
		        lon: currentLongitude
		    };
		}
	    
	    //console.log('call mapoptions');
	    window.plugins.mapKit.setMapData(mapOptions2);
		
		markerCirculatorStopPoints(circulatorStopsForRoute);

	}).error(function(jqXHR, textStatus, errorThrown) {
		//$.mobile.loading( 'hide' );
		
		if (ajaxCount > 0 ) {
    		ajaxCount--;
    	} else {
	    	ajaxCount = 0;
    	}
		    	
	    if (ajaxCount == 0) {
	    	$.mobile.loading( 'hide' );
	    }
		
		if (errorThrown != 'abort') {
			navigator.notification.confirm(
			    'An error occured fetching the data you requested.',  // message
			    getCirculatorStopsForRouteConfirm,         // callback
			    "There was an error",            // title
			    'Try again,Cancel'                  // buttonName
		    ); 
		}
	});
	
}



// make markers for each stop on a route (different functions for coming and going to do different colors)
markerCirculatorStopPoints = function(data) {
	//console.log('start markerStopPoints');
	var pins0 = [];
	var pins1 = [];
	
	var inRangeLatitude = false;
	var inRangeLongitude = false;
	
	routePointData = data;
	
	// grab the direction tag information so we can compare it to the stops later
	var pins0stopArray = _.pluck(data.route.direction[0].stop, 'tag');
	var pins1stopArray = _.pluck(data.route.direction[1].stop, 'tag');
	//console.log(pins0stopArray);
	//console.log(pins1stopArray);
	
	$.each(data.route.stop, function(i, object) {
		//console.log(object.tag);
		//console.log('pin0= ' + $.inArray(object.tag, pins0stopArray));
		//console.log('pin1= ' + $.inArray(object.tag, pins1stopArray));
		if ($.inArray(object.tag, pins0stopArray) != -1) {
			//console.log(pin0);
			pins0.push(
				{
					lat: object.lat,
					lon: object.lon,
					title: object.shortTitle,
					subTitle: 'Circulator Stop #' + object.stopId,
					pinColor: "purple",
					selected: false,
					index: '##' + object.stopId
				}
			);
		} else if ($.inArray(object.tag, pins1stopArray) != -1){
			//console.log(pin1);
			pins1.push(
				{
					lat: object.lat,
					lon: object.lon,
					title: object.shortTitle,
					subTitle: 'Circulator Stop #' + object.stopId,
					//pinColor: "bd91e5",
					pinColor: "purple",
					selected: false,
					index: '##' + object.stopId
				}
			);
		}
	});


	
	
	//console.log(inRangeLongitude + ',' + inRangeLatitude);
	//console.log(pins0);
	//console.log(pins1);
	window.plugins.mapKit.addMapPins(pins0)
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
	//console.log('annotation tap');
	//console.log(latitude);
	
	//text = text.toString().replace(/Metro Rail Station #/,'').replace(/Metro Bus Stop #/,'');
	
	
	
	//console.log(routeMapView);
	// if we just clicked a route map pin, we need to get the stops data loaded first to make a good infowindow, so do that then loop back to this function and show the infowindow
	if (routeMapView == true) {
		notInRangeStopID = text.toString();
		favoriteBtnClickedFlag = true;
			if ((/Metro Rail Station #/).test(text)) {
				getRailStops(latitude, longitude, '500');
			} else if ((/Metro Bus Stop #/).test(text)) {
				getStops(latitude, longitude, '50');
			} else if ((/Circulator Stop #/).test(text)) {
				//console.log('marker circ stops from annotationtap');
				markerCirculatorStops(latitude,longitude, .01 , .01);
			}
				
	} else {
	
		// if this is a rail stop, do that function
		if ((/Metro Rail Station #/).test(text)) {
	
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
				//console.log('http://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + stopID.toString().replace(/Metro Rail Station #/,'') + '?api_key=' + wmata_api_key + '&callback=?');
				
				annotationTapJSON = $.getJSON('http://api.wmata.com/StationPrediction.svc/json/GetPrediction/' + stopID.toString().replace(/Metro Rail Station #/,'') + '?api_key=' + wmata_api_key + '&callback=?', function(data2, self4) {
					
					if (ajaxCount > 0 ) {
			    		ajaxCount--;
			    	} else {
				    	ajaxCount = 0;
			    	}

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
					if (ajaxCount > 0 ) {
			    		ajaxCount--;
			    	} else {
				    	ajaxCount = 0;
			    	}
		    	
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
		} else if ((/Metro Bus Stop #/).test(text)) {
	
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
				
				annotationTapJSON = $.getJSON('http://api.wmata.com/NextBusService.svc/json/JPredictions?StopID=' + stopID.toString().replace(/Metro Bus Stop #/,'') + '&api_key=' + wmata_api_key + '&callback=?', function(data2, self4) {
					
					if (ajaxCount > 0 ) {
			    		ajaxCount--;
			    	} else {
				    	ajaxCount = 0;
			    	}

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
				    	
				    	if (device.platform == "iOS") {
							$.mobile.changePage( "#route_map", { transition: "fade"} );
						} else {
							$.mobile.changePage( "#route_map", { transition: "none"} );
						}	
				    	
				    });
				    
				    //$( "#infowindow" ).popup( "open" );
				    
				    //console.log('show page');
				    // show the page
				    annotationTapJSON.abort();
				    
				    if (device.platform == "iOS") {
						$.mobile.changePage( "#infowindow", { transition: "fade"} );
					} else {
						$.mobile.changePage( "#infowindow", { transition: "none"} );
					}
				    
				    $('#infowindow-routes').listview('refresh').iscrollview("refresh").css('height', $('#infowindow').css('min-height'));
				    
				    	
			    }).error(function(jqXHR, textStatus, errorThrown) {
					//$.mobile.loading( 'hide' );
					//console.log(errorThrown);
					if (ajaxCount > 0 ) {
			    		ajaxCount--;
			    	} else {
				    	ajaxCount = 0;
			    	}
		    	
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
			
		}  else if ((/Circulator Stop #/).test(text)) {
	
			self3 = this;
			//console.log('click!');
			stopID = text;
			console.log(stopID);
			var self3 = this;
			
		
			
			
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
			    
			    console.log('circulator!');
			    
			    ajaxCount++;
			    if (ajaxCount > 0) {
				    $.mobile.loading( 'show' );
				}
				
				annotationTapJSON = $.get('http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=dc-circulator&stopId=' + stopID.toString().replace(/Circulator Stop #/,'') + '', function(data) {
			    
			    
					
					if (ajaxCount > 0 ) {
			    		ajaxCount--;
			    	} else {
				    	ajaxCount = 0;
			    	}
		    	
					if (ajaxCount == 0) {
						$.mobile.loading( 'hide' );
					}
				
					//console.log('predictions=' + data2.Predictions.length);
					//sorted = data2.Predictions.sort(function(a,b) {return b - a; });
					
					//$.mobile.loading( 'hide' );
					// thanks to Vlad Lyga for this part: http://stackoverflow.com/questions/14308149/how-do-i-merge-two-json-objects-in-javascript-jquery
					predictions = $.xml2json(data);
					
					//console.log(predictions);
					
					routeTimes = {
						minutes: {},
						directionText: {}
					};
		
					// if there's more than one route at this stop...
					if (typeof(predictions.predictions.length) != 'undefined') {
						//console.log('true');
						for (var index in predictions.predictions) {
				
					        if(!routeTimes.minutes.hasOwnProperty(predictions.predictions[index].routeTag)) {
				
					            routeTimes.minutes[predictions.predictions[index].routeTag] = [];
					            routeTimes.directionText[predictions.predictions[index].routeTag] = [];
				
					            if (typeof(predictions.predictions[index].direction) !== 'undefined') {
				
					            	routeTimes.minutes[predictions.predictions[index].routeTag].push(predictions.predictions[index].direction.prediction);
					            	
				
					            }
					            
					           
				            	if (typeof(predictions.predictions[index].direction) !== 'undefined') {
				            		 routeTimes.directionText[predictions.predictions[index].routeTag].push(predictions.predictions[index].direction.title + ' ' + predictions.predictions[index].routeTitle);
				            	} else {
				            		 routeTimes.directionText[predictions.predictions[index].routeTag].push(predictions.predictions[index].routeTitle);
				            	}
				
					        } else {
				
					        	if (typeof(predictions.predictions[index].direction) !== 'undefined') {
				
					        		routeTimes.minutes[predictions.predictions[index].routeTag].push(predictions.predictions[index].direction.prediction);
					        		
				
					        	}
					        	
					        	if (typeof(predictions.predictions[index].direction) !== 'undefined') {
				            		 routeTimes.directionText[predictions.predictions[index].routeTag].push(predictions.predictions[index].direction.title + ' ' + predictions.predictions[index].routeTitle);
				            	} else {
				            		 routeTimes.directionText[predictions.predictions[index].routeTag].push(predictions.predictions[index].routeTitle);
				            	}
					            
				
					        }
					    }
				    } else {

					    //console.log('false');
				        if(!routeTimes.minutes.hasOwnProperty(predictions.predictions.routeTag)) {
			
				            routeTimes.minutes[predictions.predictions.routeTag] = [];
				            routeTimes.directionText[predictions.predictions.routeTag] = [];
			
				            if (typeof(predictions.predictions.direction) !== 'undefined') {
			
				            	routeTimes.minutes[predictions.predictions.routeTag].push(predictions.predictions.direction.prediction);
				            	
			
				            }
				            
				            if (typeof(predictions.predictions.direction) !== 'undefined') {
			            		 routeTimes.directionText[predictions.predictions.routeTag].push(predictions.predictions.direction.title + ' ' + predictions.predictions.routeTitle);
			            	} else {
			            		 routeTimes.directionText[predictions.predictions.routeTag].push(predictions.predictions.routeTitle);
			            	}
			
				        } else {
			
				        	if (typeof(predictions.predictions.direction) !== 'undefined') {
			
				        		routeTimes.minutes[predictions.predictions.routeTag].push(predictions.predictions.direction.prediction);
				        		
			
				        	}
				        	
				        	if (typeof(predictions.predictions.direction) !== 'undefined') {
				            		 routeTimes.directionText[predictions.predictions.routeTag].push(predictions.predictions.direction.title + ' ' + predictions.predictions.routeTitle);
				            	} else {
				            		 routeTimes.directionText[predictions.predictions.routeTag].push(predictions.predictions.routeTitle);
				            	}
				            
			
				        }

				    }
				
				    // this function needs nearby stops already loaded to load all stops for the route, not just predictions, but maybe it shouldn't in case you want to see your favorite stops and they're not in range? Right now, I'll just make it load only routes with predictions, but eventually would be nice to do the second AJAX call to load this stop into memory
				    /*
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
*/    
				    
				    //stops.Stops[0].Routes = routesVsMinutes;
				    //console.log(routeTimes);
				    //console.log('now to creatRouteList');
				    // create HTML for the infowindow
				    createCirculatorRouteList(routeTimes);
				    //console.log(routeList);
				    $('#infowindow-routes').html(circulatorRouteList);
				    
				    
				    // pass some variables to the next page if a button is clicked
				    $('.route-detail-btn').click(function() {
				    
				    	//console.log('route btn clicked');
				
				    	routeClicked = $(this).attr('id');
				    	
				    	if (routeClicked == 'yellow') {
					    	routeTitle = 'Yellow';
				    	} else if (routeClicked == 'gtownpm') {
					    	routeTitle = 'Yellow';
				    	} else if (routeClicked == 'green') {
					    	routeTitle = 'Green';
				    	} else if (routeClicked == 'blue') {
					    	routeTitle = 'Blue';
				    	} else if (routeClicked == 'rosslyn') {
					    	routeTitle = 'Light Blue';
				    	} else if (routeClicked == 'potomac') {
					    	routeTitle = 'Orange';
				    	}
				    	
				    	$('#route_map_title').html(routeTitle + ' Route');
				    
				    	if (device.platform == "iOS") {
							$.mobile.changePage( "#route_map", { transition: "fade"} );
						} else {
							$.mobile.changePage( "#route_map", { transition: "none"} );
						}

				    });
				    
				    //$( "#infowindow" ).popup( "open" );
				    
				    //console.log('show page');
				    // show the page
				    annotationTapJSON.abort();
				    
				    if (device.platform == "iOS") {
						$.mobile.changePage( "#infowindow", { transition: "fade"} );
					} else {
						$.mobile.changePage( "#infowindow", { transition: "none"} );
					}
					
				    $('#infowindow-routes').listview('refresh').iscrollview("refresh").css('height', $('#infowindow').css('min-height'));
				    
				    	
			    }).error(function(jqXHR, textStatus, errorThrown) {
					//$.mobile.loading( 'hide' );
					//console.log(errorThrown);
					if (ajaxCount > 0 ) {
			    		ajaxCount--;
			    	} else {
				    	ajaxCount = 0;
			    	}
		    	
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
				//console.log('Metro Bus Stop #' + data.Stops[i].StopID + ' == ' + obj.subTitle + '?');
				return obj.subTitle == 'Metro Bus Stop #' + data.Stops[i].StopID;
			});
			
			if (matches.length == 0) {
				
				//console.log('no matches');
				//console.log(matches);
				
				// if this is a new pin, add it to the global pin array AND the new pin array
				if (routeMapView != true) {
					pins.push(
						{
							lat: data.Stops[i].Lat,
							lon: data.Stops[i].Lon,
							title: toTitleCase(data.Stops[i].Name),
							subTitle: 'Metro Bus Stop #' + data.Stops[i].StopID,
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
							subTitle: 'Metro Bus Stop #' + data.Stops[i].StopID,
							pinColor: "green",
							selected: false,
							index: i
						}
					);
				}
			
			}
			
	
	
	        // loop through all routes in this stop and create a string from all of them
	        createRouteList = function(data) {
	        	//console.log('createRouteList start');
	        	routeListArray = [];
				routeList = '';
				routeList.replace(routeList, '');
				potentialRouteList = [];
				potentialRouteList.length = 0;
				actualRouteList = [];
				potentialVsActual = [];
				
				// create a list of all possible routes at this stop
				$.each(stops.Stops, function(i2, object2) {
					if (stopID.toString().replace(/Metro Bus Stop #/,'') == stops.Stops[i2].StopID) {
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
					console.log(data);
					dataWorld = data;

					lowestMinute = 'start';
					routePlaced = false;
					lowestMinuteArray = [];
					
					$.each(data.minutes, function(i3, object) {
						
						
						// weed out undefined routes
						if (i3 != 'undefined'){
							//console.log('i3= ' + i3);
							if (lowestMinute == 'start') {
								routeListArray.push('<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>' + data.directionText[i3][0].replace(/North/,'N').replace(/South/,'S').replace(/East/,'E').replace(/West/,'W') + ' arrives in:</p><p><strong>' + data.minutes[i3].join(', ') + '</strong> minutes</p><span class="ui-li-count">' + i3 + '</span></li>');
								
								lowestMinute = data.minutes[i3][0];
								lowestMinuteArray.push(data.minutes[i3][0]);
							} else {
								if (data.minutes[i3][0] > lowestMinute) {
									$.each(lowestMinuteArray, function(i, object) {
										if (data.minutes[i3][0] < object) {
											lowestMinuteArray.splice(i, 0, data.minutes[i3][0]);
											routeListArray.splice(i, 0, '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>' + data.directionText[i3][0].replace(/North/,'N').replace(/South/,'S').replace(/East/,'E').replace(/West/,'W') + ' arrives in:</p><p><strong>' + data.minutes[i3].join(', ') + '</strong> minutes</p><span class="ui-li-count">' + i3 + '</span></li>');
											routePlaced = true;
										}
									});
									
									if (routePlaced == false) {
										routeListArray.push('<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>' + data.directionText[i3][0].replace(/North/,'N').replace(/South/,'S').replace(/East/,'E').replace(/West/,'W') + ' arrives in:</p><p><strong>' + data.minutes[i3].join(', ') + '</strong> minutes</p><span class="ui-li-count">' + i3 + '</span></li>');
									} else {
										routePlaced == false;
									}
								} else {
									routeListArray.unshift('<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>' + data.directionText[i3][0].replace(/North/,'N').replace(/South/,'S').replace(/East/,'E').replace(/West/,'W') + ' arrives in:</p><p><strong>' + data.minutes[i3].join(', ') + '</strong> minutes</p><span class="ui-li-count">' + i3 + '</span></li>');
									
									lowestMinute = data.minutes[i3][0];
									lowestMinuteArray.unshift(data.minutes[i3][0]);
								}
							}
							
							
						actualRouteList.push(i3);
						potentialVsActual = potentialRouteList.diff(actualRouteList);
						}
					});
					
					routeList = routeListArray.join('');
					
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
	
			
			// rail matching query
			railMatches = jQuery.grep(pins, function(obj) {
				// our match function to see if a pin already exists in the global pin array
				return obj.index == '#' + data.Entrances[i].ID;
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
				if (routeMapView != true) {
					pins.push(
						{
							lat: data.Entrances[i].Lat,
							lon: data.Entrances[i].Lon,
							title: data.Entrances[i].Name,
							subTitle: 'Metro Rail Station #' + stationCode,
							pinColor: "red",
							selected: false,
							index: '#' + data.Entrances[i].ID
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
							index: '#' + data.Entrances[i].ID
						}
					);
				}
			
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
				missingRailRoutes = [];
				missingRailRoutes.length = 0;
				
				//railRouteList = data;
				stationList = station.toString().replace(/Metro Rail Station #/,'').split(',');
				
				railStationInfo = [];
				railStationInfo.length = 0;
				
				railStationInfoCount = 0;
				
				
				$.each(stationList, function(i, object) {
					function getRailStationInfoConfirm(buttonIndex) {
				        if (buttonIndex == 1) {
				        	createRailRouteList(railRouteList,stationList);
				        }
				    }

				    ajaxCount++;
				    if (ajaxCount > 0) {
				    	$.mobile.loading( 'show' );
				    }
				    
					//console.log('start each');
					getRailStationInfoJSON = $.getJSON('http://api.wmata.com/Rail.svc/json/JStationInfo?StationCode=' + object + '&api_key=' + wmata_api_key + '&callback=?', function(data) {
						//console.log(data);
					
						if (ajaxCount > 0 ) {
				    		ajaxCount--;
				    	} else {
					    	ajaxCount = 0;
				    	}

					    if (ajaxCount == 0) {
					    	$.mobile.loading( 'hide' );
					    }
					    
					    //console.log(data);

						railStationInfo.push(data);
						
						//console.log(railStationInfoCount);
						//increment our AJAX count and see if we've got all the station info we need...
						railStationInfoCount++;
						
						if (railStationInfoCount == stationList.length) {
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
							
							//if (typeof(railDirectionTracker) === 'undefined') {
								railDirectionTracker = [];
								railDirectionTracker.length = 0;
							//}
							
							//console.log(object);
							
							//search and make sure the predictions we're getting are for real trains, and not fake ones...
							$.each(predictions.Trains, function(i, object) {
								if (object.Line == 'RD' || object.Line == 'YL' || object.Line == 'GR' || object.Line == 'BL' || object.Line == 'OR') {
									actualRailRouteList.push(object.Line);
								}
							});
							
							//console.log('before if');
							//console.log(realRailTrains);
							// make HTML for infowindow for actual buses that are coming
							if (actualRailRouteList.length != 0) {
								//console.log('realRailTrains true');
								//console.log(data);
								//dataWorld = railStationInfo;
								
								
								
								$.each(predictions.Trains, function(i3, object) {
								
									objDestName = object.DestinationCode;
									//console.log(objDestName);
									
									if (object.DestinationCode != null) {
										if(object.Min != '') {
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
									
										
										
									}
								});
								
								$.each(railDirectionTracker, function(i, object) {
									railRouteList = railRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + object.Line + '"><p>to ' + object.DestinationName + ' arrives in:</p><p><strong>' + object.Min + '</strong> minutes</p><span class="ui-li-count">' + object.Line + '</span></li>';
								});
								
								// then after, loop through routes with no predictions and add to the end
								if (potentialRailRouteList.diff(actualRailRouteList).length != 0) {
									missingRailRoutes = potentialRailRouteList.diff(actualRailRouteList);
									
									$.each(missingRailRoutes, function(i, object) {
										// check for the routes with a lowercase c or v in their name, they are variation routes and should be ignored
										railRouteList = railRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + object + '"><p>no prediction available</p><span class="ui-li-count">' + object + '</span></a></li>';
										
									});
								}
								
								
								

							} else { 
								
								// if there are no predictions at all, just do the stops
								//console.log('realRailTrains false');
								$.each(potentialRailRouteList, function(i4, object4) {			
									railRouteList = railRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + object4 + '"><p>no prediction available</p><span class="ui-li-count">' + object4 + '</span></a></li>';
								});
								
								actualRailRouteList.length = 0;
								railPotentialVsActual.length = 0;

				
							}
							
							//console.log('potential routes for stop ' + stopIDfocus + ': ' + potentialRouteList + ' and actual routes: ' + actualRouteList);
							//console.log(stopName);
							console.log(stationList.join().toString());
							var dt = new DateTime();
							railRouteList = '<li data-role="list-divider" class="stopTitle" id="' + station + '" data-lat=' + railStopLat + '" data-lon=' + railStopLon + '"><span class="stopName">' + railStopName + '</span></li>' + railRouteList + '<div class="updated">Updated ' + dt.formats.busTrackDateTime.b + ' - Pull to refresh</div>';

							//console.log(railRouteList);
							
						}
						
						//delete realRailTrains; //unset the variable for the next loop
						//console.log(routes);
						
						
						$('#infowindow-routes').html(railRouteList);
				    
				    
					    // pass some variables to the next page if a button is clicked
					    $('.route-detail-btn').click(function() {
					    
					    	//console.log('route btn clicked');
					    	//console.log($(this).attr('id'));
					
					    	routeClicked = $(this).attr('id');
					    	
					    	//console.log(routeClicked);
					    	
					    	if (routeClicked == 'RD') {
						    	routeTitle = 'Red';
					    	} else if (routeClicked == 'BL') {
						    	routeTitle = 'Blue';
					    	} else if (routeClicked == 'OR') {
						    	routeTitle = 'Orange';
					    	} else if (routeClicked == 'YL') {
						    	routeTitle = 'Yellow';
					    	} else if (routeClicked == 'GR') {
						    	routeTitle = 'Green';
					    	}
					    	
					    	$('#route_map_title').html(routeTitle + ' Line');
					    	
					    	if (device.platform == "iOS") {
								$.mobile.changePage( "#route_map", { transition: "fade"} );
							} else {
								$.mobile.changePage( "#route_map", { transition: "none"} );
							}
	
					    });
					    
					    //$( "#infowindow" ).popup( "open" );
					    
					    //console.log('show page');
					    // show the page
					    annotationTapJSON.abort();
					    
					    if (device.platform == "iOS") {
							$.mobile.changePage( "#infowindow", { transition: "fade"} );
						} else {
							$.mobile.changePage( "#infowindow", { transition: "none"} );
						}
						
					    $('#infowindow-routes').listview('refresh').iscrollview("refresh").css('height', $('#infowindow').css('min-height'));
						
					}).error(function(jqXHR, textStatus, errorThrown) {
						//$.mobile.loading( 'hide' );
						
						if (ajaxCount > 0 ) {
				    		ajaxCount--;
				    	} else {
					    	ajaxCount = 0;
				    	}
		    	
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



// make a stop marker and info window
markerCirculatorStops = function(latitude,longitude,latitudeDelta,longitudeDelta) {
	// make a new pins array to store new pins being added
	newCirculatorPins = [];
	newCirculatorPins.length = 0;
	
	if (window.localStorage.getItem("circulatorStops") != null) {
		var circulatorData = JSON.parse(window.localStorage.getItem("circulatorStops"));
	}
	
	
	
	//console.log('start markerCircStops');
	//console.log(data.Entrances.length);
	
	/*
latPlusDelta = parseFloat(latitude) + parseFloat(latitudeDelta);
	latMinusDelta = parseFloat(latitude) - parseFloat(latitudeDelta);
	lonPlusDelta = parseFloat(longitude) + parseFloat(longitudeDelta);
	lonMinusDelta = parseFloat(longitude) - parseFloat(longitudeDelta);
*/
	
	//console.log('latitude=' + latitude + ' longitude=' + longitude + ' latitude+delta=' + latPlusDelta + ' latitude-delta=' + latMinusDelta + ' longitude+delta=' + lonPlusDelta + ' longitude-delta=' + lonMinusDelta);
	
	if (circulatorData) {
		//console.log('start loop');
		$.each(circulatorData, function(i, object) {
		
			//console.log('data lat=' + object.lat + ' data lon=' + object.lon);
			
			// make sure the pin is in view, if not, we don't want to marker it just yet
			if ((object.lat <= (parseFloat(latitude) + parseFloat(latitudeDelta))) && (object.lat >= (parseFloat(latitude) - parseFloat(latitudeDelta))) && (object.lon <= (parseFloat(longitude) + parseFloat(longitudeDelta))) && (object.lon >= (parseFloat(longitude) - parseFloat(longitudeDelta)))) {
				// rail matching query
				circulatorMatches = jQuery.grep(pins, function(obj) {
					// our match function to see if a pin already exists in the global pin array
					//console.log(obj.index);
					//console.log(object.stopId);
					return obj.index == '##' + object.stopId;
				});
				
				//console.log(circulatorMatches);
				
				if (circulatorMatches.length == 0) {
					
					//console.log('no matches');
					//console.log(matches);
					//console.log(routeMapView);
					// if this is a new pin, add it to the global pin array AND the new pin array
					if (routeMapView != true) {
						//console.log('pins');
						pins.push(
							{
								lat: object.lat,
								lon: object.lon,
								title: object.title,
								subTitle: 'Circulator Stop #' + object.stopId,
								pinColor: "purple",
								selected: false,
								index: '##' + object.stopId
							}
						);
						
						newCirculatorPins.push(
							{
								lat: object.lat,
								lon: object.lon,
								title: object.title,
								subTitle: 'Circulator Stop #' + object.stopId,
								pinColor: "purple",
								selected: false,
								index: '##' + object.stopId
							}
						);
					}
				
				}
				
			}
		
			
		
			
	
	
	        // loop through all routes in this stop and create a string from all of them
	        createCirculatorRouteList = function(data) {
	        	//console.log('createRouteList start');
				circulatorRouteList = '';
				circulatorRouteList.replace(circulatorRouteList, '');
				potentialCirculatorRouteList = [];
				potentialCirculatorRouteList.length = 0;
				actualCirculatorRouteList = [];
				circulatorPotentialVsActual = [];
				
				// create a list of all possible routes at this stop
				
				$.each(circulatorData, function(i2, object2) {
					if (stopID == 'Circulator Stop #' + object2.stopId) {
						stopIDfocus = object2.stopId;
						stopName = object2.title;
						//potentialRouteList = stops.Stops[i2].Routes;
						stopLat = object2.lat;
						stopLon = object2.lon;
						//potentialRouteList.push(routeID);
					}
					
				});

				
				
				//potentialRouteList.length = 0;
				
				
				// make a diff method for determining the difference in arrays
				Array.prototype.diff = function(a) {
				    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
				};
				
				//console.log(data);

				// make HTML for infowindow for actual buses that are coming
				//if (data.minutes.length) {
					//console.log('true');
					//console.log(data);
					dataWorld = data;
					yellowLineFlag = false;
					$.each(data.minutes, function(i3, object) {
						
						// weed out undefined routes
						if (i3 != 'undefined'){
							
							circulatorMinutesArray = [];
							circulatorMinutesArray.length = 0;
							//console.log(i3);
							//circulatorMinutesMultiArray = data.minutes.i3;
							if (typeof(data.minutes[i3][0]) != 'undefined') {
							
								if (data.minutes[i3][0].length > 0) {
									$.each(data.minutes[i3][0], function(i, object) {
										circulatorMinutesArray.push(object.minutes);
									});
								} else {
									$.each(data.minutes[i3], function(i, object) {
										circulatorMinutesArray.push(object.minutes);
									});
								}
								//console.log('i3= ' + i3);
								circulatorRouteList = circulatorRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>' + data.directionText[i3][0] + ' arrives in:</p><p><strong>' + circulatorMinutesArray.join(', ') + '</strong> minutes</p><span class="ui-li-count"><span>' + i3 + '</span></span></li>';
								actualCirculatorRouteList.push(i3);
								potentialCirculatorRouteList = potentialCirculatorRouteList.diff(actualCirculatorRouteList);
								
								if (i3 == 'gtownpm' || i3 == 'yellow') {
									yellowLineFlag = true;
								}
								
							}
							
						}
					});
					
					// then loop again to deal with the yellow line and empty routes
					$.each(data.minutes, function(i3, object) {
						
						// weed out undefined routes
						if (i3 != 'undefined'){
							
							circulatorMinutesArray = [];
							circulatorMinutesArray.length = 0;
							//console.log(i3);
							//circulatorMinutesMultiArray = data.minutes.i3;
							if (typeof(data.minutes[i3][0]) == 'undefined') {
								// don't show yellow line/georgetown pm line twice, only once
								if (yellowLineFlag != true) {
									circulatorRouteList = circulatorRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>no prediction available</p><span class="ui-li-count"><span>' + i3 + '</span></span></a></li>';
									if (i3 == 'gtownpm' || i3 == 'yellow') {
										yellowLineFlag = true;
									}
								//} else {
								//	yellowLineFlag = true;
								} else {
									if (i3 != 'gtownpm' && i3 != 'yellow') {
										circulatorRouteList = circulatorRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + i3 + '"><p>no prediction available</p><span class="ui-li-count"><span>' + i3 + '</span></span></a></li>';
									}

								}
								
							}
							
						}
					});
					
					// then after, loop through routes with no predictions and add to the end
					$.each(circulatorPotentialVsActual, function(i4, object4) {
						// don't show no prediction available for yellow line/georgetown pm line
						if (potentialVsActual[i4] != 'gtownpm' && potentialVsActual[i4] != 'yellow') {
							circulatorRouteList = circulatorRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + potentialVsActual[i4] + '"><p>no prediction available</p><span class="ui-li-count"><span>' + potentialVsActual[i4] + '</span></span></a></li>';
						}
						
						
						
					});
					
					// if there's no predictions at all, we need to show one yellow line with no predictions
/*
					if (circulatorRouteList == '' && yellowLineFlag == true) {
						circulatorRouteList = circulatorRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="yellow"><p>no prediction available</p><span class="ui-li-count"><span>yellow</span></span></a></li>';
					}
*/
				/*
} else {
					
					// if there are no predictions at all, just do the stops
					$.each(potentialCirculatorRouteList, function(i4, object4) {
						// check for the routes with a lowercase c or v in their name, they are variation routes and should be ignored
						//if (/([cv])/.exec(potentialRouteList[i4]) == null) {			
							circulatorRouteList = circulatorRouteList + '<li data-theme="d"><a data-transition="slide" class="route-detail-btn" id="' + potentialRouteList[i4] + '"><p>no prediction available</p><span class="ui-li-count">' + potentialRouteList[i4] + '</span></a></li>';
						//}
					});
					
					actualCirculatorRouteList.length = 0;
					circulatorPotentialVsActual.length = 0;
	
				}
*/
				
				//console.log('potential routes for stop ' + stopIDfocus + ': ' + potentialRouteList + ' and actual routes: ' + actualRouteList);
				//console.log(stopName);
				var dt = new DateTime();
				circulatorRouteList = '<li data-role="list-divider" class="stopTitle" id="' + stopID + '" data-lat=' + stopLat + '" data-lon=' + stopLon + '"><span class="stopName">' + toTitleCase(stopName) + '</span></li>' + circulatorRouteList + '<div class="updated">Updated ' + dt.formats.busTrackDateTime.b + ' - Pull to refresh</div>';
				//console.log(routeList);
				
	        }

	
		});
		
		//console.log('add new pins');
		// show the new pins, but only if this is a real stop get, and not a favorite button or route annotation being clicked
		//if (favoriteBtnClickedFlag != true) {
			//console.log(newCirculatorPins);
			window.plugins.mapKit.addMapPins(newCirculatorPins);
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
	
	if (device.platform == "iOS") {
		mapOptions = {
	        buttonCallback: "cbMapCallback",
	        height: mapHeight, // changed for android, does this work on ios?
	        diameter: 400,
	        offsetTop: mapOffsetTop, // changed for android, does this work on ios?
	        lat: currentLat,
	        lon: currentLong
	    };
	} else {
		mapOptions = {
	        buttonCallback: "cbMapCallback",
	        height: mapHeight, // changed for android, does this work on ios?
	        diameter: 300,
	        offsetTop: mapOffsetTop, // changed for android, does this work on ios?
	        lat: currentLat,
	        lon: currentLong
	    };
	    
	    
	}
	
    
    
    window.plugins.mapKit.setMapData(mapOptions);
    

    
    //console.log('time to calculate radius!');
    
    // when we first call this, we can use the current location variables directly
    getStops(currentLat, currentLong, mapOptions.diameter);
    getRailStops(currentLat, currentLong, mapOptions.diameter);
	getCirculatorStops();
 
};





// if we can't get current position, callback receives a PositionError object
function onCurrentLocationError(error) {
	//console.log('currloc error');
	if (device.platform == "iOS") {
		navigator.notification.alert(
		    'Please allow BusTrackDC to access your current location by going to Settings > Privacy > Location Services and turning on location services for BusTrackDC.',  // message
		    console.log('currlocerror'),         // callback, this needs to be something, otherwise this doesn't work.
		    "Couldn't find current location",            // title
		    'OK'                  // buttonName
		);
	} else {
		navigator.notification.alert(
		    'Please allow BusTrackDC to access your current location via GPS by going to Location Services and turning on Google location services, GPS satellites, Use sensor aiding, and Location and Google search.',  // message
		    console.log('currlocerror'),         // callback, this needs to be something, otherwise this doesn't work.
		    "Couldn't find current location",            // title
		    'OK'                  // buttonName
		);
	}
    
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
			return (obj.id == favorite || 'Metro Bus Stop #' + obj.id == favorite || 'Metro Rail Station #' + obj.id == favorite);
		});
		
		//console.log(favorites);
		if (favoriteMatches.length) {
			//console.log('match! remove');
			$( "#favorite" ).buttonMarkup({theme: 'd'});
			
			favorites = favorites.filter(function(el){ console.log('favorite= ' + favorite); console.log('el.id= ' + el.id); return (el.id != favorite && 'Metro Bus Stop #' + el.id != favorite && 'Metro Rail Station #' + el.id != favorite); });
			
			window.localStorage.setItem("favorites", JSON.stringify(favorites));
			//favoritesStorage = JSON.stringify(favorites);
			
			//console.log(favorites);
		} else {
			//console.log('no match! add');
			$( "#favorite" ).buttonMarkup({theme: 'e'});
			
			var $stopTitle = $('#infowindow .stopTitle');
			
			favorites.push({
				id: favorite,
				name: $('#infowindow .stopName').html(),
				lat: $stopTitle.data('lat'),
				lon: $stopTitle.data('lon')
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
		
		var $stopTitle = $('#infowindow .stopTitle');
		
		favorites.push({
			id: favorite,
			name: $('#infowindow .stopName').html(),
			lat: $stopTitle.data('lat'),
			lon: $stopTitle.data('lon')
		});
		
		window.localStorage.setItem("favorites", JSON.stringify(favorites));
		//favoritesStorage = JSON.stringify(favorites);
		
		
	}

};


//our initial show map function
function showMap() {

	mapVisible = true;
	
    window.plugins.mapKit.showMap();
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

	if (device.platform == "iOS") {
		window.GA.trackerWithTrackingId("UA-39138450-1");
		window.GA.trackView("/index");
	} else {
		$.mobile.defaultPageTransition="none";
		 window.plugins.analytics.start(
            function(){
                window.plugins.analytics.trackPageView(
                	"/index",
					function(){
                    	//console.log("Track: success");
					},
	                function(){
	                    //console.log("Track: failure");
	                }
				);
            },
            
            function(){
                //console.log("Start: failure");
            }
		);
		
		navigator.splashscreen.hide();
	}
	
	deviceReadyFlag = true;
	//console.log('deviceready');
	
	// add an on resume event to call an autorefresh if the app becomes active again...
	document.addEventListener("resume", onResume, false);
    
    showMap();
    
    mapHeight = $('html').height() - $('.header').height() - $('.footer').height(); // changed for android, does this work on ios?
    //console.log(mapHeight);
    mapOffsetTop = $('.header').height(); // changed for android, does this work on ios?
    
    //if (device.platform != "iOS") {
		mapOptions = {
	        //buttonCallback: "cbMapCallback",
	        height: mapHeight,
	        diameter: 400,
	        offsetTop: mapOffsetTop, // changed for android, does this work on ios?
	        lat: 38.8897,
	        lon: -77.0089
	    };
	    
	    window.plugins.mapKit.setMapData(mapOptions);
	    
	//} 
	
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
	
	//needed to prevent weird android flickering
	if (device.platform != "iOS") {
		pageFlash = false;
		$.mobile.changePage( "#infowindow", { transition: "none"} );
		$.mobile.changePage( "#gps_map", { transition: "none"} );
	}
	
	pageFlash = true;

    
    // get current position (which also shows nearby stops)
	//navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError, { maximumAge: 60000, timeout: 10000, enableHighAccuracy: true });
	
	// this needs to be in deviceReady so as not to make weird this website needs access to your location notices in the app...
	$(document).on('pageinit', '#gps_map', function() {
		
		if (deviceReadyFlag = true) {
			navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError, { maximumAge: 60000, timeout: 10000, enableHighAccuracy: true });
		}
		
	});
	
	

    
}

jQuery(document).ready(function($) {
	document.addEventListener("deviceready", onDeviceReady);
});

/*
$.ajaxPrefilter(function (options){options.global = true;});
$(document).ajaxStart(function(){ console.log('ajax start'); $.mobile.loading( 'show' ); });
$(document).ajaxStop(function(){ console.log('ajax stop'); $.mobile.loading( 'hide' ); });
*/

/*

$(document).on('pageinit', '#gps_map', function() {

	ajaxCount = 0;
	ajaxCirculatorCount = 0;
	circulatorStopsArray = [];
	circulatorStopsArray.length = 0;
	
	favoriteBtnClickedFlag = false;
	
	//console.log('init!');

	mapVisible = true;
	document.addEventListener("deviceready", onDeviceReady);
	
	routeMapView = false;
	
	// make the refresh button work
    $('.refresh_location').click(function() {
*/
    	
    	/*
if ($('#favorites_menu_content').css('display') != 'none') {
			//console.log('true!');
			$( "#favorites_menu_btn" ).buttonMarkup({theme: 'd'});
			
			$('#favorites_menu_content').hide();
			$('#favorites_menu_header').hide();
		}
*/
    	
/*
    	// when the refresh button is pressed, restore the map view -- hopefully this can be removed later
    	if (mapVisible == false) {
			showMap();
		}
    	navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError, { maximumAge: 60000, timeout: 10000, enableHighAccuracy: true });
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
*/

/*
$(document).on('pageinit', '#favorite_menu_page', function() {
	editFlag = false;
	
	$('#edit').click(function() {
	//console.log(editFlag);
		
		if (editFlag) {
			//console.log('true');
			// undo the UI stuff
			$( "#edit" ).buttonMarkup({theme: 'd'});
			$('#edit .ui-btn-text').html('Edit');
			$('.ui-li-has-arrow .ui-btn-inner a.ui-link-inherit').css('padding-right','40px');
			$('.ui-li-static.ui-li-has-arrow').css('padding-right','40px');
			$('.stopTitle, .favoriteMenuStopTitle').css('min-width','inherit');
			
			// undo the sorting
			var $favorites_menu = $("#favorites_menu");
			$favorites_menu.sortable("destroy").enableSelection().unbind( "sortstop");
			
			// change the ui
			$('#favorites_menu .ui-icon-arrow-r').fadeIn('fast');
			$('#favorites_menu .drag-handle').fadeOut('fast');
			$('#favorites_menu .delete-handle').fadeOut('fast');
			
			$favorites_menu.listview('refresh');
			
			// deal with the new favorites list for the new order
			if (window.localStorage.getItem("favorites")) {
				
				var favorites = [];
				
				$.each($('#favorites_menu li'), function() {
					var id = $(this).data('id');
*/
					/*
					console.log(id);
					console.log('#favorites_menu #' + id + ' h1');
					console.log($('#favorites_menu #' + id + ' h1').html());
					console.log('#favorites_menu #' + id + ' .favorite-stop-detail-btn');
					console.log($('#favorites_menu #' + id + ' .favorite-stop-detail-btn').data('lat'));
					console.log($('#favorites_menu #' + id + ' .favorite-stop-detail-btn').data('lon'));
					*/
					
/*
					var $favorites_menu_detail_btn = $('#favorites_menu li[data-id="' + id + '"] .favorite-stop-detail-btn');
					
					favorites.push({
						id: id,
						name: $('#favorites_menu li[data-id="' + id + '"] h1').html(),
						lat: $favorites_menu_detail_btn.data('lat'),
						lon: $favorites_menu_detail_btn.data('lon')
					});
				});
				
				//console.log(favorites);
					
				window.localStorage.setItem("favorites", JSON.stringify(favorites));
					
			}
			
			// rebind the click handler
			$('.favorite-stop-detail-btn').click(function() {
*/
				
				
				/*
	$.mobile.loading( 'show', {
					text: 'Loading',
					textVisible: false,
					theme: 'a',
					html: ""
				});
	*/
		
/*
				// store a variable on this stop's name in case we need to retrieve it later...
				notInRangeStopID = $(this).data('stopid');
				notInRangeStopName = $(this).data('stopname');
				notInRangeStopLat = $(this).data('lat');
				notInRangeStopLon = $(this).data('lon');
				
				//console.log(notInRangeStopID + ' ' + notInRangeStopName  + ' ' + notInRangeStopLat  + ' ' + notInRangeStopLon);
		
				// if we click a favorite, get the stop and populate the stops array really quick, so we can view all the data about the predictions
				favoriteBtnClickedFlag = true;
				if ((/Metro Bus Stop #/).test(notInRangeStopID)) {
					getStops(notInRangeStopLat, notInRangeStopLon, '50');
				} else if ((/Metro Rail Station #/).test(notInRangeStopID)) {
					getRailStops(notInRangeStopLat, notInRangeStopLon, '500');
				} else if ((/Circulator Stop #/).test(notInRangeStopID)) {
					//console.log('marker circ stops from favoritebuton click');
					markerCirculatorStops(notInRangeStopLat,notInRangeStopLon,.01,.01);
				} else if (isNaN(notInRangeStopID)) {
					notInRangeStopID = 'Metro Rail Station #' + notInRangeStopID;
					getRailStops(notInRangeStopLat, notInRangeStopLon, '500');
				} else {
					notInRangeStopID = 'Metro Bus Stop #' + notInRangeStopID;
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
			
			var $favorites_menu = $( "#favorites_menu" );
			
			//drag and drop sorting, adapted from http://forresst.github.com/2012/06/22/Make-a-list-jQuery-Mobile-sortable-by-drag-and-drop/
			$favorites_menu.sortable({
				 handle: ".drag-handle",
				 axis: "y",
				 scrollSensitivity: 500,
				 scroll: true
			})
			.disableSelection()
			.bind( "sortstop", function(event, ui) {
		    	$favorites_menu.listview('refresh');
		    });
		    
		    // take off the click handler while in edit mode to allow clicking on the delete button
		    $('.favorite-stop-detail-btn').off('click');
		    
		    $('.delete-handle').click(function() {
		    	//console.log($(this).parent().data('stopid'));
		    	var favorites = JSON.parse(window.localStorage.getItem("favorites"));
		    	
		    	//console.log(favorites);
		    	
		    	deletedElementID = $(this).parent().data('stopid');
		    	
		    	//console.log(deletedElementID);
		    	
		    	favorites = favorites.filter(function(el){ return el.id != deletedElementID });
		    	
		    	$('#favorites_menu li[data-id="' + deletedElementID + '"]').remove();
		    	
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
*/


/*
//page show functions
$(document).on('pagebeforeshow', '#gps_map', function() {

	//console.log(window.history);
	if (mapVisible == false) {
		showMap();
	}
*/

	/*
if (typeof(currentLatitude) === 'undefined') {
		//console.log('true');
	} else {
		//console.log(currentLatitude);
		//console.log(currentLongitude);
		//console.log(pins.length);
		//if (pins.length == 0) {
			getStops(currentLatitude, currentLongitude, '800');
			getRailStops(currentLatitude, currentLongitude, '800');
			
			if (ajaxCirculatorCount == circulatorStopsArray.length) {
				//console.log('marker time!');
				//console.log('marker circ stops from pagebeforeshow');
				markerCirculatorStops(currentLatitude,currentLongitude, .01 , .01);
			}
		    	
		//}
		
	}
*/
	
/*
	// put this here for android, does that work on iOS?
	geo = window.geo || {};
	 // timeout needed to prevent UI lock -- the onMapMove function is called a lot during initialization, so we want to bypass that
    window.setTimeout(function() {
*/
    
	    
	    
	    // save some data on the previous location so we can see how much we move...
	    /*
geo.beforeMapMove = function(currentLat,currentLon,latitudeDelta,longitudeDelta) {
			previousLat = currentLat;
			previousLon = currentLon;
	    }
*/
	    
/*
	    // whenever the map moves, get the new location and radius and show nearby stops
		geo.onMapMove = function(currentLat,currentLon,latitudeDelta,longitudeDelta) {
		//console.log('move');
			
			currentLatitude = currentLat;
			currentLongitude = currentLon;
			
			// if the map doesn't move much, no need to redraw the pins... REMOVED FOR ANDROID, IS THAT OK ON IOS?
			//if (((Math.abs(previousLat - currentLat)*32) > latitudeDelta) || ((Math.abs(previousLon - currentLon)*32) > longitudeDelta)) {
				if ($('.refresh_location').length) {
					//console.log('TRUE! ' + previousLat + ' - ' + currentLat + ' = ' + (Math.abs(previousLat - currentLat)*2) + ' with latitudeDelta = ' + latitudeDelta + ' and ' + previousLon + ' - ' + currentLon + ' = ' + (Math.abs(previousLon - currentLon)*2) + ' with longitudeDelta = ' + longitudeDelta);
					
					//console.log('TRUE');
					
					calculateRadius(currentLat, currentLon, latitudeDelta, longitudeDelta, function(viewportLat, viewportLon, radius) {
						// prevent huge radii in the viewport from crashing the app
						//console.log(radius);
						if (radius < 2000) {
							getStops(viewportLat, viewportLon, radius);
							getRailStops(viewportLat, viewportLon, radius);
							
							if (ajaxCirculatorCount == circulatorStopsArray.length) {
								if (window.localStorage.getItem("circulatorStopsDatestamp") && window.localStorage.getItem("circulatorStops")) {
									//console.log('marker circ stops from geo.onmapmove');
									markerCirculatorStops(circulatorLat,circulatorLon,circulatorLatDelta,circulatorLonDelta);
								}
							}
		    	
						}
						
					});
				} else {
					//console.log('FALSE');
				}
			//} else {
				//console.log('FALSE! ' + previousLat + ' - ' + currentLat + ' = ' + (Math.abs(previousLat - currentLat)*2) + ' with latitudeDelta = ' + latitudeDelta + ' and ' + previousLon + ' - ' + currentLon + ' = ' + (Math.abs(previousLon - currentLon)*2) + ' with longitudeDelta = ' + longitudeDelta);
			//}
			
		};
		
		// use underscore.js to reate limit and debounce this function that gets called a ton of times when a user scrolls
		delay = 500;
		geo.onMapMove = _.debounce(geo.onMapMove, delay); // this is too long, set it long on startup but thereafter set it short
	}, 3000);
*/
	
	/*
if (deviceReadyFlag = true) {
		navigator.geolocation.getCurrentPosition(onCurrentLocationSuccess, onCurrentLocationError);
	}
*/
	
/* }); */



/*
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
			if ((/Metro Bus Stop #/).test(object.id) || (/Metro Rail Station #/).test(object.id) || (/Circulator Stop #/).test(object.id)) {
				favoritesListHTML = favoritesListHTML + '<li class="needsclick" data-id="' + object.id + '"><a data-transition="slide" class="favorite-stop-detail-btn" data-stopid="' + object.id + '" data-stopname="' + object.name + '" data-lat="' + object.lat + '" data-lon="' + object.lon + '"><h1 class="favoriteMenuStopTitle">' + object.name +'</h1><p>'+ object.id + '</p><p class="delete-handle">Delete</p><p class="drag-handle">Sort</p></a></li>';	
			} else if (isNaN(object.id)) { // this is to make favorites backwards compatible...
				favoritesListHTML = favoritesListHTML + '<li class="needsclick" data-id="' + object.id + '"><a data-transition="slide" class="favorite-stop-detail-btn" data-stopid="' + object.id + '" data-stopname="' + object.name + '" data-lat="' + object.lat + '" data-lon="' + object.lon + '"><h1 class="favoriteMenuStopTitle">' + object.name +'</h1><p>Metro Rail Station #'+ object.id + '</p><p class="delete-handle">Delete</p><p class="drag-handle">Sort</p></a></li>';
			} else {
				favoritesListHTML = favoritesListHTML + '<li class="needsclick" data-id="' + object.id + '"><a data-transition="slide" class="favorite-stop-detail-btn" data-stopid="' + object.id + '" data-stopname="' + object.name + '" data-lat="' + object.lat + '" data-lon="' + object.lon + '"><h1 class="favoriteMenuStopTitle">' + object.name +'</h1><p>Metro Bus Stop #'+ object.id + '</p><p class="delete-handle">Delete</p><p class="drag-handle">Sort</p></a></li>';
			}
		});
		
		
		
		//console.log(favoritesListHTML);
		$('#favorites_menu').html(favoritesListHTML).listview('refresh');
		
		$('.favorite-stop-detail-btn').click(function() {
*/
			//console.log($(this).data('stopid'));
			
			/*
$.mobile.loading( 'show', {
				text: 'Loading',
				textVisible: false,
				theme: 'a',
				html: ""
			});
*/
	
/*
			// store a variable on this stop's name in case we need to retrieve it later...
			notInRangeStopID = $(this).data('stopid'); // this will need to be edited to figure out if the stop is rail...
			notInRangeStopName = $(this).data('stopname');
			notInRangeStopLat = $(this).data('lat');
			notInRangeStopLon = $(this).data('lon');
	
			// if we click a favorite, get the stop and populate the stops array really quick, so we can view all the data about the predictions
			favoriteBtnClickedFlag = true;
			if ((/Metro Bus Stop #/).test(notInRangeStopID)) {
				getStops(notInRangeStopLat, notInRangeStopLon, '50');
			} else if ((/Metro Rail Station #/).test(notInRangeStopID)) {
				getRailStops(notInRangeStopLat, notInRangeStopLon, '500');
			} else if ((/Circulator Stop #/).test(notInRangeStopID)) {
				//console.log('marker circ stops from favorite button');
				markerCirculatorStops(notInRangeStopLat,notInRangeStopLon,.01,.01);
			} else if (isNaN(notInRangeStopID)) {
				notInRangeStopID = 'Metro Rail Station #' + notInRangeStopID;
				getRailStops(notInRangeStopLat, notInRangeStopLon, '500');
			} else {
				notInRangeStopID = 'Metro Bus Stop #' + notInRangeStopID;
				getStops(notInRangeStopLat, notInRangeStopLon, '50');
			}
			

		});
		
	} else {
		//console.log('nothing');
		$('#favorites_menu').html('<h2 class="center">You haven\'t added any<br/>favorite stops yet!</h2><h2 class="center">Click the star icon<br/>when viewing a stop to<br/>add it as a favorite.</h2>').listview('refresh');
	}
	
	

});
*/

/*
$(document).on('pagebeforeshow', '#infowindow', function() {
	
	//console.log(window.history);
	
	//only do this after the page flash we have to do to avoid android flickering
	if (pageFlash) {
		// deal with favorite button UI
		if (window.localStorage.getItem("favorites")) {
		//if (favoritesStorage) {
			//console.log('true');
			
			var favorites = JSON.parse(window.localStorage.getItem("favorites"));
			//favorites = JSON.parse(favoritesStorage);
			
			var favoriteMatches = jQuery.grep(favorites, function(obj) {
				//console.log(data.Stops[i].StopID + ' == ' + obj.subTitle + '?');
				if (stopID) {
					return (obj.id == stopID || 'Metro Bus Stop #' + obj.id == stopID || 'Metro Rail Station #' + obj.id == stopID || 'Circulator Stop #' + obj.id == stopID);
				} else {
					return (obj.id == notInRangeStopID || 'Metro Bus Stop #' + obj.id == notInRangeStopID || 'Metro Rail Station #' + obj.id == notInRangeStopID);
				}
				
			});
			
			//console.log(favoriteMatches);
			if (favoriteMatches.length) {		
				$( "#favorite" ).buttonMarkup({theme: 'e'});
			} else {
				$( "#favorite" ).buttonMarkup({theme: 'd'});
			}	
		}	
	}
*/
	
	 // hide the map when we show the jQuery stuff, hopefully this can be eliminated in the future...
    /*
$('#infowindow-routes').listview('refresh');
    $("#infowindow-content").iscrollview("refresh");
    $('#infowindow-content').css('height', $('#infowindow').css('min-height'));
*/
    
    
/*
    
    if (mapVisible == true) {
		hideMap();
	}
	
	
	
});
*/

//$(document).on('pageshow', '#infowindow', function() {

	
	 // hide the map when we show the jQuery stuff, hopefully this can be eliminated in the future...
    /*
$('#infowindow-routes').listview('refresh');
    $("#infowindow-content").iscrollview("refresh");
    $('#infowindow-content').css('height', $('#infowindow').css('min-height'));
*/

	
//});


/*
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
	
	if (routeClicked == 'RD' || routeClicked == 'BL' || routeClicked == 'OR' || routeClicked == 'YL' || routeClicked == 'GR') {
		getRailStopsForRoute(routeClicked);
	} else if (routeClicked == 'yellow' || routeClicked == 'gtownpm' || routeClicked == 'green' || routeClicked == 'blue' || routeClicked == 'rosslyn' || routeClicked == 'potomac') {
		getCirculatorStopsForRoute(routeClicked);
	} else {
		getStopsForRoute(routeClicked);
	}
	
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
	if (typeof(getStopsForRouteJSON) != 'undefined') {
		getStopsForRouteJSON.abort();
	}
	
	if (typeof(getRailStopsForRouteJSON) != 'undefined') {
		getRailStopsForRouteJSON.abort();
	}
	
	if (typeof(getCirculatorStopsForRouteJSON) != 'undefined') {
		getCirculatorStopsForRouteJSON.abort();
	}
	
	window.plugins.mapKit.clearMapPins();
	
});

$(document).on('pagebeforehide', '#infowindow', function() {
	if (typeof(annotationTapJSON) != "undefined") {
		annotationTapJSON.abort();
	}
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
*/


/***********************************************************************************************/