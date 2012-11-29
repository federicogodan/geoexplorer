  {
    "geoStoreBase":"http://localhost:8080/geostore/rest/", 
   
    "proxy": "proxy?url=",
	
    "gsSources":[],
	
    "scaleOverlayUnits":{
        "topOutUnits":"nmi",    
        "topInUnits":"nmi",    
        "bottomInUnits":"m",    
        "bottomOutUnits":"km"
    },
	
    "spm": {
        "wpsURL": "http://84.33.1.254/geoserver/wps",
        "octaveExecutablePath":"/usr/bin/octave-3.2.4",
        "octaveConfigFilePath":"/data/NURC-IDA/matlabcode2/",
        "userId":"afabiani",
        "outputUrl":"http://84.33.1.254/geoserver/ows",
        "srcPath": "the_path",
        "itemStatus": "CREATED",
        "itemStatusMessage" : "Created by GUI",
        "wsName" : "nurc",
        "storeName" : "nurcdb",
        "layerName" : "none",
        "wfsURL": "http://84.33.1.254/geoserver/wfs",
        "wfsFeature": "nurc:IDASoundPropModel"
    },
	
    "geostore": {
        "url": "http://localhost:8080/geostore/rest/", 
        "user": "admin",
        "password": "admin",
        "proxy":"proxy?url="
    }
}