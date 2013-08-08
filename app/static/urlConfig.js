{
    "geoStoreBase":"http://84.33.2.26/geostore/rest/", 
    "xmlJsonTranslateService": "http://84.33.2.26/xmlJsonTranslate/",   
    "proxy": "proxy?url=",	
    "gsSources":[],
	
    "scaleOverlayUnits":{
        "topOutUnits":"nmi",    
        "topInUnits":"nmi",    
        "bottomInUnits":"m",    
        "bottomOutUnits":"km"
    },

    "spm": {
        "wpsURL": "http://84.33.2.26/geoserver/wps",
        "userId":"system",
        "outputUrl":"http://84.33.2.26/geoserver/ows",
        "srcPath": "the_path",
        "itemStatus": "CREATED",
        "itemStatusMessage" : "Created by GUI",
        "wsName" : "spm",
        "styleName" : "spm"
    },
    
    "rasterAlgebra": {
        "wpsURL": "http://84.33.2.26/geoserver/wps",
        "wsName" : "lyratt",
        "outputUrl":"http://84.33.2.26/geoserver/ows",
        "storeName" : "nurcdb"
    },	
    
    "customTools":[
	    {
			"ptype": "gxp_idaspm",
			"wfsGrid": "wfsGridPanel",
			"svpUploader": "svpuploader",
			"spmListUploader": "spmlistuploader",
			"toggleGroup": "toolGroup",
			"wpsManager": "wpsSPM",
			"idaAttribute" : "idaLayerAttribute",
			"outputTarget": "idacontrol",
			"maxRangeMin": 0,
			"maxRangeMax": 2000
		}, {
			"ptype": "gxp_uploader",
			"id": "svpuploader",
			"loadMsg": "Load Sound Velocity Profile ...",
			"uploadServiceURL": "http://84.33.2.26/xmlJsonTranslate/FileUploader?uplodDir=/opt/tomcat_gui/webapps/xmlJsonTranslate/temp/",
			"inputFiles": [{ "name": "svpFile", "emptyText": "Sound Velocity Profile File", "fieldLabel": "SVP File"}]
		}, {
			"ptype": "gxp_uploader",
			"id": "spmlistuploader",
			"loadMsg": "Load SPM List...",
			"uploadServiceURL": "http://84.33.2.26/xmlJsonTranslate/FileUploader?type=inline",
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
			"url": "http://84.33.2.26/geoserver/wps",
			"geostoreUrl": "http://84.33.2.26/geostore/rest",
			"geostoreUser": "admin",
			"geostorePassword": "admin",
			"geostoreProxy": "/proxy?url="
		},{
			"ptype": "gxp_wpsmanager",
			"id": "wpsRasterAlgebra",
			"url": "http://84.33.2.26/geoserver/wps",
			"geostoreUrl": "http://84.33.2.26/geostore/rest",
			"geostoreUser": "admin",
			"geostorePassword": "admin",
			"geostoreProxy": "/proxy?url="
		},{
			"ptype": "gxp_wfsgrid",
			"addLayerTool": "addlayer",
			"title": "Layer Attribute",
			"id": "wfsAlgebraGridPanel",
			"wfsURL": "http://84.33.2.26/geoserver/wfs",
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
			"wfsURL": "http://84.33.2.26/geoserver/wfs",
			"featureType": "spm:IDASoundPropModel",
			"featureNS": "", 
			"pageSize": 10,
			"srsName": "EPSG:4326", 
			"version": "1.1.0", 
			"displaySource": true,
			"wmsURL": "http://84.33.2.26/geoserver/ows",
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
			"id": "addlayer"
		}		
	]
}
