/*************************************************************
 *
 *  MathJax/jax/input/TeX/Parser.js
 *
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2009-2017 The MathJax Consortium
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


import {imp} from './imp.js';
// import {StopItem} from './StackItem.js';
// import {Stack} from './Stack.js';
import {StopItem} from '../../../../../mathjax3/input/tex/StackItem.js';
import Stack from '../../../../../mathjax3/input/tex/Stack.js';
import MapHandler from '../../../../../mathjax3/input/tex/MapHandler.js';
import TeXParser from '../../../../../mathjax3/input/tex/TexParser.js';
import {ParseMethods} from './ParseMethods.js';
import TexError from '../../../../../mathjax3/input/tex/TexError.js';


// ES6 version of the main Parser class.


let NBSP = "\u00A0"; 

export class OldParser {


  constructor(string,env, configurations, STACKITEM) {
    imp.printMethod("Init (Old Parser Object)");
    this.STACKITEM = STACKITEM;
    this.NewParser = new TeXParser();
    ParseMethods.NEW_PARSER = this.NewParser;
    this.remap =  MapHandler.getInstance().getMap('remap');
    this.string = string; this.i = 0; this.macroCount = 0;
    var ENV; if (env) {ENV = {}; for (var id in env) {if (env.hasOwnProperty(id)) {ENV[id] = env[id]}}}
    this.stack = new Stack(ENV,!!env,STACKITEM);
    this.NewParser.setup(ParseMethods);
    configurations.forEach(this.NewParser.append.bind(this.NewParser));
    this.Parse();
    this.Push(imp.STACKS ? new StopItem() : STACKITEM.stop());
  }
  
  Parse() {
    imp.printMethod("Parse (Old Parser Object)");
    var c, n;
    while (this.i < this.string.length) {
      c = this.string.charAt(this.i++); n = c.charCodeAt(0);
      if (n >= 0xD800 && n < 0xDC00) {c += this.string.charAt(this.i++)}
      this.NewParser.parse('character', [c, this])
      }
    }

    Push(arg) {
    imp.printMethod("Push (Old Parser Object)");
      this.stack.Push(arg);
    }

    PushAll(args) {
      imp.printMethod("PushAll (Old Parser Object)");
      for(var i = 0, m = args.length; i < m; i++) {
        this.stack.Push(args[i]);
      } 
    }

    mml() {
      imp.printMethod("mml (Old Parser Object)");
      if (!this.stack.Top().hasType('mml')) {
        return null;
      }
      var node = this.stack.Top().data[0];
      if (imp.NEW) {
        // Makes sure TeXclasses are properly set, so none is null.
        node.setTeXclass(null);
      };
      return node;
    }

    // VS: Forget this for now!
    mmlToken(token) {return token} // used by boldsymbol extension


    /************************************************************************/
    /*
     *   String handling routines
     */

    /*
     *  Convert delimiter to character
     */
    convertDelimiter(c) {
    imp.printMethod("convertDelimiter (Old Parser Object)");
      return this.NewParser.lookup('delimiter', c).char || null;
    }

    /*
     *  Trim spaces from a string
     */
    // static
    trimSpaces(text) {
    imp.printMethod("trimSpaces (Old Parser Object)");
      if (typeof(text) != 'string') {return text}
      var TEXT = text.replace(/^\s+|\s+$/g,'');
      if (TEXT.match(/\\$/) && text.match(/ $/)) TEXT += " ";
      return TEXT;
    }

    /*
     *   Check if the next character is a space
     */
    nextIsSpace() {
    imp.printMethod("nextIsSpace (Old Parser Object)");
      return this.string.charAt(this.i).match(/\s/);
    }

    
    /*
     *  Get the next non-space character
     */
    GetNext() {
    imp.printMethod("GetNext (Old Parser Object)");
      while (this.nextIsSpace()) {this.i++}
      return this.string.charAt(this.i);
    }
  
    /*
     *  Get and return a control-sequence name
     */
    GetCS() {
    imp.printMethod("GetCS (Old Parser Object)");
      var CS = this.string.slice(this.i).match(/^([a-z]+|.) ?/i);
      if (CS) {this.i += CS[1].length; return CS[1]} else {this.i++; return " "}
    }

    /*
     *  Get and return a TeX argument (either a single character or control sequence,
     *  or the contents of the next set of braces).
     */
    GetArgument(name,noneOK) {
    imp.printMethod("GetArgument (Old Parser Object)");
      switch (this.GetNext()) {
       case "":
        if (!noneOK) {throw new TexError(["MissingArgFor","Missing argument for %1",name])}
        return null;
       case '}':
        if (!noneOK) {
          throw new TexError(["ExtraCloseMissingOpen",
                     "Extra close brace or missing open brace"]);
        }
        return null;
       case '\\':
        this.i++; return "\\"+this.GetCS();
       case '{':
        var j = ++this.i, parens = 1;
        while (this.i < this.string.length) {
          switch (this.string.charAt(this.i++)) {
           case '\\':  this.i++; break;
           case '{':   parens++; break;
           case '}':
            if (--parens == 0) {return this.string.slice(j,this.i-1)}
            break;
          }
        }
        throw new TexError(["MissingCloseBrace","Missing close brace"]);
        break;
      }        
      return this.string.charAt(this.i++);
    }

    
    /*
     *  Get an optional LaTeX argument in brackets
     */
    GetBrackets(name,def) {
    imp.printMethod("GetBrackets (Old Parser Object)");
      if (this.GetNext() != '[') {return def};
      var j = ++this.i, parens = 0;
      while (this.i < this.string.length) {
        switch (this.string.charAt(this.i++)) {
         case '{':   parens++; break;
         case '\\':  this.i++; break;
         case '}':
          if (parens-- <= 0) {
            throw new TexError(["ExtraCloseLooking",
                       "Extra close brace while looking for %1","']'"]);
          }
          break;   
         case ']':
          if (parens == 0) {return this.string.slice(j,this.i-1)}
          break;
        }
      }
      throw new TexError(["MissingCloseBracket",
                 "Couldn't find closing ']' for argument to %1",name]);
    }
  
    /*
     *  Get the name of a delimiter (check it in the delimiter list).
     */
    GetDelimiter(name,braceOK) {
    imp.printMethod("GetDelimiter (Old Parser Object)");
      while (this.nextIsSpace()) {this.i++}
      var c = this.string.charAt(this.i); this.i++;
      if (this.i <= this.string.length) {
        if (c == "\\") {
          c += this.GetCS(name);
        } else if (c === "{" && braceOK) {
          this.i--;
          c = this.GetArgument(name);
        }
        if (this.NewParser.contains('delimiter', c)) {
          return this.convertDelimiter(c);
        }
      }
      throw new TexError(["MissingOrUnrecognizedDelim",
                 "Missing or unrecognized delimiter for %1",name]);
    }

    /*
     *  Get a dimension (including its units).
     */
    GetDimen(name) {
    imp.printMethod("GetDimen (Old Parser Object)");
      var dimen;
      if (this.nextIsSpace()) {this.i++}
      if (this.string.charAt(this.i) == '{') {
        dimen = this.GetArgument(name);
        if (dimen.match(/^\s*([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)\s*$/))
          {return dimen.replace(/ /g,"").replace(/,/,".")}
      } else {
        dimen = this.string.slice(this.i);
        var match = dimen.match(/^\s*(([-+]?([.,]\d+|\d+([.,]\d*)?))\s*(pt|em|ex|mu|px|mm|cm|in|pc)) ?/);
        if (match) {
          this.i += match[0].length;
          return match[1].replace(/ /g,"").replace(/,/,".");
        }
      }
      throw new TexError(["MissingDimOrUnits",
                 "Missing dimension or its units for %1",name]);
    }

    
    /*
     *  Get everything up to the given control sequence (token)
     */
    GetUpTo(name,token) {
    imp.printMethod("GetUpTo (Old Parser Object)");
      while (this.nextIsSpace()) {this.i++}
      var j = this.i, k, c, parens = 0;
      while (this.i < this.string.length) {
        k = this.i; c = this.string.charAt(this.i++);
        switch (c) {
         case '\\':  c += this.GetCS(); break;
         case '{':   parens++; break;
         case '}':
          if (parens == 0) {
            throw new TexError(["ExtraCloseLooking",
                       "Extra close brace while looking for %1",token])
          }
          parens--;
          break;
        }
        if (parens == 0 && c == token) {return this.string.slice(j,k)}
      }
      throw new TexError(["TokenNotFoundForCommand",
                 "Couldn't find %1 for %2",token,name]);
    }

    /*
     *  Parse various substrings
     */
  ParseArg(name) {
    imp.printMethod("ParseArg (Old Parser Object)");
    let object = new OldParser(this.GetArgument(name),this.stack.env, [], this.STACKITEM);
    return object.mml();
  }

  ParseUpTo(name,token) {
    imp.printMethod("ParseUpTo (Old Parser Object)");
    return new OldParser(this.GetUpTo(name,token),this.stack.env, [], this.STACKITEM).mml();
  }

    
    /*
     *  Break up a string into text and math blocks
     */
    InternalMath(text,level) {
    imp.printMethod("InternalMath (Old Parser Object)");
      var def = (this.stack.env.font ? {mathvariant: this.stack.env.font} : {});
      var mml = [], i = 0, k = 0, c, node, match = '', braces = 0;
      if (text.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
        while (i < text.length) {
          c = text.charAt(i++);
          if (c === '$') {
            if (match === '$' && braces === 0) {
              // @test Interspersed Text
              node = imp.createNode('TeXAtom', [(new OldParser(text.slice(k,i-1),{}, [], this.STACKITEM)).mml()], {});
              // VS: OLD
              // node = MML.TeXAtom((new OldParser(text.slice(k,i-1),{})).mml());
              mml.push(node);
              match = ''; k = i;
            } else if (match === '') {
              // @test Interspersed Text
              if (k < i-1) mml.push(this.InternalText(text.slice(k,i-1),def));
              match = '$'; k = i;
            }
          } else if (c === '{' && match !== '') {
            braces++;
          } else if (c === '}') {
            if (match === '}' && braces === 0) {
              imp.untested(12);
              node = imp.createNode('TeXAtom', [(new OldParser(text.slice(k,i),{}, [], this.STACKITEM)).mml()], def);
              // VS: OLD
              // node = MML.TeXAtom((new OldParser(text.slice(k,i),{})).mml().With(def));
              mml.push(node);
              match = ''; k = i;
            } else if (match !== '') {
              if (braces) braces--;
            }
          } else if (c === '\\') {
            if (match === '' && text.substr(i).match(/^(eq)?ref\s*\{/)) {
              var len = RegExp["$&"].length;
              if (k < i-1) mml.push(this.InternalText(text.slice(k,i-1),def));
              match = '}'; k = i-1; i += len;
            } else {
              c = text.charAt(i++);
              if (c === '(' && match === '') {
                if (k < i-2) mml.push(this.InternalText(text.slice(k,i-2),def));
                match = ')'; k = i;
              } else if (c === ')' && match === ')' && braces === 0) {
                imp.untested(13);
                node = imp.createNode('TeXAtom', [(new OldParser(text.slice(k,i-2),{}, [], this.STACKITEM)).mml()], {});
                // VS: OLD
                // node = MML.TeXAtom((new OldParser(text.slice(k,i-2),{})).mml());
                mml.push(node);
                match = ''; k = i;
              } else if (c.match(/[${}\\]/) && match === '')  {
                i--; text = text.substr(0,i-1) + text.substr(i); // remove \ from \$, \{, \}, or \\
              }
            }
          }
        }
        if (match !== '') throw new TexError(["MathNotTerminated","Math not terminated in text box"]);
      }
      if (k < text.length) mml.push(this.InternalText(text.slice(k),def));
      if (level != null) {
        // @test Label, Fbox, Hbox
        mml = [imp.createNode('mstyle', mml, {displaystyle:false,scriptlevel:level})];
        // VS: OLD
        // mml = [MML.mstyle.apply(MML,mml).With({displaystyle:false,scriptlevel:level})];
      } else if (mml.length > 1) {
        // @test Interspersed Text
        mml = [imp.createNode('mrow', mml, {})];
        // VS: OLD
        // mml = [MML.mrow.apply(MML,mml)];
      }
      return mml;
    }

    InternalText(text,def) {
      // @test Label, Fbox, Hbox
      imp.printMethod("InternalText (Old Parser Object)");
      text = text.replace(/^\s+/,NBSP).replace(/\s+$/,NBSP);
      var textNode = imp.createText(text);
      return imp.createNode('mtext', [], def, textNode);
      // VS: OLD
      // return MML.mtext(MML.chars(text)).With(def);
    }

  // AMS
  
    /*
     *  Get a delimiter or empty argument
     */
    GetDelimiterArg(name) {
      imp.printMethod('AMS-GetDelimiterArg (Old Parser Object)');
      var c = this.trimSpaces(this.GetArgument(name));
      if (c == "") return null;
      if (this.NewParser.contains('delimiter', c)) {
        return c;
      }
      // if (c in TEXDEF.delimiter) return c;
      throw new TexError(["MissingOrUnrecognizedDelim","Missing or unrecognized delimiter for %1",name]);
    }
    
    /*
     *  Get a star following a control sequence name, if any
     */
    GetStar() {
      imp.printMethod('AMS-GetStar (Old Parser Object)');
      var star = (this.GetNext() === "*");
      if (star) {this.i++}
      return star;
    }
}
