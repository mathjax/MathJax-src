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
 * @fileoverview Parse methods and helper functtions for the color package.
 *
 * @author i@omardo.com (Omar Al-Ithawi)
 */

import NodeUtil from '../NodeUtil.js';
import { OptionList } from '../../../util/Options.js';
import { ParseMethod } from '../Types.js';
import { PropertyList } from '../../../core/Tree/Node.js';
import ParseUtil from '../ParseUtil.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';

import { COLORS } from './ColorConstants.js';

export type ColorModelProcessor = (parserOptions: OptionList, def: string) => string;
export type MethodsMap = Record<string, ColorModelProcessor>;


/**
 * Build PropertyList from padding value.
 * 
 * @param {string} colorPadding: Padding for \colorbox and \fcolorbox.
 * @return {PropertyList} The padding properties.
 */
function padding(colorPadding: string): PropertyList {
    const pad = `+${colorPadding}`;
    const unit = colorPadding.replace(/^.*?([a-z]*)$/, '$1');
    const pad2 = 2 * parseFloat(pad);
    return {
        width: `+${pad2}${unit}`,
        height: pad,
        depth: pad,
        lspace: colorPadding,
    };
};

export const ColorModelProcessors: MethodsMap = {};

/**
 * Look up a color based on its model and definition
 * 
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} model The coloring model type: `named`, `rgb` `RGB` or `gray`.
 * @param {string} def The color definition: `red, `0.5,0,1`, `128,0,255`, `0.5`.
 * @return {string} The color definition in CSS format e.g. `#44ff00`.
 */
export function getColor(parserOptions: OptionList, model: string, def: string): string {
    if (!model) {
        model = 'named';
    }

    if (ColorModelProcessors.hasOwnProperty(model)) {
        const modelProcessor = ColorModelProcessors[model];
        return modelProcessor(parserOptions, def);
    } else {
        throw new TexError('UndefinedColorModel', 'Color model \'%1\' not defined', model);
    }
}

/**
 * Get a named color.
 * 
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} name The color definition in RGB: `128,0,255`.
 * @return {string} The color definition in CSS format e.g. `#44ff00`.
 */
ColorModelProcessors.named = function (parserOptions: OptionList, name: string): string {
    if (parserOptions.definedColors && parserOptions.definedColors.has(name)) {
        return parserOptions.definedColors.get(name);
    } else if (COLORS.has(name)) {
        return COLORS.get(name);
    } else {
        return name;
    }
}

/**
 * Get an rgb color.
 * 
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} rgb The color definition in rgb: `0.5,0,1`.
 * @return {string} The color definition in CSS format e.g. `#44ff00`.
 */
ColorModelProcessors.rgb = function (parserOptions: OptionList, rgb: string): string {
    const rgbParts: string[] = rgb.trim().split(/\s*,\s*/);
    let RGB: string = '#';

    if (rgbParts.length !== 3) {
        throw new TexError('ModelArg1', 'Color values for the %1 model require 3 numbers', 'rgb');
    }

    for (const rgbPart of rgbParts) {
        if (!rgbPart.match(/^(\d+(\.\d*)?|\.\d+)$/)) {
            throw new TexError('InvalidDecimalNumber', 'Invalid decimal number');
        }

        const n = parseFloat(rgbPart);
        if (n < 0 || n > 1) {
            throw new TexError('ModelArg2',
                'Color values for the %1 model must be between %2 and %3',
                'rgb', '0', '1');
        }

        let pn = Math.floor(n * 255).toString(16);
        if (pn.length < 2) {
            pn = '0' + pn;
        }

        RGB += pn;
    }

    return RGB;
}

/**
 * Get an RGB color.
 * 
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} rgb The color definition in RGB: `128,0,255`.
 * @return {string} The color definition in CSS format e.g. `#44ff00`.
 */
