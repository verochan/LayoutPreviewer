class CheckboxesListManager extends EventEmitter
{
  constructor (layoutParser, componentContainerArray, domCheckBoxesList, domCheckboxesListButton)
  {
    super();

    this._componentContainerArray = componentContainerArray;
    this._domCheckBoxesList = domCheckBoxesList;
    this._domCheckBoxesListButton = domCheckboxesListButton;

    this.setCheckPanelBound = this.setCheckPanel.bind(this);
    layoutParser.addListener('SetCheckPanel', this.setCheckPanelBound);
  }

  setCheckPanel ()
  {
    // Init button ON/OFF to activate/deactivate the layout list
    this._domCheckBoxesListButton.addEventListener('click', this.checkButtonState.bind(this), false);
    this.setButtonOn();

    // Show all / Hide all cases
    let container = document.createElement('label');
    container.style.display = 'block';
    let text = document.createTextNode('Show everything');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'showAll';
    checkbox.id = 'showAll';
    checkbox.addEventListener('click', this.checkAll.bind(this), false);
    container.appendChild(checkbox);
    container.appendChild(text);
    this._domCheckBoxesList.append(container);

    container = document.createElement('label');
    container.style.display = 'block';
    text = document.createTextNode('Hide everything');
    checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'hideAll';
    checkbox.id = 'hideAll';
    checkbox.addEventListener('click', this.uncheckAll.bind(this), false);
    container.appendChild(checkbox);
    container.appendChild(text);
    this._domCheckBoxesList.append(container);

    // Init the layout list
    for (let i = 0; i < this._componentContainerArray.length; i++)
    {
      let container = document.createElement('label');
      container.style.display = 'block';
      if (this._componentContainerArray[i].hasOwnProperty('state'))
      {
        if (this._componentContainerArray[i].state === true)
        {
          container.style.color = '#F07241';
          container.style.fontWeight = 'bold';
        }
      }
      let text = document.createTextNode(this._componentContainerArray[i].id);
      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = this._componentContainerArray[i].id;
      checkbox.id = this._componentContainerArray[i].id;
      checkbox.addEventListener('click', this.checkState.bind(this), false);
      container.appendChild(checkbox);
      container.appendChild(text);
      this._domCheckBoxesList.append(container);
      this.check(this._componentContainerArray[i].id);
    }
  }

  check (id)
  {
    document.getElementById(id).checked = true;
    this._componentContainerArray[this.returnArrayPos(id)].view.visible = true;

    document.getElementById('hideAll').checked = false;
    document.getElementById('showAll').checked = false;
  }

  checkAll ()
  {
    for (let i = 0; i < this._componentContainerArray.length; i++)
    {
      this._componentContainerArray[i].view.visible = true;
      document.getElementById(this._componentContainerArray[i].id).checked = true;
    }

    document.getElementById('showAll').checked = true;
    document.getElementById('hideAll').checked = false;
  }

  uncheck (id)
  {
    document.getElementById(id).checked = false;
    this._componentContainerArray[this.returnArrayPos(id)].view.visible = false;

    document.getElementById('hideAll').checked = false;
    document.getElementById('showAll').checked = false;
  }

  uncheckAll ()
  {
    for (let i = 0; i < this._componentContainerArray.length; i++)
    {
      this._componentContainerArray[i].view.visible = false;
      document.getElementById(this._componentContainerArray[i].id).checked = false;
    }

    document.getElementById('hideAll').checked = true;
    document.getElementById('showAll').checked = false;
  }

  returnArrayPos (id)
  {
    let index = this._componentContainerArray.findIndex(i => i.id === id);
    return index;
  }

  checkState (event)
  {
    // console.log('checkState', event, this);
    if (event.srcElement.checked)
    {
      this.check(event.srcElement.id);
    }
    else
    {
      this.uncheck(event.srcElement.id);
    }
  }

  checkButtonState (event)
  {
    // console.log('checkbuttonstate: ', event);
    if (this._domCheckBoxesList['style']['visibility'] === 'visible')
    {
      this.setButtonOff();
    }
    else
    {
      this.setButtonOn();
    }
  }

  setButtonOn ()
  {
    this._domCheckBoxesListButton.innerHTML = 'OFF';
    this._domCheckBoxesList['style']['visibility'] = 'visible';
  }

  setButtonOff ()
  {
    this._domCheckBoxesListButton.innerHTML = 'ON';
    this._domCheckBoxesList['style']['visibility'] = 'hidden';
  }
}
