'use strict';

const path = require('path');

/**
 * Load one of the module's RequireJS (AMD) files in a Node test.
 *
 * The frontend files are `define([deps], factory)` modules. We install a temporary
 * global `define` that invokes the factory with the dependencies from `depMap` and
 * returns whatever the factory returns (for these modules, that is the exported
 * function/object).
 *
 * @param {string} repoRelativePath path to the .js file, relative to the repo root
 * @param {Object<string, *>} depMap AMD dependency name -> value (e.g. { jquery: $ })
 * @returns {*} the module's export
 */
function loadAmd(repoRelativePath, depMap) {
    const absolute = path.resolve(process.cwd(), repoRelativePath);
    let exported;

    global.define = function (deps, factory) {
        const args = (deps || []).map(function (dep) {
            return depMap[dep];
        });
        exported = factory.apply(null, args);
    };
    global.define.amd = true;

    jest.isolateModules(function () {
        require(absolute);
    });

    delete global.define;

    return exported;
}

module.exports = { loadAmd };
