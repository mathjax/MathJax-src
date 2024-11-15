/*************************************************************
 *
 *  Copyright (c) 2009-2024 The MathJax Consortium
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
 * @file Tree Explorers allow to switch on effects on the entire
 *     expression tree.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { A11yDocument, Region } from './Region.js';
import { AbstractExplorer } from './Explorer.js';
import { ExplorerPool } from './ExplorerPool.js';
import * as Sre from '../sre.js';

export class AbstractTreeExplorer extends AbstractExplorer<void> {
  /**
   * @override
   */
  protected constructor(
    public document: A11yDocument,
    public pool: ExplorerPool,
    public region: Region<void>,
    protected node: HTMLElement,
    protected mml: HTMLElement
  ) {
    super(document, pool, null, node);
  }

  /**
   * @override
   */
  public readonly stoppable = false;

  /**
   * @override
   */
  public Attach() {
    super.Attach();
    this.Start();
  }

  /**
   * @override
   */
  public Detach() {
    this.Stop();
    super.Detach();
  }
}

export class FlameColorer extends AbstractTreeExplorer {
  /**
   * @override
   */
  public Start() {
    if (this.active) return;
    this.active = true;
    this.highlighter.highlightAll(this.node);
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      this.highlighter.unhighlightAll();
    }
    this.active = false;
  }
}

export class TreeColorer extends AbstractTreeExplorer {
  /**
   * @override
   */
  public Start() {
    if (this.active) return;
    this.active = true;
    const generator = Sre.getSpeechGenerator('Color');
    if (!this.node.hasAttribute('hasforegroundcolor')) {
      generator.generateSpeech(this.node, this.mml);
      this.node.setAttribute('hasforegroundcolor', 'true');
    }
    // TODO: Make this cleaner in Sre.
    (this.highlighter as any).colorizeAll(this.node);
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      (this.highlighter as any).uncolorizeAll(this.node);
    }
    this.active = false;
  }
}
