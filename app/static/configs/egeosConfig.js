{
   "geoStoreBase":"http://84.33.2.25/geostore/rest/",
   "proxy":"/proxy?url=",
   "refreshTimeInterval": 10,
   "timeVisualizationPosition": "position:relative;left:60px;top:10px;background-color:#0055BB;color:#FFFFFF;font-size: 12px;",
   "projection": "EPSG:900913",
   "maxExtent": [
			-50000.00, 6300000.00,
			3000000.00, 3800000.00
		],
   "bounds": [
			-50000.00, 6300000.00,
			3000000.00, 3800000.00
		],
   "units": "m",
   "startTime": "2010-12-24T03:00:00.000Z",
   "endTime":   "2010-12-24T19:00:00.000Z",
   "timeUnits": "Minutes",
   "timeStep": 15,
   "timeFrameRate": 5,

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
	],
   
   "gsSources":{
        "eGeos": {
            "ptype": "gxp_wmssource",
            "title": "Gliders", 
            "version": "1.1.1",
            "url": "http://84.33.2.25/geoserver/mariss/ows",
			"layerBaseParams": {
				"TILED": true,
				"TILESORIGIN": "-180,-90" 
			}
        },
		"google": {
			"ptype": "gxp_googlesource"
		}
   },
   "layers":[
		{
			"source": "eGeos",
			"title": "mosaic",
			"name": "TEM_QL__1P_mosaic",
			"displayInLayerSwitcher": true,
			"tiled": true
		},
		{
			"source": "eGeos",
			"title": "points",
			"name": "tem_sd__1p",
			"displayInLayerSwitcher": true,
			"tiled": true
		},
		{
			"source": "google",
			"title": "Google Roadmap",
			"name": "ROADMAP",
			"group": "background"
		},{
			"source": "google",
			"title": "Google Terrain",
			"name": "TERRAIN",
			"group": "background"
		},{
			"source": "google",
			"title": "Google Hybrid",
			"name": "HYBRID",
			"group": "background"
		}
	],
	"customTools":[
	    
		
	]
}
