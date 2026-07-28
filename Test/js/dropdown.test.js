'use strict';

const $ = require('jquery');
const { loadAmd } = require('./support/amd');

const createDropdown = loadAmd('view/frontend/web/js/dropdown.js', { jquery: $ });

function sampleItems() {
    return [
        { tekst: 'Vestergade 1, 8000 Aarhus' },
        { tekst: 'Vestergade 2, 8000 Aarhus' },
        { tekst: 'Vestergade 3, 8000 Aarhus' }
    ];
}

describe('dawa dropdown', () => {
    let $input;
    let dropdown;
    let selected;

    beforeEach(() => {
        document.body.innerHTML = '<input id="street" />';
        $input = $('#street');
        dropdown = createDropdown($input);
        selected = [];
    });

    test('mouse: mousedown on a row selects that item and closes', () => {
        dropdown.show(sampleItems(), (item) => selected.push(item));

        $('.sc-dawa-item').eq(1).trigger('mousedown');

        expect(selected).toEqual([{ tekst: 'Vestergade 2, 8000 Aarhus' }]);
        expect($('.sc-dawa-item').length).toBe(0); // closed
    });

    test('keyboard: selectActive picks the highlighted item via the same callback', () => {
        dropdown.show(sampleItems(), (item) => selected.push(item));

        dropdown.move(1);      // highlight index 0
        dropdown.move(1);      // highlight index 1
        dropdown.selectActive();

        expect(selected).toEqual([{ tekst: 'Vestergade 2, 8000 Aarhus' }]);
    });

    test('move highlights and clamps within bounds', () => {
        dropdown.show(sampleItems(), () => {});

        dropdown.move(1);
        expect($('.sc-dawa-item.active').text()).toBe('Vestergade 1, 8000 Aarhus');

        dropdown.move(1);
        dropdown.move(1);
        expect($('.sc-dawa-item.active').text()).toBe('Vestergade 3, 8000 Aarhus');

        dropdown.move(1); // already last -> stays
        expect($('.sc-dawa-item.active').text()).toBe('Vestergade 3, 8000 Aarhus');

        dropdown.move(-10); // clamp to first
        expect($('.sc-dawa-item.active').text()).toBe('Vestergade 1, 8000 Aarhus');
    });

    test('selectActive does nothing when nothing is highlighted', () => {
        dropdown.show(sampleItems(), (item) => selected.push(item));

        dropdown.selectActive();

        expect(selected).toEqual([]);
    });

    test('hide removes the rendered rows', () => {
        dropdown.show(sampleItems(), () => {});
        expect($('.sc-dawa-item').length).toBe(3);

        dropdown.hide();

        expect($('.sc-dawa-item').length).toBe(0);
    });

    test('show replaces the previous items (no stale rows)', () => {
        dropdown.show(sampleItems(), () => {});
        dropdown.show([{ tekst: 'Only one' }], () => {});

        const rows = $('.sc-dawa-item');
        expect(rows.length).toBe(1);
        expect(rows.eq(0).text()).toBe('Only one');
    });
});
