/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview Class for generating tags, references, etc.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import TexParser from './TexParser.js';
import {TreeHelper} from './TreeHelper.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {EnvList} from './StackItem.js';

// For the time being here is a configuration object for Tags, equation numbers
// etc.  This should move somewhere else, once we have decided how to really
// deal with them.
//
export let TagConfig = new Map<string, string|boolean>([
  //
  //  This specifies the side on which \tag{} macros will place the tags.
  //  Set to 'left' to place on the left-hand side.
  //
  ['TagSide', 'right'],

  //
  //  This is the amound of indentation (from right or left) for the tags.
  //
  ['TagIndent', '0.8em'],

  //
  //  This is the width to use for the multline environment
  //
  ['MultLineWidth', '85%'],

  // 'AMS' for standard AMS environment numbering,
  //  or 'all' to number all displayed equations
  // This is now done in classes!
  // ['autoNumber', 'none'],

  // make element ID's use \label name rather than equation number
  // MJ puts in an equation prefix: mjx-eqn
  // When true it uses the label name XXX as mjx-eqn-XXX
  // If false it uses the actual number N that is displayed: mjx-eqn-N
  ['useLabelIds', true],

  ['refUpdate', false]
]);


/**
 *  Simple class for label objects.
 */
export class Label {

  /**
   * @constructor
   * @param {string=} tag The tag that's displayed.
   * @param {string=} id The id that serves as reference.
   */
  constructor(public tag: string = '???', public id: string = '') {}
}


/**
 * A simple class for keeping track of tag information.
 */
export class TagInfo {

  /**
   * @constructor
   * @param {string} env The environment name (e.g., align).
   * @param {boolean} taggable Environment supports tags (e.g., align* does, but
   *     spit does not.)
   * @param {boolean} defaultTags Environment is tagged by default (e.g., align
   *     is, but align* is not).
   * @param {string} tag The tag name (e.g., 1).
   * @param {string} tagId The unique id for that tag (e.g., mjx-eqn-1).
   * @param {string} tagFormat The formatted tag (e.g., "(1)").
   * @param {boolean} noTag A no tagging command has been set (e.g., \notag,
   *     \nonumber).
   * @param {string} labelId The label referring to the tag.
   */
  constructor(readonly env: string = '',
              readonly taggable: boolean = false,
              readonly defaultTags: boolean = false,
              public tag: string = null,
              public tagId: string = '',
              public tagFormat: string = '',
              public noTag: boolean = false,
              public labelId: string = '') {}

}


export interface Tags {

  // TODO: The following are all public, but should be protected or private with
  //       set/getters.
  /**
   * Current equation number.
   * @type {number}
   */
  counter: number;

  /**
   * Current starting equation number (for when equation is restarted).
   * @type {number}
   */
  offset: number;

  /**
   * IDs used in this equation.
   * @type {Object.<boolean>}
   */
  ids: {[key: string]: boolean};

  /**
   * IDs used in previous equations.
   * @type {Object.<boolean>}
   */
  allIds: {[key: string]: boolean};

  /**
   * Labels in the current equation.
   * @type {Object.<Label>}
   */
  labels: {[key: string]: Label};

  /**
   * Labels in previous equations.
   * @type {Object.<Label>}
   */
  allLabels: {[key: string]: Label};

  /**
   * Nodes with unresolved references.
   * @type {MmlNode[]}
   */
  // Not sure how to handle this at the moment.
  refs: MmlNode[]; // array of nodes with unresolved references

  // DONE with properties!
  
  /**
   * How to format numbers in tags.
   * @param {number} n The tag number.
   * @return {string} The formatted number.
   */
  formatNumber(n: number): string;


  /**
   * How to format tags.
   * @param {string} tag The tag string.
   * @return {string} The formatted numbered tag.
   */
  formatTag(tag: string): string;


  /**
   * How to format ids for labelling equations.
   * @param {string} id The unique part of the id (e.g., label or number).
   * @return {string} The formatted id.
   */
  formatId(id: string): string;


  /**
   * How to format URLs for references.
   * @param {string} id The reference id.
   * @param {string} base The base URL in the reference.
   * @return {}
   */
  formatUrl(id: string, base: string): string;

