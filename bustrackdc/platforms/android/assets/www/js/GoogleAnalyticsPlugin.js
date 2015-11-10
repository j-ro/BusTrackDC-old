if (!window.GA) {
	var cordovaRef = window.PhoneGap || window.Cordova || window.cordova;
	window.GA = {
		trackerWithTrackingId: function(id) {
			cordovaRef.exec("GoogleAnalyticsPlugin.trackerWithTrackingId",id);
			//console.log("trackerWithTrackingId Initialized");
		},
		trackView: function(pageUri) {
			cordovaRef.exec("GoogleAnalyticsPlugin.trackView",pageUri);
			//console.log("trackView Initialized");
		},
		trackEventWithCategory: function(category,action,label,value) {
			var options = {category:category,
				action:action,
				label:label,
				value:value};
			cordovaRef.exec("GoogleAnalyticsPlugin.trackEventWithCategory",options);
		},
		hitDispatched: function(hitString) {
			//console.log("hitDispatched :: " + hitString);
		},
		trackerDispatchDidComplete: function(count) {
			//console.log("trackerDispatchDidComplete :: " + count);
		}
	}
}
