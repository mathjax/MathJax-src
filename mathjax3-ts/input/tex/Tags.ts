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
  ['autoNumber', 'none'],

  // make element ID's use \label name rather than equation number
  // MJ puts in an equation prefix: mjx-eqn
  // When true it uses the label name XXX as mjx-eqn-XXX
  // If false it uses the actual number N that is displayed: mjx-eqn-N
  ['useLabelIds', true]
]);


// TODO: This is temporary until we find a new place and a better structure.
//
let equationNumbers = {
  number: 0,        // current equation number
  startNumber: 0,   // current starting equation number (for when equation is restarted)
  IDs: {},          // IDs used in previous equations
  eqIDs: {},        // IDs used in this equation
  labels: {},       // the set of labels
  eqlabels: {},     // labels in the current equation
  refs: new Array() // array of jax with unresolved references
  // I think we should get rid of the last one!
};

export interface Tags {

  /**
   * How to format numbers in tags.
   * @param {number} n The tag number.
   * @return {string} The formatted number.
   */
  number(n: number): string;


  /**
   * How to format tags.
   * @param {number} n The tag number.
   * @return {string} The formatted numbered tag.
   */
  tag(n: number): string;


  /**
   * How to format ids for labelling equations.
   * @param {number} n The label number.
   * @return {string} The formatted label.
   */
  id(n: number): string;


  /**
   * How to format URLs for references.
   * @param {string} id The reference id.
   * @param {string} base The base URL in the reference.
   * @return {}
   */
  url(id: string, base: string): string;

}


export class AbstractTags implements Tags {
  // 'AMS' for standard AMS numbering,
  //  or 'all' for all displayed equations
  // VS: Should this be here?
  autoNumber: 'none';
  counter = 0;
  allTags: string[] = [];

  /**
   * @override
   */
  public number(n: number) {
    return n.toString();
  }
  
  /**
   * @override
   */
  public tag(n: number) {
    return '(' + n + ')';
  }

  /**
   * @override
   */
  public id(n: number) {
    return 'mjx-eqn-' + String(n).replace(/\s/g, '_');
  }

  /**
   * @override
   */
  public url(id: string, base: string) {
    return base + '#' + encodeURIComponent(id);
  }

  useLabelIds =  true;
  //
  //  Clear the equation numbers and labels
  //
  public resetEquationNumbers(n: number, keepLabels: boolean) {
    equationNumbers.startNumber = (n || 0);
    if (!keepLabels) {
      equationNumbers.labels = {};
      equationNumbers.IDs = {};
    }
  }

  // Handling current labels/tags.
  public label: string = '';
  public tagId: string = '';
  public tagNode: MmlNode = null;
  
  
  // Tag handling functions.
  /**
   *  Increment equation number and form tag mtd element
   */
  public autoTag(global: any) {
    if (!global.notag) {
      this.counter++;
      global.tagID = this.number(this.counter);
      let mml = new TexParser('\\text{' + this.tag(global.tagID) + '}', {}).mml();
      global.tag = TreeHelper.createNode('mtd', [mml], {id: this.id(global.tagID)});
    }
  }

  public clearTag() {
    this.label = '';
    this.tagId = '';
    this.tagNode = null;
  }
  
    /**
     *  Get the tag and record the label, if any
     */
  public getTag(global: any) {
    this.tag = global.tag;
    global.tagged = true;
    if (global.label) {
      if (CONFIG.useLabelIds) {tag.id = CONFIG.formatID(global.label)}
      console.log('TagID');
      console.log(tag.id);
      AMS.eqlabels[global.label] = {tag:global.tagID, id:tag.id};        
    }
    //
    //  Check for repeated ID's (either in the document or as
    //  a previous tag) and find a unique related one. (#240)
    //
    if (document.getElementById(tag.id) || AMS.IDs[tag.id] || AMS.eqIDs[tag.id]) {
      var i = 0, ID;
      do {i++; ID = tag.id+"_"+i}
      while (document.getElementById(ID) || AMS.IDs[ID] || AMS.eqIDs[ID]);
      tag.id = ID; if (global.label) {AMS.eqlabels[global.label].id = ID}
    }
    AMS.eqIDs[tag.id] = 1;
    this.clearTag();
    return tag;
  }

};


export let DefaultTags = new AbstractTags();
