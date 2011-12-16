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
    loginText: "Login",
    logoutTitle: "Logout",
    logoutText: "Are you sure to logout?",
    loginErrorText: "Invalid username or password.",
    userFieldText: "User",
    passwordFieldText: "Password", 
    fullScreenText: "Full Screen",
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
            }, {
                ptype: "gxp_addlayers",
                actionTarget: "tree.tbar",
                upload: true
            }, {
                ptype: "gxp_removelayer",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_removeoverlays",
                actionTarget: "tree.tbar"
            }, 
            {
                ptype: "gxp_addgroup",
                actionTarget: "tree.tbar"
            },
            {
                ptype: "gxp_removegroup",
                actionTarget: "tree.tbar"
            }, 
            {
                ptype: "gxp_groupproperties",
                actionTarget: ["tree.tbar"]
            },
            {
                ptype: "gxp_layerproperties",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            },/* {
                ptype: "gxp_styler",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            },*/ {
                ptype: "gxp_zoomtolayerextent",
                actionTarget: {target: "layertree.contextMenu", index: 0}
            }, {
                ptype: "gxp_geonetworksearch",
                actionTarget: ["layertree.contextMenu"]
            },{
                ptype: "gxp_navigation", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 15}
            }, {
                ptype: "gxp_wmsgetfeatureinfo", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 7}
            },
            /*  {
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
            */ {
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
                extent: function(){
                    var bbox = new OpenLayers.Bounds.fromString('-15,8,-7,15');
                    return bbox.transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        new OpenLayers.Projection("EPSG:102113"));
                },
                actionTarget: {target: "paneltbar", index: 26}
            }, {
                ptype: "gxp_fdhgeocoder",
                actionTarget: {target: "paneltbar", index: 30}
            }, {
                ptype: "gxp_saveDefaultContext",
                actionTarget: {target: "paneltbar", index: 40},
				        needsAuthorization: true
            }, {
                ptype: "gxp_print",
                customParams: {outputFilename: 'fdh-print'},
                printService: config.printService,
                legendPanelId: 'legendPanel',
                actionTarget: {target: "paneltbar", index: 4}
            }/*, {
                ptype: "gxp_googleearth",
                actionTarget: {target: "paneltbar", index: 17},
                apiKeys: {
                    "localhost": "ABQIAAAAeDjUod8ItM9dBg5_lz0esxTnme5EwnLVtEDGnh-lFVzRJhbdQhQBX5VH8Rb3adNACjSR5kaCLQuBmw",
                    "geo-solutions.it": "ABQIAAAA5SREeKhHQ5CKTL33pm0kPRT-MyVOyNDghWyrQfAYOWRyYsiL2BQYy-OMEt_BxLLciTgd-PQzwthG8w"
                }
            }*/
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
            url: "http://demo1.geo-solutions.it/exist/rest/mapadmin/login.xml",
            frame: true,
            labelWidth: 80,
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
			var form = panel.getForm();
			var fields = form.getValues();
			var pass = fields.password;
			var user = fields.username;
			
			Ext.Ajax.request({
				method: 'GET',
				url: proxy + "http://"+ user + ":"+ pass + "@demo1.geo-solutions.it/exist/rest/mapadmin/login.xml",
				//proxy: '',
				success: function(request) {
					this.authorizedRoles = ["ROLE_ADMINISTRATOR"];
                    Ext.getCmp('paneltbar').items.each(function(tool) {
                        if (tool.needsAuthorization === true) {
                            tool.enable();
                        }
                    });
                    this.loginButton.hide();
                    this.logoutButton.show();
                    win.close();
				},
				failure: function(request) {
					form.markInvalid({
                        "username": this.loginErrorText,
                        "password": this.loginErrorText
                    });										
				},
				scope: this
			});	
		
			/*
            //panel.buttons[0].disable();
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
                    //panel.buttons[0].enable();
                    form.markInvalid({
                        "username": this.loginErrorText,
                        "password": this.loginErrorText
                    });
                },
                scope: this
            });
		*/
        }
		
                
        var win = new Ext.Window({
            title: this.loginText,
            layout: "fit",
            width: 275,
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
        
        
        // unauthorized, show login button
        //if (this.authorizedRoles.length === 0) {
        this.loginButton = new Ext.Button({
            iconCls: 'login',
            text: this.loginText,
            handler: this.showLoginDialog,
            scope: this
        });
            //tools.push(['->', this.loginButton]);
			  tools.push([this.loginButton]);
        //} else {
        //}
        
        this.logoutButton = new Ext.Button({
            iconCls: 'logout',
            text: this.logoutTitle,
            hidden: true,
            handler: function(){
                var logoutFunction = function(buttonId, text,opt){
                    if(buttonId === 'ok'){                        
                        window.location.reload( false );
                    }else if(buttonId === 'no'){
                        window.location.reload( false );
                    }else if(buttonId === 'yes'){
                        var xmlContext;
                        var handleSave = function(){
                            var xmlContext = this.xmlContext;            
                            var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
                            mask.show();
                                
                            Ext.Ajax.request({
                               url: proxy + "http://admin:1geoadmin2@demo1.geo-solutions.it/exist/rest/mapadmin/context.xml",
                               method: 'PUT',
                               params: xmlContext,
                               scope: this,
                               success: function(response, opts){
                                  mask.hide();
                                  window.location.reload( false );
                               },
                               failure:  function(response, opts){
                                  mask.hide();
                                  Ext.Msg.show({
                                     title: this.contextSaveFailString,
                                     msg: response.statusText,
                                     buttons: Ext.Msg.OK,
                                     icon: Ext.MessageBox.ERROR
                                  });
                               }
                            });		
                        };
                        
                        var configStr = Ext.util.JSON.encode(app.getState());  
                        var url = app.xmlJsonTranslateService + "HTTPWebGISSave";		
                        
                        OpenLayers.Request.issue({
                            method: 'POST',
                            url: url,
                            data: configStr,
                            callback: function(request) {
                                if (request.status == 200) {
                                    this.xmlContext = request.responseText;
                                    handleSave.call(this);
                                } else {
                                    throw request.responseText;
                                }						
                            },
                            scope: this
                        });
                    }
                };
                                
                if(modified || app.modified){
                    Ext.Msg.show({
                       title: this.logoutTitle,
                       msg: "Save changes before logout?",
                       buttons: Ext.Msg.YESNOCANCEL,
                       fn: logoutFunction,
                       icon: Ext.MessageBox.QUESTION,
                       scope: this
                    });
                }else{
                    Ext.Msg.show({
                       title: this.logoutTitle,
                       msg: this.logoutText,
                       buttons: Ext.Msg.OKCANCEL,
                       fn: logoutFunction,
                       icon: Ext.MessageBox.QUESTION,
                       scope: this
                    });
                }
            },
            scope: this
        });
        
        tools.push([this.logoutButton]);
		/*
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
                
        var fullScreen = new Ext.Button({
            text: this.fullScreenText,
            iconCls: "icon-fullscreen",
            enableToggle: true,
            handler: function(button, evt){
                if(button.pressed){
                    Ext.getCmp('fdhHeader').collapse();
                    //Ext.getCmp('fdhFooter').collapse();
                    Ext.getCmp('tree').findParentByType('panel').collapse();
                } else {
                    Ext.getCmp('fdhHeader').expand();
                    //Ext.getCmp('fdhFooter').expand();
                    Ext.getCmp('tree').findParentByType('panel').expand();
                }
            }
        });            
                        
        tools.unshift(fullScreen);    
              
        //tools.unshift(aboutButton);
        //tools.unshift(poweredByGeoSol);
        
        tools.push(new Ext.Button({
            tooltip: this.saveMapText,
            needsAuthorization: false,
            //disabled: !this.isAuthorized(),
            handler: function() {
                this.save(this.showUrl);
            },
            scope: this,
            iconCls: "icon-save"
        }));        
        
        tools.push(new Ext.Button({
            tooltip: this.loadMapText,
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
                                  //url: app.xmlJsonTranslateService + 'HTTPWebGISFileUpload',
                                  url: proxy + app.xmlJsonTranslateService + 'HTTPWebGISFileUpload',
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
        }));
        
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
