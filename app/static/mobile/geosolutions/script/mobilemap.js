if(window['geoSolutions'] == undefined){

	geoSolutions={
		RS:{
			gg :new OpenLayers.Projection("EPSG:4326"),
			sm : new OpenLayers.Projection("EPSG:900913")
		},
		
		backgrounds:{
			GoogleStreet : new OpenLayers.Layer.Google(
					"Google Streets", // the default
					{numZoomLevels: 20}
			),
			GoogleHibrid: new OpenLayers.Layer.Google(
					"Google Hybrid",
					{type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
			),
			GoogleSatellite: new OpenLayers.Layer.Google(
					"Google Satellite",
					{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
			),
			GooglePhysical : new OpenLayers.Layer.Google(
					"Google Physical",
					{type: google.maps.MapTypeId.TERRAIN}
            ),            
			OSM: new OpenLayers.Layer.OSM(),
			MapQuest: new OpenLayers.Layer.XYZ(
				"MapQuest", 
				[
					"http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
					"http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
					"http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
					"http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"
				],
				{
					attribution: "Data, imagery and map information provided by <a href='http://www.mapquest.com/'  target='_blank'>MapQuest</a>, <a href='http://www.openstreetmap.org/' target='_blank'>Open Street Map</a> and contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>  <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
					transitionEffect: "resize"
					
				}
			),
			Bing: new OpenLayers.Layer.Bing({
				name: "Bing Hybrid",
				key: "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf",
				type: "AerialWithLabels"
			})			
		}
	 }
 
}
/**
 * geoSolutions.markableMap : emulate MapStore functionalities like GeoJson Injection in a mobile context
 * mapId : the id of the div for the map
 * mapComposerBaseUrl: url of mapcomposer (to get markers)
 * bbox: initial bounding box for the map
 * bg : String | Openlayers.Layer Background (default OSM)  
 *     if string one of :
 *           OSM : OpenStreetMap
 *           MapQuest: MapQuest bg
 *           Bing: hibrid Bing background
 *           
 */
geoSolutions.markableMap  =function(mapId,mapComposerBaseUrl,bbox,bg){
	var options = {
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:900913"),
		//displayProjection: new OpenLayers.Projection("EPSG:4326"),
		units: "m",
		numZoomLevels: 20,
		maxResolution: 156543.0339,
		maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
										 20037508, 20037508.34)
		
	};
	
	var map = new OpenLayers.Map(mapId, options);
	
	map.addControls([
		new OpenLayers.Control.Navigation(
            {dragPanOptions: {enableKinetic: true}}),
		new OpenLayers.Control.Attribution()
			]);
	
	var geoLocationAreaVector = new OpenLayers.Layer.Vector(OpenLayers.i18n("My Position"), {});
	map.addLayers([geoLocationAreaVector]);
	var geoLocationStyle = {
        fillOpacity: 0.3,
        fillColor: '#55b',
        strokeColor: '#00f',
        strokeOpacity: 0.6
    };
	var geolocateControl = new OpenLayers.Control.Geolocate({
			id: 'locate-control',
			geolocationOptions: {
				enableHighAccuracy: true,
				maximumAge: 0,
				timeout: 7000
			}
			
	});
	 geolocateControl.events.register("locationupdated", this, function(e) {
        geoLocationAreaVector.removeAllFeatures();
		
		
		
        geoLocationAreaVector.addFeatures([
		new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'circle',
                    strokeColor: '#aaa',
					fillColor: '#11f',
                    strokeWidth: 2,
                    fillOpacity: 0.7,
					strokeOpacity: 0.6,
                    pointRadius: 5
					
                }
            ),
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
                ),
                {},
                geoLocationStyle
            ),
            
        ]);
        map.zoomToExtent(geoLocationAreaVector.getDataExtent());
    });
	map.addControl(geolocateControl);
	var bgArray = new Array();
	for (x in  geoSolutions.backgrounds){bgArray.push(geoSolutions.backgrounds[x]);}
	map.addLayers(bgArray);
	if(!bg){
		map.setBaseLayer(geoSolutions.backgrounds.GoogleStreet);
	}else if(typeof bg =="string"){
		if (geoSolutions.backgrounds[bg]){
			map.setBaseLayer(geoSolutions.backgrounds[bg]);
		}else{
			map.setBaseLayer(geoSolutions.backgrounds.OSM);
		}
	
	}else{
		map.setBaseLayer(bg);
	}
	
	//move to bbox
	
	if(bbox){
		map.zoomToExtent( OpenLayers.Bounds.fromString(bbox));
	//default location
	} else {
		var lon = -75.5577;
		var lat = 39.7223;
		var zoom = 8;

		map.setCenter((new OpenLayers.LonLat(lon, lat)).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), zoom);
	
	}
	
	//geoLocalization control
	var geolocateMe = function (){
		var geolocate = map.getControlsBy("id", "locate-control")[0];
		//console.log(geolocate);
		if (geolocate.active) {
			geolocate.getCurrentLocation();
			
		} else {
			geolocate.activate();
			geolocate.events.register('locationupdated', geolocate, function(){
				//Ext.Viewport.setMasked(false);
			});
			geolocate.events.register('locationfailed', geolocate, function(){
				//Ext.Viewport.setMasked(false);
				//Ext.Msg.alert("Unable to find your position", "Check if you have some geolocation system active on your device. ", Ext.emptyFn);
			});
			geolocate.events.register('locationuncapable', geolocate, function(){
				//Ext.Viewport.setMasked(false);
				//Ext.Msg.alert("Unable to find your position", "Check if you have some geolocation system active on your device. ", Ext.emptyFn);
			});
			/*Ext.Viewport.setMasked({
					xtype: 'loadmask',
					message: 'Searching for your location...',
					indicator: false,
				});*/
		}
	}
	function geoCode(){
		var winId = mapId+"-nominatim-geocoder-embedded-search-box"	
		if(Ext.get(winId) ) return;
		//mominatim proxy
		var proxy = new Ext.data.ScriptTagProxy( {
				type: 'scripttag',
				callbackParam: 'json_callback',
				timeout: 5000,
				listeners: {
					exception: function( proxy, type, action,  options,  response,  arg){
						
						//this.hide();
						Ext.Msg.alert("Location Search Error", "The Search server seems unreachable"  , Ext.emptyFn);
						//NAV.searchFormPopupPanel.hide();
					},
					scope: this
				},
				url: 'http://nominatim.openstreetmap.org/search?',
				reader: {
					type: 'json'
				}
		});
		
		//Nominatim store
		var bounds = map.getExtent();
		bounds.transform(geoSolutions.RS.sm,geoSolutions.RS.gg);
		//required format for viewbox=<left>,<top>,<right>,<bottom>
		var viewbox= bounds.left+ ',' + bounds.top + ',' +bounds.right+ ',' +bounds.bottom;
		var store = new Ext.data.JsonStore({
			
			idProperty: 'place_id',
			baseParams:{
							format: 'json',		
											//text to search
							viewbox: viewbox, 	//near places first
							bounded:0,			//1 to get only the results in the viewbox
							polygon:0,			//output the poligon outlines for items found
							addressdetails:0,
							limit: 20			//max number of results
							
			},
			proxy: proxy,
			fields: [
				'display_name', 
				'lat',
				'lon',
				'boundingbox',
				'polygonpoints',
				'place_id',
				'licence',
				'osm_type',
				'osm_id',
				'polygonpoints',
				'class',
				'type',
				'address']
			
		});
		
		//get dimensions of the div
		var mapdiv = Ext.get(mapId);
		var mapdivHeight=mapdiv.getHeight();
		var mapdivWidth=mapdiv.getWidth();
		var mapdiv = Ext.get(mapId);
		
		var combo = new Ext.form.ComboBox({
			store: store,
			displayField:'display_name',
			mode: 'remote',
			style: {
				height:'30px',
				fontSize:'20px'
				
			},
			//emptyText: 'digit street, city,region,state...', 
			queryParam: 'q',  //contents of the field sent to server.
			hideTrigger: true,    //hide trigger so it doesn't look like a combobox.
			selectOnFocus:true,
			width: mapdivWidth
			
									  
		});
		var closeSearch = new Ext.Component({
			//html: '<span class=".close-search"></span>',
			width:20,
			height:20,
			cls:"close-search"
			
			

		});
		var searchContainer = new  Ext.Panel({
			items: [combo,closeSearch],
			id: winId,
			header:false,
			layout:'fit',
			cls: 'nominatim-geocoder-embedded-search-box',
			style:{
				position: 'relative',
				top: '-' + mapdivHeight + 'px',  //e.g. -450px 
				zIndex:'1000000'
			},
			renderTo: mapId
			
		
		});
		
		combo.on("blur",function(){
			setTimeout(function(){searchContainer.destroy()},200);
		});
		combo.on("afterrender",function(cb){cb.focus();});
		
		combo.on("select",function (combo,record,index){
			searchContainer.destroy();
			var bounds = new OpenLayers.Bounds();
			var boundingBox = record.get('boundingbox');
			//nominatim format[Bottom top left right]
			bounds.extend(new OpenLayers.LonLat(boundingBox[2],boundingBox[0]).transform(geoSolutions.RS.gg, geoSolutions.RS.sm));
			bounds.extend(new OpenLayers.LonLat(boundingBox[3],boundingBox[1]).transform(geoSolutions.RS.gg, geoSolutions.RS.sm));
			map.zoomToExtent(bounds,true);
			markerName="Nominatim GeoCoder Query Result";
			var renderer = OpenLayers.Layer.Vector.prototype.renderers;
			
			var styleMarkers = new OpenLayers.StyleMap({
                    pointRadius: 28,
                    externalGraphic:    mapComposerBaseUrl +"theme/app/img/markers/star_red.png",
                    backgroundGraphic:  mapComposerBaseUrl +"theme/app/img/markers/markers_shadow.png",

                    graphicZIndex: 11,
                    backgroundGraphicZIndex: 10,
					
					backgroundXOffset: -18,
					backgroundYOffset: -38,
					graphicXOffset: -26,
					graphicYOffset: -52
			});
			

            var center = new OpenLayers.LonLat(record.get('lon'),record.get('lat')).transform(geoSolutions.RS.gg, geoSolutions.RS.sm);
            
			var points = new OpenLayers.Geometry.Point(center.lon,center.lat);
			var markers_feature = new OpenLayers.Feature.Vector(points);
			var markers = new OpenLayers.Layer.Vector( markerName, {
				styleMap: styleMarkers,
				displayInLayerSwitcher: false,
				
				renderers: renderer
			});
			var markerLyr = map.getLayersByName(markerName);  
			if (markerLyr.length){
				map.removeLayer(markerLyr[0]);
				map.addLayer(markers);
				markers.addFeatures(markers_feature);
	
			}else {
				map.addLayer(markers);
				markers.addFeatures(markers_feature);
				
			}

			});
		searchContainer.show();
		combo.focus(false, 200);
		
	
	}
	// Control Panel
	var panel = new OpenLayers.Control.Panel({type:OpenLayers.Control.TYPE_BUTTON});
	//Layer Switcher
	var layerSwitcherControl = new OpenLayers.Control.MobileLayerSwitcher();
	
	
	var displayLayerSwitcher=function(){
		layerSwitcherControl.div.style.display="block";
	}
	var layerSwitcherButton = new OpenLayers.Control.Button({
		displayClass: "LayerSwitcherButton",
		trigger:displayLayerSwitcher
		
	});

	var geoLocalizationButton = new OpenLayers.Control.Button({
		displayClass: "geoLocalizationButton",
		trigger: geolocateMe
		
	});
	
	var geoCodingButton = new OpenLayers.Control.Button({
		displayClass: "geoCodingButton",
		trigger: geoCode
		
	});
	var oldPos;
	var hidePanel = function(){
	
		if(!this.active){
			
			panel.div.style.right=oldPos;
			this.activate();
		}else{
			oldPos =panel.div.style.right;
			panel.div.style.right="-55px";
			this.deactivate();
		}

	}
	
	var hideButton = new OpenLayers.Control.Button({
		displayClass: "hidePanelButton",
		trigger: hidePanel,
		panel: panel
		
		
	});

	panel.addControls([geoLocalizationButton,geoCodingButton,layerSwitcherButton,hideButton]);
	map.addControl(panel);
	hideButton.activate();
	map.addControl(layerSwitcherControl);
	layerSwitcherControl.activate();
	// The ret module
	var app	={
		map: map,
			zoomToBBox: function(bbox){
				this.map.zoomToExtent( OpenLayers.Bounds.fromString(bbox) );
		},
		mapComposerBaseUrl: mapComposerBaseUrl,
			//properties for style markers
		markerTemplateDefault: {
				label: "${label}",
				fontWeight: "bold",
				fontSize: "20px",//"10px",
				fontColor: "#FFFFFF",
				
				graphicZIndex: 11,
				backgroundGraphicZIndex: 10,
				graphicYOffset: -43,
				
				//labelXOffset: 0 , 
				labelYOffset: 18
				
			
		},
				
		markerTemplateSelected: {
				label: "${label}",
				fontWeight: "bold",
				fontSize: "20px",
				fontColor: "#FFFFFF",
				//backgroundGraphic: 'theme/app/img/markers/markers_shadow.png',
				//backgroundXOffset: -7,
				//backgroundYOffset: -7,
				// Set the z-indexes of both graphics to make sure the background
				// graphics stay in the background
				
				graphicZIndex: 11,
				backgroundGraphicZIndex: 10,
				graphicYOffset: -43,
				
				//labelXOffset: 0 , 
				labelYOffset: 18
				
		},
			
		externalGraphicMarkers: mapComposerBaseUrl + 'theme/app/img/markers/default_information.png',
		externalGraphicMarkersHighlights: mapComposerBaseUrl +  'theme/app/img/markers/default_information_highlights.png',
		
		externalGraphicClusterMarkers: mapComposerBaseUrl +  'theme/app/img/markers/marker-r.png',
		externalGraphicClusterHighlights: mapComposerBaseUrl + 'theme/app/img/markers/marker-b.png',
			
		markerSelectionIcon: mapComposerBaseUrl +  'theme/app/img/markers/default_information_select.png',
		markerSelectionClusterIcon: mapComposerBaseUrl + 'theme/app/img/markers/marker-y.png',
		
		markerClusterShadow: mapComposerBaseUrl + 'theme/app/img/markers/marker-c-shadow.png',
		markerShadow:  mapComposerBaseUrl + 'theme/app/img/markers/markers_shadow.png',
			
			//properties for style tracks
		trackStyle: {
				strokeColorTracks: "green",
				strokeWidthTracks: 7,
				strokeOpacityTracks: 0.5
		},
		setMarkersStyle: function() {
			
			var defaultMarker = this.externalGraphicMarkers;
			var highlightsMarker = this.externalGraphicMarkersHighlights;
			
			var defaultClusterMarker = this.externalGraphicClusterMarkers;
			var highlightsClusterMarker = this.externalGraphicClusterHighlights
			
			var defaultSelection = this.markerSelectionIcon;
			var clusterSelection = this.markerSelectionClusterIcon;
			
			var defaultShadow = this.markerShadow;
			var clusterShadow = this.markerClusterShadow;
			
			var context = {
                getMarkerIcon : function (ft){
                    if(ft.attributes.highlights) {
                        if(ft.attributes.cluster){
                            return highlightsClusterMarker;
                        }else{
                            if(ft.attributes.icons){
                                return ft.attributes.icons.img.markerHighlights;
                            }else{
                                return highlightsMarker;                      
                            }           
                        }
                    }else{
                        if(ft.attributes.cluster){
                            return defaultClusterMarker; 
                        }else{ 
                            if(ft.attributes.icons){
                                return ft.attributes.icons.img.markerDefault;
                            }else{
                                return defaultMarker;                             
                            }
                        }
                    }   
                },
                getMarkerWidth : function (ft){
                    if(ft.attributes.icons.markersDimensions){
                        return parseInt(ft.attributes.icons.markersDimensions.width)*2;
                    }
                },
                getBackgroundMarkerWidth : function (ft){
                    if(ft.attributes.icons.shadowDimensions){
                        return parseInt(ft.attributes.icons.shadowDimensions.width)*2;
                    }
                },
                getMarkerHeight : function (ft){
                    if(ft.attributes.icons.markersDimensions){
                        return parseInt(ft.attributes.icons.markersDimensions.height)*2;
                    }
                },       
                getBackgroundMarkerHeight : function (ft){
                    if(ft.attributes.icons.shadowDimensions){
                        return parseInt(ft.attributes.icons.shadowDimensions.height)*2;
                    }
                },     				
                getMarkerSelectionIcon : function (ft){
                    if(ft.attributes.cluster)
                        return clusterSelection;
                    else	
                        if(ft.attributes.icons){
                            return ft.attributes.icons.img.markerSelected;
                        }else{
                            return defaultSelection;                               
                        }                   
                },
				
				getMarkerLabel : function(ft){
					var label = ft.attributes.label;
					if(label) 
						return label; 
					else 
						return null; 
				},
				
				getRadius : function(ft){
					var label;
					var radius;
					
					try{
						label = parseInt(ft.attributes.label);
					}catch(e){
						radius = 12;
					} 
			
					var cluster = ft.attributes.cluster;
										
					radius = radius ? radius : 12;
					if(label && cluster){
						if(label > 0 && label <= 200){
							radius = 12;
						}else if(label > 201 && label <= 500){
							radius = 16;
						}else if(label > 501 && label <= 1000){
							radius = 18;
						}else if(label > 1001 && label <= 2000){
							radius = 20;
						}else if(label > 2001 && label <= 4000){
							radius = 22;
						}else if(label > 4001 && label <= 8000){
							radius = 24;
						}else if(label > 8001 && label <= 16000){
							radius = 26;
						}else if(label > 16001 && label <= 32000){
							radius = 28;
						}else if(label > 32001){
							radius = 32;
						}
					}
					
					return radius*2;
				},
				
				getBackgroundXOffset : function(ft){
                    if(ft.attributes.icons && !ft.attributes.cluster){
                        return -1.2*context.getBackgroundMarkerWidth(ft)/4;
                    }else{            
                        return  -1.0*context.getRadius(ft)/2;
                    }
				},
                getBackgroundYOffset : function(ft){
                    if(ft.attributes.icons && !ft.attributes.cluster){
                        return -1.85*context.getBackgroundMarkerHeight(ft)/2;
                    }else{
                        return -1.5* context.getRadius(ft);
                    }               
                },
                getGraphicYOffset : function(ft){
                    if(ft.attributes.icons && !ft.attributes.cluster){
                        return -1.95*context.getMarkerHeight(ft)/2;
                    }else{
                        return -1.9* context.getRadius(ft);
                    }
                },
                getLabelYOffset : function(ft){
                    if(ft.attributes.icons && !ft.attributes.cluster){
                        return context.getMarkerHeight(ft)/2;
                    }else{                
                        return  context.getRadius(ft);                
                    }    
                },
				
                getMarkerShadowIcon: function (ft){
                    if(ft.attributes.cluster)
                        return clusterShadow;
                    else
                        if(ft.attributes.icons && !ft.attributes.cluster){
                            if(ft.attributes.icons.img){
                                return ft.attributes.icons.img.markerShadow;
                            }else{
                                return defaultShadow;
                            }
                        }else{
                            return defaultShadow;
                        }
                }
			};
			
			this.markerTemplateDefault.externalGraphic = "${getMarkerIcon}";
			this.markerTemplateDefault.pointRadius = "${getRadius}";
			this.markerTemplateSelected.pointRadius = "${getRadius}";
			
			this.markerTemplateSelected.externalGraphic = "${getMarkerSelectionIcon}";
			this.markerTemplateDefault.backgroundXOffset = "${getBackgroundXOffset}";
			
			this.markerTemplateDefault.backgroundYOffset = "${getBackgroundYOffset}";
			this.markerTemplateSelected.backgroundXOffset = "${getBackgroundXOffset}";	
			this.markerTemplateSelected.backgroundYOffset = "${getBackgroundYOffset}";
			
			this.markerTemplateDefault.graphicYOffset="${getGraphicYOffset}";
			this.markerTemplateDefault.labelYOffset ="${getLabelYOffset}";
			this.markerTemplateSelected.graphicYOffset="${getGraphicYOffset}";
			this.markerTemplateSelected.labelYOffset ="${getLabelYOffset}";
			
			this.markerTemplateDefault.backgroundGraphic = "${getMarkerShadowIcon}";
			this.markerTemplateSelected.backgroundGraphic = "${getMarkerShadowIcon}";
			
			var styleMap = new OpenLayers.StyleMap({ 
				"default" : new OpenLayers.Style(this.markerTemplateDefault, {context:context}),
				"select" : new OpenLayers.Style(this.markerTemplateSelected, {context:context})
			}); 

            var rules = [
                new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.AND,
                        filters: [
                            new OpenLayers.Filter.Comparison({
                                type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                                property: "icons",
                                value: null
                            }),
                            new OpenLayers.Filter.Comparison({
                                type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                                property: "cluster",
                                value: true
                            })
                        ]
                    }),
                    symbolizer: {
                        graphicWidth: "${getMarkerWidth}",
                        graphicHeight: "${getMarkerHeight}",
                        backgroundWidth: "${getBackgroundMarkerWidth}",
                        backgroundHeight: "${getBackgroundMarkerHeight}"
                    }                
                }),
                new OpenLayers.Rule({
                    elseFilter: true
                })
            ];
            
            styleMap.styles['default'].addRules(rules);
            styleMap.styles['select'].addRules(rules);
        
			return(styleMap); 
		}, 
		showMarkerGeoJSON :  function(markerName, geoJson, clusterName, trackName, showLine) {
			var clusterName= clusterName ||  markerName;
			
			// allow testing of specific renderers via "?renderer=Canvas", etc
			var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
			renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
			
			// check if the marker layer exists
			var markerLyr = map.getLayersByName(markerName);   
			var clusterLyr = map.getLayersByName(clusterName);			
			if ((markerLyr && markerLyr.length)|| (clusterLyr && clusterLyr.length)) {
			   for (var key in markerLyr.features) {
					markerLyr.removeFeatures(markerLyr.features[key]);
					markerLyr.addFeatures(markerLyr.features[key]);
				}
			}else {
				
				// Create a new parser for GeoJSON
				var geojson_format = new OpenLayers.Format.GeoJSON({
					internalProjection: map.getProjectionObject(),
					externalProjection: new OpenLayers.Projection("EPSG:4326")
				});
/*
				// Sets the style for the markers
				var styleMarkers = this.setMarkersStyle();
				
				// Create new vector layer for markers
				var marker_layer = new OpenLayers.Layer.Vector(markerName, {
					styleMap: styleMarkers,
					displayInLayerSwitcher: true,
					
					renderers: renderer
				});
				var cluster_layer =new OpenLayers.Layer.Vector(clusterName, {
					styleMap: styleMarkers,
					displayInLayerSwitcher: true,
					
					renderers: renderer
				});
				//WORKAROUND FOR LABELS CONFLICT
				 marker_layer.renderer.textRoot = marker_layer.renderer.vectorRoot;
				 cluster_layer.renderer.textRoot = cluster_layer.renderer.vectorRoot;
*/				 
				// Create the popups for markers
				var popupTitle = this.markerPopupTitle;
				var onFeatureSelect =function (feature) {
				
					if (feature.attributes.html){
						AutoSizeFramedCloudMaxSize = OpenLayers.Class(OpenLayers.Popup.Anchored, {
							'autoSize': true, 
							'maxSize': new OpenLayers.Size(500,400),
							'addCloseBox': function(callback) {

								this.closeDiv = OpenLayers.Util.createDiv(
									this.id + "_close", null, {w: 25, h: 25}
								);
								this.closeDiv.className = "olPopupCloseBox"; 
        
								// use the content div's css padding to determine if we should
								//  padd the close div
								var contentDivPadding = this.getContentDivPadding();
								 
								this.closeDiv.style.right = contentDivPadding.right + "px";
								this.closeDiv.style.top = contentDivPadding.top + "px";
								this.groupDiv.appendChild(this.closeDiv);

								var closePopup = callback || function(e) {
									this.hide();
									OpenLayers.Event.stop(e);
								};
								OpenLayers.Event.observe(this.closeDiv, "touchend", 
										OpenLayers.Function.bindAsEventListener(closePopup, this));
								OpenLayers.Event.observe(this.closeDiv, "click", 
										OpenLayers.Function.bindAsEventListener(closePopup, this));
							}
						});
						var popup = new AutoSizeFramedCloudMaxSize(feature.fid,
								feature.geometry.bounds.getCenterLonLat(),
								new OpenLayers.Size(300,300),
								'<h4 class="popupTitle">'+feature.fid+'</h4>'+feature.attributes.html,
								null, true, onPopupClose);
						popup.relatedFeature = feature;
						map.addPopup(popup);
						
					} else {
						// Use unselect to not highlight the marker. I could not delete the selection. This happens when I close the popup
						selectControl.unselect(feature);
					}
					
				}
				var markers = new Array();
				var clusters = new Array();
                var markersLayers = new Array();
				
                var features =geojson_format.read(geoJson);

                //unique array
                function unique(arrayName){
                    var newArray=new Array();
                    label:for(var a=0; a<arrayName.length;a++ ){  
                        for(var j=0; j<newArray.length;j++ ){
                            if(newArray[j]==arrayName[a]) 
                            continue label;
                        }
                        newArray[newArray.length] = arrayName[a];
                    }
                    return newArray;
                } 

            for(var i=0;i<features.length;i++){
                if(!features[i].attributes.cluster){
                    if(features[i].attributes.layer){
                        markersLayers.push(features[i].attributes.layer);
                    }else{
                        markersLayers.push(features[i].attributes.layer);
                    }
                }
            }

            var uniqueMarkersLayers = new Array;
            uniqueMarkersLayers = unique(markersLayers);
            
            for(var i=0;i<features.length;i++){
                if(features[i].attributes.cluster){
                    clusters.push(features[i]);
                }
            }

            for (var m=0;m<uniqueMarkersLayers.length;m++){
                markers[m] = new Array();
                var count = 0;
                for(var mi=0;mi<features.length;mi++){
                    if(!features[mi].attributes.cluster){
                        if(features[mi].attributes.layer == uniqueMarkersLayers[m]){
                            markers[m][count] = features[mi];
                            count++;
                        }
                    }
                }
            }
            
				/*if(markers.length>0){

					this.map.addLayer(marker_layer);
					marker_layer.addFeatures(markers);					
					
				}
				if(clusters.length>0){

					this.map.addLayer(cluster_layer);
					cluster_layer.addFeatures(clusters);					
					
				}*/
                
            // Sets the style for the markers
            var styleCluster = this.setMarkersStyle(false);


            if (markers.length>0){
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    if(uniqueMarkersLayers[i] == undefined){
                        // Create new vector layer for default markers
                       var marker_layer = new OpenLayers.Layer.Vector(markerName, {
                            styleMap: styleCluster,
                            displayInLayerSwitcher: true,
                            //rendererOptions: {yOrdering: true},
                            renderers: renderer
                        });
                    }else{
                        // Create new vector layer for named markers
                        uniqueMarkersLayers[i] = new OpenLayers.Layer.Vector(uniqueMarkersLayers[i], {
                            styleMap: styleCluster,
                            displayInLayerSwitcher: true,
                            //rendererOptions: {yOrdering: true},
                            renderers: renderer
                        });
                    }
                }
            }
            
            if (clusters.length>0){
                // Create new vector layer for clusters
                var cluster_layer = new OpenLayers.Layer.Vector(clusterName, {
                    styleMap: styleCluster,
                    displayInLayerSwitcher: true,
                    //rendererOptions: {yOrdering: true},
                    renderers: renderer
                });
            }                
            
            // workaround to make the text features rendered in the same container having the vector features
            if (clusters.length>0){
                cluster_layer.renderer.textRoot = cluster_layer.renderer.vectorRoot;
            }
            
            if (markers.length>0){
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    if(uniqueMarkersLayers[i] == undefined){
                        marker_layer.renderer.textRoot = marker_layer.renderer.vectorRoot;
                    }else{
                        uniqueMarkersLayers[i].renderer.textRoot = uniqueMarkersLayers[i].renderer.vectorRoot;
                    }
                }
            }

            if(markers.length>0){
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    for (var c=0; c<markers[i].length;c++){
                        if(uniqueMarkersLayers[i] == undefined){
                            map.addLayer(marker_layer);
                            marker_layer.addFeatures(markers[i][c]);
                        }else{
                            map.addLayer(uniqueMarkersLayers[i]);
                            uniqueMarkersLayers[i].addFeatures(markers[i][c]);
                        }
                    }
                }
            }
            
            if(clusters.length>0){
                map.addLayer(cluster_layer);
                cluster_layer.addFeatures(clusters);
            }            
            
            var vectorSelect = new Array;
            
            if(clusters.length>0 && markers.length>0){
                vectorSelect = [cluster_layer];
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    if(uniqueMarkersLayers[i] == undefined){
                        vectorSelect.push(marker_layer);
                    }else{
                        vectorSelect.push(uniqueMarkersLayers[i]);
                    }
                }                
            }else if(clusters.length==0 && markers.length>0){
                for (var i = 0; i<uniqueMarkersLayers.length; i++){
                    if(uniqueMarkersLayers[i] == undefined){
                        vectorSelect.push(marker_layer);
                    }else{
                        vectorSelect.push(uniqueMarkersLayers[i]);
                    }
                }    
            }else{
                vectorSelect = cluster_layer;
            }
            
				//Show popup clouds on feature select
				var selectControl = new OpenLayers.Control.SelectFeature(vectorSelect,{
					onSelect: onFeatureSelect,
					clickout: false,
					multiple: true
				});
				var onPopupClose = function(popup){
					this.hide();
					selectControl.unselect(this.relatedFeature);
				
				}
				this.map.addControl(selectControl);
				selectControl.activate();
				
				
			}
			
			if(trackName){
				// Checks if the track layer exists
				var trackLayer =  this.map.getLayersByName(trackName)[0];
				
				if (trackLayer){ 
					trackLayer.removeFeatures(trackLayer.features);
				}else{
					// Sets the style for the tracks
					var styleTracks = new OpenLayers.StyleMap({
						strokeColor: this.trackStyle.strokeColorTracks,
						strokeWidth: this.trackStyle.strokeWidthTracks,
						strokeOpacity: this.trackStyle.strokeOpacityTracks
					});
					
					// Creates new vector layer for tracks
					trackLayer = new OpenLayers.Layer.Vector(trackName, {
						styleMap: styleTracks,
						displayInLayerSwitcher: false
					});
					
					 this.map.addLayer(trackLayer);
				}
				
				if(showLine){
					var pointCoord = new Array;
					var geoJsonoObj = Ext.util.JSON.decode(geoJson);
					
					// Cycling the file GeoJSON to capture the coordinates of the markers
					for (i=0; i<geoJsonoObj.features.length; i++) {
						pointCoord.push(
							new OpenLayers.Geometry.Point(
								geoJsonoObj.features[i].geometry.coordinates[0],
								geoJsonoObj.features[i].geometry.coordinates[1]
							)
						);  
					}

					trackLayer.addFeatures([
						new OpenLayers.Feature.Vector(
							new OpenLayers.Geometry.LineString(pointCoord).transform(
								new OpenLayers.Projection("EPSG:4326"),
								 this.map.getProjectionObject()
							)
						)
					]);
				}
			}
		}

		};
		
		return app;
}




