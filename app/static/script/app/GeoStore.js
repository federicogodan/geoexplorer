/**
 *  requires ExtJs 3.4
 *
 *  This module encapsulates the interaction logic with the GeoStore
 *  The idea is to abstract away from how the interaction is implemented (i.e. REST/json or xml messages)
 *  It is not intended to duplicate Ext.JSonStore, but to separate concerns
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
	 * params_opt - {Array} optional array of the item of type {name:..., value:,...}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.findByPk = function(pk, callback, params_opt){
		this.beforeFind();
		
		// build the uri to invoke
		var uri = new Uri({'url':this.baseUrl_});
		uri.setProxy( this.proxy_ );
		uri.appendPath( this.resourceNamePrefix_ ).appendId( pk );
		if (params_opt){
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
				callback(data);
	       },
	       failure: function(response, opts){
				this.onFailure_(response);
	       }
	    });
	};
	

	/** 
	 * Function: find
	 * find all elements in async mode
	 *
	 * Parameters:
	 * callback - {Function}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.find = function(callback, params_opt){
		this.beforeFind();
		
		// build the uri to invoke
		var uri = new Uri({'url':this.baseUrl_});
		uri.setProxy( this.proxy_ );
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
				callback(data);
	       },
	       failure:  function(response, opts){
	       		var json = Ext.util.JSON.decode(response.responseText);
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
	ContentProvider.prototype.update = function(pk, item, callback){
		var data = this.beforeSave(item);
		var uri = new Uri({'url':this.baseUrl_});
		uri.setProxy( this.proxy_ );
		uri.appendPath( this.resourceNamePrefix_ ).appendId( pk );
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
				callback( response );
	       },
	       failure:  function(response, opts){
				this.onFailure_(response);
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
	ContentProvider.prototype.deleteByPk = function(pk, callback){
		var uri = new Uri({'url':this.baseUrl_});
		uri.setProxy( this.proxy_ );
		uri.appendPath( this.resourceNamePrefix_ ).appendId( pk );
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
				callback( response );
	       },
	       failure:  function(response, opts){
	       		// var json = Ext.util.JSON.decode(response.responseText);
				console.error( response );
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
	ContentProvider.prototype.create = function(item, callback){
		 var uri = new Uri({'url':this.baseUrl_});
		 uri.setProxy( this.proxy_ );
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
				callback(response.responseText);
	       },
	       failure:  function(response, opts){
	       		console.log(response);
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
 * Class: GeoStore.Maps
 *
 * CRUD methods for maps in GeoStore
 * Inherits from:
 *  - <GeoStore.ContentProvider>
 *
 */
   var Maps = GeoStore.Maps = ContentProvider.extend({
	initialize: function(){
		this.resourceNamePrefix_ = 'resource';
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

   var Datastore = GeoStore.Datastore = ContentProvider.extend({
	initialize: function(){
		this.resourceNamePrefix_ = '';
	},
	update: function(pk, item, callback){
		var data = this.beforeSave(item);
		var uri = new Uri({'url':this.baseUrl_});
		uri.setProxy( this.proxy_ );
		uri.appendId( pk );
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'PUT',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       scope: this,
		   // params: Ext.util.JSON.encode(data),
		   params: data,
	       success: function(response, opts){
				callback( response );
	       },
	       failure:  function(response, opts){
				this.onFailure_(response);
	       }
	    });		
	}
   });


}).call(this);


