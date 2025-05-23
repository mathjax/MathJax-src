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

import { HoverRegion, SpeechRegion, LiveRegion } from './Region.js';
import { STATE } from '../../core/MathItem.js';
import type { ExplorerMathItem, ExplorerMathDocument } from '../explorer.js';
import { Explorer, AbstractExplorer } from './Explorer.js';
import { ExplorerPool } from './ExplorerPool.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { honk, SemAttr } from '../speech/SpeechUtil.js';
import { GeneratorPool } from '../speech/GeneratorPool.js';
import { context } from '../../util/context.js';

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
   * A method that is executed if no move is executed.
   */
  NoMove(): void;
}

/**********************************************************************/

/**
 * Type of function that implements a key press action
 */
type keyMapping = (
  explorer: SpeechExplorer,
  event: KeyboardEvent
) => boolean | void;

/**
 * Selectors for walking.
 */
const nav = '[data-speech-node]';

/**
 * Predicate to check if element is a MJX container.
 *
 * @param {HTMLElement} el The HTML element.
 * @returns {boolean} True if the element is an mjx-container.
 */
export function isContainer(el: HTMLElement): boolean {
  return el.matches('mjx-container');
}

/**
 * Test if an event has any modifier keys
 *
 * @param {MouseEvent|KeyboardEvent} event   The event to check
 * @param {boolean} shift                    True if shift is to be included in check
 * @returns {boolean}                        True if shift, ctrl, alt, or meta key is pressed
 */
export function hasModifiers(
  event: MouseEvent | KeyboardEvent,
  shift: boolean = true
): boolean {
  return (
    (event.shiftKey && shift) || event.metaKey || event.altKey || event.ctrlKey
  );
}

/**********************************************************************/

/**
 * Creates a customized help dialog
 *
 * @param {string} title   The title to use for the message
 * @param {string} select  Additional ways to select the typeset math
 * @returns {string}       The customized message
 */
function helpMessage(title: string, select: string): string {
  return `
<H2>Exploring expressions ${title}</h2>

<p>The mathematics on this page is being rendered by <a
href="https://www.mathjax.org/" target="_blank">MathJax</a>, which
generates both the text spoken by screen readers, as well as the
visual layout for sighted users.</p>

<p>Expressions typeset by MathJax can be explored interactively, and
are focusable.  You can use the TAB key to move to a typeset
expression${select}.  Initially, the expression will be read in full,
but you can use the following keys to explore the expression
further:<p>

<ul>

<li><b>Down Arrow</b> moves one level deeper into the expression to
allow you to explore the current subexpression term by term.</li>

<li><b>Up Arrow</b> moves back up a level within the expression.</li>

<li><b>Right Arrow</b> moves to the next term in the current
subexpression.</li>

<li><b>Left Arrow</b> moves to the next term in the current
subexpression.</li>

<li><b>Enter</b> or <b>Return</b> clicks a link or activates an active
subexpression.</li>

<li><b>Space</b> opens the MathJax contextual menu where you can view
or copy the source format of the expression, or modify MathJax's
settings.</li>

<li><b>Escape</b> exits the expression explorer.</li>

<li><b>x</b> gives a summary of the current subexpression.</li>

<li><b>d</b> gives the current depth within the expression.</li>

<li><b>&gt;</b> cycles through the available speech rule sets
(MathSpeak, ClearSpeak, ChromeVox).</li>

<li><b>&lt;</b> cycles through the verbosity levels for the current
rule set.</li>

<li><b>h</b> produces this help listing.</li>
</ul>

<p>The MathJax contextual menu allows you to enable or disable speech
or Braille generation for mathematical expressions, the language to
use for the spoken mathematics, and other features of MathJax.  In
particular, the Explorer submenu allows you to specify how the
mathematics should be identified in the page (e.g., by saying "math"
when the expression is spoken), and whether or not to include a
message about the letter "h" bringing up this dialog box.</p>

<p>The contextual menu also provides options for viewing or copying a
MathML version of the expression or its original source format,
creating an SVG version of the expression, and viewing various other
information.</p>

<p>For more help, see the <a
href="https://docs.mathjax.org/en/latest/basic/accessibility.html"
targe="_blank">MathJax accessibility documentation.</a></p>
`;
}

