(function() {

	var cordovaRef = window.PhoneGap || window.Cordova || window.cordova;

	var MapKit = function() {
		this.options = {
			height: window.outerHeight,
			diameter: 1000,
			zoomLevel: 0,
			atBottom: false,
			offsetTop: 0,
			lat: 49.281468,
			lon: -123.104446
		};

		this.mapType = {
            MAP_TYPE_NONE: 0, //No base map tiles.
            MAP_TYPE_NORMAL: 1, //Basic maps.
            MAP_TYPE_SATELLITE: 2, //Satellite maps with no labels.
            MAP_TYPE_TERRAIN: 3, //Terrain maps.
            MAP_TYPE_HYBRID: 4 //Satellite maps with a transparent layer of major streets.
        };

        this.iconColors = {
            HUE_RED: 0.0,
            HUE_ORANGE: 30.0,
            HUE_YELLOW: 60.0,
            HUE_GREEN: 120.0,
            HUE_CYAN: 180.0,
            HUE_AZURE: 210.0,
            HUE_BLUE: 240.0,
            HUE_VIOLET: 270.0,
            HUE_MAGENTA: 300.0,
            HUE_ROSE: 330.0
        };
        
        this.error = function() {
          //console.log('error');
        };
        
        this.success = function() {
          //console.log('success');
        };
        
        this.hideMethod = {
        	hideMethod: ""
        };
	};

	// convert diameter to zoom level
	function getZoomLevel(m){
	    var z=0;
	    var i=20088000;
	    while(i/2>=m && z<19){
	        z++;
	        i=i/2;
	    }
	    return z;
	}
	

	MapKit.prototype = {


		showMap: function(options, success, error) {
			if (options) {
				options.zoomLevel = getZoomLevel(options.diameter);
				if (success) {
					if (error) {
						cordovaRef.exec(success, error, 'MapKit', 'showMap', [options]);
					} else {
						cordovaRef.exec(success, this.error, 'MapKit', 'showMap', [options]);
					}
					
				} else {
					if (error) {
						cordovaRef.exec(this.success, error, 'MapKit', 'showMap', [options]);
					} else {
						cordovaRef.exec(this.success, this.error, 'MapKit', 'showMap', [options]);
					}
				}
			} else {
				if (success) {
					if (error) {
						cordovaRef.exec(success, error, 'MapKit', 'showMap', [this.options]);
					} else {
						cordovaRef.exec(success, this.error, 'MapKit', 'showMap', [this.options]);
					}
					
				} else {
					if (error) {
						cordovaRef.exec(this.success, error, 'MapKit', 'showMap', [this.options]);
					} else {
						cordovaRef.exec(this.success, this.error, 'MapKit', 'showMap', [this.options]);
					}
				}
			}
			
			
		},

		addMapPins: function(pins, success, error) {
			
			// convert subTitle to snippet (overwrites snippet)
			for (var i = 0; i < pins.length; i++) { 
			    pins[i].snippet = pins[i].subTitle;
			    
			    if (pins[i].pinColor == "red") {
				    pins[i].icon = window.plugins.mapKit.iconColors.HUE_RED;
			    } else if (pins[i].pinColor == "purple") {
				    pins[i].icon = window.plugins.mapKit.iconColors.HUE_VIOLET;
			    } else if (pins[i].pinColor == "green") {
				    pins[i].icon = window.plugins.mapKit.iconColors.HUE_GREEN;
			    } else {
			    	var color= pins[i].pinColor; // A nice shade of green.
					var r = parseInt(color.substr(0,2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
					var g = parseInt(color.substr(2,2), 16);
					var b = parseInt(color.substr(4,2), 16);
					
					function rgbToHsl(r, g, b){
					    r /= 255, g /= 255, b /= 255;
					    var max = Math.max(r, g, b), min = Math.min(r, g, b);
					    var h, s, l = (max + min) / 2;
					
					    if(max == min){
					        h = s = 0; // achromatic
					    }else{
					        var d = max - min;
					        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
					        switch(max){
					            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					            case g: h = (b - r) / d + 2; break;
					            case b: h = (r - g) / d + 4; break;
					        }
					        h /= 6;
					    }
					
					    return [h, s, l];
					}
					
					console.log(rgbToHsl(r, g, b)[0] * 360);
				    pins[i].icon = rgbToHsl(r, g, b)[0] * 360;
			    }
			}
			
			if (success) {
				if (error) {
					cordovaRef.exec(success, error, 'MapKit', 'addMapPins', [pins]);
				} else {
					cordovaRef.exec(success, this.error, 'MapKit', 'addMapPins', [pins]);
				}
				
			} else {
				if (error) {
					cordovaRef.exec(this.success, error, 'MapKit', 'addMapPins', [pins]);
				} else {
					cordovaRef.exec(this.success, this.error, 'MapKit', 'addMapPins', [pins]);
				}
			}
		},

		clearMapPins: function(success, error) {
			if (success) {
				if (error) {
					cordovaRef.exec(success, error, 'MapKit', 'clearMapPins', []);
				} else {
					cordovaRef.exec(success, this.error, 'MapKit', 'clearMapPins', []);
				}
				
			} else {
				if (error) {
					cordovaRef.exec(this.success, error, 'MapKit', 'clearMapPins', []);
				} else {
					cordovaRef.exec(this.success, this.error, 'MapKit', 'clearMapPins', []);
				}
			}
		},

		hideMap: function(hideMethod, success, error) {
			if (success) {
				if (error) {
					if (hideMethod) {
						cordovaRef.exec(success, error, 'MapKit', 'hideMap', [hideMethod]);
					} else {
						cordovaRef.exec(success, error, 'MapKit', 'hideMap', [this.hideMethod]);
					}
					
				} else {
					if (hideMethod) {
						cordovaRef.exec(success, this.error, 'MapKit', 'hideMap', [hideMethod]);
					} else {
						cordovaRef.exec(success, this.error, 'MapKit', 'hideMap', [this.hideMethod]);
					}
				}
				
			} else {
				if (error) {
					if (hideMethod) {
						cordovaRef.exec(this.success, error, 'MapKit', 'hideMap', [hideMethod]);
					} else {
						cordovaRef.exec(this.success, error, 'MapKit', 'hideMap', [this.hideMethod]);
					}
				} else {
					if (hideMethod) {
						cordovaRef.exec(this.success, this.error, 'MapKit', 'hideMap', [hideMethod]);
					} else {
						cordovaRef.exec(this.success, this.error, 'MapKit', 'hideMap', [this.hideMethod]);
					}
				}
			}
		},

		changeMapType: function(mapType, success, error) {
			if (success) {
				if (error) {
					cordovaRef.exec(success, error, 'MapKit', 'changeMapType', [mapType ? { "mapType": mapType } :{ "mapType": 0 }]);
				} else {
					cordovaRef.exec(success, this.error, 'MapKit', 'changeMapType', [mapType ? { "mapType": mapType } :{ "mapType": 0 }]);
				}
				
			} else {
				if (error) {
					cordovaRef.exec(this.success, error, 'MapKit', 'changeMapType', [mapType ? { "mapType": mapType } :{ "mapType": 0 }]);
				} else {
					cordovaRef.exec(this.success, this.error, 'MapKit', 'changeMapType', [mapType ? { "mapType": mapType } :{ "mapType": 0 }]);
				}
			}
			
			
		},
		
		setMapData: function(options, success, error) {
			options.zoomLevel = getZoomLevel(options.diameter);
			
			if (success) {
				if (error) {
					cordovaRef.exec(success, error, 'MapKit', 'setMapData', [options]);
				} else {
					cordovaRef.exec(success, this.error, 'MapKit', 'setMapData', [options]);
				}
				
			} else {
				if (error) {
					cordovaRef.exec(this.success, error, 'MapKit', 'setMapData', [options]);
				} else {
					cordovaRef.exec(this.success, this.error, 'MapKit', 'setMapData', [options]);
				}
			}
			
		}

	};

	cordovaRef.addConstructor(function() {
		window.plugins = {};
		window.plugins.mapKit = new MapKit();
	});

})();