cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.mapkit/www/MapKit.js",
        "id": "com.phonegap.plugins.mapkit.mapkit",
        "clobbers": [
            "plugin.mapKit"
        ]
    },
    {
        "file": "plugins/com.google.google-play-services/www/AdmobPlugin.js",
        "id": "com.google.google-play-services.AdmobAd",
        "clobbers": [
            "window.admobAd"
        ]
    },
    {
        "file": "plugins/com.danielcwilson.plugins.googleanalytics/www/analytics.js",
        "id": "com.danielcwilson.plugins.googleanalytics.UniversalAnalytics",
        "clobbers": [
            "analytics"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device": "0.2.12",
    "org.apache.cordova.geolocation": "0.3.10",
    "com.phonegap.plugins.mapkit": "0.9.3",
    "com.google.google-play-services": "1.0.0",
    "com.danielcwilson.plugins.googleanalytics": "0.6.0",
    "org.apache.cordova.console": "0.2.11",
    "org.apache.cordova.dialogs": "0.2.10"
}
// BOTTOM OF METADATA
});