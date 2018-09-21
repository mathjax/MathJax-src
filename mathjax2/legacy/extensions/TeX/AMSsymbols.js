/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  MathJax/extensions/TeX/AMSsymbols.js
 *  
 *  Implements macros for accessing the AMS symbol fonts.
 *  
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2009-2016 The MathJax Consortium
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

let sm = require('../../../../mathjax3/input/tex/SymbolMap.js');
let tc = require('../../../../mathjax3/input/tex/TexConstants.js');
let BaseMethods = require('../../../../mathjax3/input/tex/BaseMethods.js').default;


MathJax.Extension["TeX/AMSsymbols"] = {
  version: "2.7.0"
};

MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
  var MML = MathJax.ElementJax.mml,
      TEXDEF = MathJax.InputJax.TeX.Definitions,
      PARSE = MathJax.InputJax.TeX.Parse
      ;

  var REL = MML.mo.OPTYPES.REL;

  MathJax.Hub.Insert(MML.mo.prototype,{
    OPTABLE: {
      infix: {
        '\u2322': REL,  // smallfrown
        '\u2323': REL,  // smallsmile
        '\u25B3': REL,  // vartriangle
        '\uE006': REL,  // nshortmid
        '\uE007': REL,  // nshortparallel
        '\uE00C': REL,  // lvertneqq
        '\uE00D': REL,  // gvertneqq
        '\uE00E': REL,  // ngeqq
        '\uE00F': REL,  // ngeqslant
        '\uE010': REL,  // nleqslant
        '\uE011': REL,  // nleqq
        '\uE016': REL,  // nsubseteqq
        '\uE017': REL,  // varsubsetneqq
        '\uE018': REL,  // nsupseteqq
        '\uE019': REL,  // varsupsetneqq
        '\uE01A': REL,  // varsubsetneq
        '\uE01B': REL,  // varsupsetneq
        '\uE04B': REL,  // npreceq
        '\uE04F': REL   // nsucceq
      }
    }
  });

  MathJax.Hub.Startup.signal.Post("TeX AMSsymbols Ready");

});

MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/AMSsymbols.js");
