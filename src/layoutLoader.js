class LayoutLoadController extends EventEmitter
{
	constructor(componentContainersArray)
	{
		super();

		this._componentsToLoad=null;
		this._layoutToLoad=null;
		this._layoutIsValid=true;

		this._componentContainersArray=componentContainersArray;
	}

	get componentsToLoad()
	{
		return this._componentsToLoad;
	}

	set componentsToLoad(value)
	{
		this._componentsToLoad=value;
	}

    /**
	 * prepareLayout checks which layout elements are needed, optional or not needed according to componentsToLoad.json.
	 * If an element is needed but it isn't on the layout the execution stops.
     * @param layoutToLoad
     */
    prepareLayout(layoutToLoad)
    {
    	console.log('Checking layout components existence...');
        this._layoutToLoad=layoutToLoad;
        this.setElementsNotLoaded();
        this.checkIfLayoutIsValid();
    }

    /**
	 * checkIfLayoutIsValid, if all needed elements are in the layout, go to next step
     */
    checkIfLayoutIsValid()
	{
        console.log('End of checking layout components existence\n');
        if(this._layoutIsValid)
        {
            this.dispatch('LayoutIsLoaded');
        }
	}

    /**
	 * setElementsNotLoaded checks the if the defined objects in componentsToLoad.json exist in layout.json
     */
	setElementsNotLoaded()
	{
		for(let i=0; i<this._componentsToLoad.length; i++)
		{
			if(!this._layoutIsValid)
			{
				break;
			}
			if(this._componentsToLoad[i].hasOwnProperty('parent'))
			{
				//console.log('parent', this._componentsToLoad[i]);
				for(let j=0; j<this._componentsToLoad[i]['names'].length; j++)
				{
                    this.checkIfComponentExists(this._componentsToLoad[i]['names'][j]['name'], this._componentsToLoad[i]['parent'], this._componentsToLoad[i]['names'][j]['isCompulsory']);
				}
            }
            else if(this._componentsToLoad[i].hasOwnProperty('name'))
			{
				this.checkIfComponentExists(this._componentsToLoad[i]['name'], null, this._componentsToLoad[i]['isCompulsory']);
			}
		}
	}

	checkIfComponentExists(componentName, parentName, isCompulsory)
	{
		let layoutComponentToLoad=this._layoutToLoad;
		if(parentName)
		{
			layoutComponentToLoad=this._layoutToLoad[parentName];
		}

        this.setLogForElement(layoutComponentToLoad[componentName], componentName, isCompulsory, parentName);

	}

    /**
	 * setLogForElement prints log according to object element information
     * @param element
     * @param key
     * @param isCompulsory
     * @param parentName
     */
    setLogForElement(element, key, isCompulsory, parentName)
	{
		if(parentName)
		{
            Utils.createLogMessage('%c  PARENT '+parentName, LOG_STYLES.COMPONENT_PARENT);
		}

		if(element==null || element==undefined)
		{
			if(isCompulsory)
			{
				Utils.createLogMessage('%c >> '+key+LOG_TEXTS.COMPONENT_NEEDED, LOG_STYLES.COMPONENT_NEEDED);
				this._layoutIsValid=false;
			}
			else
			{
                Utils.createLogMessage('%c >> '+key+LOG_TEXTS.COMPONENT_MISSING, LOG_STYLES.COMPONENT_MISSING);
			}
		}
		else
		{
			if(Object.keys(element).length>0)
			{
                Utils.createLogMessage('%c >> '+key+LOG_TEXTS.COMPONENT_LOADED, LOG_STYLES.COMPONENT_OK);
			}
			else
			{
				if(isCompulsory)
				{
                    Utils.createLogMessage('%c >> '+key+LOG_TEXTS.COMPONENT_NEEDED, LOG_STYLES.COMPONENT_NEEDED);
					this._layoutIsValid=false;
				}
				else
				{
                    Utils.createLogMessage('%c >> '+key+LOG_TEXTS.COMPONENT_MISSING, LOG_STYLES.COMPONENT_MISSING);
				}
			}
		}
	}
}