class AssetsLoader extends View
{
  constructor (project, assetsJSONLoader, assetsType)
  {
    super();
    this._project = project;
    this._assetsJSONLoader = assetsJSONLoader;
    this._assetsType = assetsType;
    this.prepareAssetsBound = this.prepareAssets.bind(this);
    this.onAssetsLoadedBound = this.onAssetsLoaded.bind(this);
    this._availableFonts = [];
  }

  get availableFonts ()
  {
    return this._availableFonts;
  }

  readAssetsJSON ()
  {
    if (this._project !== '')
    {
      this._assetsJSONLoader.addListener(Event.READY, this.prepareAssetsBound);
      this._assetsJSONLoader.load();
    }
    else
    {
      console.log('Layout Previewer: Project parameter in URL is empty (if you\'re on the Welcome Page, it\'s normal ^_^ )');
    }
  }

  prepareAssets (event)
  {
    this._assetsJSONLoader.removeListener(Event.READY, this.prepareAssetsBound);
    let assetsToLoad = [];
    for (let key in event.data[this._assetsType])
    {
      assetsToLoad.push(event.data[this._assetsType][key]);
    }
    this._assetsJSONLoader.destroy();
    this._assetsJSONLoader = null;

    this.loadAssets(assetsToLoad);
  }

  loadAssets (assetsToLoad)
  {
    switch (this._assetsType)
    {
      case ASSETS_TYPE.FONTS:
        for (let i = 0; i < assetsToLoad.length; i++)
        {
          this._availableFonts.push(assetsToLoad[i]['id']);
          this.addToLoader(assetsToLoad[i]['id'], assetsToLoad[i]['xml']);
        }
        break;

      case ASSETS_TYPE.IMAGES:
        for (let i = 0; i < assetsToLoad.length; i++)
        {
          this.addToLoader(assetsToLoad[i]['id'], assetsToLoad[i]['file']);
        }
        break;

      case ASSETS_TYPE.ATLASES:
        for (let i = 0; i < assetsToLoad.length; i++)
        {
          this.addToLoader(assetsToLoad[i]['id'], assetsToLoad[i]['file']['json']);
        }
        break;

      default:
        console.warn('asset type not supported');
        break;
    }
    this.loadLoader(this.onAssetsLoadedBound);
  }

  onAssetsLoaded (event)
  {
    for (let key in event.resources)
    {
      if (event.resources[key].error != null)
      {
        Utils.createLogMessage('%c ERROR loading the following asset 😱: ' + key + '' + event.resources[key].error, LOG_STYLES.COMPONENT_NEEDED);
        return;
      }
    }
    switch (this._assetsType)
    {
      case ASSETS_TYPE.FONTS:
        this.dispatch('FontsAreLoaded');
        break;

      case ASSETS_TYPE.IMAGES:
        this.dispatch('ImagesAreLoaded');
        break;

      case ASSETS_TYPE.ATLASES:
        this.dispatch('AtlasesAreLoaded');
        break;

      default:
        console.warn('asset type not supported');
        break;
    }
  }
}
