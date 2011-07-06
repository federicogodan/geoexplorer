/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */

GeoExt.Lang.add("fr", {
    "GeoExplorer.prototype": {
        zoomSliderText: "<div> Niveau de zoom: {zoom}</div><div Echelle: 1:{scale}</div>",
        loadConfigErrorText: "Difficulté à lire configuration enregistrée: <br>",
        loadConfigErrorDefaultText: "Erreur du serveur.",
        xhrTroubleText: "Trouble de la communication: état",
        layersText: "Couches",
        titleText: "Titre",
        zoomLevelText: "Zoom level",        
        saveErrorText: "Sauver Trouble:",
        bookmarkText: "Mettre en favori URL",
        permakinkText: "Permalink",
        appInfoText: "A propos",
        aboutText: "À propos de GeoExplorer",
        mapInfoText: "Info carte",
        descriptionText: "Description",
        contactText: "Contact",
        aboutThisMapText: "À propos de cette carte",
        searchTabTitle : "Search",
        viewTabTitle : "View"
    },
    
    "GeoExplorer.Composer.prototype": {
        loadMapText: "Import Map",
        saveMapText: "Enregistrez la carte",
        toolsTitle: "Choose tools to include in the toolbar:",
        previewText: "Preview",
        backText: "Back",
        nextText: "Next",
        loginText: "Login",
        loginErrorText: "Invalid username or password.",
        userFieldText: "User",
        passwordFieldText: "Password"
    },

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Layer"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Ajouter des calques",
        addActionTip: "Ajouter des calques",
        addServerText: "Ajouter un nouveau serveur",
        addButtonText: "Add layers",        
        untitledText: "Sans titre",
        addLayerSourceErrorText: "Erreur capacités WMS obtenir ({msg}).\nVeuillez vérifier URL et essayez à nouveau.",
        availableLayersText: "Layers disponible",
        expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>",
        panelTitleText: "Title",
        layerSelectionText: "View available data from:",        
        doneText: "Terminé",
        uploadText: "Upload Data"
    },

    "gxp.plugins.BingSource.prototype": {
        title: "Calques Bing",
        roadTitle: "Bing routes",
        aerialTitle: "Bing aérienne",
        labeledAerialTitle: "Bing aérienne avec des étiquettes"
    },    

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Please enter the Google API key for ",
        menuText: "Passer à la visionneuse 3D",
        tooltip: "Passer à la visionneuse 3D"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Calques Google",
        roadmapAbstract: "Voir carte de rue",
        satelliteAbstract: "Voir les images satellite",
        hybridAbstract: "Afficher des images avec des noms de rue",
        terrainAbstract: "Voir carte de rue avec le terrain"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Propriétés de la couche",
        toolTip: "Propriétés de la couche"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Couches",
        overlayNodeText: "Surimpressions",
        baseNodeText: "Couches de base"
    },

    "gxp.plugins.Legend.prototype": { 
        menuText: "Légende",
        tooltip: "Légende"
    },

    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Longueur",
        areaMenuText: "Zone",
        lengthTooltip: "Mesure Longueur",
        areaTooltip: "Mesure Zone",
        measureTooltip: "Mesure"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Plan Pan",
        tooltip: "Plan Pan"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom précédent Un",
        nextMenuText: "Zoom sure une Next",
        previousTooltip: "Zoom précédent Un",
        nextTooltip: "Zoom sur une Next"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "Calques OpenStreetMap",
        mapnikAttribution: "Les données CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Les données CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Imprimer carte",
        tooltip: "Imprimer carte",
        previewText: "Aperçu avant impression",
        notAllNotPrintableText: "Non Tous les couches peuvent être imprimés",
        nonePrintableText: "Aucune de vos couches de carte peut être imprimée",
        notPrintableLayersText: "Following layers can not be printed:"        
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest Layers",
        osmAttribution: "Avec la permission de tuiles <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Avec la permission de tuiles <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest Imagery"
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Enlever la couche",
        removeActionTip: "Enlever la couche"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Get Featuree Info",
        popupTitle: "entité Info"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Zoom In",
        zoomOutMenuText: "Zoom arrière",
        zoomInTooltip: "Zoom In",
        zoomOutTooltip: "Zoom arrière"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom sur la carte Max",
        tooltip: "Zoom sur la carte Max"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom sur la couche",
        tooltip: "Zoom sur la couche"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom à la couche",
        tooltip: "Zoom à la couche"
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
        stylesText: "Styles"
    },

    "gxp.NewSourceWindow.prototype": {
        title: "Add New Server...",
        cancelText: "Cancel",
        addServerText: "Add Server",
        invalidURLText: "Enter a valid URL to a WMS endpoint (e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Contacting Server..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Niveau de zoom"
    }
});
