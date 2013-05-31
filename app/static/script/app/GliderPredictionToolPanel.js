var GliderPredictionToolPanel = Ext.extend(Ext.Panel, {

    gliderPanelView: null,
    glidetListView: null,

    constructor: function(config) {
        
        this.glider_names = config.glider_names;
        this.geoserverBaseUrl = config.geoserverBaseUrl;
        this.proxy = config.proxy;
        this.geostoreBaseUrl = config.geostoreBaseUrl;
        this.glider_resources = config.glider_resources;

        // create an instance of geostore client
        this.geostore = new Resources({
            //authorization: "Basic YWRtaW46YWRtaW4=",
            proxy: this.proxy,
            baseUrl: config.geostoreBaseUrl
        });


        this.reloadListButton = new Ext.Button({
            iconCls:'gxp-icon-refresh', 
            ref:'../reloadListButton',
            handler: function(){
                            var self = this;
                            var handler = function(){
                                self.glider_resources.un( 'load', handler);
                            };
                            this.glider_resources.on( 'load', handler);
                            this.glider_resources.reload();
                        },
            tooltip: 'Reload glider list',
            scope: this         
        });

        this.editButton = new Ext.Button({ 
            iconCls: "edit", 
            tooltip:'Edit batch',
            disabled: true,
            ref:'../editButton',
            handler: this.editBatch,
            scope: this
        });


        this.deleteButton = new Ext.Button({ 
            //icon:'../theme/app/img/silk/delete.png', 
            iconCls: "delete",
            // text:"New cruise",
            tooltip:'Delete batch',
            disabled: true,
            ref:'../deleteButton',
            handler: this.deleteBatch,
            scope: this
        });

        
        // list of cruise configurations
        this.gliderListView = new Ext.list.ListView({
            store: this.glider_resources,
            hideHeaders: true,
            autoScroll: true,
            border: false,
            singleSelect: true,
            emptyText: 'No glider batch configuration to display',
            reserveScrollOffset: true,
            columns: [{
                header: 'Name',
                //width: .5,
                dataIndex: 'name',
            }],
            listeners:{
                /*click: {
                        fn:this.clickHandler,
                        scope: this
                },*/
                selectionchange:{
                    fn: this.gListSelChangeHnd,
                    scope: this
                }
            },
            ref: 'glidersListView'
        });
        
        this.saveButton = new Ext.Button({
            iconCls: 'save',
            text: 'Save',
            ref: '../saveButton',
            // disabled: true,
            handler: this.validate,
            scope: this
        });

        this.onDemandButton = new Ext.Button({
            iconCls:'gxp-icon-import-kml', 
            // text:"Reload",
            // disabled: true,
            ref:'../onDemandButton',
            handler: function(){alert('onDemand')},
            tooltip: 'Start a simulation',
            scope: this         
        });
        
        var self = this;        
        this.gliderPanelView = new Ext.Panel({
            
            title: 'Glider Prediction Tool',
            //region:'center',
            id: 'glider-panel-view',
            width:850,
            border: false,
            autoScroll: true,
            layout:'hbox',
            layoutConfig: {
                padding:'5',
                pack:'center',
                align:'middle'
            },
            items: [
            new Ext.FormPanel({
                region:'center',
                border: false,
                ref: 'formPanel',
                width:800,
                bodyStyle: 'padding: 10px 10px 0 10px;',
                bodyBorder: false,
                defaults: {
                    anchor: '80%',
                    allowBlank: false,
                    msgTarget: 'side'
                },
                buttons: [this.saveButton],
                items: [{
                    xtype: 'fieldset',
                    title: 'Glider Path Prediction Tool',
                    //anchor: '100%',
                    //labelWidth: 10,
                    items:[{
                        xtype: 'displayfield',
                        value: 'Questa &egrave; la descrizione del GPT'
                    },{
                        xtype: 'displayfield',
                        fieldLabel: 'Cruise ID',
                        value: 'New Cruise',
                        name:'cruiseName',
                        // reference attached to GPT
                        ref:'../../cruiseName'
                    }]
                    
                },{
                    xtype: 'fieldset',
                    title: 'FTP properties',
                    labelWidth: 200,
                    items: [{
                        xtype: 'textfield',
                        allowBlank: false,
                        fieldLabel: 'User',
                        value:'ftpUserName',
                        invalidText: 'FTP User missing',
                        // disabled: true,
                        ref: '../../username',
                        name: 'username',
                        width: 225
                        
                    },{
                        xtype: 'textfield',
                        allowBlank: false,
                        fieldLabel: 'Password',
                        inputType: 'password',
                        value: 'passssssssword',
                        invalidText: 'FTP Password missing',
                        // disabled: true,
                        ref: '../../password',
                        name: 'password',
                        width: 225
                    }
                   ]
                },{
                    xtype: 'fieldset',
                    title: 'Common Params',
                    labelWidth: 200,
                    //buttonAlign: 'left',
                    //buttons: [],
                    items: [{
                        fieldLabel: 'Experiment Name',
                        xtype: 'textfield',
                        allowBlank: false,
                        value:'expName',
                        // disabled: true,
                        emptyText: 'default_value',
                        ref: '../../experimentName',
                        name: 'experimentName',
                        width: 225
                        
                    },{
                        // TODO: filtrare lo store in base alla cruise selezionata?
                        fieldLabel: 'Select Glider Name',
                        xtype: 'combo',
                        store: this.glider_names,
                        valueField: 'value',
                        displayField: 'text',
                        valueNotFoundText: 'Glider Name not found',
                        mode: 'local',
                        forceSelection: true,
                        autoSelect: false,
                        //editable: false,
                        // disabled: true,
                        //value: 'default_value',
                        triggerAction: 'all',
                        ref: '../../gliderName',
                        name:'gliderName',
                        width: 225
                    }]
                },
                {
                    xtype: 'fieldset',
                    title: 'Main parameters',
                    labelWidth: 200,
                    defaults:{
                        width: 225
                    },
                    items:[
                    {
                        fieldLabel: 'Run On Demand',
                        xtype: 'checkbox',
                        // disabled: true,
                        ref: '../../onDemandRunningMode',
                        name: 'onDemandRunningMode'
                        
                    },{
                        fieldLabel: 'Center Longitude',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 5.785196,
                        defaultValue: 5.785196,
                        ref: '../../lonCenter',
                        name: 'lonCenter',
                        // width: 500
                        minValue: -180,
                        maxValue: 180
                        
                    },{
                        fieldLabel: 'Center Latitude',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 42.341735,
                        defaultValue: 42.341735,
                        ref: '../../latCenter',
                        name: 'latCenter',
                        // width: 500
                        minValue: -90,
                        maxValue: 90
                        
                    },{
                        fieldLabel: 'Model ID',
                        xtype: 'combo',
                        store: ["EnKROMS", "NRL_NCOM", "NRL_NCOM_ENS", "SE", "ROMS", "MFS"],
                        allowBlank: false,
                        triggerAction: 'all',
                        mode: 'local',
                        // disabled: true,
                        ref: '../../modelID',
                        name: 'modelID',
                        defaultValue:"EnKROMS",
                        // width: 500
                        listeners: {
                                afterRender: function (combo) {
                                            combo.setValue(combo.getStore().getAt(0).get(combo.valueField));
                                        }
                            }
                        
                    },{
                        fieldLabel: 'Bathymetry Filename',
                        xtype: 'textfield',
                        allowBlank: false,
                        // disabled: true,
                        emptyText: 'Insert File name HERE',
                        ref: '../../bathymetryFileName',
                        name: 'bathymetryFileName',
                        // width: 500
                        
                    },
                    {
                        fieldLabel: 'Glider Input Script Name',
                        xtype: 'textfield',
                        allowBlank: false,
                        // disabled: true,
                        //value: '',
                        ref: '../../gliderInputScriptName',
                        name: 'gliderInputScriptName',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Confidence Interval Probability',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 99.99999,
                        defaultValue: 99.99999,
                        ref: '../../confidenceIntervalProb',
                        name: 'confidenceIntervalProb',
                        // width: 500
                        
                    },
                    {
                        title: 'Experiment Area Bounding Box Vertices',
                        xtype:'fieldset',
                        //border: false,
                        width: 600,
                        ref:'../../pathVertexSet',
                        buttonAlign: 'right',
                        buttons:[{
                            text:'Aggiungi punto',
                            handler: function(){
                                var id = self.gliderPanelView.pathVertexSet.items.getCount();

                                self.gliderPanelView.pathVertexSet.add(
                                    new Ext.form.TextField({
                                        itemId: 'vertex'+id,
                                        fieldLabel: 'Point '+id+' [ lon , lat ] ',
                                        //name: 'Point'+id,
                                        allowBlank: false,
                                        border: true,
                                        //regEx: /[{0,1}/   <- TODO regEx to validate!!
                                    })
                                );
                                self.gliderPanelView.syncSize().doLayout();
                            }
                            
                        }
                        ],
                        items:[
                            {
                                fieldLabel: 'Point 0 [ lon , lat ] ',
                                xtype: 'textfield',
                                allowBlank: false,
                                // disabled: true,
                                emptyText: 'Qui ci sta un array',
                                ref: 'Point0',
                                //name: 'Point0',
                                itemId: 'vertex0'
                                // width: 500
                                
                            }
                        ]
                    }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Glider parameters',
                    labelWidth: 200,
                    ref: '../gliderFieldset',
                    defaults:{
                        width: 225
                    },
                    items: [{
                        fieldLabel: 'Delta T',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 6,
                        defaultValue: 6,
                        ref: '../../deltaT',
                        name: 'deltaT',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Surfacing interval',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 9900,
                        defaultValue: 9900,
                        ref: '../../deltaT_surfacing',
                        name: 'deltaT_surfacing',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Time at surface',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 900,
                        defaultValue: 900,
                        ref: '../../deltaT_atSurf',
                        name: 'deltaT_atSurf',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Apply Drift Correction',
                        xtype: 'checkbox',
                        checked: true,
                        // disabled: true,
                        ref: '../../driftCorrection',
                        name: 'driftCorrection'
                        
                    },
                    {
                        xtype: 'compositefield',
                        width: 250,
                        anchor: '100%',
                        ref:'../../t0my',
                        name:'t0',
                        fieldLabel: 'Initial Time of simulation',
                        items: [{
                                ref: 't0Date',
                                name: 't0Date',
                                xtype: 'datefield',
                                allowBlank: true,
                                emptyText: 'Select a date...',
                                editable: false,
                                format: "Ymd",
                                fieldLabel: 'Start date',
                                width: 120,
                                anchor: '100%'
                            }, {
                                ref: 't0Time',
                                name: 't0Date',
                                xtype: 'timefield',
                                allowBlank: true,
                                emptyText: 'Select a time...',
                                fieldLabel: 'time',
                                format: 'His',
                                width: 100
                        }]
                    },{
                        fieldLabel: 'Initial Longitude',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        ref: '../../lon0',
                        name: 'lon0',
                        // width: 500
                        minValue: -180,
                        maxValue: 180
                        
                    },{
                        fieldLabel: 'Initial Latitude',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        ref: '../../lat0',
                        name: 'lat0',
                        // width: 500
                        minValue: -90,
                        maxValue: 90
                        
                    },{
                        fieldLabel: 'WP Lon',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        ref: '../../lonWP',
                        name: 'lonWP',
                        // width: 500
                        
                    },{
                        fieldLabel: 'WP Lat',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        ref: '../../latWP',
                        name: 'latWP',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Loop through way points',
                        xtype: 'checkbox',
                        // disabled: true,
                        ref: '../../loopWP',
                        name: 'loopWP'
                        
                    },{
                        fieldLabel: 'Index starting waypoint',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        ref: '../../idxStartWP',
                        name: 'idxStartWP',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Threshold on waypoint acquisition',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 1000,
                        defaultValue: 1000,
                        ref: '../../reachedWPThreshold',
                        name: 'reachedWPThreshold',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Initial standard deviation',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 10,
                        defaultValue: 10,
                        ref: '../../positionStd0',
                        name: 'positionStd0',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Diving target depth',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        //value: 'default_value',
                        ref: '../../targetDepthDiving',
                        name: 'targetDepthDiving',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Climbing target depth',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        //value: 'default_value',
                        ref: '../../targetDepthClimbing',
                        name: 'targetDepthClimbing',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Minimum altitude from sea floor',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        //value: 'default_value',
                        ref: '../../tagerAltitude',
                        name: 'tagerAltitude',
                        // width: 500,
                        
                    },{
                        fieldLabel: 'Pitch angle Diving',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        //value: 'default_value',
                        ref: '../../phiDive',
                        name: 'phiDive',
                        // width: 500,
                        minValue: 0,
                        maxValue: 360
                        
                    },{
                        fieldLabel: 'Standard deviation of pitch angle diving',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 4,
                        defaultValue: 4,
                        ref: '../../stdPhiDive',
                        name: 'stdPhiDive',
                        // width: 500,
                        minValue: 0,
                        maxValue: 360
                        
                    },{
                        fieldLabel: 'Pitch angle Climbing',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        //value: 'default_value',
                        ref: '../../phiClimb',
                        name: 'phiClimb',
                        // width: 500,
                        minValue: 0,
                        maxValue: 360
                        
                    },{
                        fieldLabel: 'Standard deviation of pitch angle climbing',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 4,
                        defaultValue: 4,
                        ref: '../../stdPhiClimb',
                        name: 'stdPhiClimb',
                        // width: 500,
                        minValue: 0,
                        maxValue: 360
                        
                    },{
                        fieldLabel: 'Glider vertical velocity during Diving',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        value: 0.14,
                        defaultValue: 0.14,
                        ref: '../../VzDive',
                        name: 'VzDive',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Standard deviation on diving vertical velocity',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        value: 0.04,
                        ref: '../../stdVzDive',
                        name: 'stdVzDive',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Glider vertical velocity during Climbing',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        value: -0.14,
                        defaultValue: -0.14,
                        ref: '../../VzClimb',
                        name: 'VzClimb',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Standard deviation on climbing vertical velocity',
                        xtype: 'numberfield',
                        //allowBlank: false,
                        // disabled: true,
                        value: 0.04,
                        ref: '../../stdVzClimb',
                        name: 'stdVzClimb',
                        // width: 500
                        
                    },{
                        fieldLabel: 'Glider heading standard deviation',
                        xtype: 'numberfield',
                        allowBlank: false,
                        // disabled: true,
                        value: 1,
                        defaultValue: 1,
                        ref: '../../stdHeading',
                        name: 'stdHeading',
                        // width: 500,
                        minValue: 0,
                        maxValue: 360
                    }]
                }

                ]
            })] // glider panel
            ,
            clean: function(){
                this.formPanel.getForm().reset();
                this.formPanel.getForm().items.each(
                                                    function s(c){
                                                            if(c.defaultValue)
                                                                c.setValue(c.defaultValue)
                                                            }
                                                    );
                
                this.pathVertexSet.removeAll();
                this.pathVertexSet.add(
                    new Ext.form.TextField({
                        itemId: 'vertex0',
                        fieldLabel: 'Point 0 [ lon , lat ] ',
                        allowBlank: false,
                        border: true,
                        //regEx: /[{0,1}/   <- TODO regEx to validate!!
                    })
                );
                
            }
            
        });

    },
/*      
    createBatch: function(b,e) {
        this.gliderPanelView.ownerCt.setActiveTab(this.gliderPanelView);
        
    },
   */ 
    editBatch: function(b,e) {
        this.clean();
        var cruiseName = Ext.getCmp('cruise-list-view').getSelectedRecords()[0].data.name;
        var gliderName = this.gliderListView.getSelectedRecords()[0].data.name;
        //alert('selezionato '+gliderName);  // DEBUG
        this.loadBatch(this.gliderListView.getSelectedRecords()[0].data.id);
        console.log(this.gliderPanelView.formPanel);
        this.gliderPanelView.cruiseName.setValue(cruiseName);
        this.gliderPanelView.ownerCt.setActiveTab(this.gliderPanelView);
        
    },
    
    deleteBatch: function(b,e){
        var gliderName = this.gliderListView.getSelectedRecords( )[0].data.name;
        var del = confirm('Sicuro di voler eliminare '+gliderName+ '?' );
        if(!del)
            return;

        var gliderId = this.gliderListView.getSelectedRecords()[0].data.id;
        console.log('Eliminazione di '+gliderId);
        
        var uri = new Uri({'url':this.geostoreBaseUrl});
        uri.setProxy( this.proxy );
        uri.appendPath( 'resources/resource/'+gliderId ); 
        
        var Request = Ext.Ajax.request({
            url: uri.toString(),
            method: 'DELETE',
            headers:{
              'Authorization' : 'Basic YWRtaW46YWRtaW4='
            },
            scope: this,
            success: function(response, opts){
                Ext.Msg.show({
                    title: 'Batch Deleted',
                    msg: 'Batch correctly deleted',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.OK
                });
                this.gliderListView.getStore().reload();

                
            },
            failure: function(response, opts){
                console.error(response);
                Ext.Msg.show({
                    title: 'Cannot read response',
                    msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });   
              }
        });     

    },
    
    gListSelChangeHnd: function(listview, selections){
        if(!selections.length){
            this.deleteButton.disable();
            this.editButton.disable();
        }
        else{
            this.deleteButton.enable();
            this.editButton.enable();
        }
    },
    /*
    clickHandler: function(list){
        this.deleteButton.enable();
    },
    */
    validate: function(){
        
        //alert('valido');
        var valido = true;
        var tojson = {};
        this.gliderPanelView.formPanel.getForm().items.each(
                                                            function s(c){
                                                                    console.log(c.getName()+' : '+c.getValue());
                                                                    valido = (c.validate() && valido);
                                                                    if(valido  && c.xtype != 'displayfield' && !c.getName().contains('ext-')){
                                                                        //console.log(c.getName()+' : '+c.getValue());
                                                                        tojson[c.getName()] = c.getValue();
                                                                    }
                                                                        
                                                                }
                                                            );        

        var pathVertex = [];
        this.gliderPanelView.pathVertexSet.items.each(
            function addToJson(field){
                if(field.validate()){
                    console.log(field.getValue());
                    pathVertex.push(JSON.parse('['+field.getValue()+']'));
                }else
                    valido = false;
            }
        );
        // chiudo il poligono
        pathVertex.push(JSON.parse('['+this.gliderPanelView.pathVertexSet.items.first().getValue()+']'));
        tojson.dssArea = {
            "pathVertex":pathVertex
        }
        if(valido)
            alert('valido');
        else{
            alert('Completa tutti i campi necessari');
            return;
        }
        
        var t0 = this.gliderPanelView.t0my;
        if(t0.t0Date.validate() && t0.t0Time.validate())
            tojson.t0 = t0.t0Date.getRawValue()+ ':'+ t0.t0Time.getRawValue();
        else  // clean bad values
            delete tojson.t0;
                    
        alert(t0.t0Date.getRawValue()+ ':'+ t0.t0Time.getRawValue());
        
        console.log(tojson);
        var jsoned = Ext.encode(tojson)
        console.log(jsoned);
        // check and send or update
        if(valido)
            this.checkBatch(
                        this.gliderPanelView.cruiseName.getValue(),
                        this.gliderPanelView.gliderName.getValue(),
                        jsoned
                        );
        
        //this.sendBatch(this.gliderPanelView.cruiseName.getValue(), this.gliderPanelView.gliderName.getValue(), jsoned);
        
    },

    checkBatch: function(cruiseName, gliderName, jsoned){
        
        var uri = new Uri({'url':this.geostoreBaseUrl});
        uri.setProxy( this.proxy );
        uri.appendPath( 'misc/category/name/glider/resource/name/'+cruiseName+'_'+gliderName ); 
        
        var Request = Ext.Ajax.request({
            url: uri.toString(),
            method: 'GET',
            scope: this,
            success: function(response, opts){
                if(response.responseXML){
                    var resId = Ext.DomQuery.selectNumber('Resource/id', response.responseXML);
                    this.updateBatch(resId, cruiseName, gliderName, jsoned);
                }else{
                    console.error(response);
                    Ext.Msg.show({
                    title: 'Cannot read response',
                    msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });   
                }
            },
            failure: function(response, opts){
                this.sendBatch(cruiseName, gliderName, jsoned);
            }
        });     
        
    },

    sendBatch: function(cruiseName, gliderName, json){
        
        var xml='<Resource>'+
                    '<description>Glider batch</description>'+
                    //'<metadata></metadata>'+
                    '<name>'+cruiseName+'_'+gliderName+'</name>'+
                    '<category>'+
                        '<name>glider</name>'+
                    '</category>'+
                    '<store>'+
                        '<data>'+json+'</data>'+
                    '</store>'+
                '</Resource>';        
        
        var uri = new Uri({'url':this.geostoreBaseUrl});
        uri.setProxy( this.proxy );
        uri.appendPath( 'resources' ); 
        
        
        var Request = Ext.Ajax.request({
           url: uri.toString(),
           method: 'POST',
           headers:{
              'Content-Type' : 'application/xml',
              'Accept' : 'text/plain',
              'Authorization' : 'Basic YWRtaW46YWRtaW4='
           },
           scope: this,
           params: xml,
           success: function(response, opts){
                console.log(response);
                alert('Batch Caricato correttamente ('+response.responseText+')');
                this.gliderListView.getStore().reload();
           },
           failure:  function(response, opts){
                alert('FALLITO!');
                console.log(response);
           }
        });     
        
    },

    updateBatch: function(resId, cruiseName, gliderName, json){
        /*
        var xml='<Resource>'+
                    '<description>Glider batch</description>'+
                    //'<metadata></metadata>'+
                    '<name>'+cruiseName+'_'+gliderName+'</name>'+
                    '<category>'+
                        '<name>glider</name>'+
                    '</category>'+
                    '<store>'+
                        '<data>'+json+'</data>'+
                    '</store>'+
                '</Resource>';
        */
        var uri = new Uri({'url':this.geostoreBaseUrl});
        uri.setProxy( this.proxy );
        //uri.appendPath( 'resources/resource/'+resId ); 
        uri.appendPath( 'data/'+resId ); 
        
        
        var Request = Ext.Ajax.request({
           url: uri.toString(),
           method: 'PUT',
           headers:{
              //'Content-Type' : 'application/xml',
              'Content-Type' : 'application/json',
              'Accept' : 'text/plain',
              'Authorization' : 'Basic YWRtaW46YWRtaW4='
           },
           scope: this,
           params: json,
           success: function(response, opts){
                alert('ANDATA!\n'+response.responseText);
                console.log(response);
           },
           failure:  function(response, opts){
                alert('FALLITO!');
                console.log(response);
           }
        });     
        
    },


    getCreateButton: function(){
        return this.createButton;
    },
    
    getEditButton: function(){
        return this.editButton;
    },

    getDeleteButton: function(){
        return this.deleteButton;
    },

    getGliderPanelView: function() {
        return this.gliderPanelView;
    },

    getGliderListView: function() {
        return this.gliderListView;
    },
    
    loadBatch: function(batchId, callback){
        var appMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait, loading..."});
        //appMask.show();
        
        var self = this;
        
        this.geostore.findByPk(batchId, {
            params: { full: true },
            onFailure: function loadBatch_findByPK_callback_failed(response){
                appMask.hide();
                console.error(response);
                Ext.Msg.show({
                    title: 'Cannot read configuration',
                    msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });         
            },
            onSuccess: function loadBatch_findByPK_callback_success(data) {
                        appMask.hide();
                        // get blob as a json object
                        var payload = null;
                        try {
                            // payload = JSON.parse(data.blob);
                            payload = Ext.util.JSON.decode(data.blob);
                        } catch (e) {
                            console.error(e);
                        }
                        //console.log(data);
                        
                        
                        // populate form fields
                        var GPT = self.gliderPanelView;
                        // reset original values
                        // TODO add a switch to enable defaultValues?
                        GPT.clean();
                        
                        // TODO Resources ha l'afterfind che ingora gli attributi e setta owner
                        GPT.cruiseName.setValue(data.owner);

                        if (payload) {

                                // TODO externalize
                                GPT.username.setValue(payload.username);
                                GPT.password.setValue(payload.password);
                                
                                GPT.experimentName.setValue(payload.experimentName);
                                //GPT.gliderName.filter(); // TODO siamo in loadbatch, azzerare i filtri e forzare la selezione al glider scelto
                                GPT.gliderName.setValue(payload.gliderName);
                                GPT.onDemandRunningMode.setValue(payload.onDemandRunningMode);
                                GPT.lonCenter.setValue(payload.lonCenter);
                                GPT.latCenter.setValue(payload.latCenter);
                                GPT.modelID.setValue(payload.modelID);
                                GPT.bathymetryFileName.setValue(payload.bathymetryFileName);
                                GPT.gliderInputScriptName.setValue(payload.gliderInputScriptName);
                                GPT.confidenceIntervalProb.setValue(payload.confidenceIntervalProb);
                                
                                if(payload.dssArea.pathVertex){
                                    GPT.pathVertexSet.removeAll();
                                    var tot=payload.dssArea.pathVertex.length
                                    for(var i = 0; i < tot; i++){
                                        GPT.pathVertexSet.add(
                                            new Ext.form.TextField({
                                                itemId: 'vertex'+i,
                                                fieldLabel: 'Point '+i+' [ lon , lat ] ',
                                                value: payload.dssArea.pathVertex[i],
                                                allowBlank: false,
                                                border: true,
                                                //regEx: /[{0,1}/   <- TODO regEx to validate!!
                                            })
                                        );
                                    }
                                    GPT.syncSize().doLayout();
                                }
                                
                                GPT.deltaT.setValue(payload.deltaT); 
                                GPT.deltaT_surfacing.setValue(payload.deltaT_surfacing);
                                GPT.deltaT_atSurf.setValue(payload.deltaT_atSurf);
                                GPT.driftCorrection.setValue(payload.driftCorrection);
                                GPT.t0my.t0Date.setValue(Date.parseDate(payload.t0.split(':')[0], "Ymd"));
                                GPT.t0my.t0Time.setValue(Date.parseDate(payload.t0.split(':')[1], "his"));
                                GPT.lon0.setValue(payload.lon0);
                                GPT.lat0.setValue(payload.lat0);
                                GPT.lonWP.setValue(payload.lonWP);
                                GPT.latWP.setValue(payload.latWP);
                                
                                
                                GPT.loopWP.setValue(payload.loopWP);
                                GPT.idxStartWP.setValue(payload.idxStartWP);
                                GPT.reachedWPThreshold.setValue(payload.reachedWPThreshold);
                                GPT.positionStd0.setValue(payload.positionStd0);
                                GPT.targetDepthDiving.setValue(payload.targetDepthDiving);
                                GPT.targetDepthClimbing.setValue(payload.targetDepthClimbing);
                                GPT.tagerAltitude.setValue(payload.tagerAltitude);
                                GPT.phiDive.setValue(payload.phiDive);
                                GPT.stdPhiDive.setValue(payload.stdPhiDive);
                                GPT.phiClimb.setValue(payload.phiClimb);
                                GPT.stdPhiClimb.setValue(payload.stdPhiClimb);
                                GPT.VzDive.setValue(payload.VzDive);
                                GPT.stdVzDive.setValue(payload.stdVzDive);
                                GPT.VzClimb.setValue(payload.VzClimb);
                                GPT.stdVzClimb.setValue(payload.stdVzClimb);
                                GPT.stdHeading.setValue(payload.stdHeading);

                                if (callback){
                                    // batch loaded correctly, call callback
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
                        //self.enable();
            
            }
        });
        
    },
    clean: function(){
        console.log('GPT');
        this.gliderPanelView.clean();
    }
    });
