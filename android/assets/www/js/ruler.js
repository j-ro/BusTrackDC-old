document.addEventListener("deviceready", onDeviceReady);

function showMap() {


	
    window.plugins.mapKit.showMap();
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

function onDeviceReady() {

	
	mapOptions = {
        //buttonCallback: "cbMapCallback",
        height: 100,
        diameter: 400,
        offsetTop: 20,
        lat: 38.8897,
        lon: -77.0089
    };
    
    showMap();
    
    window.plugins.mapKit.setMapData(mapOptions);

    
}