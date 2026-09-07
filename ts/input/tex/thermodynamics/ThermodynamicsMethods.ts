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
import { StackItem } from '../StackItem.js';
import TexError from '../TexError.js';

let PartialOpen = '(';
let PartialClose = ')';
let PartialEmptyClose = ')';
let localdelimiterchange = false;

function CheckForChangeInDelimiterOptions (parser: TexParser)
{
  let delimiteroptions =
      ['parentheses','brackets','braces','bar','plain-derivatives'];

  if ( localdelimiterchange )
    {} // we do nothing if we are inside an environment that changes delimiters
  else if ( parser.options.thermodynamics['parentheses'] )
  {
      for ( let opt of delimiteroptions )
        parser.options.thermodynamics[opt] = false;
      PartialOpen = '(';
      PartialClose = ')';
      PartialEmptyClose = ')';
  }
  else if ( parser.options.thermodynamics['brackets'] )
  {
      for ( let opt of delimiteroptions )
        parser.options.thermodynamics[opt] = false;
      PartialOpen = '[';
      PartialClose = ']';
      PartialEmptyClose = ']';
  }
  else if ( parser.options.thermodynamics['braces'] )
  {
      for ( let opt of delimiteroptions )
        parser.options.thermodynamics[opt] = false;
      PartialOpen = '\\{';
      PartialClose = '\\}';
      PartialEmptyClose = '\\}';
  }
  else if ( parser.options.thermodynamics['bar'] )
  {
      for ( let opt of delimiteroptions )
        parser.options.thermodynamics[opt] = false;
      PartialOpen = '.';
      PartialClose = '\\rvert';
      PartialEmptyClose = '.';
  }
  else if ( parser.options.thermodynamics['plain-derivatives'] )
  {
      for ( let opt of delimiteroptions )
        parser.options.thermodynamics[opt] = false;
      PartialOpen = '.';
      PartialClose = '.';
      PartialEmptyClose = '.';
  }
}

