/**
 * Copyright (c) 2009-2010 The Open Planning Project
 *
 * @requires GeoExplorer.js
 */

/** api: (define)
 *  module = GeoExplorer
 *  class = GeoExplorer.Composer(config)
 *  extends = GeoExplorer
 */

/** api: constructor
 *  .. class:: GeoExplorer.Composer(config)
 *
 *      Create a GeoExplorer application intended for full-screen display.
 */
GeoExplorer.Composer = Ext.extend(GeoExplorer, {

    // Begin i18n.
    saveMapText: "Export Map",
    loadMapText: "Import Map",
    exportMapText: "Export Map",
    toolsTitle: "Choose tools to include in the toolbar:",
    previewText: "Preview",
    backText: "Back",
    nextText: "Next",
    fullScreenText: "Full Screen",
    // End i18n.
    constructor: function(config) {      
	  	var self = this;
        config.tools = [
            {
                ptype: "gxp_layertree",
                outputConfig: {
                    id: "layertree"
                },
                outputTarget: "tree"
            }, {
                ptype: "gxp_legend",
                outputTarget: 'legend',
                outputConfig: {
                    autoScroll: true
                },
                legendConfig : {
                    legendPanelId : 'legendPanel',
                    defaults: {
                        style: 'padding:5px',                  
                        baseParams: {
                            LEGEND_OPTIONS: 'forceLabels:on;fontSize:10',
                            WIDTH: 12, HEIGHT: 12
                        }
                    }
                }
            },{
				ptype: "gxp_feature_details",
				outputTarget: 'feature-details',
				drawingLayer: config.drawingLayer
			}, {
				ptype: "gxp_pilot_notes",
				outputTarget: 'pilot-notes',
				drawingLayer: config.notesLayer
			},/*{
                ptype: "gxp_addlayers",
                actionTarget: "tree.tbar",
                upload: true
            }, {
                ptype: "gxp_removelayer",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_removeoverlays",
                actionTarget: "tree.tbar"
            }, {
                ptype: "gxp_addgroup",
                actionTarget: "tree.tbar"
            }, {
                ptype: "gxp_removegroup",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_groupproperties",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_layerproperties",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_zoomtolayerextent",
                actionTarget: {target: "layertree.contextMenu", index: 0}
            },{
                ptype:"gxp_geonetworksearch",
                actionTarget:[
                   "layertree.contextMenu"
                ]
            },*/ {
                ptype: "gxp_navigation", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 15}
            }, {
                ptype: "gxp_wmsgetfeatureinfo", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 7}
            }, {
                ptype: "gxp_measure", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 12}
            }, {
                ptype: "gxp_zoom",
                actionTarget: {target: "paneltbar", index: 20}
            }, {
                ptype: "gxp_zoombox", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 24}
            }, {
                ptype: "gxp_navigationhistory",
                actionTarget: {target: "paneltbar", index: 22}
            }, {
                ptype: "gxp_zoomtoextent",
                /*extent: function(){
                    var bbox = new OpenLayers.Bounds.fromString('-15,8,-7,15');
                    return bbox.transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection("EPSG:102113"));
                },*/
                actionTarget: {target: "paneltbar", index: 26}
            },{
		       ptype:"gxp_embedded_link",
		       actionTarget: {target: "paneltbar", index: 27}
		    },{
                actions: ["-"], actionTarget: "paneltbar"
            }, {
                ptype: "gxp_add_geometry", toggleGroup: this.toggleGroup, 
                actionTarget: [ "feature-details.tbar" ],
                layer: config.drawingLayer
            }, {
                ptype: "gxp_feature_selector", toggleGroup: this.toggleGroup, 
                actionTarget: [ "feature-details.tbar" ],
                layer: config.drawingLayer,
                onSelected: function( target, feature ){
                    self.fireEvent("featureselected", target, feature);
                },
                onUnselected: function( target ){
                    self.fireEvent("featureunselected", target);
                }
            }, {
                ptype:"gxp_import_kml",
                actionTarget: {target: "feature-details.tbar", index: 25},
                layer: config.drawingLayer
            }, {
                ptype:"gxp_export_kml",
                actionTarget: {target: "feature-details.tbar", index: 25},
                layer: config.drawingLayer
            }, {
                ptype: "gxp_add_geometry", toggleGroup: this.toggleGroup, 
                actionTarget: [ "pilot-notes.tbar" ],
                layer: config.notesLayer
            }, {
                ptype: "gxp_feature_selector", toggleGroup: this.toggleGroup, 
                actionTarget: [ "pilot-notes.tbar" ],
                layer: config.notesLayer,
                onSelected: function( target, feature ){
                    self.fireEvent("notefeatureselected", target, feature);
                },
                onUnselected: function( target ){
                    self.fireEvent("notefeatureunselected", target);
                }
            }, {
                ptype:"gxp_import_kml",
                actionTarget: {target: "pilot-notes.tbar", index: 25},
                layer: config.notesLayer
            }, {
                ptype:"gxp_export_kml",
                actionTarget: {target: "pilot-notes.tbar", index: 25},
                layer: config.notesLayer
            }, {
                actions: ["->"], actionTarget: "paneltbar"
            }, {
                ptype:"gxp_playback",
                outputTarget: "paneltbar",
                playbackMode: "range",
                showIntervals: true,
                labelButtons: true,
                settingsButton: true,
                rateAdjuster: true,
                dynamicRange: false,
                timeFormat: 'l, F d, Y g:i:s A',
                outputConfig: {
                    controlConfig:{
                        //step: 1,
                        units:config.units,
                        //timeSpans: config.timeSpans,
                        range: config.range
                    }
                }
            }
        ];
        
       
        GeoExplorer.Composer.superclass.constructor.apply(this, arguments);
    },

    /** api: method[destroy]
     */
    destroy: function() {
        this.loginButton = null;
        GeoExplorer.Composer.superclass.destroy.apply(this, arguments);
    },
    
    /**
     * api: method[createTools]
     * Create the toolbar configuration for the main view.
     */
    createTools: function() {
        var tools = GeoExplorer.Composer.superclass.createTools.apply(this, arguments);
         
        if(!this.fScreen){
            var fullScreen = new Ext.Button({
                text: this.fullScreenText,
                id: "full-screen-button",
                iconCls: "icon-fullscreen",
                enableToggle: true,
                handler: function(button, evt){
                    if(button.pressed){
                        Ext.getCmp('tree').findParentByType('panel').collapse();
                    } else {
                        Ext.getCmp('tree').findParentByType('panel').expand();
                    }
                }
            });            
                            
            tools.unshift(fullScreen);
        }
        
        /*tools.push(new Ext.Button({
            tooltip: this.saveMapText,
            handler: function() {
                this.save(this.showUrl);
            },
            scope: this,
            iconCls: "icon-save"
        }));        
        
        tools.push(new Ext.Button({
            tooltip: this.loadMapText,
            handler: function() {    
                var composer = this; 
                var win;  
                  
                var fp = new Ext.FormPanel({
                    fileUpload: true,
                    autoWidth: true,
                    autoHeight: true,
                    frame: true,
                    bodyStyle: 'padding: 10px 10px 0 10px;',
                    labelWidth: 50,
                    defaults: {
                        anchor: '95%',
                        allowBlank: false,
                        msgTarget: 'side'
                    },
                    items: [{
                        xtype: 'fileuploadfield',
                        id: 'form-file',
                        emptyText: 'Select a Map context file',
                        fieldLabel: 'File',
                        name: 'file-path',
                        buttonText: '',
                        buttonCfg: {
                            iconCls: 'upload-icon'
                        }
                    }],
                    buttons: [{
                        text: 'Upload',
                        handler: function(){
                            if(fp.getForm().isValid()){
                              fp.getForm().submit({
                                  url: app.xmlJsonTranslateService + 'HTTPWebGISFileUpload',
                                  //url: proxy + app.xmlJsonTranslateService + 'HTTPWebGISFileUpload',
                                  waitMsg: 'Uploading your context file...',
                                  success: function(fp, o){
                                      win.hide();
                                      var json_str = unescape(o.result.result);
                                      json_str = json_str.replace(/\+/g, ' ');
                                      
                                      composer.loadUserConfig(json_str);  
                                      
                                      //app.modified = true;
                                      modified = true;                                    
                                  },                                    
                                  failure: function(fp, o){
                                      win.hide();
                                      win.destroy();
                                      
                                      Ext.Msg.show({
                                         title:'File Upload Error',
                                         msg: o.result.errorMessage,
                                         buttons: Ext.Msg.OK,
                                         icon: Ext.MessageBox.ERROR
                                      });
                                  }
                              });
                            }
                        }
                    }]
                });
                
                win = new Ext.Window({
                    title: 'File Upload Form',
                    id: 'upload-win',
                    layout: 'form',
                    labelAlign: 'top',
                    modal: true,
                    bodyStyle: "padding: 5px",
                    width: 380,
                    items: [fp]
                });
                
                win.show();
            },
            scope: this,
            iconCls: "icon-load"
        }));*/
        
        return tools;
    },
    
    /*
     * private: method[openPreview]
     */
    viewMetadata: function(gnURL, uuid, title){
        var tabPanel = Ext.getCmp(app.renderToTab);
        
        var tabs = tabPanel.find('title', title);
        if(tabs && tabs.length > 0){
            tabPanel.setActiveTab(tabs[0]); 
        }else{
            var metaURL = gnURL + "metadata.show?uuid=" + uuid; 
            
            var meta = new Ext.Panel({
                title: title,
                layout:'fit', 
                tabTip: title,
                closable: true,
                items: [ 
                    new Ext.ux.IFrameComponent({ 
                        url: metaURL 
                    }) 
                ]
            });
            
            tabPanel.add(meta);
        }
    },

    /** private: method[openPreview]
     */
    openPreview: function(embedMap) {
        var preview = new Ext.Window({
            title: this.previewText,
            layout: "fit",
            items: [{border: false, html: embedMap.getIframeHTML()}]
        });
        preview.show();
        var body = preview.items.get(0).body;
        var iframe = body.dom.firstChild;
        var loading = new Ext.LoadMask(body);
        loading.show();
        Ext.get(iframe).on('load', function() { loading.hide(); });
    },

    /** private: method[showEmbedWindow]
     */
    showEmbedWindow: function() {
       var toolsArea = new Ext.tree.TreePanel({title: this.toolsTitle, 
           autoScroll: true,
           root: {
               nodeType: 'async', 
               expanded: true, 
               children: this.viewerTools
           }, 
           rootVisible: false,
           id: 'geobuilder-0'
       });

       var previousNext = function(incr){
           var l = Ext.getCmp('geobuilder-wizard-panel').getLayout();
           var i = l.activeItem.id.split('geobuilder-')[1];
           var next = parseInt(i, 10) + incr;
           l.setActiveItem(next);
           Ext.getCmp('wizard-prev').setDisabled(next==0);
           Ext.getCmp('wizard-next').setDisabled(next==1);
           if (incr == 1) {
               this.saveAndExport();
           }
       };

       var embedMap = new gxp.EmbedMapDialog({
           id: 'geobuilder-1',
           url: "viewer" + "#maps/" + this.id
       });

       var wizard = {
           id: 'geobuilder-wizard-panel',
           border: false,
           layout: 'card',
           activeItem: 0,
           defaults: {border: false, hideMode: 'offsets'},
           bbar: [{
               id: 'preview',
               text: this.previewText,
               handler: function() {
                   this.saveAndExport(this.openPreview.createDelegate(this, [embedMap]));
               },
               scope: this
           }, '->', {
               id: 'wizard-prev',
               text: this.backText,
               handler: previousNext.createDelegate(this, [-1]),
               scope: this,
               disabled: true
           },{
               id: 'wizard-next',
               text: this.nextText,
               handler: previousNext.createDelegate(this, [1]),
               scope: this
           }],
           items: [toolsArea, embedMap]
       };

       new Ext.Window({
            layout: 'fit',
            width: 500, height: 300,
            title: this.exportMapText,
            items: [wizard]
       }).show();
    }
});
