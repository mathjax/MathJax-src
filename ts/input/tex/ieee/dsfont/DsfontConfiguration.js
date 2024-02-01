"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EulerIeeeConfiguration = void 0;
var Configuration_js_1 = require("../../Configuration.js");
var TokenMap_js_1 = require("../../TokenMap.js");
var BaseMethods_js_1 = require("../../base/BaseMethods.js");
/**
 * The methods that implement the ieee euler package.
 */
var EulerIeeeMethods = {};
EulerIeeeMethods.Macro = BaseMethods_js_1.default.Macro;
EulerIeeeMethods.MathFont = BaseMethods_js_1.default.MathFont;
new TokenMap_js_1.CommandMap('euler_ieee', {
    matheur: ['MathFont', '-euler-R'],
    matheuf: ['MathFont', '-euler-F'],
    matheus: ['MathFont', '-euler-S'],
}, EulerIeeeMethods);
//
//  Define the package for our new environment
//
exports.EulerIeeeConfiguration = Configuration_js_1.Configuration.create('eulerieee', {
    handler: {
        macro: ['euler_ieee'],
    }
});