/**
 * Help for the different OS versions
 */
const helpData: Map<string, [string, string]> = new Map([
  [
    'MacOS',
    [
      'on Mac OS and iOS using VoiceOver',
      ', or the VoiceOver arrow keys to select an expression',
    ],
  ],
  [
    'Windows',
    [
      'in Windows using NVDA or JAWS',
      `. The screen reader should enter focus or forms mode automatically
when the expression gets the browser focus, but if not, you can toggle
focus mode using NVDA+space in NVDA; for JAWS, Enter should start
forms mode while Numpad Plus leaves it.  Also note that you can use
the NVDA or JAWS key plus the arrow keys to explore the expression
even in browse mode, and you can use NVDA+shift+arrow keys to
navigate out of an expression that has the focus in NVDA`,
    ],
  ],
  [
    'Unix',
    [
      'in Unix using Orca',
      `, and Orca should enter focus mode automatically.  If not, use the
Orca+a key to toggle focus mode on or off.  Also note that you can use
Orca+arrow keys to explore expressions even in browse mode`,
    ],
  ],
  ['unknown', ['with a Screen Reader.', '']],
]);

/**********************************************************************/
/**********************************************************************/

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
  /*
   * The explorer key mapping
   */
  protected static keyMap: Map<string, keyMapping> = new Map([
    ['Tab', () => true],
    ['Control', (explorer) => explorer.controlKey()],
    ['Escape', (explorer) => explorer.escapeKey()],
    ['Enter', (explorer, event) => explorer.enterKey(event)],
    ['ArrowDown', (explorer) => (explorer.active ? explorer.moveDown() : true)],
    ['ArrowUp', (explorer) => (explorer.active ? explorer.moveUp() : true)],
    ['ArrowLeft', (explorer) => (explorer.active ? explorer.moveLeft() : true)],
    [
      'ArrowRight',
      (explorer) => (explorer.active ? explorer.moveRight() : true),
    ],
    [' ', (explorer) => explorer.spaceKey()],
    ['h', (explorer) => explorer.hKey()],
    ['H', (explorer) => explorer.hKey()],
    ['>', (explorer) => (explorer.active ? explorer.nextRules() : false)],
    ['<', (explorer) => (explorer.active ? explorer.nextStyle() : false)],
    ['x', (explorer) => (explorer.active ? explorer.summary() : false)],
    ['X', (explorer) => (explorer.active ? explorer.summary() : false)],
    ['d', (explorer) => (explorer.active ? explorer.depth() : false)],
    ['D', (explorer) => (explorer.active ? explorer.depth() : false)],
  ] as [string, keyMapping][]);

  /**
   * Switches on or off the use of sound on this explorer.
   */
  public sound: boolean = false;

  /**
   * Convenience getter for generator pool of the item.
   *
   * @returns {GeneratorPool} The item's generator pool.
   */
  private get generators(): GeneratorPool<HTMLElement, Text, Document> {
    return this.item?.generatorPool;
  }

  /**
   * Shorthand for the item's ARIA role
   *
   * @returns {string}  The role
   */
  protected get role(): string {
    return this.item.ariaRole;
  }

  /**
   * Shorthand for the item's ARIA role description
   *
   * @returns {string}  The role description
   */
  protected get description(): string {
    return this.item.roleDescription;
  }

  /**
   * Shorthand for the item's "none" indicator
   *
   * @returns {string}  The string to use for no description
   */
  protected get none(): string {
    return this.item.none;
  }

  /**
   * The currently focused element.
   */
  protected current: HTMLElement = null;

  /**
   * The clicked node from a mousedown event
   */
  protected clicked: HTMLElement = null;

  /**
   * Node to focus on when restarted
   */
  public refocus: HTMLElement = null;

  /**
   * True when we are refocusing on the speech node
   */
  protected focusSpeech: boolean = false;

  /**
   * Selector string for re-focusing after re-rendering
   */
  public restarted: string = null;

  /**
   * The transient speech node
   */
  protected speech: HTMLElement = null;

  /**
   * Set to 'd' when depth is showing, 'x' when summary, '' when speech.
   */
  protected speechType: string = '';

  /**
   * The speech node when the top-level node has no role
   */
  protected img: HTMLElement = null;

  /**
   * True when top-level role is none
   */
  protected descend: boolean = false;

  /**
   * True when explorer is attached to a node
   */
  public attached: boolean = false;

  /**
   * Treu if events of the explorer are attached.
   */
  private eventsAttached: boolean = false;

  /********************************************************************/
  /*
   * The event handlers
   */

  /**
   * @override
   */
  protected events: [string, (x: Event) => void][] = super.Events().concat([
    ['focusin', this.FocusIn.bind(this)],
    ['focusout', this.FocusOut.bind(this)],
    ['keydown', this.KeyDown.bind(this)],
    ['mousedown', this.MouseDown.bind(this)],
    ['click', this.Click.bind(this)],
    ['dblclick', this.DblClick.bind(this)],
  ]);

  /**
   * @override
   */
  public FocusIn(_event: FocusEvent) {
    if (this.item.outputData.nofocus) {
      //
      // we are refocusing after a menu or dialog box has closed
      //
      this.item.outputData.nofocus = false;
      return;
    }
    if (!this.clicked) {
      this.Start();
    }
    this.clicked = null;
  }

  /**
   * @override
   */
  public FocusOut(_event: FocusEvent) {
    if (this.current && !this.focusSpeech) {
      this.setCurrent(null);
      this.Stop();
      if (!document.hasFocus()) {
        this.focusTop();
      }
    }
  }

  /**
   * @override
   */
  public KeyDown(event: KeyboardEvent) {
    if (hasModifiers(event, false)) return;
    //
    // Get the key action, if there is one and perform it
    //
    const CLASS = this.constructor as typeof SpeechExplorer;
    const action = CLASS.keyMap.get(event.key);
    const result = action ? action(this, event) : this.undefinedKey(event);
    //
    // If result is true, propagate event,
    // Otherwise stop the event, and if false, play the honk sound
    //
    if (result) return;
    this.stopEvent(event);
    if (result === false && this.sound) {
      this.NoMove();
    }
  }

  /**
   * Handle clicks that perform selections, and keep track of clicked node
   * so that the focusin event will know something was clicked.
   *
   * @param {MouseEvent} event   The mouse down event
   */
  private MouseDown(event: MouseEvent) {
    if (hasModifiers(event) || event.buttons === 2) {
      this.item.outputData.nofocus = true;
      return;
    }
    //
    // Get the speech element that was clicked
    //
    const clicked = this.findClicked(
      event.target as HTMLElement,
      event.x,
      event.y
    );
    //
    // If it is the info icon, top the event and let the click handler process it
    //
    if (clicked === this.document.infoIcon) {
      this.stopEvent(event);
      return;
    }
    //
    // Remove any selection ranges and
    // If the target is the highlight rectangle, refocus on the clicked element
    //   otherwise record the click for the focusin handler
    //
    document.getSelection()?.removeAllRanges();
    if ((event.target as HTMLElement).getAttribute('sre-highlighter-added')) {
      this.refocus = clicked;
    } else {
      this.clicked = clicked;
    }
  }

  /**
   * Handle a click event
   *
   * @param {MouseEvent} event   The mouse click event
   */
  public Click(event: MouseEvent) {
    //
    // If we are extending a click region, focus out
    //
    if (
      hasModifiers(event) ||
      event.buttons === 2 ||
      document.getSelection().type === 'Range'
    ) {
      this.FocusOut(null);
      return;
    }
    //
    // Get the speech element that was clicked
    //
    const clicked = this.findClicked(
      event.target as HTMLElement,
      event.x,
      event.y
    );
    //
    // If it was the info icon, open the help dialog
    //
    if (clicked === this.document.infoIcon) {
      this.stopEvent(event);
      this.help();
      return;
    }
    //
    // If the node contains the clicked element,
    //   don't propagate the event
    //   focus on the clicked element when focusin occurs
    //   start the explorer if this isn't a link
    //
    if (!clicked || this.node.contains(clicked)) {
      this.stopEvent(event);
      this.refocus = clicked;
      if (!this.triggerLinkMouse()) {
        this.Start();
      }
    }
  }

  /**
   * Handle a double-click event (focus full expression)
   *
   * @param {MouseEvent} event   The mouse click event
   */
  public DblClick(event: MouseEvent) {
    const direction = (document.getSelection() as any).direction ?? 'none';
    if (hasModifiers(event) || event.buttons === 2 || direction !== 'none') {
      this.FocusOut(null);
    } else {
      this.stopEvent(event);
      this.refocus = this.node.querySelector(nav);
      this.Start();
    }
  }

  /********************************************************************/
  /*
   * The Key action functions
   */

  /**
   * The space key opens the menu, so it propagates, but we retain the
   * current focus to refocus it when the menu closes.
   *
   * @returns {boolean}  Don't cancel the event
   */
  protected spaceKey(): boolean {
    this.refocus = this.current;
    return true;
  }

  /**
   * Stop speaking.
   *
   * @returns {boolean}  Don't cancel the event
   */
  protected controlKey(): boolean {
    speechSynthesis.cancel();
    return true;
  }

  /**
   * Open the help dialog, and refocus when it closes.
   */
  protected hKey() {
    this.refocus = this.current;
    this.help();
  }

  /**
   * Stop exploring and focus the top element
   *
   * @returns {boolean}  Don't cancel the event
   */
  protected escapeKey(): boolean {
    this.Stop();
    this.focusTop();
    return true;
  }

  /**
   * Process Enter key events
   *
   * @param {KeyboardEvent} event  The event for the enter key
   * @returns {void | boolean}     False means play the honk sound
   */
  protected enterKey(event: KeyboardEvent): void | boolean {
    if (this.active) {
      if (this.triggerLinkKeyboard(event)) {
        this.Stop();
      } else {
        const expandable = this.actionable(this.current);
        if (!expandable) {
          return false;
        }
        this.refocus = expandable;
        expandable.dispatchEvent(new Event('click'));
      }
    } else {
      this.Start();
    }
  }

  /**
   * Move to deeper level in the expression
   *
   * @returns {boolean | void}  False if no node, void otherwise
   */
  protected moveDown(): boolean | void {
    return this.moveTo(this.current.querySelector(nav));
  }

  /**
   * Move to higher level in expression
   *
   * @returns {boolean | void}  False if no node, void otherwise
   */
  protected moveUp(): boolean | void {
    return this.moveTo(this.current.parentElement.closest(nav));
  }

  /**
   * Move to next term in the expression
   *
   * @returns {boolean | void}  False if no node, void otherwise
   */
  protected moveRight(): boolean | void {
    return this.moveTo(this.nextSibling(this.current));
  }

  /**
   * Move to previous term in the expression
   *
   * @returns {boolean | void}  False if no node, void otherwise
   */
  protected moveLeft(): boolean | void {
    return this.moveTo(this.prevSibling(this.current));
  }

  /**
   * Move to a specified node, unless it is null
   *
   * @param {HTMLElement} node   The node to move it
   * @returns {boolean | void}   False if no node, void otherwise
   */
  protected moveTo(node: HTMLElement): void | boolean {
    if (!node) return false;
    this.setCurrent(node);
  }

  /**
   * Determine if an event that is not otherwise mapped should be
   * allowed to propagate.
   *
   * @param {KeyboardEvent} event   The event to check
   * @returns {boolean}             True if not active or the event has a modifier
   */
  protected undefinedKey(event: KeyboardEvent): boolean {
    return !this.active || hasModifiers(event);
  }

  /**
   * Computes the nesting depth announcement for the currently focused sub
   * expression.
   */
  public depth() {
    if (this.speechType === 'd') {
      this.setCurrent(this.current);
      return;
    }
    this.speechType = 'd';
    const parts = [
      [
        this.node.getAttribute('data-semantic-level') ?? 'Level',
        this.current.getAttribute('aria-level') ?? '0',
      ]
        .join(' ')
        .trim(),
    ];
    const action = this.actionable(this.current);
    if (action) {
      parts.unshift(
        this.node.getAttribute(
          action.getAttribute('toggle') === '1'
            ? 'data-semantic-expandable'
            : 'data-semantic-collapsible'
        ) ?? ''
      );
    }
    this.speak(parts.join(' '), this.current.getAttribute(SemAttr.BRAILLE));
  }

  /**
   * Computes the summary for this expression.
   */
  public summary() {
    if (this.speechType === 'x') {
      this.setCurrent(this.current);
      return;
    }
    this.speechType = 'x';
    const summary = this.current.getAttribute(SemAttr.SUMMARY);
    this.speak(
      summary,
      this.current.getAttribute(SemAttr.BRAILLE),
      this.SsmlAttributes(this.current, SemAttr.SUMMARY_SSML)
    );
  }

  /**
   * Cycles to next speech rule set if possible and recomputes the speech for
   * the expression.
   */
  public nextRules() {
    this.node.removeAttribute('data-speech-attached');
    this.restartAfter(this.generators.nextRules(this.item));
  }

  /**
   * Cycles to next speech style or preference if possible and recomputes the
   * speech for the expression.
   */
  public nextStyle() {
    this.node.removeAttribute('data-speech-attached');
    this.restartAfter(this.generators.nextStyle(this.current, this.item));
  }

  /**
   * Displays the help dialog.
   */
  protected help() {
    const adaptor = this.document.adaptor;
    const helpSizer = adaptor.node('mjx-help-sizer', {}, [
      adaptor.node(
        'mjx-help-dialog',
        { tabindex: 0, role: 'dialog', 'aria-labeledby': 'mjx-help-label' },
        [
          adaptor.node('h1', { id: 'mjx-help-label' }, [
            adaptor.text('MathJax Expression Explorer Help'),
          ]),
          adaptor.node('div'),
          adaptor.node('input', { type: 'button', value: 'Close' }),
        ]
      ),
    ]);
    document.body.append(helpSizer);
    const help = helpSizer.firstChild as HTMLElement;
    help.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        help.remove();
        this.node.focus();
        this.stopEvent(event);
      }
    });
    help.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!help.contains(document.activeElement)) {
          help.remove();
        }
      }, 10);
    });
    help.lastChild.addEventListener('click', () => {
      help.remove();
      this.node.focus();
    });
    const [title, select] = helpData.get(context.os);
    (help.childNodes[1] as HTMLElement).innerHTML = helpMessage(title, select);
    help.focus();
  }

  /********************************************************************/
  /*
   * Methods to handle the currently selected node and its speech
   */

  /**
   * Set the currently selected node and speak its label, if requested.
   *
   * @param {HTMLElement} node         The node that should become current
   * @param {boolean} addSpeech        True if speech is to be added for that node
   * @param {boolean} addDescription   True if the speech node should get a description
   */
  protected setCurrent(
    node: HTMLElement,
    addSpeech: boolean = true,
    addDescription: boolean = false
  ) {
    this.speechType = '';
    if (!document.hasFocus()) {
      this.refocus = this.current;
    }
    //
    // Let AT know we are making changes
    //
    this.node.setAttribute('aria-busy', 'true');
    //
    // If there is a current selection
    //   clear it and remove the associated speech
    //   if we aren't setting a new selection
    //   (i.e., we are focusing out)
    //
    if (this.current) {
      this.current.classList.remove('mjx-selected');
      this.pool.unhighlight();
      if (!node) {
        this.restarted = this.semanticFocus();
        this.removeSpeech();
      }
      this.current = null;
    }
    //
    // If there is a current node
    //   Select it and add its speech, if requested
    //
    this.current = node;
    if (this.current) {
      this.current.classList.add('mjx-selected');
      this.pool.highlight([this.current]);
      if (addSpeech) {
        this.addSpeech(node, addDescription);
      }
    }
    //
    // Done making changes
    //
    this.node.removeAttribute('aria-busy');
  }

  /**
   * Remove the top-level speech node and create
   *   a temporary one for the given node.
   *
   * @param {HTMLElement} node   The node to be spoken
   * @param {boolean} describe   True if the description should be added
   */
  protected addSpeech(node: HTMLElement, describe: boolean) {
    this.img?.remove();
    let speech = [
      node.getAttribute(SemAttr.PREFIX),
      node.getAttribute(SemAttr.SPEECH),
      node.getAttribute(SemAttr.POSTFIX),
    ]
      .join(' ')
      .trim();
    if (describe) {
      let description =
        this.description === this.none ? '' : ', ' + this.description;
      if (this.descend && this.document.options.a11y.help) {
        description += ', press h for help';
      }
      speech += description;
    }
    this.speak(
      speech,
      node.getAttribute(SemAttr.BRAILLE),
      this.SsmlAttributes(node, SemAttr.SPEECH_SSML)
    );
    this.node.setAttribute('tabindex', '-1');
  }

  /**
   * If there is a speech node, remove it
   *   and put back the top-level node, if needed.
   */
  protected removeSpeech() {
    if (this.speech) {
      this.speech.remove();
      this.speech = null;
      this.node.append(this.img);
      this.node.setAttribute('tabindex', '0');
    }
  }

  /**
   * Create a new speech node and sets its needed attributes,
   *   then add it to the container and focus it.  If there is
   *   and old speech node, remove it after a delay (the delay
   *   is needed for Orca on Linux).
   *
   * @param {string} speech        The string to speak
   * @param {string} braille       The braille string
   * @param {string[]} ssml        The SSML attributes to add
   * @param {string} description   The description to add to the speech
   */
  public speak(
    speech: string,
    braille: string = '',
    ssml: string[] = null,
    description: string = this.none
  ) {
    if (!speech) {
      speech = 'blank';
    }
    const oldspeech = this.speech;
    this.speech = document.createElement('mjx-speech');
    this.speech.setAttribute('role', 'math');
    this.speech.setAttribute('aria-label', speech);
    this.speech.setAttribute(SemAttr.SPEECH, speech);
    if (ssml) {
      this.speech.setAttribute(SemAttr.PREFIX_SSML, ssml[0] || '');
      this.speech.setAttribute(SemAttr.SPEECH_SSML, ssml[1] || '');
      this.speech.setAttribute(SemAttr.POSTFIX_SSML, ssml[2] || '');
    }
    if (braille) {
      this.speech.setAttribute('aria-braillelabel', braille);
    }
    this.speech.setAttribute('aria-roledescription', description);
    this.speech.setAttribute('tabindex', '0');
    this.node.append(this.speech);
    this.focusSpeech = true;
    this.speech.focus();
    this.focusSpeech = false;
    this.Update();
    if (oldspeech) {
      setTimeout(() => oldspeech.remove(), 0);
    }
  }

  /**
   * Set up the MathItem output to handle the speech exploration
   */
  public attachSpeech() {
    const item = this.item;
    const container = this.node;
    const speech = container.getAttribute(SemAttr.SPEECH) || '';
    for (const child of Array.from(container.childNodes) as HTMLElement[]) {
      child.setAttribute('aria-hidden', 'true'); // hide the content
    }
    container.setAttribute('has-speech', 'true');
    const description = item.roleDescription;
    if (!this.descend) {
      container.setAttribute('aria-label', speech);
      container.setAttribute('role', item.ariaRole);
      container.setAttribute('aria-roledescription', description);
    }
    this.img?.remove();
    this.img = this.document.adaptor.node('mjx-speech', {
      'aria-label': speech + (description ? ', ' + description : ''),
      role: 'img',
      'aria-roledescription': item.none,
    });
    container.appendChild(this.img);
    // this.updateAT();
  }

  /**
   * Replace the container with a cloned version so AT will be
   * informed of the new attributes (needed for Orca in particular).
   */
  protected updateAT() {
    const container = this.node;
    if (!container.parentNode) return;
    const store = this.document.menu?.menu?.store;
    if (store) {
      store.remove(container);
      container.classList.remove(store.attachedClass);
    }
    const item = this.item;
    this.node = container.cloneNode(false) as HTMLElement;
    if (item.end.node === item.typesetRoot) {
      item.start.node = item.end.node = this.node;
    }
    item.typesetRoot = this.node;
    for (const child of Array.from(container.childNodes)) {
      this.node.append(child);
    }
    item.addListeners(this.document);
    container.parentNode.insertBefore(this.node, container);
    container.remove();
    store?.insert(this.node);
  }

  /**
   * Undo any changes from attachSpeech()
   */
  public detachSpeech() {
    const container = this.node;
    this.img?.remove();
    container.removeAttribute('aria-label');
    container.removeAttribute('role');
    container.removeAttribute('aria-roledescription');
    container.removeAttribute('has-speech');
    for (const child of Array.from(container.childNodes) as HTMLElement[]) {
      child.removeAttribute('aria-hidden');
    }
  }

  /********************************************************************/
  /*
   * Utility functions
   */

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

  /**
   * Find the speech node that was clicked, if any
   *
   * @param {HTMLElement} node   The target node that was clicked
   * @param {number} x           The x-coordinate of the click
   * @param {number} y           The y-coordinate of the click
   * @returns {HTMLElement}      The clicked node or null
   */
  protected findClicked(node: HTMLElement, x: number, y: number): HTMLElement {
    //
    // Check if the click is on the info icon and return that if it is.
    //
    const icon = this.document.infoIcon;
    if (icon === node || icon.contains(node)) {
      return icon;
    }
    //
    // For CHTML, get the closest navigable parent element.
    //
    if (this.node.getAttribute('jax') !== 'SVG') {
      return node.closest(nav) as HTMLElement;
    }
    //
    // For SVG, look through the tree to find the element whose bounding box
    // contains the click (x,y) position.
    //
    let found = null;
    let clicked = this.node;
    while (clicked) {
      if (clicked.matches(nav)) {
        found = clicked; // could be this node, but check if a child is clicked
      }
      const nodes = Array.from(clicked.childNodes) as HTMLElement[];
      clicked = null;
      for (const child of nodes) {
        if (
          child !== this.speech &&
          child !== this.img &&
          child.tagName.toLowerCase() !== 'rect'
        ) {
          const { left, right, top, bottom } = child.getBoundingClientRect();
          if (left <= x && x <= right && top <= y && y <= bottom) {
            clicked = child;
            break;
          }
        }
      }
    }
    return found;
  }

  /**
   * Focus the container node without activating it (e.g., when Escape is pressed)
   */
  protected focusTop() {
    this.focusSpeech = true;
    this.node.focus();
    this.focusSpeech = false;
  }

  /**
   * Get the SSML attribute array
   *
   * @param {HTMLElement} node  The node whose SSML attributes are to be obtained
   * @param center
   * @returns {string[]}        The prefix/summary/postfix array
   */
  protected SsmlAttributes(node: HTMLElement, center: SemAttr): string[] {
    return [
      node.getAttribute(SemAttr.PREFIX_SSML),
      node.getAttribute(center),
      node.getAttribute(SemAttr.POSTFIX_SSML),
    ];
  }

  /**
   * Restarts the explorer after a promise resolves (e.g., for an maction rerender)
   *
   * @param {Promise<void>} promise  The promise to restart after
   */
  protected async restartAfter(promise: Promise<void>) {
    this.img.remove();
    this.img = null;
    await promise;
    this.pool.unhighlight();
    this.attachSpeech();
    const current = this.current;
    this.current = null;
    this.setCurrent(current);
  }

  /********************************************************************/
  /*
   * Base class overrides
   */

  /**
   * @param {ExplorerMathDocument} document The accessible math document.
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
    public document: ExplorerMathDocument,
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
   * Determine the node that should be made active when we start
   * (the refocus, current, or restarted node, if any otherwise null)
   *
   * @returns {HTMLElement}   The node to be made the current node
   */
  protected findStartNode(): HTMLElement {
    let node = this.refocus || this.current;
    if (!node && this.restarted) {
      node = this.node.querySelector(this.restarted);
    }
    this.refocus = this.restarted = null;
    return node;
  }

  /**
   * @override
   */
  public async Start() {
    //
    // If we aren't attached or already active, return
    //
    if (!this.attached || this.active) return;
    //
    // If there is no speech, request the speech and wait for it
    //
    if (this.item.state() < STATE.ATTACHSPEECH) {
      this.item.attachSpeech(this.document);
      await this.generators.promise;
    }
    //
    // If we are respnding to a focusin on the speech node, we are done
    //
    if (this.focusSpeech) return;
    //
    // Mark the node as active (for CSS that turns on the info icon)
    // and add the info icon.
    //
    this.node.classList.add('mjx-explorer-active');
    this.node.append(this.document.infoIcon);
    //
    // Get the node to make current, and determine if we need to add a
    // speech node (or just use the top-level node), then set the
    // current node (which creates the speech) and start the explorer.
    //
    const node = this.findStartNode();
    const add = this.descend || !!node;
    this.setCurrent(node || this.node.querySelector(nav), add, !node);
    super.Start();
    //
    // Add the help message if we are focusing the top-level node
    //
    if (!node && !this.descend && this.document.options.a11y.help) {
      const description = this.description;
      this.node.setAttribute(
        'aria-roledescription',
        (description === this.none ? '' : description + ' ') +
          'press h for help' +
          (context.os === 'unix' ? ' when focused' : '')
      );
    }
    //
    // Show any needed regions
    //
    const options = this.document.options;
    const a11y = options.a11y;
    if (a11y.subtitles && a11y.speech && options.enableSpeech) {
      this.region.Show(this.node, this.highlighter);
    }
    if (a11y.viewBraille && a11y.braille && options.enableBraille) {
      this.brailleRegion.Show(this.node, this.highlighter);
    }
    if (a11y.keyMagnifier) {
      this.magnifyRegion.Show(this.current, this.highlighter);
    }
    this.Update();
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      const description = this.description;
      if (this.node.getAttribute('aria-roledescription') !== description) {
        this.node.setAttribute('aria-roledescription', description);
      }
      this.node.classList.remove('mjx-explorer-active');
      this.document.infoIcon.remove();
      this.pool.unhighlight();
      this.magnifyRegion.Hide();
      this.region.Hide();
      this.brailleRegion.Hide();
    }
    super.Stop();
  }

  /**
   * @override
   */
  public Update() {
    if (!this.active) return;
    this.region.node = this.node;
    this.generators.updateRegions(
      this.speech || this.node,
      this.region,
      this.brailleRegion
    );
    this.magnifyRegion.Update(this.current);
  }

  /**
   * @override
   */
  public Attach() {
    if (this.attached) return;
    super.Attach();
    this.node.setAttribute('tabindex', '0');
    this.descend = this.role === 'none';
    this.attached = true;
  }

  /**
   * @override
   */
  public Detach() {
    super.RemoveEvents();
    this.node.removeAttribute('role');
    this.node.removeAttribute('aria-roledescription');
    this.node.removeAttribute('aria-label');
    this.img?.remove();
    if (this.active) {
      this.node.setAttribute('tabindex', '0');
    }
    this.attached = false;
  }

  /**
   * @override
   */
  public NoMove() {
    honk();
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
  public addListeners() {
    super.AddEvents();
  }

  /********************************************************************/
  /*
   * Actions and links
   */

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
   * Programmatically triggers a link if the focused node contains one.
   *
   * @param {KeyboardEvent} event The keyboard event for the last keydown event.
   * @returns {boolean} True if link was successfully triggered.
   */
  protected triggerLinkKeyboard(event: KeyboardEvent): boolean {
    if (!this.current) {
      if (event.target instanceof HTMLAnchorElement) {
        event.target.dispatchEvent(new MouseEvent('click'));
        return true;
      }
      return false;
    }
    return this.triggerLink(this.current);
  }

  /**
   * Executiving the trigger the link action.
   *
   * @param {HTMLElement} node The node with the link.
   * @returns {boolean} True if link was successfully triggered.
   */
  protected triggerLink(node: HTMLElement): boolean {
    const focus = node
      ?.getAttribute('data-semantic-postfix')
      ?.match(/(^| )link($| )/);
    if (focus) {
      node.parentNode.dispatchEvent(new MouseEvent('click'));
      setTimeout(() => this.FocusOut(null), 50);
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
    let node = this.refocus;
    while (node && node !== this.node) {
      if (this.triggerLink(node)) {
        return true;
      }
      node = node.parentNode as HTMLElement;
    }
    return false;
  }

  /**
   * @returns {string} The semantic id of the node that is currently focused.
   */
  public semanticFocus(): string {
    const focus = [];
    let name = 'data-semantic-id';
    let node = this.current || this.node;
    const action = this.actionable(node);
    if (action) {
      name = action.hasAttribute('data-maction-id') ? 'data-maction-id' : 'id';
      node = action;
      focus.push(nav);
    }
    focus.unshift(`[${name}="${node.getAttribute(name)}"]`);
    return focus.join(' ');
  }
}
