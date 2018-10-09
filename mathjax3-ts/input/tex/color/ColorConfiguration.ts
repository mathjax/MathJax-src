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
 * @author i@omardo.com (Omar Al-Ithawi)
 */

import {Configuration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import NodeUtil from '../NodeUtil.js';

import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import ParseUtil from '../ParseUtil.js';

// function color(parser: TexParser, name: string) {
//     const textNode = parser.configuration.nodeFactory.create('text', '\\' + name);
//     parser.Push(parser.configuration.nodeFactory.create(
//         'node', 'mtext', [], {mathcolor: 'red'}, textNode));
// }


// Namespace


/*
TODO: Activate this extensible configurations instead of ColorConfigs
config: MathJax.Hub.CombineConfig("TeX.color",{
    padding: "5px",
    border: "2px"
}),
*/


function padding() {
    var pad = "+"+ColorConfigs.padding;
    var unit = ColorConfigs.padding.replace(/^.*?([a-z]*)$/,"$1");
    var pad2 = "+"+(2*parseFloat(pad))+unit;
    return {width:pad2, height:pad, depth:pad, lspace: ColorConfigs.padding};
  }


const ColorConfigs = {
    padding: "5px",
    border: "2px"
}


const COLORS : Map<string, string> = new Map<string, string>([
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
    ['YellowOrange',   '#FAA21A'],
]);

/**
 *  Look up a color based on its model and definition
 */
function getColor(model: string, def: string) {
    if (!model) {
        model = 'named';
    }

    switch (model) {
        case 'named':
            return get_named(def);
    
        case 'rgb':
            return get_rgb(def);

        case 'RGB':
            return get_RGB(def);
    
        case 'gray':
            return get_gray(def);
            
        default:
            throw new TexError('UndefinedColorModel', 'Color model \'%1\' not defined', model);
    }
}

/**
 *  Get an rgb color
 */
function get_rgb( rgb: string) {
    var rgbParts: string[] = rgb.replace(/^\s+/, '').replace(/\s+$/, '').split(/\s*, \s*/); 
    var RGB: string = '#';
    if (rgbParts.length !== 3) {
        throw new TexError('ModelArg1', 'Color values for the %1 model require 3 numbers', 'rgb');
    }

    for (var i = 0; i < 3; i++) {
        if (!rgbParts[i].match(/^(\d+(\.\d*)?|\.\d+)$/)) {
            throw new TexError('InvalidDecimalNumber', 'Invalid decimal number');
        }

        var n = parseFloat(rgbParts[i]);
        if (n < 0 || n > 1) {
            throw new TexError('ModelArg2',
                'Color values for the %1 model must be between %2 and %3',
                'rgb','0','0');
        }
        var pn = Math.floor(n*255).toString(16); 
        if (pn.length < 2) {pn = '0'+pn}
        RGB += pn;
    }
    return RGB;
}

/**
 *  Get an RGB color
 */
function get_RGB(rgb: string) {
    var rgbParts : string[] = rgb.replace(/^\s+/,'').replace(/\s+$/,'').split(/\s*,\s*/); 
    var RGB = '#';

    if (rgbParts.length !== 3)
    {throw new TexError('ModelArg1', 'Color values for the %1 model require 3 numbers', 'RGB')}
    
    for (var i = 0; i < 3; i++) {
        if (!rgbParts[i].match(/^\d+$/))
        {throw new TexError('InvalidNumber', 'Invalid number')}
        var n = parseInt(rgbParts[i]);
        if (n > 255) {
            throw new TexError('ModelArg2',
                'Color values for the %1 model must be between %2 and %3',
                'RGB', '0', '255');
        }
        var pN = n.toString(16); 
        if (pN.length < 2) {pN = '0'+pN}
        RGB += pN;
    }
    return RGB;
}

/**
 *  Get a gray-scale value
 */
function get_gray(gray: string) {
    if (!gray.match(/^\s*(\d+(\.\d*)?|\.\d+)\s*$/)) {
        throw new TexError('InvalidDecimalNumber','Invalid decimal number')
    }

    var n : number = parseFloat(gray);
    if (n < 0 || n > 1) {    
        throw new TexError('ModelArg2',
            'Color values for the %1 model must be between %2 and %3',
            'gray', "0", "1");
    }
    var pn = Math.floor(n*255).toString(16); 
    if (pn.length < 2) {
        pn = '0' + pn;
    }

    return '#' + pn + pn + pn;
}

/**
 *  Get a named value
 */
function get_named(name: string) : string {
    if (COLORS.has(name)) {
        return COLORS.get(name);
    } else {
        return name;
    }
}


export let ColorMethods: Record<string, ParseMethod> = {};


/**
 * Override \color macro definition
*/
ColorMethods.Color = function(parser: TexParser, name: string) {
    const model = parser.GetBrackets(name, "");
    const color = getColor(model, parser.GetArgument(name));
    
    const math = parser.ParseArg(name);
    
    const node = parser.configuration.nodeFactory.create('node', 'mstyle', [math], {mathcolor: color});
    parser.stack.env['color'] = color;
    parser.Push(node);
}

ColorMethods.TextColor = function(parser: TexParser, name: string) {
    const model = parser.GetBrackets(name, "");
    const color = getColor(model, parser.GetArgument(name));
    const old = parser.stack.env['color'];
    parser.stack.env['color'] = color;
    const math = parser.ParseArg(name);
    if (old) {
      parser.stack.env['color'];  // TODO: Volker, shouldn't we remove this?
    } else {
      delete parser.stack.env['color'];
    }
    const node = parser.configuration.nodeFactory.create('node', 'mstyle', [math], {mathcolor: color});
    parser.Push(node);
}

/**
 * Define the \definecolor macro
*/
ColorMethods.DefineColor =  function(parser: TexParser, name: string) {
    var cname = parser.GetArgument(name),
        model = parser.GetArgument(name),
        def = parser.GetArgument(name);
    
    COLORS.set(cname, getColor(model, def));
};

/**
 * Produce a text box with a colored background
*/
ColorMethods.ColorBox = function (parser: TexParser, name: string) {
    var cname = parser.GetArgument(name),
    math = ParseUtil.internalMath(parser, parser.GetArgument(name));

    const node = parser.configuration.nodeFactory.create('node', 'mpadded', [math], {
        mathbackground: getColor("named", cname)
      });

    NodeUtil.setProperties(node, padding())
    parser.Push(node)
};

/**
 * Procude a framed text box with a colored background
 */
ColorMethods.FColorBox = function (parser: TexParser, name : string) {
    var fname = parser.GetArgument(name),
        cname = parser.GetArgument(name),
        math = ParseUtil.internalMath(parser, parser.GetArgument(name));

    const node = parser.configuration.nodeFactory.create('node', 'mpadded', [math], {
        mathbackground: getColor("named", cname),
        style: "border: " + ColorConfigs.border + " solid "+ getColor("named", fname),
        });

    NodeUtil.setProperties(node, padding())
    parser.Push(node)
}

new CommandMap('color', {
    color: "Color",
    textcolor: "TextColor",
    definecolor: "DefineColor",
    colorbox: "ColorBox",
    fcolorbox: "FColorBox"
}, ColorMethods);

export const ColorConfiguration = Configuration.create(
    'color', {handler: {macro: ['color', 'textcolor', 'definecolor', 'colorbox', 'fcolorbox']}});
