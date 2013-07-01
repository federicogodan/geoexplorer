/**
 *    Converts XML to Ext.data.Store compatible format 
 */
var ResourcesXMLReader = Ext.extend(Ext.data.DataReader, {
    constructor: function(meta) {

        meta = meta || {};
        if (!meta.format) {
            meta.format = new OpenLayers.Format.XML();
        }
        
        ResourcesXMLReader.superclass.constructor.call(this, meta);
    },
    read : function(request) {
        
        var data = request.responseXML;        
        if (!data || !data.documentElement) {
            data = request.responseText;
        }
        return this.readRecords(data);
    },
    readRecords : function(data) {
        
            if ( data === "" ){
                        return {
                            totalRecords: 0,
                            success: true,
                            records: []
                        };    
            }
        
            if (typeof data === "string") {
                data = this.meta.format.read(data);        
            }

            if ( data.getElementsByTagName("ExtResourceList").length === 0 ){
                return {
                    totalRecords: 0,
                    success: true,
                    records: []
                };
            }

            var resources = data.getElementsByTagName("ExtResourceList")[0].childNodes;
            var records = [];

            for(var i=0; i<resources.length; i++){
                
                var values = {};
                var resource = resources[i];
                
                if ( resource.nodeName == 'ResourceCount'){
                    continue;
                }
            
                var attributes = resource.getElementsByTagName("Attributes")[0].childNodes;
                for (var j=0; j<attributes.length; j++){
                    var attribute = attributes[j];
                    var property = attribute.getElementsByTagName('name')[0].childNodes[0].data;
                    var value = attribute.getElementsByTagName('value')[0].childNodes[0].data;
                    values[ property ] = value;
                }
                    
                var children = resource.childNodes;
                for (var j=0; j<children.length; j++){
                    var child = children[j];
                    switch( child.nodeName ){
                        case 'name':
                            values['name'] = child.childNodes[0].data;
                            break;
                        case 'id':
                            values['id'] = child.childNodes[0].data;
                            break;
                        case 'owner':
                            values['owner'] = child.childNodes[0].data;
                            break;
                        case 'statusMessage':
                            values['statusMessage'] = child.childNodes[0].data;
                            break;
                        case 'cruiseId':
                            values['cruiseId'] = child.childNodes[0].data;
                            break;
                        case 'description':
                            values['description'] = child.childNodes[0].data;
                            break;
                        case 'creation':
                            values['creation'] = child.childNodes[0].data;
                            break;
                        case 'lastUpdate':
                            values['lastUpdate'] = child.childNodes[0].data;
                            break;
                        default:
                            break;
                    }
                }
                values['category_name'] = resource.getElementsByTagName("category")[0].getElementsByTagName('name')[0].childNodes[0].data;
                var record = new Ext.data.Record({
                    owner: values['owner'],
                    id: values['id'],
                    name: values['name'],
                    statusMessage: values['statusMessage'],
                    description: values['description'],
                    creation: values['creation'],
                    lastUpdate: values['lastUpdate'],
                    cruiseId: values['cruiseId']
                });

                records.push(record);
            }
            
            var count = data.getElementsByTagName("ResourceCount")[0].childNodes[0].data;
            return {
                totalRecords: count,
                success: true,
                records: records
            };
        }
});


/// refactoring to take into account categories

/**
 * Class: GeoStore.Resource
 *
 * CRUD methods for a generic Resource in GeoStore
 * Inherits from:
 *  - <GeoStore.ContentProvider>
 *
 */
