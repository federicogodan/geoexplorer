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
    
    

  /*  describeLayer: function(rec, callback, scope) {
        if (!this.describeLayerStore) {
            this.initDescribeLayerStore();
        }
        function delayedCallback(arg) {
            window.setTimeout(function() {
                callback.call(scope, arg);
            }, 0);
        }
        if (!this.describeLayerStore) {
            delayedCallback(false);
            return;
        }
        if (!this.describedLayers) {
            this.describedLayers = {};
        }
        var layerName = rec.getLayer().params.LAYERS;
        var cb = function() {
            var recs = Ext.isArray(arguments[1]) ? arguments[1] : arguments[0];
            var rec, name;
            for (var i=recs.length-1; i>=0; i--) {
                rec = recs[i];
                name = rec.get("layerName");
                if (name == layerName) {
                    this.describeLayerStore.un("load", arguments.callee, this);
                    this.describedLayers[name] = true;
                    callback.call(scope, rec);
                    return;
                } else if (typeof this.describedLayers[name] == "function") {
                    var fn = this.describedLayers[name];
                    this.describeLayerStore.un("load", fn, this);
                    fn.apply(this, arguments);
                }
            }
            // something went wrong (e.g. GeoServer does not return a valid
            // DescribeFeatureType document for group layers)
            delete describedLayers[layerName];
            callback.call(scope, false);
        };
        var describedLayers = this.describedLayers;
        var index;
        if (!describedLayers[layerName]) {
            describedLayers[layerName] = cb;
            this.describeLayerStore.load({
                params: {LAYERS: layerName},
                add: true,
                callback: cb,
                scope: this
            });
        } else if ((index = this.describeLayerStore.findExact("layerName", layerName)) == -1) {
            this.describeLayerStore.on("load", cb, this);
        } else {
            delayedCallback(this.describeLayerStore.getAt(index));
        }
    },
    

    getSchema: function(rec, callback, scope) {
        if (!this.schemaCache) {
            this.schemaCache = {};
        }
        this.describeLayer(rec, function(r) {
            if (r && r.get("owsType") == "WFS") {
                var typeName = r.get("typeName");
                var schema = this.schemaCache[typeName];
                if (schema) {
                    if (schema.getCount() == 0) {
                        schema.on("load", function() {
                            callback.call(scope, schema);
                        }, this, {single: true});
                    } else {
                        callback.call(scope, schema);
                    }
                } else {
                    schema = new GeoExt.data.AttributeStore({
                        url: r.get("owsURL"),
                        baseParams: {
                            SERVICE: "WFS",
                            //TODO should get version from WFS GetCapabilities
                            VERSION: "1.1.0",
                            REQUEST: "DescribeFeatureType",
                            TYPENAME: typeName
                        },
                        autoLoad: true,
                        listeners: {
                            "load": function() {
                                callback.call(scope, schema);
                            },
                            scope: this
                        }
                    });
                    this.schemaCache[typeName] = schema;
                }
            } else {
                callback.call(scope, false);
            }
        }, this);
   },

    setFeatureStore: function(filter, autoLoad) {
        var record = this.layerRecord;
        var source = this.target.getSource(record);
        if (source && source instanceof gxp.plugins.WMSSource) {
            source.getSchema(record, function(schema) {
                if (schema === false) {
                    this.clearFeatureStore();
                } else {
                    var fields = [], geometryName;*/
                   // var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
                   /* var types = {
                        "xsd:boolean": "boolean",
                        "xsd:int": "int",
                        "xsd:integer": "int",
                        "xsd:short": "int",
                        "xsd:long": "int",
                        "xsd:date": "date",
                        "xsd:string": "string",
                        "xsd:float": "float",
                        "xsd:double": "float"
                    };
                    schema.each(function(r) {
                        var match = geomRegex.exec(r.get("type"));
                        if (match) {
                            geometryName = r.get("name");
                            this.geometryType = match[1];
                        } else {
                            // TODO: use (and improve if needed) GeoExt.form.recordToField
                            var type = types[r.get("type")];
                            var field = {
                                name: r.get("name"),
                                type: types[type]
                            };
                            //TODO consider date type handling in OpenLayers.Format
                            if (type == "date") {
                                field.dateFormat = "Y-m-d\\Z";
                            }
                            fields.push(field);
                        }
                    }, this);
                    var protocolOptions = {
                        srsName: this.target.mapPanel.map.getProjection(),
                        url: schema.url,
                        featureType: schema.reader.raw.featureTypes[0].typeName,
                        featureNS: schema.reader.raw.targetNamespace,
                        geometryName: geometryName
                    };
                    this.hitCountProtocol = new OpenLayers.Protocol.WFS(Ext.apply({
                        version: "1.1.0",
                        readOptions: {output: "object"},
                        resultType: "hits",
                        filter: filter
                    }, protocolOptions));
                    this.featureStore = new gxp.data.WFSFeatureStore(Ext.apply({
                        fields: fields,
                        proxy: {
                            protocol: {
                                outputFormat: this.format 
                            }
                        },
                        maxFeatures: this.maxFeatures,
                        layer: this.featureLayer,
                        ogcFilter: filter,
                        autoLoad: autoLoad,
                        autoSave: false,
                        listeners: {
                            "write": function() {
                                this.redrawMatchingLayers(record);
                            },
                            "load": function() {
                                this.fireEvent("query", this, this.featureStore, this.filter);
                            },
                            scope: this
                        }
                    }, protocolOptions));
                }
                this.fireEvent("layerchange", this, record, schema);
            }, this);
        } else {
            this.clearFeatureStore();
            this.fireEvent("layerchange", this, record, false);
        }        
    },*/

    /** api: method[addOutput]
     */
    addOutput: function(config) {
       var addLayer = this.target.tools[this.addLayerTool]; 
       var wfsStore= new GeoExt.data.FeatureStore({ 
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
            
                paramNames: {
                    start : 'startIndex',  
                    limit : 'maxFeatures'
                },
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
                    
                    listeners: {
                        scope: this,
                        click: function(column, grd, row, e){
                        }
                    },
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
                pageSize: 10,
                store: wfsStore,
                displayInfo: true,
                listeners: {
                    "beforechange": function(){
                         alert("change Page");
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
