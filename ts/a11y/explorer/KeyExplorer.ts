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


import {A11yDocument, Region, HoverRegion, SpeechRegion, LiveRegion} from './Region.js';
import {Explorer, AbstractExplorer} from './Explorer.js';
import {ExplorerPool} from './ExplorerPool.js';
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


const codeSelector = 'mjx-container[role="application"][data-shellac]';
const nav = '[role="application"][data-shellac],[role="tree"],[role="group"],[role="treeitem"]';

function isCodeBlock(el: HTMLElement) {
  return el.matches(codeSelector);
}

/**
 * @constructor
 * @extends {AbstractExplorer}
 *
 * @template T  The type that is consumed by the Region of this explorer.
 */
export class SpeechExplorer extends AbstractExplorer<void> implements KeyExplorer {

  // public newWalker = new Walker();

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

  /**
   * @override
   */
  protected events: [string, (x: Event) => void][] =
    super.Events().concat(
      [
        // ['keydown', move],
        ['keydown', this.KeyDown.bind(this)],
        ['click', this.Click.bind(this)],
        ['focusin', this.FocusIn.bind(this)],
        ['focusout', this.FocusOut.bind(this)]
      ]);

  public Click(e: MouseEvent) {
    const clicked = (e.target as HTMLElement).closest(nav) as HTMLElement;
    if (this.node.contains(clicked)) {
      const prev = this.node.querySelector('[tabindex="0"][role="tree"],[tabindex="0"][role="group"],[tabindex="0"][role="treeitem"]');
      if (prev) {
        prev.removeAttribute('tabindex');
      }
      clicked.setAttribute('tabindex', '0');
      clicked.focus();
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
  public FocusIn(_event: FocusEvent) {
  }

  /**
   * @override
   */
  public FocusOut(_event: FocusEvent) {
    // this.Stop();
  }

  /**
   * @override
   */
  public Attach() {
    super.Attach();
    this.attached = true;
    this.oldIndex = this.node.tabIndex;
    this.node.tabIndex = 0;
    this.node.setAttribute('role', 'application');
    // TODO: Get rid of this eventually!
    this.node.setAttribute('data-shellac', '');
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
  public Move(e: KeyboardEvent) {
    function nextFocus(): HTMLElement {
      function nextSibling(el: HTMLElement): HTMLElement {
        const sib = el.nextElementSibling as HTMLElement;
        if (sib) {
          if (sib.matches(nav)) {
            return sib;
          } else {
            const sibChild = sib.querySelector(nav) as HTMLElement;
            return sibChild ?? nextSibling(sib);
          }
        } else {
          if (!isCodeBlock(el) && !el.parentElement.matches(nav)) {
            return nextSibling(el.parentElement);
          } else {
            return null;
          }
        }
      }

      function prevSibling(el: HTMLElement): HTMLElement {
        const sib = el.previousElementSibling as HTMLElement;
        if (sib) {
          if (sib.matches(nav)) {
            return sib;
          } else {
            const sibChild = sib.querySelector(nav) as HTMLElement;
            return sibChild ?? prevSibling(sib);
          }
        } else {
          if (!isCodeBlock(el) && !el.parentElement.matches(nav)) {
            return prevSibling(el.parentElement);
          } else {
            return null;
          }
        }
      }

      const target = e.target as HTMLElement;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          return target.querySelector(nav);
        case 'ArrowUp':
          e.preventDefault();
          return target.parentElement.closest(nav);
        case 'ArrowLeft':
          e.preventDefault();
          return prevSibling(target);
        case 'ArrowRight':
          e.preventDefault();
          return nextSibling(target);
        // case 'Esc':
        //   e.preventDefault();
        //   return this.hideRegions();
        default:
          return null;
      }
    }

    const next = nextFocus();

    const target = e.target as HTMLElement;
    if (next) {
      target.removeAttribute('tabindex');
      next.setAttribute('tabindex', '0');
      next.focus();
      this.current = next;
      return true;
    }
    return false;
  }

  /**
   * @override
   */
  public NoMove() {
    let ac = new AudioContext();
    let os = ac.createOscillator();
    os.frequency.value = 300;
    os.connect(ac.destination);
    os.start(ac.currentTime);
    os.stop(ac.currentTime + .05);
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

  private init: boolean = false;

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
              private _mml: string) {
    super(document, pool, null, node);
    // this.initWalker();
  }


  /**
   * @override
   */
  public Start() {
    if (!this.attached) return;
    if (this.active) return;
    super.Start();
    // let options = this.getOptions();
    // if (!this.init) {
    //   this.init = true;
    //   SpeechExplorer.updatePromise = SpeechExplorer.updatePromise.then(async () => {
    //     return Sre.sreReady()
    //       .then(() => Sre.setupEngine({locale: options.locale}))
    //       .then(() => {
    //         // Important that both are in the same block so speech explorers
    //         // are restarted sequentially.
    //         this.Speech(this.walker);
    //       })
    //       .then(() => Sre.setupEngine({automark: false as any, markup: 'none',
    //                                    locale: 'nemeth', domain: 'default',
    //                                    style: 'default', modality: 'braille'}))
    //       .then(() => {
    //         this.speechGenerator.setOptions({automark: false as any, markup: 'none',
    //                                    locale: 'nemeth', domain: 'default',
    //                                    style: 'default', modality: 'braille'});
    //         this.Speech(this.walker);
    //         this.Start();
    //       });
    //   })
    //   return;
    // }
    // this.speechGenerator = Sre.getSpeechGenerator('Direct');
    // this.speechGenerator.setOptions(options);
    // this.walker = Sre.getWalker(
    //   'table', this.node, this.speechGenerator, this.highlighter, this.mml);
    // this.walker.activate();
    if (this.document.options.a11y.subtitles) {
      console.log(0);
      SpeechExplorer.updatePromise.then(
        () => this.region.Show(this.node, this.highlighter))
    }
    if (this.document.options.a11y.viewBraille) {
      console.log(1);
      SpeechExplorer.updatePromise.then(
        () => this.brailleRegion.Show(this.node, this.highlighter))
    }
    if (this.document.options.a11y.keyMagnifier) {
      console.log(2);
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
    let noUpdate = force;
    force = false;
    if (!this.active && !force) return;
    this.pool.unhighlight();
    // let nodes = this.walker.getFocus(true).getNodes();
    // if (!nodes.length) {
    //   this.walker.refocus();
    //   nodes = this.walker.getFocus().getNodes();
    // }
    this.pool.highlight([this.current]);
    this.region.Update(this.current.getAttribute('aria-label'));
    this.brailleRegion.Update(this.current.getAttribute('aria-braillelabel'));
    console.log(this.magnifyRegion);
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
    if (code === 'Control') {
      speechSynthesis.cancel();
      return;
    }
    if (code === 'Escape') {
      this.Stop();
      this.stopEvent(event);
      return;
    }
    let result = null;
    if (this.active) {
      result = this.Move(event);
      this.stopEvent(event);
    }
    if (result) {
      this.Update();
      return;
    }
    if (!result && this.sound) {
      this.NoMove();
    }
    //
    if (this.triggerLinkKeyboard(code)) {
      this.Stop()
      return;
    }

    // this.stopEvent(event);
    if (code === 'Space' && event.shiftKey || code === 'Enter') {
      this.Start();
      this.stopEvent(event);
    }
  }

  /**
   * Programmatically triggers a link if the focused node contains one.
   * @param {number} code The keycode of the last key pressed.
   */
  protected triggerLinkKeyboard(code: string) {
    if (code !== 'Enter' || !this.active) {
      return false;
    }
    let node = this.current;
    return this.triggerLink(node);
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
   * Initialises the Sre walker.
   */
  // private initWalker() {
  //   this.speechGenerator = Sre.getSpeechGenerator('Tree');
  //   let dummy = Sre.getWalker(
  //     'dummy', this.node, this.speechGenerator, this.highlighter, this.mml);
  //   this.walker = dummy;
  // }

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


/**
 * Explorer that magnifies what is currently explored. Uses a hover region.
 * @constructor
 * @extends {AbstractKeyExplorer}
 */
// export class Magnifier extends AbstractKeyExplorer<HTMLElement> {

//   /**
//    * @constructor
//    * @extends {AbstractKeyExplorer}
//    */
//   constructor(public document: A11yDocument,
//               public pool: ExplorerPool,
//               public region: Region<HTMLElement>,
//               protected node: HTMLElement,
//               private mml: string) {
//     super(document, pool, region, node);
//     this.walker = Sre.getWalker(
//       'table', this.node, Sre.getSpeechGenerator('Dummy'),
//       this.highlighter, this.mml);
//   }

//   /**
//    * @override
//    */
//   public Update(force: boolean = false) {
//     super.Update(force);
//     this.showFocus();
//   }

//   /**
//    * @override
//    */
//   public Start() {
//     super.Start();
//     if (!this.attached) return;
//     this.region.Show(this.node, this.highlighter);
//     this.walker.activate();
//     this.Update();
//   }

//   /**
//    * Shows the nodes that are currently focused.
//    */
//   private showFocus() {
//     let node = this.walker.getFocus().getNodes()[0] as HTMLElement;
//     this.region.Show(node, this.highlighter);
//   }

//   /**
//    * @override
//    */
//   public KeyDown(event: KeyboardEvent) {
//     const code = event.keyCode;
//     this.walker.modifier = event.shiftKey;
//     if (code === 27) {
//       this.Stop();
//       this.stopEvent(event);
//       return;
//     }
//     if (this.active && code !== 13) {
//       this.Move(code);
//       this.stopEvent(event);
//       return;
//     }
//     if (code === 32 && event.shiftKey || code === 13) {
//       this.Start();
//       this.stopEvent(event);
//     }
//   }

// }
