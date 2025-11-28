/*************************************************************
 *
 *  Copyright (c) 2009-2025 The MathJax Consortium
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
   * Contrast value.
   */
  public contrast: ContrastPicker = new ContrastPicker();

  private leaves: HTMLElement[] = [];
  private modality: string = 'data-semantic-foreground';

  /**
   * @override
   */
  public Start() {
    if (this.active) return;
    this.active = true;
    if (!this.node.hasAttribute('hasforegroundcolor')) {
      this.colorLeaves();
      this.node.setAttribute('hasforegroundcolor', 'true');
    }
    // TODO: Make this cleaner in Sre.
    this.leaves.forEach((leaf) => this.colorize(leaf));
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      this.leaves.forEach((leaf) => this.uncolorize(leaf));
    }
    this.active = false;
  }

  /**
   * Colors the leave nodes of the expression.
   */
  private colorLeaves() {
    this.leaves = Array.from(
      this.node.querySelectorAll(
        '[data-semantic-id]:not([data-semantic-children])'
      )
    );
    for (const leaf of this.leaves) {
      leaf.setAttribute(this.modality, this.contrast.generate());
      this.contrast.increment();
    }
  }

  /**
   * Tree colors a single node.
   *
   * @param {HTMLElement} node The node.
   */
  public colorize(node: HTMLElement) {
    if (node.hasAttribute(this.modality)) {
      node.setAttribute(this.modality + '-old', node.style.color);
      node.style.color = node.getAttribute(this.modality);
    }
  }

  /**
   * Removes tree coloring from a single node.
   *
   * @param {HTMLElement} node The node.
   */
  public uncolorize(node: HTMLElement) {
    const fore = this.modality + '-old';
    if (node.hasAttribute(fore)) {
      node.style.color = node.getAttribute(fore);
    }
  }
}

export class ContrastPicker {
  /**
   * Hue value.
   */
  public hue = 10;

  /**
   * Saturation value.
   */
  public sat = 100;

  /**
   * Light value.
   */
  public light = 50;

  /**
   * Increment step. Prime closest to 50.
   */
  public incr = 53;

  /**
   * Generates the current color as rgb color in hex code.
   *
   * @returns {string} The rgb color attribute.
   */
  public generate(): string {
    return ContrastPicker.hsl2rgb(this.hue, this.sat, this.light);
  }

  /**
   * Increments the hue value of the current color.
   */
  public increment() {
    this.hue = (this.hue + this.incr) % 360;
  }

  /**
   * Transforms a HSL triple into an rgb value triple.
   *
   * @param {number} h The hue.
   * @param {number} s The saturation.
   * @param {number} l The luminosity.
   * @returns {string} The string with rgb value triple with values in [0, 255].
   */
  public static hsl2rgb(h: number, s: number, l: number): string {
    s = s > 1 ? s / 100 : s;
    l = l > 1 ? l / 100 : l;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (60 <= h && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (120 <= h && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (180 <= h && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (240 <= h && h < 300) {
      [r, g, b] = [x, 0, c];
    } else if (300 <= h && h < 360) {
      [r, g, b] = [c, 0, x];
    }
    return `rgb(${(r + m) * 255}, ${(g + m) * 255}, ${(b + m) * 255})`;
  }
}
