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

var PartialOpen = '(';
var PartialClose = ')';
var PartialEmptyClose = ')';

export function SetPartialDelimiters
  (open: string, close: string, emptyclose: string) {
    PartialOpen = open;
    PartialClose = close;
    PartialEmptyClose = emptyclose;
}

export const ThermodynamicsMethods: { [key: string]: ParseMethod } = {

  OldSetPartialDelimiters (parser: TexParser) {

    if ( parser.options.thermodynamics.parentheses ) {
      PartialOpen = '(';
      PartialClose = '(';
      PartialEmptyClose = '(';
      parser.options.thermodynamics.parentheses = false;
    }
    if ( parser.options.thermodynamics.brackets ) {
      PartialOpen = '[';
      PartialClose = '[';
      PartialEmptyClose = '[';
      parser.options.thermodynamics.brackets = false;
    }
    if ( parser.options.thermodynamics.bar ) {
      PartialOpen = '.';
      PartialClose = '|';
      PartialEmptyClose = '.';
      parser.options.thermodynamics.bar = false;
    }
/*    if ( parser.options.thermodynamics.'plain-derivatives' ) {
      PartialOpen = '.';
      PartialClose = '.';
      PartialEmptyClose = '.';
      parser.options.thermodynamics.'plain-derivatives' = false;
    }*/
  },

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

  Partial (parser: TexParser, name: string, begin='\\left', end='\\right') {
    const star = parser.GetStar();
    const arg1 = parser.GetArgument(name);
    const arg2 = parser.GetArgument(name);
    const arg3 = parser.GetArgument(name);

    var kerning = '';
    if ( star )
      kerning = '\\mkern-12mu';
    if ( arg3 == '' )
      BaseMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial ' + arg1 + '}{\\partial ' + arg2 + '}'
        + end + PartialEmptyClose + kerning);
    else
      BaseMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial ' + arg1 + '}{\\partial ' + arg2 + '}'
        + end + PartialClose + '_{' + arg3 + '}' + kerning);
  },

  PartialSecond (parser: TexParser, name: string,
        begin='\\left', end='\\right') {
    const star = parser.GetStar();
    const arg1 = parser.GetArgument(name);
    const arg2 = parser.GetArgument(name);
    const arg3 = parser.GetArgument(name);
    var kerning = '';
    if ( star )
      kerning = '\\mkern-12mu';
    if ( arg3 == '' )
      BaseMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial^2 ' + arg1 + '}{\\partial ' + arg2 + '^2}'
        + end + PartialEmptyClose + kerning);
    else
      BaseMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial^2 ' + arg1 + '}{\\partial ' + arg2 + '^2}'
        + end + PartialClose + '_{' + arg3 + '}' + kerning);
  },

  PartialMixSecond (parser: TexParser, name: string,
        begin='\\left', end='\\right') {
    const star = parser.GetStar();
    const arg1 = parser.GetArgument(name);
    const arg2 = parser.GetArgument(name);
    const arg3 = parser.GetArgument(name);
    const arg4 = parser.GetArgument(name);
    var kerning = '';
    if ( star )
      kerning = '\\mkern-12mu';
    if ( arg4 == '' )
      BaseMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial^2 ' + arg1 + '}{\\partial ' + arg2
        + '\\partial ' + arg3 + '}' + end + PartialEmptyClose + kerning);
    else
      BaseMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial^2 ' + arg1 + '}{\\partial ' + arg2
        + '\\partial ' + arg3 + '}' + end + PartialClose
        + '_{' + arg4 + '}' + kerning);
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
    switch ( arg ) {
      case '_' :
        arg = parser.GetArgument(name);
        BaseMethods.Macro (parser, 'SubscriptedSymbol',
          symbol + '_{' + subscript + ',' + arg + '}');
        break;
      case null :
        BaseMethods.Macro (parser, 'SubscriptedSymbol',
          symbol + '_{' + subscript + '}');
        break;
      default :
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
        break;
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
      BaseMethods.Macro (parser, 'PartialMolarSubscripted',
        '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{' + subs + '}^{'
        + superscript + ',' + supers + '}\\mkern-1mu}\\mkern1mu');
    } else {
      BaseMethods.Macro (parser, 'PartialMolarSubscripted',
        '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{'
            + subs + '}^{' + superscript + '}\\mkern-1mu}\\mkern1mu');
    }
  },

  ChangeonSomething (parser: TexParser, name: string,
      subscript = null, superscript = null) {
    const symbol = parser.GetArgument(name);
    const nextchar = parser.string.charAt(parser.i);
    var nextnextchar = null;
    var subs = '';
    var supers = '';
    // look for subscripts or superscripts
    switch ( nextchar ) {
      case '_' :
        parser.i++;
        subs = parser.GetArgument(name);
        // now check for additional superscript
        nextnextchar = parser.string.charAt(parser.i);
        if ( nextnextchar == '^' ) {
          parser.i++;
          supers = parser.GetArgument(name);
        }
        break;
      case '^' :
        parser.i++;
        supers = parser.GetArgument(name);
        // now check for additional subscript
        nextnextchar = parser.string.charAt(parser.i);
        if ( nextnextchar == '_' ) {
          parser.i++;
          subs = parser.GetArgument(name);
        }
        break;
    }
    // Add the "intrinsic" subscripts/superscripts
    if ( subscript != null ) {
      if ( subs == '' )
        subs = subscript;
      else
        subs = subscript + ',' + subs;
    }
    if ( superscript != null ) {
      if ( supers == '' )
        supers = superscript;
      else
        supers = superscript + ',' + supers;
    }
    // Print symbol with non-null superscripts and subscripts
    if ( subs == '' && supers == '' )
      // will this EVER happen? (it is an implied check that BOTH are not null)
      BaseMethods.Macro (parser, 'ChangeonSomething', '\\Delta ' + symbol);
    else if ( subs == '' )
      BaseMethods.Macro (parser, 'ChangeonSomething', '\\Delta ' + symbol
        + '^{' + supers + '}');
    else if ( supers == '' )
      BaseMethods.Macro (parser, 'ChangeonSomething', '\\Delta ' + symbol
        + '_{' + subs + '}');
    else
      BaseMethods.Macro (parser, 'ChangeonSomething', '\\Delta ' + symbol
        + '_{' + subs + '}^{' + supers + '}');
  },

  Macro: BaseMethods.Macro,

}

export default ThermodynamicsMethods;
