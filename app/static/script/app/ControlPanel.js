/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.onReady(function(){
    Ext.QuickTips.init();

    // NOTE: This is an example showing simple state management. During development,
    // it is generally best to disable state management as dynamically-generated ids
    // can change across page loads, leading to unpredictable results.  The developer
    // should ensure that stable state ids are set for stateful components in real apps.    
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    // sample static data for the store
    var myData = [
        ['Rep10', 'model1, model2', 'zoe, laura, giovanna',  '8/20 12:00am', '9/2 12:00am', '<img width="20px" src="./theme/app/img/nurc-logo.png"/> top', '8/20 12:00am'],
        ['Rep11b','model1, model2', 'zoe, laura, giovanna',  '8/20 12:00am', '9/2 12:00am', '<img width="20px" src="./theme/app/img/nurc-logo.png"/>', '8/20 12:00am']
    ];


    // create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'name'},
           {name: 'modelList' },
		   {name: 'vehicleList' },
           {name: 'startTime',  type: 'date',   dateFormat: 'n/j h:ia'},
           {name: 'endTime', type: 'date', dateFormat: 'n/j h:ia'},
		   {name: 'watermark' },
           {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
        ]
    });

    // manually load local data
    store.loadData(myData);

    var vehicles = new Ext.data.ArrayStore({
        data: [
            ['zoe', 'Zoe'], ['laura', 'Laura'], ['noa', 'Noa'], ['jane', 'Jane'] 
		],
        fields: ['value','text'],
        sortInfo: {
            field: 'value',
            direction: 'ASC'
        }
    });

    var models = new Ext.data.ArrayStore({
        data: [
            ['m1', 'Model 1'], ['m2', 'Model 2']
		],
        fields: ['value','text'],
        sortInfo: {
            field: 'value',
            direction: 'ASC'
        }
    });


	var cruiseListView = new Ext.list.ListView({
	    store: store,
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
				var conf = new Object;
					conf.name = 'name';
					conf.description = 'description';
					conf.blob = 'blob';
					conf.owner = 'admin';
				// send a request to the geostore
				var Request = Ext.Ajax.request({
				       url: 'http://localhost:8081/proxy?url=' + Ext.encode('http://localhost:8080/geostore/rest/resources/'),
				       method: 'POST',
				       headers:{
				          'Content-Type' : 'text/xml',
				          'Accept' : 'application/json, text/plain, text/xml',
				          'Authorization' : 'Basic ' + btoa('admin:admin')
				       },
				       params: conf,
				       scope: this,
				       success: function(response, opts){
							console.log(response);
				       },
				       failure:  function(response, opts){
				       		console.log(response);
				       }
				});
			}
		});


	var cruiseViewPanel = new Ext.Panel({
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
				                store: models,
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
				                store: vehicles,
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
	
	cruiseListView.on('click', function(list, index, node, evt){
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
	
	var contentPanel = {
		id: 'content-panel',
		region: 'center', 
		width:700,
		layout: 'fit',
		margins: '2 5 5 0',
		activeItem: 0,
		border: false,
		frame:true,
		items: cruiseViewPanel
	};

	new Ext.Viewport({
			layout: 'border',
			title: 'Nurc - Control Panel',
			items: [{
				xtype: 'box',
				region: 'north',
				border: false,
                height: 75,
				split: true,
				margins:"5 5 5 5",
				html: '<img style="position:absolute; left:0px; z-index:1000" src="./theme/app/img/nurc-logo.png" height="100%"/><div style= "float:right;text-align:left"><h1 style="color:black"></h1></div>',
                bodyStyle: 'padding:0px;background-color: #0055bb;',
				height: 30
			},{
				// layout: 'border',
		    	id: 'cruise-browser',
				title:"Cruise List",
				tbar: [ { 
					icon:'./theme/app/img/silk/add.png', 
					text:"New cruise",
					handler: function(){
						cruiseViewPanel.name.enable();
						cruiseViewPanel.startTime.enable();
						cruiseViewPanel.endTime.enable();
						cruiseViewPanel.watermarkLogo.enable();
						cruiseViewPanel.watermarkPosition.enable();
						cruiseViewPanel.modelSelector.enable();
						cruiseViewPanel.vehicleSelector.enable();
						saveButton.enable();
					}
					} ],
		        region:'west',
		        border: false,
		        split:true,
				margins: '2 0 5 5',
		        width: 150,
		        minSize: 100,
		        maxSize: 500,
				items: cruiseListView
			},
			contentPanel
			
			],
	        renderTo: Ext.getBody()
	    });

    // create the Grid
    /* var grid = new Ext.grid.GridPanel({
        store: store,
        columns: [
            {
                id       :'name',
                header   : 'Name', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'name'
            },
            {
                id       :'modelList',
                header   : 'Models', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'modelList'
            },
            {
                id       :'vehicleList',
                header   : 'Vehicles', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'vehicleList'
            },
            {
                header   : 'Start Time', 
                width    : 85, 
                sortable : true, 
                renderer : Ext.util.Format.dateRenderer('m/d/Y'), 
                dataIndex: 'startTime'
            },
            {
                header   : 'End Time', 
                width    : 85, 
                sortable : true, 
                renderer : Ext.util.Format.dateRenderer('m/d/Y'), 
                dataIndex: 'endTime'
            },
            {
                id       :'watermark',
                header   : 'Watermark', 
                width    : 160, 
                sortable : true, 
                dataIndex: 'watermark'
            },
            {
                header   : 'Last Updated', 
                width    : 85, 
                sortable : true, 
                renderer : Ext.util.Format.dateRenderer('m/d/Y'), 
                dataIndex: 'lastChange'
            },
            {
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                    icon   : './theme/app/img/silk/map_delete.png', 
                    tooltip: 'Delete cruise',
                    handler: function(grid, rowIndex, colIndex) {
                        console.log('Deleted!')
                    }},
					{
	                 icon   : './theme/app/img/silk/map_edit.png', 
	                 tooltip: 'Edit cruise',
	                 handler: function(grid, rowIndex, colIndex) {
	                        console.log('Edit!')
	                }}
                ]
            }
        ],
		buttons:[
			{
				text:'Create new cruise',
				icon:'./theme/app/img/silk/map_add.png',
				handler: function(){
					var win = new Ext.Window({
						title:'Create new cruise',
						icon: "./theme/app/img/silk/map_edit.png",
						border: false,
						width:880,
						resizable: false,
						modal:true,
						items:[
							new Ext.FormPanel({
								frame: true,
								border:false,
							    autoHeight: true,
								bodyStyle: 'padding: 10px 10px 0 10px;',
								fileUpload: true,
								bodyBorder: false,
								// width: 880,
								defaults: {
								     anchor: '75%',
								     allowBlank: false,
								     msgTarget: 'side'
								},							
					
								items:[
									{
										xtype:'textfield',
										allowBlank:false,
										fieldLabel:'Name'
									},
									{
										id:'startTime',
							            xtype     : 'datefield',
										allowBlank:false,
										editable: false,
										format:"d/m/Y",
							            fieldLabel: 'Start time'
							        },		
									{
										id:'endTime',
							            xtype     : 'datefield',
										allowBlank:false,
										editable: false,
										format:"d/m/Y",
							            fieldLabel: 'End time'
							        },
									{
										xtype: "fileuploadfield",
										id: "file",
										emptyText: 'Browse for PNG files',
										fieldLabel: 'Watermark picture',
										name: "file"
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
										triggerAction: 'all',
										value: 'South-West'
									},
									{
									  xtype: 'itemselector',
									  name: 'itemselector',
									  fieldLabel: 'Models',
									  imagePath: './theme/app/img/ext',
									  multiselects: [
												{
									                width: 250,
									                height: 200,
									                store: ds,
									                displayField: 'text',
									                valueField: 'value'
									            },{
									                width: 250,
									                height: 200,
									                store: [['10','Ten']],
									                tbar:[{
									                    text: 'clear',
									                    handler:function(){
										                    // isForm.getForm().findField('itemselector').reset();
										                }
									                }]
									            }]
								    },
									{
									  xtype: 'itemselector',
									  name: 'itemselector',
									  fieldLabel: 'Vehicles',
									  imagePath: './theme/app/img/ext',
									  multiselects: [
												{
									                width: 250,
									                height: 200,
									                store: ds,
									                displayField: 'text',
									                valueField: 'value'
									            },{
									                width: 250,
									                height: 200,
									                store: [['10','Ten']],
									                tbar:[{
									                    text: 'clear',
									                    handler:function(){
										                    // isForm.getForm().findField('itemselector').reset();
										                }
									                }]
									            }]
								    }	        												
								],
								buttons:[
									{ text:'Save'}
								]
							})
							
						]
					});
					win.show();
				}
			}
		],
        stripeRows: true,
        autoExpandColumn: 'name',
        height: 350,
        width: 880,
        title: 'Cruise List',
        // config options for stateful behavior
        stateful: true,
        stateId: 'grid'
    });

    // render the grid to the specified div in the page
    grid.render('control-panel');*/
});