  autoTag(): void;

  getTag(): MmlNode | void;

  clearTag(): void;

  /**
   * Resets the tag structure.
   * @param {number} offset A new offset value to start counting ids from.
   * @param {boolean} keep If sets, keep all previous labels and ids at reset.
   */
  reset(offset: number, keep: boolean): void;

  finalize(node: MmlNode, env: EnvList): MmlNode;

  start(env: string, taggable: boolean, defaultTags: boolean): void;
  end(): void;
  tag(tag: string, format: boolean): void;
  notag(): void;
  label: string;
  env: string;
  
  currentTag: TagInfo;
}


export class AbstractTags implements Tags {

  // TODO: The following are all public, but should be protected or private with
  //       set/getters.
  /**
   * Current equation number.
   * @type {number}
   */
  public counter: number = 0;

  /**
   * Current starting equation number (for when equation is restarted).
   * @type {number}
   */
  public offset: number = 0;

  /**
   * IDs used in this equation.
   * @type {Object.<boolean>}
   */
  public ids: {[key: string]: boolean} = {};

  /**
   * IDs used in previous equations.
   * @type {Object.<boolean>}
   */
  public allIds: {[key: string]: boolean} = {};

  /**
   * Labels in the current equation.
   * @type {Object.<boolean>}
   */
  public labels: {[key: string]: Label} = {};

  /**
   * Labels in previous equations.
   * @type {Object.<boolean>}
   */
  public allLabels: {[key: string]: Label} = {};

  /**
   * Nodes with unresolved references.
   * @type {MmlNode[]}
   */
  // Not sure how to handle this at the moment.
  public refs: MmlNode[] = new Array(); // array of nodes with unresolved references

  public currentTag: TagInfo = new TagInfo();


  /**
   * Chronology of all previous tags, in case we need to look something up in
   * the finalize method.
   * @type {TagInfo[]}
   */
  protected history: TagInfo[] = [];

  private stack: TagInfo[] = [];


  public start(env: string, taggable: boolean, defaultTags: boolean) {
    if (this.currentTag) {
      this.stack.push(this.currentTag);
    }
    this.currentTag = new TagInfo(env, taggable, defaultTags);
  }

  public get env() {
    return this.currentTag.env;
  }

  public end() {
    this.history.push(this.currentTag);
    this.currentTag = this.stack.pop();
  }

  public tag(tag: string, noFormat: boolean) {
    this.currentTag.tag = tag;
    this.currentTag.tagFormat = noFormat ? tag : this.formatTag(tag);
    this.currentTag.noTag = false;
  }

  public notag() {
    this.tag('', true);
    this.currentTag.noTag = true;
  }

  protected get noTag(): boolean {
    return this.currentTag.noTag;
  }

  public set label(label: string) {
    this.currentTag.labelId = label;
  }

  public get label() {
    return this.currentTag.labelId;
  }

  /**
   * @override
   */
  public formatNumber(n: number) {
    return n.toString();
  }

  /**
   * @override
   */
  public formatTag(tag: string) {
    return '(' + tag + ')';
  }

  /**
   * @override
   */
  public formatId(id: string) {
    return 'mjx-eqn-' + id.replace(/\s/g, '_');
  }

  /**
   * @override
   */
  public formatUrl(id: string, base: string) {
    return base + '#' + encodeURIComponent(id);
  }

  // Tag handling functions.
  /**
   *  Increment equation number and form tag mtd element
   */
  public autoTag() {
    if (this.currentTag.tag == null) {
      this.counter++;
      this.tag(this.counter.toString(), false);
    }
  }


  /**
   * Clears tagging information.
   */
  public clearTag() {
      this.label = '';
      this.tag(null, true);
  }


  private makeId() {
    // this.currentTag.tagId = this.formatId(this.label || this.currentTag.tag);
    this.currentTag.tagId = this.formatId(
      TagConfig.get('useLabelIds') ?
        (this.label || this.currentTag.tag) : this.currentTag.tag);
  }

  private makeTag() {
    this.makeId();
    if (this.label) {
      this.labels[this.label] = new Label(this.currentTag.tag, this.currentTag.tagId);
    }
    let mml = new TexParser('\\text{' + this.currentTag.tagFormat + '}', {}).mml();
    return TreeHelper.createNode('mtd', [mml], {id: this.currentTag.tagId});
  }
  
