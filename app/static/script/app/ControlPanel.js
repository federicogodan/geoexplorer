var ControlPanel =  Ext.extend(Ext.Panel, {

    /** i18n */
    titleText: "Date & Time Options",
    rangeFieldsetText: "Time Range",
    animationFieldsetText: "Animation Options",
    startText:'Start',
    endText:'End',
    listOnlyText:'Use Exact List Values Only',
    stepText:'Animation Step',
    unitsText:'Animation Units',
    frameRateText:'Animation Delay (s)',
    noUnitsText:'Snap To Time List',
    loopText:'Loop Animation',
    reverseText:'Reverse Animation',
    rangeChoiceText:'Choose the range for the time control',
    rangedPlayChoiceText:'Playback Mode',

	/**
	 *  the id of the current configuration
	 *  if mapId = -1, the configuration is brand new
	 */
	mapId: -1,
	cruiseListView: null,
	cruisePanelView: null,
	token: null,
	// TODO externalize
	url: 'http://localhost:8080/geostore/rest/resources',
	urlData: 'http://localhost:8080/geostore/rest/data',
	xmlJsonTranslateService: "http://localhost:8080/xmlJsonTranslate",
	toggleGroup: "toolGroup",
	
	constructor: function(config){
		
		this.token = config.token;
		this.store = new Ext.data.JsonStore({
		   fields: ['id', 'owner', 'name', 'description', 'blob']
		});
		

		
		
		
	    this.loadCruiseList();


		this.cruiseListView = new Ext.list.ListView({
		    store: this.store,
			hideHeaders:true,
			border:false,
		    singleSelect : true,
		    emptyText: 'No cruise to display',
		    reserveScrollOffset: true,
		    columns: [{
				header:'Name',
		        width: .5,
		        dataIndex: 'name'
		    }]
		});
	   this.viewButton = new Ext.Button({
				iconCls:'gxp-icon-view-map',
				text: 'View',
				ref:'../viewButton',
				disabled:true,
				handler: this.handleViewMap,
				scope: this
			});
	   this.saveButton = new Ext.Button({
				iconCls:'save',
				text: this.mapId === -1 ? 'Save' : 'Update',
				ref:'../saveButton',
				disabled:true,
				handler: this.saveOrUpdate,
				scope: this
			});
	   this.deleteButton = new Ext.Button({
					iconCls:'delete',
					text: 'Delete',
					ref:'../deleteButton',
					disabled:true,
					handler: this.deleteCruise,
					scope: this
				});		
				
	this.fileForm = new Ext.FormPanel({
			border:false,
			fileUpload: true,
			// bodyStyle: 'padding: 10px 10px 0 10px;',
			bodyBorder: false,
			defaults: {
			     anchor: '50%',
			     allowBlank: false,
			     msgTarget: 'side'
			},
		items:[
			{
			ref:'fileuploadField',
			disabled:true,
            xtype: "fileuploadfield",
            emptyText: 'Select a file...',
			labelWidth:120,
            fieldLabel: 'Watermark file',
            name: "watermarkFile",
            buttonText: "",
            buttonCfg: {
                iconCls: "gxp-icon-filebrowse"
            },
			listeners: {
	                "fileselected": function(cmp, value) {
	                    // remove the path from the filename - avoids C:/fakepath etc.
	                    cmp.setValue(value.split(/[/\\]/).pop());
						// self.filename = cmp.getValue();
	                }
	            },
			width: 300
        	}
		]
	});			
	
	var self = this;			
	this.cruisePanelView = new Ext.Panel({
			border: false,
			autoScroll:true,
			items:[
				new Ext.Panel({
					border:false,
					// fileUpload: true,
					ref: '../formPanel',
					bodyStyle: 'padding: 10px 10px 0 10px;',
					bodyBorder: false,
					defaults: {
					     anchor: '80%',
					     allowBlank: false,
					     msgTarget: 'side'
					},							
					buttons:[
					   this.viewButton, this.saveButton, this.deleteButton
					],
					items:[
						{
		                    xtype: 'fieldset',
		                    title: 'General properties',
		                    labelWidth:120,
		                    items:[
							{
								xtype:'textfield',
								allowBlank:false,
								fieldLabel:'Name',
								invalidText:'A name for the cruise must be specified',
								disabled:true,
								ref:'../../name',
								width: 500
							},
							/*{
								xtype: "textfield",
								id: "fileUrl",
								fieldLabel: 'Watermark picture url',
								name: "fileUrl",
								disabled:true,
								ref:'../../watermarkUrl',
								width: 500
							},*/
							this.fileForm,
							{
								xtype: "combo",
								fieldLabel: 'Watermark position',
								invalidText:'A position must be specified',
							    emptyText: 'Select a position...',
								store: [
								         ["position:absolute;right:5px;top:5px","North-East"],
										 ["position:absolute;left:5px;top:5px","North-West"],
									     ["position:absolute;right:5px;bottom:5px","South-East"],
										 ["position:absolute;left:5px;bottom:5px","South-West"]            
								       ], 
								mode: 'local',
								editable: false,
								forceSelection:true,
								disabled:true,
								triggerAction: 'all',
								// value: 'position:relative;left:5px;bottom:5px',
								ref:'../../watermarkPosition',
								width: 500
							}
							]
						},
						{
		                    xtype: 'fieldset',
		                    title: 'Select models',
		                    items:[
								{
					  				xtype: 'itemselector',
					  				name: 'itemselector',
					  				// fieldLabel: 'Models',
					  				imagePath: '../theme/app/img/ext',
					  				disabled:true,
					  				ref:'../../modelSelector',
					  				multiselects: [
										{
					                	width: 250,
					                	height: 200,
					                	store: config.models,
					                	displayField: 'text',
					                	valueField: 'value'
					            		},{
					                		width: 250,
					                		height: 200,
											displayField: 'text',
											valueField: 'value',
					                		store: [],
					                		tbar:[{
					                    		text: 'clear',
					                    		handler:function(){
													this.cruisePanelView.modelSelector.reset();
						                }	,
										scope:this
					                	}]
					            	}]
				    			}]
						},
						{
		                    xtype: 'fieldset',
		                    title: 'Select vehicles',
							buttonAlign:'left',
							buttons: [
								{
									id:'vehicle-selector-btn',
									// ref:'../../../../vehicleSelectorBtn',
									disabled:true,
									text:'Add vehicle',
									handler: function(){
										var form = new Ext.FormPanel({
											width: 500,
											frame: true,
										    autoHeight: true,
											bodyStyle: 'padding: 10px 10px 0 10px;',
											labelWidth: 50,
											defaults: {
											     anchor: '95%',
											     allowBlank: false,
											     msgTarget: 'side'
											},
											items:[{
									            xtype: "textfield",
									            fieldLabel: 'Name',
												invalidText:'A name must be specified',
												width:200,
												allowBlank:false,
												ref:'name'
									        },{  
												xtype:'textfield',
												vtype:'url',
												invalidText:'A valid url must be specified',
												fieldLabel: 'Url',
												width:200,
												allowBlank:false,
												ref:'url'
											 }
									        ]
										});
										// open modal window
										var win = new Ext.Window({
											       closable:true,
												   title: 'Add vehicle',
												   // iconCls: "",
												   border:false,
												   modal: true, 
												   bodyBorder: false,
												   width: 500,
								                   // height: 200,
								                   resizable: false,
											       items: [ 
														form
											        ],
													buttons: [{
											            text: 'Add vehicle',
											            formBind: true,
											            handler: function(){
												
															if ( form.name.isValid(false) && form.url.isValid(false) ){
																var store = self.cruisePanelView.vehicleSelector.fromMultiselect.store;
																var record = new store.recordType({
																				    value: form.name.getValue(),
																				    text: form.name.getValue(),
																				    url: form.url.getValue()
																				});
																self.cruisePanelView.vehicleSelector.fromMultiselect.store.add( 
																	record
																);
																win.destroy();
															} else {
																Ext.Msg.show({
													                       title: 'Invalid values for a vehicle',
													                       msg: 'Some fields are invalid',
													                       buttons: Ext.Msg.OK,
													                       icon: Ext.MessageBox.ERROR
													            });	
															}
															
														}}]	
												}); 
										win.show();										
									}
								}
							],
		                    items:[
								{
					  				xtype: 'itemselector',
					  				name: 'itemselector',
					  				// fieldLabel: 'Vehicles',
					  				imagePath: '../theme/app/img/ext',
					  				disabled:true,
					  				ref:'../../vehicleSelector',
					  				multiselects: [
										{
					                		width: 250,
					                		height: 200,
					                		store: config.vehicles,
					                		displayField: 'text',
					                		valueField: 'value'
					            		},{
					                		width: 250,
					                		height: 200,
											blankText:'At least one vehicle must be selected',
											allowBlank:false,
					                		store: [],
					                		tbar:[{
					                    		text: 'clear',
					                    		handler:function(){
						 							this.cruisePanelView.vehicleSelector.reset();
						                		},
												scope:this
					                			}]
					            		}]
								}]
					},
					{
	                    xtype: 'fieldset',
	                    title: 'Select backgrounds',
	                    items:[
							{
					  			xtype: 'itemselector',
					  			name: 'itemselector',
					  			// fieldLabel: 'Backgrounds',
					  			imagePath: '../theme/app/img/ext',
					  			disabled:true,
					  			ref:'../../backgroundSelector',
					  			multiselects: [
									{
					                	width: 250,
					                	height: 200,
					                	store: config.backgrounds,
					                	displayField: 'text',
					                	valueField: 'value'
					            	},{
					                	width: 250,
					                	height: 200,
										allowBlank:false,
										blankText:'At least one background must be selected',
					                	store: [],
					                	tbar:[{
					                    	text: 'clear',
					                    	handler:function(){
						 						this.cruisePanelView.backgroundSelector.reset();
						                	},
											scope:this
					                		}]
					                }]
						    }]
					},
					{
						xtype:'fieldset',
						title:'Map Extent',
						items:[
							{
								xtype: 'panel',
								id: 'tiny-map-panel'			
							}
						]
					},
					
					// time slider configuration
				 	{
	                    xtype: 'fieldset',
	                    title: this.animationFieldsetText,
	                    labelWidth:120,
						ref: '../animationFieldset',
	                    items: [
						{
							id:'startTime',
					        xtype     : 'datefield',
							allowBlank:false,
							editable: false,
							format:"d/m/Y",
					        fieldLabel: 'Start time',
							disabled:true,
							ref:'../../startTime',
							width: 500
					        
						},		
						{
							id:'endTime',
					        xtype     : 'datefield',
							allowBlank:false,
							editable: false,
							format:"d/m/Y",
					        fieldLabel: 'End time',
							ref:'../../endTime',
							disabled:true,
							width: 500
					    },
	                    {
	                        fieldLabel: this.frameRateText,
	                        xtype: 'numberfield',
							allowBlank:false,
							disabled:true,
	                        ref: '../../rateValueField',
							width: 500
	                    },{
	                        fieldLabel: this.stepText,
	                        xtype: 'numberfield',
							allowBlank:false,
							disabled:true,
	                        ref: '../../stepValueField',
							width: 500
	                    }, {
	                        fieldLabel: this.unitsText,
	                        xtype: 'combo',
	                        store: [
	                            [OpenLayers.TimeUnit.SECONDS,'Seconds'], 
	                            [OpenLayers.TimeUnit.MINUTES,'Minutes'], 
	                            [OpenLayers.TimeUnit.HOURS,'Hours'], 
	                            [OpenLayers.TimeUnit.DAYS,'Days'], 
	                            [OpenLayers.TimeUnit.MONTHS,"Months"], 
	                            [OpenLayers.TimeUnit.YEARS,'Years']
	                        ],
	                        valueNotFoundText:this.noUnitsText,
	                        mode:'local',
	                        forceSelection:true,
	                        autoSelect:false,
	                        editable:false,
							disabled:true,
	                        triggerAction:'all' ,
	                        ref: '../../stepUnitsField',
							width: 500
	                    }/*,{
	                        //TODO: provide user information about these modes (Change to radio group?)
	                        fieldLabel:this.rangedPlayChoiceText,
	                        xtype:'gxp_playbackmodecombo',
	                        timeAgents: this.timeManager && this.timeManager.timeAgents,
	                        anchor:'-5' ,
	                        listeners:{
	                            'modechange':this.setPlaybackMode,
	                            scope:this
	                        },
	                        ref:'../playbackModeField'
	                    }*/]
	                }/*,
	                {
	                    xtype:'checkbox',
	                    boxLabel:this.loopText,
	                    // handler:this.setLoopMode,
	                    scope:this // ,
	                    // ref:'../loopModeCheck'
	                }*/
					
				]
			})
		  ] // cruise panel 		
		});
		
		this.nwTextField = new Ext.form.TextField({
			xtype:'textfield',
			allowBlank:false,
			fieldLabel:'NW',
			disabled:true
		});
		this.neTextField = new Ext.form.TextField({
			xtype:'textfield',
			allowBlank:false,
			fieldLabel:'NE',
			disabled:true
		});
		this.swTextField = new Ext.form.TextField({
			xtype:'textfield',
			allowBlank:false,
			fieldLabel:'SW',
			disabled:true
		});
		this.seTextField = new Ext.form.TextField({
			xtype:'textfield',
			allowBlank:false,
			fieldLabel:'SE',
			disabled:true
		});
		
		var tinyMap = new gxp.Viewer({
			proxy:'/http_proxy/proxy?url=',
			defaultSourceType: "gxp_wmssource",
	        portalConfig: {
	            renderTo: 'tiny-map-panel',
	            layout: "border",
	            width: 500,
	            height: 200,
	            border: false,
	            items: [{
	                xtype: "panel",
	                region: "center",
					layout: 'fit',
	                border: false,
	                items: ["map-viewport"]
	            },{
					xtype:'panel',
					region:'west',
					layout: 'form',
					labelWidth : 30,
					style : 'padding: 5px',
					width:200,
					items:[
						this.nwTextField,
						this.swTextField,
						this.seTextField,
						this.neTextField
					]
				}]
	        },

	        // configuration of all tool plugins for this application
	        tools: [
			/*{
                ptype: "gxp_navigation", toggleGroup: this.toggleGroup,
                actionTarget: {target: "map.tbar", index: 1}
            },*/
			{
	            ptype: "gxp_zoomtoextent", toggleGroup: this.toggleGroup,
	            actionTarget: {target: "map.tbar", index: 2}
	        }, {
	            ptype: "gxp_zoom", toggleGroup: this.toggleGroup,
	            actionTarget: {target: "map.tbar", index: 3}
	        },
			{
                ptype: "gxp_zoombox", toggleGroup: this.toggleGroup,
                actionTarget: {target: "map.tbar", index: 4}
            }
	
			],
			
			
			// "http://localhost:8080/http_proxy/proxy?q=" + encodeURIComponent( "http://geos3.nurc.nato.int/geoserver/ows" )
            // "url": "http://geos3.nurc.nato.int/geoserver/ows",

	        // layer sources
	        sources: {
	            geos: {
	               	ptype: "gxp_wmssource",
		            title: "geos", 
		            version: "1.1.1",
					url: "http://geos3.nurc.nato.int/geoserver/ows",
					layerBaseParams: {
						TILED: true,
						TILESORIGIN: "-180,-90" 
					}
	            }
	        },

	        // map and layers
	        map: {
	            id: "map-viewport", // id needed to reference map in items above
	            // title: "Map",
	            projection: "EPSG:4326",
	            layers: [{
		            "format": "image/jpeg",
		            "transparent": false,
		            "source": "geos",
		            "group": "background",
		            "name": "nurcbg",
		            "title": "Nurc Background"
		        }],
	            items: []
	        }
	    });
	
	
		var self = this;
	    tinyMap.on("ready", function(){ 
		    function resetBound(){
				var extent = tinyMap.mapPanel.map.getExtent();
				   self.nwTextField.setValue( extent.left );
				   self.swTextField.setValue( extent.bottom );
				   self.seTextField.setValue( extent.right );
				   self.neTextField.setValue( extent.top );
			};
			
			resetBound();
			tinyMap.mapPanel.map.events.register('zoomend', this, function() {
				resetBound();
		    });
			tinyMap.mapPanel.map.events.register('moveend', this, function() {
				resetBound();
		    });
		
			// TODO externalize
			tinyMap.mapPanel.map.zoomToExtent([-3.0024875,32.5526245,23.3647,50.1307495]);
		});
			
		

		var self = this;
		this.cruiseListView.on('click', function(list, index, node, evt){
			var listItem = self.store.getAt(index).data;
			
			
			var geostore = new GeoStore.Maps(
									{ authorization: self.token,
									   url: self.url
									}).failure( function(response){ 
											console.error(response); 
											Ext.Msg.show({
			                                       title: 'Cannot read configuration',
			                                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
			                                       buttons: Ext.Msg.OK,
			                                       icon: Ext.MessageBox.ERROR
			                                });	
									});

			geostore.findByPk(listItem.id, function readCruiseDetailsCallback(data){
					
					// get blog as a json object
				    var payload = null;
				    try{
				 		payload = JSON.parse( data.blob );
					} catch(e){
						console.error(e);
					}

					// console.log(payload);
					// reset original values
					self.clean();
					// populate form fields
					self.mapId = data.id;
					self.cruisePanelView.name.setValue( data.name );
					
					if ( payload ){
						
						self.cruisePanelView.startTime.setValue( Date.parseDate(payload.timeRange[0], "Y-m-d\\TH:i:s.u\\Z") );
						self.cruisePanelView.endTime.setValue( Date.parseDate(payload.timeRange[1], "Y-m-d\\TH:i:s.u\\Z") );
						// self.cruisePanelView.watermarkUrl.setValue( payload.watermarkUrl );
						self.cruisePanelView.watermarkPosition.setValue( payload.watermarkPosition );					
						
						self.cruisePanelView.stepValueField.setValue( payload.timeStep );
						self.cruisePanelView.rateValueField.setValue( payload.timeFrameRate );
						self.cruisePanelView.stepUnitsField.setValue( payload.timeUnits );
						
						self.updateItemSelector( self.cruisePanelView.vehicleSelector, payload.vehicleSelector.data, function(item){ return item[1]; } );
						self.updateItemSelector( self.cruisePanelView.modelSelector, payload.models, function(item){ return item.name; } );
						self.updateItemSelector( self.cruisePanelView.backgroundSelector, payload.backgrounds, function(item){ return item.name; } );	
					
						tinyMap.mapPanel.map.zoomToExtent( payload.bounds );
					} else {
						Ext.Msg.show({
		                       title: 'Cannot load this configuration properly',
		                       msg: 'The format read from server is unknown',
		                       buttons: Ext.Msg.OK,
		                       icon: Ext.MessageBox.ERROR
		                });
					}

					// enable editing
					self.enable();
			
				}, {full:true});

		});

		
	},
	
	getCruiseListView: function(){
		return this.cruiseListView;
	},
	getCruisePanelView: function(){
		return this.cruisePanelView;
	},
	
	handleViewMap: function(){
		var url = location.protocol + "//" + location.hostname + 
		      (location.port && ":" + location.port) + '/MapStore/informational/?mapId=' + this.mapId;
		window.open(url);
	},
	
	saveOrUpdate: function(){
		if ( this.validateForm() ){		
			var self = this;
			this.fileForm.getForm().submit({
                url: 'http://localhost:8080/xmlJsonTranslate-gliders/FileUploader', 
                submitEmptyText: false,
                waitMsg: 'Uploading watermark',
                waitMsgTarget: true,
                reset: true,
                scope: this,
				failure: function(form, action){
					console.error(action);
					 Ext.Msg.show({
                       title: "Cannot upload watermark",
                       msg: action.responseText,
                       buttons: Ext.Msg.OK,
                       icon: Ext.MessageBox.ERROR
                    });
				},
				success:function(form, action){
					var response = JSON.parse(action.response.responseText);
					if ( response.success ){
							// when the watermark is uploaded, I can create the new configuration
							// TODO is something goes wrong, the uploaded file should be deleted
							
													var vehicles = this.createVehicleConfigurationFormSelector( this.cruisePanelView.vehicleSelector );
													var models = this.createModelConfigurationFormSelector( this.cruisePanelView.modelSelector );
													var backgrounds = this.createBackgroundConfigurationFormSelector( this.cruisePanelView.backgroundSelector );


													var conf = new Object;
													conf.name = self.cruisePanelView.name.getValue();
													conf.description = self.cruisePanelView.name.getValue();
													conf.blob = '{ '
																+ '"cruiseName":"'+ self.cruisePanelView.name.getValue() + '",'
																+ '"timeRange":["'+ self.cruisePanelView.startTime.getValue().toISOString() 
																		+ '","'+ self.cruisePanelView.endTime.getValue().toISOString() + '"],'
															    + '"timeStep":"' + self.cruisePanelView.stepValueField.getValue() + '",'
																+ '"timeFrameRate":"' + self.cruisePanelView.rateValueField.getValue() + '",'
																+ '"timeUnits":"' + self.cruisePanelView.stepUnitsField.getValue() + '",'
																+ '"models":['+ models + '],'
																+ '"backgrounds":['+ backgrounds + '],'
															//	+ '"watermarkUrl":"'+ this.cruisePanelView.watermarkUrl.getValue() + '",'
														 	   + '"watermarkUrl":"'+ response.result.code + '",'
																+ '"watermarkPosition":"'+ this.cruisePanelView.watermarkPosition.getValue() + '",'

																+ '"bounds":['  
																+	self.nwTextField.getValue(  ) + ','
																+   self.swTextField.getValue(  ) + ','
																+   self.seTextField.getValue(  ) + ','
																+   self.neTextField.getValue(  )
																+ '],'

															   + '"vehicleSelector": {' 
															   +	'"data":['
																		+ vehicles
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

													// console.log( conf );

													// send a request to the geostore
													var geostore = new GeoStore.Maps(
																		{ authorization: self.token,
																		   url: self.url
																		}).failure( function(response){ 
																				console.error(response); 
																				Ext.Msg.show({
												                                       title: 'Cannot save this configuration',
												                                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
												                                       buttons: Ext.Msg.OK,
												                                       icon: Ext.MessageBox.ERROR
												                                });	
																		});
													if ( self.mapId === -1 ){
														// var self = this;
														geostore.create(conf, function(data){
																	Ext.Msg.show({
												                           title: 'Configuration saved',
												                           msg: 'configuration saved successfully',
												                           buttons: Ext.Msg.OK,
												                           icon: Ext.MessageBox.INFO
												                    });
																	// reload data
																	self.loadCruiseList();
																	
																	// user can view and delete now
																	self.deleteButton.enable();	
																	self.viewButton.enable();
																	self.saveButton.setText('Update');
															});			
													} else {
														// var self = this;
														var datastore = new GeoStore.Datastore(
																				{ authorization: self.token,
																				   url: self.urlData
																				}).failure( function(response){ 
																						console.error(response); 
																						Ext.Msg.show({
														                                       title: 'Cannot save this configuration',
														                                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
														                                       buttons: Ext.Msg.OK,
														                                       icon: Ext.MessageBox.ERROR
														                                });	
																				});	

														// data in blob are saved separately
														datastore.update(
																self.mapId, 
																conf.blob,
																function(data){ // callback
																	// It is necessary to update both metadata and data in two steps!
																	geostore.update(
																			self.mapId, 
																			conf,
																			function(data){ // callback
																				Ext.Msg.show({
															                               title: 'Configuration updated',
															                               msg: 'configuration updated successfully',
															                               buttons: Ext.Msg.OK,
															                               icon: Ext.MessageBox.OK
															                    });
																				// reload data
																				self.loadCruiseList();
																		   });

													   });

											  }							
							
							
							
							
							
					} else {
						 Ext.Msg.show({
	                       title: "Cannot upload watermark",
	                       msg: response.errorMessage,
	                       buttons: Ext.Msg.OK,
	                       icon: Ext.MessageBox.ERROR
	                    });
					}
				}
            });						
		} else {
			Ext.Msg.show({
				       title: 'Cannot save this configuration',
				       msg: 'Some fields contain invalid values',
				       buttons: Ext.Msg.OK,
				       icon: Ext.MessageBox.ERROR
				   });				
		}
	
	},
	
	handleSuccess: function(response){
		
	},
	
	enable: function(){
		this.cruisePanelView.name.enable();
		this.cruisePanelView.startTime.enable();
	    this.cruisePanelView.endTime.enable();
		// this.cruisePanelView.watermarkUrl.enable();
		// console.log(this.fileForm);
		this.fileForm.fileuploadField.enable();
		this.cruisePanelView.watermarkPosition.enable();
		this.cruisePanelView.modelSelector.enable();
		this.cruisePanelView.vehicleSelector.enable();
		this.cruisePanelView.backgroundSelector.enable();
		
		Ext.getCmp('vehicle-selector-btn').enable();
		
		this.cruisePanelView.stepValueField.enable();
		this.cruisePanelView.rateValueField.enable();
		this.cruisePanelView.stepUnitsField.enable();
		
		this.saveButton.setText( this.mapId===-1 ? 'Save' : 'Update');
		this.saveButton.enable();	
		this.deleteButton.enable();	
		this.viewButton.enable();	
		
	},
	
	disable: function(){
		this.cruisePanelView.name.disable();
		this.cruisePanelView.startTime.disable();
	    this.cruisePanelView.endTime.disable();
		// this.cruisePanelView.watermarkUrl.disable();
		this.fileForm.fileuploadField.disable();
		this.cruisePanelView.watermarkPosition.disable();
		this.cruisePanelView.modelSelector.disable();
		this.cruisePanelView.vehicleSelector.disable();
		this.cruisePanelView.backgroundSelector.disable();
		
		Ext.getCmp('vehicle-selector-btn').disable();
		
		this.cruisePanelView.stepValueField.disable();
		this.cruisePanelView.rateValueField.disable();
		this.cruisePanelView.stepUnitsField.disable();
		
		this.saveButton.setText( 'Save' );
		this.saveButton.disable();	
		this.deleteButton.disable();	
		this.viewButton.disable();	
	},
	
	clean: function(){
		this.cruisePanelView.name.setValue( '' );
		this.cruisePanelView.startTime.setValue( '' );
		this.cruisePanelView.endTime.setValue( '' );
		this.mapId = -1;
		
		
		this.cruisePanelView.stepValueField.setValue( '' );
		this.cruisePanelView.rateValueField.setValue( '' );
		this.cruisePanelView.stepUnitsField.setValue( '' );
		
		
		this.cruisePanelView.vehicleSelector.reset();
		this.cruisePanelView.modelSelector.reset();
		this.cruisePanelView.backgroundSelector.reset();
	},
	
	createCruise: function(){
		this.clean();
		this.enable();
		this.deleteButton.disable();	
		this.viewButton.disable();
	},
	
	loadCruiseList: function(){
		var self = this;
		var geostore = new GeoStore.Maps(
							{ authorization: this.token,
							   url: this.url
							}).failure( function(response){ 
									console.error(response); 
									Ext.Msg.show({
	                                       title: 'Cannot get configurations from server',
	                                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
	                                       buttons: Ext.Msg.OK,
	                                       icon: Ext.MessageBox.ERROR
	                                });	
							});
		
		geostore.find(function cruiseListCallback(data){
			console.log(data);
			self.store.loadData(data);
		}, {full:true});
	},
	
	deleteCruise: function(){
		
		var geostore = new GeoStore.Maps(
							{ authorization: this.token,
							   url: this.url
							}).failure( function(response){ 
									console.error(response); 
									Ext.Msg.show({
	                                       title: 'Cannot delete this configuration',
	                                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
	                                       buttons: Ext.Msg.OK,
	                                       icon: Ext.MessageBox.ERROR
	                                });	
							});
		
		var self = this;
		geostore.deleteByPk(this.mapId, function cruiseListCallback(data){
			// reload data
			self.loadCruiseList();
			self.clean();
			self.disable();
		});
		
	
	},
	
	updateItemSelector: function( selector, selectedItems, reader ){
			// in this array I keep the list of removed item from the multiselect
			// I need it because it is not safe to delete items within a for loop
			var removed = new Array;
			var availableItems = selector.fromMultiselect.view.store.data.items;
			if (!availableItems || !selectedItems){
				return;
			}
			
			for (var i=0; i<availableItems.length; i++){
				var item = availableItems[i];
				
				for (var j=0; j<selectedItems.length; j++){
					
					if ( reader(selectedItems[j]) === item.data.value ){
						selector.toMultiselect.store.add( item );
						removed.push( item );
					}
				}
			}
			
			if ( removed.length > 0 ){
				for (var i=0; i<removed.length; i++){
					selector.fromMultiselect.view.store.remove( removed[i] );
				}
			}
			// tricky: it seems necessary to refresh the content of toMultiselect
			selector.toMultiselect.view.refresh();
	        selector.fromMultiselect.view.refresh();
	        selector.toMultiselect.view.select(
					[ selector.toMultiselect.view.store.getCount() - 1 ]);	
	},
	
	
	createVehicleConfigurationFormSelector: function( selector ){
		var result = '';
		var selected =  selector.toMultiselect.store.data.items;
		
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
	
	createModelConfigurationFormSelector: function( selector ){
		var result = '';
		var selected =  selector.toMultiselect.store.data.items;
		
		for (var i=0; i<selected.length; i++){
			
			var item = selected[i].data;
			
			result += '{';
			result +=  '"format": "image/png8",'
		             + '"group": "Gliders",'
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
	
	createBackgroundConfigurationFormSelector: function( selector ){
		var result = '';
		var selected =  selector.toMultiselect.store.data.items;
		
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
	
	validateForm: function(){
		return this.cruisePanelView.name.isValid(false) &&
			this.cruisePanelView.startTime.isValid(false) &&
	    	this.cruisePanelView.endTime.isValid(false) &&
			// this.cruisePanelView.watermarkUrl.isValid(false) &&
			this.cruisePanelView.watermarkPosition.isValid(false) &&
			this.cruisePanelView.modelSelector.isValid(false) &&
			this.cruisePanelView.vehicleSelector.isValid(false) &&
			this.cruisePanelView.backgroundSelector.isValid(false) &&	
			this.cruisePanelView.vehicleSelector.toMultiselect.isValid(false) &&
			this.cruisePanelView.backgroundSelector.toMultiselect.isValid(false) &&
			this.cruisePanelView.stepValueField.isValid(false) &&
			this.cruisePanelView.rateValueField.isValid(false) &&
			this.cruisePanelView.stepUnitsField.isValid(false);
	}
	

});



