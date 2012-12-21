

/**
 * requires OpenLayers/Format/XML.js
 */

/**
 * Class: OpenLayers.Format.GeoStore 
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 *  
 *  
 * ---------------------------------------------------------
 *  MapStore Integration information:
 *      New Class (not Openlayers lib class)
 * --------------------------------------------------------- 
 */


OpenLayers.Format.RunList = OpenLayers.Class(OpenLayers.Format.XML,{
    
    /**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
            removeSpace: (/\s*/g),
                splitSpace: (/\s+/),
                    trimComma: (/\s*,\s*/g)
                    },

    
    
                    /**
     * Property: defaultPrefix
     */
                    defaultPrefix: "run",
                    
                    
                    namespaces: {
        run: "http://mapstore.it/runList"
    },

                    /**
     * Constructor: OpenLayers.Format.GeoStore
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

                    /**
     * Method: write
     *
     * Parameters:
     * options - {Object} Optional object.
     *
     * Returns:
     * {String} An GeoStore Resource XML string that describes an WPS request instance.
     */
                    write: function(options) {
                        var doc;
                        if (window.ActiveXObject) {
                            doc = new ActiveXObject("Microsoft.XMLDOM");
                            this.xmldom = doc;
                        } else {
                            doc = document.implementation.createDocument("", "", null);
                        }
        
                        var node;
                        switch (options.type){
                            case "resource":
                                node = this.writeNode("store:Resource", options, doc);
                                break;
                            case "user":
                                node = this.writeNode("store:User", options, doc);
                                break;
                            case "category":
                                node = this.writeNode("store:Category", options, doc);
                                break;
                        }
    
                        /* this.setAttributeNS(
            node, this.namespaces.xsi,
            "xsi:schemaLocation", this.schemaLocation
        );*/
                        return OpenLayers.Format.XML.prototype.write.apply(this, [node]).replace(/\ xmlns="undefined"/g, '');
                    }, 

                    /**
     * APIMethod: read
     * Parse a WPS request instance and return an object with its information.
     * 
     * Parameters: 
     * data - {String} or {DOMElement} data to read/parse.
     *
     * Returns:
     * {Object}
     */
                    read: function(data) {
                        if(typeof data == "string") {
                            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
                        }
                        if(data && data.nodeType == 9) {
                            data = data.documentElement;
                        }
                        var info = {};
                        this.readNode(data, info);
                        return info;
                    },

     /**
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */

                    writers: {
                       
                    },

                    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
                    readers: {
                        
                        "run":{
                             "RunList": function(node, obj) {
                                    obj.runList = new Array();
                                    this.readChildNodes(node, obj.runList);
                              },
                              
                              "run": function(node, runList) {
                                    var run={
                                        inputs: new Object(),
                                        outputs: new Object()
                                    };
                                    this.readChildNodes(node, run);
                                    
                                    runList.push(run);
                              },
                              "input": function(node, run) {
                                    var input={};
                                    
                                    this.readChildNodes(node, input);
                                    
                                    run.inputs[input.name]={value: input.value};
                              },
                              "output": function(node, run) {
                                    var output={};
                                    
                                    this.readChildNodes(node, output);
                                    
                                    run.outputs[output.name]={value: output.value};
                              },
                              "name": function(node, obj) {
                                    obj.name=this.getChildValue(node);
                              },
                              "value": function(node, obj) {
                                    var value=this.getChildValue(node);
                                    if(value.indexOf(",")!= -1)
                                       obj.value=value.split(",");
                                    else
                                       obj.value=value; 
                              }
                            
                        }
       
                    },
    
                    CLASS_NAME: "OpenLayers.Format.RunList" 

                });
   
   
   
   
   
                

