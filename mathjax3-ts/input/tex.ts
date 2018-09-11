/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview  Implements the TeX InputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractInputJax} from '../core/InputJax.js';
import {defaultOptions, userOptions, separateOptions, OptionList} from '../util/Options.js';
import {MathItem} from '../core/MathItem.js';
import {TEXCLASS, MmlNode, TextNode, AttributeList} from '../core/MmlTree/MmlNode.js';

import {FindTeX} from './tex/FindTeX.js';

import NodeUtil from './tex/NodeUtil.js';
import TexParser from './tex/TexParser.js';
import TexError from './tex/TexError.js';
import ParseOptions from './tex/ParseOptions.js';
import {TagsFactory} from './tex/Tags.js';
import {MmlMsubsup} from '../core/MmlTree/MmlNodes/msubsup.js';
import {MmlMunderover} from '../core/MmlTree/MmlNodes/munderover.js';
import {MmlMo} from '../core/MmlTree/MmlNodes/mo.js';
import {Configuration, ConfigurationHandler} from './tex/Configuration.js';
import {MapHandler, SubHandlers} from './tex/MapHandler.js';
import {NodeFactory} from './tex/NodeFactory.js';
// Import base as it is the default package loaded.
import './tex/base/BaseConfiguration.js';


/*****************************************************************/
/*
 *  Implements the TeX class (extends AbstractInputJax)
 */

