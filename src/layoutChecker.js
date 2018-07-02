class LayoutChecker extends EventEmitter
{
  constructor (schemaJSONLoader, schemaDefinitionsJSONLoader)
  {
    super();
    this._schemaToLoadData = null;
    this._schemaJSONLoader = null;
    this._schemaDefinitionsJSONLoader = schemaDefinitionsJSONLoader;
    this._schemaDefinitionsToLoadData = null;
    this.loadSchemaBound = this.loadSchema.bind(this);
    this.loadDefinitionsSchemaBound = this.loadDefinitionsSchema.bind(this);
    this._ajv = new Ajv({'allErrors': true, 'jsonPointers': true});

    this.readSchemaJSON(schemaJSONLoader, schemaDefinitionsJSONLoader);
  }

  // Read & load schema JSON part
  readSchemaJSON (schemaJSONLoader, schemaDefinitionsJSONLoader)
  {
    this._schemaDefinitionsJSONLoader = schemaDefinitionsJSONLoader;
    this._schemaJSONLoader = schemaJSONLoader;
    this._schemaJSONLoader.addListener(Event.READY, this.loadSchemaBound);
    this._schemaJSONLoader.load();
  }

  loadSchema (event)
  {
    this._schemaJSONLoader.removeListener(Event.READY, this.loadSchemaBound);
    this._schemaJSONLoader.destroy();
    this._schemaJSONLoader = null;
    this._schemaToLoadData = event.data;
    this.readDefinitionsSchemaJSON(this._schemaDefinitionsJSONLoader);
  }

  // Read & load schema definitions part
  readDefinitionsSchemaJSON (schemaDefinitionsJSONLoader)
  {
    this._schemaDefinitionsJSONLoader = schemaDefinitionsJSONLoader;
    this._schemaDefinitionsJSONLoader.addListener(Event.READY, this.loadDefinitionsSchemaBound);
    this._schemaDefinitionsJSONLoader.load();
  }

  loadDefinitionsSchema (event)
  {
    this._schemaDefinitionsJSONLoader.removeListener(Event.READY, this.loadDefinitionsSchemaBound);
    this._schemaDefinitionsJSONLoader.destroy();
    this._schemaDefinitionsJSONLoader = null;
    this._schemaDefinitionsToLoadData = event.data;
  }

  /**
     * checkLayout checks layout.json according to the defined schemaToLoad.json and schemaDefinitionsToLoad.json
     * @param data
     */
  checkLayout (data)
  {
    console.log('Checking layout schema errors...');
    let validator = this._ajv.addSchema(this._schemaDefinitionsToLoadData, 'layoutSchema')
      .compile(this._schemaToLoadData);

    let context = this;

    validator(data, context)
      .then(function (resultData)
      {
        Utils.createLogMessage('%c >> 😊 Layout is following the schema defined successfully!! ', LOG_STYLES.SCHEMA_OK);
        console.log('End of checking layout schema errors');
        context.dispatch('layoutCheckedSuccessfully');
      })
      .catch(function (err)
      {
        if (!(err instanceof Ajv.ValidationError)) throw err;
        // data is invalid
        for (let i = 0; i < err.errors.length; i++)
        {
          Utils.createLogMessage('%c >> 😱 ERROR ' + i + ' at layout object: ' + err.errors[i].dataPath + ' ', LOG_STYLES.SCHEMA_WRONG_TITLE);
          Utils.createLogMessage('%c at object property or properties: ' + JSON.stringify(err.errors[i].params), LOG_STYLES.SCHEMA_WRONG_INFO);
          Utils.createLogMessage('%c REASON: ' + err.errors[i].message + ' ', LOG_STYLES.SCHEMA_WRONG_INFO);
          console.log('\n');
        }
      });
  }
}
