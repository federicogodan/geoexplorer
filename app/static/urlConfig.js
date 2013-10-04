{
    "geoStoreBase":"http://localhost:8080/geostore/rest/", 
    "xmlJsonTranslateService": "http://localhost:8080/xmlJsonTranslate/",   
    "proxy": "/http_proxy/proxy?url=",	
    "gsSources":[],
	
    "scaleOverlayUnits":{
        "topOutUnits":"nmi",    
        "topInUnits":"nmi",    
        "bottomInUnits":"m",    
        "bottomOutUnits":"km"
    },

    "spm": {
        "wpsURL": "http://localhost:8080/geoserver/wps",
        "userId":"system",
        "outputUrl":"http://localhost:8080/geoserver/ows",
        "srcPath": "the_path",
        "itemStatus": "CREATED",
        "itemStatusMessage" : "Created by GUI",
        "wsName" : "spm",
        "styleName" : "spm"
    },
    
    "rasterAlgebra": {
        "wpsURL": "http://localhost:8080/geoserver/wps",
        "wsName" : "lyratt",
        "outputUrl":"http://localhost:8080/geoserver/ows",
        "storeName" : "nurcdb"
    },
    
    "customTools":[
		{
			"ptype":"gxp_print",
			"customParams":{
				"outputFilename":"ida-report"
			},
			"printService":"http://localhost:8080/geoserver/pdf/",
			"legendPanelId":"legendPanel",
			"actionTarget":{
				"target":"paneltbar",
				"index":4
			}
	    },{
			"ptype":"gxp_printsnapshot",
			"customParams":{
				"outputFilename":"mapstore-print"
			},
			"actionTarget":{
				"target":"paneltbar",
				"index":5
			}
	    },{
			"ptype": "gxp_idaspm",
			"wfsGrid": "wfsGridPanel",
			"svpUploader": "svpuploader",
			"spmListUploader": "spmlistuploader",
			"toggleGroup": "toolGroup",
			"wpsManager": "wpsSPM",
			"idaAttribute" : "idaLayerAttribute",
			"outputTarget": "idacontrol",
			"maxRangeMin": 0,
			"maxRangeMax": 2000,
			"tlModelStore": [
				"IsoVelocity",
				"Bellhop",
				"RAM"
			],
			"bottomTypeStore": [
				"Silt",
				"Gravel",
				"Limestone",
				"Basalt"
			],
			"qualityStore": [
				"low",
				"medium",
				"high"
			]
		}, {
                "ptype": "gxp_uploader",
				"id": "svpuploader",
                "loadMsg": "Load Sound Velocity Profile ...",
                "uploadServiceURL": "http://localhost:8080/xmlJsonTranslate/FileUploader?uplodDir=C:/Program Files (x86)/CMRE-IDA 1.0/webapps/xmlJsonTranslate/temp",
                "inputFiles": [{ "name": "svpFile", "emptyText": "Sound Velocity Profile File", "fieldLabel": "SVP File"}]
			}, {
                "ptype": "gxp_uploader",
				"id": "spmlistuploader",
                "loadMsg": "Load SPM List...",
                "uploadServiceURL": "http://localhost:8080/xmlJsonTranslate/FileUploader?type=inline",
                "inputFiles": [{ "name": "spnListFile", "emptyText": "SPM List XML File", "fieldLabel": "SPM List File", "allowBlank": true}]
			}, {
                "ptype": "gxp_saveDefaultContext",
                "actionTarget": {"target": "paneltbar", "index": 40},
				"needsAuthorization": true
            }, {
                "ptype": "gxp_idaattribute",
                "id": "idaLayerAttribute",
                "wpsManager": "wpsRasterAlgebra",
                "wfsGrid" : "wfsAlgebraGridPanel",
                "toggleGroup": "toolGroup",
                "colorStyles": [
                    "Red",
                    "Blue",
                    "Green",
                    "Black"					
                ],
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
                "url": "http://localhost:8080/geoserver/wps",
		        "geostoreUrl": "http://localhost:8080/geostore/rest",
		        "geostoreUser": "admin",
		        "geostorePassword": "admin",
		        "geostoreProxy": "/http_proxy/proxy?url="
            },{
                "ptype": "gxp_wpsmanager",
                "id": "wpsRasterAlgebra",
                "url": "http://localhost:8080/geoserver/wps",
		        "geostoreUrl": "http://localhost:8080/geostore/rest",
		        "geostoreUser": "admin",
		        "geostorePassword": "admin",
		        "geostoreProxy": "/http_proxy/proxy?url="
            },{
                "ptype": "gxp_wfsgrid",
                "addLayerTool": "addlayerAttribute",
                "title": "Layer Attribute",
		        "id": "wfsAlgebraGridPanel",
                "wfsURL": "http://localhost:8080/geoserver/wfs",
                "featureType": "lyratt:IDARasterAlgebraProcess",
                "featureNS": "", 
                "pageSize": 10,
                "srsName": "EPSG:4326", 
                "version": "1.1.0", 
                "outputTarget": "idalaylist",
                "columns" : [{
                                "header": "Status", 
                                "dataIndex": "itemStatus",
                                "sortable": true
                            },{
                                "header": "Attribute Name", 
                                "dataIndex": "attributeName",
                                "sortable": true
                            },{
                                "header": "Start Date", 
                                "dataIndex": "runBegin",
                                "sortable": true
                            },{
                                "header": "End Date", 
                                "dataIndex": "runEnd",
                                "sortable": true
                            }
                ],
                "actionColumns" : [ 
                    {
                     "type": "addLayer",
                     "layerNameAttribute" : "layerName",
                     "layerTitleAttribute" : "name",
                     "wsNameAttribute" : "wsName",
                     "wmsURLAttribute" : "outputUrl",
                     "showEqualFilter":{
                         "attribute": "itemStatus",
                         "value": "COMPLETED"    
                     }
                    },
                    {
                     "type": "details",
                     "layerTitleAttribute" : "attributeName"
                    },
                    {
                     "type": "delete",
                     "layerNameAttribute" : "layerName",
                     "idAttribute" : "fid",
                     "wsNameAttribute" : "wsName"
                    }
                ]
                
            }, {
                "ptype": "gxp_wfsgrid",
                "addLayerTool": "addlayer",
                "title": "SPM",
		        "id": "wfsGridPanel",
                "wfsURL": "http://localhost:8080/geoserver/wfs",
                "featureType": "spm:IDASoundPropModel",
                "featureNS": "", 
                "pageSize": 10,
                "srsName": "EPSG:4326", 
                "version": "1.1.0", 
                "displaySource": true,
                "sourcePrefix": "Sources of ",
                "wmsURL": "http://localhost:8080/geoserver/ows",
                "outputTarget": "idalaylist",
                "columns" : [{
                                "header": "Model Status", 
                                "dataIndex": "itemStatus",
                                "sortable": true
                            },{
                                "header": "Model Name", 
                                "dataIndex": "modelName",
                                "sortable": true
                            },{
                                "header": "Model Run Date", 
                                "dataIndex": "runBegin",
                                "sortable": true
                            },{
                                "header": "Model End Date", 
                                "dataIndex": "runEnd",
                                "sortable": true
                            }
                ],
                "actionColumns" : [ 
                    {
                     "type": "addLayer",
                     "layerNameAttribute" : "layerName",
                     "layerTitleAttribute" : "name",
                     "wsNameAttribute" : "wsName",
                     "wmsURLAttribute" : "outputUrl",
                     "showEqualFilter":{
                         "attribute": "itemStatus",
                         "value": "COMPLETED"    
                     }
                    },
                    {
                     "type": "details",
                     "layerTitleAttribute" : "modelName"
                    },
                    {
                     "type": "delete",
                     "layerNameAttribute" : "layerName",
                     "idAttribute" : "fid",
                     "wsNameAttribute" : "wsName"
                    }
                ]
                
            }, {
                "ptype": "gxp_addlayer",
				"useEvents": true,
				"id": "addlayer"
			}, {
                "ptype": "gxp_addlayer",
				"useEvents": true,
				"id": "addlayerAttribute"
			}
	]
}
