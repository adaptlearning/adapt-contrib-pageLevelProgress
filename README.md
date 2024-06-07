# adapt-contrib-pageLevelProgress

**Page Level Progress** is an _extension_ bundled with the [Adapt framework](https://github.com/adaptlearning/adapt_framework).

<img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/plp01.gif" alt="page level progress bar clicked and drawer opening, showing completion status of components">

This extension displays the learner's progress through a page via a progress bar displayed in the top navigation area. Progress is calculated as the percentage of child components that have been completed. Clicking on the progress bar opens the drawer to reveal buttons showing the title and completion status of individual components in the page; these buttons can be clicked to scroll directly to the component in the page (if it is available and not hidden by trickle/similar).

Page progress may also be displayed on menu items representing the page.

[Visit the **Page Level Progress** wiki](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/wiki) for more information about its functionality and for explanations of key properties.

## Installation

As one of Adapt's _[core extensions](https://github.com/adaptlearning/adapt_framework/wiki/Core-Plug-ins-in-the-Adapt-Learning-Framework#extensions),_ **Page Level Progress** is included with the [installation of the Adapt framework](https://github.com/adaptlearning/adapt_framework/wiki/Manual-installation-of-the-Adapt-framework#installation) and the [installation of the Adapt authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-Adapt-Origin).

- If **Page Level Progress** has been uninstalled from the Adapt framework, it may be reinstalled.
  With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:
  `adapt install adapt-contrib-pageLevelProgress`

      Alternatively, this extension can also be installed by adding the following line of code to the *adapt.json* file:
      `"adapt-contrib-pageLevelProgress": "*"`
      Then running the command:
      `adapt install`
      (This second method will reinstall all plug-ins listed in *adapt.json*.)

- If **Page Level Progress** has been uninstalled from the Adapt authoring tool, it may be reinstalled using the [Plug-in Manager](https://github.com/adaptlearning/adapt_authoring/wiki/Plugin-Manager).

<div float align=right><a href="#top">Back to Top</a></div>

## Settings Overview

The attributes listed below are used in _components.json_ to configure **Page Level Progress**, and are properly formatted as JSON in [_example.json_](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/blob/master/example.json).

The absence of the **\_pageLevelProgress** object in a component model is interpreted as that component having **Page Level Progress** disabled (`"_isEnabled": false`).

By default, calculation of the percentage of child components that have been completed includes all components, even those that have pageLevelProgress disabled and those with no **\_pageLevelProgress** object in the component model. In order to have a component ignored in this calculation, you must set either `_isOptional` to `true` in the component model (_components.json_) or set the `_showPageCompletion` property (see [Attributes](#attributes)) to `false` in either _course.json_ or _contentObjects.json_

The same **\_pageLevelProgress** object may be added to components (_components.json_), blocks (_blocks.json_) and articles (_articles.json_). At this level `"_isEnabled"` adds a bar to the list of progress items appearing in the drawer. Adding `"_isCompletionIndicatorEnabled"` at this level adds a progress bar next to the title of element in the page.

The same **\_pageLevelProgress** object may be added to contentObjects (_contentObjects.json_). At this level `"_isEnabled"` governs whether a progress bar will be displayed on the menu item. It does not act to provide defaults for its child components. It does not override their settings. Setting `"_excludeAssessments"` to `true` will prevent assessments from being included in calculations for page level progress. Adding `"_isCompletionIndicatorEnabled"` at this level adds a progress bar next to the title of element in the menu.

The same **\_pageLevelProgress** object may be added to the course (_course.json_). At this level, `"_isEnabled"` can be used to disable **Page Level Progress** on components and contentObjects that have `"_isEnabled": true`. In some cases, indicators are required on the page but not in the drawer, `"_isShownInNavigationBar"` is used to turn off the drawer button.

> **Note:** Setting the **\_pageLevelProgress** object in _course.json_ does not provide defaults for components, blocks, articles or contentObjects. It cannot be used to enable **Page Level Progress** on components or contentObjects that have `"_isEnabled": false` or that do not have the **\_pageLevelProgress** object in their model json.
> Visit the [**Page Level Progress** wiki](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/wiki) for more information about how they appear in the [authoring tool](https://github.com/adaptlearning/adapt_authoring/wiki).

### Attributes

Add to _course.json_ under _\_globals.\_extensions_.

**\_pageLevelProgress** (object): The Page Level Progress object

> **\_navOrder** (number): Determines the order in which the page level progress is displayed in the navigation bar. Negative numbers (e.g. -100) are left-aligned. Positive numbers (e.g. 100) are right-aligned.

> **navLabel** (string): The text for the button label. Used when navigation labels are enabled globally

> **\_drawerPosition** (string): The position that the button appears in the drawer. Position options include 'auto', 'left', and 'right'. Defaults to 'auto'

> **\_navTooltip** (object): The tooltip object. Used when tooltips are enabled globally

>> **\_isEnabled** (boolean): Enables tooltips on the button

>> **text** (string): The text of the tooltip

Add to _course.json_.

**\_pageLevelProgress** (object): The Page Level Progress object that contains a value for **\_isEnabled**.

> **\_isEnabled** (boolean): Turns **Page Level Progress** on and off. Acceptable values are `true` and `false`.

> **title** (string): Alternate course title to display when using `_showAtCourseLevel: true`.

> **\_isCompletionIndicatorEnabled** (boolean): Adds a completion indicator next to the title of a component, block, article, page or menu. Acceptable values are `true` and `false`.

> **\_isShownInNavigationBar** (boolean): Allows **Page Level Progress** to appear in the navigation bar. Acceptable values are `true` and `false`.

> **\_showPageCompletion** (boolean): Set to `false` to have the overall progress calculated only from components that have been set to display in **Page Level Progress** (ignoring the completion of those that haven't). Defaults to `true`.

> **\_showAtCourseLevel** (boolean): Allows **Page Level Progress** to display all content objects and the current page components together, or just the current page components as before. Acceptable values are `true` and `false`. Defaults to `false`.

> **\_useCourseProgressInNavigationButton** (boolean): Allows **Page Level Progress** to use course-level completion for the navigation button instead of page-level completion. Defaults to `false`.

Add to _contentObjects.json_.

**\_pageLevelProgress** (object): The Page Level Progress object that contains a value for **\_isEnabled**.

> **\_isEnabled** (boolean): Turns **Page Level Progress** on and off. Acceptable values are `true` and `false`.

> **\_isCompletionIndicatorEnabled** (boolean): Adds a completion indicator next to the title of a component, block, article, page or menu. Acceptable values are `true` and `false`.

> **\_showPageCompletion** (boolean): Set to `false` to have the overall progress calculated only from components that have been set to display in **Page Level Progress** (ignoring the completion of those that have not).

> **\_excludeAssessments** (boolean): If true, prevents assessments from being included in calculations for page level progress.

Add to _components.json_, _blocks.json_ or _articles.json_.

**\_pageLevelProgress** (object): The Page Level Progress object that contains a value for **\_isEnabled**.

> **\_isEnabled** (boolean): Turns **Page Level Progress** on and off. Acceptable values are `true` and `false`.

> **\_isCompletionIndicatorEnabled** (boolean): Adds a completion indicator next to the title of a component, block, article, page or menu. Acceptable values are `true` and `false`.

### Accessibility

Several elements of **Page Level Progress** have been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **pageLevelProgress**, **pageLevelProgressIndicatorBar** and **pageLevelProgressMenuBar**. These labels are not visible elements. They are utilized by assistive technology such as screen readers. Should the label texts need to be customised, they can be found within the **globals** object in [_properties.schema_](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/blob/master/properties.schema).

<div float align=right><a href="#top">Back to Top</a></div>

## Limitations

No known limitations.

----------------------------

<a href="https://community.adaptlearning.org/" target="_blank"><img src="https://github.com/adaptlearning/documentation/blob/master/04_wiki_assets/plug-ins/images/adapt-logo-mrgn-lft.jpg" alt="adapt learning logo" align="right"></a>
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/graphs/contributors)<br>
**Accessibility support:** WAI AA<br>
**RTL support:** Yes<br>
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, Safari 12+13 for macOS/iOS/iPadOS, Opera<br>
