class View extends EventEmitter
{
  constructor ()
  {
    super();
  }

  addToLoader (id, file)
  {
    PIXI.loader
      .add(id, file);
  }

  loadLoader (callback)
  {
    PIXI.loader
      .load(callback);
  }

  /**
     * addSpriteElement creates a pixi sprite from a texture defined in the position given and as a child of the container given
     * @param referenceToTextureCache
     * @param posX
     * @param posY
     * @param sizeX
     * @param sizeY
     * @param containerElement
     */
  addSpriteElement (referenceToTextureCache, posX, posY, sizeX, sizeY, containerElement)
  {
    let texture = PIXI.utils.TextureCache[referenceToTextureCache];

    if (texture !== undefined || texture != null)
    {
      let sprite = new PIXI.Sprite(texture);
      sprite.width = texture.width;
      sprite.height = texture.height;
      sprite.x = posX;
      sprite.y = posY;

      containerElement.addChild(sprite);

      return sprite;
    }
    else
    {
      Utils.createLogMessage('%c >> Texture named ' + referenceToTextureCache + ' NOT FOUND ON ATLASES, ¿is it required? ❓❓❓', LOG_STYLES.COMPONENT_MISSING);
      console.log(' ');
      return new PIXI.Sprite();
    }
  }

  /**
     * setTextElement creates a pixi bitmaptext given a textstring, on the position given and as a child of the container given
     * @param textString
     * @param posX
     * @param posY
     * @param styles
     * @param containerElement
     */
  setTextElement (textString, posX, posY, styles, containerElement)
  {
    let message = new PIXI.extras.BitmapText(textString, styles);
    message.tint = Number(styles.color);
    message.y = posY;
    message.x = posX;

    containerElement.addChild(message);

    return message;
  }

  createTexture (referenceToTextureCache)
  {
    let texture = PIXI.utils.TextureCache[referenceToTextureCache];
    if (texture !== undefined)
    {
      return texture;
    }
    else
    {
      Utils.createLogMessage('%c Error creating texture: The atlas element ' + referenceToTextureCache + ' does not exist, is it required? ❓❓❓ ', LOG_STYLES.COMPONENT_MISSING);
    }
  }

  /**
     * setButtonElement adds a precreated button to the game view
     * @param button
     * @param posX
     * @param posY
     * @param sizeX
     * @param sizeY
     * @param containerElement
     * @returns {*}
     */
  setButtonElement (button, posX, posY, sizeX, sizeY, containerElement)
  {
    let container = new PIXI.Container();
    container.position.x = posX;
    container.position.y = posY;
    container.width = button.view.width;
    container.height = button.view.height;

    container.addChild(button.view);
    containerElement.addChild(container);

    return button;
  }

  /**
     * loadBackgroundImage adds a background image to the game
     * @param source
     * @param stage
     */
  loadBackgroundImage (source, stage)
  {
    let imageBackgroundContainer = new PIXI.Container();
    this.addSpriteElement(source, 0, 0, 0, 0, imageBackgroundContainer);
    stage.addChild(imageBackgroundContainer);
  }
}
