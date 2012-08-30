{
   "geoStoreBase":"http://localhost/geostore/rest/",
   "proxy":"/proxy?url=",
   "watermark_url":"../theme/app/img/nurc-logo.png",
   "watermark_title":"Powered by NURC",
   "watermark_position": "position:relative;left:5px;bottom:5px",
   "vehicles":["greta", "elettra", "zoe", "laura", "sophie", "natalie", "noa"],
   
   "gsSources":{
        "Gliders": {
            "ptype": "gxp_wmssource",
            "title": "Gliders", 
            "version":"1.1.1",
            "url":"http://84.33.199.62/geoserver-gliders/ows"
        },
        "GEOSIII": {
            "ptype": "gxp_wmssource",
            "title": "GEOSIII", 
            "version":"1.1.1",
            "url":"http://geos3.nurc.nato.int/geoserver/ows"
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
			            "name": "nurc:watvel",
			            "styles": "watervelocityCR",
			            "opacity": 1,
			            "selected": false,
			            "source": "Gliders",
			            "title": "Watervel Forecast",
			            "transparent": true,
			            "visibility": true,
			            "ratio": 1
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
            "ratio": 1,
            "cql_filter": "cruise_name = 'Rep10' "
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
            "visibility": true,
            "ratio": 1,
            "cql_filter": "cruise_name = 'Rep10'  AND type = 'WaterCurrent'"
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
            "cql_filter": "cruise_name = 'Rep10' AND type = 'CurrentTrack'"
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
            "visibility": true,
            "ratio": 1,
            "cql_filter": "cruise_name = 'Rep10' AND type = 'OldTracks'"
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
            "visibility": true,
            "ratio": 1,
            "cql_filter": "cruise_name = 'Rep10' AND type = 'Abort'"
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
            "cql_filter": "cruise_name = 'Rep10' AND type = 'Points'"
        }
       
]
}