export const ThermodynamicsMethods: { [key: string]: ParseMethod } = {

  ExtensiveProperty (parser: TexParser, name: string) {
    switch (parser.options.thermodynamics['extensive-style']) {
      case 'intensive-plain' :
        ThermodynamicsMethods.Macro (parser, name,
          "{\\mkern1mu\\underline{\\mkern-1mu #1\\mkern-4mu}\\mkern4mu}", 1);
        break;
      case 'extensive-plain' :
      case 'intensive-lowercase' :
        ThermodynamicsMethods.Macro (parser, name, '#1', 1);
        break;
      case 'extensive-superscript' :
        let arg = parser.GetArgument(name);
        ThermodynamicsMethods.SuperscriptedSymbol (parser, name, arg, 't');
        break;
      default :
        throw new TexError('BadExtensiveStyle',
          'Invalid value of extensive-style option');
    }
  },

  IntensiveProperty (parser: TexParser, name: string) {
    switch (parser.options.thermodynamics['extensive-style']) {
      case 'extensive-plain' :
        ThermodynamicsMethods.Macro (parser, name,
          "{\\mkern1mu\\underline{\\mkern-1mu #1\\mkern-4mu}\\mkern4mu}", 1);
        break;
      case 'intensive-plain' :
      case 'extensive-superscript' :
        ThermodynamicsMethods.Macro (parser, name, '#1', 1);
        break;
      case 'intensive-lowercase' :
        // FIXME need a better way to handle this case
        let arg = parser.GetArgument(name);
        ThermodynamicsMethods.Macro (parser, name, arg.toLowerCase());
        break;
      default :
        throw new TexError('InvalidOption', 'Thermodynamics error: "' + 
          parser.options.thermodynamics['extensive-style']
          + 'is not a valid symbol style');
    }
  },

  // Partial molar quantities
  // cases to consider:
  // (1) Mpm{i}
  // (2) Mpm[S]{i}
  // (3) Mpm^S_i
  // (4) Mpm_i^S
  // (5) Mpm_i
  PartialMolar (parser: TexParser, name: string, symbol: string) {
    let supers = parser.GetBrackets(name);
    let subs = null;

    // Check for updated shortpm options
    if ( parser.options.thermodynamics['shortpm'] )
    {
      // shortpm is always false unless the user changed it recently
      parser.options.thermodynamics['longpm'] = false;
      parser.options.thermodynamics['shortpm'] = false;
    }

    let arg = parser.GetArgument(name, true);
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
      if ( parser.options.thermodynamics['longpm'] )
        // \mkern2mu\overline{\mkern-2mu{symbol_subs^supers}\mkern-1mu}\mkern1mu
        ThermodynamicsMethods.Macro (parser, name,
          '\\mkern2mu\\overline{\\mkern-2mu{'
            + symbol + '}_{' + subs + '}^{' + supers
            + '}\\mkern-1mu}\\mkern1mu');
      else
        ThermodynamicsMethods.Macro (parser, name,
          '\\mkern2mu\\overline{\\mkern-2mu{'
            + symbol + '\\mkern-1mu}\\mkern1mu'
            + '}_{' + subs + '}^{' + supers + '}');
    } else {
      if ( parser.options.thermodynamics['longpm'] )
        // \mkern2mu\overline{\mkern-2mu{symbol_subs}\mkern-1mu}\mkern1mu
        ThermodynamicsMethods.Macro (parser, name,
          '\\mkern2mu\\overline{\\mkern-2mu{'
            + symbol + '_{' + subs + '}}\\mkern-1mu}\\mkern1mu');
      else
{
        ThermodynamicsMethods.Macro (parser, name,
          '\\mkern2mu\\overline{\\mkern-2mu{'
            + symbol + '\\mkern-1mu}}\\mkern1mu' + '_{' + subs + '}');
}
    }
  },

  PartialMolarMacro (parser: TexParser, name: string) {
    let symbol: string = parser.GetArgument(name);
    ThermodynamicsMethods.PartialMolar (parser, name, symbol)
  },

  LocalShortPm (parser: TexParser, begin: StackItem) {
    let oldvalue: boolean = parser.options.thermodynamics['longpm'];
    let name: string = begin.getName();
    let endstr: string = '\\end{' + name + '}';
    let istop: number = parser.string.indexOf(endstr);
    let rest: string = parser.string.slice(istop);
    parser.options.thermodynamics['longpm'] = false;
    parser.Push(begin);
    parser.string = parser.string.substring(parser.i, istop);
    parser.i = 0;
    parser.Parse();
    parser.options.thermodynamics['longpm'] = oldvalue;
    parser.string = rest;
    parser.i = 0;
  },

  LocalLongPm (parser: TexParser, begin: StackItem) {
    let oldvalue = parser.options.thermodynamics['longpm'];
    let name: string = begin.getName();
    let endstr: string = '\\end{' + name + '}';
    let istop: number = parser.string.indexOf(endstr);
    let rest: string = parser.string.slice(istop);
    parser.options.thermodynamics['longpm'] = true;
    parser.Push(begin);
    parser.string = parser.string.substring(parser.i, istop);
    parser.i = 0;
    parser.Parse();
    parser.options.thermodynamics['longpm'] = oldvalue;
    parser.string = rest;
    parser.i = 0;
  },

  // Implements alternative delimiters for \Partial and friends
  LocallyChangeDelimiters (parser: TexParser, begin: StackItem,
        open: string, close: string, emptyclose: string) {
    let oldPartialOpen = PartialOpen;
    let oldPartialClose = PartialClose;
    let oldPartialEmptyClose = PartialEmptyClose;
    let name: string = begin.getName();
    let endstr: string = '\\end{' + name + '}';
    let istop: number = parser.string.indexOf(endstr);
    let rest: string = parser.string.slice(istop);
    localdelimiterchange = true;
    parser.Push(begin);
    PartialOpen = open;
    PartialClose = close;
    PartialEmptyClose = emptyclose;
    parser.string = parser.string.substring(parser.i, istop);
    parser.i = 0;
    parser.Parse();
    parser.string = rest;
    parser.i = 0;
    PartialOpen = oldPartialOpen;
    PartialClose = oldPartialClose;
    PartialEmptyClose = oldPartialEmptyClose;
    localdelimiterchange = false;
  },

  Partial (parser: TexParser, name: string, begin='\\left', end='\\right') {
    const star = parser.GetStar();
    const arg1 = parser.GetArgument(name);
    const arg2 = parser.GetArgument(name);
    const arg3 = parser.GetArgument(name);
    CheckForChangeInDelimiterOptions (parser);

    let kerning = '';
    if ( star )
      kerning = '\\mkern-12mu';
    if ( arg3 == '' )
      ThermodynamicsMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial ' + arg1 + '}{\\partial ' + arg2 + '}'
        + end + PartialEmptyClose + kerning);
    else
      ThermodynamicsMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial ' + arg1 + '}{\\partial ' + arg2 + '}'
        + end + PartialClose + '_{' + arg3 + '}' + kerning);
  },

  PartialSecond (parser: TexParser, name: string,
        begin='\\left', end='\\right')
  {
    const star = parser.GetStar();
    const arg1 = parser.GetArgument(name);
    const arg2 = parser.GetArgument(name);
    const arg3 = parser.GetArgument(name);
    let kerning = '';
    CheckForChangeInDelimiterOptions (parser);

    if ( star )
      kerning = '\\mkern-12mu';
    if ( arg3 == '' )
      ThermodynamicsMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial^2 ' + arg1 + '}{\\partial ' + arg2 + '^2}'
        + end + PartialEmptyClose + kerning);
    else
      ThermodynamicsMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial^2 ' + arg1 + '}{\\partial ' + arg2 + '^2}'
        + end + PartialClose + '_{' + arg3 + '}' + kerning);
  },

  PartialMixSecond (parser: TexParser, name: string,
        begin='\\left', end='\\right')
  {
    const star = parser.GetStar();
    const arg1 = parser.GetArgument(name);
    const arg2 = parser.GetArgument(name);
    const arg3 = parser.GetArgument(name);
    const arg4 = parser.GetArgument(name);
    let kerning = '';
    CheckForChangeInDelimiterOptions (parser);

    if ( star )
      kerning = '\\mkern-12mu';
    if ( arg4 == '' )
      ThermodynamicsMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial^2 ' + arg1 + '}{\\partial ' + arg2
        + '\\partial ' + arg3 + '}' + end + PartialEmptyClose + kerning);
    else
      ThermodynamicsMethods.Macro (parser, name, begin + PartialOpen
        + '\\frac{\\partial^2 ' + arg1 + '}{\\partial ' + arg2
        + '\\partial ' + arg3 + '}' + end + PartialClose
        + '_{' + arg4 + '}' + kerning);
  },

  NewExtensiveProperty (parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    NewcommandUtil.addMacro (parser, csbase + 't',
      ThermodynamicsMethods.Macro, ["\\extensive{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 'm',
      ThermodynamicsMethods.Macro, ["\\intensive{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 's',
      ThermodynamicsMethods.Macro, ["\\specific{" + symbol + "}"]);
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
      ThermodynamicsMethods.Macro, ["\\extensive{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'E',
      ThermodynamicsMethods.Macro, ["\\intensive{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'Es',
      ThermodynamicsMethods.Macro, ["\\specific{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'Epm',
      ThermodynamicsMethods.PartialMolarSuperscripted, [symbol,'\\excess']);
  },

  NewResidualProperty (parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    NewcommandUtil.addMacro (parser, csbase + 'Rt',
      ThermodynamicsMethods.Macro, ["\\extensive{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'R',
      ThermodynamicsMethods.Macro, ["\\intensive{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'Rs',
      ThermodynamicsMethods.Macro, ["\\specific{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'Rpm',
      ThermodynamicsMethods.PartialMolarSuperscripted, [symbol,'\\residual']);
  },

  NewThermodynamicProperty (parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    NewcommandUtil.addMacro (parser, csbase + 't',
      ThermodynamicsMethods.Macro, ["\\extensive{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 'm',
      ThermodynamicsMethods.Macro, ["\\intensive{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 's',
      ThermodynamicsMethods.Macro, ["\\specific{" + symbol + "}"]);
    NewcommandUtil.addMacro (parser, csbase + 'pm',
        ThermodynamicsMethods.PartialMolar, [symbol]);
    NewcommandUtil.addMacro (parser, csbase + 'Et',
      ThermodynamicsMethods.Macro, ["\\extensive{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'E',
      ThermodynamicsMethods.Macro, ["\\intensive{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'Es',
      ThermodynamicsMethods.Macro, ["\\specific{" + symbol + "}^\\excess"]);
    NewcommandUtil.addMacro (parser, csbase + 'Epm',
      ThermodynamicsMethods.PartialMolarSuperscripted, [symbol,'\\excess']);
    NewcommandUtil.addMacro (parser, csbase + 'Rt',
      ThermodynamicsMethods.Macro, ["\\extensive{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'R',
      ThermodynamicsMethods.Macro, ["\\intensive{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'Rs',
      ThermodynamicsMethods.Macro, ["\\specific{" + symbol + "}^\\residual"]);
    NewcommandUtil.addMacro (parser, csbase + 'Rpm',
      ThermodynamicsMethods.PartialMolarSuperscripted, [symbol,'\\residual']);
  },

  SubscriptedSymbol (parser: TexParser, name: string,
        symbol: string, subscript: string) {
    let arg = parser.GetArgument(name, true);
    switch ( arg ) {
      case '_' :
        arg = parser.GetArgument(name);
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '_{' + subscript + ',' + arg + '}');
        break;
      case '^' :
        let supers = parser.GetArgument(name);
        // peek at next char
        const nextchar = parser.string.charAt(parser.i)
        if ( nextchar == '_' )
        {
          let subs = parser.GetArgument(name);
          subs = parser.GetArgument(name);
          ThermodynamicsMethods.Macro (parser, name,
            symbol + '^{' + supers + '}_{' + subscript + ',' + subs + '}');
        }
        break;
      case null :
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '_{' + subscript + '}');
        break;
      default :
        ThermodynamicsMethods.Macro (parser, 'SubscriptedSymbol',
          symbol + '_{' + subscript + '}' + arg);
    }
  },

  SuperscriptedSymbol (parser: TexParser, name: string,
        symbol: string, superscript: string) {
    let arg = parser.GetArgument(name, true);
    switch ( arg ) {
      case '^' :
        arg = parser.GetArgument(name);
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '^{' + superscript + ',' + arg + '}');
        break;
      case null :
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '^{' + superscript + '}');
        break;
      default :
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '^{' + superscript + '}' + arg);
    }
  },

  PartialMolarSubscripted (parser: TexParser, name: string, symbol: string,
        subscript: string) {
    let supers = parser.GetBrackets(name);
    let subs = null;
    let arg = parser.GetArgument(name, true);
    switch (arg) {
      case '_' :
        subs = parser.GetArgument(name);
        // "peek" at next argument to see whether it's ^
        const nextchar = parser.string.charAt(parser.i)
        if ( nextchar == '^' ) {
          arg = parser.GetArgument(name); // '^'
          supers = parser.GetArgument(name); // the superscript argument
        }
        break;
      case '^' :
        supers = parser.GetArgument(name);
        // "peek" at next argument to see whether it's _
        const nextc = parser.string.charAt(parser.i)
        if ( nextc == '_' ) {
          arg = parser.GetArgument(name); // '_'
          subs = parser.GetArgument(name); // the subscript argument
        }
        break;
      default :
        subs = arg;
        console.log('WARNING: found neither superscript nor subscript for partial molar quantity; arg is "' + arg + '"');
    }
    if ( subs == null )
    {
      //subs = '';
      throw new TexError('NoSubscript', 'ERROR: found neither'
        + ' superscript nor subscript for partial molar quantity');
    }
    if ( typeof supers !== "undefined" )
    {
      // \mkern2mu\overline{\mkern-2mu{symbol_{subscript,subs}^supers}\mkern-1mu}\mkern1mu
      ThermodynamicsMethods.Macro (parser, name,
        '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{' + subscript
            + ',' + subs + '}^{' + supers + '}\\mkern-1mu}\\mkern1mu');
    } else {
      // \mkern2mu\overline{\mkern-2mu{symbol_{subscript,subs}}\mkern-1mu}\mkern1mu
      ThermodynamicsMethods.Macro (parser, name,
        '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{' + subscript
            + ',' + subs + '}\\mkern-1mu}\\mkern1mu');
    }
  },

  PartialMolarSuperscripted (parser: TexParser, name: string, symbol: string,
        superscript: string) {
    let supers = parser.GetBrackets(name);
    let subs;
    let arg = parser.GetArgument(name, true);
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
      if ( parser.options.thermodynamics['longpm'] )
        ThermodynamicsMethods.Macro (parser, name,
          '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{' + subs + '}^{'
          + superscript + ',' + supers + '}\\mkern-1mu}\\mkern1mu');
      else
        ThermodynamicsMethods.Macro (parser, name,
          '\\mkern2mu\\overline{\\mkern-2mu{' + symbol
          + '}\\mkern-1mu}\\mkern1mu' + '}_{' + subs + '}^{'
          + superscript + ',' + supers);
    } else {
      if ( parser.options.thermodynamics['longpm'] )
        ThermodynamicsMethods.Macro (parser, name,
          '\\mkern2mu\\overline{\\mkern-2mu{' + symbol + '}_{'
              + subs + '}^{' + superscript + '}\\mkern-1mu}\\mkern1mu');
      else
        ThermodynamicsMethods.Macro (parser, name,
          '\\mkern2mu\\overline{\\mkern-2mu{' + symbol
            + '\\mkern-1mu}\\mkern1mu}_{' + subs + '}^{' + superscript + '}');
    }
  },

  ChangeonSomething (parser: TexParser, name: string,
      subscript = null, superscript = null) {
    const symbol = parser.GetArgument(name);
    const nextchar = parser.string.charAt(parser.i);
    let nextnextchar = null;
    let subs = '';
    let supers = '';
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
      ThermodynamicsMethods.Macro (parser, 'ChangeonSomething', '\\Delta '
        + symbol);
    else if ( subs == '' )
      ThermodynamicsMethods.Macro (parser, 'ChangeonSomething', '\\Delta '
        + symbol + '^{' + supers + '}');
    else if ( supers == '' )
      ThermodynamicsMethods.Macro (parser, 'ChangeonSomething', '\\Delta '
        + symbol + '_{' + subs + '}');
    else
      ThermodynamicsMethods.Macro (parser, 'ChangeonSomething', '\\Delta '
        + symbol + '_{' + subs + '}^{' + supers + '}');
  },

  // EIS = extensive, intensive, specific
  LocallyChangeEISappearance (parser: TexParser, begin: StackItem,
        value: string) {
    let name: string = begin.getName();
    let endstr: string = '\\end{' + name + '}';
    let istop: number = parser.string.indexOf(endstr);
    let rest: string = parser.string.slice(istop);
    let oldvalue: string = parser.options.thermodynamics['extensive-style'];
    // set EIS to values given
    parser.Push(begin);
    parser.options.thermodynamics['extensive-style'] = value;
    parser.string = parser.string.substring(parser.i, istop);
    parser.i = 0;
    parser.Parse();
    // change them back and set the rest of the string to be parsed
    parser.options.thermodynamics['extensive-style'] = oldvalue;
    parser.string = rest;
    parser.i = 0;
  },

  AllThings (parser: TexParser, name: string, symbol: string) {
    // check if the user changed the default options
    if ( parser.options.thermodynamics['moles-range'] )
    {
      parser.options.thermodynamics['moles-range'] = false;
      parser.options.thermodynamics['moles-index'] = false;
    }
    if ( parser.options.thermodynamics['moles-index'] )
      ThermodynamicsMethods.Macro (parser, name, '\\vec{' + symbol + '}');
    else
      ThermodynamicsMethods.Macro (parser, name,
        symbol + '_1,\\dotsc,' + symbol + '_{\\ncomponents}');
  },

  // FIXME this needs to recognize the *arguments* here (duh...)
  AllThingsExcept (parser: TexParser, name: string, symbol: string) {
    // check if the user changed the default options
    if ( parser.options.thermodynamics['moles-range'] )
    {
      parser.options.thermodynamics['moles-range'] = false;
      parser.options.thermodynamics['moles-index'] = false;
    }

    let otherindex = parser.GetBrackets(name);
    let index = parser.GetArgument(name);
    if ( otherindex == undefined ) otherindex = 'j';
    if ( parser.options.thermodynamics['moles-index'] ) {
      if ( index == 'j' && otherindex == 'j' )
        ThermodynamicsMethods.Macro (parser, name, symbol + '_{k \\neq '
            + index + '}');
      else
        ThermodynamicsMethods.Macro (parser, name, symbol + '_{' + otherindex
          + ' \\neq ' + index + '}');
    } else {
      if ( index == '1' )
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '_2,\\dotsc,' + symbol + '_{\\ncomponents}');
      else if ( index == '\\ncomponents' )
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '_1,\\dotsc,' + symbol + '_{\\ncomponents-1}');
      else
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '_1,\\dotsc,[' + symbol + '_' + index + '],\\dotsc,'
          + symbol + '_{\\ncomponents}');
    }
  },

  AllThingsExceptLastAnd (parser: TexParser, name: string, symbol: string) {
    // check if the user changed the default options
    if ( parser.options.thermodynamics['moles-range'] )
    {
      parser.options.thermodynamics['moles-range'] = false;
      parser.options.thermodynamics['moles-index'] = false;
    }
    let otherindex = parser.GetBrackets(name);
    let index = parser.GetArgument(name);
    if ( otherindex == undefined ) otherindex = 'j';
    if ( parser.options.thermodynamics['moles-index'] ) {
      if ( index == 'j' && otherindex == 'j' )
        ThermodynamicsMethods.Macro (parser, name, symbol + '_{k \\neq '
            + index + ',\\ncomponents}');
      else if ( index == '\\ncomponents' )
        ThermodynamicsMethods.Macro (parser, name, symbol + '_{k \\neq '
            + index + '}');
      else
        ThermodynamicsMethods.Macro (parser, name, symbol + '_{k \\neq '
            + index + ',\\ncomponents}');
    } else {
      if ( index == '1' )
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '_2,\\dotsc,' + symbol + '_{\\ncomponents-1}');
      else if ( index == '\\ncomponents' )
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '_1,\\dotsc,' + symbol + '_{\\ncomponents-1}');
      else if ( index.split(' ').join('') == '\\ncomponents-1' )
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '_1,\\dotsc,' + symbol + '_{\\ncomponents-2}');
      else
        ThermodynamicsMethods.Macro (parser, name,
          symbol + '_1,\\dotsc,[' + symbol + '_' + index + '],\\dotsc,'
          + symbol + '_{\\ncomponents-1}');
    }
  },

  LocalMolesIndex (parser: TexParser, begin: StackItem) {
    let oldvalue: boolean = parser.options.thermodynamics['moles-index'];
    let name: string = begin.getName();
    let endstr: string = '\\end{' + name + '}';
    let istop: number = parser.string.indexOf(endstr);
    let rest: string = parser.string.slice(istop);
    parser.options.thermodynamics['moles-index'] = true;
    parser.Push(begin);
    parser.string = parser.string.substring(parser.i, istop);
    parser.i = 0;
    parser.Parse();
    parser.options.thermodynamics['moles-index'] = oldvalue;
    parser.string = rest;
    parser.i = 0;
  },

  LocalMolesRange (parser: TexParser, begin: StackItem) {
    let oldvalue: boolean = parser.options.thermodynamics['moles-index'];
    let name: string = begin.getName();
    let endstr: string = '\\end{' + name + '}';
    let istop: number = parser.string.indexOf(endstr);
    let rest: string = parser.string.slice(istop);
    parser.options.thermodynamics['moles-index'] = false;
    parser.Push(begin);
    parser.string = parser.string.substring(parser.i, istop);
    parser.i = 0;
    parser.Parse();
    parser.options.thermodynamics['moles-index'] = oldvalue;
    parser.string = rest;
    parser.i = 0;
  },

  Macro: BaseMethods.Macro,

}

export default ThermodynamicsMethods;
