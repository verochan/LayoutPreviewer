class JSONLoader extends EventEmitter
{
  constructor (url)
  {
    super();
    this._destroyed = false;

    this._url = url;

    this.xobj = new XMLHttpRequest();
    this.xobj.overrideMimeType('application/json');

    this.onLoadBound = this.onLoad.bind(this);
  }

  destroy ()
  {
    if (this._destroyed)
    {
      return;
    }

    this._destroyed = true;

    this.xobj.onreadystatechange = null;
    this.xobj = null;
    this.onLoadBound = null;
  }

  load (url)
  {
    this._url = url || this._url;

    this.xobj.open('GET', this._url, true);
    this.xobj.onreadystatechange = this.onLoadBound;
    this.xobj.send(null);
  }

  onLoad ()
  {
    if (this.xobj.readyState == 4 && this.xobj.status == '200')
    {
      let parsed = JSON.parse(this.xobj.responseText);

      this.xobj.onreadystatechange = null;

      this.dispatch(Event.READY, parsed);
    }
  }
}
