define(['jquery'], function ($) {
    'use strict';

    return function createDropdown($input) {
        let $dropdown = $('<div class="sc-dawa-dropdown"></div>');
        let activeIndex = -1;

        function show(items, onSelect) {
            $dropdown.empty();
            activeIndex = -1;

            items.forEach((item, index) => {
                const $row = $('<div class="sc-dawa-item"></div>');
                $row.text(item.tekst);

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
        }

        function move(step) {
            const items = $dropdown.children();
            if (!items.length) return;

            activeIndex = Math.max(0, Math.min(items.length - 1, activeIndex + step));
            items.removeClass('active');
            items.eq(activeIndex).addClass('active');
        }

        function selectActive(onSelect) {
            const items = $dropdown.children();
            if (activeIndex >= 0 && items[activeIndex]) {
                onSelect(items.eq(activeIndex).data('item'));
                hide();
            }
        }

        return {
            show,
            hide,
            move,
            selectActive
        };
    };
});
