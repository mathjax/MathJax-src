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
 * @file Explorers based on keyboard events.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {
  A11yDocument,
  HoverRegion,
  SpeechRegion,
  LiveRegion,
} from './Region.js';
import { STATE } from '../../core/MathItem.js';
import type { ExplorerMathItem } from '../explorer.js';
import { Explorer, AbstractExplorer } from './Explorer.js';
import { ExplorerPool } from './ExplorerPool.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { honk, InPlace } from '../speech/SpeechUtil.js';
import { GeneratorPool } from '../speech/GeneratorPool.js';
import * as Sre from '../sre.js';

/**
 * Interface for keyboard explorers. Adds the necessary keyboard events.
 *
 * @interface
 * @augments {Explorer}
 */
export interface KeyExplorer extends Explorer {
  /**
   * Function to be executed on key down.
   *
   * @param {KeyboardEvent} event The keyboard event.
   */
  KeyDown(event: KeyboardEvent): void;

  /**
   * Function to be executed on focus in.
   *
   * @param {KeyboardEvent} event The keyboard event.
   */
  FocusIn(event: FocusEvent): void;

  /**
   * Function to be executed on focus out.
   *
   * @param {KeyboardEvent} event The keyboard event.
   */
  FocusOut(event: FocusEvent): void;

  /**
   * Move made on keypress.
   *
   * @param event The keyboard event when a key is pressed.
   */
  Move(event: KeyboardEvent): void;

  /**
   * A method that is executed if no move is executed.
   */
  NoMove(): void;
}

/**
 * Selectors for walking.
 */
const roles = ['tree', 'group', 'treeitem'];
const nav = roles.map((x) => `[role="${x}"]`).join(',');
const prevNav = roles.map((x) => `[tabindex="0"][role="${x}"]`).join(',');

/**
 * Predicate to check if element is a MJX container.
 *
 * @param {HTMLElement} el The HTML element.
 * @returns {boolean} True if the element is an mjx-container.
 */
function isContainer(el: HTMLElement): boolean {
  return el.matches('mjx-container');
}

/**
 * @class
 * @augments {AbstractExplorer}
 *
 * @template T  The type that is consumed by the Region of this explorer.
 */
