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
    write: function(runList) {
        return this.writers.run.RunList.apply(this, [runList]);
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
        //data = decodeURIComponent(data.result.code.replace(/\+/g,' '));
        data = unescape(data.result.code.replace(/\+/g,' '));
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
       "run":{
	         "RunList": function(runList) {
	             	var root = this.createElementNSPlus(
	                    "run:RunList",
	                    {attributes: {
	                    }}
	                );
	
	                root.setAttribute("xmlns:run", this.namespaces.run);
	                
	                for(var i=0, len=runList.length; i<len; ++i) {
	                	this.writeNode("run", runList[i], root);
	                }
	                
	                return root;
	          },
	          "run" : function(run) {
                var node = this.createElementNSPlus("run:run");
                
                for(var input in run.inputs) {

	            	if (input === "season") {
	            		this.writeNode("input", {"name": input, "value": eval("run.inputs."+input)}, node);
	            	}
	
	            	if (input === "sourceDepth") {
	            		this.writeNode("input", {"name": input, "value": eval("run.inputs."+input)}, node);
	            	}
	
	            	if (input === "sourcePressureLevel") {
	            		this.writeNode("input", {"name": input, "value": eval("run.inputs."+input)}, node);
	            	}
	
	            	if (input === "sourceFrequency") {
	            		this.writeNode("input", {"name": input, "value": eval("run.inputs."+input)}, node);
	            	}
	
	            	if (input === "modelName") {
	            		this.writeNode("input", {"name": input, "value": eval("run.inputs."+input)}, node);
	            	}
	
	            	if (input === "tlModel") {
	            		this.writeNode("input", {"name": "tlmodel", "value": eval("run.inputs."+input)}, node);
	            	}
	
	            	if (input === "bottomType") {
	            		this.writeNode("input", {"name": "bottomtype", "value": eval("run.inputs."+input)}, node);
	            	}
	
	            	if (input === "quality") {
	            		this.writeNode("input", {"name": "quality", "value": eval("run.inputs."+input)}, node);
	            	}
	
	            	if (input === "maxRange") {
	            		this.writeNode("input", {"name": "maxrange", "value": eval("run.inputs."+input)}, node);
	            	}
	
	            	if (input === "soundSourceUnit") {
	            		this.writeNode("input", {"name": "soundSourcePoint_lat", "value": eval("run.inputs."+input)}, node);
	            		this.writeNode("input", {"name": "soundSourcePoint_lon", "value": eval("run.inputs."+input)}, node);
	            	}

                }
	                
                return node;
              },
              "input" : function(input) {
            	var node = this.createElementNSPlus("run:input");
				var name = input.name;
				var value = input.value;
            	
            	if (name == "soundSourcePoint_lat")
            		value = value.value.substring(value.value.indexOf(' ')+1,value.value.indexOf(')'));
            	
            	if (name == "soundSourcePoint_lon")
            		value = value.value.substring(6,value.value.indexOf(' '));
            	
            	
            	this.writeNode("name", name, node);
            	this.writeNode("value", value, node);

            	return node;
              },
              "name" : function(name) {
                var node = this.createElementNSPlus("run:name", {value: name});
                
                return node;
              },
              "value" : function(value) {
                var node = this.createElementNSPlus("run:value", {value: value.value ? value.value : value});
                
                return node;
              } 
	 	}
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