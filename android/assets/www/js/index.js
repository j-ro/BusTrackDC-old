/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

    },
    showMap: function() {
        
        //var pins = [[49.28115, -123.10450], [49.27503, -123.12138], [49.28286, -123.11891]];

        
        var options = {};
		
        window.plugins.mapKit.showMap(options);
    },
    setMapData: function() {

        //var pins = [[49.28115, -123.10450], [49.27503, -123.12138], [49.28286, -123.11891]];
        
        var options = {
			height: 360,
			diameter: 1500,
			offsetTop: 50,
			lat: 49.28115,
            lon: -123.10450
		};
		
        window.plugins.mapKit.setMapData(options);
    },
    addMapPins: function() {
	    var pins = [
            {
                lat: 49.28115,
                lon: -123.10450,
                title: "A Cool Title",
                subTitle: "dsdf",
                pinColor: "red",
				index: 1
            },
            {
                lat: 49.27503,
                lon: -123.12138,
                title: "A Cool Title, with no Snippet",
                subTitle: "A Really Cool Snippet",
                pinColor: "purple",
				index: 2
            },
            {
                lat: 49.28286,
                lon: -123.11891,
                title: "Loading...",
                subTitle: "A Really Cool Snippet",
                pinColor: "bd91e5",
				index: 3
            }
        ];
        
        window.plugins.mapKit.addMapPins(pins);
    },
    hideMap: function() {
        window.plugins.mapKit.hideMap();
    },
    clearMapPins: function() {

        window.plugins.mapKit.clearMapPins();
    },
    changeMapType: function() {

        window.plugins.mapKit.changeMapType(mapKit.mapType.MAP_TYPE_SATELLITE);
    }
};

function annotationTap(text, latitude, longitude) {
	console.log('text = ' + text);
	console.log('lat = ' + latitude);
	console.log('lon = ' + longitude);
}


function annotationDeselect() {
	console.log('deselect');
}
