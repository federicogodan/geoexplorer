/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */

GeoExt.Lang.add("it", {
    "GeoExplorer.prototype": {
        zoomSliderText: "<div>Livello di Zoom: {zoom}</div><div>Scala: 1:{scale}</div>",
        loadConfigErrorText: "Impossibile leggerre la configurazione salvata : <br />",
        loadConfigErrorDefaultText: "Errore del Server.",
        xhrTroubleText: "Problemi di comunicazione: Stato ",
        layersText: "Livelli",
        titleText: "Titolo",
        zoomLevelText: "Livello di Zoom",
        saveErrorText: "Problemi di salvataggio: ",
        bookmarkText: "URL del Segnalibro",
        permakinkText: "Permalink",
        appInfoText: "Crediti",
        aboutText: "Riguardo GeoExplorer",
        mapInfoText: "Informazioni Mappa",
        descriptionText: "Descrizione",
        contactText: "Contatto",
        aboutThisMapText: "Approposito di questa Mappa",
        searchTabTitle : "Portale",
        viewTabTitle : "Vista"
    },
    
    "GeoExplorer.Composer.prototype": {
        loadMapText: "Importazione Mappa o file KML",
        saveMapText: "Esportazione Mappa",
	    loadMapEmptyText: "Selecionare un file di contesto o un file KML",
		loadMapUploadText: "Caricamento in corso",
		uploadText: "Caricamento",
		loadMapWindowTitle: 'Form di Caricamento File',
		loadMapErrorText:'Errore nel caricamento del file',
        toolsTitle: "Scegliere gli strumenti da includere nella barra:",
        previewText: "Anteprima",
        backText: "Precedente",
        nextText: "Prossimo",
        loginText: "Login",
        loginErrorText: "Username o password invalidi.",
        userFieldText: "Utente",
        passwordFieldText: "Password",
        fullScreenText: "Schermo Intero"
    },

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Livello"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Aggiungi livello",
        addActionTip: "Aggiungi livello",
        addServerText: "Aggiungi un nuovo Server",
        addButtonText: "Aggiungi livelli",
        untitledText: "Senza Titolo",
        addLayerSourceErrorText: "Errore nel recuperare le WMS capabilities ({msg}).\nSi prega di controllare l'URL e di riprovare ancora.",
        availableLayersText: "Livelli disponibili",
        expanderTemplateText: "<p><b>Sommario:</b> {abstract}</p>",
        panelTitleText: "Titolo",
        layerSelectionText: "Visualizzare i dati disponibili presso:",
        doneText: "Fatto",
        removeFilterText: "Ripulisci Filtro", 
        filterEmptyText: "Filtro",
        uploadText: "Upload dei dati"
    },

    "gxp.plugins.RemoveOverlays.prototype": {
	    removeOverlaysMenuText: "Rimuovere i livelli sovrastanti",
	    removeOverlaysActionTip: "Rimuovere tutti i livelli sovrastanti dalla mappa",
	    removeOverlaysConfirmationText: "Sei sicuro di voler rimuovere dalla mappa tutti i sovralivelli caricati?"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Livelli Bing",
        roadTitle: "Strade Bing",
        aerialTitle: "Bing Aerial",
        labeledAerialTitle: "Bing Aerial con etichette"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Please enter the Google API key for ",
        menuText: "3D Viewer",
        tooltip: "Switch to 3D Viewer"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Livelli Google",
        roadmapAbstract: "Mostra mappa vie",
        satelliteAbstract: "Mostra le immagini satellitari",
        hybridAbstract: "Mostra le immagini con nomi strade",
        terrainAbstract: "Mostra mappa stradale con terreno"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Proprietà livello",
        toolTip: "Proprietà livello"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Livelli",
        overlayNodeText: "Predefinito",
        baseNodeText: "Sfondo"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Legenda",
        tooltip: "Legenda"
    },    
    
    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Lunghezza",
        areaMenuText: "Area",
        lengthTooltip: "Misura lunghezza",
        areaTooltip: "Misura area",
        measureTooltip: "Misura"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Trascina Mappa",
        tooltip: "Trascina Mappa"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom alla precedente estenzione",
        nextMenuText: "Zoom alla prossima estenzione",
        previousTooltip: "Zoom alla precedente estenzione",
        nextTooltip: "Zoom alla prossima estenzione"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "Livelli OpenStreetMap",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Stampa Mappa",
        tooltip: "Stampa Mappa",
        previewText: "Anteprima di stampa",
        notAllNotPrintableText: "Non tutti i livelli possono essere stampati",
        nonePrintableText: "Nessuno dei tuoi attuali livelli della mappa può essere stampato",
		notPrintableLayersText: "Di seguito i layers non stampabili:"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "Livelli MapQuest",
        osmAttribution: "Tiles per concessione di <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles per concessione di <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "Immagini MapQuest"
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Rimuovi livello",
        removeActionTip: "Rimuovi livello"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Recupera Feature Info",
        popupTitle: "Feature Info"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Zoom Avanti",
        zoomOutMenuText: "Zoom Indietro",
        zoomInTooltip: "Zoom Avanti",
        zoomOutTooltip: "Zoom Indietro"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom massima estenzione",
        tooltip: "Zoom massima estenzione"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom al livello",
        tooltip: "Zoom al livello"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom al livello",
        tooltip: "Zoom al livello"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "Informazioni",
        titleText: "Titolo",
        nameText: "Nome",
        descriptionText: "Descrizione",
        displayText: "Display",
        opacityText: "Opacità",
        formatText: "Formato",
        transparentText: "Transparenza",
        cacheText: "Cache",
        cacheFieldText: "Usa versione in cache",
        stylesText: "Stile",
        idaRasterRiskSummaryText: "Statistiche Risk Summary",
        idaRasterRiskSummaryInfoText: "Statistiche Raster nella Viewport corrente"
    },

    "gxp.WMSStylesDialog.prototype": {
         addStyleText: "Aggiungi",
         addStyleTip: "Aggiungi un nuovo stile",
         chooseStyleText: "Scegli stile",
         deleteStyleText: "Rimuovi",
         deleteStyleTip: "Cancella lo stile selezionato",
         editStyleText: "Modifica",
         editStyleTip: "Modifica lo stile selezionato",
         duplicateStyleText: "Duplica",
         duplicateStyleTip: "Duplica lo stile selezionato",
         addRuleText: "Aggiungi",
         addRuleTip: "Aggiungi una nuova regola",
         newRuleText: "Nuova Regola",
         deleteRuleText: "Rimuovi",
         deleteRuleTip: "Cancella la regola selezionata",
         editRuleText: "Modifica",
         editRuleTip: "Modifica le regola selezionata",
         duplicateRuleText: "Duplica",
         duplicateRuleTip: "Duplica la regola selezionata",
         cancelText: "Cancella",
         saveText: "Salva",
         styleWindowTitle: "User Style: {0}",
         ruleWindowTitle: "Style Rule: {0}",
         stylesFieldsetTitle: "Stili",
         rulesFieldsetTitle: "Regole"
    },

    "gxp.NewSourceWindow.prototype": {
        title: "Aggiungi nuovo Server...",
        cancelText: "Cancella",
        addServerText: "Aggiungi Server",
        invalidURLText: "Inserisci un URL valido come WMS endpoint (e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Si cerca di contattare il Server..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Livello di Zoom"
    },

    "gxp.plugins.AddGroup.prototype": { 
	    addGroupMenuText: "Aggiungi Gruppo",
	    addGroupActionTip: "Aggiungi nuovo Gruppo all'albero dei livelli",   
	    addGroupDialogTitle: "Nuovo Gruppo", 
	    addGroupFieldSetText: "Nome Gruppo",
	    addGroupFieldLabel: "Nuovo Gruppo",
	    addGroupButtonText: "Aggiungi Gruppo",
	    addGroupMsg: "Si prega di inserire il nome del gruppo"	
    },
    
    "gxp.plugins.RemoveGroup.prototype": { 
	    removeGroupMenuText: "Rimuovi Gruppo",
	    removeGroupActionTip: "Rimuovi gruppo dall'albero dei livelli",
	    removeGroupActionTip: "Rimuovi il gruppo selezionato e i suoi livelli dalla mappa",
	    removeGroupConfirmationText: "Sei sicuro di voler rimuovere il gruppo selezionato ? Tutti i livelli in esso presenti saranno rimossi dalla mappa."
    },
    
    "gxp.plugins.SaveDefaultContext.prototype": { 
	    saveDefaultContextMenuText: "Salva il contesto",
	    saveDefaultContextActionTip: "Salva il contesto",
	    contextSaveSuccessString: "Contesto salvato con successo",
	    contextSaveFailString: "Contesto non salvato con successo"
    },

    "gxp.plugins.FDHGeoCoder.prototype": {
        initialText: "Seleziona un'area",
        menuText: "FDH Geo Coding",
        tooltip: "FDH Geo Coding"
    },

    "gxp.plugins.ZoomBox.prototype":{
        zoomInMenuText: "Zoom Box Avanti",
        zoomOutMenuText: "Zoom Box Indietro",
        zoomInTooltip: "Zoom Box Avanti",
        zoomOutTooltip: "Zoom Box Indietro"
    },

    "GeoExt.ux.PrintPreview.prototype":{
	    paperSizeText: "Dimesioni del foglio:",
	    resolutionText: "Risoluzione:",
	    printText: "Stampa",
	    emptyTitleText: "Inserisci qui il titolo della mappa.",
	    includeLegendText: "Includere la legenda?",
	    legendOnSeparatePageText: "Legenda in una pagina separata?",
	    compactLegendText: "Legenda compatta?",	
	    emptyCommentText: "Inserisci qui i commenti.",
	    creatingPdfText: "Creazione del file PDF..."
    },

    "gxp.plugins.GeonetworkSearch.prototype":{
        geonetworkSearchText: "Visualizza metadati",
        geonetworkSearchActionTip: "Visualizza metadati"
    },

    "gxp.plugins.GroupProperties.prototype":{
        groupPropertiesMenuText:  "Proprietà del gruppo",
        groupPropertiesActionTip:  "Proprietà del gruppo",
        groupPropertiesDialogTitle: "Proprietà del gruppo - ",
        groupPropertiesFieldSetText: "Nome del Gruppo",
        groupPropertiesFieldLabel: "Nuovo nome del Gruppo",
        groupPropertiesButtonText: "Fatto",
        groupPropertiesMsg: "Si prega di inserire il nome del gruppo."
    },

    "gxp.plugins.Login.prototype":{
        loginText: "Login",
        loginErrorText: "Username o password invalidi.",
        userFieldText: "Utente",
        passwordFieldText: "Password"
    },

    "gxp.plugins.Login.prototype":{
      loginText: "Se connecter",
          loginErrorText: "Nom d`utilisateur ou mot de passe incorrect",
          userFieldText: "Utilisateur",
          passwordFieldText: "Mot de passe"
    },
	
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Visualizza in mappa",
        firstPageTip: "Prima pagina",
        previousPageTip: "Pagina precedente",
        zoomPageExtentTip: "Zoom all'estensione della pagina",
        nextPageTip: "Prossima pagina",
        nextPageTip: "Ultima pagina",
        totalMsg: "Totale: {0} righe"
    },
	"gxp.plugins.QueryForm.prototype": {
        queryActionText: "Interrogazione",
        queryMenuText: "Interrogazione livello",
        queryActionTip: "Interrogazione il livello selezionato",
        queryByLocationText: "Regione di Interesse",
        currentTextText: "Estensione corrente",
        queryByAttributesText: "Interrogazione per attributo",
        queryMsg: "Interrogazione in corso...",
        cancelButtonText: "Reimposta",
        noFeaturesTitle: "Nessun Risultato",
        noFeaturesMessage: "La tua ricerca non ha prodotto risultati.",
        title: "Ricerca",
        northLabel:"Nord",
        westLabel:"Ovest",
        eastLabel:"Est",
        southLabel:"Sud",
        setAoiText: "ImpostaROI",
        setAoiTooltip: "Abilita il controllo SetBox per disegnare una ROI (BBOX) sulla mappa",
        attributeEnablement: "Interrogazione per Attributo",
        attributeEnablementMsg: "Tipo di ricerca invalido! Si deve prima selezionare il tipo 'Feature' e il layer vettoriale.",
        searchType: "Impostazioni di base",
        typeLabel: "Tipo",
        featureLabel: "Max Features"
    },
    "gxp.plugins.IDAQueryForm.prototype": {
        queryActionText: "Interrogazione",
        queryMenuText: "Interrogazione livello",
        queryActionTip: "Interrogazione il livello selezionato",
        queryByLocationText: "Regione di Interesse",
        currentTextText: "Estensione corrente",
        queryByAttributesText: "Interrogazione per attributo",
        queryMsg: "Interrogazione in corso...",
        cancelButtonText: "Reimposta",
        noFeaturesTitle: "Nessun Risultato",
        noFeaturesMessage: "La tua ricerca non ha prodotto risultati.",
        title: "Ricerca",
        northLabel:"Nord",
        westLabel:"Ovest",
        eastLabel:"Est",
        southLabel:"Sud",
        setAoiText: "ImpostaROI",
        setAoiTooltip: "Abilita il controllo SetBox per disegnare una ROI (BBOX) sulla mappa",
        attributeEnablement: "Interrogazione per Attributo",
        attributeEnablementMsg: "Tipo di ricerca invalido! Si deve prima selezionare il tipo 'Feature' e il layer vettoriale.",
        searchType: "Impostazioni di base",
        typeLabel: "Tipo",
        featureLabel: "Max Features",
       	spatialLabelText: "Non settando una ROI stai chiedendo l'intero insieme di dati nell'estenzione corrente della mappa.",
	    featureLabelText: "Con un elevato numero di features il server pu� richiedere lungo tempo prima di rispondere. Limita la tua ricerca!",
		spmText:"SPM",
		sourcedepthLabel : "Profondit&agrave; Sorgente (m)",
		sourcefrequencyLabel : 'Frequenza Sorgente (kHz)',
		sourcepressurelevelLabel : 'Livello Pressione Sorgente (dB)',
		modelnameLabel : 'Nome del Modello',
		seasonLabelText: 'Stagione',
		securityLevelLabelText : 'Livello di Sicurezza',
		allText: 'Tutti',
		springText : "Primavera",
		winterText : "Inverno",
		fallText : "Autunno",
		summerText : "Estate",
		modelRunDateText:'Data Avvio Modello',
		modelEndDateText:'Data Fine Modello',
		qualityLabel: "Qualità",
		bottomTypeLabel: "Tipo Fondale",
		tlModelLabel: "Modello TL"

    },
	"gxp.plugins.GeoReferences.prototype": {
        initialText: "Seleziona un'area",
        menuText: "Geo Referimenti",
        tooltip: "Geo Referimenti"
    },
	"gxp.plugins.IDASpm.prototype":{
		title: "Crea SPM",
		pointSelectionButtonLabel: '',
		springText : "Primavera",
		winterText : "Inverno",
		fallText : "Autunno",
		summerText : "Estate",
		soundPropagationModelParamText: 'Parametri del modello di propagazione del suono...',
		soundSourcePointText: 'Sorgente del Suono',
		svpsoundSourcePointText: 'Locazione Profilo Velocità del Suono',
		svpUploadDialogTitle: "Profilo di Velocità del Suono",
		sourcedepthLabel : "Profondit&agrave; Sorgente (m)",
		sourcefrequencyLabel : 'Frequenza Sorgente (kHz)',
		sourcepressurelevelLabel : 'Livello Pressione Sorgente (dB)',
		modelnameLabel: 'Nome del Run',
		pointSelectionButtionTip: 'Abilita selezione punto',
		seasonLabelText: 'Stagione',
		securityLevelLabelText : 'Livello di Sicurezza',
		applyText: 'Lancia',
		resetText: 'Resetta',
		settingColorTitle: 'Colore',
	    spmList: "Modelli Lanciati",
		spmTooltip: "Mostra la lista dei modelli lanciati",
		missingParameterTitle:"Parametri Mancanti",
		missingParameterMsg:"Per favore inserire i paramteri obbligatori mancanti",
		userInput: "Input dell'Utente",
		applyMultiText: 'Esegui Tutti',
		saveText: 'Salva SPM',
		spmSaveTooltip: "Salva run Sound Propagation Model",
		spmExecuteTooltip: "Esegui i run/runs del Sound Propagation Model",
		spmResetTooltip: "Reset input SPM",
		spmExecuteMessage: "Run Sound Propagation Model richiesta inviata.",
		spmSaveMessage: "Run Sound Propagation Model <b>{modelName}</b> salvato",
		spmXMLImportMsg: "Tutti i run SPM del file XML sono stati aggiunti",
		svpImportMsg: "Sound Velocity Profile importato con successo",
		svpFileMissingMsg: "Il file SVP è obbligatorio per la stagione \"User Input\"",
		spmBatchComposerMsg: "Run Composer",
		composerErrorMsg:"Errore nel Composer",
		removeMsg: "Rimuovi",
		runNameMsg: "Nome Run",
		runListFieldSetName: "Lista Run (Click su Esegui Tutti per avviare l'esecuzione)",
		runListNoRunMsg: "Nessun run SPM da eseguire",
		composerErrorTitle:"Inserire almeno due run SPM per utilizzare il composer",
		svpFileImportErrorTitle: "Errore SVP Upload.",
		svpFileImportErrorMsg: "Il file SVP non è stato correttamente caricato.",
		xmlRunListImportWinTitle: "Importa Run da XML",
		importRunButton: "Importa Run",
		errorLayerNameMsg: "In Nome del Modello non può iniziare con una cifra, </br> non può contenere spazi </br> e non può contere i caratteri '*', '%', '-'",
		advancedTitle: "Modalità Avanzata",
		advancedTitleA: "Input Avanzato 1",
		advancedTitleB: "Input Avanzato 2",
		batchModeTitle: "Modalità Batch",
		tlModelLabelText: "Modello TL",
		tlModelEmptyText: "Selezione Modello TL",
		bottomTypeEmptyText: "Selezione Bottom type",
		bottomTypeLabelText: "Tipo di fondo",
		qualityEmptyText: "Selezione Qualità",
		qualityLabelText: "Qualità",	
		maxRangeText: "Raggio Massimo"
	},	
	"Ext.DatePicker.prototype":{
		todayText         : "Oggi",
		minText           : "Data precedente alla data minima",
		maxText           : "Data successiva alla data massima",
		disabledDaysText  : "",
		disabledDatesText : "",
		monthNames        :  [
							   "Gennaio",
							   "Febbraio",
							   "Marzo",
							   "Aprile",
							   "Maggio",
							   "Giugno",
							   "Luglio",
							   "Agosto",
							   "Settembre",
							   "Ottobre",
							   "Novembre",
							   "Dicembre"
							],
		dayNames          : [
							   "Domenica",
							   "Luned\u00EC",
							   "Marted\u00EC",
							   "Mercoled\u00EC",
							   "Gioved\u00EC",
							   "Venerd\u00EC",
							   "Sabato"
							],
		nextText          : 'Mese successivo (Ctrl+Destra)',
		prevText          : 'Mese precedente (Ctrl+Sinistra)',
		monthYearText     : 'Scegli un mese (Ctrl+Su/Giu per cambiare anno)',
		todayTip          : "{0} (Barra spaziatrice)",
		format            : "d/m/y",
		cancelText        : "Annulla",
		okText            : "&#160;OK&#160;",
		startDay          : 1
	},

    /*-------------------------------------------------------------*/
	
	"gxp.FilterBuilder.prototype": {
        builderTypeNames: ["qualsiasi", "tutte", "nessuna", "non tutti"],
        preComboText: "Restituisci",
        postComboText: "delle seguenti:",
        addConditionText: "aggiungi condizione",
        addGroupText: "aggiungi gruppo",
        removeConditionText: "rimuovicondizione"
    },
	
    "gxp.IDAFilterBuilder.prototype": {
        builderTypeNames: ["qualsiasi", "tutte", "nessuna", "non tutti"],
        preComboText: "Restituisci",
        postComboText: "delle seguenti:",
        addConditionText: "aggiungi condizione",
        addGroupText: "aggiungi gruppo",
        removeConditionText: "rimuovi condizione"
    },
	
	"gxp.plugins.IDAAttribute.prototype": {
                title: "Attributi di Livello",
		settingsTitle: "Impostazioni di base",
		settingNameTitle: "Nome",
		settingColorTitle: "Colore",
		settingClassificationTitle: "Classificazione",
		filterTitle: "Filtro",
		reloadLayerText: "Ricarica Livelli",
		applyFilterText: "Applica",
		resetText: "Reimposta",
                rasterAlgebraExecuteMessage: "Inviata la richiesta di run Layer Attribute.",
                filterApplyTitle: "Applica Filtro",
                filterApplyMsg: "Il filtro impostato è vuoto oppure non formato correttamente!"
    },
    
    "gxp.plugins.WFSGrid.prototype":{
	displayMsgPaging: "Visualizza risultati {0} - {1} of {2}",
        emptyMsg: "Nessun risultato da visualizzare",
        addLayerTooltip: "Aggiungi Layer alla Mappa",
        detailsTooltip: "Visualizza Dettagli",
        detailsHeaderName: "Nome Attributo",
        detailsHeaderValue: "Valore Attributo",
        detailsWinTitle: "Dettagli",
        deleteTooltip: "Elimina Feature",
        deleteConfirmMsg: "Sei è sicuri di voler elminare questa feature?"
     }
});
