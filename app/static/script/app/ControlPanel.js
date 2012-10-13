var ControlPanel = Ext.extend(Ext.Panel, {

	/** i18n */
	titleText: "Date & Time Options",
	rangeFieldsetText: "Time Range",
	animationFieldsetText: "Animation Options",
	startText: 'Start',
	endText: 'End',
	listOnlyText: 'Use Exact List Values Only',
	stepText: 'Step',
	unitsText: 'Step Units',
	frameRateText: 'Refresh Delay (s)',
	noUnitsText: 'Snap To Time List',
	loopText: 'Loop Animation',
	reverseText: 'Reverse Animation',
	rangeChoiceText: 'Choose the range for the time control',
	rangedPlayChoiceText: 'Playback Mode',

	/**
	 *  the id of the current configuration
	 *  if mapId = -1, the configuration is brand new
	 */
	mapId: -1,
	cruiseListView: null,
	cruisePanelView: null,
	token: null,
	
	// url: 'http://localhost:8080/geostore/rest/resources',
	// urlData: 'http://localhost:8080/geostore/rest/data',
	// xmlJsonTranslateService: "http://localhost:8080/xmlJsonTranslate",
	toggleGroup: "toolGroup",

	constructor: function(config) {

		this.token = config.token;
		this.store = new Ext.data.JsonStore({
			fields: ['id', 'owner', 'name', 'description', 'blob'] /*,
			buffered:true,
			pageSize:2,
			proxy: {
					url: 'foo',
			        type: "pagingmemory",
					reader: 'json'
			       }*/
		});
		this.infoPageBaseUrl = config.infoPageBaseUrl;
		this.fileUploaderServlet = config.fileUploaderServlet;
		this.proxy = config.proxy;
		this.interPageBaseUrl = config.interPageBaseUrl;
		this.imgsBaseUrl = config.imgsBaseUrl;
		this.geostoreBaseUrl = config.geostoreBaseUrl;
		this.url = config.geostoreBaseUrl + 'resources';
		this.urlData = config.geostoreBaseUrl + 'data';

		this.loadCruiseList();

		this.cruiseListView = new Ext.list.ListView({
			store: this.store,
			hideHeaders: true,
			autoScroll: true,
			border: false,
			singleSelect: true,
			emptyText: 'No cruise to display',
			reserveScrollOffset: true,
			columns: [{
				header: 'Name',
				width: .5,
				dataIndex: 'name'
			}]
		});
		this.viewButton = new Ext.Button({
			iconCls: 'gxp-icon-view-map',
			text: 'View',
			ref: '../viewButton',
			disabled: true,
			handler: this.handleViewMap,
			scope: this
		});
		this.saveButton = new Ext.Button({
			iconCls: 'save',
			text: this.mapId === -1 ? 'Save' : 'Update',
			ref: '../saveButton',
			disabled: true,
			handler: this.saveOrUpdate,
			scope: this
		});
		this.deleteButton = new Ext.Button({
			iconCls: 'delete',
			text: 'Delete',
			ref: '../deleteButton',
			disabled: true,
			handler: this.deleteCruise,
			scope: this
		});
		
		this.createButton = new Ext.Button({ 
			icon:'../theme/app/img/silk/add.png', 
			text:"New cruise",
			disabled: true,
			ref:'../createButton',
			handler: this.createCruise,
			scope: this
		});
		
		this.reloadButton = new Ext.Button({ 
			iconCls:'gxp-icon-refresh', 
			text:"Reload",
			disabled: true,
			ref:'../reloadButton',
			handler: this.createLoadCruiseHandler( this ),
			scope: this
		});
		
		this.loginButton =  new Ext.Button({
			iconCls: 'gxp-icon-user',
			text: 'Login',
			ref: '../loginButton',
			handler: function(){
				
				if ( Application.user.isGuest() ){
					var win = new Ext.Window({
						
			            title: 'Enter your credentials',
			            iconCls: 'gxp-icon-user',
			            layout: "fit",
			            width: 275,
						closeAction: 'hide',
			            height: 130,
			            plain: true,
			            border: false,
			            modal: true,
			            items: [{
							xtype:'form',
							ref:'loginForm',
							labelWidth:80,
							frame:true, 
							defaultType:'textfield',
							items:[
								{  
				                	fieldLabel: 'Username',
				                	ref:'../username', 
				                	allowBlank:false,
				                	listeners: {
				                 		beforeRender: function(field) {
				                    		field.focus(false, 1000);
				                  		}
				                	}
				            	},{  
				                	fieldLabel:'Password', 
				                	ref:'../password', 
				                	inputType:'password', 
				                	allowBlank:false
				            	}],
				            buttons:[{ 
				                text: 'Login',
				                iconCls: 'save',
				                formBind: true,
				                scope: this,
				                handler: function submitLogin(){
									if ( win.loginForm.getForm().isValid() ){
										Application.user.login( win.username.getValue(), win.password.getValue());
										win.destroy();
									} else {
										Ext.Msg.show({
												title: 'Cannot login',
												msg: 'You must specify a username and a password.',
												buttons: Ext.Msg.OK,
												icon: Ext.MessageBox.ERROR
										});
									}
								}
				            }],
							keys: [{ 
				                key: [Ext.EventObject.ENTER],
				                scope: this,
				                handler: function submitLogin(){
									if ( win.loginForm.getForm().isValid() ){
										Application.user.login( win.username.getValue(), win.password.getValue());
										win.destroy();
									} else {
										Ext.Msg.show({
												title: 'Cannot login',
												msg: 'You must specify a username and a password.',
												buttons: Ext.Msg.OK,
												icon: Ext.MessageBox.ERROR
										});
									}
								}
				            }]
						}],
			            listeners: {
			                afterRender: function(){
			                    win.loginForm.getForm().clearInvalid();
			                },
			                hide: function(){
			                    win.loginForm.getForm().reset();
			                }
			            }
			        });
			        win.show();
					
				} else {
					Ext.MessageBox.show({
					           title:'Logout',
					           msg: 'You are closing this application. Every unsaved changes will be lost. <br/>Are you sure?',
					           buttons: Ext.MessageBox.YESNO,
					           fn: function(btn){
									if ( btn === 'yes' ){
										Application.user.logout();
									}

							   },
					           icon: Ext.MessageBox.QUESTION
					       });
				}
				
				
			},
			scope: this
		});

		this.fileForm = new Ext.FormPanel({
			border: false,
			width:700,
			fileUpload: true,
			labelWidth: 120,
			// bodyStyle: 'padding: 10px 10px 0 10px;',
			bodyBorder: false,
			defaults: {
				// anchor: '50%',
				allowBlank: false,
				msgTarget: 'side'
			},
			items: [{
				ref: 'fileuploadField',
				allowBlank: false,
				disabled: true,
				xtype: "fileuploadfield",
				emptyText: 'Select a file...',
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
				width: 500
			}]
		});

		var self = this;
		this.cruisePanelView = new Ext.Panel({
			// layout: 'fit',
			
			// layout: { type:'vbox', align: 'center' },
			region:'center',
			width:850,
			
			border: false,
			autoScroll: true,
			listeners: {
			  render: function(p){
			    p.body.on('scroll', function(){
				  // workaround to fix map disalignment bug
			      self.updateMapSize();
			    }, p);
			  }
			},
			items: [
			new Ext.Panel({
				border: false,
				// fileUpload: true,
				// autoScroll: true,
				ref: '../formPanel',
				width:800,
				bodyStyle: 'padding: 10px 10px 0 10px;',
				bodyBorder: false,
				defaults: {
					anchor: '80%',
					allowBlank: false,
					msgTarget: 'side'
				},
				buttons: [
				this.viewButton, this.reloadButton, this.saveButton, this.deleteButton],
				items: [{
					xtype: 'fieldset',
					title: 'General properties',
					labelWidth: 120,
					items: [{
						xtype: 'textfield',
						allowBlank: false,
						fieldLabel: 'Name',
						invalidText: 'A name for the cruise must be specified',
						disabled: true,
						ref: '../../name',
						width: 500
					}, {
						xtype: "hidden",
						id: "fileUrl",
						fieldLabel: 'Watermark picture url',
						name: "fileUrl",
						disabled: true,
						ref: '../../watermarkUrl',
						width: 500
					},
					new Ext.BoxComponent({
						ref: '../../watermarkLogo',
						width:30,
						heigth:30,
						fieldLabel: 'Current Watermark',
						hideLabel: false,
						hidden: true,
					    autoEl: {
					        tag: 'img',
					        src: '../theme/app/img/nurc-logo.png'
					    }
					}),
					this.fileForm,
					{
						xtype: "combo",
						fieldLabel: 'Watermark position',
						invalidText: 'A position must be specified',
						emptyText: 'Select a position...',
						store: [
							["position:absolute;right:5px;top:5px", "North-East"],
							["position:absolute;left:5px;top:5px", "North-West"],
							["position:absolute;right:5px;bottom:5px", "South-East"],
							["position:absolute;left:5px;bottom:5px", "South-West"]
						],
						mode: 'local',
						editable: false,
						forceSelection: true,
						disabled: true,
						triggerAction: 'all',
						// value: 'position:relative;left:5px;bottom:5px',
						ref: '../../watermarkPosition',
						width: 500
					}]
				}, {
					xtype: 'fieldset',
					title: 'Select ocean models',
					items: [{
						xtype: 'itemselector',
						name: 'itemselector',
						// fieldLabel: 'Models',
						imagePath: '../theme/app/img/ext',
						disabled: true,
						ref: '../../modelSelector',
						multiselects: [{
							width: 250,
							height: 200,
							store: config.models,
							displayField: 'title',
							valueField: 'name'
						}, {
							width: 250,
							height: 200,
							displayField: 'title',
							valueField: 'name',
							store: new Ext.data.JsonStore({
									data: [],
									fields: ['format', 'group', 'name', 'opacity', 'selected', 
										'source', 'title', 'transparent', 'visibility', 'ratio', 'elevation', 'styles', 'style']
							}),
							tbar: [{
								text: 'clear',
								handler: function() {
									this.cruisePanelView.modelSelector.reset();
								},
								scope: this
							}]
						}]
					}]
				}, {
					xtype: 'fieldset',
					title: 'Select vehicles',
					buttonAlign: 'left',
					buttons: [{
						id: 'vehicle-selector-btn',
						// ref:'../../../../vehicleSelectorBtn',
						disabled: true,
						text: 'Add vehicle',
						handler: function() {
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
								items: [{
									xtype: "textfield",
									fieldLabel: 'Name',
									invalidText: 'A name must be specified',
									width: 200,
									allowBlank: false,
									ref: 'name'
								}, {
									xtype: 'textfield',
									vtype: 'url',
									invalidText: 'A valid url must be specified',
									fieldLabel: 'Url',
									width: 200,
									allowBlank: false,
									ref: 'url'
								}]
							});
							// open modal window
							var win = new Ext.Window({
								closable: true,
								title: 'Add vehicle',
								// iconCls: "",
								border: false,
								modal: true,
								bodyBorder: false,
								width: 500,
								// height: 200,
								resizable: false,
								items: [
								form],
								buttons: [{
									text: 'Add vehicle',
									formBind: true,
									handler: function() {

										if (form.name.isValid(false) && form.url.isValid(false)) {
											var store = self.cruisePanelView.vehicleSelector.fromMultiselect.store;
											var record = new store.recordType({
												value: form.name.getValue(),
												text: form.name.getValue(),
												url: form.url.getValue()
											});
											self.cruisePanelView.vehicleSelector.fromMultiselect.store.add(
											record);
											win.destroy();
										} else {
											Ext.Msg.show({
												title: 'Invalid values for a vehicle',
												msg: 'Some fields are invalid',
												buttons: Ext.Msg.OK,
												icon: Ext.MessageBox.ERROR
											});
										}

									}
								}]
							});
							win.show();
						}
					}],
					items: [{
						xtype: 'itemselector',
						name: 'itemselector',
						// fieldLabel: 'Vehicles',
						imagePath: '../theme/app/img/ext',
						disabled: true,
						ref: '../../vehicleSelector',
					
						
						multiselects: [{
							width: 250,
							height: 200,
							store: config.vehicles,
							displayField: 'text',
							valueField: 'value'
						}, {
							width: 250,
							height: 200,
							blankText: 'At least one vehicle must be selected',
							allowBlank: false,
							// minSelections: 1,
							store: [],
							tbar: [{
								text: 'clear',
								handler: function() {
									this.cruisePanelView.vehicleSelector.reset();
								},
								scope: this
							}]
						}]
					}]
				}, {
					xtype: 'fieldset',
					title: 'Select backgrounds',
					items: [{
						xtype: 'itemselector',
						name: 'itemselector',
						// fieldLabel: 'Backgrounds',
						imagePath: '../theme/app/img/ext',
						disabled: true,
						ref: '../../backgroundSelector',
						multiselects: [{
							width: 250,
							height: 200,
							store: config.backgrounds,
							displayField: 'text',
							valueField: 'value'
						}, {
							width: 250,
							height: 200,
							allowBlank: false,
							blankText: 'At least one background must be selected',
							store: [],
							tbar: [{
								text: 'clear',
								handler: function() {
									this.cruisePanelView.backgroundSelector.reset();
								},
								scope: this
							}]
						}]
					}]
				}, {
					xtype: 'fieldset',
					title: 'Map Extent',
					items: [{
						xtype: 'panel',
						id: 'tiny-map-panel'
					}]
				},

				// time slider configuration
				{
					xtype: 'fieldset',
					title: this.animationFieldsetText,
					labelWidth: 120,
					ref: '../animationFieldset',
					items: [{
						id: 'startTime',
						xtype: 'datefield',
						allowBlank: false,
						editable: false,
						format: "d/m/Y",
						fieldLabel: 'Start time',
						disabled: true,
						ref: '../../startTime',
						width: 500

					}, {
						id: 'endTime',
						xtype: 'datefield',
						allowBlank: false,
						editable: false,
						format: "d/m/Y",
						fieldLabel: 'End time',
						ref: '../../endTime',
						disabled: true,
						width: 500
					}, {
						fieldLabel: this.frameRateText,
						xtype: 'numberfield',
						allowBlank: false,
						disabled: true,
						ref: '../../rateValueField',
						width: 500
					}, {
						fieldLabel: this.stepText,
						xtype: 'numberfield',
						allowBlank: false,
						disabled: true,
						ref: '../../stepValueField',
						width: 500
					}, {
						fieldLabel: this.unitsText,
						xtype: 'combo',
						store: [
							[OpenLayers.TimeUnit.SECONDS, 'Seconds'],
							[OpenLayers.TimeUnit.MINUTES, 'Minutes'],
							[OpenLayers.TimeUnit.HOURS, 'Hours'],
							[OpenLayers.TimeUnit.DAYS, 'Days'],
							[OpenLayers.TimeUnit.MONTHS, "Months"],
							[OpenLayers.TimeUnit.YEARS, 'Years']
						],
						valueNotFoundText: this.noUnitsText,
						value: OpenLayers.TimeUnit.MINUTES,
						mode: 'local',
						forceSelection: true,
						autoSelect: false,
						editable: false,
						disabled: true,
						triggerAction: 'all',
						ref: '../../stepUnitsField',
						width: 500
					}
					]
				}

				]
			})] // cruise panel 		
		});

		this.nwTextField = new Ext.form.TextField({
			xtype: 'textfield',
			allowBlank: false,
			fieldLabel: 'NW',
			disabled: true
		});
		this.neTextField = new Ext.form.TextField({
			xtype: 'textfield',
			allowBlank: false,
			fieldLabel: 'NE',
			disabled: true
		});
		this.swTextField = new Ext.form.TextField({
			xtype: 'textfield',
			allowBlank: false,
			fieldLabel: 'SW',
			disabled: true
		});
		this.seTextField = new Ext.form.TextField({
			xtype: 'textfield',
			allowBlank: false,
			fieldLabel: 'SE',
			disabled: true
		});

		this.tinyMap = new gxp.Viewer({
			proxy: this.proxy,
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
				}, {
					xtype: 'panel',
					region: 'west',
					layout: 'form',
					labelWidth: 30,
					style: 'padding: 5px',
					width: 200,
					items: [
					this.nwTextField, this.swTextField, this.seTextField, this.neTextField]
				}]
			},

			// configuration of all tool plugins for this application
			tools: [
			/*{
                ptype: "gxp_navigation", toggleGroup: this.toggleGroup,
                actionTarget: {target: "map.tbar", index: 1}
            },*/
			{
				ptype: "gxp_zoomtoextent",
				toggleGroup: this.toggleGroup,
				actionTarget: {
					target: "map.tbar",
					index: 2
				}
			}, {
				ptype: "gxp_zoom",
				toggleGroup: this.toggleGroup,
				actionTarget: {
					target: "map.tbar",
					index: 3
				}
			}, {
				ptype: "gxp_zoombox",
				toggleGroup: this.toggleGroup,
				actionTarget: {
					target: "map.tbar",
					index: 4
				}
			}

			],
			sources: config.sources,
			map: {
				id: "map-viewport",
				// projection: "EPSG:4326",
				layers: [ config.background ]
			}
		});


		var self = this;
		this.tinyMap.on("ready", function() {
			function resetBound() {
				var bounds = self.tinyMap.mapPanel.map.getExtent();		
				
				bounds = new OpenLayers.Bounds( 
								bounds.left.toFixed(2), 
								bounds.bottom.toFixed(2), 
								bounds.right.toFixed(2), 
								bounds.top.toFixed(2));
					
				var proj = new OpenLayers.Projection("EPSG:4326");
				bounds.transform(self.tinyMap.mapPanel.map.getProjectionObject(), proj);
				self.nwTextField.setValue( bounds.left.toFixed(2) );
				self.swTextField.setValue(bounds.bottom.toFixed(2) );
				self.seTextField.setValue(bounds.right.toFixed(2) );
				self.neTextField.setValue(bounds.top.toFixed(2) );
			};

			resetBound();
			self.tinyMap.mapPanel.map.events.register('zoomend', this, function() {
				resetBound();
			});
			self.tinyMap.mapPanel.map.events.register('moveend', this, function() {
				resetBound();
			});

			
			
			// TODO externalize coordinates
			var bounds = new OpenLayers.Bounds(-3.00, 32.55, 23.36, 50.13);
			var proj = new OpenLayers.Projection("EPSG:4326");
			bounds.transform(proj, self.tinyMap.mapPanel.map.getProjectionObject());
			self.tinyMap.mapPanel.map.zoomToExtent( bounds );
		});

		this.updateMapSize = function(){
			self.tinyMap.mapPanel.map.updateSize();
		};

		
		this.cruiseListView.on('click', function(list, index, node, evt) {
			var listItem = self.store.getAt(index).data;
			
			if ( listItem.id !== self.mapId){
				self.loadCruise( listItem.id );
			} else {
				Ext.Msg.show({
						title: 'Cannot select this cruise',
						msg: 'This cruise is already selected.',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.WARN
				});				
			}
			
		});
		
		// the control panel listens to authentication events
		Application.user.on( 'login',  function loginHandler(context){
			Ext.Msg.show({
					title: 'Login successeful',
					msg: 'You are logged in.',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO
			});
			if ( self.mapId !== -1 ){
				self.deleteButton.enable();
				self.saveButton.enable();
			}
			self.createButton.enable();
			self.loginButton.setText('Logout');
			// self.loginButton.setIconClass('logout');
			self.token = context.token;
		} );
		Application.user.on( 'logout',  function logoutHandler( context ){
			self.loginButton.setText('Login');
			self.createButton.disable();
			self.saveButton.disable();
			self.deleteButton.disable();
			// self.loginButton.setIconClass('gxp-icon-user');
			self.token = null;
		} );
		Application.user.on( 'failed',  function loginFailedHandler( context ){
			self.createButton.disable();
			self.token = null;
			Ext.Msg.show({
					title: 'Login failed',
					msg: 'Wrong username or password.',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
			});
			
		} );


	},
	

	getCreateButton: function(){
		return this.createButton;
	},
	
	getLoginButton: function(){
		return this.loginButton;
	},

	getCruiseListView: function() {
		return this.cruiseListView;
	},
	getCruisePanelView: function() {
		return this.cruisePanelView;
	},

	handleViewMap: function() {
		window.open( this.interPageBaseUrl + + this.mapId);
	},

	saveOrUpdate: function() {

		if (this.validateForm()) {
			
			// TODO deal with months (28, 30 days) and years (365)
			function computeDuration( unit ){
				if ( unit === OpenLayers.TimeUnit.SECONDS ){
					return 1000;
				} else if ( unit === OpenLayers.TimeUnit.MINUTES) {
					return 1000*60;
				} else if ( unit === OpenLayers.TimeUnit.HOURS) {
					return 1000*60*60;
				} else if ( unit === OpenLayers.TimeUnit.DAYS) {
					return 1000*60*60*24;
				} else if ( unit === OpenLayers.TimeUnit.MONTHS) {
					return 1000*60*60*24*31;
				} else if ( unit === OpenLayers.TimeUnit.YEARS) {
					return 1000*60*60*24*31*365;
				}
			}
			
			// verify if timeslider params are consistent with each others
			var startTime = this.cruisePanelView.startTime.getValue();
			var endTime = this.cruisePanelView.endTime.getValue();
			var step = this.cruisePanelView.stepValueField.getValue();
			var unit = this.cruisePanelView.stepUnitsField.getValue();
			
			var period = endTime.getTime() - startTime.getTime();
			var stepSize = step * computeDuration(unit);
			
			// console.log(stepSize);
			// console.log(period);
			
			if ( endTime.getTime() <= startTime.getTime() ){
				Ext.Msg.show({
						title: 'Cannot save this configuration',
						msg: 'End date must be after start date',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
			} else if (stepSize > period ){
				Ext.Msg.show({
					title: 'Cannot save this configuration',
					msg: 'Step bigger than time period for animations',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});		
			
			} else {
				if (this.mapId === -1) { // a new configuration is created	
					var filename = this.fileForm.fileuploadField.getValue();
					if (filename && filename !== '') {
						this.save();
					} else {
						Ext.Msg.show({
							title: 'Cannot save this configuration',
							msg: 'Watermark file is not specified.',
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.ERROR
						});				
					}

				} else { // an old conf is updated
					var filename = this.fileForm.fileuploadField.getValue();

					if (filename && filename !== '') { // a new logo is defined, use this one
						this.updateAndUploadFile();
					} else {
						this.update();
					}
				}				
			}
			

		} else {
				Ext.Msg.show({
					title: 'Cannot save this configuration',
					msg: 'Some fields contain invalid values',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
		}

	},
	
	createLoadCruiseHandler: function( caller ){
		return function(){
			caller.loadCruise( caller.mapId, function(){
				Ext.Msg.show({
					title: 'Configuration Reloading',
					msg: 'The configuration has been reloaded successfully',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO
				});
			} );
		};
	},
	
	loadCruise: function(mapId, callback){
		
		var geostore = new GeoStore.Maps({
				authorization: this.token,
				proxy: this.proxy,
				url: this.url
		}).failure(function(response) {
				console.error(response);
				Ext.Msg.show({
					title: 'Cannot read configuration',
					msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
		});

		var self = this;
		geostore.findByPk(mapId, function readCruiseDetailsCallback(data) {

					// get blob as a json object
					var payload = null;
					try {
						// payload = JSON.parse(data.blob);
						payload = Ext.util.JSON.decode(data.blob);
					} catch (e) {
						console.error(e);
					}

					// console.log(payload);
					// reset original values
					self.clean();
					// populate form fields
					self.mapId = data.id;
					self.cruisePanelView.name.setValue(data.name);

					if (payload) {

						self.cruisePanelView.startTime.setValue(Date.parseDate(payload.timeRange[0], "Y-m-d\\TH:i:s.u\\Z"));
						self.cruisePanelView.endTime.setValue(Date.parseDate(payload.timeRange[1], "Y-m-d\\TH:i:s.u\\Z"));
						self.cruisePanelView.watermarkUrl.setValue(payload.watermarkUrl);
						self.cruisePanelView.watermarkPosition.setValue(payload.watermarkPosition);
						self.cruisePanelView.watermarkLogo.setVisible(true);
						self.cruisePanelView.watermarkLogo.getEl().dom.src = self.imgsBaseUrl  + payload.watermarkUrl;

						self.cruisePanelView.stepValueField.setValue(payload.timeStep);
						self.cruisePanelView.rateValueField.setValue(payload.timeFrameRate);
						self.cruisePanelView.stepUnitsField.setValue(payload.timeUnits);

					

						self.updateItemSelector(self.cruisePanelView.vehicleSelector, payload.vehicleSelector.data, 
						function(selected, multiselectItem) {
							return selected[1] === multiselectItem.value;
						});
						self.updateItemSelector(self.cruisePanelView.modelSelector, payload.models, 
						function(selected, multiselectItem) {
							return selected.name === multiselectItem.name;
						});
						self.updateItemSelector(self.cruisePanelView.backgroundSelector, payload.backgrounds, 
						function(selected, multiselectItem) {
							return selected.name === multiselectItem.value;
						});
						
						var bounds = new OpenLayers.Bounds(payload.bounds);
						var proj = new OpenLayers.Projection("EPSG:4326");
						bounds.transform(proj, self.tinyMap.mapPanel.map.getProjectionObject());

						self.tinyMap.mapPanel.map.zoomToExtent( bounds );
						
						if (callback){
							callback();
						}
						
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

				}, {
					full: true
				});
		
	},

	save: function(){
			var self = this;
			this.fileForm.getForm().submit({
				url: self.proxy + encodeURIComponent(self.fileUploaderServlet),
				submitEmptyText: false,
				waitMsg: 'Uploading watermark',
				waitMsgTarget: true,
				reset: true,
				scope: this,
				failure: function(form, action) {
					console.error(action);
					Ext.Msg.show({
						title: "Cannot upload watermark",
						msg: "File does not exist or is not valid.",
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
				},
				success: function(form, action) {
					// var response = JSON.parse(action.response.responseText);
					// console.log(action.response.responseText);
					var response = Ext.util.JSON.decode(action.response.responseText);
					
					if (response.success) {
						// create a configuration
						var conf = ConfigurationBuilder.create({
							name: self.cruisePanelView.name.getValue(),
							description: self.cruisePanelView.name.getValue(),
							// timeRange: [self.cruisePanelView.startTime.getValue().toISOString(), self.cruisePanelView.endTime.getValue().toISOString()],
							timeRange: [self.cruisePanelView.startTime.getValue().format("Y-m-d\\TH:i:s.u\\Z"), 
										self.cruisePanelView.endTime.getValue().format("Y-m-d\\TH:i:s.u\\Z")],
							timeStep: self.cruisePanelView.stepValueField.getValue(),
							timeFrameRate: self.cruisePanelView.rateValueField.getValue(),
							timeUnits: self.cruisePanelView.stepUnitsField.getValue(),
							models: self.cruisePanelView.modelSelector.toMultiselect.store.data.items,
							backgrounds: self.cruisePanelView.backgroundSelector.toMultiselect.store.data.items,
							vehicles: self.cruisePanelView.vehicleSelector.toMultiselect.store.data.items,
							watermarkPosition: self.cruisePanelView.watermarkPosition.getValue(),
							watermarkUrl: response.result.code,
							bounds: [self.nwTextField.getValue(), self.swTextField.getValue(), self.seTextField.getValue(), self.neTextField.getValue()]
						});
						// send a request to the geostore
						var geostore = new GeoStore.Maps({
							authorization: self.token,
							proxy: self.proxy,
							url: self.url
						}).failure(function(response) {
							console.error(response);
							Ext.Msg.show({
								title: 'Cannot save this configuration',
								msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.ERROR
							});
						});
						// send the current conf to the server
						geostore.create(conf, function(newId) {
							Ext.Msg.show({
								title: 'Configuration saved',
								msg: 'configuration saved successfully',
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.INFO
							});
							
							// reload data
							
							self.clean();
							self.mapId = newId;
							
							self.loadCruiseList(function(data){
								var store = data.store;
								var id = self.mapId;
								var item = store.getById(id);
								self.cruiseListView.select(item, false, true);
								self.loadCruise( newId );
								// self.enable();
							});
							
							
						});
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
		},

		update: function( ){
						var self = this;
						// create a configuration
						var conf = ConfigurationBuilder.create({
							name: self.cruisePanelView.name.getValue(),
							description: self.cruisePanelView.name.getValue(),
							// timeRange: [self.cruisePanelView.startTime.getValue().toISOString(), self.cruisePanelView.endTime.getValue().toISOString()],
							timeRange: [self.cruisePanelView.startTime.getValue().format("Y-m-d\\TH:i:s.u\\Z"), 
										self.cruisePanelView.endTime.getValue().format("Y-m-d\\TH:i:s.u\\Z")],
							timeStep: self.cruisePanelView.stepValueField.getValue(),
							timeFrameRate: self.cruisePanelView.rateValueField.getValue(),
							timeUnits: self.cruisePanelView.stepUnitsField.getValue(),
							models: self.cruisePanelView.modelSelector.toMultiselect.store.data.items,
							backgrounds: self.cruisePanelView.backgroundSelector.toMultiselect.store.data.items,
							vehicles: self.cruisePanelView.vehicleSelector.toMultiselect.store.data.items,
							watermarkUrl: self.cruisePanelView.watermarkUrl.getValue(),
							watermarkPosition: self.cruisePanelView.watermarkPosition.getValue(),
							bounds: [self.nwTextField.getValue(), self.swTextField.getValue(), self.seTextField.getValue(), self.neTextField.getValue()]
						});
						// keep the old version for logo file and upload only changes
						var datastore = new GeoStore.Datastore({
							authorization: self.token,
							proxy: self.proxy,
							url: self.urlData
							// url: self.proxy + encodeURIComponent(self.urlData)
						}).failure(function(response) {
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
						self.mapId, conf.blob, function(data) { // callback
							var geostore = new GeoStore.Maps({
									authorization: self.token,
									proxy: self.proxy,
									url: self.url
							}).failure(function(response) {
									console.error(response);
									Ext.Msg.show({
										title: 'Cannot save this configuration',
										msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									});
							});
							// It is necessary to update both metadata and data in two steps!
							geostore.update(
							self.mapId, conf, function(data) { // callback
								Ext.Msg.show({
									title: 'Configuration updated',
									msg: 'configuration updated successfully',
									buttons: Ext.Msg.OK,
									icon: Ext.MessageBox.OK
								});
								// reload data

								// self.clean();

								self.loadCruiseList(function(data){
										var store = data.store;
										var id = self.mapId;
										var item = store.getById(id);
										self.cruiseListView.select(item, false, true);
										self.loadCruise( self.mapId );
										// self.enable();
								});
			
							});
						});			
		},
		
		updateAndUploadFile: function(){
					// reload a new file
					// TODO delete old file from server
					var self = this;
					this.fileForm.getForm().submit({
						url: self.proxy + encodeURIComponent(self.fileUploaderServlet),
						submitEmptyText: false,
						waitMsg: 'Uploading watermark',
						waitMsgTarget: true,
						reset: true,
						scope: this,
						failure: function(form, action) {
							console.error(action);
							Ext.Msg.show({
								title: "Cannot upload watermark",
								msg: action.responseText,
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.ERROR
							});
						},
						success: function(form, action) {
							var response = Ext.util.JSON.decode(action.response.responseText);
							if (response.success) {
								// create a configuration
								var conf = ConfigurationBuilder.create({
									name: self.cruisePanelView.name.getValue(),
									description: self.cruisePanelView.name.getValue(),
									// timeRange: [self.cruisePanelView.startTime.getValue().toISOString(), self.cruisePanelView.endTime.getValue().toISOString()],
									timeRange: [self.cruisePanelView.startTime.getValue().format("Y-m-d\\TH:i:s.u\\Z"), 
												self.cruisePanelView.endTime.getValue().format("Y-m-d\\TH:i:s.u\\Z")],		
									timeStep: self.cruisePanelView.stepValueField.getValue(),
									timeFrameRate: self.cruisePanelView.rateValueField.getValue(),
									timeUnits: self.cruisePanelView.stepUnitsField.getValue(),
									models: self.cruisePanelView.modelSelector.toMultiselect.store.data.items,
									backgrounds: self.cruisePanelView.backgroundSelector.toMultiselect.store.data.items,
									vehicles: self.cruisePanelView.vehicleSelector.toMultiselect.store.data.items,
									watermarkPosition: self.cruisePanelView.watermarkPosition.getValue(),
									watermarkUrl: response.result.code,
									bounds: [self.nwTextField.getValue(), self.swTextField.getValue(), self.seTextField.getValue(), self.neTextField.getValue()]
								});
								var datastore = new GeoStore.Datastore({
									authorization: self.token,
									proxy: self.proxy,
									url: self.urlData
								}).failure(function(response) {
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
								self.mapId, conf.blob, function(data) { // callback
									var geostore = new GeoStore.Maps({
											authorization: self.token,
											proxy: self.proxy,
											url: self.url
									}).failure(function(response) {
											console.error(response);
											Ext.Msg.show({
												title: 'Cannot save this configuration',
												msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
												buttons: Ext.Msg.OK,
												icon: Ext.MessageBox.ERROR
											});
									});
									// It is necessary to update both metadata and data in two steps!
									geostore.update(
									self.mapId, conf, function(data) { // callback
										Ext.Msg.show({
											title: 'Configuration updated',
											msg: 'configuration updated successfully',
											buttons: Ext.Msg.OK,
											icon: Ext.MessageBox.OK
										});
										
										// reload data
												// self.clean();

												self.loadCruiseList(function(data){
														var store = data.store;
														var id = self.mapId;
														var item = store.getById(id);
														self.cruiseListView.select(item, false, true);
														self.loadCruise( self.mapId );
														// self.enable();
												});
									});
								});
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
		},
		
		enable: function() {
			this.cruisePanelView.name.enable();
			this.cruisePanelView.startTime.enable();
			this.cruisePanelView.endTime.enable();
			// this.cruisePanelView.watermarkUrl.enable();
			this.fileForm.fileuploadField.enable();
			this.cruisePanelView.watermarkPosition.enable();
			this.cruisePanelView.modelSelector.enable();
			this.cruisePanelView.vehicleSelector.enable();
			this.cruisePanelView.backgroundSelector.enable();
			
			
			// hack: the following two listeners are needed to cancel invalid reds after a failed save
			var self = this;
			this.cruisePanelView.vehicleSelector.toMultiselect.store.on(
				"add", function(){
					 self.cruisePanelView.vehicleSelector.toMultiselect.clearInvalid();
			});
			this.cruisePanelView.backgroundSelector.toMultiselect.store.on(
				"add", function(){
					 self.cruisePanelView.backgroundSelector.toMultiselect.clearInvalid();
			});
			

			Ext.getCmp('vehicle-selector-btn').enable();

			this.cruisePanelView.stepValueField.enable();
			this.cruisePanelView.rateValueField.enable();
			this.cruisePanelView.stepUnitsField.enable();

			this.saveButton.setText(this.mapId === -1 ? 'Save' : 'Update');
			
			if ( !Application.user.isGuest() ){
				this.saveButton.enable();
				this.deleteButton.enable();
			} else {
				this.saveButton.disable();
				this.deleteButton.disable();
			}
			
			this.viewButton.enable();
			this.reloadButton.enable();

		},

		disable: function() {
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

			this.saveButton.setText('Save');
			this.saveButton.disable();
			this.deleteButton.disable();
			this.viewButton.disable();
			this.reloadButton.disable();
		},

		clean: function() {
			this.cruisePanelView.name.reset();
			this.cruisePanelView.startTime.reset();
			this.cruisePanelView.endTime.reset();
			this.mapId = -1;

			this.cruisePanelView.watermarkLogo.setVisible(false);
			this.cruisePanelView.watermarkLogo.getEl().dom.src = '';

			this.cruisePanelView.stepValueField.reset();
			this.cruisePanelView.rateValueField.reset();
			this.cruisePanelView.stepUnitsField.reset();


			this.cruisePanelView.vehicleSelector.reset();
			this.cruisePanelView.modelSelector.reset();
			this.cruisePanelView.backgroundSelector.reset();
		},

		createCruise: function() {
			this.cruiseListView.clearSelections();
			this.clean();
			this.enable();
			this.deleteButton.disable();
			this.viewButton.disable();
			this.reloadButton.disable();
		},

		loadCruiseList: function( callback ) {
			var self = this;
			var geostore = new GeoStore.Maps({
				authorization: this.token,
				proxy: this.proxy,
				url: this.url
			}).failure(function(response) {
				console.error(response);
				Ext.Msg.show({
					title: 'Cannot get configurations from server',
					msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
			});

			geostore.find(function cruiseListCallback(data) {
				function getStore(){
					return self.store;
				};
				// console.log(data);
				if (callback){
					var handler = function(){
						
						
						callback( self );
						self.store.un( 'load', handler);
					};
					self.store.on( 'load', handler);
				}
				self.store.loadData(data);
			}, {
				full: true
			});
		},

		deleteCruise: function() {
			
			var self = this;
			Ext.MessageBox.show({
			           title:'Logout',
			           msg: 'You are deleting this configuraton forever. This operation cannot be undone. <br/>Are you sure?',
			           buttons: Ext.MessageBox.YESNO,
			           fn: function(btn){
							if ( btn === 'yes' ){
								var geostore = new GeoStore.Maps({
									authorization: self.token,
									proxy: self.proxy,
									url: self.url
								}).failure(function(response) {
									console.error(response);
									Ext.Msg.show({
										title: 'Cannot delete this configuration',
										msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									});
								});
	
								geostore.deleteByPk(self.mapId, function cruiseListCallback(data) {
									// reload data
									self.loadCruiseList();
									self.clean();
									self.disable();
								});
							}

					   },
			           icon: Ext.MessageBox.QUESTION
			       });

		},

		updateItemSelector: function(selector, selectedItems, isEqual) {
			// in this array I keep the list of removed item from the multiselect
			// I need it because it is not safe to delete items within a for loop
			var removed = new Array;
			var availableItems = selector.fromMultiselect.view.store.data.items;
			if (!availableItems || !selectedItems) {
				return;
			}

			for (var i = 0; i < availableItems.length; i++) {
				var item = availableItems[i];

				for (var j = 0; j < selectedItems.length; j++) {

					/*if (reader(selectedItems[j]) === item.data.value) {
						selector.toMultiselect.store.add(item);
						removed.push(item);
					}*/
					
					if (isEqual(selectedItems[j], item.data) ) {
						selector.toMultiselect.store.add(item);
						removed.push(item);
					}
				}
			}

			if (removed.length > 0) {
				for (var i = 0; i < removed.length; i++) {
					selector.fromMultiselect.view.store.remove(removed[i]);
				}
			}
			// tricky: it seems necessary to refresh the content of toMultiselect
			selector.toMultiselect.view.refresh();
			selector.fromMultiselect.view.refresh();
			selector.toMultiselect.view.select([selector.toMultiselect.view.store.getCount() - 1]);
		},



		validateForm: function() {
			return this.cruisePanelView.name.isValid(false) && this.cruisePanelView.startTime.isValid(false) && this.cruisePanelView.endTime.isValid(false) &&
			// this.cruisePanelView.watermarkUrl.isValid(false) &&
			this.cruisePanelView.watermarkPosition.isValid(false) && this.cruisePanelView.modelSelector.isValid(false) && this.cruisePanelView.vehicleSelector.isValid(false) && this.cruisePanelView.backgroundSelector.isValid(false) && this.cruisePanelView.vehicleSelector.toMultiselect.isValid(false) && this.cruisePanelView.backgroundSelector.toMultiselect.isValid(false) && this.cruisePanelView.stepValueField.isValid(false) && this.cruisePanelView.rateValueField.isValid(false) && this.cruisePanelView.stepUnitsField.isValid(false);
		}


	});
