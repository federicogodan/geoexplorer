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
    
    
    
    /** api: config[filter]
     *  ``OpenLayers.Filter``
     *  
     */
    filter: null,
    

    /** api: config[version]
     *  ``String``
     *  
     */
    version: null,
    
    
    addLayerIconPath: "theme/app/img/silk/add.png",
    
    
    detailsIconPath: "theme/app/img/silk/information.png",
    
    
    addLayerTool: null,
    
    pageSize: 2,
    
    autoRefreshInterval: null,
    
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
    
    countFeature: null,
	
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WFSGrid.superclass.constructor.apply(this, arguments);  
        
        this.setTotalRecord();
        
        if(config.autoRefresh){
            this.setAutoRefresh(config.autoRefresh);
        }
    },
    
    setTotalRecord: function(callback){
        var hitCountProtocol = new OpenLayers.Protocol.WFS({ 
               url: this.wfsURL, 
               featureType: this.featureType, 
               readOptions: {output: "object"},
               featureNS: this.featureNS, 
               resultType: "hits",
               filter: this.filter,
               outputFormat: "application/json",
               srsName: this.srsName,
               version: this.version
       });
                 
               
       hitCountProtocol.read({
         callback: function(response) {
                this.countFeature=response.numberOfFeatures;
                if(callback)
                    callback.call();
         },
         scope: this
       });
         
       return this.countFeature;
    },
    
    
    setFilter: function(filter){
        this.filter=filter;
        this.setPage(1);
    },
    
    setAutoRefresh: function(ms){
      var me=this;  
      this.autoRefreshInterval=setInterval(
        function() { 
            me.refresh()
        }, ms);  
    },
    
    
    clearAutoRefresh: function(){
      if(this.autoRefreshInterval)
         clearInterval(this.autoRefreshInterval);
    },
    
    resetFilter: function(){
       this.filter=null;
       this.setPage(1);
    },


    refresh: function(){
      var pagID= this.id+"_paging"; 
        this.setTotalRecord(function(){
            var paging=Ext.getCmp(pagID);
            paging.doRefresh();
        });
    },
    
    
    setPage: function(pageNumber){
       var pagID= this.id+"_paging"; 
        this.setTotalRecord(function(){
            var paging=Ext.getCmp(pagID);
            paging.changePage(pageNumber);
        }); 
    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
       var addLayer = this.target.tools[this.addLayerTool]; 
       var me= this;
       var wfsStore= new GeoExt.data.FeatureStore({ 
                wfsParam: this,
                sortInfo: { field: "runBegin", direction: "ASC" },
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
                loadRecords : function(o, options, success){
			if (this.isDestroyed === true) {
			   return;
			}
			if(!o || success === false){
                           if(success !== false){
			      this.fireEvent('load', this, [], options);
			   }
			   if(options.callback){
			      options.callback.call(options.scope || this, [], options, false, o);
			   }
			  return;
			}
			
			o.totalRecords = me.countFeature/*me.setTotalRecord()*/;
				
			var r = o.records, t = o.totalRecords || r.length;
			if(!options || options.add !== true){
                            if(this.pruneModifiedRecords){
				this.modified = [];
			    }
                            for(var i = 0, len = r.length; i < len; i++){
                                r[i].join(this);
                            }
                            if(this.snapshot){
                            this.data = this.snapshot;
                            delete this.snapshot;
                            }
                            this.clearData();
                            this.data.addAll(r);
                            this.totalLength = t;
                            this.applySort();
                            this.fireEvent('datachanged', this);
			}else{
                            this.totalLength = Math.max(t, this.data.length+r.length);
                            this.add(r);
			}
			this.fireEvent('load', this, r, options);
			if(options.callback){
                            options.callback.call(options.scope || this, r, options, true);
			}
		},
                proxy: new GeoExt.data.ProtocolProxy({ 
                    protocol: new OpenLayers.Protocol.WFS({ 
                        url: this.wfsURL, 
                        featureType: this.featureType, 
                        readFormat: new OpenLayers.Format.GeoJSON(),
                        featureNS: this.featureNS, 
                        filter: this.filter, 
                        maxFeatures: this.pageSize,
                        sortBy: "runEnd",
                        startIndex: 0,
                        outputFormat: "application/json",
                        srsName: this.srsName,
                        version: this.version
                    }) 
                }), 
                autoLoad: true 
            });
            
        var addLayerTT=this.addLayerTooltip;    
            
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
                    items: [{
                            tooltip:addLayerTT,
                            getClass: function(v, meta, rec) {
                                if (rec.get('itemStatus') == "COMPLETED")  {
                                     this.items[0].tooltip = addLayerTT; 
                                     return 'action-add-layer';
                                }else{
                                      this.items[0].tooltip = null;
                                      return  'no-action-add-layer';
                                }
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
                                            columns: [{
                                               header: this.detailsHeaderName, 
                                               dataIndex: "name",
                                               renderer: function (val){
                                                    return '<b>' + val + '</b>';
                                               }
                                             },{
                                                header: this.detailsHeaderValue, 
                                                dataIndex: "value"
                                             }]
                                        })
                                }).show();
                            }}]
                },{
                    header: "Model Status", 
                    dataIndex: "itemStatus",
                    sortable: true
                },{
                    header: "Model Name", 
                    dataIndex: "name",
                    sortable: true
                },{
                    header: "Model Run Date", 
                    dataIndex: "runBegin",
                    xtype: 'datecolumn', 
                    format: 'Y-m-d H:i:s',
                    sortable: true,
                    width: 200
                },{
                    header: "Model End Date", 
                    dataIndex: "runEnd",
                    xtype: 'datecolumn', 
                    sortable: true,
                    format: 'Y-m-d H:i:s',
                    width: 200
                }]
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: this.pageSize,
                wfsParam: this,
                id: this.id+"_paging",
                store: wfsStore,
                displayInfo: true,
                listeners: {
		    render: function(){
				this.last.setVisible(false);
		    },
                    "beforechange": function(paging,params){
                        paging.store.removeAll(true);
                        paging.store.proxy=new GeoExt.data.ProtocolProxy({ 
                                protocol: new OpenLayers.Protocol.WFS({ 
                                    url: this.wfsParam.wfsURL, 
                                    featureType: this.wfsParam.featureType, 
                                    readFormat: new OpenLayers.Format.GeoJSON(),
                                    featureNS: this.wfsParam.featureNS, 
                                    filter: this.wfsParam.filter,
                                    sortBy: "runEnd",
                                    maxFeatures: params.limit,
                                    startIndex:  params.start,
                                    outputFormat: "application/json",
                                    srsName: this.wfsParam.srsName,
                                    version: this.wfsParam.version
                                })
                       });
                    }          
                                
                },
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
