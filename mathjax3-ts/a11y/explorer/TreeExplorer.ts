/*************************************************************
 *
 *  Copyright (c) 2009-2019 The MathJax Consortium
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
 * @fileoverview Tree Explorers allow to switch on effects on the entire
 *     expression tree.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {A11yDocument, Region} from './Region.js';
import {Explorer, AbstractExplorer} from './Explorer.js';
import {sreReady} from '../sre.js';


export interface TreeExplorer extends Explorer {
  
}


export class AbstractTreeExplorer extends AbstractExplorer<void> {
  
  /**
   * @override
   */
  protected constructor(public document: A11yDocument,
              protected region: Region<void>,
                        protected node: HTMLElement,
                        protected mml: HTMLElement) {
    super(document, null, node);
    this.Start();
  }

  /**
   * @override
   */
  readonly stoppable = false;

  /**
   * @override
   */
  public AddEvents() { }

  /**
   * @override
   */
  public RemoveEvents() { }
  
}


export class FlameColorer extends AbstractTreeExplorer {

  public Start() {
    this.highlighter.highlightAll(this.node);
  }

  public Stop() {
    this.highlighter.unhighlightAll(this.node);
  }
  
}
