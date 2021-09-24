/*************************************************************
 *
 *  Copyright (c) 2009-2021 The MathJax Consortium
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


import {A11yDocument, Region} from './Region.js';
import {Explorer, AbstractExplorer} from './Explorer.js';
import {sreReady} from '../sre.js';
import {setupEngine} from 'speech-rule-engine/js/common/system.js';
import {Walker} from 'speech-rule-engine/js/walker/walker.js';
import * as WalkerFactory from 'speech-rule-engine/js/walker/walker_factory.js';
import {SpeechGenerator} from 'speech-rule-engine/js/speech_generator/speech_generator.js';
import * as SpeechGeneratorFactory from 'speech-rule-engine/js/speech_generator/speech_generator_factory.js';


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

}


/**
 * @constructor
 * @extends {AbstractExplorer}
 *
 * @template T  The type that is consumed by the Region of this explorer.
 */
export abstract class AbstractKeyExplorer<T> extends AbstractExplorer<T> implements KeyExplorer {

  /**
   * Flag indicating if the explorer is attached to an object.
   */
  public attached: boolean = false;

  /**
   * The attached SRE walker.
   * @type {Walker}
   */
  protected walker: Walker;

  private eventsAttached: boolean = false;

  /**
   * @override
   */
  protected events: [string, (x: Event) => void][] =
    super.Events().concat(
      [['keydown', this.KeyDown.bind(this)],
       ['focusin', this.FocusIn.bind(this)],
       ['focusout', this.FocusOut.bind(this)]]);

  /**
   * The original tabindex value before explorer was attached.
   * @type {boolean}
   */
  private oldIndex: number = null;

  /**
   * @override
   */
  public abstract KeyDown(event: KeyboardEvent): void;

  /**
   * @override
   */
  public FocusIn(_event: FocusEvent) {
  }

  /**
   * @override
   */
  public FocusOut(_event: FocusEvent) {
    this.Stop();
  }

  /**
   * @override
   */
  public Update(force: boolean = false) {
    if (!this.active && !force) return;
    this.highlighter.unhighlight();
    let nodes = this.walker.getFocus(true).getNodes();
    if (!nodes.length) {
      this.walker.refocus();
      nodes = this.walker.getFocus().getNodes();
    }
    this.highlighter.highlight(nodes as HTMLElement[]);
  }

  /**
   * @override
   */
  public Attach() {
    super.Attach();
    this.attached = true;
    this.oldIndex = this.node.tabIndex;
    this.node.tabIndex = 1;
    this.node.setAttribute('role', 'application');
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
   * @override
   */
  public Stop() {
    if (this.active) {
      this.highlighter.unhighlight();
      this.walker.deactivate();
    }
    super.Stop();
  }

}


/**
 * Explorer that pushes speech to live region.
 * @constructor
 * @extends {AbstractKeyExplorer}
 */
export class SpeechExplorer extends AbstractKeyExplorer<string> {

  private static updatePromise = Promise.resolve();

  /**
   * The SRE speech generator associated with the walker.
   * @type {SpeechGenerator}
   */
  public speechGenerator: SpeechGenerator;

  /**
   * The name of the option used to control when this is being shown
   * @type {string}
   */
  public showRegion: string = 'subtitles';

  private init: boolean = false;

  /**
   * Flag in case the start method is triggered before the walker is fully
   * initialised. I.e., we have to wait for SRE. Then region is re-shown if
   * necessary, as otherwise it leads to incorrect stacking.
   * @type {boolean}
   */
  private restarted: boolean = false;

  /**
   * @constructor
   * @extends {AbstractKeyExplorer}
   */
  constructor(public document: A11yDocument,
              protected region: Region<string>,
              protected node: HTMLElement,
              private mml: string) {
    super(document, region, node);
    this.initWalker();
  }


  /**
   * @override
   */
  public Start() {
    if (!this.attached) return;
    let options = this.getOptions();
    // TODO: Check and set locale not only on init, but on every start.
    if (!this.init) {
      this.init = true;
      SpeechExplorer.updatePromise.then(() => {
        SpeechExplorer.updatePromise = new Promise((res) => {
          sreReady()
            .then(() => setupEngine({locale: options.locale}))
            .then(() => {
              this.Speech(this.walker);
              this.Start();
            })
            .then(() => res());
        });
      })
        .catch((error: Error) => console.log(error.message));
      return;
    }
    super.Start();
    this.speechGenerator = SpeechGeneratorFactory.generator('Direct');
    this.speechGenerator.setOptions(options);
    this.walker = WalkerFactory.walker(
      'table', this.node, this.speechGenerator, this.highlighter, this.mml);
    this.walker.activate();
    this.Update();
    if (this.document.options.a11y[this.showRegion]) {
      SpeechExplorer.updatePromise.then(
        () => this.region.Show(this.node, this.highlighter));
    }
    this.restarted = true;
  }


