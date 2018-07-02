class Renderer
{
  constructor ()
  {
    this._renderer = null;
    this._domStage = document.getElementById('stagebackground');
    this._domInstructions = document.getElementById('parserInstructions');
    this._domCheckBoxesList = document.getElementById('checkboxesList');
    this._domCheckboxesListButton = document.getElementById('checkboxesListButton');
    this._domTitleContainer = document.getElementById('titleContainer');
    this._domCheckboxesContainer = document.getElementById('checkboxesContainer');
    this._stage = new PIXI.Container();

    this.animateBound = this.animate.bind(this);
  }

  get domStage ()
  {
    return this._domStage;
  }

  get domInstructions ()
  {
    return this._domInstructions;
  }

  get domCheckBoxesList ()
  {
    return this._domCheckBoxesList;
  }

  get domCheckboxesListButton ()
  {
    return this._domCheckboxesListButton;
  }

  get domTitleContainer ()
  {
    return this._domTitleContainer;
  }

  get domCheckboxesContainer ()
  {
    return this._domCheckboxesContainer;
  }

  get stage ()
  {
    return this._stage;
  }

  initRenderer ()
  {
    requestAnimationFrame(this.animateBound);
  }

  animate ()
  {
    requestAnimationFrame(this.animateBound);
    this._renderer.render(this._stage);
  }

  defineRenderer (resolution)
  {
    this._renderer = PIXI.autoDetectRenderer(resolution.w, resolution.h, {
      'autoResize': true,
      'transparent': true,
      'antialias': true,
      'roundPixels': true,
      'resolution': window.devicePixelRatio
    });
    this._domStage.appendChild(this._renderer.view);
    this.initRenderer();
  }
}
