const ButtonStates = {
    UP: '0',
    OVER: '1',
    DOWN: '2',
    DISABLED: '3',
    SELECTED: '4'
};

class PixiButton extends EventEmitter
{
    constructor( textures, text=null, statesFontStyles=null )
    {
        super();
        this._textures = textures;
        this._text = text;
        this._statesFontStyles = statesFontStyles;
        this._statesFontStylesIndex = -1;

        // BUTTON VIEW DEFINITION
        this._view = new PIXI.Container();
        this._view.interactive = true;
        this._view.buttonMode=true;
        
        // BUTTON BACKGROUND SPRITE
        this._background = new PIXI.Sprite();
        this._background["texture"] = this._textures[ButtonStates.UP];
        this._view.addChild(this._background);
        
        // BUTTON TEXT
        if(this._text)
        {
            this._view.addChild(this._text);
            if(this._statesFontStyles)
            {
                this.applyStateFontStyle(ButtonStates.UP);
            }
            else
            {
                this.centerText();
            }
        }
        this._enabled = true;
        
        this.onButtonEventBound = this.onButtonEvent.bind(this);

        this._view.on('mousedown', this.onButtonEventBound);
        this._view.on('touchstart', this.onButtonEventBound);

        this._view.on('mouseup', this.onButtonEventBound);
        this._view.on('touchend', this.onButtonEventBound);
        this._view.on('mouseupoutside', this.onButtonEventBound);
        this._view.on('touchendoutside', this.onButtonEventBound);

        this._view.on('mouseover', this.onButtonEventBound);
        this._view.on('mouseout', this.onButtonEventBound);

        this._view.on('click', this.onButtonEventBound);
        this._view.on('tap', this.onButtonEventBound);
    }

    /**
     * applyStateFontStyle applies font style to text if it has been previously defined
     * @param index
     */
    applyStateFontStyle(index=0)
    {
        if(this._statesFontStyles && this._statesFontStylesIndex!=index)
        {
            let style = (this._statesFontStyles[index])?this._statesFontStyles[index]:this._statesFontStyles[ButtonStates.UP];
            let x = 0;
            let y = 0;
            if(style.color)
            {
                this._text.tint = Number(style.color);
            }
            if(style.scale) {
                this._text.scale.x = style.scale;
                this._text.scale.y = style.scale;
            }
            if(style.x) {
                x = style.x;
            }
            if(style.y) {
                y = style.y;
            }
            this.centerText(x,y);
            this._statesFontStylesIndex = index;
        }
    }

    centerText(x=0,y=0)
    {
        this._text.x = (this._textures[ButtonStates.UP].width*0.5) - (this._text.width*0.5) + x;
        this._text.y = (this._textures[ButtonStates.UP].height*0.5) - (this._text.height) + y;
    }

    get view()
    {
        return this._view;
    }

    get background()
    {
        return this._background;
    }

    /**
     * @return {boolean}
     */
    get enabled()
    {
        return this._enabled;
    }

    /**
     * @param {boolean} value
     */
    set enabled(value)
    {
        this._enabled = value;

        if( this._enabled )
        {
            this.state = ButtonStates.UP;
        }
        else
        {
            this.state = ButtonStates.DISABLED;
            if(!this._textures[ButtonStates.DISABLED])
            {
                this._enabled=true;
                this.state = ButtonStates.UP;
            }
        }
    }

    /**
     * state defines according to the current button state its image and text style
     * @param value
     */
    set state(value)
    {
        if( this._state === value )
            return;

        this._state = value;
        let currentState=null;

        switch(this._state)
        {
            case ButtonStates.UP:
                this._background["texture"] = this._textures[ButtonStates.UP];
                if(this._statesFontStyles)
                {
                    this.applyStateFontStyle(ButtonStates.UP);
                }
                break;

            case ButtonStates.OVER:
                currentState=ButtonStates.OVER;
                if(this._enabled)
                {
                    if(!this._textures[ButtonStates.OVER])
                    {
                        currentState=ButtonStates.UP;
                    }
                }
                this._background["texture"] = this._textures[currentState];
                if(this._statesFontStyles)
                {
                    this.applyStateFontStyle(currentState);
                }
                break;

            case ButtonStates.DOWN:
                currentState=ButtonStates.DOWN;
                if(this._enabled)
                {
                    if(!this._textures[ButtonStates.DOWN])
                    {
                        currentState=ButtonStates.UP;
                    }
                }
                this._background["texture"] = this._textures[currentState];
                if(this._statesFontStyles)
                {
                    this.applyStateFontStyle(currentState);
                }
                    break;

            case ButtonStates.DISABLED:
                this._background["texture"] = this._textures[ButtonStates.DISABLED];
                if(this._statesFontStyles) {
                    this.applyStateFontStyle(ButtonStates.DISABLED);
                }
                this._background.buttonMode=false;
                break;

            case ButtonStates.SELECTED:
                currentState=ButtonStates.SELECTED;
                if(this._enabled)
                {
                    if(!this._textures[ButtonStates.SELECTED])
                    {
                        currentState= ButtonStates.UP;
                    }
                }
                this._background["texture"] = this._textures[currentState];
                if(this._statesFontStyles) {
                    this.applyStateFontStyle(currentState);
                }
                break;

            default:
                break;
        }
    }
    /**
     * onButtonEvent defines the switching state
     * @param {Object} event
     */
    onButtonEvent(event){

        if( !this.enabled ) {
            return;
        }

        switch(event['type'])
        {
            case 'mousedown':
            case 'touchstart':
                this.state = ButtonStates.DOWN;
                break;

            case 'mouseup':
            case 'touchend':
            case 'mouseupoutside':
            case 'touchendoutside':
                if(this._state!=ButtonStates.OVER)
                {
                    this.state=ButtonStates.UP;
                }

                break;

            case 'mouseover':
                if(this._state!=ButtonStates.DOWN && this._state!=ButtonStates.SELECTED)
                {
                    this.state=ButtonStates.OVER;
                }
                break;

            case 'mouseout':
                if(this._state!=ButtonStates.DOWN && this._state!= ButtonStates.SELECTED)
                {
                    this.state=ButtonStates.UP;
                }
                break;

            case 'click':
            case 'tap':
                break;

            default:
                break;
        }
    }
}