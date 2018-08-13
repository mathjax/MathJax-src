/*************************************************************
 *
 *  Copyright (c) 2018 Omar Al-Ithawi and The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


/**
 * @fileoverview Configuration file for the color package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {AllTags, NoTags} from '../Tags';

// This is from the 'no undefined' extension.
function color(parser: TexParser, name: string) {
    const textNode = parser.configuration.nodeFactory.create('text', '\\' + name);
    parser.Push(parser.configuration.nodeFactory.create(
        'node', 'mtext', [], {mathcolor: 'red'}, textNode));
}

const COLORS = new Map<string, string>([
    ['Apricot',        '#FBB982'],
    ['Aquamarine',     '#00B5BE'],
    ['Bittersweet',    '#C04F17'],
    ['Black',          '#221E1F'],
    ['Blue',           '#2D2F92'],
    ['BlueGreen',      '#00B3B8'],
    ['BlueViolet',     '#473992'],
    ['BrickRed',       '#B6321C'],
    ['Brown',          '#792500'],
    ['BurntOrange',    '#F7921D'],
    ['CadetBlue',      '#74729A'],
    ['CarnationPink',  '#F282B4'],
    ['Cerulean',       '#00A2E3'],
    ['CornflowerBlue', '#41B0E4'],
    ['Cyan',           '#00AEEF'],
    ['Dandelion',      '#FDBC42'],
    ['DarkOrchid',     '#A4538A'],
    ['Emerald',        '#00A99D'],
    ['ForestGreen',    '#009B55'],
    ['Fuchsia',        '#8C368C'],
    ['Goldenrod',      '#FFDF42'],
    ['Gray',           '#949698'],
    ['Green',          '#00A64F'],
    ['GreenYellow',    '#DFE674'],
    ['JungleGreen',    '#00A99A'],
    ['Lavender',       '#F49EC4'],
    ['LimeGreen',      '#8DC73E'],
    ['Magenta',        '#EC008C'],
    ['Mahogany',       '#A9341F'],
    ['Maroon',         '#AF3235'],
    ['Melon',          '#F89E7B'],
    ['MidnightBlue',   '#006795'],
    ['Mulberry',       '#A93C93'],
    ['NavyBlue',       '#006EB8'],
    ['OliveGreen',     '#3C8031'],
    ['Orange',         '#F58137'],
    ['OrangeRed',      '#ED135A'],
    ['Orchid',         '#AF72B0'],
    ['Peach',          '#F7965A'],
    ['Periwinkle',     '#7977B8'],
    ['PineGreen',      '#008B72'],
    ['Plum',           '#92268F'],
    ['ProcessBlue',    '#00B0F0'],
    ['Purple',         '#99479B'],
    ['RawSienna',      '#974006'],
    ['Red',            '#ED1B23'],
    ['RedOrange',      '#F26035'],
    ['RedViolet',      '#A1246B'],
    ['Rhodamine',      '#EF559F'],
    ['RoyalBlue',      '#0071BC'],
    ['RoyalPurple',    '#613F99'],
    ['RubineRed',      '#ED017D'],
    ['Salmon',         '#F69289'],
    ['SeaGreen',       '#3FBC9D'],
    ['Sepia',          '#671800'],
    ['SkyBlue',        '#46C5DD'],
    ['SpringGreen',    '#C6DC67'],
    ['Tan',            '#DA9D76'],
    ['TealBlue',       '#00AEB3'],
    ['Thistle',        '#D883B7'],
    ['Turquoise',      '#00B4CE'],
    ['Violet',         '#58429B'],
    ['VioletRed',      '#EF58A0'],
    ['White',          '#FFFFFF'],
    ['WildStrawberry', '#EE2967'],
    ['Yellow',         '#FFF200'],
    ['YellowGreen',    '#98CC70'],
    ['YellowOrange',   '#FAA21A']
]);

/*
 *  Look up a color based on its model and definition
 */
function getColor(parser: TexParser, model: string, def: string) {
    if (!model) {model = 'named'}
    var fn = parser['get_' + model];
    if (!fn) {parser.TEX.Error(['UndefinedColorModel', 'Color model \'%1\' not defined', model])}
    return fn.call(parser,def);
}

/*
 *  Get an rgb color
 */
function get_rgb(parser: TexParser, rgb: string) {
    rgb = rgb.replace(/^\s+/,'').replace(/\s+$/,'').split(/\s*,\s*/); var RGB = '#';
    if (rgb.length !== 3)
    {parser.TEX.Error(['ModelArg1', 'Color values for the %1 model require 3 numbers', 'rgb'])}
    for (var i = 0; i < 3; i++) {
        if (!rgb[i].match(/^(\d+(\.\d*)?|\.\d+)$/))
        {parser.TEX.Error(['InvalidDecimalNumber', 'Invalid decimal number'])}
        var n = parseFloat(rgb[i]);
        if (n < 0 || n > 1) {
            parser.TEX.Error(['ModelArg2',
                'Color values for the %1 model must be between %2 and %3',
                'rgb',0,1]);
        }
        n = Math.floor(n*255).toString(16); if (n.length < 2) {n = '0'+n}
        RGB += n;
    }
    return RGB;
}

/*
 *  Get an RGB color
 */
function get_RGB(parser: TexParser, rgb: string) {
    rgb = rgb.replace(/^\s+/,'').replace(/\s+$/,'').split(/\s*,\s*/); var RGB = '#';
    if (rgb.length !== 3)
    {parser.TEX.Error(['ModelArg1', 'Color values for the %1 model require 3 numbers', 'RGB'])}
    for (var i = 0; i < 3; i++) {
        if (!rgb[i].match(/^\d+$/))
        {parser.TEX.Error(['InvalidNumber', 'Invalid number'])}
        var n = parseInt(rgb[i]);
        if (n > 255) {
            parser.TEX.Error(['ModelArg2',
                'Color values for the %1 model must be between %2 and %3',
                'RGB',0,255]);
        }
        n = n.toString(16); if (n.length < 2) {n = '0'+n}
        RGB += n;
    }
    return RGB;
}

/*
 *  Get a gray-scale value
 */
function get_gray(parser: TexParser, gray: string) {
    if (!gray.match(/^\s*(\d+(\.\d*)?|\.\d+)\s*$/))
    {parser.TEX.Error(['InvalidDecimalNumber','Invalid decimal number'])}
    var n = parseFloat(gray);
    if (n < 0 || n > 1) {
        parser.TEX.Error(['ModelArg2',
            'Color values for the %1 model must be between %2 and %3',
            'gray',0,1]);
    }
    n = Math.floor(n*255).toString(16); if (n.length < 2) {n = '0'+n}
    return '#'+n+n+n;
}

/*
 *  Get a named value
 */
function get_named(parser: TexParser, name: string) {
    if (COLORS.hasOwnProperty(name)) {return COLORS[name]}
    return name;
}

function padding(parser: TexParser) {
    var pad = '+'+parser.config.padding;
    var unit = parser.config.padding.replace(/^.*?([a-z]*)$/, '$1');
    var pad2 = '+'+(2*parseFloat(pad))+unit;
    return {width:pad2, height:pad, depth:pad, lspace:this.config.padding};
}

/*
TODO: Convert this part
config: MathJax.Hub.CombineConfig("TeX.color",{
    padding: "5px",
    border: "2px"
}),
*/

export const ColorConfiguration = Configuration.create(
    'color', {fallback: {macro: color}});
