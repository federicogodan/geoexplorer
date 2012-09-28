{
   "geoStoreBase":"http://localhost/geostore/rest/",
   "proxy":"/proxy?url=",
   "xmlJsonTranslateService": "http://84.33.199.62/xmlJsonTranslate-gliders/",
   "refreshTimeInterval": 10000,
   "watermarkUrl": "../theme/app/img/nurc-logo.png",
   "watermarkTitle": "Powered by NURC",
   "watermarkPosition": "position:relative;left:5px;bottom:5px",
   "maxExtent": [3.29817,40.266369,11.08748,45.93263],
   "bounds": [3.29817,40.266369,11.08748,45.93263],
   "center": [7.97,43.02],
   "zoom": 7,
   "startTime": "2012-09-01T06:00:00.000Z",
   "endTime":   "2012-09-23T08:00:00.000Z",
   "timeStep": 30,
   "timeFrameRate": 10,
   
   "vehicleSelector": {
		"data":[
		    [true, "elettra", "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_elettra.png", false],
            [true, "laura", "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_laura.png", false],
			[true, "greta", "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_greta.png", false],
			[true, "jade", "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_jade.png", false],
			[true, "zoe", "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_zoe.png", false],
			[true, "sophie", "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_sophie.png", false],
			[true, "natalie", "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_natalie.png", false],
			[true, "noa", "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_noa.png", false]
		],
		"refreshIconPath": "../theme/app/img/silk/arrow_refresh.png",  
		"geoserverBaseURL": "http://84.33.199.62/geoserver-gliders/",		
		"gliderPropertyName": "glider_name",	
		"cruisePropertyName": "cruise_name",	
		"glidersFeatureType": "GlidersTracks",	
		"glidersPrefix": "it.geosolutions",
		"wfsVersion": "1.1.0"
   },
   
   "gsSources":{
        "Gliders": {
            "ptype": "gxp_wmssource",
            "title": "Gliders", 
            "version": "1.1.1",
            "url": "http://84.33.199.62/geoserver-gliders/ows",
			"layerBaseParams": {
				"TILED": true,
				"TILESORIGIN": "-180,-90" 
			}
        },
		"demo": {
            "ptype": "gxp_wmssource",
            "title": "demo",
            "version": "1.1.1",
            "url": "http://demo.geo-solutions.it/geoserver-gliders/ows",
			"layerBaseParams": {
				"TILED": true,
				"TILESORIGIN": "-180,-90" 
			}
        },
        "GEOSIII": {
            "ptype": "gxp_wmssource",
            "title": "GEOSIII", 
            "version": "1.1.1",
            "url": "http://geos3.nurc.nato.int/geoserver/ows",
			"layerBaseParams": {
				"TILED": true,
				"TILESORIGIN": "-180,-90" 
			}
        }
   },
   "layers":[
        {
            "format": "image/jpeg",
            "transparent": false,
            "source": "GEOSIII",
            "group": "background",
            "name": "nurcbg",
            "title": "Nurc Background"
        }, 
        {
            "format": "image/png8",
            "group": "Gliders",
            "name": "nurc:watvelingv",
            "opacity": 1,
            "selected": false,
            "source": "demo",
            "title": "Watvel Forecast Model INGV",
            "transparent": true,
            "visibility": true,
            "ratio": 1,
            "elevation": 1.472,
            "styles":"watvel_marker_ramp"
        },        
		{
            "format": "image/png8",
            "group": "Gliders",
            "name": "nurc:watvelroms",
            "opacity": 1,
            "selected": false,
            "source": "demo",
            "title": "Watvel Forecast Model ROMS",
            "transparent": true,
            "visibility": true,
            "ratio": 1,
            "elevation": 10,
            "styles":"watvel_marker_ramp"
        },
        {
            "format": "image/png8",
            "group": "Gliders",
            "name": "it.geosolutions:GlidersPredictedTracks",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "Predicted Track",
            "transparent": true,
            "visibility": false,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12'"
        },
        {
			 "format": "image/png8",
			 "group": "Gliders",
			 "name": "it.geosolutions:GlidersErrorEllipseEnvelopes",
			 "opacity": 1,
			 "selected": false,
			 "source": "Gliders",
			 "title": "Envelope",
			 "transparent": true,
			 "visibility": false,
			 "ratio": 1,
			 "cql_filter": "cruise_name = 'NOMR12'"
        },
        {
			 "format": "image/png8",
			 "group": "Gliders",
			 "name": "it.geosolutions:GlidersErrorEllipses",
			 "opacity": 1,
			 "selected": false,
			 "source": "Gliders",
			 "title": "Error Ellipses",
			 "transparent": true,
			 "visibility": false,
			 "ratio": 1,
			 "cql_filter": "cruise_name = 'NOMR12'"
		 },
         {
            "format": "image/png8",
            "group": "Gliders",
            "name": "it.geosolutions:GlidersErrorEllipseCenters",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "Error Centers",
            "transparent": true,
            "visibility": false,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12'"
        },
        {
            "format": "image/png8",
            "group": "Gliders",
            "name": "it.geosolutions:GlidersPredictedCurrent",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "Current Predicted",
            "transparent": true,
            "visibility": false,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12'"
        },
        
        {
            "format": "image/png",
            "group": "Gliders",
            "name": "it.geosolutions:GlidersNextWpts",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "NextWPT",
            "transparent": true,
            "visibility": true,
			"tiled": false,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12'"
        },
        {
            "format": "image/png8",
            "group": "Gliders",
            "name": "it.geosolutions:GlidersPoints",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "WaterCurrent",
            "transparent": true,
            "visibility": false,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12' AND type = 'WaterCurrent'"
        },
        {
            "format": "image/png8",
            "group": "Gliders",
            "name": "it.geosolutions:GlidersTracks",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "CurrentTrack",
            "transparent": true,
            "visibility": true,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12' AND type = 'CurrentTrack'"
        },
        {
            "format": "image/png8",
            "group": "Gliders",
            "name": "it.geosolutions:GlidersTracks",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "OldTrack",
            "transparent": true,
            "visibility": false,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12' AND type = 'OldTracks'"
        },
        {
            "format": "image/png8",
            "group": "Gliders",
            "name": "it.geosolutions:GlidersPoints",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "Abort",
            "transparent": true,
            "visibility": false,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12' AND type = 'Abort'"
        },
        {
            "format": "image/png8",
            "group": "Gliders",
            "name": "it.geosolutions:GlidersPoints",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "Points",
            "transparent": true,
            "visibility": true,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12' AND type = 'Points'"
        }
    ],
	
	"customTools":[
	    {
		   "ptype": "gxp_vehicle_selector",
		   "outputTarget": "vehicle-selector",
		   "enableAoi": false
	    }, {
			"actions": ["->"], 
			"actionTarget": "vselector.tbar"
		}, {
			"ptype": "gxp_feature_details",
			"id": "notes",
			"outputTarget": "east"
		}, {
			"ptype": "gxp_add_geometry", "toggleGroup": "toolGroup", 
			"actionTarget": ["notes.tbar"],
			"layerName": "Custom feature layer",
			"srs":  "EPSG:4326"
		}, {
			"ptype": "gxp_feature_selector", 
			"toggleGroup": "toolGroup", 
			"actionTarget": ["notes.tbar"],
			"layerName": "Custom feature layer",
			"prefix": "feature",
			"srs":  "EPSG:4326"
		}, {
			"ptype": "gxp_import_kml",
			"actionTarget": {"target": "notes.tbar", "index": 25},
			"layerName": "Custom feature layer",
			"srs":  "EPSG:4326"
		}, {
			"ptype": "gxp_export_kml",
			"actionTarget": {"target": "notes.tbar", "index": 25},
			"layerName": "Custom feature layer",
			"srs":  "EPSG:4326"
		}
	]
}