var Resources = ContentProvider.extend({
    initialize: function( opts ){
        
        // Applying default values
        Ext.applyIf(opts, {
            createPath : 'resources',
            readPath : 'resources/resource',
            retrievePath : 'resources',
            deletePath : 'resources/resource',
            updatePath : 'resources/resource',
            searchPath : 'extjs/search'
        });

        // Mandatory parameters
        this.baseUrl_ = opts.baseUrl;
        this.category_ = opts.category;
        this.proxy_ = opts.proxy;
        // this.authorization_ = opts.token;
        this.setToken( opts.token );
        /*
        this.createPath_ = 'resources';
        this.readPath_ = 'resources/resource';
        this.retrievePath_ = 'resources';
        this.deletePath_ = 'resources/resource';
        this.updatePath_ = 'resources/resource';
        this.searchPath_ = 'extjs/search';
        */
        this.createPath_ = opts.createPath;
        this.readPath_ = opts.readPath;
        this.retrievePath_ = opts.retrievePath;
        this.deletePath_ = opts.deletePath;
        this.updatePath_ = opts.updatePath;
        this.searchPath_ = opts.searchPath;

       
        this.datastorePath_ = 'data';
        this.timeout_ = 10000;
        this.headers_ = {'Accept': 'text/xml'};
    },
    find: function( filter, obj ){
        
        var params_opt = obj.params;
        var successHandler = obj.onSuccess || this.onSuccess_;
        var failureHandler = obj.onFailure || this.onFailure_;
        
        var uri = new Uri({'url':this.baseUrl_});
        uri.setProxy( this.proxy_ );
        uri.appendPath( 'extjs/search' ).appendPath( filter );
        uri.addParam('start', 0);
        uri.addParam('limit', 100); // TODO how to specify infinite?
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
                var obj = Ext.util.JSON.decode(response.responseText);
                successHandler.call(this, obj);
           },
           failure:  function(response, opts){
                console.error( response );
                failureHandler.call(this, response);
           }
        });     
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
                '<name>' + this.category_ + '</name>' +
            '</category>' +
            '<store>' +
                '<data><![CDATA[ ' + data.blob + ' ]]></data>' +
            '</store>';
            
        xml += '</Resource>';
        // console.log(xml);
        return xml;
    },
    afterFind: function(json){
        
//        console.log(json);
        
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

    },
    /** 
     * Function: updateData
     * 
     *  In the current implementation of GeoStore
     *  data and metadata must be updated in two distinct steps
     *  this function updates data (i.e. blob field) of a configuration with id=pk 
     *
     *  
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
    getStore : function(){
        var uri = new Uri({'url':this.baseUrl_});
        uri.setProxy( this.proxy_);
        uri.appendPath( this.searchPath_ ); 
        // uri.appendPath( '/misc/category/name/{cname}/resources' );
        //uri.appendPath( '*' ); // all elements
        var categoryName = this.category_;
        var store = new Ext.data.Store({
            reader: new ResourcesXMLReader,
            autoDestroy: true,
            scope: this,
            root: 'results',
            totalProperty: 'totalCount',
            successProperty: 'success',
            idProperty: 'id',
            remoteSort: false,
            fields: [
                    {
                        name: "id",
                        type: "int"
                    },{
                        name: "name",
                        type: "string"
                    },{
                        name: "owner",
                        type: "string"
                    },{
                        name: "cruiseId",
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
                //method : 'GET',
                api:{
                    load: {url: uri.toString(), method: 'POST'}
                },
                disableCaching: true,
                timeout: this.timeout_,
                failure: function (result) {
                   console.error(result);
                },
                headers: this.headers_
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
                    //uri.appendPath( 'category/' + categoryName );
                    // the current GeoStore is not able to perform a category-based search using filters
                    // uri.appendPath( '*' ); // all elements
                    uri.addParam('start', params.start );
                    uri.addParam('limit', params.limit );
                    uri.addParam('includeAttributes', (params.includeAttributes)?params.includeAttributes:false );
                    // uri.addParam('categoryName', categoryName );

                    //store.proxy.setUrl( uri.toString() );
                    //if(!Ext.isFunction(inputstore.filter))
                    //    options.params.xmlData = inputstore.filter;
                    //else
                    //    options.params.xmlData = '<AND><CATEGORY><name>MAP</name><operator>EQUAL_TO</operator></CATEGORY></AND>';
                    //console.log(options.params.xmlData);
                    
                    store.proxy.setApi( Ext.data.Api.actions.read, {url: uri.toString(), method: 'POST'} );
                 },
                 scope: this
            }
            //,sortInfo: { field: "creation", direction: "DESC" }  // TODO: why this line is so evil?
        });     
        return store;
    } 
    
} );
   

