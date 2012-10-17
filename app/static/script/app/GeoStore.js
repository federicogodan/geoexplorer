/**
 *  requires ExtJs 3.4
 *
 *  This module encapsulates the interaction logic with the GeoStore
 *  The idea is to abstract away from how the interaction is implemented (i.e. REST/json or xml messages)
 *  It is not intended to duplicate Ext.data.JSonStore, but to separate concerns
 *
 *  'extend' mechanism use the pseudoclassial pattern 
 */

(function(){
	
	
	// save a reference for this function scope/context
	var root = this;
	// expose GeoStore to the external world
	var GeoStore = root.GeoStore = {};
	// espose Google Services
	var Google = root.Google = {};
	// version for the API client
	GeoStore.VERSION = '0.2';
	
	
	/**
	 * Class: Uri
	 * this class represents an uri http://host:port/path/id
	 *
	 */
	var Uri = root.Uri = function(options){
		this.SEPARATOR = '/';
		this.params_ = new Object();
		this.uri_ = options.url;
		this.isLocal_ = function(uri){
			var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
			var mHost=pattern.exec( uri );
			return mHost[2] == location.host;
		};
	};

	/** 
	 * Function: appendPath
	 * append a path to the current URI
	 *
	 * Parameters:
	 * path - {String}
	 * Return:
	 * {Uri}
	 */
	Uri.prototype.appendPath = function(path){
		this.uri_ = this.uri_ + this.SEPARATOR + path;
		return this;
	};
	/** 
	 * Function: setBaseUrl
	 * set the base url for this uri
	 * a base url is something of the form http://host:port
	 *
	 * Parameters:
	 * baseUrl - {String}
	 * Return:
	 * {Uri}
	 */
	Uri.prototype.setBaseUrl = function(baseUrl){
		this.uri_ = baseUrl + this.SEPARATOR + this.uri_;
		return this;
	};
	
	/** 
	 * Function: setProxy
	 * set a (local) proxy which processes external calls
	 *
	 * Parameters:
	 * proxy - {String} the proxy url
	 * Return:
	 * {Uri}
	 */	
	Uri.prototype.setProxy = function(proxy){
		this.proxy_ = proxy;
		return this;
	};
	
	/** 
	 * Function: appendId
	 * add an id to the current uri
	 *
	 * Parameters:
	 * id - {String or Number}
	 * Return:
	 * {Uri}
	 */
	Uri.prototype.appendId = function(id){
		return this.appendPath(id);
	};
	/** 
	 * Function: addParam
	 * add params to the uri
	 *
	 * Parameters:
	 * name - {String} the name of the param
	 * value - {String or Boolean or Number} the value of the param
	 * Return:
	 * {Uri}
	 */
	Uri.prototype.addParam = function(name, value){
		this.params_[name] = value;
	};
	/** 
	 * Function: toString
	 * get a string representation for the uri
	 *
	 * Parameters:
	 * Return:
	 * {String}
	 */
	Uri.prototype.toString = function(){
		
		
		// console.log( this.uri_ );
		if ( !this.isLocal_(this.uri_) && ! this.proxy_ ){
			console.error('You must specify a local proxy to call an external url: ' + this.uri_);
			return null;
		} else {
			var result = this.uri_;
			result += '?';
			for (key in this.params_){
				result += key + '=' + this.params_[key] + '&';
			}			
			// console.log(this.isLocal_(this.uri_) ? result : this.proxy_ + encodeURIComponent( result ));
			return this.isLocal_(this.uri_) ? result : this.proxy_ + encodeURIComponent( result );
		}
		
	};
	

	/**
	 * Class: GeoStore.ContentProvider
	 * this class abstract away GeoStore APIs
	 *
	 */
	var ContentProvider = GeoStore.ContentProvider = function(options){
		this.authorization_ = options.authorization ;
		this.baseUrl_ = options.url;
		this.proxy_ = options.proxy;
		this.resourceNamePrefix_ = '/';
		this.acceptTypes_ = 'application/json, text/plain, text/xml';
		this.onSuccess_ = Ext.emptyFn;
		this.onFailure_ = Ext.emptyFn;
		this.initialize.apply(this, arguments);
	};
	
	// prototype definitions
	
	/** 
	 * Function: initialize
	 * initialize this class
	 *
	 * Parameters:
	 * Return:
	 */
	ContentProvider.prototype.initialize = function(){
		console.log( 'created GeoStore.ContentProvider');
		console.log( 'authorization: ' + this.authorization_ );
		console.log( 'base url: ' + this.baseUrl_);
	};
	
	/** 
	 * Function: setToken
	 * 
	 *
	 * Parameters:
	 * Return:
	 */	
	ContentProvider.prototype.setToken = function( token ){
		this.authorization_ = token ;
	};	
	
	ContentProvider.prototype.invalidateToken = function(  ){
		this.authorization_ = null ;
	};
	
	/** 
	 * Function: beforeFind
	 * this method is called before find methods
	 *
	 * Parameters:
	 * data - {Any}
	 * Return:
	 * {Any}
	 */
	ContentProvider.prototype.beforeFind = function(data){
		// do nothing
		return data;
	};
	
	/** 
	 * Function: afterFind
	 * this method is called after find methods
	 *
	 * Parameters:
	 * data - {Any} the response read
	 * Return:
	 * {Any}
	 */
	ContentProvider.prototype.afterFind = function(data){
		// do nothing
		return data;
	};
	
	/** 
	 * Function: beforeSave
	 * this method is called before save or update methods
	 *
	 * Parameters:
	 * data - {Any} the item to be saved or updated
	 * Return:
	 * {Any}
	 */
	ContentProvider.prototype.beforeSave = function(data){
		// do nothing
		return data;
	};
	
	/** 
	 * Function: afterSave
	 * this method is called after save or update methods
	 *
	 * Parameters:
	 * data - {Any} the response obtained after saving
	 * Return:
	 * {Any}
	 */
	ContentProvider.prototype.afterSave = function(data){
		// do nothing
		return data;
	};
	
	/** 
	 * Function: success
	 * set a callback method for success
	 *
	 * Parameters:
	 * callback - {Function}
	 * Return:
	 * {ContentProvider}
	 */
	ContentProvider.prototype.success = function( callback ){
		this.onSuccess_ = callback;
		return this;
	};
	
	/** 
	 * Function: failure
	 * set a callback method for failure
	 *
	 * Parameters:
	 * callback - {Function}
	 * Return:
	 * {ContentProvider}
	 */
	ContentProvider.prototype.failure = function( callback ){
		this.onFailure_ = callback;
		return this;
	};
	
	/** 
	 * Function: findByPk
	 * find an element by its primary key in async mode
	 *
	 * Parameters:
	 * pk - {String} primary key
	 * callback - {Function} callback
	 * obj - {Object} 
	 * Return:
	 * 
	 */
	ContentProvider.prototype.findByPk = function(pk, obj){
		this.beforeFind();
		
		var params_opt = obj.params;
		var successHandler = obj.onSuccess || this.onSuccess_;
		var failureHandler = obj.onFailure || this.onFailure_;
		
		// build the uri to invoke
		var uri = new Uri({'url':this.baseUrl_});
		uri.setProxy( this.proxy_ );
		uri.appendPath( this.readPath_ ).appendId( pk );
		if (params_opt && params_opt){
			for( name in params_opt ){
				uri.addParam( name, params_opt[name] );
			}
		}
	
		var self = this;
		var Request = Ext.Ajax.request({
	       url: uri.toString(), 
	       method: 'GET',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       scope: this,
	       success: function(response, opts){
				var data = self.afterFind( Ext.util.JSON.decode(response.responseText) ); 
				successHandler.call(this, data);
				// callback(data);
	       },
	       failure: function(response, opts){
				failureHandler.call(this, data);
				// this.onFailure_(response);
	       }
	    });
	};
	

	/** 
	 * Function: find
	 * find all elements in async mode
	 *
	 *  Available params:
	 *     full: Boolean
	 *     page: Number
	 *     entries: Number
	 *
	 * Parameters:
	 * callback - {Function}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.find = function(obj){
		this.beforeFind();

		var params_opt = obj.params;
		var successHandler = obj.onSuccess || this.onSuccess_;
		var failureHandler = obj.onFailure || this.onFailure_;
		
		// build the uri to invoke
		var uri = new Uri({'url':this.baseUrl_});
		uri.appendPath( this.retrievePath_ ).setProxy( this.proxy_ );
		if (params_opt){
			for( name in params_opt ){
				uri.addParam( name, params_opt[name] );
			}
		}
		
		// build a request
		var self = this;
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'GET',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       scope: this,
	       success: function(response, opts){
				var data = self.afterFind( Ext.util.JSON.decode(response.responseText) );
				successHandler.call(this, data);
				// callback(data);
	       },
	       failure:  function(response, opts){
				console.error( response.responseText );
	       		// var json = Ext.util.JSON.decode(response.responseText);
				failureHandler.call(this, response.responseText);
				// console.log(Ext.util.JSON.decode(json));
	       }
	    });		
	};
	
	/** 
	 * Function: update
	 * update an element identified by its pk
	 *
	 * Parameters:
	 * pk - {String or Number} primaty key
	 * item - {Object} object to be created
	 * callback - {Function}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.update = function(pk, item, obj){
		var data = this.beforeSave(item);
		
		var params_opt = obj.params;
		var successHandler = obj.onSuccess || this.onSuccess_;
		var failureHandler = obj.onFailure || this.onFailure_;
		
		var uri = new Uri({'url':this.baseUrl_});
		uri.setProxy( this.proxy_ );
		uri.appendPath( this.updatePath_ ).appendId( pk );
		// console.log(data);
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'PUT',
	       headers:{
	          'Content-Type' : 'text/xml',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       scope: this,
		   params: data,
	       success: function(response, opts){
				successHandler.call(this, response);
				// callback( response );
	       },
	       failure:  function(response, opts){
				failureHandler.call(this, response);
				// this.onFailure_(response);
	       }
	    });		
	};	
	
	/** 
	 * Function: delete
	 * delete an element by its primary key in async mode
	 *
	 * Parameters:
	 * pk - {String or Number} primary key
	 * callback - {Function}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.deleteByPk = function(pk, obj){
		
		var params_opt = obj.params;
		var successHandler = obj.onSuccess || this.onSuccess_;
		var failureHandler = obj.onFailure || this.onFailure_;
		
		var uri = new Uri({'url':this.baseUrl_});
		uri.setProxy( this.proxy_ );
		uri.appendPath( this.deletePath_ ).appendId( pk );
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'DELETE',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       scope: this,
	       success: function(response, opts){
				// var json = Ext.util.JSON.decode(response.responseText);
				// callback( response );
				successHandler.call(this, response);
	       },
	       failure:  function(response, opts){
	       		// var json = Ext.util.JSON.decode(response.responseText);
				console.error( response );
				failureHandler.call(this, response);
	       }
	    });		
	};
	
	/** 
	 * Function: create
	 * create a new element in async mode
	 *
	 * Parameters:
	 * item - {Object} values to be updated
	 * callbacl - {Function}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.create = function(item, obj){
		
		var params_opt = obj.params;
		var successHandler = obj.onSuccess || this.onSuccess_;
		var failureHandler = obj.onFailure || this.onFailure_;
		
		 var uri = new Uri({'url':this.baseUrl_});
		 uri.appendPath( this.createPath_ ).setProxy( this.proxy_ );
		 var data = this.beforeSave( item );
		// console.log(data);
		// build the Ajax request
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'POST',
	       headers:{
	          'Content-Type' : 'text/xml',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       params: data,
	       scope: this,
	       success: function(response, opts){
				// callback(response.responseText);
				successHandler.call(this, response.responseText);
	       },
	       failure:  function(response, opts){
	       		console.log(response);
				failureHandler.call(this, response);
	       }
	    });		
	};
	
	 // implements inheritance
	 var extend = function (proto) {
	    var child = inherits(this, proto);
	    child.extend = this.extend;
	    return child;
	  };

	 // allow a ContentProvider to extend itself
	 ContentProvider.extend = extend;	
	
	// utility functions
	// it implements inheritance following prototype chaining
	var inherits = function(parent, proto) {
	    var child = function(){ parent.apply(this, arguments); };
	    // assign to child all the properties of the parent
	    for (var prop in parent){
			child[prop] = parent[prop];
		}
		var F = function(){};
		F.prototype = parent.prototype;
		child.prototype = new F;
		if (proto){
			for (var prop in proto){
				child.prototype[prop] = proto[prop];
			}	
		}
		return child;
	};
	
   // init some content providers used in the application


 /**
  * Class: Datastore 
  * {private}
  *
  * CRUD methods for maps in Datastore
  * Inherits from:
  *  - <GeoStore.ContentProvider>
  *
  */
  var Datastore = ContentProvider.extend({
	initialize: function(){
		this.resourceNamePrefix_ = '';
		this.updatePath_ = 'data';
	},
	update: function(pk, item, obj){
		var data = this.beforeSave(item);

		var params_opt = obj.params;
		var successHandler = obj.onSuccess || this.onSuccess_;
		var failureHandler = obj.onFailure || this.onFailure_;

		var uri = new Uri({'url':this.baseUrl_});
		uri.setProxy( this.proxy_ );
		uri.appendPath( this.updatePath_ ).appendId( pk );
		// console.log( data );
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'PUT',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       scope: this,
		   params: data,
	       success: function(response, opts){
				// callback( response );
				successHandler.call(this, response);
	       },
	       failure:  function(response, opts){
				// this.onFailure_(response);
				console.error(response);
				failureHandler.call(this, response);
	       }
	    });		
	}
   });

