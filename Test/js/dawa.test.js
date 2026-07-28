'use strict';

const $ = require('jquery');
const { loadAmd } = require('./support/amd');

// The dropdown dependency is replaced with a spy so we can assert how dawa.js
// drives it (keyboard navigation, selection, hide) without the real DOM widget.
let mockDropdown;
const createDropdownMock = jest.fn(() => mockDropdown);

const dawaInit = loadAmd('view/frontend/web/js/dawa.js', {
    jquery: $,
    'Softcode_DawaAddress/js/dropdown': createDropdownMock
});

function fullConfig(overrides) {
    return Object.assign({
        enabled: true,
        streetMode: 'combined',
        debounce: 300,
        selectors: {
            postcode: '#postcode',
            city: '#city',
            street: '#street',
            housenumber: '#housenumber'
        }
    }, overrides || {});
}

function jsonReturning(cb) {
    // Mimics a jqXHR: .done(fn).fail(fn) chain.
    return {
        done(fn) { if (cb.done) { fn(cb.done); } return this; },
        fail(fn) { if (cb.fail) { fn(); } return this; }
    };
}

describe('dawa widget', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML =
            '<input id="postcode" /><input id="city" />' +
            '<input id="street" /><input id="housenumber" />';
        mockDropdown = { show: jest.fn(), hide: jest.fn(), move: jest.fn(), selectActive: jest.fn() };
        createDropdownMock.mockClear();
    });

    afterEach(() => {
        $(document).off();
        jest.useRealTimers();
    });

    test('does nothing when disabled', () => {
        $.getJSON = jest.fn();
        dawaInit(fullConfig({ enabled: false }));

        $('#postcode').val('8000').trigger('input');

        expect($.getJSON).not.toHaveBeenCalled();
    });

    test('does nothing when a required selector is missing', () => {
        $.getJSON = jest.fn();
        dawaInit(fullConfig({ selectors: { postcode: '#postcode', city: '#city' } }));

        $('#postcode').val('8000').trigger('input');

        expect($.getJSON).not.toHaveBeenCalled();
    });

    test('a 4-digit postcode fills the city from DAWA', () => {
        $.getJSON = jest.fn(() => jsonReturning({ done: [{ navn: 'Aarhus C' }] }));
        dawaInit(fullConfig());

        $('#postcode').val('8000').trigger('input');

        expect($.getJSON).toHaveBeenCalledWith('https://dawa.aws.dk/postnumre', { nr: '8000' });
        expect($('#city').val()).toBe('Aarhus C');
        expect($('#city').prop('disabled')).toBe(true);
    });

    test('a non-4-digit postcode does not query DAWA', () => {
        $.getJSON = jest.fn();
        dawaInit(fullConfig());

        $('#postcode').val('80').trigger('input');

        expect($.getJSON).not.toHaveBeenCalled();
    });

    test('a DAWA postcode failure clears the city instead of breaking', () => {
        $.getJSON = jest.fn(() => jsonReturning({ fail: true }));
        dawaInit(fullConfig());
        $('#city').val('stale').prop('disabled', true);

        $('#postcode').val('8000').trigger('input');

        expect($('#city').val()).toBe('');
        expect($('#city').prop('disabled')).toBe(false);
    });

    test('keyboard on the street field drives the dropdown', () => {
        $.getJSON = jest.fn();
        dawaInit(fullConfig());
        const $street = $('#street');
        $street.trigger('focus');

        const key = (name) => $street.trigger($.Event('keydown', { key: name }));

        key('ArrowDown');
        expect(mockDropdown.move).toHaveBeenCalledWith(1);

        key('ArrowUp');
        expect(mockDropdown.move).toHaveBeenCalledWith(-1);

        key('Enter');
        expect(mockDropdown.selectActive).toHaveBeenCalledTimes(1);

        key('Escape');
        expect(mockDropdown.hide).toHaveBeenCalled();
    });

    test('street autocomplete is debounced and queries DAWA', () => {
        $.getJSON = jest.fn(() => jsonReturning({}));
        dawaInit(fullConfig());
        const $street = $('#street');
        $street.trigger('focus');

        $street.val('Vestergade').trigger('input.dawa');
        expect($.getJSON).not.toHaveBeenCalled(); // still within debounce window

        jest.advanceTimersByTime(300);
        expect($.getJSON).toHaveBeenCalledWith(
            'https://dawa.aws.dk/adresser/autocomplete',
            { q: 'Vestergade' }
        );
    });

    test('repeated focus does not stack duplicate input handlers', () => {
        $.getJSON = jest.fn(() => jsonReturning({}));
        dawaInit(fullConfig());
        const $street = $('#street');

        $street.trigger('focus');
        $street.trigger('focus'); // handlers are reset on each focus, not doubled

        $street.val('Vestergade').trigger('input.dawa');
        jest.advanceTimersByTime(300);

        expect($.getJSON).toHaveBeenCalledTimes(1);
    });
});