/**
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class TeX<N, T, D> extends AbstractInputJax<N, T, D> {

  /**
   * Name of input jax.
   * @type {string}
   */
  public static NAME: string = 'TeX';

  /**
   * Default options for the jax.
   * @type {OptionList}
   */
  public static OPTIONS: OptionList = {
    ...AbstractInputJax.OPTIONS,
    FindTeX: null,
    packages: ['base'],
  };

  /**
   * The FindTeX instance used for locating TeX in strings
   */
  protected findTeX: FindTeX<N, T, D>;

  private configuration: Configuration;
  private parseOptions: ParseOptions;
  private latex: string;
  private mathNode: MmlNode;

  /**
   * Visitor to set stretchy attributes to false on <mo> elements, if they are
   * not used as delimiters. Also wraps non-stretchy infix delimiters into a
   * TeXAtom.
   * @param {MmlNode} node The node to rewrite.
   * @param {ParseOptions} options The parse options.
   */
  private static cleanStretchy(arg: {math: any, data: ParseOptions}) {
    let options = arg.data;
    for (let mo of options.getList('fixStretchy')) {
      if (NodeUtil.getProperty(mo, 'fixStretchy')) {
        let symbol = NodeUtil.getForm(mo);
        if (symbol && symbol[3] && symbol[3]['stretchy']) {
          NodeUtil.setAttribute(mo, 'stretchy', false);
        }
        const parent = mo.parent;
        if (!NodeUtil.getTexClass(mo) && (!symbol || !symbol[2])) {
          const texAtom = options.nodeFactory.create('node', 'TeXAtom', [mo], {});
          texAtom.parent = parent;
          parent.replaceChild(texAtom, mo);
        }
        NodeUtil.removeProperties(mo, 'fixStretchy');
      }
    }
    options.root.setInheritedAttributes({}, arg.math['display'], 0, false);
    options.root.setTeXclass(null);
  }


  /**
   * Visitor that removes superfluous attributes from nodes. I.e., if a node has
   * an attribute, which is also an inherited attribute it will be removed. This
   * is necessary as attributes are set bottom up in the parser.
   * @param {MmlNode} mml The node to clean.
   * @param {ParseOptions} options The parse options.
   */
  // TODO (DC): Move this maybe into setInheritedAttributes method?
  private static cleanAttributes(arg: {data: ParseOptions}) {
    let node = arg.data.root as MmlNode;
    node.walkTree((mml: MmlNode, d: any) => {
      let attribs = mml.attributes as any;
      let keys = Object.keys(attribs.attributes);
      for (let i = 0, key: string; key = keys[i]; i++) {
        if (attribs.attributes[key] === mml.attributes.getInherited(key)) {
          delete attribs.attributes[key];
        }
      }
    }, {});
  };


  /**
   * Combine adjacent <mo> elements that are relations (since MathML treats the
   * spacing very differently)
   * @param {MmlNode} mml The node in which to combine relations.
   * @param {ParseOptions} options The parse options.
   */
  private static combineRelations(arg: {data: ParseOptions}) {
    for (let mo of arg.data.getList('mo')) {
      if (mo.getProperty('relationsCombined') || !mo.parent ||
          (mo.parent && !NodeUtil.isType(mo.parent, 'mrow'))) {
        continue;
      }
      let mml = mo.parent;
      let m1: MmlNode, m2: MmlNode;
      let children = mml.childNodes as (MmlNode|TextNode)[];
      for (let i = 0, m = children.length; i < m; i++) {
        if (children[i]) {
          while (i + 1 < m && (m1 = children[i]) && (m2 = children[i + 1]) &&
                 NodeUtil.isType(m1, 'mo') && NodeUtil.isType(m2, 'mo') &&
                 NodeUtil.getTexClass(m1) === TEXCLASS.REL &&
                 NodeUtil.getTexClass(m2) === TEXCLASS.REL) {
            m2.setProperty('relationsCombined', true);
            if (NodeUtil.getProperty(m1, 'variantForm') ===
                NodeUtil.getProperty(m2, 'variantForm') &&
                NodeUtil.getAttribute(m1, 'mathvariant') ===
                NodeUtil.getAttribute(m2, 'mathvariant')) {
              // @test Shift Left, Less Equal
              NodeUtil.appendChildren(m1, NodeUtil.getChildren(m2));
              children.splice(i + 1, 1);
              m2.parent = null;
              m1.attributes.setInherited('form', (m1 as MmlMo).getForms()[0]);
              m--;
            } else {
              // TODO (VS): Find a test.
              NodeUtil.setAttribute(m1, 'rspace', '0pt');
              NodeUtil.setAttribute(m2, 'lspace', '0pt');
              i++;
            }
          }
        }
      }
    }
  };

  /**
   * Visitor that rewrites incomplete msubsup/munderover elements in the given
   * node into corresponding msub/sup/under/over nodes.
   * @param {MmlNode} node The node to rewrite.
   * @param {ParseOptions} options The parse options.
   */
  private static cleanSubSup(arg: {math: any, data: ParseOptions}) {
    let options = arg.data;
    if (options.error) {
      return;
    }
    let newNode;
    for (let mml of options.getList('msubsup') as MmlMsubsup[]) {
      const children = mml.childNodes;
      if (children[mml.sub] && children[mml.sup]) {
        continue;
      }
      const parent = mml.parent;
      newNode = (children[mml.sub] ?
                 options.nodeFactory.create('node', 'msub', [children[mml.base], children[mml.sub]], {}) :
                 options.nodeFactory.create('node', 'msup', [children[mml.base], children[mml.sup]], {}));
      NodeUtil.copyAttributes(mml, newNode);
      if (parent) {
        parent.replaceChild(newNode, mml);
      } else {
        options.root = newNode;
      }
    }
    for (let mml of options.getList('munderover') as MmlMunderover[]) {
      const children = mml.childNodes;
      const parent = mml.parent;
      if (children[mml.under] && children[mml.over]) {
        continue;
      }
      newNode = (children[mml.under] ?
                 options.nodeFactory.create('node', 'munder', [children[mml.base], children[mml.under]], {}) :
                 options.nodeFactory.create('node', 'mover', [children[mml.base], children[mml.over]], {}));
      NodeUtil.copyAttributes(mml, newNode);
      if (parent) {
        parent.replaceChild(newNode, mml);
      } else {
        options.root = newNode;
      }
    }
    options.root.setInheritedAttributes({}, arg.math['display'], 0, false);
  };


  /**
   * Initialises the configurations.
   * @param {string[]} packages Names of packages.
   * @return {Configuration} The configuration object.
   */
  private static configure(packages: string[]): Configuration {
    let configuration = Configuration.empty();
    // Combine package configurations
    for (let key of packages) {
      let conf = ConfigurationHandler.get(key);
      if (conf) {
        configuration.append(conf);
      }
    }
    configuration.append(Configuration.extension());
    return configuration;
  }



  /**
   * Initialises the parse options.
   * @param {Configuration} configuration A configuration.
   * @return {ParseOptions} The initialised parse options.
   */
  private static options(configuration: Configuration): ParseOptions {
    let options = new ParseOptions();
    options.handlers = new SubHandlers(configuration);
    options.itemFactory.configuration = options;
    // Add node factory methods from packages.
    options.nodeFactory.configuration = options;
    options.nodeFactory.setCreators(configuration.nodes);
    // Add stackitems from packages.
    options.itemFactory.addStackItems(configuration.items);
    // Set default options for parser from packages and for tags.
    defaultOptions(options.options, TagsFactory.OPTIONS, configuration.options);
    return options;
  };


  /**
   * Initialises the Tags factory. Add tagging structures from packages and set
   * tagging to given default.
   * @param {ParseOptions} options The parse options.
   * @param {Configuration} configuration The configuration.
   */
  private static tags(options: ParseOptions, configuration: Configuration) {
    TagsFactory.addTags(configuration.tags);
    TagsFactory.setDefault(options.options.tags);
    options.tags = TagsFactory.getDefault();
    options.tags.configuration = options;
  }

  /**
   * @override
   */
  constructor(options: OptionList = {}) {
    let packages = options['packages'] || TeX.OPTIONS['packages'];
    let configuration = TeX.configure(packages);
    let parseOptions = TeX.options(configuration);
    defaultOptions(parseOptions.options, {'packages': packages});
    let [tex, find, rest] = separateOptions(options, FindTeX.OPTIONS, parseOptions.options);
    super(tex);
    userOptions(parseOptions.options, options);
    TeX.tags(parseOptions, configuration);
    this.parseOptions = parseOptions;
    this.configuration = configuration;
    for (let pre of configuration.preprocessors) {
      typeof pre === 'function' ? this.preFilters.add(pre) :
        this.preFilters.add(pre[0], pre[1]);
    }
    for (let post of configuration.postprocessors) {
      typeof post === 'function' ? this.postFilters.add(post) :
        this.postFilters.add(post[0], post[1]);
    }
    this.postFilters.add(TeX.cleanSubSup, -4);
    this.postFilters.add(TeX.cleanStretchy, -3);
    this.postFilters.add(TeX.cleanAttributes, -2);
    this.postFilters.add(TeX.combineRelations, -1);
    this.findTeX = this.parseOptions.options['FindTeX'] || new FindTeX(find);
  }


  /**
   * @override
   */
  public compile(math: MathItem<N, T, D>): MmlNode {
    this.parseOptions.clear();
    let node: MmlNode;
    let parser: TexParser;
    let display = math.display;
    this.latex = math.math;
    this.executeFilters(this.preFilters, math, this.parseOptions);
    try {
      parser = new TexParser(this.latex,
                             {display: display, isInner: false},
                             this.parseOptions);
      node = parser.mml();
    } catch (err) {
      if (!(err instanceof TexError)) {
        throw err;
      }
      this.parseOptions.error = true;
      node = this.formatError(err);
    }
    this.mathNode = this.parseOptions.createNode('node', 'math', [node], {});
    this.parseOptions.root = this.mathNode;
    if (display) {
      NodeUtil.setAttribute(this.mathNode, 'display', 'block');
    }
    this.executeFilters(this.postFilters, math, this.parseOptions);
    this.mathNode = this.parseOptions.root;
    return this.mathNode;
  };


  /**
   * @override
   */
  public findMath(strings: string[]) {
    return this.findTeX.findMath(strings);
  }


  /**
   * Wraps an error into a node for output.
   * @param {TeXError} err The TexError.
   * @return {Node} The merror node.
   */
  private formatError(err: TexError): MmlNode {
    let message = err.message.replace(/\n.*/, '');
    return this.parseOptions.createNode('error', message);
  };

}