export class SpeechExplorer
  extends AbstractExplorer<string>
  implements KeyExplorer
{
  /**
   * Flag indicating if the explorer is attached to an object.
   */
  public attached: boolean = false;

  /**
   * Switches on or off the use of sound on this explorer.
   */
  public sound: boolean = false;

  /**
   * Id of the element focused before the restart.
   */
  public restarted: number = null;

  /**
   * Convenience getter for generator pool of the item.
   *
   * @returns {GeneratorPool} The item's generator pool.
   */
  private get generators(): GeneratorPool<HTMLElement, Text, Document> {
    return this.item?.generatorPool;
  }

  /**
   * The original tabindex value before explorer was attached.
   */
  private oldIndex: number = null;

  /**
   * The currently focused elements.
   */
  protected current: HTMLElement = null;

  /**
   * Flag registering if events of the explorer are attached.
   */
  private eventsAttached: boolean = false;

  /**
   * Flag to register if the last event was an explorer move. This is important
   * so the explorer does not stop (by FocusOut) during a focus shift.
   */
  private move = false;

  /**
   * Register the mousedown event. Prevent FocusIn executing twice from click
   * and mousedown.
   */
  private mousedown = false;

  /**
   * @override
   */
  protected events: [string, (x: Event) => void][] = super.Events().concat([
    ['keydown', this.KeyDown.bind(this)],
    ['mousedown', this.MouseDown.bind(this)],
    ['click', this.Click.bind(this)],
    ['focusin', this.FocusIn.bind(this)],
    ['focusout', this.FocusOut.bind(this)],
  ]);

  /**
   * Test of an event has any modifier keys
   *
   * @param {MouseEvent} event   The event to check
   * @returns {boolean}          True if shift, ctrl, alt, or meta key is pressed
   */
  protected hasModifiers(event: MouseEvent): boolean {
    return event.shiftKey || event.metaKey || event.altKey || event.ctrlKey;
  }

  /**
   * Records a mouse down event on the element. This ensures that focus events
   * only fire if they were not triggered by a mouse click.
   *
   * @param {MouseEvent} e The mouse event.
   */
  private MouseDown(e: MouseEvent) {
    this.FocusOut(null);
    this.mousedown = true;
    if (this.hasModifiers(e)) return;
    document.getSelection()?.removeAllRanges();
  }

  /**
   * Moves on mouse click to the closest clicked element.
   *
   * @param {MouseEvent} event The mouse click event.
   */
  public Click(event: MouseEvent) {
    const clicked = (event.target as HTMLElement).closest(nav) as HTMLElement;
    if (this.hasModifiers(event) || document.getSelection().type === 'Range') {
      this.FocusOut(null);
      return;
    }
    if (this.node.getAttribute('tabIndex') === '-1') return;
    if (!this.node.contains(clicked)) {
      // In case the mjx-container is in a div, we get the click, although it is outside.
      this.mousedown = false;
    }
    if (this.node.contains(clicked)) {
      const prev = this.node.querySelector(prevNav);
      if (prev) {
        prev.removeAttribute('tabindex');
        this.FocusOut(null);
      }
      this.current = clicked;
      if (!this.triggerLinkMouse()) {
        this.Start();
      }
      event.preventDefault();
    }
  }

  /**
   * @override
   */
  public FocusIn(event: FocusEvent) {
    if (this.mousedown) {
      this.mousedown = false;
      return;
    }
    this.current = this.current || this.node.querySelector('[role="treeitem"]');
    this.Start();
    event.preventDefault();
  }

  /**
   * @override
   */
  public FocusOut(_event: FocusEvent) {
    (document.activeElement as HTMLElement)?.blur();
    // This guard is to FF and Safari, where focus in fired only once on
    // keyboard.
    if (!this.active) return;
    this.generators.CleanUp(this.current);
    if (!this.move) {
      this.Stop();
    }
    this.current?.removeAttribute('tabindex');
    this.node.setAttribute('tabindex', '0');
  }

  /**
   * @override
   */
  public Attach() {
    super.Attach();
    this.attached = true;
    this.oldIndex = this.node.tabIndex;
    this.node.tabIndex = 0;
  }

  /**
   * @override
   */
  public AddEvents() {
    if (!this.eventsAttached) {
      super.AddEvents();
      this.eventsAttached = true;
    }
  }

  /**
   * @override
   */
  public Detach() {
    if (this.active) {
      this.node.tabIndex = this.oldIndex;
      this.oldIndex = null;
      this.node.removeAttribute('role');
    }
    this.attached = false;
  }

  /**
   * Navigate one step to the right on the same level.
   *
   * @param {HTMLElement} el The current element.
   * @returns {HTMLElement} The next element.
   */
  protected nextSibling(el: HTMLElement): HTMLElement {
    if (!this.current.getAttribute('data-semantic-parent')) {
      return null;
    }
    const sib = el.nextElementSibling as HTMLElement;
    if (sib) {
      if (sib.matches(nav)) {
        return sib;
      }
      const sibChild = sib.querySelector(nav) as HTMLElement;
      return sibChild ?? this.nextSibling(sib);
    }
    if (!isContainer(el) && !el.parentElement.matches(nav)) {
      return this.nextSibling(el.parentElement);
    }
    return null;
  }

  /**
   * Navigate one step to the left on the same level.
   *
   * @param {HTMLElement} el The current element.
   * @returns {HTMLElement} The next element.
   */
  protected prevSibling(el: HTMLElement): HTMLElement {
    if (!this.current.getAttribute('data-semantic-parent')) {
      return null;
    }
    const sib = el.previousElementSibling as HTMLElement;
    if (sib) {
      if (sib.matches(nav)) {
        return sib;
      }
      const sibChild = sib.querySelector(nav) as HTMLElement;
      return sibChild ?? this.prevSibling(sib);
    }
    if (!isContainer(el) && !el.parentElement.matches(nav)) {
      return this.prevSibling(el.parentElement);
    }
    return null;
  }

  protected moves: Map<string, (node: HTMLElement) => HTMLElement | null> =
    new Map([
      ['ArrowDown', (node: HTMLElement) => node.querySelector(nav)],
      ['ArrowUp', (node: HTMLElement) => node.parentElement.closest(nav)],
      ['ArrowLeft', this.prevSibling.bind(this)],
      ['ArrowRight', this.nextSibling.bind(this)],
      ['>', this.nextRules.bind(this)],
      ['<', this.nextStyle.bind(this)],
      ['x', this.summary.bind(this)],
      ['Enter', this.expand.bind(this)],
      ['d', this.depth.bind(this)],
    ]);

  /**
   * Checks if a node is actionable, i.e., corresponds to an maction.
   *
   * @param {HTMLElement} node The (rendered) node under consideration.
   * @returns {HTMLElement} The node corresponding to an maction element.
   */
  private actionable(node: HTMLElement): HTMLElement {
    const parent = node?.parentNode as HTMLElement;
    return parent && this.highlighter.isMactionNode(parent) ? parent : null;
  }

  /**
   * Computes the nesting depth announcement for the currently focused sub
   * expression.
   *
   * @param {HTMLElement} node The current node.
   * @returns {HTMLElement} The refocused node.
   */
  public depth(node: HTMLElement): HTMLElement {
    this.generators.depth(node, !!this.actionable(node));
    this.refocus(node);
    this.generators.lastMove = InPlace.DEPTH;
    return node;
  }

  /**
   * Expands or collapses the currently focused node.
   *
   * @param {HTMLElement} node The focused node.
   * @returns {HTMLElement} The node if action was successful. O/w null.
   */
  public expand(node: HTMLElement): HTMLElement {
    const expandable = this.actionable(node);
    if (!expandable) {
      return null;
    }
    expandable.dispatchEvent(new Event('click'));
    return node;
  }

  /**
   * Computes the summary for this expression. This is temporary and will be
   * replaced by the full speech on focus out.
   *
   * @param {HTMLElement} node The targeted node.
   * @returns {HTMLElement} The refocused targeted node.
   */
  public summary(node: HTMLElement): HTMLElement {
    node.setAttribute(
      'data-semantic-speech',
      node.getAttribute('data-semantic-summary')
    );
    this.Stop();
    this.Restart();
    this.generators.lastMove = InPlace.SUMMARY;
    return node;
  }

  /**
   * Cycles to next speech rule set if possible and recomputes the speech for
   * the expression.
   *
   * @param {HTMLElement} _node The targeted node.
   * @returns {HTMLElement} The refocused targeted node.
   */
  public nextRules(_node: HTMLElement): HTMLElement {
    this.node.removeAttribute('data-speech-attached');
    this.generators.nextRules(this.item.typesetRoot, this.item.outputData.mml);
    this.Stop();
    this.Restart();
    return _node;
  }

  /**
   * Cycles to next speech style or preference if possible and recomputes the
   * speech for the expression.
   *
   * @param {HTMLElement} node The targeted node.
   * @returns {HTMLElement} The refocused targeted node.
   */
  public nextStyle(node: HTMLElement): HTMLElement {
    this.node.removeAttribute('data-speech-attached');
    this.generators.nextStyle(
      node,
      this.item.typesetRoot,
      this.item.outputData.mml
    );
    this.Stop();
    this.Restart();
    return node;
  }

  /**
   * Refocuses the active elements, mainly to alert screenreaders of changes.
   *
   * @param {HTMLElement} node The node to refocus on.
   */
  private refocus(node: HTMLElement) {
    node.blur();
    node.focus();
  }

  /**
   * @override
   */
  public Move(e: KeyboardEvent) {
    this.move = true;
    const target = e.target as HTMLElement;
    const move = this.moves.get(e.key);
    let next = null;
    if (move) {
      e.preventDefault();
      next = move(target);
    }
    if (next) {
      target.removeAttribute('tabindex');
      next.setAttribute('tabindex', '0');
      next.focus();
      this.current = next;
      this.move = false;
      return true;
    }
    this.move = false;
    return false;
  }

  /**
   * @override
   */
  public NoMove() {
    honk();
  }

  /**
   * @param {A11yDocument} document The accessible math document.
   * @param {ExplorerPool} pool The explorer pool.
   * @param {SpeechRegion} region The speech region for the explorer.
   * @param {HTMLElement} node The node the explorer is assigned to.
   * @param {LiveRegion} brailleRegion The braille region.
   * @param {HoverRegion} magnifyRegion The magnification region.
   * @param {MmlNode} _mml The internal math node.
   * @param {ExplorerMathItem} item The math item.
   * @class
   * @augments {AbstractExplorer}
   */
  constructor(
    public document: A11yDocument,
    public pool: ExplorerPool,
    public region: SpeechRegion,
    protected node: HTMLElement,
    public brailleRegion: LiveRegion,
    public magnifyRegion: HoverRegion,
    _mml: MmlNode,
    public item: ExplorerMathItem
  ) {
    super(document, pool, null, node);
  }

  private restarts = 0;
  private static maxRestarts = 20;

  private async Restart() {
    setTimeout(
      () =>
        new Promise((res, rej) => {
          if (this.node.hasAttribute('data-speech-attached')) {
            res(true);
          } else if (this.restarts > SpeechExplorer.maxRestarts) {
            this.restarts = 0;
            rej();
          } else {
            this.restarts++;
            this.Restart();
          }
        })
          .then(() => this.Start())
          .catch((_err) => {}),
      100
    );
  }

  /**
   * @override
   */
  public Start() {
    // In case the speech is not attached yet, we generate it
    if (this.item.state() < STATE.ATTACHSPEECH) {
      this.item.attachSpeech(this.document);
    }
    if (!this.attached) return;
    if (!this.node.hasAttribute('data-speech-attached')) {
      this.Restart();
      return;
    }
    if (this.node.hasAttribute('tabindex')) {
      this.node.removeAttribute('tabindex');
    }
    if (this.active) return;
    if (this.restarted !== null) {
      // Here we refocus after a restart: We either find the previously focused
      // node or we assume that it is inside the collapsed expression tree and
      // focus on the collapsed element.
      this.current = this.node.querySelector(
        `[data-semantic-id="${this.restarted}"]`
      );
      if (!this.current) {
        const dummies = Array.from(
          this.node.querySelectorAll('[data-semantic-type="dummy"]')
        ).map((x) => x.getAttribute('data-semantic-id'));
        let internal = this.generators.element.querySelector(
          `[data-semantic-id="${this.restarted}"]`
        );
        while (internal && internal !== this.generators.element) {
          const sid = internal.getAttribute('data-semantic-id');
          if (dummies.includes(sid)) {
            this.current = this.node.querySelector(
              `[data-semantic-id="${sid}"]`
            );
            break;
          }
          internal = internal.parentNode as Element;
        }
      }
      this.restarted = null;
    }
    if (!this.current) {
      // In case something went wrong when focusing or restarting, we start on
      // the root node by default.
      this.current = this.node.childNodes[0] as HTMLElement;
    }
    const options = this.document.options;
    const promise = Promise.resolve(); // Sre.sreReady();
    // if (this.generators.update(options)) {
    //   promise = promise.then(() => this.Speech());
    // }
    this.current.setAttribute('tabindex', '0');
    this.current.focus();
    super.Start();
    if (options.a11y.subtitles && options.a11y.speech && options.enableSpeech) {
      promise.then(() => this.region.Show(this.node, this.highlighter));
    }
    if (
      options.a11y.viewBraille &&
      options.a11y.braille &&
      options.enableBraille
    ) {
      promise.then(() => this.brailleRegion.Show(this.node, this.highlighter));
    }
    if (options.a11y.keyMagnifier) {
      this.magnifyRegion.Show(this.current, this.highlighter);
    }
    this.Update();
  }

  /**
   * @override
   */
  public Update(force: boolean = false) {
    // TODO (v4): This is a hack to avoid double voicing on initial startup!
    // Make that cleaner and remove force as it is not really used!
    if (!this.active && !force) return;
    this.pool.unhighlight();
    this.pool.highlight([this.current]);
    this.region.node = this.node;
    this.generators.updateRegions(
      this.current,
      this.region,
      this.brailleRegion
    );
    this.magnifyRegion.Update(this.current);
  }

  /**
   * Computes the speech for the current expression.
   *
   * Refactor: This is called when we change rule sets, etc.
   */
  public Speech() {
    // this.item.outputData.speech = this.generators.updateSpeech(
    //   this.item.typesetRoot
    // );
  }

  /**
   * @override
   */
  public KeyDown(event: KeyboardEvent) {
    const code = event.key;
    // this.walker.modifier = event.shiftKey;
    if (code === 'Tab') {
      return;
    }
    if (code === ' ') {
      return;
    }
    if (code === 'Control') {
      speechSynthesis.cancel();
      return;
    }
    if (code === 'Escape') {
      this.Stop();
      this.stopEvent(event);
      return;
    }
    if (code === 'Enter') {
      if (!this.active && event.target instanceof HTMLAnchorElement) {
        event.target.dispatchEvent(new MouseEvent('click'));
        this.stopEvent(event);
        return;
      }
      if (this.active && this.triggerLinkKeyboard(event)) {
        this.Stop();
        this.stopEvent(event);
        return;
      }
      if (!this.active) {
        if (!this.current) {
          this.current = this.node.querySelector('[role="treeitem"]');
        }
        this.Start();
        this.stopEvent(event);
        return;
      }
    }
    if (this.active) {
      if (this.Move(event)) {
        this.stopEvent(event);
        this.Update();
        return;
      }
      if (event.getModifierState(code)) {
        return;
      }
      if (this.sound) {
        this.NoMove();
      }
    }
  }

  /**
   * Programmatically triggers a link if the focused node contains one.
   *
   * @param {KeyboardEvent} event The keyboard event for the last keydown event.
   * @returns {boolean} True if link was successfully triggered.
   */
  protected triggerLinkKeyboard(event: KeyboardEvent): boolean {
    if (event.code !== 'Enter') {
      return false;
    }
    if (!this.current) {
      if (event.target instanceof HTMLAnchorElement) {
        event.target.dispatchEvent(new MouseEvent('click'));
        return true;
      }
      return false;
    }
    return this.triggerLink(this.current);
  }

  protected triggerLink(node: HTMLElement) {
    const focus = node
      ?.getAttribute('data-semantic-postfix')
      ?.match(/(^| )link($| )/);
    if (focus) {
      node.parentNode.dispatchEvent(new MouseEvent('click'));
      return true;
    }
    return false;
  }

  /**
   * Programmatically triggers a link if the clicked mouse event contains one.
   *
   * @returns {boolean} True if link was successfully triggered.
   */
  protected triggerLinkMouse(): boolean {
    let node = this.current;
    while (node && node !== this.node) {
      if (this.triggerLink(node)) {
        return true;
      }
      node = node.parentNode as HTMLElement;
    }
    return false;
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      this.pool.unhighlight();
      this.magnifyRegion.Hide();
      this.region.Hide();
      this.brailleRegion.Hide();
    }
    super.Stop();
  }

  /**
   * @returns {Sre.semanticNode} The semantic node that is currently focused.
   */
  public semanticFocus(): Sre.semanticNode {
    const node = this.current || this.node;
    const id = node.getAttribute('data-semantic-id');
    const stree = this.generators.speechGenerator.getRebuilt()?.stree;
    if (!stree) return null;
    const snode = stree.root.querySelectorAll(
      (x: any) => x.id.toString() === id
    )[0];
    return snode || stree.root;
  }
}
