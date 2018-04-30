# adapt-contrib-pageLevelProgress  

**Page Level Progress** is an *extension* bundled with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).  

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/plp01.gif" alt="page level progress bar clicked and drawer opening, showing completion status of components">    

This extension displays the learner's progress through a page via a progress bar displayed in the top navigation area. Progress is calculated as the percentage of child components that have been completed. Clicking on the progress bar opens the drawer to reveal buttons showing the title and completion status of individual components in the page; these buttons can be clicked to scroll directly to the component in the page (if it is available and not hidden by trickle/similar). 

Page progress may also be displayed on menu items representing the page. 

[Visit the **Page Level Progress** wiki](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/wiki) for more information about its functionality and for explanations of key properties.  

## Installation

As one of Adapt's *[core extensions](https://github.com/adaptlearning/adapt_framework/wiki/Core-Plug-ins-in-the-Adapt-Learning-Framework#extensions),* **Page Level Progress** is included with the [installation of the Adapt framework](https://github.com/adaptlearning/adapt_framework/wiki/Manual-installation-of-the-Adapt-framework#installation) and the [installation of the Adapt authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-Adapt-Origin).

* If **Page Level Progress** has been uninstalled from the Adapt framework, it may be reinstalled.
With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:  
`adapt install adapt-contrib-pageLevelProgress`

    Alternatively, this extension can also be installed by adding the following line of code to the *adapt.json* file:  
    `"adapt-contrib-pageLevelProgress": "*"`  
    Then running the command:  
    `adapt install`  
    (This second method will reinstall all plug-ins listed in *adapt.json*.)  

* If **Page Level Progress** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).  

<div float align=right><a href="#top">Back to Top</a></div>

## Settings Overview

The attributes listed below are used in *components.json* to configure **Page Level Progress**, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/blob/master/example.json). 

The absence of the **_pageLevelProgress** object in a component model is interpreted as that component having **Page Level Progress** disabled (`"_isEnabled": false`). 

By default, calculation of the percentage of child components that have been completed includes all components, even those that have pageLevelProgress disabled and those with no **_pageLevelProgress** object in the component model. In order to have a component ignored in this calculation, you must set either `_isOptional` to `true` in the component model (*components.json*) or set the `_showPageCompletion` property (see [Attributes](#attributes)) to `false` in either *course.json* or *contentObjects.json*

The same **_pageLevelProgress** object may be added to contentObjects (*contentObjects.json*). At this level `"_isEnabled"` governs whether a progress bar will be displayed on the menu item. It does not act to provide defaults for its child components. It does not override their settings.

The same **_pageLevelProgress** object may be added to the course (*course.json*). At this level, `"_isEnabled"` can be used to disable **Page Level Progress** on components and contentObjects that have `"_isEnabled": true`.  
>**Note:** Setting the **_pageLevelProgress** object in *course.json* does not provide defaults for components or contentObjects. It cannot be used to enable **Page Level Progress** on components or contentObjects that have `"_isEnabled": false` or that do not have the **_pageLevelProgress** object in their model json.

Visit the [**Page Level Progress** wiki](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/wiki) for more information about how they appear in the [authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki). 

### Attributes

**_pageLevelProgress** (object):  The Page Level Progress object that contains a value for **_isEnabled**.  

>**_isEnabled** (boolean): Turns **Page Level Progress** on and off. Acceptable values are `true` and `false`. 

>**_showPageCompletion** (boolean): Set to `false` to have the overall progress calculated only from components that have been set to display in **Page Level Progress** (ignoring the completion of those that haven't). This property should be applied only to *course.json* and *contentObjects.json*; adding it to *components.json* will have no effect. 

### Accessibility
Several elements of **Page Level Progress** have been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **pageLevelProgress**, **pageLevelProgressIndicatorBar**, and **pageLevelProgressEnd**. These labels are not visible elements. They are utilized by assistive technology such as screen readers. Should the label texts need to be customised, they can be found within the **globals** object in [*properties.schema*](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/blob/master/properties.schema).   
<div float align=right><a href="#top">Back to Top</a></div> 

## Limitations
 
No known limitations.  

----------------------------
**Version number:**  3.0.0   <a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a> 
**Framework versions:**  2.2+     
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/graphs/contributors)    
**Accessibility support:** WAI AA   
**RTL support:** yes  
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, IE Mobile 11, Safari 10+11 for macOS+iOS, Opera     
