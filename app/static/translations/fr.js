/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/

GeoExt.Lang.add("fr", {
    "GeoExplorer.prototype": {
        zoomSliderText: "<div> Niveau de zoom: {zoom}</div><div Echelle: 1:{scale}</div>",
        loadConfigErrorText: "Difficulté à lire la configuration enregistrée: <br>",
        loadConfigErrorDefaultText: "Erreur de serveur.",
        xhrTroubleText: "Problème de communication: état",
        layersText: "Couvertures",
        titleText: "Titre",
        zoomLevelText: "Niveau de Zoom  ",
        saveErrorText: "Problème de sauvegarde",
        bookmarkText: "Mettre l`URL en favori",
        permakinkText: "Permalien",
        appInfoText: "Crédits",
        aboutText: "À propos de GeoExplorer",
        mapInfoText: "Info cartographique",
        descriptionText: "Description",
        contactText: "Contact",
        aboutThisMapText: "À propos de cette carte",
		resetButtonTooltip: "Réinitialiser la Page",
		helpButtonTooltip: "Aide",
        searchTabTitle : "Chercher",
        viewTabTitle : "Vue",
        portalTabTitle : "Portail"
    },  

    "GeoExplorer.Composer.prototype": {
        loadMapText: "Importer une carte ou un fichier KML",
        saveMapText: "Exporter une carte",
		loadMapEmptyText: "Sélectionnez un fichier KML ou de contexte",
		loadMapUploadText: "Chargement...",
		uploadText: "Télécharger",
		loadMapWindowTitle: 'formulaire de téléchargement de  fichier',
		loadMapErrorText:'Erreur de chargement de fichier',
        toolsTitle: "Sélectionner l`application à inclure dans la barre d`outils",
        previewText: "Previsualiser",
        backText: "Retour en arrière",
        nextText: "Suivant",
        loginText: "Se connecter",
        loginErrorText: "Nom d`utilisateur ou mot de passe incorrect",
        userFieldText: "Utilisateur",
        passwordFieldText: "Mot de passe",
        fullScreenText: "Plein écran"
    },  

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Couverture"
    },  

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Ajouter des couvertures",
        addActionTip: "Ajouter des couvertures",
        addServerText: "Ajouter un nouveau serveur",
        addButtonText: "Ajouter des couvertures",
        untitledText: "Sans titre",
        addLayerSourceErrorText: "Erreur d`obtention des capacités WMS ({msg}).\nVeuillez vérifier l`URL et essayez à nouveau.",
        availableLayersText: "Couvertures disponibles",
        expanderTemplateText: "<p><b>Résumé:</b> {abstract}</p>",
        panelTitleText: "Titre",
        layerSelectionText: "Visualiser les données disponibles depuis:",
        doneText: "Terminé",
        removeFilterText: "effacer le filtre", 
        filterEmptyText: "Filtre",
        uploadText: "Télécharger les données"
    }, 
	
	"gxp.plugins.RemoveOverlays.prototype": {
	    removeOverlaysMenuText: "Retirer des superpositions",
	    removeOverlaysActionTip: "Supprime toutes les superpositions de la carte",
	    removeOverlaysConfirmationText: "Etes-vous sûr de vouloir supprimer tous les calques chargés de la carte?"
    },
    
	
    "gxp.plugins.BingSource.prototype": {
        title: "Bing couvertures",
        roadTitle: "Bing routes",
        aerialTitle: "Bing aérienne",
        labeledAerialTitle: "Bing aérienne avec des étiquettes"
    },  

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Introduire SVP la clef Google API ",
        menuText: "Vue 3D",
        tooltip: "Passer à la vue 3D"
    },  

    "gxp.plugins.GoogleSource.prototype": {
        title: "Couvertures Google",
        roadmapAbstract: "Voir la carte des rues",
        satelliteAbstract: "Voir les images satellites",
        hybridAbstract: "Afficher des images avec les noms de rue",
        terrainAbstract: "Voir la cartes des rues avec le relief"
    },  

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Propriétés de la couverture",
        toolTip: "Propriétés de la couverture"
    },  

    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Couvertures",
        overlayNodeText: "Surimpressions",
        baseNodeText: "Couvertures de base"
    },  

    "gxp.plugins.Legend.prototype": { 
        menuText: "Légende",
        tooltip: "Montrer la légende"
    },  

    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Longueur",
        areaMenuText: "Surface",
        lengthTooltip: "Mesure de longueur",
        areaTooltip: "Mesure de surface",
        measureTooltip: "Mesure"
    },  

    "gxp.plugins.Navigation.prototype": {
        menuText: "Carte Panoramique",
        tooltip: "Carte Panoramique"
    },  

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom précédent",
        nextMenuText: "Zoom suivant",
        previousTooltip: "Zoom précédent",
        nextTooltip: "Zoom suivant"
    },  

    "gxp.plugins.OSMSource.prototype": {
        title: "Calques OpenStreetMap",
        mapnikAttribution: "Les données CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Les données CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },  

    "gxp.plugins.Print.prototype": {
        menuText: "Imprimer la carte",
        tooltip: "Imprimer la carte",
        previewText: "Aperçu avant impression",
        notAllNotPrintableText: "Toutes les couvertures ne sont pas imprimables",
        nonePrintableText: "Aucune couverture n`est imprimable",
        notPrintableLayersText: "Les couvertures suivantes ne sont pas imprimables:"
    },  

    "gxp.plugins.MapQuestSource.prototype": {
        title: "Couvertures MapQuest",
        osmAttribution: "Avec la permission de tuiles <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Avec la permission de tuiles <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest images"
    },  

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Enlever la couverture",
        removeActionTip: "Enlever la couverture"
    },  

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Obtenir des infos sur l`entité",
        popupTitle: "Info sur l`entité"
    },  

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Zoom Avant",
        zoomOutMenuText: "Zoom Arrière",
        zoomInTooltip: "Zoom Avant",
        zoomOutTooltip: "Zoom Arrière"
    },  

    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom sur l`étendue de la carte",
        tooltip: "Zoom sur l`étendue de la carte"
    },  

    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom sur l`étendue de la couverture",
        tooltip: "Zoom sur l`étendue de la couverture"
    },  

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom sur l`étendue de la couverture",
        tooltip: "Zoom sur l`étendue de la couverture"
    },  

    "gxp.WMSLayerPanel.prototype": {
        aboutText: "A propos",
        titleText: "Titre",
        nameText: "Nom",
        descriptionText: "Description",
        displayText: "Affichage",
        opacityText: "Opacité",
        formatText: "Format",
        transparentText: "Transparent",
        cacheText: "Cache",
        cacheFieldText: "Utiliser la version mise en cache",
        stylesText: "Styles",
        idaRasterRiskSummaryText: "Risk Summary Stats",
        idaRasterRiskSummaryInfoText: "Current Viewport Raster Statistics",
        loadMaskMsg:"Chargement des donnees..",
        noDataMsg: "Pas de données disponibles en la vue actuelle",
        refreshText: "Actualiser"
    },  

    "gxp.NewSourceWindow.prototype": {
        title: "Ajouter un nouveau serveur...",
        cancelText: "Annuler",
        addServerText: "Ajouter un serveur",
        invalidURLText: "Enter un URL valide jusqu`au WMS final (e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Contacter un serveur"
    },  

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Niveau de zoom"
    },
    "gxp.plugins.AddGroup.prototype": { 
	    addGroupMenuText: "Ajouter un Groupe",
	    addGroupActionTip: "Ajoutez un nouveau groupe à l'arbre des couvertures.",   
	    addGroupDialogTitle: "Nouveau Groupe", 
	    addGroupFieldSetText: "Groupe Nom",
	    addGroupFieldLabel: "Nouveau Groupe",
	    addGroupButtonText: "Ajouter un Groupe",
	    addGroupMsg: "Entrez le nom du groupe"	
    },
    
    "gxp.plugins.RemoveGroup.prototype": { 
	    removeGroupMenuText: "Supprimer le groupe",
	    removeGroupActionTip: "Supprimer le groupe de l'arbre des couvertures",
	    removeGroupActionTip: "Supprimer le groupe sélectionné et ses couvertures de la carte",
	    removeGroupConfirmationText: "Vous êtes certain que vous souhaitez supprimer le groupe ? Tous les couvertures au sein du groupe seront supprimés de la carte."
    },
    
    "gxp.plugins.SaveDefaultContext.prototype": { 
	    saveDefaultContextMenuText: "Enregistrez le contexte par défaut.",
	    saveDefaultContextActionTip: "Enregistrez le contexte actuel.",
	    contextSaveSuccessString: "Sauver le contexte est géré.",
	    contextSaveFailString: "Sauver le contexte a échoué."
    },
    "gxp.plugins.FDHGeoCoder.prototype":{
        initialText: "Sélectionner une zone",
        menuText: "FDH Codification Géographique",
        tooltip: "FDH Codification Géographique"
	
    },
	"gxp.plugins.ZoomBox.prototype":{
        zoomInMenuText: "Zoom Box Avant",
        zoomOutMenuText: "Zoom Box Arrière",
        zoomInTooltip: "Zoom Box Avant",
        zoomOutTooltip: "Zoom Box Arrière"
    },
    "GeoExt.ux.PrintPreview.prototype":{
        paperSizeText: "Taille de papier:",
        resolutionText: "Résolution:",
        printText: "Imprimer",
        emptyTitleText: "Entrez le titre de la carte ici.",
        includeLegendText: "Inclure la légende?",
        legendOnSeparatePageText: "Légende sur une page distincte?",
        compactLegendText: "Légende compact?",	
        emptyCommentText: "Entrer des commentaires d'ici.",
        creatingPdfText: "Création PDF..."
    },
    "gxp.plugins.GeonetworkSearch.prototype":{
        geonetworkSearchText: "Afficher les métadonnées",
        geonetworkSearchActionTip: "Afficher les métadonnées"
    },
    "gxp.plugins.GroupProperties.prototype":{
        groupPropertiesMenuText: "Propriétés du groupe",
        groupPropertiesActionTip: "Propriétés du groupe",
        groupPropertiesDialogTitle: "Propriétés du groupe - ",
        groupPropertiesFieldSetText: "Nom du groupe",
        groupPropertiesFieldLabel: "nom du nouveau groupe",
        groupPropertiesButtonText: "Fait",
        groupPropertiesMsg: "Veuillez entrer un nom de groupe"
    },
    
    "gxp.plugins.Login.prototype":{
      loginText: "Se connecter",
          loginErrorText: "Nom d`utilisateur ou mot de passe incorrect",
          userFieldText: "Utilisateur",
          passwordFieldText: "Mot de passe"
    },
	
	"gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Afficher sur la carte",
        firstPageTip: "Première page",
        previousPageTip: "Page précédente",
        zoomPageExtentTip: "Zoom sur la page",
        nextPageTip: "Page suivante",
        nextPageTip: "Dernière page",
        totalMsg: "Total: {0} records"
    },
    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Query",
        queryMenuText: "Couche de requêtes",
        queryActionTip: "Interroger la couche sélectionnée",
        queryByLocationText: "Query selon le lieu",
        currentTextText: "Mesure actuelle",
        queryByAttributesText: "Requête par attributs",
		queryMsg: "Recherche...",
        cancelButtonText: "Remettre",
        noFeaturesTitle: "Pas de correspondance",
        noFeaturesMessage: "Votre requête n'a retourné aucun résultat.",
        title: "Rechercher",
        northLabel:"Nord",
        westLabel:"Ouest",
        eastLabel:"Est",
        southLabel:"Sud",
        setAoiText: "FixéROI",
        setAoiTooltip: "Activer le contrôle TextBox pour dessiner un ROI (BOX) sur la carte",
        attributeEnablement: "Requête par attributs",
        attributeEnablementMsg: "Invalid search Type! To use this you have to select 'Feature' type and to select a vector layer before.",
        searchType: "Réglages de base",
        typeLabel: "Type",
        featureLabel: "Max Features"
    },
	"gxp.plugins.IDAQueryForm.prototype": {
        queryActionText: "Query",
        queryMenuText: "Couche de requêtes",
        queryActionTip: "Interroger la couche sélectionnée",
        queryByLocationText: "Query selon le lieu",
        currentTextText: "Mesure actuelle",
        queryByAttributesText: "Requête par attributs",
		queryMsg: "Recherche...",
        cancelButtonText: "Remettre",
        noFeaturesTitle: "Pas de correspondance",
        noFeaturesMessage: "Votre requête n'a retourné aucun résultat.",
        title: "Rechercher",
        northLabel:"Nord",
        westLabel:"Ouest",
        eastLabel:"Est",
        southLabel:"Sud",
        setAoiText: "FixéROI",
        setAoiTooltip: "Activer le contrôle TextBox pour dessiner un ROI (BOX) sur la carte",
        attributeEnablement: "Requête par attributs",
        attributeEnablementMsg: "Invalid search Type! To use this you have to select 'Feature' type and to select a vector layer before.",
        searchType: "Réglages de base",
        typeLabel: "Type",
        featureLabel: "Max Features",
		spatialLabelText: "Sans établir un ROI vous interrogez l'ensemble des données dans la mesure où la carte actuelle.",
		featureLabelText: "Avec un nombre élevé de caractéristiques que le serveur peut prendre un certain temps à réagir. Limitez votre recherche!",
		spmText:"SPM",
		sourcedepthLabel : "Profondeur de la source (m)",
		sourcefrequencyLabel : 'Fréquence de la source (kHz)',
		sourcepressurelevelLabel : 'Niveau pression de la source (dB)',
		modelnameLabel : 'Nom du modèle',
		seasonLabelText: 'Saison',
		securityLevelLabelText : 'Niveau de sécurité',
		allText: 'Tous',
		springText : "Le Printemps",
		winterText : "L'Hiver",
		fallText : "Automne",
		summerText : "L'Été",
		modelRunDateText:'Date d\'exécution du modèle',
		modelEndDateText:'Date de fin du modèle',
		qualityLabel: "Qualité",
		bottomTypeLabel: "Type Bottom",
		tlModelLabel: "Modèle TL"
    },
    "gxp.plugins.GeoReferences.prototype":{
        initialText: "Sélectionner une zone",
        menuText: "Codification Géographique",
        tooltip: "Codification Géographique"
    },
	"gxp.plugins.IDASpm.prototype":{
		title: "Création d'SPM",
		pointSelectionButtonLabel: '',
		springText : "Le Printemps",
		winterText : "L'Hiver",
		fallText : "Automne",
		summerText : "L'Été",
		soundPropagationModelParamText: 'Sound Propagation Model param...',
		soundSourcePointText: 'Lieu de source du son',
		svpsoundSourcePointText: 'Lieu du profil de la vitesse du son',
		svpUploadDialogTitle: "Son profil de vVitesse",
		sourcedepthLabel : "Profondeur de la source (m)",
		sourcefrequencyLabel : 'Fréquence de la source (kHz)',
		sourcepressurelevelLabel : 'Niveau pression de la source(dB)',
		modelnameLabel : 'Nom du Course',
		pointSelectionButtionTip: 'Activer la sélection du point',
		seasonLabelText: 'Saison',
		securityLevelLabelText : 'Niveau de sécurité',
		applyText: 'Courir',
		resetText: 'Reset',
		settingColorTitle: 'Couleur',
		spmList: "Modèles Soumet",
		spmTooltip: "Affiche les Modèles Soumet",
		missingParameterTitle:"Paramètres manquants",
		missingParameterMsg:"S'il vous plaît régler tous les paramètres obligatoires",
		userInput: "Entrée de l'utilisateur",
		applyMultiText: 'Tout exécuter',
		saveText: 'Enregistrer SPM',
		spmSaveTooltip: "Enregistrer Sound Propagation Model run",
		spmExecuteTooltip: "Exécuter Sound Propagation Model run/runs",
		spmResetTooltip: "Réinitialiser Entrées SPM",
		spmExecuteMessage: "Sound Propagation Model exécuter les requêtes envoyées.",
		spmSaveMessage: "Sound Propagation Model run <b>{modelName}</b> sauvé",
		spmXMLImportMsg: "All SPM XML runs are added",
		svpImportMsg: "Sound Velocity Profile importé avec succès",
		svpFileMissingMsg: "SVP fichier est obligatoire pour les \"User Input\" saison",
		spmBatchComposerMsg: "Compositeur Runs",
		composerErrorMsg:"Erreur compositeur",
		removeMsg: "Enlever",
		runNameMsg: "Exécutez Nom",
		runListFieldSetName: "Exécutez Liste (Cliquez sur Tout exécuter à START)",
		runListNoRunMsg: "Pas de SPM courir pour exécuter",
		composerErrorTitle:"Entrez au moins deux SPM va utiliser le compositeur",
		svpFileImportErrorTitle: "SVP charger erreur.",
		svpFileImportErrorMsg: "SVP fichier n'est pas correctement chargé.",
		xmlRunListImportWinTitle: "Importer Runs à partir de XML",
		importRunButton: "Importer Runs",
        errorDoubleLayerNameMsg: "Un Modèle portant ce nom existe déjà",
        errorLayerNameMsg: "Le nom du Modèle ne peut pas commencer par un chiffre, </br> ne peut pas contenir d'espace blanc </br> et ne peut pas contenir des caractères '*', '%', '-'",
		advancedTitle: "Mode Avancé",
		advancedTitleA: "Entrée Avancée 1",
		advancedTitleB: "Entrée Avancée 2",
		batchModeTitle: "Mode Batch",
		tlModelLabelText: "Modèle TL",
		tlModelEmptyText: "Sélection Modèle TL",
		bottomTypeEmptyText: "Sélection Bottom type Selection",
		bottomTypeLabelText: "Type Bottom",
		qualityEmptyText: "Sélection de la Qualité",
		qualityLabelText: "Qualité",		
		maxRangeText: "Range Max"
	},
	"Ext.DatePicker.prototype":{
		todayText         : "Aujourd'hui",
        minText           : "Cette date est antérieure à la date minimum",
        maxText           : "Cette date est postérieure à la date maximum",
        disabledDaysText  : "",
        disabledDatesText : "",
        monthNames        : [
							   "Janvier",
							   "Février",
							   "Mars",
							   "Avril",
							   "Mai",
							   "Juin",
							   "Juillet",
							   "Août",
							   "Septembre",
							   "Octobre",
							   "Novembre",
							   "Décembre"
							],
        dayNames          : [
							   "Dimanche",
							   "Lundi",
							   "Mardi",
							   "Mercredi",
							   "Jeudi",
							   "Vendredi",
							   "Samedi"
							],
        nextText          : 'Mois suivant (CTRL+Flèche droite)',
        prevText          : "Mois précédent (CTRL+Flèche gauche)",
        monthYearText     : "Choisissez un mois (CTRL+Flèche haut ou bas pour changer d'année.)",
        todayTip          : "{0} (Barre d'espace)",
        okText            : "&#160;OK&#160;",
        cancelText        : "Annuler",
        format            : "d/m/y",
        startDay          : 1
	},
	
	/*-------------------------------------------------------------*/
	
    "gxp.FilterBuilder.prototype": {
        builderTypeNames: ["Tout", "tous", "aucun", "pas tout"],
        preComboText: "Match",
        postComboText: "de ce qui suit:",
        addConditionText: "Ajouter la condition",
        addGroupText: "Ajouter un groupe",
        removeConditionText: "Supprimer la condition"
    },
	
    "gxp.IDAFilterBuilder.prototype": {
        builderTypeNames: ["Tout", "tous", "aucun", "pas tout"],
        preComboText: "Match",
        postComboText: "de ce qui suit:",
        addConditionText: "Ajouter la condition",
        addGroupText: "Ajouter un groupe",
        removeConditionText: "Supprimer la condition"
    },
	"gxp.plugins.IDAAttribute.prototype": {
                title: "Attributes de niveau",
		settingsTitle: "Réglages de base",
		settingNameTitle: "Nom",
		settingColorTitle: "Couleur",
		settingClassificationTitle: "Classification",
		filterTitle: "Filtrer",
		reloadLayerText: "Recharger les niveaux",
		applyFilterText: "Appliquer",
		resetText: "Remettre",
                rasterAlgebraExecuteMessage: "Layer Attribute run demande envoyée.",
                filterApplyTitle: "Appliquer le filtre",
                filterApplyMsg: "Votre filtre est vide ou n'est pas correctement formaté!"
    },
    
        
    "gxp.plugins.WFSGrid.prototype":{
	displayMsgPaging: "Affichage des résultats {0} - {1} of {2}",
        emptyMsg: "Aucun résultat à afficher",
        addLayerTooltip: "Ajouter couche à la carte",
        detailsTooltip: "Afficher les détails",
        detailsHeaderName: "Nom de la propriété",
        detailsHeaderValue: "Valeur de la propriété",
        detailsWinTitle: "Détails",
        deleteTooltip: "Supprimer l'entité",
        deleteConfirmMsg: "Êtes-vous sûr de vouloir supprimer cette entité?"
     }

});
