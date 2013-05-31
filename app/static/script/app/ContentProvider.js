var ContentProvider = function(options){
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