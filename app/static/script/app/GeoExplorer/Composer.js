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
    saveMapText: "Save Map",
    loadMap: "Load Map",
    exportMapText: "Export Map",
    toolsTitle: "Choose tools to include in the toolbar:",
    previewText: "Preview",
    backText: "Back",
    nextText: "Next",
    loginText: "Login",
    loginErrorText: "Invalid username or password.",
    userFieldText: "User",
    passwordFieldText: "Password", 
    // End i18n.

    constructor: function(config) {
        if (config.authStatus === 401) {
            // user has not authenticated or is not authorized
            this.authorizedRoles = [];
        } else {
            // user has authenticated or auth back-end is not available
            this.authorizedRoles = ["ROLE_ADMINISTRATOR"];
        }
        // should not be persisted or accessed again
        delete config.authStatus;

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
                outputConfig: {autoScroll: true}
            }, {
                ptype: "gxp_addlayers",
                actionTarget: "tree.tbar",
                upload: true
            }, {
                ptype: "gxp_removelayer",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_layerproperties",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_styler",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_zoomtolayerextent",
                actionTarget: {target: "layertree.contextMenu", index: 0}
            }, {
                ptype: "gxp_navigation", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 6}
            }, {
                ptype: "gxp_wmsgetfeatureinfo", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 7}
            },
/*            {
                ptype: "gxp_featuremanager",
                id: "featuremanager",
                maxFeatures: 20
            }, {
                ptype: "gxp_featureeditor",
                featureManager: "featuremanager",
                autoLoadFeatures: true,
                toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 8}
            }, 
*/
            {
                ptype: "gxp_measure", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 10}
            }, {
                ptype: "gxp_zoom",
                actionTarget: {target: "paneltbar", index: 11}
            }, {
                ptype: "gxp_navigationhistory",
                actionTarget: {target: "paneltbar", index: 13}
            }, {
                ptype: "gxp_zoomtoextent",
                actionTarget: {target: "paneltbar", index: 15}
            }, {
                ptype: "gxp_print",
                customParams: {outputFilename: 'GeoExplorer-print'},
                printService: config.printService,
                actionTarget: {target: "paneltbar", index: 5}
            }, {
                ptype: "gxp_googleearth",
                actionTarget: {target: "paneltbar", index: 17},
                apiKeys: {
                    "localhost": "ABQIAAAAeDjUod8ItM9dBg5_lz0esxTnme5EwnLVtEDGnh-lFVzRJhbdQhQBX5VH8Rb3adNACjSR5kaCLQuBmw",
                    "geo-solutions.it": "ABQIAAAA5SREeKhHQ5CKTL33pm0kPRT-MyVOyNDghWyrQfAYOWRyYsiL2BQYy-OMEt_BxLLciTgd-PQzwthG8w"
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

    /** private: method[showLoginDialog]
     * Show the login dialog for the user to login.
     */
    showLoginDialog: function() {
        var panel = new Ext.FormPanel({
            url: "login",
            frame: true,
            labelWidth: 60,
            defaultType: "textfield",
            errorReader: {
                read: function(response) {
                    var success = false;
                    var records = [];
                    if (response.status === 200) {
                        success = true;
                    } else {
                        records = [
                            {data: {id: "username", msg: this.loginErrorText}},
                            {data: {id: "password", msg: this.loginErrorText}}
                        ];
                    }
                    return {
                        success: success,
                        records: records
                    };
                }
            },
            items: [{
                fieldLabel: this.userFieldText,
                name: "username",
                allowBlank: false
            }, {
                fieldLabel: this.passwordFieldText,
                name: "password",
                inputType: "password",
                allowBlank: false
            }],
            buttons: [{
                text: this.loginText,
                formBind: true,
                handler: submitLogin,
                scope: this
            }],
            keys: [{ 
                key: [Ext.EventObject.ENTER], 
                handler: submitLogin,
                scope: this
            }]
        });

        function submitLogin() {
            panel.buttons[0].disable();
            panel.getForm().submit({
                success: function(form, action) {
                    this.authorizedRoles = ["ROLE_ADMINISTRATOR"];
                    Ext.getCmp('paneltbar').items.each(function(tool) {
                        if (tool.needsAuthorization === true) {
                            tool.enable();
                        }
                    });
                    this.loginButton.hide();
                    win.close();
                },
                failure: function(form, action) {
                    this.authorizedRoles = [];
                    panel.buttons[0].enable();
                    form.markInvalid({
                        "username": this.loginErrorText,
                        "password": this.loginErrorText
                    });
                },
                scope: this
            });
        }
                
        var win = new Ext.Window({
            title: this.loginText,
            layout: "fit",
            width: 235,
            height: 130,
            plain: true,
            border: false,
            modal: true,
            items: [panel]
        });
        win.show();
    },

    /**
     * api: method[createTools]
     * Create the toolbar configuration for the main view.
     */
    createTools: function() {
        var tools = GeoExplorer.Composer.superclass.createTools.apply(this, arguments);
        
/*
        // unauthorized, show login button
        if (this.authorizedRoles.length === 0) {
            this.loginButton = new Ext.Button({
                iconCls: 'login',
                text: this.loginText,
                handler: this.showLoginDialog,
                scope: this
            });
            tools.push(['->', this.loginButton]);
        } else {
        }

        var aboutButton = new Ext.Button({
            text: this.appInfoText,
            iconCls: "icon-geoexplorer",
            handler: this.displayAppInfo,
            scope: this
        });

        tools.unshift("-");

        tools.unshift(new Ext.Button({
            tooltip: this.exportMapText,
            needsAuthorization: false,
            //disabled: !this.isAuthorized(),
            handler: function() {
                this.saveAndExport(this.showEmbedWindow);
            },
            scope: this,
            iconCls: 'icon-export'
        }));
        */        
        tools.unshift(new Ext.Button({
            tooltip: this.saveMapText,
            needsAuthorization: false,
            //disabled: !this.isAuthorized(),
            handler: function() {
                this.save(this.showUrl);
            },
            scope: this,
            iconCls: "icon-save"
        }));
        tools.unshift(new Ext.Button({
            tooltip: this.loadMap,
            needsAuthorization: false,
            //disabled: !this.isAuthorized(),
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
                                  waitMsg: 'Uploading your context file...',
                                  success: function(fp, o){
                                      win.hide();
                                      var json_str = unescape(o.result.result);
                                      json_str = json_str.replace(/\+/g, ' ');
                                      composer.loadUserConfig(json_str);                                      
                                  },                                    
                                  failure: function(fp, o){
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
        }));
        tools.unshift("-");
        //tools.unshift(aboutButton);
        
        var poweredByGeoSol = new Ext.Button({
            tooltip: 'Powered by GeoSolutions',
            iconCls: "icon-geosol",
            width : 150,
            handler: function(btn){
                window.open('http://geo-solutions.it', '_blank');
            }
        });
            
        tools.unshift(poweredByGeoSol); 
        
        return tools;
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
