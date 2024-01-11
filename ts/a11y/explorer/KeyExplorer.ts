/*************************************************************
 *
 *  Copyright (c) 2009-2023 The MathJax Consortium
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
 * @fileoverview Explorers based on keyboard events.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {A11yDocument, HoverRegion, SpeechRegion, LiveRegion} from './Region.js';
import type { ExplorerMathItem } from '../explorer.js';
import {Explorer, AbstractExplorer} from './Explorer.js';
import {ExplorerPool} from './ExplorerPool.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import { buildSpeech, setAria, honk } from '../speech/SpeechUtil.js';
import {Sre} from '../sre.js';

// import { Walker } from './Walker.js';


/**
 * Interface for keyboard explorers. Adds the necessary keyboard events.
 * @interface
 * @extends {Explorer}
 */
export interface KeyExplorer extends Explorer {

  /**
   * Function to be executed on key down.
   * @param {KeyboardEvent} event The keyboard event.
   */
  KeyDown(event: KeyboardEvent): void;

  /**
   * Function to be executed on focus in.
   * @param {KeyboardEvent} event The keyboard event.
   */
  FocusIn(event: FocusEvent): void;

  /**
   * Function to be executed on focus out.
   * @param {KeyboardEvent} event The keyboard event.
   */
  FocusOut(event: FocusEvent): void;

  /**
   * Move made on keypress.
   * @param key The key code of the pressed key.
   */
  Move(event: KeyboardEvent): void;

  /**
   * A method that is executed if no move is executed.
   */
  NoMove(): void;

}


const codeSelector = 'mjx-container';
const roles = ['tree', 'group', 'treeitem'];
const nav = roles.map(x => `[role="${x}"]`).join(',');
const prevNav = roles.map(x => `[tabindex="0"][role="${x}"]`).join(',');

function isCodeBlock(el: HTMLElement) {
  return el.matches(codeSelector);
}

/**
 * @constructor
 * @extends {AbstractExplorer}
 *
 * @template T  The type that is consumed by the Region of this explorer.
 */
export class SpeechExplorer extends AbstractExplorer<string> implements KeyExplorer {

  /**
   * Flag indicating if the explorer is attached to an object.
   */
  public attached: boolean = false;

  /**
   * Switches on or off the use of sound on this explorer.
   */
  public sound: boolean = false;

  /**
   * The attached Sre walker.
   * @type {Walker}
   */
  public walker: Sre.walker;

  private eventsAttached: boolean = false;

  protected current: HTMLElement = null;

  private move = false;

  private mousedown = false;

  /**
   * @override
   */
  protected events: [string, (x: Event) => void][] =
    super.Events().concat(
      [
        ['keydown', this.KeyDown.bind(this)],
        ['mousedown', this.MouseDown.bind(this)],
        ['click', this.Click.bind(this)],
        ['focusin', this.FocusIn.bind(this)],
        ['focusout', this.FocusOut.bind(this)]
      ]);

  /**
   * Records a mouse down event on the element. This ensures that focus events
   * only fire if they were not triggered by a mouse click.
   *
   * @param e The mouse event.
   */
  private MouseDown(e: MouseEvent) {
    this.mousedown = true;
    e.preventDefault();
  }

  public Click(e: MouseEvent) {
    const clicked = (e.target as HTMLElement).closest(nav) as HTMLElement;
    if (!this.node.contains(clicked)) {
      // In case the mjx-container is in a div, we get the click, although it is outside.
      this.mousedown = false;
    }
    if (this.node.contains(clicked)) {
      const prev = this.node.querySelector(prevNav);
      if (prev) {
        prev.removeAttribute('tabindex');
      }
      this.current = clicked;
      if (!this.triggerLinkMouse()) {
        this.Start()
      }
      e.preventDefault();
    }
  }

  /**
   * The original tabindex value before explorer was attached.
   * @type {boolean}
   */
  private oldIndex: number = null;

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
    this.item.generatorPool.CleanUp(this.current);
    if (!this.move) {
      this.Stop();
    }
    this.current.removeAttribute('tabindex');
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

  protected nextSibling(el: HTMLElement): HTMLElement {
    const sib = el.nextElementSibling as HTMLElement;
    if (sib) {
      if (sib.matches(nav)) {
        return sib;
      }
      const sibChild = sib.querySelector(nav) as HTMLElement;
      return sibChild ?? this.nextSibling(sib);
    }
    if (!isCodeBlock(el) && !el.parentElement.matches(nav)) {
      return this.nextSibling(el.parentElement);
    }
    return null;
  }

  protected prevSibling(el: HTMLElement): HTMLElement {
    const sib = el.previousElementSibling as HTMLElement;
    if (sib) {
      if (sib.matches(nav)) {
        return sib;
      }
      const sibChild = sib.querySelector(nav) as HTMLElement;
      return sibChild ?? this.prevSibling(sib);
    }
    if (!isCodeBlock(el) && !el.parentElement.matches(nav)) {
      return this.prevSibling(el.parentElement);
    }
    return null;
  }

  protected moves: Map<string, (node: HTMLElement) => HTMLElement | null> = new Map([
    ['ArrowDown', (node: HTMLElement) => node.querySelector(nav)],
    ['ArrowUp', (node: HTMLElement) => node.parentElement.closest(nav)],
    ['ArrowLeft', this.prevSibling.bind(this)],
    ['ArrowRight', this.nextSibling.bind(this)],
    ['>', this.nextRules.bind(this)],
    ['<', this.nextStyle.bind(this)],
    ['x', this.summary.bind(this)],
  ]);

