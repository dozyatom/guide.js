(function ( $ ) {

    overlay = function() {
     this.construct = function(element) {
        this.guide = null;
        this.classes = [];
        this.queued = [];
        this.nonqueued = [];
        this.blurb = '';
        this.count = 0;
    };
    this.init = function(element) {
        this.construct();
        var help = this;
        this.guide = element.guide();
        $.each(element.find('[data-blurb]'), function() {
            if ($.inArray($(this).attr('class'), help.classes) === -1) {
                help.classes.push($(this).attr('class'));
                if ($(this).attr('data-order')) {
                    var index = parseInt($(this).attr('data-order'));
                    if (help.queued[index] != null) {
                        help.queued.splice(index+1,0, $(this));
                    }
                    else {
                        help.queued[index] = $(this);
                    }
                }
                else {
                    help.nonqueued.push($(this));
                }
            }
        });
        $.each(help.queued, function(i, e) {
            if (e) {
                help.blurb = $(this).attr('data-blurb');
                $(this).addClass('blurbnum-'+help.count);
                help.guide.addStep('.blurbnum-'+help.count, help.blurb, { direction: $(this).attr('data-direction') || 'bottom', margin: $(this).attr('data-margin') || 10 });
                help.count++;
            }
        });
        $.each(help.nonqueued, function() {
            help.blurb = $(this).attr('data-blurb');
            $(this).addClass('blurbnum-'+help.count);
            help.guide.addStep('.blurbnum-'+help.count, help.blurb, { direction: $(this).attr('data-direction') || 'bottom', margin: $(this).attr('data-margin') || 10 });
            help.count++;
        });
    };

    return this;
};
 
    var guide = function() {
        var container,
            defaults = {
                margin: 10,
                direction: 'bottom'
            },
            topMask = $("<div/>").addClass("guideMask"),
            bottomMask = $("<div/>").addClass("guideMask"),
            leftMask = $("<div/>").addClass("guideMask"),
            rightMask = $("<div/>").addClass("guideMask"),
            bubble = $("<div/>").addClass("guideBubble"),
            holdingSteps,
            steps,
            position,
 
            prevButton = $("<button/>").addClass("btn").html("Prev"),
            nextButton = $("<button/>").addClass("btn").html("Next"),
            arrow = $("<div/>"),

            isFixed = function(element) {
                var $element = $(element);
                var $checkElements = $element.add($element.parents());
                var isFixed = false;
                $checkElements.each(function(){
                    if ($(this).css("position") === "fixed") {
                        isFixed = true;
                        return false;
                    }
                });
                return isFixed;
            },

            gotoStep = function(i) {
                positionMask(i);
                positionBubble(i);
            },
            nextStep = function() {
                position++;
                if (position>=steps.length) {
                    clearGuide();
                } else {
                    gotoStep(position);
                }
            },
            prevStep = function() {
                position--;
                if (position<0) {
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
                }
            },
            positionMask = function(i) {
                var element = steps[i].element,
                    margin = (steps[i].options && steps[i].options.margin) ? steps[i].options.margin : options.margin,
                    attrs = getElementAttrs(element),
                    top = attrs.top,
                    left = attrs.left,
                    width = attrs.width,
                    height = attrs.height,
                    pos = 'absolute',
                    offset = 0;

                margin = parseInt(margin);

                if(isFixed(element)) {
                    pos = "fixed";
                    offset = $(document).scrollTop();
                }

                topMask.css({
                    height: (top - margin - offset) + "px",
                    position: pos
                });
                 
                bottomMask.css({
                    top: (height + top + margin - offset) + "px",
                    height: ($(document).height() - height - top - margin) + "px",
                    position: pos
                });
                 
                leftMask.css({
                    width: (left - margin) + "px",
                    top: (top - margin - offset) + "px",
                    height: (height + margin*2) + "px",
                    position: pos
                });
                 
                rightMask.css({
                    left: (left + width + margin) + "px",
                    top: (top - margin - offset) + "px",
                    height: (height + margin*2) + "px",
                    width: ($(document).width() - width - left - margin) + "px",
                    position: pos
                });
            },
            positionBubble = function(i) {                
                var element = steps[i].element,
                    margin = (steps[i].options && steps[i].options.margin) ? steps[i].options.margin : options.margin,
                    top = element.offset().top,
                    left = element.offset().left,
                    width = element.outerWidth(),
                    height = element.outerHeight(),
                    direction = steps[i].options.direction,
                    pos = 'absolute',
                    offset = 0,
                    toffset = 0,
                    loffset = 0;


                if (isFixed(element)) {
                    pos = "fixed";
                    offset = $(document).scrollTop();
                }

                $(".step", bubble).html(i + 1);
                $(".intro", bubble).html(steps[i].intro);
                prevButton.removeClass("disabled");
                nextButton.removeClass("disabled");

                if (!position) {
                    prevButton.addClass("disabled");
                }

                if (position==(steps.length-1)) {
                    nextButton.html("Close").addClass("btn-danger");
                } else {
                    nextButton.html("Next").removeClass("btn-danger");
                } 

                switch(direction) {
                    case 'right':
                        toffset = top - margin;
                        loffset = width + left + margin*2;
                    break;
                    case 'left':
                        toffset = top - margin;
                        loffset = left - margin*2 - bubble.outerWidth();
                    break;
                    case 'top':
                        toffset = top - bubble.outerHeight(false) - margin*2;
                        loffset = left - margin;
                    break;
                    case 'bottom':
                        toffset = top + height + margin*2;
                        loffset = left - margin;
                    break;
                }

                arrow.attr('class', 'guideBubble-arrow ' + direction);

                var css = {
                        top: toffset - offset,
                        left: loffset
                    };

                bubble.css({'position': pos}).animate(css, 500, function() {
                    scrollIntoView();
                    if (steps[i].options.callback) {
                        steps[i].options.callback();
                    }
                });               
 
                scrollIntoView();
            },
            scrollIntoView = function() {
                var element = steps[position].element;
 
                if (($(document).scrollTop()>element.offset().top) || (($(document).scrollTop() + $("body").height())<element.offset().top)) {
                    $('html, body').animate({
                        scrollTop: element.offset().top - 20
                    });
                }
            },
            clearGuide = function() {
                bubble.detach();
                topMask.add(bottomMask).add(leftMask).add(rightMask).stop().fadeOut(500, function() {
                    topMask.add(bottomMask).add(leftMask).add(rightMask).detach();
                });
            },
            getMaximumZIndex = function() {
                return 1000000;
            }
       
 
        return {
            init: function(opts) {
                container = $(this);
                options = $.extend({}, defaults, opts);
                steps = [];
                holdingSteps = [];
                position = -1;
                zIndex = getMaximumZIndex();
   
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

                topMask.add(bottomMask).add(leftMask).add(rightMask).on("click", function() {
                    clearGuide();
                });
                
                return {
                    addStep: function(selector, introduction, options, direction) {
                        holdingSteps.push({
                            selector: selector,
                            intro: introduction,
                            options: options || {}
                        });
                    },
                    start: function() {
                        container.append(topMask, bottomMask, leftMask, rightMask);
                        container.append(bubble);
                        topMask.add(bottomMask).add(leftMask).add(rightMask).stop().show();
                        position = -1;
                        steps = [];
                        $.each(holdingSteps, function(i, step) {
                            if ($(step.selector).length) {
                                var attrs = getElementAttrs($(step.selector));
                                if (attrs.width!=0 && attrs.height!=0) {
                                    steps.push({
                                        element: $(step.selector),
                                        selector: step.selector,
                                        intro: step.intro,
                                        options: step.options
                                    });
                                }
                            }
                        });
                        nextStep();
                    },
                    end: function() {
                        clearGuide();
                    }
                }
            },
             
        }
    }();
 
    $.fn.extend({
        guide: guide.init
    });
}( jQuery ));