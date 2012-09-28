var ControlPanel =  Ext.extend(Ext.Panel, {
	
	/**
	 *  the id of the current configuration
	 *  if mapId = -1, the configuration is brand new
	 */
	mapId: -1,
	cruiseListView: null,
	cruisePanelView: null,
	// TODO implement authentication
	token: 'Basic ' +  Base64.encode('admin:admin'),
	// TODO externalize
	url: 'http://localhost:8080/geostore/rest/resources/',
	
	constructor: function(config){
		
		var geostore = new GeoStore.Maps(
							{ authorization: 'Basic ' +  Base64.encode('admin:admin'),
							   url: 'http://localhost:8080/geostore/rest/resources/'
							}).failure( function(response){ 
									console.error(response); 
									Ext.Msg.show({
	                                       title: 'Cannot upload configurations',
	                                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
	                                       buttons: Ext.Msg.OK,
	                                       icon: Ext.MessageBox.ERROR
	                                });	
							});
		
		geostore.find(function(data){
				console.log(data);
		}, {full:true});
		
		this.cruiseListView = new Ext.list.ListView({
		    store: config.store,
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

	   this.saveButton = new Ext.Button({
				text: this.mapId === -1 ? 'Save' : 'Update',
				ref:'../saveButton',
				disabled:true,
				handler: this.saveOrUpdate,
				scope: this
			});


		this.cruisePanelView = new Ext.Panel({
			border: false,
			autoScroll:true,
			items:[
				new Ext.FormPanel({
					border:false,
				    // autoHeight: true,
					bodyStyle: 'padding: 10px 10px 0 10px;',
					// fileUpload: true,
					bodyBorder: false,
					// width: 880,
					defaults: {
					     anchor: '80%',
					     allowBlank: false,
					     msgTarget: 'side'
					},							
					buttons:[
					   this.saveButton
					],
					items:[
					{
						xtype:'textfield',
						allowBlank:false,
						fieldLabel:'Name',
						disabled:true,
						ref:'../name',
						width: 500
					},
					{
						id:'startTime',
			            xtype     : 'datefield',
						allowBlank:false,
						editable: false,
						format:"d/m/Y",
			            fieldLabel: 'Start time',
						disabled:true,
						ref:'../startTime',
						width: 500
			        },		
					{
						id:'endTime',
			            xtype     : 'datefield',
						allowBlank:false,
						editable: false,
						format:"d/m/Y",
			            fieldLabel: 'End time',
						ref:'../endTime',
						disabled:true,
						width: 500
			        },
					{
						xtype: "textfield",
						id: "fileUrl",
						fieldLabel: 'Watermark picture url',
						name: "fileUrl",
						disabled:true,
						ref:'../watermarkUrl',
						width: 500
					},
					{
						xtype: "combo",
						fieldLabel: 'Watermark position',
					    hiddenName: 'position',
					    emptyText: 'Select a position...',
						store: new Ext.data.SimpleStore({
						            fields: ['key','value'],
						            data: [
						              ["NE","North-East"],["NW","North-West"],["SE","South-East"],["SW","South-West"]            
						            ]
						        }), 
						displayField: 'value',
						valueField: 'id',
						selectOnFocus: true,
						mode: 'local',
						typeAhead: true,
						editable: false,
						disabled:true,
						triggerAction: 'all',
						value: 'South-West',
						ref:'../watermarkPosition',
						width: 500
					},
					{
					  xtype: 'itemselector',
					  name: 'itemselector',
					  fieldLabel: 'Models',
					  imagePath: './theme/app/img/ext',
					  disabled:true,
					  ref:'../modelSelector',
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
						                },
										scope:this
					                }]
					            }]
				    },
					{
					  xtype: 'itemselector',
					  name: 'itemselector',
					  fieldLabel: 'Vehicles',
					  imagePath: './theme/app/img/ext',
					  disabled:true,
					  ref:'../vehicleSelector',
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
					                store: [],
					                tbar:[{
					                    text: 'clear',
					                    handler:function(){
						 					this.cruisePanelView.vehicleSelector.reset();
						                },
										scope:this
					                }]
					            }]
					}
				]
			})
		  ] // cruise panel 		
		});

		var self = this;
		this.cruiseListView.on('click', function(list, index, node, evt){
			var data = config.store.getAt(index).data;
			
			
			// reset original values
			self.clean();

			// populate fields
			self.cruisePanelView.name.setValue( data.name );
			self.cruisePanelView.startTime.setValue( data.startTime );
			self.cruisePanelView.endTime.setValue( data.endTime );
			self.mapId = data.id;

			// TODO refactor
			var availableVehicles = self.cruisePanelView.vehicleSelector.fromMultiselect.view.store.data.items;
			for (var i=0; i<availableVehicles.length; i++){
				var vehicle = availableVehicles[i];
				var selectedVehicles = data.vehicleList.split(', ');
				for (var j=0; j<selectedVehicles.length; j++){
					if ( selectedVehicles[j] === vehicle.data.value ){
						self.cruisePanelView.vehicleSelector.fromMultiselect.view.store.remove( vehicle );
						self.cruisePanelView.vehicleSelector.toMultiselect.store.add( vehicle );
					}
				}
			}
			
			var availableModels = self.cruisePanelView.modelSelector.fromMultiselect.view.store.data.items;
			for (var i=0; i<availableModels.length; i++){
				var model = availableModels[i];
				var selectedModels = data.modelList.split(', ');
				for (var j=0; j<selectedModels.length; j++){
					if ( selectedModels[j] === model.data.value ){
						self.cruisePanelView.modelSelector.fromMultiselect.view.store.remove( model );
						self.cruisePanelView.modelSelector.toMultiselect.store.add( model );
					}
				}
			}
			// end refactor

			/*var record = self.cruisePanelView.vehicleSelector.fromMultiselect.view.store.getAt(0); 
			self.cruisePanelView.vehicleSelector.fromMultiselect.view.store.remove(record);
			self.cruisePanelView.vehicleSelector.toMultiselect.store.add(record);*/

			// tricky: it seems necessary to refresh the content of toMultiselect
			self.cruisePanelView.vehicleSelector.toMultiselect.view.refresh();
	        self.cruisePanelView.vehicleSelector.fromMultiselect.view.refresh();
	        self.cruisePanelView.vehicleSelector.toMultiselect.view.select(
					[ self.cruisePanelView.vehicleSelector.toMultiselect.view.store.getCount() - 1 ]);
					
			// enable editing
			self.enable();

		});

		
	},
	
	getCruiseListView: function(){
		return this.cruiseListView;
	},
	getCruisePanelView: function(){
		return this.cruisePanelView;
	},
	
	saveOrUpdate: function(){
		// create a configuration with data from the form
		
		/// TODO refactor
		var vehicles = '';
		var selectedVehicles =  this.cruisePanelView.vehicleSelector.toMultiselect.store.data.items;
		for (var i=0; i<selectedVehicles.length; i++){
			vehicles += '"'+ selectedVehicles[i].data.value +'"';
			if ( i < selectedVehicles.length - 1){
				vehicles += ', ';
			}
		}
		
		var models = '';
		var selectedModels =  this.cruisePanelView.modelSelector.toMultiselect.store.data.items;
		for (var i=0; i<selectedModels.length; i++){
			models += '"'+ selectedModels[i].data.value +'"';
			if ( i < selectedModels.length - 1){
				models += ', ';
			}
		}
		
		/// end refactor
		
		
		var conf = new Object;
		conf.name = this.cruisePanelView.name.getValue();
		conf.description = this.cruisePanelView.name.getValue();
		conf.blob = '{ '
					+ '"cruiseName":"'+ this.cruisePanelView.name.getValue() + '",'
					+ '"startTime":"'+ this.cruisePanelView.startTime.getValue().toISOString() + '",'
					+ '"endTime":"'+ this.cruisePanelView.endTime.getValue().toISOString() + '",'
					+ '"vehicles":['+ vehicles + '],'
					+ '"models":['+ models + '],'
					+ '"watermark_url":"'+ this.cruisePanelView.watermarkUrl.getValue() + '",'
					+ '"watermark_position":"'+ this.cruisePanelView.watermarkPosition.getValue() + '"'
					+'" }';					
		conf.owner = 'admin';
		
		console.log(conf);
		// send a request to the geostore
		var geostore = new GeoStore.Maps(
							{ authorization: this.token,
							   url: this.url
							}).failure( function(response){ 
									console.error(response); 
									Ext.Msg.show({
	                                       title: 'Cannot save this configuration',
	                                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
	                                       buttons: Ext.Msg.OK,
	                                       icon: Ext.MessageBox.ERROR
	                                });	
							});
		if ( this.mapId === -1 ){
			geostore.create(conf, function(data){
						Ext.Msg.show({
	                           title: 'Configuration saved',
	                           msg: 'configuration saved successfully',
	                           buttons: Ext.Msg.OK,
	                           icon: Ext.MessageBox.INFO
	                    });
				});			
		} else {
			geostore.update(
					this.mapId, 
					conf,
					function(data){ // callback
                          Ext.Msg.show({
                               title: 'Configuration updated',
                               msg: 'configuration updated successfully',
                               buttons: Ext.Msg.OK,
                               icon: Ext.MessageBox.OK
                          });
				   });
		}
	
	},
	
	enable: function(){
		this.cruisePanelView.name.enable();
		this.cruisePanelView.startTime.enable();
	    this.cruisePanelView.endTime.enable();
		this.cruisePanelView.watermarkUrl.enable();
		this.cruisePanelView.watermarkPosition.enable();
		this.cruisePanelView.modelSelector.enable();
		this.cruisePanelView.vehicleSelector.enable();
		
		this.saveButton.setText( this.mapId===-1 ? 'Save' : 'Update');
		this.saveButton.enable();	
		
	},
	
	disable: function(){
		
	},
	
	clean: function(){
		this.cruisePanelView.name.setValue( '' );
		this.cruisePanelView.startTime.setValue( '' );
		this.cruisePanelView.endTime.setValue( '' );
		this.mapId = -1;
		this.cruisePanelView.vehicleSelector.reset();
		this.cruisePanelView.modelSelector.reset();
	}
	
});



