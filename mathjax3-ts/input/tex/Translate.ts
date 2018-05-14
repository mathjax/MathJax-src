/*************************************************************
 *
 *  MathJax/jax/input/TeX/Translate.js
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

// import {TreeHelper} from './TreeHelper.js';
// import {TEXCLASS, MmlNode, TextNode} from '../../core/MmlTree/MmlNode.js';
// import TexParser from './TexParser.js';
// import TexError from './TexError.js';
// import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
// import ParseOptions from './ParseOptions.js';
// import {TagsFactory} from './Tags.js';
// import {MmlMsubsup} from '../../core/MmlTree/MmlNodes/msubsup.js';
// import {MmlMunderover} from '../../core/MmlTree/MmlNodes/munderover.js';
// import StackItemFactory from './StackItemFactory.js';
// import {Configuration, ConfigurationHandler} from './Configuration.js';
// import {SubHandlers} from './MapHandler.js';
// import './BaseConfiguration.js';
// import './AmsConfiguration.js';

// export namespace NewTex {

//   export type Script = {type: string, innerText: string};

//   export function configure(packages: string[], settings: {[key: string]: string|boolean}): ParseOptions {
//     const DefaultConfig = new Configuration('default', {}, {}, {}, {}, {});
//     for (let key of packages) {
//       let conf = ConfigurationHandler.getInstance().get(key);
//       if (conf) {
//         DefaultConfig.append(conf);
//       }
//     }
//     let options = new ParseOptions();
//     options.handlers = new SubHandlers(DefaultConfig);
//     options.itemFactory = new StackItemFactory();
//     options.itemFactory.configuration = options;
//     options.itemFactory.addStackItems(DefaultConfig.items);
//     TagsFactory.addTags(DefaultConfig.tags);
//     options.tags = TagsFactory.getDefault();
//     options.tags.configuration = options;
//     for (const key of Object.keys(DefaultConfig.options)) {
//       options.options.set(key, DefaultConfig.options[key]);
//     }
//     return options;
//   }


//   export function Compile(tex: string, display: boolean, packages: string[],
//                           settings: {[key: string]: string|boolean}): MmlNode {
//     let script = {
//       type: 'math/tex' + (display ? '; mode=display' : ''),
//       innerText: tex,
//     };
//     let options = configure(packages, settings);
//     let node = Translate(script, options);
//     node.setInheritedAttributes({}, false, 0, false);
//     node.setTeXclass(null);
//     // Cleanup:
//     cleanAttributes(node);
//     combineRelations(node);
//     return node;
//   }

//   let formatError = function (err: TexError, math: string, display: boolean, script: Script) {
//     let message = err.message.replace(/\n.*/, '');
//     return TreeHelper.createError(message);
//   };


//   export function Translate(
//     script: Script, configurations: ParseOptions): MmlNode {
//     let mml: MmlNode;
//     let parser: TexParser;
//     let math = script.innerText;
//     let display = script.type.replace(/\n/g, ' ').
//       match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null;
//     try {
//       parser = new TexParser(math, {display: display, isInner: false}, configurations);
//       mml = parser.mml();
//     } catch (err) {
//       if (!(err instanceof TexError)) {
//         throw err;
//       }
//       mml = formatError(err, math, display, script);
//     }
//     mml = cleanSubSup(mml);
//     let mathNode = TreeHelper.createNode('math', [mml], {});
//     let root = TreeHelper.getRoot(mathNode);
//     if (display) {
//       TreeHelper.setAttribute(root, 'display', 'block');
//     }
//     if (!parser) {
//       // In case we have a caught error, parser will be undefined.
//       return mathNode;
//     }
//     mathNode.setInheritedAttributes({}, false, 0, false);
//     cleanStretchy(mathNode);
//     return mathNode;
//   };

  
// }
