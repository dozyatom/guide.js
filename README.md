# guide.js

guide.js is a jQuery plugin that creates a clickable walkthrough of elements on your webpage.

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

In your document ready, first create an instance of an overlay.

```javascript
var helpOverlay = overlay();
```

Then attach an event handler (or any method you desire) to start the overlay.

```javascript
$('#my-button').on('click', function() {
	helpOverlay.guide.start();
});
```

guide.js will stop if you click on the darkened background. However, if you would like to add another method to close the overlay, such as a timer, you can do the following:

```javascript
setTimeout(function() {
	helpOverlay.guide.stop();
}, 30000); // wait 30 seconds
```

### Options

##### Blurb

In order to add new steps to your overlay, add the `data-g-blurb` attribute to any element on your page.

```HTML
<div data-g-blurb='This is the text that will show up when this step is reached.'>Hello, World!</div>
```

##### Order

Your blurb nodes will, by default, order by their position in your HTML structure. Nodes closer to the initial `<body>` tag will show before nodes closer to your closing `</body>` tag. If you would like to override this ordering, use the `data-g-order` option.

```HTML
<div data-g-blurb='Show this text.' data-g-order='1'>Hello, World!</div>
```

You can order from 0 to any value you desire.

By default, ordered elements will show before any un-ordered elements, despite what the actual order number is. The un-ordered elements will then appear in the order they appear in the HTML structure. If you accidentally give two nodes the same ordering, guide.js will order them in the order they appear in the HTML, while still maintaining their order among other ordered nodes.

##### Direction

guide.js also allows you to define which side of your element you'd like the bubble to appear on. Use the `data-g-direction` option.

```HTML
<div data-g-blurb='Show this text.' data-g-direction='top'>Hello, World!</div>
```
Your options for direction are 'top', 'bottom', 'left', and 'right'. The default is 'bottom'.

##### Margin

You can also specify the margin in which you'd like the bubble to assume around the element. Use the `data-g-margin` option for this.

```HTML
<div class='my-element' data-g-margin='100'>Hello, World!</div>
```

The above will result in a margin of 100 pixels. The default is 10 pixels. Note that the margin is the edge of the bubble, the margin does not account for the size of the comment arrow, which is the reason for the 10 pixel default.

 [0]: https://github.com/Dozyatom/guide.js/blob/master/guide.js
 [1]: https://github.com/Dozyatom/guide.js/blob/master/guide.css