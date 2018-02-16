function createStubs() {
	function log() {
        var args = [].slice.call(arguments, 0);
        args.unshift("[Launch Navigator]");
        console.log.apply(console, args);
    }
    
    return {
        LaunchNavigator: {
        	discoverSupportedApps: function() {
            	var apps = {
            		GOOGLE_MAPS: "google_maps"
            	};
            	return apps;
			},
			availableApps: function() {
            	var apps = {
            		google_maps: true
            	};
            	return apps;
			},
			navigate: function(){
				var destination = arguments[2];
				var start = arguments[5];
				
				var navigatorURL = "https://www.google.com/maps/dir/?api=1" 
									+ "&origin=" + encodeURI(start)
									+ "&destination=" + encodeURI(destination);
				
				log("navigator URL = " + navigatorURL);
				
				window.open(navigatorURL, "_blank");
				
			}
		}
	};
};
