class Subscription
{
  constructor (target, contextName, callback)
  {
    this._target = target;
    this._context = contextName;
    this._callback = callback;
    this._isNew = true;
  }

  get target ()
  {
    return this._target;
  }

  get context ()
  {
    return this._context;
  }

  get callback ()
  {
    return this._callback;
  }

  set isNew (value)
  {
    this._isNew = value;
  }

  get isNew ()
  {
    return this._isNew;
  }
}

class EventEmitter
{
  constructor ()
  {
    this.channels = {};
    this.dispatching = false;
  }

  addListener (channel, functionName, contextName)
  {
    let context = contextName || this;
    if (!this.channels[channel])
    {
      this.channels[channel] = [];
    }
    this.channels[channel].push(new Subscription(this, context, functionName));

    return this;
  }

  removeListener (channel, functionName)
  {
    if (!this.channels[channel])
    {
      return;
    }

    for (let i = 0; i < this.channels[channel].length; i++)
    {
      let subscription = this.channels[channel][i];

      if (subscription === undefined)
      {
        this.channels[channel].splice(i, 1);
        i--;
      }
      else if (subscription.callback === functionName)
      {
        if (this.dispatching)
        {
          this.channels[channel][i] = undefined;
        }
        else
        {
          this.channels[channel].splice(i, 1);
          i--;
        }
      }
    }
  }

  hasListener (channel, functionName)
  {
    let result = false;

    if (this.channels[channel])
    {
      for (let i = 0; i < this.channels[channel].length; i++)
      {
        let subscription = this.channels[channel][i];
        if (subscription !== undefined && subscription.callback === functionName)
        {
          result = true;
          break;
        }
      }
    }

    return result;
  }

  dispatch (channel, data)
  {
    if (!this.channels[channel])
    {
      return;
    }

    if (channel === undefined)
    {
      throw ('[ EventEmitter ] UNDEFINED channel');
    }

    this.dispatching = true;

    for (let i = 0; i < this.channels[channel].length; i++)
    {
      if (this.channels[channel][i] !== undefined)
      {
        this.channels[channel][i].isNew = false;
      }
    }

    for (let i = 0; i < this.channels[channel].length; i++)
    {
      let subscription = this.channels[channel][i];
      if (subscription === undefined)
      {
        continue;
      }
      else if (!subscription.isNew)
      {
        let event =
                {
                  data: Array.prototype.slice.call(arguments, 1)[0],
                  type: channel,
                  target: subscription.target
                };

        subscription.callback(event);
      }
    }

    this.dispatching = false;

    for (let i = 0; i < this.channels[channel].length; i++)
    {
      let subscription = this.channels[channel][i];
      if (subscription === undefined)
      {
        this.channels[channel].splice(i, 1);
        i--;
      }
    }

    return this;
  }
}
