(function ($) {
    'use strict';

    var methods = {
        init: function (options) {
            // Get the variables used
            var i, clearlink, items, match, filter, filtertext, that = this, settings;

            // Create a case-insensitive version of :contains
            $.expr[':'].icontains = function (obj, index, meta, stack) {
                return (obj.textContent || obj.innerText || jQuery(obj).text() || '').toLowerCase().indexOf(meta[3].toLowerCase()) >= 0;
            };

            // Configure the default settings
            that.settings = $.extend({
                'filter': null,
                'clearlink': null,
                'alternate': null,
                'alternateclass': 'alternate'
            }, options);

            // Get the items
            that.items = that.children('div, li');

            // If no filter element defined, prepend one to the list
            if (that.settings.filter) {
                filter = that.settings.filter;
            } else {
                filter = $('<input></input>', {
                    type: "text"
                }).prependTo(this);
            }

            // If no clear link defined, append one after the filter
            if (that.settings.clearlink) {
                clearlink = that.settings.clearlink;
            } else {
                clearlink = $('<a>Clear</a>').insertAfter(filter);
            }

            // If alternate is set, amend the link styling to maintain alternation
            if (that.settings.alternate) {
                that.items.filter(':odd').addClass(that.settings.alternateclass);
            }
            // When the contents of the filter change, update the list
            filter
                .change(function () {
                    // Get the value of the filter
                    filtertext = filter.val();

                    // Hide all the elements in the list
                    that.items.hide();

                    // If alternate is set, remove the alternate class from all the items
                    if (that.settings.alternate) {
                        that.items.removeClass(that.settings.alternateclass);
                    }

                    // Get the ones that match the filter
                    if (filtertext.length < 1) {
                        match = that.items;
                    } else {
                        match = that.items.filter(':icontains(' + filtertext + ')');
                    }

                    // If alternate is set, amend the link styling to maintain alternation
                    if (that.settings.alternate) {
                        match.filter(':odd').addClass(that.settings.alternateclass);
                    }
                    
                    // Display them
                    match.show();
                }).on('keyup', function () {
                    filter.change();
                });

            // When the clear link is clicked, clear the filter
            clearlink.on('click', function () {
                filter.val('').change();
            });

            // Return the jQuery object
            return this;
        },
        refresh: function () {
            // Get a reference to the items in the list
            var that = this, filtertext, filter, match;
            that.items = that.children('div, li');

            // If alternate is set, remove the alternate class from all the items and reapply it as appropriate
            if (that.settings.alternate) {
                that.items.removeClass(that.settings.alternateclass);

                // If filter is not empty, allow for that
                filter = that.settings.filter;
                filtertext = filter.val();
                if (filtertext.length > 0) {
                    match = that.items.filter(':icontains(' + filtertext + ')');
                    match.filter(':odd').addClass(that.settings.alternateclass);
                } else {
                    that.items.filter(':odd').addClass(that.settings.alternateclass);
                }
            }
        }
    };

    $.fn.listfilter = function (method) {
        // Method calling login
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' not available');
        }
    };
})(jQuery);
