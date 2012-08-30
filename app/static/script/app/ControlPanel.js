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

    var ds = new Ext.data.ArrayStore({
        data: [[123,'One Hundred Twenty Three'],
            ['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'], ['5', 'Five'],
            ['6', 'Six'], ['7', 'Seven'], ['8', 'Eight'], ['9', 'Nine']],
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
	    multiSelect: true,
	    emptyText: 'No cruise to display',
		region:'center',
	    reserveScrollOffset: true,
	    columns: [{
	        width: .5,
	        dataIndex: 'name'
	    }]
	});



	var cruiseViewPanel = new Ext.Panel({
		border: false,
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
				     anchor: '80%',
				     allowBlank: false,
				     msgTarget: 'side'
				},							
				buttons:[
					{
						text:'Save'
					}
				],
				items:[
				{
					xtype:'textfield',
					allowBlank:false,
					fieldLabel:'Name',
					width: 500
				},
				{
					id:'startTime',
		            xtype     : 'datefield',
					allowBlank:false,
					editable: false,
					format:"d/m/Y",
		            fieldLabel: 'Start time',
					width: 500
		        },		
				{
					id:'endTime',
		            xtype     : 'datefield',
					allowBlank:false,
					editable: false,
					format:"d/m/Y",
		            fieldLabel: 'End time',
					width: 500
		        },
				{
					xtype: "fileuploadfield",
					id: "file",
					emptyText: 'Browse for PNG files',
					fieldLabel: 'Watermark picture',
					name: "file",
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
					triggerAction: 'all',
					value: 'South-West',
					width: 500
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
			]
		})
	  ] // cruise panel 		
	});
	
	var contentPanel = {
		id: 'content-panel',
		region: 'center', 
		width:700,
		layout: 'card',
		margins: '2 5 5 0',
		activeItem: 0,
		border: false,
		items: cruiseViewPanel
	};

	new Ext.Viewport({
			layout: 'border',
			title: 'Nurc - Control Panel',
			items: [{
				xtype: 'box',
				region: 'north',
				html:'<h1>Nurc - Control Panel</h1>',
				height: 30
			},{
				layout: 'border',
		    	id: 'cruise-browser',
		        region:'west',
		        border: false,
		        split:true,
				margins: '2 0 5 5',
		        width: 275,
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