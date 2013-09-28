# guide.js

guide.js is a jQuery plugin that creates a clickable walkthrough of elements on your webpage

## Installing

Ensure you have referenced a jQuery library:

```HTML
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
```

Download [guide.js][0] and [guide.css][1] and add the following assets:

```HTML
<link href="guide.css" rel="stylesheet">
<script src="guide.js"></script>
```

## Using

In you document ready, first attach the guide to the parent element you'd like to mask:

```HTML
var guide = $("body").guide();
```

Then attach the steps to the elements to highlight, using jquery selectors:

```HTML
guide.addStep("#hello", "This step says hello");
guide.addStep("#world", "This step says world");
```

Then initiate the guide, manually or via a trigger event

```HTML
guide.start();
```

## Methods

### .guide([options])

Attach the guide to the selector

**Parameters:**
 - options : Object (optional)
   Control the gap between the highlighted element and the mask with `margin`

### guide.addStep(selector, introduction, options)

Add a step to the guide

**Parameters:**
 - selector : jQuery selector identifying the DOM element to highlight
 - introduction : The string to display
 - options : Object with optional settings for `margin` and `callback`

### guide.start()

Start the guide...

## Roadmap
- Abstract CSS (currently based on Bootstrap)
- Remove jQuery dependency
- Add keypress support

 [0]: https://github.com/Dozyatom/guide.js/blob/master/guide.js
 [1]: https://github.com/Dozyatom/guide.js/blob/master/guide.css