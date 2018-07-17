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
import {separateOptions, OptionList} from '../util/Options.js';
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
import {SubHandlers} from './tex/MapHandler.js';
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
    settings: {
      //  This specifies the side on which \tag{} macros will place the tags.
      //  Set to 'left' to place on the left-hand side.
      TagSide: 'right',
      //  This is the amound of indentation (from right or left) for the tags.
      TagIndent: '0.8em',
      //  This is the width to use for the multline environment
      MultLineWidth: '85%',
      // make element ID's use \label name rather than equation number
      // MJ puts in an equation prefix: mjx-eqn
      // When true it uses the label name XXX as mjx-eqn-XXX
      // If false it uses the actual number N that is displayed: mjx-eqn-N
      useLabelIds: true,
      refUpdate: false
    },
    // Tagging style, used to be autonumber in v2.
    tags: 'none'
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
   * Wraps an error into a node for output.
   * @param {TeXError} err The TexError.
   * @return {Node} The merror node.
   */
  private formatError(err: TexError): MmlNode {
    let message = err.message.replace(/\n.*/, '');
    return this.parseOptions.createNode('error', message);
  };


  /**
   * Visitor to set stretchy attributes to false on <mo> elements, if they are
   * not used as delimiters. Also wraps non-stretchy infix delimiters into a
   * TeXAtom.
   * @param {MmlNode} node The node to rewrite.
   * @param {ParseOptions} options The parse options.
   */
  private static cleanStretchy(node: MmlNode, options: ParseOptions) {
    node.walkTree((mo: MmlNode, d: any) => {
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
    }, {});
  }


  /**
   * Visitor that removes superfluous attributes from nodes. I.e., if a node has
   * an attribute, which is also an inherited attribute it will be removed. This
   * is necessary as attributes are set bottom up in the parser.
   * @param {MmlNode} mml The node to clean.
   * @param {ParseOptions} options The parse options.
   */
  // TODO (DC): Move this maybe into setInheritedAttributes method?
  private static cleanAttributes(mml: MmlNode, options: ParseOptions) {
      let attribs = mml.attributes as any;
      let keys = Object.keys(attribs.attributes);
      for (let i = 0, key: string; key = keys[i]; i++) {
        if (attribs.attributes[key] === mml.attributes.getInherited(key)) {
          delete attribs.attributes[key];
        }
      }
  };


  /**
   * Combine adjacent <mo> elements that are relations (since MathML treats the
   * spacing very differently)
   * @param {MmlNode} mml The node in which to combine relations.
   * @param {ParseOptions} options The parse options.
   */
  private static combineRelations(mml: MmlNode, options: ParseOptions) {
    let m1: MmlNode, m2: MmlNode;
    let children = NodeUtil.getChildren(mml);
    for (let i = 0, m = children.length; i < m; i++) {
      if (children[i]) {
        if (NodeUtil.isType(mml, 'mrow')) {
          while (i + 1 < m && (m1 = children[i]) && (m2 = children[i + 1]) &&
                 NodeUtil.isType(m1, 'mo') && NodeUtil.isType(m2, 'mo') &&
                 NodeUtil.getTexClass(m1) === TEXCLASS.REL &&
                 NodeUtil.getTexClass(m2) === TEXCLASS.REL) {
            if (NodeUtil.getProperty(m1, 'variantForm') ===
                NodeUtil.getProperty(m2, 'variantForm') &&
                NodeUtil.getAttribute(m1, 'mathvariant') ===
                NodeUtil.getAttribute(m2, 'mathvariant')) {
              // @test Shift Left, Less Equal
              NodeUtil.appendChildren(m1, NodeUtil.getChildren(m2));
              children.splice(i + 1, 1);
              m1.attributes.setInherited('form', (m1 as MmlMo).getForms()[0]);
              m--;
            } else {
              // TODO (VS): Find a tests.
              NodeUtil.setAttribute(m1, 'rspace', '0pt');
              NodeUtil.setAttribute(m2, 'lspace', '0pt');
              i++;
            }
          }
        }
      }
    }
  }


  /**
   * Visitor that rewrites incomplete msubsup/munderover elements in the given
   * node into corresponding msub/sup/under/over nodes.
   * @param {MmlNode} node The node to rewrite.
   * @param {ParseOptions} options The parse options.
   */
  // TODO (VS): reduce some of the casting.
  private static cleanSubSup(node: MmlNode, options: ParseOptions) {
    let rewrite: MmlNode[] = [];
    node.walkTree((n, d) => {
      const children = n.childNodes;
      if ((n.isKind('msubsup') && (!children[(n as MmlMsubsup).sub] ||
                                   !children[(n as MmlMsubsup).sup])) ||
          (n.isKind('munderover') && (!children[(n as MmlMunderover).under] ||
                                      !children[(n as MmlMunderover).over]))) {
        d.unshift(n);
      }
    }, rewrite);
    for (const n of rewrite) {
      const children = n.childNodes as (MmlNode|TextNode)[];
      const parent = n.parent;
      let ms, newNode;
      if (n.isKind('msubsup')) {
        ms = n as MmlMsubsup;
        newNode = (children[ms.sub] ?
                   options.nodeFactory.create('node', 'msub', [children[ms.base], children[ms.sub]], {}) :
                   options.nodeFactory.create('node', 'msup', [children[ms.base], children[ms.sup]], {}));
      } else {
        ms = n as MmlMunderover;
        newNode = (children[ms.under] ?
                   options.nodeFactory.create('node', 'munder', [children[ms.base], children[ms.under]], {}) :
                   options.nodeFactory.create('node', 'mover', [children[ms.base], children[ms.over]], {}));
      }
      NodeUtil.copyAttributes(n, newNode);
      // This is only necessary if applied to an incomplete node, where
      // msubsup/underover can be top level.
      if (parent) {
        parent.replaceChild(newNode, n);
      } else {
        node = newNode;
      }
    }
  };


  /**
   * @override
   */
  constructor(options: OptionList) {
    let [tex, find] = separateOptions(options, FindTeX.OPTIONS);
    super(tex);
    this.findTeX = this.options['FindTeX'] || new FindTeX(find);
  }

  /**
   * @override
   */
  public compile(math: MathItem<N, T, D>): MmlNode {
    this.parseOptions = this.configure();
    let node: MmlNode;
    let parser: TexParser;
    let display = math.display;
    this.latex = math.math;
    this.runPreprocessors();
    try {
      parser = new TexParser(this.latex,
                             {display: display, isInner: false},
                             this.parseOptions);
      node = parser.mml();
    } catch (err) {
      if (!(err instanceof TexError)) {
        throw err;
      }
      node = this.formatError(err);
    }
    this.mathNode = this.parseOptions.createNode('node', 'math', [node], {});
    if (display) {
      NodeUtil.setAttribute(this.mathNode, 'display', 'block');
    }
    TeX.cleanSubSup(this.mathNode, this.parseOptions);
    this.mathNode.setInheritedAttributes({}, display, 0, false);
    TeX.cleanStretchy(this.mathNode, this.parseOptions);
    this.mathNode.setInheritedAttributes({}, display, 0, false);
    this.mathNode.setTeXclass(null);
    // Run Postprocessors: MmlNode => MmlNode
    this.runPostprocessors();
    return this.mathNode;
  };


  /**
   * @override
   */
  public findMath(strings: string[]) {
    return this.findTeX.findMath(strings);
  }


  /**
   * @return {ParseOptions} Configures the parser.
   */
  private configure(): ParseOptions {
    this.configuration = Configuration.create(
      'default', {postprocessors: [TeX.cleanAttributes, TeX.combineRelations]});
    // Combine package configurations
    for (let key of this.options['packages']) {
      let conf = ConfigurationHandler.getInstance().get(key);
      if (conf) {
        this.configuration.append(conf);
      }
    }
    let options = new ParseOptions();
    options.handlers = new SubHandlers(this.configuration);
    options.itemFactory.configuration = options;
    // Add node factory methods from packages.
    options.nodeFactory.configuration = options;
    options.nodeFactory.setCreators(this.configuration.nodes);
    // Add stackitems from packages.
    options.itemFactory.addStackItems(this.configuration.items);
    // Add tagging structures from packages and set tagging to given default.
    TagsFactory.addTags(this.configuration.tags);
    TagsFactory.setDefault(this.options.tags);
    options.tags = TagsFactory.getDefault();
    options.tags.configuration = options;
    // Set other options for parser from package configurations.
    for (const key of Object.keys(this.configuration.options)) {
      options.options.set(key, this.configuration.options[key]);
    } // From this run's configuration.
    let settings = this.options['settings'];
    for (const key of Object.keys(settings)) {
      options.options.set(key, settings[key]);
    }
    return options;
  }

  private runPreprocessors() {
    for (let preprocessor of this.configuration.preprocessors) {
      this.latex = preprocessor(this.latex, this.parseOptions);
    }
  }

  private runPostprocessors() {
    this.mathNode.walkTree((mml: MmlNode, d: any) => {
      for (let postprocessor of this.configuration.postprocessors) {
        postprocessor(mml, this.parseOptions);
      }
    }, {});
  }

}
