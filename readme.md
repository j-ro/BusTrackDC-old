Version 1.8

An app for iOS and Android to find out when your bus, Circulator, or train is coming to a stop near you, using WMATA and NextBus prediction data. 

Download at http://bustrackdc.com

Built using:

* Cordova/Phonegap
* HTML/CSS/Javascript
* jQuery/jQuery UI
* Topcoat
* Underscore.js
* jQuery UI Touch Punch
* FastClick
* iScroll
* xml2json.js
* hammer.js
* xCode
* Google Maps API

## Building, Forking, Improving

Please feel free to download, fork, or help this app improve.

This app is built using the Cordova CLI. All CLI-produced files are in the bustrackdc folder. Main HTML, javascript, and CSS files are in the /bustrackdc/www folder.

This app uses the following Cordova plugins:

* com.google.google-play-services
* org.apache.cordova.geolocation
* org.apache.cordova.device
* com.phonegap.plugins.mapkit (custom fork at https://github.com/j-ro/MapKit)
* com.danielcwilson.plugins.googleanalytics
* org.apache.cordova.console
* org.apache.cordova.dialogs
* com.ionic.keyboard
* org.apache.cordova.splashscreen

You'll need to add your own WMATA and Google Maps api key to config.js in the /www/js/ directory to compile a working version. (Get a free key at http://developer.wmata.com/ and https://developers.google.com/maps/signup.)

## Bugs and Source

Please direct all bug reports or feature requests to the issue tracker.

Source available at https://github.com/j-ro/BusTrackDC

Version 1.8