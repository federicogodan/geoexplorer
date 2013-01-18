{
   "geoStoreBase":"http://84.33.199.62/geostore-gliders/rest/",
   "proxy":"/http_proxy/proxy?url=",
   "xmlJsonTranslateService": "http://84.33.199.62/xmlJsonTranslate-gliders/",
   "refreshTimeInterval": 10,
   "watermarkUrl": "../theme/app/img/nurc-logo.png",
   "watermarkText": "Powered by GeoSolutions for Nurc",
   "watermarkPosition": "position:absolute;left:5px;bottom:5px",
   "timeVisualizationPosition": "position:relative;left:60px;top:10px;background-color:#0055BB;color:#FFFFFF;font-size: 12px;",
   "maxExtent": [3.29817,40.266369,11.08748,45.93263],
   "bounds": [3.29817,40.266369,11.08748,45.93263],
   "center": [7.97,43.02],
   "zoom": 7,
   "startTime": "2012-09-01T06:00:00.000Z",
   "endTime":   "2012-09-27T08:00:00.000Z",
   "timeUnits": "Minutes",
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
        "creationPropertyName": "creation",		
		"glidersFeatureType": "GlidersTracks",	
		"glidersPrefix": "it.geosolutions",
		"wfsVersion": "1.1.0"
   },

	"backgrounds":[
		{
       	"format": "image/jpeg",
       	"transparent": false,
       	"source": "demo1",
       	"group": "background",
       	"name": "GeoSolutions:ne_shaded",
       	"title": "Nurc Background"
   		}
	],

   "models":[

	{
       "format": "image/png8",
       "group": "Ocean Models",
       "name": "nurc:watvelingv",
       "opacity": 1,
       "selected": false,
       "source": "demo",
       "title": "Watvel Forecast Model INGV",
       "transparent": true,
       "visibility": true,
       "ratio": 1,
       "elevation": 1.472,
       "styles": "watvel_marker_ramp"
   },        
	{
       "format": "image/png8",
       "group": "Ocean Models",
       "name": "nurc:watvelroms",
       "opacity": 1,
       "selected": false,
       "source": "demo",
       "title": "Watvel Forecast Model ROMS",
       "transparent": true,
       "visibility": true,
       "ratio": 1,
       "elevation": 10,
       "styles": "watvel_marker_ramp",
       "style": "watvel_raster"
   }

	],

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
        "demo1": {
            "ptype": "gxp_wmssource",
            "title": "demo1", 
            "version": "1.3.0",
            "url": "http://demo1.geo-solutions.it/geoserver-enterprise/ows",
			"layerBaseParams": {
				"TILED": true,
				"TILESORIGIN": "-180,-90" 
			}
        }
   },
   "layers":[
		{
            "format": "image/png8",
            "transparent": true,
			"visibility": true,
			"displayInLayerSwitcher": true,
            "source": "Gliders",
            "group": "default",
            "name": "it.geosolutions:aoi",
            "title": "Gliders AOI"
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
		   "enableAoi": true
	    }, {
			"actions": ["->"], 
			"actionTarget": "vselector.tbar"
		}, {
			"ptype": "gxp_nurcfeaturemanager",
			"id": "featuremanager",
			"autoActivate": false, 
			"autoLoadFeatures": true,
			"layer": {
				"source": "Gliders",
				"name": "it.geosolutions:aoi"
			}
		}, {
			"ptype": "gxp_nurcfeatureeditor",
			"toggleGroup": "toolGroup",
			"featureInfoBuffer": 15,
			"featureManager": "featuremanager",
			"gliderPropertyName": "glider_name",
			"cruisePropertyName": "cruise_name",
			"excludeFields": ["glider_name", "cruise_name"],
			"actionTarget": "vselector.tbar"
		}, {
			"ptype": "gxp_pilot_notes",
			"layerName": "Pilot notes Layer",
			"id": "notes",
			"outputTarget": "east"
		}, {
			"ptype": "gxp_add_geometry", "toggleGroup": "toolGroup", 
			"actionTarget": [ "notes.tbar" ],
			"layerName": "Pilot notes Layer",
			"srs":  "EPSG:4326",
			"alternativeStyle": true
		}, {
			"ptype": "gxp_feature_selector", "toggleGroup": "toolGroup", 
			"actionTarget": ["notes.tbar"],
			"layerName": "Pilot notes Layer",
			"alternativeStyle": true,
			"srs":  "EPSG:4326",
			"prefix": "notefeature"
		}, 
		{
			"ptype": "gxp_import_kml",
			"toggleGroup": "toolGroup", 
			"actionTarget": {"target": "paneltbar", "index": 13},
			"alternativeStyle": true,
			"srs":  "EPSG:4326",
			"layerName": "Pilot notes Layer"
		}, {
			"ptype": "gxp_export_kml",
			"toggleGroup": "toolGroup", 
			"actionTarget": {"target": "paneltbar", "index":14 },
			"alternativeStyle": true,
			"srs":  "EPSG:4326",
			"layerName": "Pilot notes Layer"
		},	
		{
            "ptype": "gxp_log_files",
            "outputTarget": "logfileTabs"
		}
	]
}