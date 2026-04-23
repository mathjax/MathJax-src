/*************************************************************
 *
 *  Copyright (c) 2026 The MathJax Consortium
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
 * @file Methods file for the thermodynamics package.
 *
 * @author kaiserkarl31@yahoo.com (Karl D. Hammond)
 */

import TexParser from '../TexParser.js';
import { ParseMethod } from '../Types.js';
import BaseMethods from '../base/BaseMethods.js';
import { NewcommandUtil } from '../newcommand/NewcommandUtil.js';

export const ThermodynamicsMethods: { [key: string]: ParseMethod } = {

  // Partial molar quantities
  // cases to consider:
  // (1) Mpm{i}
  // (2) Mpm[S]{i}
  // (3) Mpm^S_i
  // (4) Mpm_i^S
  // (5) Mpm_i
  PartialMolar (parser: TexParser, name: string, symbol: string) {
    var supers = parser.GetBrackets(name);
    var subs;
    var arg = parser.GetArgument(name, true);
    if ( arg == '_' ) {
      subs = parser.GetArgument(name);
      // "peek" at next argument to see whether it's ^
      const nextchar = parser.string.charAt(parser.i)
      if ( nextchar == '^' ) {
        arg = parser.GetArgument(name); // '^'
        supers = parser.GetArgument(name); // the superscript argument
      }
    } else if ( arg == '^' ) {
      supers = parser.GetArgument(name);
      // "peek" at next argument to see whether it's _
      const nextchar = parser.string.charAt(parser.i)
      if ( nextchar == '_' ) {
        arg = parser.GetArgument(name); // '_'
        subs = parser.GetArgument(name); // the subscript argument
      }
    }
    else subs = arg;
    if ( subs == null )
        subs = '';
    if ( typeof supers !== "undefined" )
    {
      // \mkern2mu\overline{\mkern-2mu{symbol_subs^supers}\mkern-1mu}\mkern1mu
      BaseMethods.Macro (parser, 'PartialMolar',
        '\\mkern2mu\\overline{\\mkern-2mu{'
          + symbol + '}_{' + subs + '}^{' + supers + '}\\mkern-1mu}\\mkern1mu');
    } else {
      // \mkern2mu\overline{\mkern-2mu{symbol_subs}\mkern-1mu}\mkern1mu
      BaseMethods.Macro (parser, 'PartialMolar',
        '\\mkern2mu\\overline{\\mkern-2mu{'
          + symbol + '_' + subs + '}\\mkern-1mu}\\mkern1mu');
    }
  },

  PartialMolarMacro (parser: TexParser, name: string) {
    var symbol = parser.GetArgument(name);
    ThermodynamicsMethods.PartialMolar (parser, name, symbol)
  },

  Partial (parser: TexParser) {
    const star = parser.GetStar() ? '*' : '';
    if ( star == '*' )
      BaseMethods.Macro (parser, 'Partial',
        '\\left(\\frac{\\partial #1}{\\partial #2}\\right)_{#3}\\mkern-12mu',
        3);
    else
      BaseMethods.Macro (parser, 'Partial*',
        '\\left(\\frac{\\partial #1}{\\partial #2}\\right)_{#3}', 3);
  },

  PartialSecond (parser: TexParser) {
    const star = parser.GetStar() ? '*' : '';
    if ( star == '*' )
      BaseMethods.Macro (parser, 'PartialSecond',
        '\\left(\\frac{\\partial^2 #1}{\\partial #2^2}\\right)_{#3}\\mkern-12mu',
        3);
    else
      BaseMethods.Macro (parser, 'PartialSecond*',
        '\\left(\\frac{\\partial^2 #1}{\\partial #2^2}\\right)_{#3}', 3);
  },

  PartialMixSecond (parser: TexParser) {
    const star = parser.GetStar() ? '*' : '';
    if ( star == '*' )
      BaseMethods.Macro (parser, 'PartialMixSecond',
        '\\left(\\frac{\\partial^2 #1}' +
                     '{\\partial #2\\partial #3}\\right)_{#4}\\mkern-12mu', 4);
    else
      BaseMethods.Macro (parser, 'PartialMixSecond*',
        '\\left(\\frac{\\partial^2 #1}' +
                     '{\\partial #2\\partial #3}\\right)_{#4}', 4);
  },

  PartialBigg (parser: TexParser) {
    const star = parser.GetStar() ? '*' : '';
    if ( star == '*' )
      BaseMethods.Macro (parser, 'PartialBigg',
        '\\Biggl(\\frac{\\partial #1}{\\partial #2}\\Biggr)_{#3}\\mkern-12mu',
        3);
    else
      BaseMethods.Macro (parser, 'PartialBigg*',
        '\\Biggl(\\frac{\\partial #1}{\\partial #2}\\Biggr)_{#3}', 3);
  },

  PartialSecondBigg (parser: TexParser) {
    const star = parser.GetStar() ? '*' : '';
    if ( star == '*' )
      BaseMethods.Macro (parser, 'PartialSecondBigg',
        '\\Biggl(\\frac{\\partial^2 #1}' +
                      '{\\partial #2^2}\\Biggr)_{#3}\\mkern-12mu',
        3);
    else
      BaseMethods.Macro (parser, 'PartialSecondBigg*',
        '\\Biggl(\\frac{\\partial^2 #1}' +
                      '{\\partial #2^2}\\Biggr)_{#3}', 3);
  },

  PartialMixSecondBigg (parser: TexParser) {
    const star = parser.GetStar() ? '*' : '';
    if ( star == '*' )
      BaseMethods.Macro (parser, 'PartialMixSecondBigg',
        '\\Biggl(\\frac{\\partial^2 #1}' +
                     '{\\partial #2\\partial #3}\\Biggr)_{#4}\\mkern-12mu', 4);
    else
      BaseMethods.Macro (parser, 'PartialMixSecondBigg*',
        '\\Biggl(\\frac{\\partial^2 #1}' +
                     '{\\partial #2\\partial #3}\\Biggr)_{#4}', 4);
  },

  Partialbigg (parser: TexParser) {
    const star = parser.GetStar() ? '*' : '';
    if ( star == '*' )
      BaseMethods.Macro (parser, 'Partialbigg',
        '\\biggl(\\frac{\\partial #1}{\\partial #2}\\biggr)_{#3}\\mkern-12mu',
        3);
    else
      BaseMethods.Macro (parser, 'Partialbigg*',
        '\\biggl(\\frac{\\partial #1}{\\partial #2}\\biggr)_{#3}', 3);
  },

  PartialSecondbigg (parser: TexParser) {
    const star = parser.GetStar() ? '*' : '';
    if ( star == '*' )
      BaseMethods.Macro (parser, 'PartialSecondbigg',
        '\\biggl(\\frac{\\partial^2 #1}' +
                      '{\\partial #2^2}\\biggr)_{#3}\\mkern-12mu',
        3);
    else
      BaseMethods.Macro (parser, 'PartialSecondbigg*',
        '\\biggl(\\frac{\\partial^2 #1}' +
                      '{\\partial #2^2}\\biggr)_{#3}', 3);
  },

  PartialMixSecondbigg (parser: TexParser) {
    const star = parser.GetStar() ? '*' : '';
    if ( star == '*' )
      BaseMethods.Macro (parser, 'PartialMixSecondbigg',
        '\\biggl(\\frac{\\partial^2 #1}' +
                   '{\\partial #2\\partial #3}\\Biggr)_{#4}\\mkern-12mu', 4);
    else
      BaseMethods.Macro (parser, 'PartialMixSecondbigg*',
        '\\biggl(\\frac{\\partial^2 #1}' +
                  '{\\partial #2\\partial #3}\\biggr)_{#4}', 4);
  },

  NewExtensiveProperty (parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    NewcommandUtil.addMacro (parser, csbase + 't',
      BaseMethods.Macro, ["\\extensive{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 'm',
      BaseMethods.Macro, ["\\intensive{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 's',
      BaseMethods.Macro, ["\\specific{" + symbol + "}"]);
  },

  NewPartialMolarProperty (parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    NewcommandUtil.addMacro (parser, csbase + 'pm',
      ThermodynamicsMethods.PartialMolar, [symbol]);
  },

  NewExcessProperty (parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    NewcommandUtil.addMacro (parser, csbase + 'Et',
      BaseMethods.Macro, ["\\extensive{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'Em',
      BaseMethods.Macro, ["\\intensive{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'Es',
      BaseMethods.Macro, ["\\specific{" + symbol + "}^\\excess"]);
  },

  NewResidualProperty (parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    NewcommandUtil.addMacro (parser, csbase + 'Rt',
      BaseMethods.Macro, ["\\extensive{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'Rm',
      BaseMethods.Macro, ["\\intensive{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'Rs',
      BaseMethods.Macro, ["\\specific{" + symbol + "}^\\residual"]);
  },

  NewThermodynamicProperty (parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    NewcommandUtil.addMacro (parser, csbase + 't',
      BaseMethods.Macro, ["\\extensive{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 'm',
      BaseMethods.Macro, ["\\intensive{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 's',
      BaseMethods.Macro, ["\\specific{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 'pm',
        ThermodynamicsMethods.PartialMolar, [symbol]);
    NewcommandUtil.addMacro (parser, csbase + 'Et',
      BaseMethods.Macro, ["\\extensive{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'Em',
      BaseMethods.Macro, ["\\intensive{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'Es',
      BaseMethods.Macro, ["\\specific{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'Rt',
      BaseMethods.Macro, ["\\extensive{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'Rm',
      BaseMethods.Macro, ["\\intensive{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'Rs',
      BaseMethods.Macro, ["\\specific{" + symbol + "}^\\residual"]);
  },

  SubscriptedSymbol (parser: TexParser, name: string,
        symbol: string, subscript: string) {
    var arg = parser.GetArgument(name, true);
    if ( arg == '_' )
    {
      arg = parser.GetArgument(name);
      BaseMethods.Macro (parser, 'SubscriptedSymbol',
        symbol + '_{' + subscript + ',' + arg + '}');
    }
    else
    {
      if ( arg == null )
        BaseMethods.Macro (parser, 'SubscriptedSymbol',
          symbol + '_{' + subscript + '}');
      else
        BaseMethods.Macro (parser, 'SubscriptedSymbol',
          symbol + '_{' + subscript + '}' + arg);
    }
  },

  SuperscriptedSymbol (parser: TexParser, name: string,
        symbol: string, superscript: string) {
    var arg = parser.GetArgument(name, true);
    switch ( arg ) {
      case '^' :
        arg = parser.GetArgument(name);
        BaseMethods.Macro (parser, 'SuperscriptedSymbol',
          symbol + '^{' + superscript + ',' + arg + '}');
        break;
      case null :
        BaseMethods.Macro (parser, 'SubscriptedSymbol',
          symbol + '^{' + superscript + '}');
        break
      default :
        BaseMethods.Macro (parser, 'SubscriptedSymbol',
          symbol + '^{' + superscript + '}' + arg);
    }
  },

  PartialMolarSubscripted (parser: TexParser, name: string, symbol: string,
        subscript: string) {
    var supers = parser.GetBrackets(name);
    var subs;
    var arg = parser.GetArgument(name, true);
    if ( arg == '_' ) {
      subs = parser.GetArgument(name);
      // "peek" at next argument to see whether it's ^
      const nextchar = parser.string.charAt(parser.i)
      if ( nextchar == '^' ) {
        arg = parser.GetArgument(name); // '^'
        supers = parser.GetArgument(name); // the superscript argument
      }
    } else if ( arg == '^' ) {
      supers = parser.GetArgument(name);
      // "peek" at next argument to see whether it's _
      const nextchar = parser.string.charAt(parser.i)
      if ( nextchar == '_' ) {
        arg = parser.GetArgument(name); // '_'
        subs = parser.GetArgument(name); // the subscript argument
      }
    }
    else subs = arg;
    if ( subs == null )
        subs = '';
    if ( typeof supers !== "undefined" )
    {
      // \mkern2mu\overline{\mkern-2mu{symbol_{subscript,subs}^supers}\mkern-1mu}\mkern1mu
      BaseMethods.Macro (parser, 'PartialMolarSubscripted',
        '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{' + subscript
            + ',' + subs + '}^{' + supers + '}\\mkern-1mu}\\mkern1mu');
    } else {
      // \mkern2mu\overline{\mkern-2mu{symbol_{subscript,subs}}\mkern-1mu}\mkern1mu
      BaseMethods.Macro (parser, 'PartialMolarSubscripted',
        '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{' + subscript
            + ',' + subs + '}\\mkern-1mu}\\mkern1mu');
    }
  },

  PartialMolarSuperscripted (parser: TexParser, name: string, symbol: string,
        superscript: string) {
    var supers = parser.GetBrackets(name);
    var subs;
    var arg = parser.GetArgument(name, true);
    if ( arg == '_' ) {
      subs = parser.GetArgument(name);
      // "peek" at next argument to see whether it's ^
      const nextchar = parser.string.charAt(parser.i)
      if ( nextchar == '^' ) {
        arg = parser.GetArgument(name); // '^'
        supers = parser.GetArgument(name); // the superscript argument
      }
    } else if ( arg == '^' ) {
      supers = parser.GetArgument(name);
      // "peek" at next argument to see whether it's _
      const nextchar = parser.string.charAt(parser.i)
      if ( nextchar == '_' ) {
        arg = parser.GetArgument(name); // '_'
        subs = parser.GetArgument(name); // the subscript argument
      }
    }
    else subs = arg;
    if ( subs == null )
        subs = '';
    if ( typeof supers !== "undefined" )
    {
      // \mkern2mu\overline{\mkern-2mu{symbol_{subs}^{superscript,supers}\mkern-1mu}\mkern1mu
      BaseMethods.Macro (parser, 'PartialMolarSubscripted',
        '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{' + subs + '}^{'
        + superscript + ',' + supers + '}\\mkern-1mu}\\mkern1mu');
    } else {
      // \mkern2mu\overline{\mkern-2mu{symbol_{subs}}\mkern-1mu}\mkern1mu
      BaseMethods.Macro (parser, 'PartialMolarSubscripted',
        '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{'
            + subs + '}^{' + superscript + '}\\mkern-1mu}\\mkern1mu');
    }
  },

  Macro: BaseMethods.Macro,

}

export default ThermodynamicsMethods;
