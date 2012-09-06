var ControlPanel =  Ext.extend(Ext.Panel, {
	
	cruiseListView: null,
	cruisePanelView: null,
	
	constructor: function(config){
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

	   var saveButton = new Ext.Button({
				text:'Save',
				ref:'../saveButton',
				disabled:true,
				handler: function(){
					// create a configuration with data from the form
					var conf = new Object;
					conf.name = 'name';
					conf.description = 'description';
					conf.blob = 'blob';
					conf.owner = 'admin';
					// send a request to the geostore
					var geostore = new GeoStore.Maps(
									{ authorization: 'Basic ' + btoa('admin:admin'),
									   url: 'http://localhost:8080/geostore/rest/resources/'
									}).failure( function(response){ 
											console.error(response); 
											Ext.Msg.show({
			                                       title: 'Cannot save this configuration',
			                                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
			                                       buttons: Ext.Msg.OK,
			                                       icon: Ext.MessageBox.ERROR
			                                });	
									});
					geostore.create(conf, function(data){
							Ext.Msg.show({
	                               title: 'Configuration saved',
	                               msg: 'configuration saved successfully',
	                               buttons: Ext.Msg.OK,
	                               icon: Ext.MessageBox.INFO
	                        });
					});
				}
			});


		this.cruisePanelView = new Ext.Panel({
			border: false,
			autoScroll:true,
			items:[
				new Ext.FormPanel({
					border:false,
				    // autoHeight: true,
					bodyStyle: 'padding: 10px 10px 0 10px;',
					fileUpload: true,
					bodyBorder: false,
					// width: 880,
					defaults: {
					     anchor: '80%',
					     allowBlank: false,
					     msgTarget: 'side'
					},							
					buttons:[
					   saveButton
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
						xtype: "fileuploadfield",
						id: "file",
						emptyText: 'Browse for PNG files',
						fieldLabel: 'Watermark picture',
						name: "file",
						disabled:true,
						ref:'../watermarkLogo',
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
					  // disabled:true,
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
						                    // isForm.getForm().findField('itemselector').reset();
											cruiseViewPanel.modelSelector.reset();
						                }
					                }]
					            }]
				    },
					{
					  xtype: 'itemselector',
					  name: 'itemselector',
					  fieldLabel: 'Vehicles',
					  imagePath: './theme/app/img/ext',
					  // disabled:true,
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
						 					cruiseViewPanel.vehicleSelector.reset();
						                }
					                }]
					            }]
					}
				]
			})
		  ] // cruise panel 		
		});

		this.cruiseListView.on('click', function(list, index, node, evt){
			var data = store.getAt(index).data;

			cruiseViewPanel.name.setValue( data.name );
			cruiseViewPanel.startTime.setValue( data.startTime );
			cruiseViewPanel.endTime.setValue( data.endTime );

			var record = cruiseViewPanel.vehicleSelector.fromMultiselect.view.store.getAt(0); 

			cruiseViewPanel.vehicleSelector.fromMultiselect.view.store.remove(record);
			cruiseViewPanel.vehicleSelector.toMultiselect.store.add(record);

			cruiseViewPanel.vehicleSelector.toMultiselect.view.refresh();
	        cruiseViewPanel.vehicleSelector.fromMultiselect.view.refresh();

	        cruiseViewPanel.vehicleSelector.toMultiselect.view.select(
					[ cruiseViewPanel.vehicleSelector.toMultiselect.view.store.getCount() - 1 ]);

		});

		
	},
	
	getCruiseListView: function(){
		return this.cruiseListView;
	},
	getCruisePanelView: function(){
		return this.cruisePanelView;
	},
	
	save: function(){
		
	}
	
});



