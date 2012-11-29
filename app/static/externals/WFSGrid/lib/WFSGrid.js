/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * requires 
 * include 
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WFSGrid
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *    Plugin for displaying vector features in a grid. Requires a
 *    :class:`gxp.plugins.FeatureManager`. Also provides a context menu for
 *    the grid.
 */   
gxp.plugins.WFSGrid = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_featuregrid */
    ptype: "gxp_wfsgrid",
    
    
    /** api: config[featureType]
     *  ``String``
     *  
     */
    featureType: null,
    
    
    /** api: config[wfsURL]
     *  ``String``
     *  
     */
    wfsURL: null,
    
    
    /** api: config[featureNS]
     *  ``String``
     *  
     */
    featureNS: null,
    
    
    /** api: config[srsName]
     *  ``String``
     *  
     */
    srsName: null,
    
    
    
    /** api: config[version]
     *  ``String``
     *  
     */
    version: null,
    
    
    addLayerIconPath: "theme/app/img/silk/add.png",
    
    
    addLayerTool: null,
    
    /** api: config[displayMsgPaging]
     *  ``String``
     * 
     */
    displayMsgPaging: "Displaying topics {0} - {1} of {2}",
    
    
    /** api: config[emptyMsg]
     *  ``String``
     * 
     */
    emptyMsg: "No topics to display",
    
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WFSGrid.superclass.constructor.apply(this, arguments);        
    },
    
    
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
       var addLayer = this.target.tools[this.addLayerTool]; 
       var wfsStore= new GeoExt.data.FeatureStore({ 
                fields: [{
                    name: "name", 
                    type: "string"
                },{
                    name: "itemStatus", 
                    type: "string"
                },{
                    name: "runBegin", 
                    type: "date"
                },{
                    name: "runEnd", 
                    type: "date"
                },{
                    name: "wsName", 
                    type: "string"
                },{
                    name: "layerName", 
                    type: "string"
                },{
                    name: "outputUrl", 
                    type: "string"
                }], 
                proxy: new GeoExt.data.ProtocolProxy({ 
                    protocol: new OpenLayers.Protocol.WFS({ 
                        url: this.wfsURL, 
                        featureType: this.featureType, 
                        readFormat: new OpenLayers.Format.GeoJSON(),
                        featureNS: this.featureNS, 
                        outputFormat: "application/json",
                        srsName: this.srsName,
                        version: this.version
                    }) 
                  /*  protocol: new OpenLayers.Protocol.HTTP({
                        url: "http://localhost:8080/MapComposer/proxy?url="+encodeURIComponent(urlTest),
                        format: new OpenLayers.Format.GeoJSON()
                    })*/
                }), 
                autoLoad: true 
            });
            
        var wfsGridPanel=new Ext.grid.GridPanel({ 
            title: this.title, 
            store: wfsStore, 
            //sm: new GeoExt.grid.FeatureSelectionModel(), 
            //width: 320, 
           
            columns: [{
		xtype: 'actioncolumn',
		sortable : false, 
		width: 30,
		listeners: {
                    scope: this,
		    click: function(column, grd, row, e){
                       // grd.getSelectionModel().selectRow(row);
                       //alert("click");
                    }
	        },
	        items: [{
			icon   : this.addLayerIconPath,  
			tooltip: 'Add Layer to Map',
			scope: this,
			handler: function(gpanel, rowIndex, colIndex) {
                            var store = gpanel.getStore();		
		            var record = store.getAt(rowIndex);
                            
                            addLayer.addLayer(record.get("wsName")+":"+record.get("layerName"),
                            record.get("outputUrl")
                            );
			}}]
	    },{
                header: "Model Status", 
                dataIndex: "itemStatus"
            },{
                header: "Model Name", 
                dataIndex: "name"
            },{
                header: "Model Run Date", 
                dataIndex: "runBegin",
                width: 100
            },{
                header: "Model End Date", 
                dataIndex: "runEnd",
                width: 100
            }],bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: wfsStore,
                displayInfo: true,
                displayMsg: this.displayMsgPaging,
                emptyMsg: this.emptyMsg
            })
        }); 
      
    
        
        config = Ext.apply(wfsGridPanel, config || {});
        
      
        
        var wfsGrid = gxp.plugins.WFSGrid.superclass.addOutput.call(this, config);
        
        Ext.getCmp(this.outputTarget).setActiveTab(wfsGrid);
        
        return wfsGrid;
    }
            
});

Ext.preg(gxp.plugins.WFSGrid.prototype.ptype, gxp.plugins.WFSGrid);
