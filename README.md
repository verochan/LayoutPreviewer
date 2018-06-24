# Layout Previewer

The purpose of this tool is to load the graphics part for videogames or apps projects created by artists and designers. This way, it can be checked if the elements size, position, or the way the graphics look is correct.<br/><br/>
By using this tool, graphic designers can check the graphics progress without the need of having the 'real' videogame or app project ready to load and show the assets.<br/><br/>
Moreover, Layout Previewer checks that layout and graphic elements are properly defined and loaded following the tool's rules and the project's defined elements to load, showing rich information logs integrated on Chrome Developers Tools.<br/><br/>
For example, name typos on atlases, layout elements, filenames, blank spaces or special characters not desired that can drive you mad wondering which is the problem for the graphics not loading correctly on the real project.<br/><br/>
This tool is designed for rendering layouts for HTML5/JavaScript games or apps projects, specifically, developed with the JavaScript 2D WebGL graphics library PixiJS.

##Features

* Layout support (position, size, scale)
* Sprites support (position, size)
* Bitmap Fonts Text support (position, style: size, font, color, alignment)
* Buttons with bitmap fonts texts styles for different states support (up, over, down, selected, disabled)
* Multiple atlases loading support
* Multiple fonts loading support
* Definition of required or optional layout components to load support
* Selectors for hiding or showing rendered elements support
* Complete logs for errors, warnings and information support on each step of the loading assets progress integrated in Chrome Developers Console
* Create a folder per project support
* Screen resolution per project support
* JsonSchema support for defining required elements, properties and element names structure


## How to install

Layout Previewer has been developed and tested in <b>Chrome</b>, so please install and use this browser, there may be some compatibility problems when using Firefox or Safari.

Follow these steps for using Layout Previewer locally on your computer:
 * Download Layout Previewer project and save it to a folder in your computer
 * Install Node.js (https://nodejs.org/es/)
 * Install http-server to have a local web server, and point to the folder where you previously saved the project, you can follow this guide: http://jasonwatmore.com/post/2016/06/22/nodejs-setup-simple-http-server-local-web-server
 
 * Follow this link on your <b>Chrome</b> browser http://localhost:8080 and you should see the Layout Previewer welcome page

Because of simplicity and because of trying to be a tool easy for designers to use, the project doesn't need to be compiled, just download it and save it to the desired folder. It takes advantage of how web browsers are more and more compatible with ES6.

## Steps to load your project layout and assets

 * Create your project folder such as 'myProject' in the following Layout Previewer folders: atlasToLoad, fontsToLoad, imagesToLoad and layoutToLoad
 * Go to layoutToLoad/myProject/ and copy the componentsToLoad.json from 'supermariano' project, following the file's structure define which layout elements of your game or app should be required to load for the project to work correctly.
 * Go to layoutToLoad/myProject/ and define your game or app layout in a file named layout.json, you must follow the tool's elements names formatting guide, which is located in the following section below.
 * Go to fontsToLoad/myProject/ , copy the fontsToLoad.json from 'supermariano' project and define the fonts you need
 * Go to fontsToLoad and copy there the fonts .fnt and .png files
 * Go to atlasToLoad/myProject/ , copy the atlasesToLoad.json from 'supermariano' project and define the atlases you need
 * Go to atlasToLoad/myProject/ , copy there the atlas or atlases .json and .png files
 * Go to imagesToLoad/myProject/ , copy the imagesToLoad.json from 'supermariano' project and define the images you need such as background, popups...
 * Go to imagesToLoad/myProject/ , copy there the .png files of your images
 * Open Chrome browser and Chrome Developer Tools (Console tab) and type: http://localhost:8080/?project=myProject&text=myCustomText
 * Layout Previewer will begin to inform you if everything has loaded ok, of errors or warnings through Chrome Developer Tools<br/><br/>
 
 You can check 'supermariano' project folders as a complete example of how to load a project. 

## Elements names format to follow
### Layout file elements


<b>Sprite type elements</b>: 'Sprite'+'GraphicElementName'+'_'+'elementId' , elementId needs to be unique<br/><br/>
<b>Button type elements</b>: 'Button'+'GraphicElementName'+'_'+'elementId' , elementId needs to be unique<br/><br/>
<b>Tag type elements</b>: The button's 'elementId' part + the button state name (Up, Over, Down, Disabled, Selected)<br/><br/>
<b>Text type elements</b>: 'Text'+'ElementName'<br/><br/>
<b>Layout type elements</b>: This type of element can have whatever name followed by 'Layout'. If this layout is going to be used several times by other layouts, you need to add '_' + an identifier<br/><br/>
<b>IMPORTANT</b> 'Sprite', 'Button', 'Text' and 'Tag' are reserved words specifically used for its own case. Make sure you don't use them mixed, for example, when defining a button element, don't use the 'sprite' word in the name. Otherwise, the tool won't work as expected.<br/>

#### Examples 

<b>Sprite type elements</b><br/><br/>
SpriteMushroom_Mushroom<br/>
SpritePopupBackground_LevelSelectionBackground<br/>
SpritePopupBackground_ExitBackground<br/><br/>

<b>Button type elements</b><br/><br/>
ButtonPopup_Normal<br/>
ButtonPopup_Easy<br/>
ButtonPopup_ExitGame<br/><br/>

<b>Tag type elements</b><br/><br/>
ExitGameTagUp<br/>
ExitGameTagOver<br/>
NormalTagDown<br/><br/>

<b>Text type elements</b><br/><br/>
TextCoinsNumber<br/>
TextExit<br/>

<b>Layout type elements</b><br/><br/>
LevelSelectionPopupLayout<br/>
GoombaLayout<br/>
GoombaLayout_1<br/>
GoombasLayout_Giant1<br/><br/>

### Atlas file elements


<b>Sprite type elements</b>: 'Sprite'+'GraphicElementName'+'Texture' <br/><br/>
<b>Button type elements</b>: 'Button'+'GraphicElementName'+'Texture'+'ButtonStateName' (Up, Over, Down, Disabled, Selected)<br/>

You don't need to add all button states to a button, the tool checks which button states have been added and discards the others, anyway, the tool will inform you that there are missing button states textures, just in case you actually forgot them ;)<br/>

#### Examples

<b>Sprite type elements</b><br/><br/>
SpriteMushroomTexture<br/>
Same case to apply at imagesToLoad imagesname: SpritePopupBackgroundTexture<br/><br/>

<b>Button type elements</b><br/><br/>
ButtonPopupTextureUp<br/>
ButtonPopupTextureOver<br/>
ButtonPopupTextureDown<br/>

## Layout Layers Order

Depending on the order the layout elements are defined in layout.json, that's the order you'll get rendered on the tool, that is to say, if you want the clouds rendered behind the exit popup on 'supermariano' test project, define the exit popup layout after the clouds related layouts.<br/>

## Additional instructions

To know more details about the features of this tool, please check 'supermariano' project structure, assets and definition files. It's a complete project example of what this tool can do :) Don't forget to enable the console of Chrome Developer tools and to refresh deleting cache (right click on Reload web button, choose the third option) when making a new change on your project! ;)