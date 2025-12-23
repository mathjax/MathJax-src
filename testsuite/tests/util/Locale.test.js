"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var Locale = new Locale();
/**********************************************************************************/
/**********************************************************************************/
(0, globals_1.describe)('Locale', function () {
    /********************************************************************************/
    (0, globals_1.test)('registerLocaleFiles', function () {
        Locale.registerLocaleFiles('test');
        (0, globals_1.expect)(Local.locations.text).toEqual({});
    });
});
/**********************************************************************************/
/**********************************************************************************/
