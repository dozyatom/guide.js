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

In your document ready, first create an instance of an overlay, and initialize it while passing in an element that encompasses all the nodes for this overlay. Typically, you'll just use `$('body')`.

```javascript
var helpOverlay = overlay();
helpOverlay.init($('body'));
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
<div data-g-blurb='Show this text.' data-g-margin='100'>Hello, World!</div>
```

The above will result in a margin of 100 pixels. The default is 10 pixels. Note that the margin is the edge of the bubble, the margin does not account for the size of the comment arrow, which is the reason for the 10 pixel default.

##### Multiple occurrences of same blurb

You may find that there is a time you want to have two or more blurbs on the same page with the exact same text. Take a peek at the 'Nifty little ditties' section to see what we're doing to prevent accidental multiples. If you do want multiples however, you may use the `data-g-multiple` option on your element.

```HTML
<div data-g-blurb='Exact same text.' data-g-multiple>My blurb will show!</div>
<div data-g-blurb='Exact same text.' data-g-multiple>So will mine!</div>
```

There are no options for `data-g-multiple`. Simply having the attribute present is enough.

## Nifty little ditties

guide.js loves you, and wants your dev cycle to be as quick and painless as possible. With that in mind, we've added a few nifty features that make guide.js as flexible as we had the foresight to see (let us know how we can help otherwise).

##### Fixed elements

You may have experienced with other help overlays that once the bubble is set relative to the page, it's set. This is okay, except when the element you are wrapping is fixed on the page. When you begin to scroll, the overlay scrolls with the page, and your fixed element is left underneath the dark overlay. guide.js resolves this by performing a check on all nodes to determine if they are fixed on the page. If they are, the overlay will reflect that, and you can scroll your little hearts out.

##### Front end PHP/Ruby, etc.

We know that our users are skilled in the way of dev-fu, and that means that you'll be using guide.js with pages that aren't static. One problem that may arise is something like this:

```php
$foods = array("pizza","sandwiches","ice cream","cake"); 
foreach ($foods as $item)
{
	echo "<div class='food-div' data-blurb='Here is an example of a div with text in it.'>I enjoy $item.</div>";
}
```

What would happen here is you would have four nodes that show in your tutorial cycle. All of them point to a food div, and give you the same story: 'Here is an example of a div with text in it.' Likely, you would rather only have the first one included in the tutorial, and guide.js gives you this ability. As guide.js loops your wrapper element searching for `data-g-blurb`, it keeps track of what blurbs you've been using. After adding a blurb to the first element in this list, it will note that you have added a blurb with the content 'Here is an example of a div with text in it.' On the next go-round, it will see that you are adding another blurb with the same text, and it will go to the second check: the `data-g-multiple` option. If the option is set on this element, it will include the blurb. If it is not, it will skip the blurb entirely. Note that the identical blurbs do not have to be right next to each other in the HTML as in our above example. They just have to be within the same overlay wrapper element.

 [0]: https://github.com/Dozyatom/guide.js/blob/master/guide.js
 [1]: https://github.com/Dozyatom/guide.js/blob/master/guide.css
