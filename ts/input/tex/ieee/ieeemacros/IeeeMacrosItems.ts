/*************************************************************
 *
 *  Copyright (c) 2023-2024 The MathJax Consortium
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
 * @fileoverview Items for IEEE macros package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {ArrayItem} from '../../base/BaseItems.js';
import NodeUtil from '../../NodeUtil.js';

//
//  Subclass of array stack item to handle vertical rules and \hfill for
//  alignment of cells.  Also, remove negative skips at the edges of cells
//  (mostly these are used to adjust for the column spaces used by vertical
//  lines, but not always, so this can remove useful space as well).
//
export class IeeeArrayItem extends ArrayItem {

  /**
   * @override
   */
  public get kind() {
    return 'ieeeArray';
  }

  public vRules: string[] = [];
  public cRules: string[] = [];
  public hFill: number[] = [];

  /**
   * @override
   */
  public EndEntry() {
    //
    //  Remove negative space at the end and beginning of the cells
    //
    for (let i = this.Size() - 1; i >= 0; i--) {
      const cell = this.nodes[i];
      const w = (cell ? NodeUtil.getProperty(cell, 'width') : 0) as number;
      if (cell && cell.isKind('mspace') &&
        (w < 0 || String(w).substring(0, 8) === 'negative')) {
        this.Pop();
      } else {
        i = 0
      }
    }
    for (let i = 0, m = this.Size(); i < m; i++) {
      const cell = this.nodes[i];
      const w = (cell ? NodeUtil.getProperty(cell, 'width') : 0) as number;
      if (cell && cell.isKind('mspace') &&
        (w < 0 || String(w).substring(0, 8) === 'negative')) {
        this.nodes.shift()
      } else {
        i = m
      }
    }
    //
    //  Adjust the alignment based on the \hfill's at the beginning and
    //  end of the cells
    //
    const mtd = this.create('node', 'mtd', this.nodes);
    if (this.hFill.length) {
      if (this.hFill[0] === 0) {
        NodeUtil.setAttribute(mtd, 'columnalign', 'right');
      }
      if (this.hFill[this.hFill.length - 1] === this.Size()) {
        NodeUtil.setAttribute(
          mtd, 'columnalign',
          NodeUtil.getAttribute(mtd, 'columnalign') ? 'center' : 'left');
      }
    }
    this.row.push(mtd);
    this.Clear();
    this.hfill = [];
  }

  public checkLines() {
    let M = 0;
    //
    //  Find the longest row
    //
    for (let j = this.table.length - 1; j >= 0; j--) {
      M = Math.max(M, this.table[j].childNodes.length);
      //
      //  If there are vertical rules ...
      //
      if (this.vRules.length) {
        //
        //  Remove tailing blank cells from each row.
        //  If the row is empty, remove it.
        //
        for (let j = this.table.length-1; j >= 0; j--) {
          const row = this.table[j];
          for (let i = row.childNodes.length-1; i >= 0; i--) {
            const cell = row.childNodes[i];
            if (cell && cell.childNodes[0] && cell.childNodes[0].childNodes.length) break;
            row.childNodes.pop();
          }
          if (row.childNodes.length === 0) {
            this.table.splice(j,1);
            // This line below fixed by Davide C. 1/13/2015.
            // var lines = this.arraydef.rowlines.split(/ /);
            let lines = (this.arraydef.rowlines as string || '').split(/ /);
            let kind = lines.splice(j-1,1)[0];
            if (kind && kind !== 'none') {
              lines[j-1] = kind;
            }
            //  This line fixed by Davide C. 1/14/2015
            // this.arraydef.rowlines = lines.join(' ');
            this.arraydef.rowlines = lines.join(' ').replace(/ *$/,'');
            if (this.arraydef.rowlines === '') delete this.arraydef.rowlines;
          }
        }
        //
        //  Check for blank columns and remove them
        //  Record table rules inot the column array
        //
        for (let i = M - 1; i >= 0; i--) {
          var blank = true;
          for (let j = this.table.length-1; blank && j >= 0; j--) {
            const cell = this.table[j].childNodes[i];
            if (cell && cell.childNodes[0] && cell.childNodes[0].childNodes.length) {
              blank = false;
            }
          }
          if (blank) {
            for (let j = this.table.length - 1; j >= 0; j--) {
              this.table[j].childNodes.splice(i,1);
            }
            this.cRules.splice(i,1); 
            M--;
          }
          if (this.vRules[i]) this.cRules[i-1] = this.vRules[i];
        }
      }
      //
      //  Create the columnlines attribute for the table
      //
      if (this.cRules.length) {
        for (let i = 0, m = this.cRules.length; i < m; i++) {
          if (this.cRules[i] == null) {
            this.cRules[i] = 'none';
          }
        }
      }
      if (this.cRules[-1]) {
        this.frame.push(['left', this.cRules[-1]]);
      }
      if (this.cRules.length >= M) {
        this.frame.push(['right', this.cRules.pop()]);
      }
      if (this.cRules.length) {
        this.arraydef.columnlines = this.cRules.join(' ') + ' none';
      }
      //
      //  Do the usual line check
      //
      super.checkLines();
    }
  }

}
