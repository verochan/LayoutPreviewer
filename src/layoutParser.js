class LayoutParser extends View
{
    constructor(stage, componentContainersArray, textToShow, layoutToLoad, componentsToLoad, schemaJSONLoader, schemaDefinitionsJSONLoader, renderer, availableFonts)
    {
        super();
        this._renderer=renderer;
        this._componentsToLoad=componentsToLoad;
        this._schemaJSONLoader=schemaJSONLoader;
        this._schemaDefinitionsJSONLoader=schemaDefinitionsJSONLoader;

        this._layoutChecker= new LayoutChecker(this._schemaJSONLoader, this._schemaDefinitionsJSONLoader);

        this._availableFonts=availableFonts;

        this._gameStage= new PIXI.Container();
        stage.addChild(this._gameStage);
        this._textToShow=textToShow;
        this._layoutToLoad=layoutToLoad;
        this._layoutToLoadData=null;

        this._usedElementsArray=[];
        this._componentContainersArray=componentContainersArray;

        this._layoutJSONLoader=null;

        this.loadLayoutBound=this.loadLayout.bind(this);
        this.loadComponentsBound=this.loadComponents.bind(this);

        // LAYOUT LOAD CONTROLLER DEPENDENCY
        this._layoutLoadController=new LayoutLoadController(componentContainersArray);
        this.onLayoutLoadedBound=this.onLayoutLoaded.bind(this);
        this._layoutLoadController.addListener('LayoutIsLoaded', this.onLayoutLoadedBound);

        // Beginning..
        this.loadBackgroundImage(SETTINGS.BACKGROUND_FILE, this._gameStage);
        this.readComponentsToLoadJSON();
    }

    // Read & load componentsToLoad part

    readComponentsToLoadJSON()
    {
        //console.log(this.componentsToLoad);
        this._componentsJSONLoader= new JSONLoader(this._componentsToLoad);
        this._componentsJSONLoader.addListener(Event.READY, this.loadComponentsBound);
        this._componentsJSONLoader.load();
    }

    loadComponents(event)
    {
        this._componentsJSONLoader.removeListener(Event.READY, this.loadComponentsBound);
        this._componentsJSONLoader.destroy();
        this._componentsJSONLoader=null;

        this._layoutLoadController.componentsToLoad=event.data['components'];
        //console.log(event.data['components']);
        this.readLayoutJSON();
    }

    // Read & load layout part

    readLayoutJSON()
    {
        this._layoutJSONLoader= new JSONLoader(this._layoutToLoad);
        this._layoutJSONLoader.addListener(Event.READY, this.loadLayoutBound);
        this._layoutJSONLoader.load();
    }

    loadLayout(event)
    {
        this._layoutJSONLoader.removeListener(Event.READY, this.loadLayoutBound);
        this._layoutJSONLoader.destroy();
        this._layoutJSONLoader=null;
        this._layoutToLoadData=event.data['elements'];

        this._layoutLoadController.prepareLayout(this._layoutToLoadData);
    }

    onLayoutLoaded()
    {
        this.onLayoutCheckedSuccessfullyBound=this.onLayoutCheckedSuccessfully.bind(this);
        this._layoutChecker.addListener('layoutCheckedSuccessfully', this.onLayoutCheckedSuccessfullyBound);

        // Define Renderer
        this._renderer.defineRenderer(this._layoutToLoadData['ResolutionToLoad']);

        // Check layout schema
        this._layoutChecker.checkLayout(this._layoutToLoadData);
    }

    onLayoutCheckedSuccessfully()
    {
        // If schema is ok... parselayout
        this.parseLayout(this._layoutToLoadData);
    }

    /**
     * This function renders elements of type sprites, texts and buttons found in the layout; Containers are left aside, the container or containers
     * of an element will be looked for in the getComponentRelativePosition() function.
     * @param layout
     */
    parseLayout(layout)
    {
        //console.log('ParseLayout', layout);
        // Loop through the layout, and find if any children of the parent object contains a renderable  element, if that's the case,
        // count how many elements in the layout use the previous found layout (for example: a CardLayout can be used by many objects, CardLayout0, CardLayout1, CardLayout2...)
        for(let parent in layout)
        {
            //console.log("Parent: "+parent+'_ _'+JSON.stringify(layout[parent], null, 3));
            this._usedElementsArray=0;
            this._usedElementsArray=[];
            let hasRenderableElement=false;
            let componentContainer;
            let count=0;

            for(let key in layout[parent])
            {
                //console.log('Current element: ', layout[parent][key], key);
                if(key.includes('Sprite') || key.includes('Text') || key.includes('Button'))
                {
                    // If a renderable element exists, create a componentContainer to attach the future view or views that will be rendered
                    componentContainer= new PIXI.Container();
                    this._componentContainersArray.push({'id':parent, 'view':componentContainer});
                    hasRenderableElement=true;
                    count = this.getNumberOfObjectsToRender(parent, layout);
                    break;
                }
            }

            // If count > 1 means that we've got copies/elements that use a common layout (for example: several cards use a cardlayout in common),
            // now for each "count" we render sprites/text/buttons, assign it to a view, look for the parent hierarchy to assign the relative position:
            // that is to say, if we're talking about cards, we create a view for each card.
            //console.log('count: ', count);
            for(let i=0; i<count; i++)
            {
                let view=new PIXI.Container();

                for(let key in layout[parent])
                {
                    if(key.includes('Sprite'))
                    {
                        //console.log('sprite case: ', key);
                        let textureName;
                        textureName=key.split('_')[0]+'Texture';

                        let sprite=this.addSpriteElement(textureName, layout[parent][key].x, layout[parent][key].y, layout[parent][key].w, layout[parent][key].h, view);

                    }
                    else if(key.includes('Text'))
                    {
                        if(this._availableFonts.indexOf(layout[parent][key].style.font.split('px ')[1])!=-1)
                        {
                            //console.log('text case', key);
                            let styles= layout[parent][key].style;
                            let text=this.setTextElement(this._textToShow, layout[parent][key].x, layout[parent][key].y, styles, view);
                        }
                        else
                        {
                            Utils.createLogMessage('%c Font named '+layout[parent][key].style.font.split('px ')[1]+' has not been found on fontsToLoad folder 😱', LOG_STYLES.COMPONENT_NEEDED);
                            return;
                        }

                    }
                    else if(key.includes('Button'))
                    {
                        //console.log('button case: ', key, key.split('_')[0]+'TextureUp', layout[parent][key.split('_')[1]+'TagUp']);
                        // Does the button have text?
                        let text=null;
                        let buttonTextsStyles=null;
                        if(layout[parent].hasOwnProperty([key.split('_')[1]+'TagUp']))
                        {
                            let styles= layout[parent][key.split('_')[1]+'TagUp'].style;
                            text=this.setTextElement(this._textToShow, layout[parent][key.split('_')[1]+'TagUp'].x, layout[parent][key.split('_')[1]+'TagUp'].y, styles, view);

                            let overStyles=null;
                            let downStyles=null;
                            let disabledStyles=null;
                            let selectedStyles=null;

                            if(layout[parent].hasOwnProperty([key.split('_')[1]+'TagOver']))
                            {
                                overStyles=layout[parent][key.split('_')[1]+'TagOver'].style;
                            }
                            if(layout[parent].hasOwnProperty([key.split('_')[1]+'TagDown']))
                            {
                                downStyles=layout[parent][key.split('_')[1]+'TagDown'].style;
                            }
                            if(layout[parent].hasOwnProperty([key.split('_')[1]+'TagDisabled']))
                            {
                                disabledStyles=layout[parent][key.split('_')[1]+'TagDisabled'].style;
                            }
                            if(layout[parent].hasOwnProperty([key.split('_')[1]+'TagSelected']))
                            {
                                selectedStyles=layout[parent][key.split('_')[1]+'TagSelected'].style;
                            }

                            buttonTextsStyles=[
                                styles,
                                overStyles,
                                downStyles,
                                disabledStyles,
                                selectedStyles
                            ];
                        }

                        let button = new PixiButton(
                            [
                            this.createTexture(key.split('_')[0]+'TextureUp'),
                            this.createTexture(key.split('_')[0]+'TextureOver'),
                            this.createTexture(key.split('_')[0]+'TextureDown'),
                            this.createTexture(key.split('_')[0]+'TextureDisabled'),
                            this.createTexture(key.split('_')[0]+'TextureSelected')
                            ],
                            text,
                            buttonTextsStyles
                        );
                        button.enabled = true;

                        this.setButtonElement
                        (
                            button,
                            layout[parent][key].x,
                            layout[parent][key].y,
                            layout[parent][key].w,
                            layout[parent][key].h,
                            view
                        );
                    }
                }
                if(hasRenderableElement)
                {
                    //console.log('hasrenderableelement: ', parent);

                    // Get the whole position for the view, this is 'complicated', in some parts of the project's code the position is assigned to the componentContainer
                    // while others are assigned to the view (in the case of cards, the whole position is assigned to each card, in the case of a popup
                    // the whole position is assigned to the componentContainer) so, in this case for simplicity and not splitting this part in many cases
                    // the whole position is assigned to the view
                    let position= {'x':0, 'y':0, 'z':0};
                    let scale= {'x':1, 'y':1};
                    this.getComponentRelativePosition(parent, layout, position, scale);

                    //console.log('final position of: ',  parent, position);

                    view.x=position.x;
                    view.y=position.y;
                    view.scale.x=scale.x;
                    view.scale.y=scale.y;

                    // Attach the componentContainer to the gameStage and attach the view to the componentContainer
                    this._gameStage.addChild(componentContainer);
                    componentContainer.addChild(view);

                    //console.log('VIEW: ', this.gameStage);
                }
            }
        }
        this.dispatch('SetCheckPanel');
    }

    /**
     * This function counts how many objects that use a same layout exist (a bunch of cards use CardLayout)
     * @param parent
     * @param layout
     * @returns {number}
     */
    getNumberOfObjectsToRender(parent, layout)
    {
        //console.log('getNumberOfObjectsToRender: ', parent);
        // count always will be 1 as minimum
        let count=1;
        let firstTimeIn=true;
        for(let firstLevelKey in layout)
        {
            for(let secondLevelKey in layout[firstLevelKey])
            {
                let secondLevelKeyWithNoDigits = secondLevelKey.split('_')[0].replace(/[0-9]/g, '');
                //console.log('secondLevelKey and firstLevelKey: ', secondLevelKey, firstLevelKey);
                if(secondLevelKeyWithNoDigits==parent)
                {
                    //console.log('parent elements added to count: ', parent, secondLevelKey, secondLevelKeyWithNoDigits);
                    // This is done in order to numbered elements (cardlayout0, cardlayout1...) were added an extra element, this way is counted for both cases correctly
                    if(Utils.checkIfStringHasNumbers(secondLevelKey) && firstTimeIn)
                    {
                        if(count==1)
                        {
                            count=0;
                        }
                    }
                    count++;
                    firstTimeIn=false;
                }
            }
        }
        return count;
    }

    /**
     * This function loops through the entire layout in order to find the parent hierarchy of an element recursivel to calculate its complete position on the stage
     * @param element
     * @param layout
     * @param position
     * @param scale
     */
    getComponentRelativePosition(element, layout, position, scale)
    {
        //console.log('getComponentRelativePosition: ', element, position);
        let parentIsFound=false;
        let nextElement=null;

        // The loops are named because I couldn't break from the loop normally and positions weren't being calculated fine... this way it breaks for sure.
        Loop1:
        for(let firstLevelKey in layout)
        {
            Loop2:
            for(let secondLevelKey in layout[firstLevelKey])
            {
                //console.log('secondLevelKey and element: ', secondLevelKey, firstLevelKey);
                if(secondLevelKey.includes(element))
                {
                    // Case where the name matches exactly
                    if(secondLevelKey==element)
                    {
                        //console.log('==');
                        position.x+=layout[firstLevelKey][secondLevelKey].x;
                        position.y+=layout[firstLevelKey][secondLevelKey].y;
                        position.z+=layout[firstLevelKey][secondLevelKey].z;

                        this.checkScale(layout[firstLevelKey][secondLevelKey], scale);

                        nextElement=firstLevelKey;
                        parentIsFound=true;
                        break Loop1;
                    }
                    else
                    {
                        if(this._usedElementsArray.indexOf(secondLevelKey)==-1)
                        {
                            // We save the used elements in order to not visit them again (for example, in the case of CardLayout0, 1, 2...)
                            // On the case, a common layout called from several layouts (ballLayout called from AnimatedBalls and AllBalls),
                            // it is compulsory the element to contain _ plus an id, otherwise the code would discard the element with the same name,
                            // and its position won't be calculated properly

                            //console.log('0 !=', secondLevelKey);
                            let secondLevelKeyWithNoDigits = secondLevelKey.split('_')[0].replace(/[0-9]/g, '');
                            if(secondLevelKeyWithNoDigits==element)
                            {
                                //console.log('!=', secondLevelKey);
                                //console.log('main cases: ', secondLevelKey, firstLevelKey);
                                nextElement=firstLevelKey;

                                position.x+=layout[firstLevelKey][secondLevelKey].x;
                                position.y+=layout[firstLevelKey][secondLevelKey].y;
                                position.z+=layout[firstLevelKey][secondLevelKey].z;

                                this.checkScale(layout[firstLevelKey][secondLevelKey], scale);

                                parentIsFound=true;

                                this._usedElementsArray.push(secondLevelKey);
                                break Loop1;
                            }
                        }
                    }
                }
            }
        }
        if(parentIsFound)
        {
            //console.log('parentIsFound: ', nextElement, position, this.usedElementsArray);
            this.getComponentRelativePosition(nextElement, layout, position, scale);
        }
    }

    /**
     * checkScale checks if a layout element contains a scale different from 1, if it does, it saves and applies it to the current element
     * @param layoutObject
     * @param scale
     */
    checkScale(layoutObject, scale)
    {
        if(layoutObject.hasOwnProperty('scale'))
        {
            if(layoutObject.scale!=1)
            {
                scale.x=scale.x*layoutObject.scale.x;
                scale.y=scale.y*layoutObject.scale.y;
            }
        }
    }
}