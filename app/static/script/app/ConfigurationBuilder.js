
/**
 *  this class contains info about cruise configurations
 */
var ConfigurationBuilder =  {
	
	
	createVehicleConfiguration: function( selected ){
		var result = '';
		// var selected =  selector.toMultiselect.store.data.items;
		
		for (var i=0; i<selected.length; i++){
			
			var item = selected[i].data;
			
			result += '[';
			result += 'true,';
			result +=  '"' + item.text + '",';
			result +=  '"' + item.url + '",';
			result += 'false';
			result += ']';
			
			if ( i < selected.length - 1){
				result += ', ';
			}
		}
		
		return result;
	},
	
	createModelConfiguration: function( selected ){
		var result = '';
		// var selected =  selector.toMultiselect.store.data.items;
		
		for (var i=0; i<selected.length; i++){
			
			var item = selected[i].data;
			
			result += '{';
			result +=  '"format": "image/png8",'
		             + '"group": "Ocean models",'
		             + '"name": "' + item.value + '",'
		             + '"opacity": 1,'
		             + '"selected": true,'
		             + '"source": "demo",'
		             + '"title":"' + item.text + '",'
		             + '"transparent": true,'
		             + '"visibility": true,'
		             + '"ratio": 1,'
		             + '"elevation": 10,'
		             + '"styles":"watvel_marker_ramp"'
			result += '}';
			
			if ( i < selected.length - 1){
				result += ', ';
			}
		}
		
		return result;
	},
	
	createBackgroundConfiguration: function( selected ){
		var result = '';
		// var selected =  selector.toMultiselect.store.data.items;
		
		for (var i=0; i<selected.length; i++){
			
			var item = selected[i].data;
			
			result += '{';
			result +=  '"format": "image/jpeg",'
		             + '"transparent": false,'
		             + '"source": "GEOSIII",'
		             + '"group": "background",'
		             + '"name": "' + item.value +  '",'
		             + '"title": "' + item.text + '"'
			result += '}';
			
			if ( i < selected.length - 1){
				result += ', ';
			}
		}
		
		return result;
	},
	
	
	create: function( params ){
			var conf = new Object;
			conf.name = params.name;
			conf.description = params.name;
			conf.blob = '{ '
						+ '"cruiseName":"'+ params.name + '",'
						+ '"timeRange":["'+ params.timeRange[0] 
								+ '","'+ params.timeRange[1]  + '"],'
					    + '"timeStep":"' + params.timeStep  + '",'
						+ '"timeFrameRate":"' + params.timeFrameRate + '",'
						+ '"timeUnits":"' + params.timeUnits + '",'
						+ '"models":['+ this.createModelConfiguration( params.models ) + '],'
						+ '"backgrounds":['+ this.createBackgroundConfiguration( params.backgrounds ) + '],'
				 	   + '"watermarkUrl":"'+ params.watermarkUrl + '",'
						+ '"watermarkPosition":"'+ params.watermarkPosition + '",'

						+ '"bounds":['  
						+	params.bounds[0] + ','
						+   params.bounds[1] + ','
						+   params.bounds[2] + ','
						+   params.bounds[3]
						+ '],'

					   + '"vehicleSelector": {' 
					   +	'"data":['
								+ this.createVehicleConfiguration( params.vehicles )
					   + '],'
					   +	'"refreshIconPath": "../theme/app/img/silk/arrow_refresh.png",'  
					   +	'"geoserverBaseURL": "http://84.33.199.62/geoserver-gliders/",'		
					   +	'"gliderPropertyName": "glider_name",'	
					   +	'"cruisePropertyName": "cruise_name",'	
					   +	'"glidersFeatureType": "GlidersTracks",'	
					   +	'"glidersPrefix": "it.geosolutions",'
					   +    '"wfsVersion": "1.1.0"'
					   + '}'					
					+' }';					
			conf.owner = 'admin';
			return conf;
	}
};