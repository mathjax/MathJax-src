/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  MathJax/jax/input/TeX/jax.js
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

let TeXParser = require('../../../../../mathjax3/input/tex/TexParser.js').default;
// let imp = require("./imp.js").imp;
// let TexError = require('../../../../../mathjax3/input/tex/TexError.js').default;
// let ParseMethods = require('./ParseMethods.js').ParseMethods;
let NewTex = require('../../../../../mathjax3/input/tex/Translate.js').NewTex;
// let Translate = require('./Translate.js').default;
require("./old-stackitem.js");


// This is only necessary for the legacy tests.
// imp.MML = MathJax.ElementJax.mml;
// ParseMethods.STACKITEM = MathJax.InputJax.TeX.Stack.Item;

(function (TEX) {

  var NBSP = "\u00A0"; 

  var STACKITEM = MathJax.InputJax.TeX.Stack.Item;

  var TEXDEF = {
    //
    //  Add new definitions without overriding user-defined ones
    //
    Add: function (src,dst,nouser) {
      if (!dst) {dst = this}
      for (var id in src) {if (src.hasOwnProperty(id)) {
        if (typeof src[id] === 'object' && !(src[id] instanceof Array) &&
           (typeof dst[id] === 'object' || typeof dst[id] === 'function'))
             {this.Add(src[id],dst[id],src[id],nouser)}
          else if (!dst[id] || !dst[id].isUser || !nouser) {dst[id] = src[id]}
      }}
      return dst;
    },
    number:  /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/,
    p_height: 1.2 / .85,   // cmex10 height plus depth over .85
    // TODO (VS): Retained these for AMScd.js.
    macros: {},
    special: {},
    environment: {},
    // TODO (VS): Temporary to collect configurations from extensions.
    configurations: []
  };

  var STARTUP = function () {
    //
    //  Add macros defined in the configuration
    //
    // TODO (VS): This needs to be moved and rewritten!
    //
    if (this.config.Macros) {
      var MACROS = this.config.Macros;
      for (var id in MACROS) {if (MACROS.hasOwnProperty(id)) {
        if (typeof(MACROS[id]) === "string") {TEXDEF.macros[id] = ['Macro',MACROS[id]]}
        else {TEXDEF.macros[id] = ["Macro"].concat(MACROS[id])}
        TEXDEF.macros[id].isUser = true;
      }}
    }
  };
  

  /************************************************************************/
  /*
   *   The TeX Parser
   */

  var NewParser = new TeXParser();
  var PARSE = MathJax.Object.Subclass();
  
  // ParseMethods.OLD_PARSER = PARSE;
  /************************************************************************/

  TEX.Augment({
    Stack: TEX.Stack, Parse: PARSE, Definitions: TEXDEF, Startup: STARTUP,
    
    config: {
      MAXMACROS: 10000,    // maximum number of macro substitutions per equation
      MAXBUFFER: 5*1024    // maximum size of TeX string to process
    },
    
    sourceMenuTitle: /*_(MathMenu)*/ ["TeXCommands","TeX Commands"],
    annotationEncoding: "application/x-tex",

    prefilterHooks: MathJax.Callback.Hooks(true),    // hooks to run before processing TeX
    postfilterHooks: MathJax.Callback.Hooks(true),   // hooks to run after processing TeX


    //
    //  Check if AMSmath extension must be loaded and push
    //    it on the extensions array, if needed
    //
    Config: function () {
      this.SUPER(arguments).Config.apply(this,arguments);
      if (this.config.equationNumbers.autoNumber !== "none") {
        if (!this.config.extensions) {this.config.extensions = []}
        this.config.extensions.push("AMSmath.js");
      }
    },

    //
    //  Convert TeX to ElementJax
    //
    Translate: function(script) {
      return NewTex.Translate(script, TEXDEF.configurations, STACKITEM);
    },

    //
    //  Produce an error and stop processing this equation
    //
    // TODO: Kept for extenions only.
    // Error: function (message) {
    //   throw new TexError(message);
    // },
    
    //
    //  Add a user-defined macro to the macro list
    //
    Macro: function (name,def,argn) {
      TEXDEF.macros[name] = ['Macro'].concat([].slice.call(arguments,1));
      TEXDEF.macros[name].isUser = true;
    }


  });

  TEX.loadComplete("jax.js");
  // MathJax.Ajax.loadComplete("TeX_Parser");
  
})(MathJax.InputJax.TeX);
