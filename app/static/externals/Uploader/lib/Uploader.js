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
 *  class = Uploader
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Uploader(config)
 *
 *    Plugin for upload file
 */   
gxp.plugins.Uploader = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_uploader */
    ptype: "gxp_uploader",
    
    /** api: config[id]
     *  ``String``
     *  
     */
    id: "uploader",
    
    /** api: config[uploadServiceURL]
     *  ``String``
     *  
     */
    uploadServiceURL: null,
    
    
    /** api: config[inputFiles]
     *  ``Array <Object>``
     *  
     */
    inputFiles: null,
    
    
    uploadPanel: null,
    
    // start i18n
    uploadText: "Upload",
    loadMsg: "Please Wait ... ",
    uploadErrorText: "Upload Error",
    // end i18n
    
    
    /** api: config[successCallback]
     *  ``Function``
     *  
     */
    successCallback: null,
	
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Uploader.superclass.constructor.apply(this, arguments);   
    },
    
    
    
    /** api: method[setSuccessCallback]
     */
   setSuccessCallback: function(method){
       this.successCallback= method;
   },

    /** api: method[getPanel]
     *  config submitButton: boolan
     */
    getPanel: function(config) {
       
        var conf=  config || {};
        var me = this;
        var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
        var mHost=pattern.exec(me.uploadServiceURL); 
        var uploadURL= mHost[2] == location.host ? me.uploadServiceURL :
        this.target.proxy + encodeURIComponent(me.uploadServiceURL);
        
        var submitConf={
            url: uploadURL,
            waitMsg: me.loadMsg,
            success: function(form, action){
                if(action.result.content){
                   action.result.content=action.result.content.replace(/\+/g,'%20');
                   var content=decodeURIComponent(action.result.content);  
                   if(me.successCallback)
                      me.successCallback.call(me, content);
                }else{
                    if(me.successCallback)
                       me.successCallback.call(me, action.result);
                }
            },                                    
            failure: function(form, action){
                    Ext.Msg.show({
                        title:me.uploadErrorText,
                        msg: action.result.msg,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                     });
            },
            scope: this
	};
        
        var panelConfig={
           fileUpload: true,
	   autoWidth: true,
	   autoHeight: true,
           id: me.id+"_formPanel",
	   frame: true, 
           bodyStyle: 'padding: 10px 10px 0 10px;',
	   labelWidth: 50,
	   defaults: {
              anchor: '95%',
	      allowBlank: false,
	      msgTarget: 'side'
	   },
           items: []
        };
        
        if(conf.submitButton)
            panelConfig.buttons= [{
                   text: me.uploadText,
		    handler: function(){
			 if(me.uploadPanel.getForm().isValid()){
                                me.uploadPanel.getForm().submit(submitConf); 
			}
		     }
	     }];

        var inputFileConfig= {
                            xtype: 'fileuploadfield',
                            id: 'form_file_'+this.id,
                            buttonOnly: false,
                            emptyText: "File",
                            fieldLabel: "File",
                            name: 'form_file_'+this.id,
                            allowBlank:true,
                            buttonText: '',
                            buttonCfg: {
                                iconCls: 'upload-icon'
                            }
        };   
        
        var ifConfig={};
        for(var i=0; i< me.inputFiles.length; i++){
            Ext.apply(ifConfig,inputFileConfig);
            Ext.apply(ifConfig, me.inputFiles[i]);

            if(me.inputFiles[i].name)
                ifConfig.id='form_file_'+me.inputFiles[i].name;
            
            if(!conf.submitButton){
                ifConfig.listeners= {
                        'fileselected': function(fb, v){
                             if(me.uploadPanel.getForm().isValid()){
                                me.uploadPanel.getForm().submit(submitConf); 
			     }
                        }
                    }
            }
            panelConfig.items.push(ifConfig);
        }
            
        
        
        this.uploadPanel = new Ext.FormPanel(panelConfig);
                
        /*config = Ext.apply(this.uploadPanel, config || {});
        var uP = gxp.plugins.Uploader.superclass.addOutput.call(this, config);
        return uP;*/
        
        return this.uploadPanel;
    },
    
    getInputFileCmpID: function(index){
        
        return 'form_file_'+this.inputFiles[index].name;
    }
});

Ext.preg(gxp.plugins.Uploader.prototype.ptype, gxp.plugins.Uploader);
