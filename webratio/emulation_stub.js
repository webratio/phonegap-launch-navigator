function createStubs() {

    var $ = window.top.jQuery;
    var mapInit = null;
    var google = null;
    var map = null;
    var mapView = null;
    var directionsMapView = null;
    directionsService = null;
    directionsDisplay = null;
    directionsMap = null;
    var markers = [];
    var markersId = [];
    var infoWindows = [];
    var lastBound = null;

    function initOpenMapForDirections(params) {
    
        $('#directions-map-canvas').remove();
    
        wrapBackButton();
    
        var viewMapTemplate = [
                "<section id=\"directions-map-canvas\" style=\"display:none; width:100%; height:100%; position: absolute;\">",
                "</section>" ].join("\n");
    
        var viewMap = $(viewMapTemplate);
        $('#overlay-views').append(viewMap);
        return viewMap;
    }

    function wrapBackButton() {/* Creates fake 'back' button and hides the original one */
        $('#platform-events-fire-back').css("display", "none");
        $('#platform-events-fire-suspend')
                .before(
                        "<button id=\"platform-events-fire-back-map\" class=\"ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only\"><span class=\"ui-button-text\">Back</span></button>");
        $('#platform-events-fire-back-map').css("width", "90px");
    }

	function log() {
        var args = [].slice.call(arguments, 0);
        args.unshift("[Launch Navigator]");
        console.log.apply(console, args);
    }
    
    function initializeMaps(){
	    window.top["gmapinitialize"] = function() {
	        mapInit["mapinitialized"] = true;
	        mapInit["resolve"]();
	        google = window.top.google;
	    };
	
	    mapInit = {
	        mapinitialized: false
	    };

	    mapInit["mappromise"] = new Promise(function(resolve) {
	        mapInit["resolve"] = resolve;
	    });
	    
    	var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + '&callback=gmapinitialize';
        $('body').append(script);
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
				
				if (window.top.google === undefined){
					initializeMaps();
				} else {
					google = window.top.google;
	                if (!directionsMap) {
	                    directionsMapView = initOpenMapForDirections();
	                    directionsService = new google.maps.DirectionsService();
	                    directionsDisplay = new google.maps.DirectionsRenderer();
	                    directionsMap = new google.maps.Map(directionsMapView[0]);
	                    directionsDisplay.setMap(directionsMap);
	                } else {
	                    wrapBackButton();
	                }
	
	                var request = {
	                    origin: start,
	                    destination: destination,
	                    travelMode: google.maps.TravelMode.DRIVING
	                };
	
	                directionsService.route(request, function(response, status) {
	                    if (status == google.maps.DirectionsStatus.OK) {
	                        directionsDisplay.setDirections(response);
	                    }
	                });
	
	                /* User clicks 'back' button */
	                $('#platform-events-fire-back-map').click(function(e) {
	
	                    /* Restores original 'back' button */
	                    $('#platform-events-fire-back-map').remove();
	                    $('#platform-events-fire-back').css("display", "initial");
	
	                    directionsMapView.hide('slide', {
	                        direction: 'left',
	                        duration: 250
	                    });
	                });
	
	                directionsMapView.show('slide', {
	                    direction: 'right',
	                    duration: 250
	                });
				}
			}
		}
	};
};