  /**
   * @override
   */
  public Update(force: boolean = false) {
    super.Update(force);
    let options = this.speechGenerator.getOptions();
    SpeechExplorer.updatePromise.then(() => {
      SpeechExplorer.updatePromise = new Promise((res) => {
        sreReady()
          .then(() => setupEngine({modality: options.modality,
                                   locale: options.locale}))
          .then(() => this.region.Update(this.walker.speech()))
          .then(() => res());
      });
      // This is a necessary in case speech options have changed via keypress
      // during walking.
      if (options.modality === 'speech') {
        this.document.options.sre.domain = options.domain;
        this.document.options.sre.style = options.style;
        this.document.options.a11y.speechRules =
          options.domain + '-' + options.style;
      }
    });
  }


  /**
   * Computes the speech for the current expression once SRE is ready.
   * @param {Walker} walker The sre walker.
   */
  public Speech(walker: Walker) {
    SpeechExplorer.updatePromise.then(() => {
      walker.speech();
      this.node.setAttribute('hasspeech', 'true');
      this.Update();
      if (this.restarted && this.document.options.a11y[this.showRegion]) {
        this.region.Show(this.node, this.highlighter);
      }
    });
  }


  /**
   * @override
   */
  public KeyDown(event: KeyboardEvent) {
    const code = event.keyCode;
    this.walker.modifier = event.shiftKey;
    if (code === 27) {
      this.Stop();
      this.stopEvent(event);
      return;
    }
    if (this.active) {
      this.Move(code);
      if (this.triggerLink(code)) return;
      this.stopEvent(event);
      return;
    }
    if (code === 32 && event.shiftKey || code === 13) {
      this.Start();
      this.stopEvent(event);
    }
  }

  /**
   * Programmatically triggers a link if the focused node contains one.
   * @param {number} code The keycode of the last key pressed.
   */
  protected triggerLink(code: number) {
    if (code !== 13) {
      return false;
    }
    let node = this.walker.getFocus().getNodes()?.[0];
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
   * @override
   */
  public Move(key: number) {
    this.walker.move(key);
    this.Update();
  }

  /**
   * Initialises the SRE walker.
   */
  private initWalker() {
    this.speechGenerator = SpeechGeneratorFactory.generator('Tree');
    let dummy = WalkerFactory.walker(
      'dummy', this.node, this.speechGenerator, this.highlighter, this.mml);
    this.walker = dummy;
  }

  /**
   * Retrieves the speech options to sync with document options.
   * @return {{[key: string]: string}} The options settings for the speech
   *     generator.
   */
  private getOptions(): {[key: string]: string} {
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

}


/**
 * Explorer that magnifies what is currently explored. Uses a hover region.
 * @constructor
 * @extends {AbstractKeyExplorer}
 */
export class Magnifier extends AbstractKeyExplorer<HTMLElement> {

  /**
   * @constructor
   * @extends {AbstractKeyExplorer}
   */
  constructor(public document: A11yDocument,
              protected region: Region<HTMLElement>,
              protected node: HTMLElement,
              private mml: string) {
    super(document, region, node);
    this.walker = WalkerFactory.walker(
      'table', this.node, SpeechGeneratorFactory.generator('Dummy'),
      this.highlighter, this.mml);
  }

  /**
   * @override
   */
  public Update(force: boolean = false) {
    super.Update(force);
    this.showFocus();
  }


  /**
   * @override
   */
  public Start() {
    super.Start();
    if (!this.attached) return;
    this.region.Show(this.node, this.highlighter);
    this.walker.activate();
    this.Update();
  }


  /**
   * Shows the nodes that are currently focused.
   */
  private showFocus() {
    let node = this.walker.getFocus().getNodes()[0] as HTMLElement;
    this.region.Show(node, this.highlighter);
  }


  /**
   * @override
   */
  public Move(key: number) {
    let result = this.walker.move(key);
    if (result) {
      this.Update();
    }
  }


  /**
   * @override
   */
  public KeyDown(event: KeyboardEvent) {
    const code = event.keyCode;
    this.walker.modifier = event.shiftKey;
    if (code === 27) {
      this.Stop();
      this.stopEvent(event);
      return;
    }
    if (this.active && code !== 13) {
      this.Move(code);
      this.stopEvent(event);
      return;
    }
    if (code === 32 && event.shiftKey || code === 13) {
      this.Start();
      this.stopEvent(event);
    }
  }

}
