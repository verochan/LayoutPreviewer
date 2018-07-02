class LayoutPreviewTool
{
    constructor()
    {
        this._layoutToLoad=null;
        this._atlasesToLoad=null;
        this._componentsToLoad=null;
        this._schemaToLoad=null;
        this._schemaDefinitionsToLoad=null;

        this._imagesJSONLoader=null;

        this._layoutParser=null;
        this._checkBoxesListManager=null;

        this._availableFonts=null;

        this._componentContainersArray=[];

        // Get project from the URL parameters to load layout/atlas
        this._project = Utils.getParameterByName('project');
        this._textToShow= Utils.getParameterByName('text');

        // Create renderer
        this._renderer=new Renderer();

        // Define atlas and layouts to be loaded
        this.defineFilesToLoad();

        // Define Load fonts
        this.onFontsAreLoadedBound=this.onFontsAreLoaded.bind(this);
        this._fontsLoader=new AssetsLoader(this._project, this._fontsJSONLoader, ASSETS_TYPE.FONTS);
        this._fontsLoader.addListener('FontsAreLoaded', this.onFontsAreLoadedBound);

        // Define Load images
        this.onImagesAreLoadedBound=this.onImagesAreLoaded.bind(this);
        this._imagesLoader=new AssetsLoader(this._project, this._imagesJSONLoader, ASSETS_TYPE.IMAGES);
        this._imagesLoader.addListener('ImagesAreLoaded', this.onImagesAreLoadedBound);

        // Define Load atlas
        this.onAtlasesAreLoadedBound=this.onAtlasesAreLoaded.bind(this);
        this._atlasesLoader=new AssetsLoader(this._project, this._atlasesJSONLoader, ASSETS_TYPE.ATLASES);
        this._atlasesLoader.addListener('AtlasesAreLoaded', this.onAtlasesAreLoadedBound);

        // Init loading assets
        this._fontsLoader.readAssetsJSON();
    }

    defineFilesToLoad()
    {
        this._schemaToLoad=SETTINGS.SCHEMA_TO_LOAD_FOLDER+SETTINGS.SCHEMA_TO_LOAD_FILE;
        this._schemaDefinitionsToLoad=SETTINGS.SCHEMA_TO_LOAD_FOLDER+SETTINGS.SCHEMA_DEFINITIONS_TO_LOAD_FILE;
        this._atlasesToLoad=SETTINGS.ATLAS_TO_LOAD_FOLDER+this._project+SETTINGS.ATLASES_TO_LOAD_FILE;
        this._layoutToLoad=SETTINGS.LAYOUT_TO_LOAD_FOLDER+this._project+SETTINGS.LAYOUT_FILE;
        this._componentsToLoad=SETTINGS.LAYOUT_TO_LOAD_FOLDER+this._project+SETTINGS.COMPONENTS_TO_LOAD_FILE;
        this._fontsJSONLoader= new JSONLoader(SETTINGS.FONTS_TO_LOAD_FOLDER+this._project+SETTINGS.FONTS_TO_LOAD_FILE);
        this._imagesJSONLoader= new JSONLoader(SETTINGS.IMAGES_TO_LOAD_FOLDER+this._project+SETTINGS.IMAGES_TO_LOAD_FILE);
        this._atlasesJSONLoader= new JSONLoader(this._atlasesToLoad);
        this._schemaJSONLoader= new JSONLoader(this._schemaToLoad);
        this._schemaDefinitionsJSONLoader= new JSONLoader(this._schemaDefinitionsToLoad);
    }

    // CALLBACKS RELATED WITH LOADING ASSETS TASKS

    onFontsAreLoaded()
    {
        this._availableFonts=this._fontsLoader.availableFonts;
        this._fontsLoader.removeListener('FontsAreLoaded', this.onFontsAreLoadedBound);
        this._imagesLoader.readAssetsJSON();
    }

    onImagesAreLoaded()
    {
        this._imagesLoader.removeListener('ImagesAreLoaded', this.onImagesAreLoadedBound);
        this._atlasesLoader.readAssetsJSON();
    }

    onAtlasesAreLoaded()
    {
        this._atlasesLoader.removeListener('AtlasesAreLoaded', this.onAtlasesAreLoadedBound);
        this.defineGameViews();
    }

    defineGameViews()
    {
        this._renderer.domInstructions['style']['visibility']="hidden";
        this._renderer.domTitleContainer['style']['visibility']="hidden";
        this._renderer.domCheckBoxesList['style']['visibility']="visible";
        this._renderer.domCheckboxesListButton['style']['visibility']="visible";
        this._layoutParser= new LayoutParser(this._renderer.stage, this._componentContainersArray, this._textToShow, this._layoutToLoad, this._componentsToLoad, this._schemaJSONLoader, this._schemaDefinitionsJSONLoader, this._renderer, this._availableFonts);
        this._checkBoxesListManager= new CheckboxesListManager(this._layoutParser, this._componentContainersArray, this._renderer.domCheckBoxesList, this._renderer.domCheckboxesListButton);
    }
}
let layoutPreviewTool= new LayoutPreviewTool();
