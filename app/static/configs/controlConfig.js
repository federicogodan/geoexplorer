{
	"vehicles": [
		{
			"name": "elettra",
			"url": "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_elettra.png"
		},
		{
			"name": "laura",
			"url": "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_laura.png"
		},
		{
			"name": "greta",
			"url": "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_greta.png"
		},
		{
			"name": "jade",
			"url": "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_jade.png"
		},
		{
			"name": "zoe",
			"url": "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_zoe.png"
		},
		{
			"name": "sophie",
			"url": "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_sophie.png"
		},
		{
			"name": "natalie",
			"url": "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_natalie.png"
		},
		{
			"name": "noa",
			"url": "http://84.33.199.62/geoserver-gliders/styles/img/gliders/glider_noa.png"
		}
	],
	
	"models": [
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
	
	"backgrounds": [
		{
			"name":"nurcbg", 
			"description": "Nurc Background"
		}
	],
	
	"sources": {
		"google": {
			"ptype": "gxp_googlesource"
		}
	},
	
	"background": {
		"source": "google",
		"group": "background",
		"name": "TERRAIN",
		"title": "Google Terrain"
	},
	
	
	"imgsBaseUrl": "http://84.33.199.62/xmlJsonTranslate-gliders/temp/",
	"interPageBaseUrl": "http://84.33.199.62/MapStore-gliders/interactive/?mapId=",
	"infoPageBaseUrl": "http://84.33.199.62/MapStore-gliders/informational/?mapId=",
	"proxy": "/http_proxy/proxy?url=",
	"fileUploaderServlet": "http://84.33.199.62/xmlJsonTranslate-gliders/",
	"geostoreBaseUrl":"http://84.33.199.62/geostore/rest/",
	"geoserverBaseUrl":"http://84.33.199.62/geoserver-gliders/",
	"defaultWatermarkUrl":"../theme/app/img/nurc-logo.png",
	"pageSize":20
	
}
