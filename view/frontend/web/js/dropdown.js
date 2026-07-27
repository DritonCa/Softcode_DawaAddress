define(['jquery'], function ($) {
    'use strict';

    return function createDropdown($input) {
        var $dropdown = $('<div class="sc-dawa-dropdown"></div>');
        var activeIndex = -1;
        var currentItems = [];
        var currentOnSelect = null;

        function show(items, onSelect) {
            // Keep a reference so keyboard selection uses the same data + callback
            // that mouse selection does.
            currentItems = items;
            currentOnSelect = onSelect;
            activeIndex = -1;
            $dropdown.empty();

            items.forEach(function (item) {
                var $row = $('<div class="sc-dawa-item"></div>').text(item.tekst);
                $row.on('mousedown', function (e) {
                    e.preventDefault();
                    onSelect(item);
                    hide();
                });
                $dropdown.append($row);
            });

            if (!$dropdown.parent().length) {
                $input.after($dropdown);
            }
        }

        function hide() {
            $dropdown.remove();
            activeIndex = -1;
        }

        function move(step) {
            var $items = $dropdown.children();
            if (!$items.length) {
                return;
            }
            activeIndex = Math.max(0, Math.min($items.length - 1, activeIndex + step));
            $items.removeClass('active');
            $items.eq(activeIndex).addClass('active');
        }

        function selectActive() {
            if (activeIndex >= 0 && currentItems[activeIndex] && currentOnSelect) {
                currentOnSelect(currentItems[activeIndex]);
                hide();
            }
        }

        return {
            show: show,
            hide: hide,
            move: move,
            selectActive: selectActive
        };
    };
});
