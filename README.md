#adapt-contrib-pageLevelProgress

An extension to show a users progress through a page.

##Installation

First, be sure to install the [Adapt Command Line Interface](https://github.com/adaptlearning/adapt-cli), then from the command line run:-

        adapt install adapt-contrib-pageLevelProgress

####Example
A [sample JSON](example.json) is given below which can be added to the course, content object and component:

####course.json

```json
"_pageLevelProgress": {
        "_isEnabled": true,
        "_altText": "completed on this page"
}
```
####contentObjects.json

```json
"_pageLevelProgress": {
        "_isEnabled": true
}
```

####components.json

```json
"_pageLevelProgress": {
        "_isEnabled": true
}
```

####Attributes
A description of the attributes are as follows:

| Attribute                 | Type         | Description|
| :-------------------------|:-------------|:-----------|
| _isEnabled                | bool         | Turns page level progress on or off for this element. |
| _altText               | string         | Accessibility label (Note: this is set on the course level only).|

  
##Browser spec
 
This component has been tested to the standard Adapt browser specification.
