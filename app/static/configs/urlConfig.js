{
   "geoStoreBase":"http://localhost/geostore/rest/",
   "proxy":"/http_proxy/proxy?url=",
   "watermark_url":"../theme/app/img/nurc-logo.png",
   "watermark_title":"Powered by NURC",
   "watermark_position": "position:relative;left:5px;bottom:5px",
   "zoom": "9",
   "startTime": "2012-09-01T06:00:00.000Z",
   "endTime":   "2012-10-09T06:00:00.000Z",
   
   "gsSources":{
        "Gliders": {
            "ptype": "gxp_wmssource",
            "title": "Gliders", 
            "version":"1.1.1",
            "url":"http://geos3.nurc.nato.int/geoserver-gliders/ows"
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
            "format": "image/png8",
            "group": "natalie",
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
			 "group": "natalie",
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
			 "group": "natalie",
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
            "group": "natalie",
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
            "group": "natalie",
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
            "group": "natalie",
            "name": "it.geosolutions:GlidersNextWpts",
            "opacity": 1,
            "selected": false,
            "source": "Gliders",
            "title": "NextWPT",
            "transparent": true,
            "visibility": true,
            "ratio": 1,
            "cql_filter": "cruise_name = 'NOMR12'"
        },
        {
            "format": "image/png8",
            "group": "natalie",
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
            "group": "natalie",
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
            "group": "natalie",
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
            "group": "natalie",
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
            "group": "natalie",
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
    ]
}