  public summary(node: HTMLElement): HTMLElement {
    this.item.generatorPool.summary(node);
    this.refocus(node);
    return node;
  }

  public nextRules(node: HTMLElement): HTMLElement {
    this.item.generatorPool.nextRules(node);
    this.recomputeSpeech();
    this.refocus(node);
    return node;
  }

  public nextStyle(node: HTMLElement): HTMLElement {
    this.item.generatorPool.nextStyle(node);
    this.recomputeSpeech();
    this.refocus(node);
    return node;
  }

  private recomputeSpeech() {
    const speech = this.item.generatorPool.speechGenerator.getSpeech(this.item.typesetRoot, this.item.typesetRoot);
    setAria(this.item.typesetRoot, this.document.options.sre.locale);
    this.item.outputData.speech = buildSpeech(speech)[0];
    this.item.typesetRoot.setAttribute('aria-label', this.item.outputData.speech);
    this.item.attachSpeech(this.document);
  }

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

  private static updatePromise = Promise.resolve();

  /**
   * The Sre speech generator associated with the walker.
   * @type {SpeechGenerator}
   */
  public speechGenerator: Sre.speechGenerator;

  /**
   * The name of the option used to control when this is being shown
   * @type {string}
   */
  public showRegion: string = 'subtitles';

  // private init: boolean = false;

  /**
   * Flag in case the start method is triggered before the walker is fully
   * initialised. I.e., we have to wait for Sre. Then region is re-shown if
   * necessary, as otherwise it leads to incorrect stacking.
   * @type {boolean}
   */
  private restarted: boolean = false;

  /**
   * @constructor
   * @extends {AbstractKeyExplorer}
   */
  constructor(public document: A11yDocument,
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


  /**
   * @override
   */
  public Start() {
    // this.item.generatorPool.update(this.document.options);
    if (this.node.hasAttribute('tabindex')) {
      this.node.removeAttribute('tabindex');
    }
    if (!this.attached) return;
    if (this.active) return;
    this.current.setAttribute('tabindex', '0');
    this.current.focus();
    super.Start();
    if (this.document.options.a11y.subtitles) {
      SpeechExplorer.updatePromise.then(
        () => this.region.Show(this.node, this.highlighter))
    }
    if (this.document.options.a11y.viewBraille) {
      SpeechExplorer.updatePromise.then(
        () => this.brailleRegion.Show(this.node, this.highlighter))
    }
    if (this.document.options.a11y.keyMagnifier) {
      this.magnifyRegion.Show(this.node, this.highlighter);
    }
    this.Update();
    // this.restarted = true;
  }


  /**
   * @override
   */
  public Update(force: boolean = false) {
    // TODO (v4): This is a hack to avoid double voicing on initial startup!
    // Make that cleaner and remove force as it is not really used!
    // let noUpdate = force;
    if (!this.active && !force) return;
    this.pool.unhighlight();
    this.pool.highlight([this.current]);
    this.region.node = this.node;
    this.item.generatorPool.UpdateSpeech(
      this.current,
      this.region,
      this.brailleRegion
    );
    this.magnifyRegion.Update(this.current);
    // let options = this.speechGenerator.getOptions();
    // This is a necessary in case speech options have changed via keypress
    // during walking.
    // if (options.modality === 'speech') {
    //   this.document.options.sre.domain = options.domain;
    //   this.document.options.sre.style = options.style;
    //   this.document.options.a11y.speechRules =
    //     options.domain + '-' + options.style;
    // }
    // Ensure this autovoicing is retained later:
    // SpeechExplorer.updatePromise = SpeechExplorer.updatePromise.then(async () => {
    //   return Sre.sreReady()
    //     .then(() => Sre.setupEngine({markup: options.markup,
    //                                  modality: options.modality,
    //                                  locale: options.locale}))
    //     .then(() => {
    //       if (!noUpdate) {
    //         let speech = this.walker.speech();
    //         this.region.Update(speech);
    //       }
    //     });
    // });
  }


  /**
   * Computes the speech for the current expression once Sre is ready.
   * @param {Walker} walker The sre walker.
   */
  public Speech(walker: Sre.walker) {
    SpeechExplorer.updatePromise.then(() => {
      walker.speech();
      this.node.setAttribute('hasspeech', 'true');
      this.Update(true);
      if (this.restarted && this.document.options.a11y[this.showRegion]) {
        this.region.Show(this.node, this.highlighter);
      }
    });
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
        this.Stop()
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
      this.stopEvent(event);
      if (this.Move(event)) {
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
   * @param {KeyboardEvent} event The keyboard event for the last keydown event.
   */
  protected triggerLinkKeyboard(event: KeyboardEvent) {
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
    let focus = node?.
      getAttribute('data-semantic-postfix')?.
      match(/(^| )link($| )/);
    if (focus) {
      node.parentNode.dispatchEvent(new MouseEvent('click'));
      return true;
    }
    return false;
  }


  /**
   * Programmatically triggers a link if the clicked mouse contains one.
   */
  protected triggerLinkMouse() {
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
   * Retrieves the speech options to sync with document options.
   * @return {{[key: string]: string}} The options settings for the speech
   *     generator.
   */
  protected getOptions(): {[key: string]: string} {
    let options = this.speechGenerator.getOptions();
    let sreOptions = this.document.options.sre;
    if (options.modality === 'speech' &&
      (options.locale !== sreOptions.locale ||
        options.domain !== sreOptions.domain ||
        options.style !== sreOptions.style)) {
      options.domain = sreOptions.domain;
      options.style = sreOptions.style;
      options.locale = sreOptions.locale;
      this.walker.update(options);
    }
    return options;
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

}
