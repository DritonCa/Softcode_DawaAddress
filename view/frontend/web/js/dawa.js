define([
    'jquery',
    'Softcode_DawaAddress/js/dropdown'
], function ($, createDropdown) {
    'use strict';

    const POSTNR_URL = 'https://dawa.aws.dk/postnumre';
    const AUTOCOMPLETE_URL = 'https://dawa.aws.dk/adresser/autocomplete';

    return function (config) {

        if (!config || !config.enabled) {
            console.warn('DAWA disabled by config');
            return;
        }

        const selectors = config.selectors || {};

        if (!selectors.postcode || !selectors.city || !selectors.street) {
            console.warn('DAWA missing selectors', selectors);
            return;
        }

        /* ============================================================
           POSTCODE → CITY (DK ONLY, EXACTLY 4 DIGITS)
        ============================================================ */
        $(document).on('input', selectors.postcode, function () {
            const $postcode = $(this);

            // Force digits only + max 4 chars
            let value = $postcode.val().replace(/\D/g, '').slice(0, 4);
            $postcode.val(value);

            const $city = $(selectors.city)
                .eq($(selectors.postcode).index(this));

            // Only search when exactly 4 digits
            if (!/^\d{4}$/.test(value)) {
                $city.val('').prop('disabled', false);
                return;
            }

            $.getJSON(POSTNR_URL, { nr: value })
                .done(resp => {
                    if (resp && resp.length) {
                        $city
                            .val(resp[0].navn)
                            .prop('disabled', true);
                    } else {
                        $city.val('').prop('disabled', false);
                    }
                })
                .fail(() => {
                    $city.val('').prop('disabled', false);
                });
        });

        /* ============================================================
           ADDRESS AUTOCOMPLETE (DAWA)
        ============================================================ */
        $(document).on('focus', selectors.street, function () {
            const $input = $(this);
            const dropdown = createDropdown($input);

            let debounceTimer = null;

            $input.on('input.dawa', function () {
                const query = $input.val().trim();

                if (query.length < 3) {
                    dropdown.hide();
                    return;
                }

                clearTimeout(debounceTimer);

                debounceTimer = setTimeout(() => {
                    $.getJSON(AUTOCOMPLETE_URL, { q: query })
                        .done(results => {
                            if (!results || !results.length) {
                                dropdown.hide();
                                return;
                            }

                            dropdown.show(results, function (item) {
                                const data = item.data;

                                if (!data) return;

                                if (config.streetMode === 'combined') {
                                    $input.val(
                                        `${data.vejnavn} ${data.husnr || ''}`.trim()
                                    );
                                } else {
                                    $input.val(data.vejnavn);

                                    if (selectors.housenumber) {
                                        const $house = $(selectors.housenumber)
                                            .eq($(selectors.street).index($input));

                                        if ($house.length) {
                                            $house.val(data.husnr || '');
                                        }
                                    }
                                }

                                // Trigger Magento change listeners
                                $input.trigger('change');
                            });
                        })
                        .fail(() => {
                            dropdown.hide();
                        });
                }, config.debounce || 300);
            });

            /* ============================================================
               KEYBOARD NAVIGATION
            ============================================================ */
            $input.on('keydown.dawa', function (e) {
                switch (e.key) {
                    case 'ArrowDown':
                        dropdown.move(1);
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        dropdown.move(-1);
                        e.preventDefault();
                        break;
                    case 'Enter':
                        dropdown.selectActive(() => {});
                        e.preventDefault();
                        break;
                    case 'Escape':
                        dropdown.hide();
                        break;
                }
            });

            // Close dropdown on outside click
            $(document).one('click.dawa', function () {
                dropdown.hide();
            });
        });
    };
});
