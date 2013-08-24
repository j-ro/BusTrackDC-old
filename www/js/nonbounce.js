(function($){
    "use strict";

    var startY;
    
    var defaults = {
        "$these": [],
        "touchstartInit": false,
        "touchmoveInit": false
    };
    
    $(".nonbounce").each(function() {
        defaults.$these.push($(this));
    });
    
    var initTouchHandling = function() {
        if (!defaults.touchstartInit) {
            defaults.touchstartInit = true;
            $(window).on("touchstart", touchstart);
        }
        
        if (!defaults.touchmoveInit) {
            defaults.touchmoveInit = true;
            $(window).on("touchmove", touchmove);
        }
    };
    
    var compareElem = function($elem, i, target) {
        return !!$(target).closest($elem).length;
    };
    
    var hasCorrectBounds = function(evt) {
        var y = (evt.originalEvent.touches) ? evt.originalEvent.touches[0].screenY : evt.originalEvent.screenY;
        var nonbounce = $(evt.target).closest(".nonbounce")[0];
        
        if (!nonbounce) {
            return true;
        }
        
        // Prevents scrolling of content to top
        if (nonbounce.scrollTop === 0 && startY <= y) {
            return false;
        }
        
        // Prevents scrolling of content to bottom
        if (nonbounce.scrollHeight-nonbounce.offsetHeight === nonbounce.scrollTop && startY >= y) {
            return false;
        }
        
        return true;
    };
    
    var touchstart = function(evt) {
        evt = evt.originalEvent || evt;
        startY = (evt.touches) ? evt.touches[0].screenY : evt.screenY;
    };
    
    var touchmove = function(evt) {
        if (!(evt.originalEvent.touches && evt.originalEvent.touches.length > 1)) {
            // Prevents scrolling of all but the nonbounce elements
            if (!~$.inArray(true, $.map(defaults.$these, compareElem, evt.target))) {
                evt.preventDefault();
            }
            
            // Prevents scrolling of nonbounce element if bound conditions are met
            if (!hasCorrectBounds(evt)) {
                evt.preventDefault();
            }
        }

    };

    $.fn.nonbounce = function() {
        initTouchHandling();
        
        return this.each(function() {
          defaults.$these.push($(this));
        });
    };

    $.nonbounce = function() {
        initTouchHandling();
    }
})(jQuery);