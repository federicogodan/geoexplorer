 {
    "geoStoreBase":"http://192.168.24.129:8080/geostore/rest/", 
    "xmlJsonTranslateService": "http://192.168.24.129:8080/xmlJsonTranslate/",
   
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
        "userId":"afabiani",
        "outputUrl":"http://84.33.1.254/geoserver/ows",
        "srcPath": "the_path",
        "itemStatus": "CREATED",
        "itemStatusMessage" : "Created by GUI",
        "wsName" : "nurc",
        "styleName" : "spm"
    },
	
    
    "customTools":[{
                "ptype": "gxp_uploader",
		"id": "svpuploader",
                "loadMsg": "Load Sound Velocity Profile ...",
                "uploadServiceURL": "http://192.168.24.129:8080/xmlJsonTranslate/FileUploader?uplodDir=/home/maro/",
                "inputFiles": [{ "name": "svpFile", "emptyText": "Sound Velocity Profile File", "fieldLabel": "SVP File"}]
	    },{
                "ptype": "gxp_uploader",
		"id": "spmlistuploader",
                "loadMsg": "Load SPM List...",
                "uploadServiceURL": "http://192.168.24.129:8080/xmlJsonTranslate/FileUploader?type=inline",
                "inputFiles": [{ "name": "spnListFile", "emptyText": "SPM List XML File", "fieldLabel": "SPM List File", "allowBlank": true}]
	    },{
                "ptype": "gxp_saveDefaultContext",
                "actionTarget": {"target": "paneltbar", "index": 40},
				"needsAuthorization": true
            }, {
                "ptype": "gxp_idaattribute",
                "outputConfig": {
                    "id": "attributepanel"
                },
		"defaultBuilder": {
		   "allowBlank": true,
		   "allowGroups": true
	        },
                "outputTarget": "idacontrol"
            }, {
                "ptype": "gxp_idammdatabase",
                "outputConfig": {
                    "id": "mmpanel"
                },
                "outputTarget": "idacontrol"
            }, {
                "ptype": "gxp_idahabitat",
                "outputConfig": {
                    "id": "habitatPanel"
                },
                "outputTarget": "idacontrol"
            }, {
                "ptype": "gxp_georeferences",
                "actionTarget": {"target": "paneltbar", "index": 22}
            }, {
                "ptype": "gxp_wpsmanager",
                "id": "wpsSPM",
                "url": "http://84.33.1.254/geoserver/wps",
		"geostoreUrl": "http://192.168.24.129:8080/geostore/rest",
		"geostoreUser": "admin",
		"geostorePassword": "admin",
		"geostoreProxy": "proxy"
            },{
                "ptype": "gxp_wfsgrid",
                "addLayerTool": "addlayer",
                "title": "SPM",
		"id": "wfsGridPanel",
                "wfsURL": "http://84.33.1.254/geoserver/wfs",
                "featureType": "nurc:IDASoundPropModel",
                "featureNS": "", 
                "pageSize": 10,
                "srsName": "EPSG:4326", 
                "version": "1.1.0", 
                "outputTarget": "idalaylist"
            },{
                "ptype": "gxp_addlayer",
		"id": "addlayer"
	    }
	]
}