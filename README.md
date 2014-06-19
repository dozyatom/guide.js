# onboard.js

onboard.js is a jQuery plugin that creates an elegant on-screen overlay for onboarding and product tours.

Originally created by Dozyatom, and inspired by intro.js, onboard.js does not use abstract z-index layering, and instead implements masks which allow normal interaction with your website without tampering with your markup.

## Installing with Bower

```HTML
$ bower install onboard.js
```

## Installing oldschool

Ensure you have referenced a jQuery library installed:

```HTML
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
```

Download [onboard.js][0] and [onboard.css][1] and add the following assets:

```HTML
<link href="onboard.css" rel="stylesheet">
<script src="onboard.js"></script>
```

## Using

In you document ready, first attach the onboard to the body or other wrapping element you'd like to mask:

```HTML
var onboard = $("body").onboard();
```

Then attach the steps to the elements to highlight, using jquery selectors:

```HTML
onboard.addStep("#hello", "This step says hello");
onboard.addStep("#world", "This step says world");
```

Or instantiate onboard with predefined steps:

```HTML
var onboard = $("body").onboard({
	steps: [{
		selector: '#element1',
		introduction: 'This is the first element'
	},{
		selector: '#element2',
		introduction: 'This is the second element'
	},{
		....
	}]
});
```

Then start the show!

```HTML
onboard.start();
```

## Methods

### .onboard([options])

Attach the onboard to the selector

**Parameters:**
 - options : Object (optional)
   Control the gap between the highlighted element and the mask with `margin`

### onboard.addStep(selector, introduction, stepOptions)

Add a step to the onboard

**Parameters:**
 - selector : jQuery selector identifying the DOM element to highlight
 - introduction : The string to display
 - stepOptions : Object with optional settings for `margin` and `callback`

### onboard.start()

Start the onboard...

## Roadmap & Contribution
- Convert jQuery to pure JS
- Add keypress support

 [0]: https://github.com/Dozyatom/onboard.js/blob/master/onboard.js
 [1]: https://github.com/Dozyatom/onboard.js/blob/master/onboard.css

## ng-onboard

Be sure to check out [ng-onboard](https://github.com/tannerlinsley/ng-onboard) for an awesome angular wrapper!