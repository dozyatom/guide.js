(function($) {

    $.fn.isOnScreen = function(bounding) {

        var win = $(window);

        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        var win2 = $(bounding);

        var viewport2 = {
            top: win2.scrollTop(),
            left: win2.scrollLeft()
        };
        viewport2.right = viewport2.left + win2.width();
        viewport2.bottom = viewport2.top + win2.height();

        var bounds2 = this.offset();
        bounds2.right = bounds2.left + this.outerWidth();
        bounds2.bottom = bounds2.top + this.outerHeight();

        if (win2)
            return (!(viewport2.right < bounds2.left || viewport2.left > bounds2.right || viewport2.bottom < bounds2.top || viewport2.top > bounds2.bottom));
        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

    };

    var onboard = function() {
        var container,
            defaults = {
                margin: 10
            },

            scrollBox = false,
            topMask = $("<div/>").addClass("guideMask"),
            bottomMask = $("<div/>").addClass("guideMask"),
            leftMask = $("<div/>").addClass("guideMask"),
            rightMask = $("<div/>").addClass("guideMask"),
            bubble = $("<div/>").addClass("guideBubble"),
            lastScroll = 0,
            holdingSteps,
            steps,
            position,

            prevButton = $("<button/>").addClass("btn").html("Back"),
            nextButton = $("<button/>").addClass("btn").html("Next"),
            arrow = $("<div/>").addClass("guideBubble-arrow").addClass("top"),

            gotoStep = function(i) {
                scrollIntoView(function() {
                    positionMask(i);
                    positionBubble(i);
                });
            },
            nextStep = function() {
                position++;
                if (position >= steps.length) {
                    clearGuide();
                } else {
                    gotoStep(position);
                }
            },
            prevStep = function() {
                position--;
                if (position < 0) {
                    position = steps.length - 1;
                }
                gotoStep(position);
            },
            getElementAttrs = function(element) {
                return {
                    top: element.offset().top,
                    left: element.offset().left,
                    width: element.outerWidth(),
                    height: element.outerHeight()
                };
            },
            positionMask = function(i) {
                var element = steps[i].element,
                    margin = (steps[i].options && steps[i].options.margin) ? steps[i].options.margin : options.margin,
                    attrs = getElementAttrs(element),
                    top = attrs.top,
                    left = attrs.left,
                    width = attrs.width,
                    height = attrs.height;

                topMask.css({
                    height: (top - margin) + "px"
                });

                bottomMask.css({
                    top: (height + top + margin) + "px",
                    height: ($(document).height() - height - top - margin) + "px"
                });

                leftMask.css({
                    width: (left - margin) + "px",
                    top: (top - margin) + "px",
                    height: (height + margin * 2) + "px"
                });

                rightMask.css({
                    left: (left + width + margin) + "px",
                    top: (top - margin) + "px",
                    height: (height + margin * 2) + "px",
                    width: ($('html').width() - width - left - margin) + "px",
                });
            },
            positionBubble = function(i) {
                lastScroll = 0;

                $(".step", bubble).html(i + 1);
                $(".intro", bubble).html(steps[i].intro);

                var element = steps[i].element,
                    margin = (steps[i].options && steps[i].options.margin) ? steps[i].options.margin : options.margin,
                    top = element.offset().top,
                    left = element.offset().left,
                    width = element.outerWidth(),
                    height = element.outerHeight();

                var css = {};

                var theArrow = $(".guideBubble-arrow", bubble);

                theArrow
                    .removeClass('top bottom left right')
                    .css({
                        "top": '',
                        "bottom": '',
                        "left": '',
                        "right": ''
                    });

                if (width > height) {

                    if ((top + height + bubble.outerHeight()) + margin * 2 > $('html').height()) {
                        theArrow.addClass('bottom');
                        css.top = top - bubble.outerHeight() - margin * 2 + "px";
                    } else {
                        theArrow.addClass('top');
                        css.top = top + height + margin * 2 + "px";
                    }

                    if ((left + bubble.outerWidth()) > $('html').width()) {
                        theArrow.css({
                            "right": margin + "px"
                        });
                        css.left = left + width - bubble.outerWidth() + "px";
                    } else {
                        theArrow.css({
                            "left": margin + "px"
                        });

                        css.left = left + "px";
                    }

                } else {

                    if ((top + height + bubble.outerHeight()) > $('html').height()) {
                        theArrow.css({
                            "bottom": margin + "px"
                        });
                        css.top = (top + height - bubble.outerHeight()) + "px";
                    } else {
                        theArrow.css({
                            "top": margin + "px"
                        });
                        css.top = (top) + "px";
                    }

                    if ((left + bubble.outerWidth()) > $('html').width()) {
                        theArrow.addClass('right');
                        css.left = left - bubble.outerWidth() - margin * 2 + "px";
                    } else {
                        theArrow.addClass('left');
                        css.left = left + width + margin * 2 + "px";
                    }

                }

                bubble.animate(css, 500, function() {
                    scrollIntoView();
                    if (typeof steps[i].options != "undefined")
                        if (typeof steps[i].options.callback != "undefined") {
                            steps[i].options.callback();
                        }
                });

                prevButton.removeClass("disabled");
                nextButton.removeClass("disabled");

                if (!position) {
                    prevButton.addClass("disabled");
                }

                if (position == (steps.length - 1)) {
                    nextButton.html("Close").addClass("btn-danger");
                } else {
                    nextButton.html("Next").removeClass("btn-danger");
                }


                scrollIntoView();
            },
            debounce = function(func, threshold, execAsap) {

                var timeout;

                return function debounced() {
                    var obj = this,
                        args = arguments;

                    function delayed() {
                        if (!execAsap)
                            func.apply(obj, args);
                        timeout = null;
                    }

                    if (timeout)
                        clearTimeout(timeout);
                    else if (execAsap)
                        func.apply(obj, args);

                    timeout = setTimeout(delayed, threshold || 100);
                };

            },
            updateScroll = debounce(function(scrollTop) {
                positionMask(position);
                positionBubble(position);
            }, 200),
            scrollIntoView = function(callback) {
                var element = steps[position].element;

                var scrollElementRuler = $(document);
                var scrollElement = $('html, body');
                if (scrollBox) {
                    scrollElementRuler = scrollBox;
                    scrollElement = scrollBox;
                }

                if ((scrollElementRuler.scrollTop() > element.offset().top) || ((scrollElementRuler.scrollTop() + scrollElementRuler.height()) < element.offset().top)) {
                    scrollElement.animate({
                        scrollTop: element.offset().top - 20
                    }, 500, null, function() {
                        if (callback)
                            callback();
                    });
                } else {
                    if (callback)
                        callback();
                }
            },
            clearGuide = function() {
                bubble.detach();
                topMask.add(bottomMask).add(leftMask).add(rightMask).animate({
                    opacity: 0
                }, 500, function() {
                    topMask.add(bottomMask).add(leftMask).add(rightMask).detach();
                });
                if (scrollBox)
                    scrollBox.unbind('scroll');
            },
            getMaximumZIndex = function() {
                var max = 0;
                $("*").each(function() {
                    var current = parseInt($(this).css("zIndex"), 10);
                    if (current > max) {
                        max = current;
                    }
                });
                return max;
            };


        return {
            init: function(opts) {
                container = $(this);
                options = $.extend({}, defaults, opts);
                steps = [];
                holdingSteps = [];
                position = -1;
                zIndex = getMaximumZIndex();

                if (typeof opts != 'undefined') {
                    if (typeof opts.steps != 'undefined')
                        holdingSteps = opts.steps;
                    if (typeof opts.scrollBox != 'undefined') {
                        scrollBox = $(opts.scrollBox);
                        scrollBox.scroll(function() {
                            updateScroll(scrollBox.scrollTop());
                        });
                    }
                }


                topMask.add(bottomMask).add(leftMask).add(rightMask).css("z-index", zIndex + 1);
                bubble.css("z-index", zIndex + 2).html("").append(arrow).append($("<div/>").addClass("step").html("1")).append($("<div/>").addClass("intro")).append($("<div/>").addClass("btn-group pull-right").append(prevButton).append(nextButton));

                prevButton.on("click", function() {
                    if (!$(this).hasClass("disabled")) {
                        prevStep();
                    }
                });
                nextButton.on("click", function() {
                    if (!$(this).hasClass("disabled")) {
                        nextStep();
                    }
                });

                var maskExit = true;
                if (typeof opts.maskExit != 'undefined') {
                    if (!opts.maskExit)
                        maskExit = false;
                }
                if (maskExit) {
                    topMask.add(bottomMask).add(leftMask).add(rightMask).on("click", function() {
                        clearGuide();
                    });
                }

                return {
                    addStep: function(selector, introduction, options) {
                        holdingSteps.push({
                            selector: selector,
                            intro: introduction,
                            options: options || {}
                        });
                    },
                    setOptions: function(opts) {
                        $(container).guide(opts);
                    },
                    stop: function() {
                        clearGuide();
                    },
                    start: function() {
                        container.append(topMask, bottomMask, leftMask, rightMask);
                        container.append(bubble);
                        topMask.add(bottomMask).add(leftMask).add(rightMask).animate({
                            opacity: 0.5
                        }, 500);
                        position = -1;
                        steps = [];

                        function addToSteps(step) {
                            var attrs = getElementAttrs($(step.selector));
                            if (attrs.width !== 0 && attrs.height !== 0) {
                                steps.push({
                                    element: $(step.selector),
                                    selector: step.selector,
                                    intro: step.intro,
                                    options: step.options
                                });
                            }
                        }
                        $.each(holdingSteps, function(i, step) {
                            var count = 10;
                            if (count) {
                                count--;
                                if ($(step.selector).length) {
                                    console.log('add step');
                                    addToSteps(step);
                                } else {
                                    throw 'Bad jquery selector: ' + step.selector;
                                }
                            }
                        });
                        nextStep();
                    }
                };
            },
        };
    }();

    $.fn.extend({
        onboard: onboard.init
    });
}(jQuery));