  /**
   *  Get the tag and record the label, if any
   */
  public getTag(force: boolean = false) {
    if (force) {
      this.autoTag();
      return this.makeTag();
    }
    const ct = this.currentTag;
    if (ct.taggable && !ct.noTag) {
      if (ct.defaultTags) {
        this.autoTag();
      } else {
        return null;
      }
      return this.makeTag();
    }
    return null;
  // this.tag = global.tag;
    // global.tagged = true;
    // if (global.label) {
    //   if (CONFIG.useLabelIds) {tag.id = this.formatId(global.label)}
    //   AMS.eqlabels[global.label] = {tag:global.tagID, id:tag.id};
    // }
    // //
    // //  Check for repeated ID's (either in the document or as
    // //  a previous tag) and find a unique related one. (#240)
    // //
    // //  TODO: find tests and sort this out!
    // //
    // // if (AMS.IDs[tag.id] || AMS.eqIDs[tag.id]) {
    // //   var i = 0, ID;
    // //   do {i++; ID = tag.id+"_"+i}
    // //   while (document.getElementById(ID) || AMS.IDs[ID] || AMS.eqIDs[ID]);
    // //   tag.id = ID; if (global.label) {AMS.eqlabels[global.label].id = ID}
    // // }
    // AMS.eqIDs[tag.id] = 1;
    // this.clearTag();
    // return tag;

    // return global.tag as MmlNode;
  }

  public reset(n: number, keepLabels: boolean) {
    this.offset = (n || 0);
    this.history = [];
    if (!keepLabels) {
      this.labels = {};
      this.ids = {};
    }
  }

  public finalize(node: MmlNode, env: EnvList): MmlNode {
    return node;
  }
  
};


export class NoTags extends AbstractTags {

  /**
   * @override
   */
  public autoTag() {}

  /**
   * @override
   */
  public getTag() {
    return !this.currentTag.tag ? null : super.getTag();
  }

}

export class AmsTags extends AbstractTags { }


/**
 * Tags every display formula. Exceptions are:
 *
 * -- Star environments are not tagged. (really?)
 * -- If a regular environment has at least one tag, it is not explicitly tagged
 *     anymore.
 * 
 * @constructor
 * @extends {AbstractTags}
 */
export class AllTags extends AbstractTags {

  /**
   * @override
   */
  public finalize(node: MmlNode, env: EnvList) {
    if (!env.display || this.history.find(
      function(x: TagInfo) { return x.taggable; })) {
      return node;
    }
    let tag = this.getTag(true);
    return TagsFactory.enTag(node, tag);
  }

}


/**
 * Class interface for factory.
 * @interface
 */
export interface TagsClass {
  new (): Tags;
}


// Factory needs functionality to create one Tags object from an existing ones
// to hand over label values, equation ids etc.
//
// 'AMS' for standard AMS numbering,
//  or 'all' for all displayed equations
export namespace TagsFactory {

  let tagsMapping = new Map<string, TagsClass>([
    ['default', AmsTags],
    ['none', NoTags],
    ['all', AllTags],
    ['AMS', AmsTags]
  ]);


  export let add = function(name: string, constr: TagsClass) {
    tagsMapping.set(name, constr);
  };

  export let create = function(name: string): Tags {
    let constr = tagsMapping.get(name) || tagsMapping.get('default');
    return new constr();
  };

  export let setDefault = function(name: string) {
    tagsMapping.set('default', tagsMapping.get(name));
  };

  export let getDefault = function() {
    DefaultTags = TagsFactory.create('default');
  };

  export let enTag = function(node: MmlNode, tag: MmlNode): MmlNode {
    let cell = TreeHelper.createNode('mtd', [node], {});
    let row = TreeHelper.createNode('mlabeledtr', [tag, cell], {});
    let table = TreeHelper.createNode('mtable', [row], {
      side: TagConfig.get('TagSide'),
      minlabelspacing: TagConfig.get('TagIndent'),
      displaystyle: true
    });
    return table;
  };

}

export let DefaultTags = TagsFactory.create('default');
