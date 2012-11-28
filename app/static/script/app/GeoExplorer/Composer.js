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
                            WIDTH: 12,
                            HEIGHT: 12
                        }
                    }
                }
            }, {
                ptype: "gxp_addlayers",
                actionTarget: "tree.tbar",
                upload: true
            },/* {
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
            },*/ {
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
            }, {
                ptype: "gxp_zoomtoextent",
                /*extent: function(){
                    var bbox = new OpenLayers.Bounds.fromString('-15,8,-7,15');
                    return bbox.transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection("EPSG:102113"));
                },*/
                actionTarget: {target: "paneltbar", index: 15}
            }, {
                ptype: "gxp_navigation", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 16}
            }, {
                actions: ["-"], actionTarget: "paneltbar"
            }, {
                ptype: "gxp_zoombox", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 17}
            }, {
                ptype: "gxp_zoom",
                actionTarget: {target: "paneltbar", index: 18}
            }, {
                actions: ["-"], actionTarget: "paneltbar"
            }, {
                ptype: "gxp_navigationhistory",
                actionTarget: {target: "paneltbar", index: 19}
            }, {
                actions: ["-"], actionTarget: "paneltbar"
            }, {
                ptype: "gxp_wmsgetfeatureinfo", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 21}
            }, {
                actions: ["-"], actionTarget: "paneltbar"
            }, {
                ptype: "gxp_measure", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 20}
            }, {
                actions: ["-"], actionTarget: "paneltbar"
            },{
                ptype: "gxp_saveDefaultContext",
                actionTarget: {target: "paneltbar", index: 22},
				        needsAuthorization: true
            }/*, {
                actions: ["->"], actionTarget: "paneltbar"
            }*/
        ];

   /**
     * Parses the ISO 8601 formated date into a date object, ISO 8601 is YYYY-MM-DD
     * 
     * @param {String} date the date as a string eg 1971-12-15
     * @returns {Date} Date object representing the date of the supplied string
     */
    Date.prototype.parseISO8601 = function(date){
        var matches = date.match(/^\s*(\d{4})-(\d{2})-(\d{2})\s*$/);

        if(matches){
            this.setFullYear(parseInt(matches[1]));    
            this.setMonth(parseInt(matches[2]) - 1);    
            this.setDate(parseInt(matches[3]));    
        }

        return this;
    };
        
        if (config.map.layers[22]){
            var layerName = config.map.layers[22].name;
            var layerNameData = layerName.substring(layerName.lastIndexOf("_")+1,layerName.lastIndexOf("_")+12);
            var anno = layerNameData.substring(0,4);
            var mese = layerNameData.substring(4,6);
            var giorno = layerNameData.substring(6,8);
            var run = layerNameData.substring(8,11);

            var startTime = new Date(Date.UTC(anno,mese-1,giorno));

            function pad(n) { return n < 10 ? '0' + n : n }        
            var startDateStr = pad(startTime.getUTCFullYear()) + "-" + pad(startTime.getUTCMonth() + 1) + "-" + pad(startTime.getUTCDate());
            
            // somma data per ARW_3KM_RUN00
            var endTimeArw3kmRun00 = addDays(startTime, 2);        
            var endDateStrArw3kmRun00 = pad(endTimeArw3kmRun00.getUTCFullYear()) + "-" + pad(endTimeArw3kmRun00.getUTCMonth() + 1) + "-" + pad(endTimeArw3kmRun00.getUTCDate());

            // somma data per ARW_3KM_RUN12
            var endTimeArw3kmRun12 = addDays(startTime, 3);        
            var endDateStrArw3kmRun12 = pad(endTimeArw3kmRun12.getUTCFullYear()) + "-" + pad(endTimeArw3kmRun12.getUTCMonth() + 1) + "-" + pad(endTimeArw3kmRun12.getUTCDate());
            var startDate3km12 = addHours(startTime, 12);        
            
            // somma data per ARW_9KM_RUN00
            var endTimeArw9kmRun00 = addDays(startTime, 3);        
            var endDateStrArw9kmRun00 = pad(endTimeArw9kmRun00.getUTCFullYear()) + "-" + pad(endTimeArw9kmRun00.getUTCMonth() + 1) + "-" + pad(endTimeArw9kmRun00.getUTCDate());

            // somma data per ARW_9KM_RUN12
            var endTimeArw9kmRun12 = addDays(startTime, 4);        
            var endDateStrArw9kmRun12 = pad(endTimeArw9kmRun12.getUTCFullYear()) + "-" + pad(endTimeArw9kmRun12.getUTCMonth() + 1) + "-" + pad(endTimeArw9kmRun12.getUTCDate());
            var startDate9km12 = addHours(startTime, 12);

            // somma data per GFS_RUN00 and GFS_RUN06
            var endTimeGfsRun_00_06 = addDays(startTime, 7);        
            var endDateStrGfsRun_00_06 = pad(endTimeGfsRun_00_06.getUTCFullYear()) + "-" + pad(endTimeGfsRun_00_06.getUTCMonth() + 1) + "-" + pad(endTimeGfsRun_00_06.getUTCDate());
            var startDateGfs06 = addHours(startTime, 6);
            
            // somma data per GFS_RUN12 and GFS_RUN18
            var endTimeGfsRun_12_18 = addDays(startTime, 8);        
            var endDateStrGfsRun_12_18 = pad(endTimeGfsRun_12_18.getUTCFullYear()) + "-" + pad(endTimeGfsRun_12_18.getUTCMonth() + 1) + "-" + pad(endTimeGfsRun_12_18.getUTCDate());        
            var startDateGfs12 = addHours(startTime, 12);
            var startDateGfs18 = addHours(startTime, 18);
            
            var arw3kmRun = config.sources.ARW_3KM_RUN00 || config.sources.ARW_3KM_RUN12;
            var arw9kmRun = config.sources.ARW_9KM_RUN00 || config.sources.ARW_9KM_RUN12;
            var gfsRun = config.sources.GFS_50KM_RUN00 || config.sources.GFS_50KM_RUN06 || config.sources.GFS_50KM_RUN12 || config.sources.GFS_50KM_RUN18;
        }

        function addDays(data, giorni)
        {
            return new Date(data.getTime() + giorni*86400000)
        }

        
        function addHours(data, ore)
        {
            return new Date(data.getTime() + ore*3600000)
        }        
        
        if (config.sources.MSG1 && !arw3kmRun && !arw9kmRun && !gfsRun){
            config.tools.push({
                ptype:"gxp_playback",
                outputTarget: "paneltbar",
                playbackMode: "track",
                showIntervals: true,
                labelButtons: true,
                settingsButton: true,
                rateAdjuster: false,
                dynamicRange: false,
                timeFormat: 'c',
                outputConfig: {
                    controlConfig:{
                        units: OpenLayers.TimeUnit.MINUTES,
                        step: 5
                        //units:config.units,
                        //timeSpans: config.timeSpans,
                        //range: config.range
                    }
                }
            })
        }else if (config.sources.MSG2 && !arw3kmRun && !arw9kmRun && !gfsRun){
            config.tools.push({
                ptype:"gxp_playback",
                outputTarget: "paneltbar",
                playbackMode: "track",
                showIntervals: true,
                labelButtons: true,
                settingsButton: true,
                rateAdjuster: false,
                dynamicRange: false,
                timeFormat: 'c',
                outputConfig: {
                    controlConfig:{
                        units: OpenLayers.TimeUnit.MINUTES,
                        step: 15//,
                        //units:config.units,
                        //timeSpans: config.timeSpans,
                        //range: config.range
                    }
                }
            })
        }else if (config.sources.RADAR && !arw3kmRun && !arw9kmRun && !gfsRun){
            config.tools.push({
                ptype:"gxp_playback",
                outputTarget: "paneltbar",
                playbackMode: "track",
                showIntervals: true,
                labelButtons: true,
                settingsButton: true,
                rateAdjuster: false,
                dynamicRange: false,
                timeFormat: 'c',
                outputConfig: {
                    controlConfig:{
                        units: OpenLayers.TimeUnit.MINUTES,
                        step: 15
                        //units:config.units,
                        //timeSpans: config.timeSpans,
                        //range: config.range
                    }
                }
            })
        }else if (gfsRun){
            var startRunGfs;
            var endRunGfs;
            var endGfs;
            var currentTimeGfs;            
            
            switch(gfsRun.title) {
              case "LaMMA GFS_50KM_RUN00":
                startRunGfs = "T00:00:00.000Z";
                endRunGfs = "T12:00:00.000Z";
                endGfs = endDateStrGfsRun_00_06;
                currentTimeGfs = startTime;
              break;
              case "LaMMA GFS_50KM_RUN06":
                startRunGfs = "T06:00:00.000Z";
                endRunGfs = "T18:00:00.000Z";
                endGfs = endDateStrGfsRun_00_06;
                currentTimeGfs = startDateGfs06;
              break;
              case "LaMMA GFS_50KM_RUN12":
                startRunGfs = "T12:00:00.000Z";
                endRunGfs = "T00:00:00.000Z";
                endGfs = endDateStrGfsRun_12_18;
                currentTimeGfs = startDateGfs12;
              break;
              default:
                startRunGfs = "T18:00:00.000Z";
                endRunGfs = "T06:00:00.000Z";
                endGfs = endDateStrGfsRun_12_18;
                currentTimeGfs = startDateGfs18;
            }

            config.tools.push({
                ptype:"gxp_playback",
                outputTarget: "paneltbar",
                playbackMode: "track",
                showIntervals: true,
                labelButtons: true,
                settingsButton: true,
                rateAdjuster: false,
                dynamicRange: false,
                timeFormat: 'c',
                outputConfig: {
                    controlConfig:{
                        units:OpenLayers.TimeUnit.HOURS,
                        step: 6,
                        currentTime: currentTimeGfs,
                        //units:config.units,
                        //timeSpans: config.timeSpans,
                        range: [startDateStr+startRunGfs,endGfs+endRunGfs]
                    }
                }
            })
        }else if (arw3kmRun){
            var startRunArw3km;
            var endRunArw3km;
            var endArw3km;
            var currentTimeArw3Km;
            
            switch(arw3kmRun.title) {
              case "LaMMA ARW_3KM_RUN00":
                startRunArw3km = "T00";
                endRunArw3km = "T00";
                endArw3km = endDateStrArw3kmRun00;
                currentTimeArw3Km = startTime;
              break;
              default:
                startRunArw3km = "T12";
                endRunArw3km = "T00";
                endArw3km = endDateStrArw3kmRun12;
                currentTimeArw3Km = startDate3km12;
            }

            config.tools.push({
                ptype:"gxp_playback",
                outputTarget: "paneltbar",
                playbackMode: "track",
                showIntervals: true,
                labelButtons: true,
                settingsButton: true,
                rateAdjuster: false,
                dynamicRange: false,
                timeFormat: 'c',
                outputConfig: {
                    controlConfig:{
                        units: OpenLayers.TimeUnit.HOURS,
                        step: 1,
                        currentTime: currentTimeArw3Km,
                        //units:config.units,
                        //timeSpans: config.timeSpans,
                        range: [startDateStr+startRunArw3km+":00:00.000Z",endArw3km+endRunArw3km+":00:00.000Z"]
                    }
                }
            })
        }else if (arw9kmRun){
            var startRunArw9km;
            var endRunArw9km;
            var startArw9km;
            var currentTimeArw9Km;
            
            switch(arw9kmRun.title) {
              case "LaMMA ARW_9KM_RUN00":
                startRunArw9km = "T00";
                endRunArw9km = "T00";
                endArw9km = endDateStrArw9kmRun00;
                currentTimeArw9Km = startTime;
              break;
              default:
                startRunArw9km = "T12";
                endRunArw9km = "T00";
                endArw9km = endDateStrArw9kmRun12;
                currentTimeArw9Km = startDate9km12;
            }

            config.tools.push({
                ptype:"gxp_playback",
                outputTarget: "paneltbar",
                playbackMode: "track",
                showIntervals: true,
                labelButtons: true,
                settingsButton: true,
                rateAdjuster: false,
                dynamicRange: false,
                timeFormat: 'c',
                outputConfig: {
                    controlConfig:{
                        units: OpenLayers.TimeUnit.HOURS,
                        step: 1,
                        currentTime: currentTimeArw9Km,
                        //units:config.units,
                        //timeSpans: config.timeSpans,
                        range: [startDateStr+startRunArw9km+":00:00.000Z",endArw9km+endRunArw9km+":00:00.000Z"]
                    }
                }
            })
        } else {
            config.tools.push({
                ptype:"gxp_playback",
                outputTarget: "paneltbar",
                playbackMode: "track",
                showIntervals: true,
                labelButtons: true,
                settingsButton: true,
                rateAdjuster: false,
                dynamicRange: false,
                timeFormat: 'c',
                outputConfig: {
                    controlConfig:{
                        units: OpenLayers.TimeUnit.HOURS,
                        step: 1//,
                        //units:config.units,
                        //timeSpans: config.timeSpans,
                        //range: config.range
                    }
                }
            })
        }
        
        
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
                        Ext.getCmp('east').collapse();
                        Ext.getCmp('west').collapse();
                        Ext.getCmp('main-header').collapse();
                    } else {
                        Ext.getCmp('east').expand();
                        Ext.getCmp('west').expand();
                        Ext.getCmp('main-header').expand();
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