/**
 * Class: GeoStore.Maps
 *
 * CRUD methods for maps in GeoStore
 * Inherits from:
 *  - <GeoStore.ContentProvider>
 *
 */
   var Maps = GeoStore.Maps = ContentProvider.extend({
	initialize: function(){
	
		this.createPath_ = 'resources';
		this.readPath_ = 'resources/resource';
		this.retrievePath_ = 'resources';
		this.deletePath_ = 'resources/resource';
		this.updatePath_ = 'resources/resource';
		
	
		this.resourceNamePrefix_ = 'resources/resource';
		this.searchPath_ = 'extjs/search/*';
		this.datastorePath_ = 'data';
		this.timeout_ = 10000;
		this.headers_ = {'Accept': 'application/json'};
	},

	/** 
	 * Function: updateData
	 * 
	 *  In the current implementation of GeoStore
	 *  data and metadata must be updated in two distinct steps
	 *  this function updates data (i.e. blob field) of a configuration with id=pk 
	 *
	 *  Possible improvement: make this fact transparent to users
	 *
	 * Parameters:
	 * Return:
	 * {Ext.data.Store}
	 */	
	updateData:function(pk, data, obj){
		var params_opt = obj.params;
		var successHandler = obj.onSuccess || this.onSuccess_;
		var failureHandler = obj.onFailure || this.onFailure_;
		
		var datastore = new Datastore({
			proxy: this.proxy_,
			url: this.baseUrl_
		});
		datastore.setToken( this.authorization_ );
		datastore.update( pk, data, {
			params: params_opt,
			onSuccess: successHandler,
			onFailure: failureHandler
		});
	},
	
	/** 
	 * Function: getStore
	 * returns an Ext.data.Store 
	 *
	 * Parameters:
	 * Return:
	 * {Ext.data.Store}
	 */
	getStore:function(){
		
		// if not present, create an instance of Ext.data.Store for this GeoStore.Maps
		if ( ! this.store_ ){
			var uri = new Uri({'url':this.baseUrl_});
			uri.setProxy( this.proxy_);
			uri.appendPath( this.searchPath_ );
			this.store_ = new Ext.data.JsonStore({
	            autoDestroy: true,
				scope: this,
	            root: 'results',
	            totalProperty: 'totalCount',
	            successProperty: 'success',
	            idProperty: 'id',
	            remoteSort: false,
	            fields: [{
	                        name: "id",
	                        type: "int"
	                    },{
	                        name: "name",
	                        type: "string"
	                    },{
	                        name: "owner",
	                        type: "string"
	                    },{
	                        name: "description",
	                        type: "string"
	                    },{
	                        name: "creation",
	                        type: "date",
	                        dateFormat: 'c'
	                    },{
	                        name: "lastUpdate",
	                        type: "date",
	                        dateFormat: 'c'
	                    },{
	                        name: "canEdit",
	                        type: "boolean"
	                    },{
	                        name: "canDelete",
	                        type: "boolean"
	                    }
	            ],
	            proxy: new Ext.data.HttpProxy({
	                url: uri.toString(),
	                restful: true,
	                method : 'GET',
	                disableCaching: true,
	                timeout: this.timeout_,
	                failure: function (result) {
	                   console.error(result);
	                },
	                defaultHeaders: this.headers_
	            }),
				listeners:{
					 // hack: when we use a proxy, we need to set params for geostore by hand
					 // in order to avoid the issue described here 
					 // https://github.com/geosolutions-it/mapstore/issues/31
				     beforeload:function(store, options){
						var params = options.params;
						var uri = new Uri({'url':this.baseUrl_});
						uri.setProxy( this.proxy_);
						uri.appendPath( this.searchPath_ );
						uri.addParam('start', params.start );
						uri.addParam('limit', params.limit );
						// console.log( uri.toString() );

				        store.proxy.setUrl( uri.toString() );
				     },
				     scope: this
				},
	            sortInfo: { field: "creation", direction: "DESC" }
	        });			
		}

		return this.store_;
	},
	
	beforeSave: function(data){
		// wrap new map within an xml envelop
		var xml = '<Resource>';
		if (data.owner) 
			xml += 
			'<Attributes>' +
				'<attribute>' +
					'<name>owner</name>' +
					'<type>STRING</type>' +
					'<value>' + data.owner + '</value>' +
				'</attribute>' +
			'</Attributes>';
		xml +=
			'<description>' + data.description + '</description>' +
			'<metadata></metadata>' +
			'<name>' + data.name + '</name>';
		if (data.blob)
		  xml+=
			'<category>' +
				'<name>MAP</name>' +
			'</category>' +
			'<store>' +
				'<data><![CDATA[ ' + data.blob + ' ]]></data>' +
			'</store>';
			
		xml += '</Resource>';
		// console.log(xml);
		return xml;
	},
	afterFind: function(json){
		
		// console.log(json);
		
		if ( json.Resource){
			var data = new Object;
			data.owner = json.Resource.Attributes.attribute.value;
			data.description = json.Resource.description;
			data.name = json.Resource.name;
			data.blob = json.Resource.data.data;
			data.id = json.Resource.id;
			data.creation = json.Resource.creation;		
			return data;	
		} else if ( json.ResourceList ||  json.ResourceList===''){
			var array = new Array;
			if ( json.ResourceList.Resource ){
				if ( json.ResourceList.Resource.length ){
					for ( var i=0; i< json.ResourceList.Resource.length ; i++){
						var obj = json.ResourceList.Resource[i];
						array.push( obj );
					}	
				} else {
					array.push( json.ResourceList.Resource );
				}
			}
			return array;	
		} else {
			this.onFailure_('cannot parse response');
		}

	}
   } );

 

   /**
    * Class: GeoStore.Filestore
    *
    * this class allows to upload and download files
    * using a backend servlet
    *
    */
   var Filestore = GeoStore.Filestore = function(options){
		this.authorization_ = options.authorization ;
		this.baseUrl_ = options.url;
		this.uploadUrl_ = this.baseUrl_ + 'FileUploader';
		this.proxy_ = options.proxy;
		this.verbose_ = options.verbose || false;
		this.acceptTypes_ = 'application/json, text/plain, text/xml';
		this.onSuccess_ = Ext.emptyFn;
		this.onFailure_ = Ext.emptyFn;
		this.initialize.apply(this, arguments);
	};
	
	/** 
	 * Function: initialize
	 * initialize this class
	 *
	 * Parameters:
	 * Return:
	 */
	Filestore.prototype.initialize = function(){
		if ( this.verbose_ ){
			console.log( 'created GeoStore.Filestore');
			console.log( 'authorization: ' + this.authorization_ );
			console.log( 'base url: ' + this.baseUrl_);			
		}
	};
	
	
	/** 
	 * Function: uploadFromForm
	 * upload a file from a ExtJs form
	 *
	 * Parameters:
	 * Return:
	 */	
	Filestore.prototype.uploadFromForm = function( form, params ){
		var uri = new Uri({'url':this.uploadUrl_});
		uri.setProxy( this.proxy_ );
		form.submit({
			url: uri.toString(),
			submitEmptyText: false,
			waitMsg: params.waitMsg,
			waitMsgTarget: params.waitMsgTarget,
			reset: true,
			failure: function(form, action) {
				params.onFailure.call(this, action);
			},
			success: function(form, action) {
				var response = null;
				try {
					response = Ext.util.JSON.decode(action.response.responseText);
				} catch (e) {
					var msg = 'Cannot parse JSON response: ' + e;
					console.error( msg  );
					params.onFailure.call(this, msg);
				}
				if ( response ){
					params.onSuccess.call(this, response);
				}
			}

		});
	};

	/** 
	 * Function: getBaseDir
	 * get the directory where files are stored
	 *
	 * TODO at the moment it is not possible to change the directory dynamically
	 * for this reason the name of the directory is hardcoded
	 * in the future should be possible to have different dirs for different (kinds of) files 
	 * 
	 * Parameters:
	 * Return:
	 */	
	 Filestore.prototype.getBaseDir = function(){
		return this.baseUrl_ + 'temp/';
	 };

}).call(this);


