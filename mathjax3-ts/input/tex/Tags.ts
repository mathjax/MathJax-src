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


// Aux classes
export class Label {

  /**
   * @constructor
   * @param {string=} tag The tag that's displayed.
   * @param {string=} id The id that serves as reference.
   */
  constructor(public tag: string = '???', public id: string = '') {}
}


export class TagInfo {

  // ////// Handling current labels/tags.
  // // TODO: Clean that up!
  // labelId: string;
  // tagId: string;
  // tagNode: MmlNode|void;
  // ///////

  // // If the current environment allows tags by default.
  // defaultTag: boolean;
  // // If currently a tag is set explicitly. This is a switch for the tag/notag
  // // commands.
  // setTag: boolean;
  // //env: string;
 
  // envname, is taggable (also *), requires default tags (non-*),
  // tagId, noTag (last element was a \notag), labelId
  constructor(readonly env: string = '',
              readonly taggable: boolean = false,
              readonly defaultTags: boolean = false,
              public tagId: string = '',
              public tag: string = '',
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
   * Use label names to generate reference ids.
   * @type {boolean}
   */
  useLabelIds: boolean;

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

  ////// Handling current labels/tags.
  // TODO: Clean that up!
  // labelId: string;
  // tagId: string;
  // tagNode: MmlNode|void;
  // ///////

  // // If the current environment allows tags by default.
  // defaultTag: boolean;
  // // If currently a tag is set explicitly. This is a switch for the tag/notag
  // // commands.
  // setTag: boolean;
  //env: string;


  /**
   * Resets the tag structure.
   * @param {number} offset A new offset value to start counting ids from.
   * @param {boolean} keep If sets, keep all previous labels and ids at reset.
   */
  reset(offset: number, keep: boolean): void;


  start(env: string, taggable: boolean, defaultTags: boolean): void;
  end(): void;
  tag(tag: string, format: boolean): void;
  notag(): void;
  label: string;
  env: string;
  
  currentTag: TagInfo;
}


export class AbstractTags implements Tags {
  // 'AMS' for standard AMS numbering,
  //  or 'all' for all displayed equations
  // VS: Should this be here?
  // This will be folded into classes!
  // autoNumber: 'none';
  //

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
   * Use label names to generate reference ids.
   * @type {boolean}
   */
  public useLabelIds: boolean =  false;

  /**
   * Nodes with unresolved references.
   * @type {MmlNode[]}
   */
  // Not sure how to handle this at the moment.
  public refs: MmlNode[] = new Array(); // array of nodes with unresolved references


  ////// Handling current labels/tags.
  // TODO: Clean that up!
  // public labelId: string = '';
  // public tagId: string = '';
  // public tagNode: MmlNode|void = null;
  // public defaultTag: boolean = false;
  // public setTag: boolean = false;
  ///////

  public currentTag: TagInfo = null;

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
    let tag = this.stack.pop();
    this.currentTag = tag || null;
  }

  public tag(tag: string, noFormat: boolean) {
    // TODO: Here goes the uselabelid option!
    this.currentTag.tagId = this.formatId(this.label || tag);
    this.currentTag.tag = noFormat ? tag : this.formatTag(tag);
    this.currentTag.noTag = false;
  }

  // protected get tagId(): string {
  //   return this.currentTag.tagId;
  // }

  
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
    this.counter++;
    this.tag(this.counter.toString(), false);
  }


  /**
   * Clears tagging information.
   */
  public clearTag() {
    this.label = '';
    this.tag('', true);
  }


  protected makeTag() {
    let mml = new TexParser('\\text{' + this.currentTag.tag + '}', {}).mml();
    return TreeHelper.createNode('mtd', [mml], {id: this.currentTag.tagId});
  }
  
  /**
   *  Get the tag and record the label, if any
   */
  public getTag() {
    console.log('Getting the tag!');
    const ct = this.currentTag;
    if (ct.taggable && !ct.noTag) {
      if (!ct.tag) {
        if (ct.defaultTags) {
          console.log('IN default tags.');
          this.autoTag();
        } else {
          return null;
        }
      }
      return this.makeTag();
    }
    return null;
    // if (this.defaultTag) {
    //   if (!this.tagNode) {
    //     this.autoTag();
    //   }
    //   return this.tagNode;
    // }
    // return null;

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
    if (!keepLabels) {
      this.labels = {};
      this.ids = {};
    }
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

export class AmsTags extends AbstractTags {

  constructor() {
    super();
  }

}

export interface TagsClass {
  new (): Tags;
}


// Factory needs functionality to create one Tags object from an existing one.
// Currently it returns fixed objects. I.e., they never change!
export namespace TagsFactory {

  let tagsMapping = new Map<string, TagsClass>([
    ['default', AmsTags],
    ['none', NoTags],
    // ['all', new AllTags()],
    ['AMS', AmsTags]
  ]);


  export let add = function(name: string, constr: TagsClass) {
    tagsMapping.set(name, constr);
  };

  export let create = function(name: string): Tags {
    let constr = tagsMapping.get(name) || tagsMapping.get('default');
    return new constr();
  };

  export let setDefault = function(name?: string) {
    DefaultTags = create(name || 'default');
  };

}

export let DefaultTags = TagsFactory.create('default');
