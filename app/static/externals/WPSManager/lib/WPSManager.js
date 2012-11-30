/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires 
 */

/**
 * The WPS Manager Plugin
 */


/** api: (define)
 *  module = gxp.plugins
 *  class = WPSExecuteManager
 */

/** api: (extends)
 *  
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WPSManager(config)
 *
 *    Plugin for send WPS 
 */   
/** api: example
 *  
 *  TODO
 *
 */
gxp.plugins.WPSManager =  Ext.extend(gxp.plugins.Tool,{
    
    /** api: ptype = gxp_wpsmanager */
    ptype: "gxp_wpsmanager",
    
    /** private: property[instancePrefix]
     *  ``String``
     */
    instancePrefix: "wpsExecute",
    
    /** api: config[id] 
     *  ``String`` Execute request identifier
     */
    id: null,

    /** private: property[instances]
     *  ``Object``
     */
    instances: null,
    
    /** private: property[wpsClient]
     *  ``{<OpenLayers.WPSClient>}``
     */
    wpsClient: null,
    
    
    /** private: property[geoStoreClient]
     *  ``{<gxp.plugins.GeoStoreClient>}``
     */
    geoStoreClient: null,
    

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WPSManager.superclass.constructor.apply(this, arguments);    
        
        this.wpsClient = new OpenLayers.WPSClient({
            servers: {
                opengeo: config.url
            }
        });
        
        this.geoStoreClient = new gxp.plugins.GeoStoreClient({
			url: config.geostoreUrl,
			user: config.geostoreUser,
			password: config.geostorePassword,
			proxy: config.geostoreProxy,
			listeners: {
				"geostorefailure": function(tool, msg){
					Ext.Msg.show({
						title: "Geostore Exception",
						msg: msg,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			}
		});
    },
    
    
    init: function(target){
       gxp.plugins.WPSManager.superclass.init.apply(this, arguments); 
       OpenLayers.ProxyHost = this.target.proxy;

       var geoStore= this.geoStoreClient;
      
        var wpsCategory= {
            type:"category", 
            name: this.id
        };
        
      
        geoStore.existsEntity(wpsCategory,
            function(exists){
                if(! exists){
                    geoStore.createEntity(wpsCategory, function(categoryID){
                        if( !categoryID){
                            geoStore.fireEvent("geostorefailure", this, "Geostore: create WPS category error");
                        }   
                    });
                } 
        });    
       
    },
    
    /** api: method[getExecuteInstances]
     *
     *  Get All WPS Execute Process instnaces
     *  *  :arg process: ``String`` Optional process name for filter the instnances
     *  :arg callback: ``Function`` Optional callback to call when the
     *      instances are retrieved. 
     *  :arg scope: ``Object`` Optional scope for the callback function.
     */
    getExecuteInstances: function(process, callback) {
        var me= this;
        if(process == null){
            this.geoStoreClient.getCategoryResources(this.id, 
                function(instances){
                    me.updateInstances(null,instances, callback);
                }/*, function(){
                    this.fireEvent("geoStoreFailure", this);
                }*/);
        }else{
            this.geoStoreClient.getLikeName({ 
                type: "resource", 
                regName: this.getPrefixInstanceName(process)+"*"
            }, 
            function(instances){
                me.updateInstances(process,instances, callback);
            }/*, function(){
                this.fireEvent("geoStoreFailure", this);
            }*/);
        } 
    },
    
    
    
    /** api: method[getExecuteInstance]
     *
     *  Get WPS Execute Process instnace from name
     
     *  *  :arg instanceName: ``String`` Optional process name for filter the instnances
     *  *  :arg process: ``String`` Optional process name for filter the instnances

     *  :arg callback: ``Function`` Optional callback to call when the
     *      instance is retrieved. 
     */
    getExecuteInstance: function(instanceName, callback) {
        var me= this;
   
        me.geoStoreClient.getLikeName({ 
            type: "resource",
            name: instanceName
        }, 
        function(instances){
            var statusInfo= JSON.parse(instances[0].description);
                 
            if(statusInfo.status == "Process Started" || 
                statusInfo.status == "Process Accepted" ||
                statusInfo.status == "Process Paused"){ 
                  
                var updateCallback= function(instanceID){
                    me.getEntityByID(instanceID, "resource", function(resource){
                        
                        var instance= resource;
                        instance.store= JSON.parse(resource.store);
                        instance.description= JSON.parse(resource.description);
                        callback.call(me, instance);
                    });
                      
                }      
                this.updateInstance(instances[0].name, null, null,
                statusInfo.statusLocation, updateCallback);  
            }else
                me.getEntityByID(instances[0].id, "resource", function(resource){  
                    var instance= resource;
                    instance.store= JSON.parse(resource.store);
                    instance.description= JSON.parse(resource.description);
                    callback.call(me, instance);
                });
        });
       
    },
    
    
    /** private: method[updateInstances]
     */
    updateInstances: function(process,instances, callback){
        var pr=process;
        var me=this;

        var updateCallback= function(currentInstanceIndex, statusUpdated){
            statusUpdated[currentInstanceIndex]= true;
            var check= true;
                
            for(var i=0; i<statusUpdated.length; i++)
                check = check && statusUpdated[i];
            
            if(check){
                
                if(pr== null){
                    me.geoStoreClient.getCategoryResources(me.id, 
                        callback/*, function(){
                            me.fireEvent("geoStoreFailure", me);
                        }*/);
                }else{
                    me.geoStoreClient.getLikeName({ 
                        type: "resource", 
                        regName: me.getPrefixInstanceName(process)+"*"
                    }, 
                    callback/*, function(){
                        me.fireEvent("geoStoreFailure", me);
                    }*/);
                }
                
            }
        };
        delete statusUpdated;
        var statusUpdated=new Array();
        
        for(var i=0; i<instances.length; i++)
            statusUpdated[i]=false;
       
        for( i=0; i<instances.length; i++){
            var statusInfo= JSON.parse(instances[i].description);
            if(statusInfo.status == "Process Started" || 
                statusInfo.status == "Process Accepted" ||
                statusInfo.status == "Process Paused"){
                this.updateInstance(instances[i].name, statusUpdated, i,statusInfo.statusLocation, updateCallback);  
            }else
                statusUpdated[i]=true; 
        }
    },
    
    
    /** private: method[updateInstances]
     */
    updateInstance: function(instanceName, statusUpdated, instanceIndex, statusLocation, callback){
        var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
        var mHost; 
        var url;
        var me= this;
        
        mHost=pattern.exec(statusLocation); 
        url = mHost[2] == location.host ? statusLocation :
        OpenLayers.ProxyHost + encodeURIComponent(statusLocation);
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            success: function(response, opts){  
                var responseObj=new OpenLayers.Format.WPSExecute().read(response.responseText);
                me.responseManager(responseObj,instanceName, callback, statusUpdated, instanceIndex);
            },
            failure:  function(response, opts){
                
            }
        });
     
    },
    

    /** private: method[getPrefixInstanceName]
     */
    getPrefixInstanceName: function(processName){
        return this.instancePrefix+"_"+this.id+"_"+processName;
    },
    
    
    /** private: method[getInstanceName]
     */
    getInstanceName: function(processName){
        return this.getPrefixInstanceName(processName)+"_"+new Date().getTime();
    },
    
    

    /** api: method[execute]
     *
     *  Send Execute Process request
     */
    execute: function(processName, executeRequest) {
      
        var process = this.wpsClient.getProcess('opengeo', processName);    
        var instanceName=null;
        var executeOptions;
      
        if(executeRequest instanceof Object){

            executeOptions= executeRequest;
        }else{

            executeOptions= new OpenLayers.Format.WPSExecuteRequest().read(executeRequest).processInput;
        
        }   
        instanceName=this.getInstanceName(processName);
        executeOptions.scope= this;
        executeOptions.success= this.responseManager;
        executeOptions.processInstance=instanceName;
      
        process.execute(executeOptions);    
        
        return instanceName;
    },
    
    
    
    /** private: method[responseManager]
     */
    responseManager: function(executeProcessResponse, processInstance, 
        callback, instancesStatusUpdated, instanceIndex) {
        var instanceInfo;
        var geoStore;
        var me= this;
        var stautsInfo;
        
        var resourceInstance={
            type: "resource",
            name: processInstance,
            metadata: "",
            category: me.id,
            store: JSON.stringify(executeResponse)
        };
        
        if(executeProcessResponse instanceof OpenLayers.Format.WPSExecute){
            resourceInstance.store= JSON.stringify(executeProcessResponse);

            var executeResponse= executeProcessResponse.executeResponse;
            if(executeResponse.exceptionReport){
                stautsInfo={
                    status: "Process Failed",
                    raw: false
                };
            }else{
                if(executeResponse.processSucceeded){
                    stautsInfo={
                        status: "Process Succeeded",
                        raw: false
                    };
                }else{
                    stautsInfo={
                        status: executeResponse.status.name,
                        percentCompleted: executeResponse.status.percentCompleted,
                        statusLocation: executeResponse.statusLocation,
                        creationTime: executeResponse.status.creationTime,
                        raw: false
                    };
                }
	
            }
        }else{
            resourceInstance.store= executeProcessResponse;  
            stautsInfo={
                status: "Process Succeeded",
                raw: true
            };
            
        } 
        resourceInstance.description= JSON.stringify(stautsInfo);
        
        geoStore=this.geoStoreClient;
        
        geoStore.getEntityByName(resourceInstance.name, resourceInstance.type, function(res){
            if(res != null){
                resourceInstance.id=res.id;
                geoStore.updateEntity(resourceInstance, function(entityID){
                    if(! entityID){
                        geoStore.fireEvent("geostorefailure", this, "Geostore: update WPS Instance Error"); 
                    }else{
                        if(callback)
                            callback.call(this,instanceIndex, instancesStatusUpdated);
                    }
                }/*, function(){
                    me.fireEvent("geostorefailure", this); 
                }*/);
                
            }else{
                geoStore.createEntity(resourceInstance, function(entityID){
                    if(! entityID){
                        me.fireEvent("geostorefailure", this, "Geostore: creation WPS Instance Error"); 
                    }else{
                        if(callback)
                            callback.call(this,instanceIndex, instancesStatusUpdated);
                    }
                }/*, function(){
                    me.fireEvent("geostorefailure", this); 
                }*/);   
            }
       
        }/*, function(){
            me.fireEvent("geostorefailure", this); 
        }*/); 
      
        return instanceInfo;
    }
    
});

Ext.preg(gxp.plugins.WPSManager.prototype.ptype, gxp.plugins.WPSManager);