ColorModelProcessors.RGB = function (parserOptions: OptionList, rgb: string): string {
    const rgbParts: string[] = rgb.trim().split(/\s*,\s*/);
    let RGB = '#';

    if (rgbParts.length !== 3) {
        throw new TexError('ModelArg1', 'Color values for the %1 model require 3 numbers', 'RGB');
    }

    for (const rgbPart of rgbParts) {
        if (!rgbPart.match(/^\d+$/)) {
            throw new TexError('InvalidNumber', 'Invalid number');
        }

        const n = parseInt(rgbPart);
        if (n > 255) {
            throw new TexError('ModelArg2',
                'Color values for the %1 model must be between %2 and %3',
                'RGB', '0', '255');
        }

        let pn = n.toString(16);
        if (pn.length < 2) {
            pn = '0' + pn;
        }
        RGB += pn;
    }
    return RGB;
}

/**
 * Get a gray-scale value.
 * 
 * @param {OptionList} parserOptions The parser options object.
 * @param {string} gray The color definition in RGB: `0.5`.
 * @return {string} The color definition in CSS format e.g. `#808080`.
 */
ColorModelProcessors.gray = function (parserOptions: OptionList, gray: string): string {
    if (!gray.match(/^\s*(\d+(\.\d*)?|\.\d+)\s*$/)) {
        throw new TexError('InvalidDecimalNumber', 'Invalid decimal number');
    }

    const n: number = parseFloat(gray);
    if (n < 0 || n > 1) {
        throw new TexError('ModelArg2',
            'Color values for the %1 model must be between %2 and %3',
            'gray', '0', '1');
    }
    let pn = Math.floor(n * 255).toString(16);
    if (pn.length < 2) {
        pn = '0' + pn;
    }

    return `#${pn}${pn}${pn}`;
}


export const ColorMethods: Record<string, ParseMethod> = {};


/**
 * Override \color macro definition.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.Color = function (parser: TexParser, name: string) {
    const model = parser.GetBrackets(name, '');
    const colorDef = parser.GetArgument(name);
    const color = getColor(parser.options, model, colorDef);

    const style = parser.itemFactory.create('style')
                        .setProperties({styles: { mathcolor: color }});
    parser.stack.env['color'] = color;

    parser.Push(style);
};


/**
 * Define the \textcolor macro.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.TextColor = function (parser: TexParser, name: string) {
    const model = parser.GetBrackets(name, '');
    const colorDef = parser.GetArgument(name);
    const color = getColor(parser.options, model, colorDef);
    const old = parser.stack.env['color'];

    parser.stack.env['color'] = color;
    const math = parser.ParseArg(name);

    if (old) {
        parser.stack.env['color'] = old;
    } else {
        delete parser.stack.env['color'];
    }

    const node = parser.configuration.nodeFactory.create('node', 'mstyle', [math], { mathcolor: color });
    parser.Push(node);
};

/**
 * Define the \definecolor macro.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.DefineColor = function (parser: TexParser, name: string) {
    const cname = parser.GetArgument(name),
        model = parser.GetArgument(name),
        def = parser.GetArgument(name);

    if (!parser.options.definedColors) {
        parser.options.definedColors = new Map<string, string>();
    }
    
    parser.options.definedColors.set(cname, getColor(parser.options, model, def));
};

/**
 * Produce a text box with a colored background: `\colorbox`.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.ColorBox = function (parser: TexParser, name: string) {
    const cname = parser.GetArgument(name),
        math = ParseUtil.internalMath(parser, parser.GetArgument(name));

    const node = parser.configuration.nodeFactory.create('node', 'mpadded', math, {
        mathbackground: getColor(parser.options, 'named', cname)
    });

    NodeUtil.setProperties(node, padding(parser.options.colorPadding));
    parser.Push(node);
};

/**
 * Procude a framed text box with a colored background: `\fcolorbox`.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.FColorBox = function (parser: TexParser, name: string) {
    const fname = parser.GetArgument(name),
        cname = parser.GetArgument(name),
        math = ParseUtil.internalMath(parser, parser.GetArgument(name));

    const node = parser.configuration.nodeFactory.create('node', 'mpadded', math, {
        mathbackground: getColor(parser.options, 'named', cname),
        style: `border: ${parser.options.colorBorderWidth} solid ${getColor(parser.options, 'named', fname)}`
    });

    NodeUtil.setProperties(node, padding(parser.options.colorPadding));
    parser.Push(node);
};
