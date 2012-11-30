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
    
    
    detailsIconPath: "theme/app/img/silk/information.png",
    
    
    addLayerTool: null,
    
    
    
    // start i18n
    displayMsgPaging: "Displaying topics {0} - {1} of {2}",
    emptyMsg: "No topics to display",
    addLayerTooltip: "Add Layer to Map",
    detailsTooltip: "View Details",
    detailsHeaderName: "Property Name",
    detailsHeaderValue: "Property Value",
    detailsWinTitle: "Details",
    // end i18n
    
    
    
    
    
    id: "wfsGridPanel",
	
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
                id: this.id+"_store",
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
                },{
                    name: "ftUUID", 
                    type: "string"
                },{
                    name: "season", 
                    type: "string"
                },{
                    name: "srcFrequency", 
                    type: "string"
                },{
                    name: "srcPressureLevel", 
                    type: "string"
                },{
                    name: "itemStatusMessage", 
                    type: "string"
                },{
                    name: "securityLevel", 
                    type: "string"
                },{
                    name: "srcPath", 
                    type: "string"
                },{
                    name: "octaveConfigFilePath", 
                    type: "string"
                },{
                    name: "storeName", 
                    type: "string"
                },{
                    name: "userId", 
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
                    /*protocol: new OpenLayers.Protocol.HTTP({
                        url: "http://localhost:8080/MapComposer/proxy?url="+encodeURIComponent(urlTest),
                        format: new OpenLayers.Format.GeoJSON()
                    })*/
                }), 
                autoLoad: true 
            });
            
        var wfsGridPanel=new Ext.grid.GridPanel({ 
            title: this.title, 
            store: wfsStore, 
            id: this.id,
            layout: "fit",
            viewConfig : {
                    forceFit: true
            },
            colModel: new Ext.grid.ColumnModel({
                
                columns: [{
                    xtype: 'actioncolumn',
                    sortable : false, 
                    width: 30,
                    
                    listeners: {
                        scope: this,
                        click: function(column, grd, row, e){
                        }
                    },
                    items: [{
                           // icon   : this.addLayerIconPath,  
                            tooltip: this.addLayerTooltip,
                            scope: this
                        },{
                            getClass: function(v, meta, rec) {
                                
                                if (rec.get('itemStatus') == "COMPLETED")  
                                      return 'action-add-layer';
                                  else
                                      return  'no-action-add-layer'
                            },
                            handler: function(gpanel, rowIndex, colIndex) {
                                var store = gpanel.getStore();	
                                var record = store.getAt(rowIndex);
                                addLayer.addLayer(record.get("name"),
                                    record.get("wsName") + ":" + record.get("layerName"),
                                    record.get("outputUrl")
                                );
                            }
                        }]
                },{
                    xtype: 'actioncolumn',
                    sortable : false, 
                    width: 30,
                    items: [{
                            icon   : this.detailsIconPath,  
                            tooltip: this.detailsTooltip,
                            scope: this,
                            handler: function(gpanel, rowIndex, colIndex) {
                                var store = gpanel.getStore();	
                                var record = store.getAt(rowIndex);
                                var detailsStore=new Ext.data.ArrayStore({
                                    fields: ['name', 'value'],
                                    idIndex: 0 
                                });
                            var recordDetailsData = new Array();

                            recordDetailsData.push([ 'ftUUID', record.get("ftUUID")]);
                            recordDetailsData.push([ 'itemStatus', record.get("itemStatus")]);
                            recordDetailsData.push([ 'name', record.get("name")]);
                            recordDetailsData.push([ 'runBegin', record.get("runBegin")]);
                            recordDetailsData.push([ 'runEnd', record.get("runEnd")]);
                            recordDetailsData.push([ 'season', record.get("season")]);
                            recordDetailsData.push([ 'srcFrequency', record.get("srcFrequency")]);
                            recordDetailsData.push([ 'srcPressureLevel', record.get("srcPressureLevel")]);
                            recordDetailsData.push([ 'layerName', record.get("layerName")]);
                            recordDetailsData.push([ 'wsName', record.get("wsName")]);
                            recordDetailsData.push([ 'outputUrl', record.get("outputUrl")]);
                            recordDetailsData.push([ 'itemStatusMessage', record.get("itemStatusMessage")]);
                            recordDetailsData.push([ 'securityLevel', record.get("securityLevel")]);
                            recordDetailsData.push([ 'srcPath', record.get("srcPath")]);
                            recordDetailsData.push([ 'octaveConfigFilePath', record.get("octaveConfigFilePath")]);
                            recordDetailsData.push([ 'storeName', record.get("storeName")]);
                            recordDetailsData.push([ 'userId', record.get("userId")]);

                            detailsStore.loadData(recordDetailsData);
                                new Ext.Window({ 
                                    title: record.get("name")+ " - " + this.detailsWinTitle,
                                    height: 400,
                                    width: 400,
                                    layout: 'fit',
                                    resizable: true,
                                    items:
                                        new Ext.grid.GridPanel({
                                            store: detailsStore,
                                            anchor: '100%',
                                            viewConfig : {
                                                forceFit: true
                                            },
                                            columns: [
                                                {
                                                header: this.detailsHeaderName, 
                                                dataIndex: "name",

                                                renderer: function (val){
                                                    return '<b>' + val + '</b>';
                                                }
                                                },{
                                                header: this.detailsHeaderName, 
                                                dataIndex: "value"
                                                }]
                                        })
                                }).show();
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
                    width: 200
                },{
                    header: "Model End Date", 
                    dataIndex: "runEnd",
                    width: 200
                }]
            }),
            bbar: new Ext.PagingToolbar({
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
