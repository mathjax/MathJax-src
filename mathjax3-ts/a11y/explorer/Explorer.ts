import {A11yDocument, DummyRegion, HoverRegion, Region, ToolTip} from './Region.js';
import {sreReady} from '../sre.js';


export interface Explorer {

  /**
   * Flag indicating if the explorer is active.
   * @type {boolean}
   */
  active: boolean;

  /**
   * Flag indicating if event bubbling is stopped.
   * @type {boolean}
   */
  stoppable: boolean;

  /**
   * Attaches navigator and its event handlers to a node.
   */
  Attach(): void;

  /**
   * Detaches navigator and its event handlers to a node.
   */
  Detach(): void;

  /**
   * Starts the explorer.
   */
  Start(): void;

  /**
   * Stops the explorer.
   */
  Stop(): void;


  /**
   * Adds the events of the explorer to the node's event listener.
   */
  AddEvents(): void;

  /**
   * Removes the events of the explorer from the node's event listener.
   */
  RemoveEvents(): void;

  /**
   * Update the explorer after state changes.
   * @param {boolean=} force Forces the update in any case. (E.g., even if
   *     explorer is inactive.)
   */
  Update(force?: boolean): void;

}


/**
 * Abstract class implementing the very basic explorer functionality.
 *
 * Explorers use creator pattern to ensure they automatically attach themselves
 * to their node. This class provides the create method and is consequently not
 * declared abstract.
 *
 * @constructor
 * @implements {Explorer}
 * @template T
 */
export class AbstractExplorer<T> implements Explorer {


  /**
   * @override
   */
  public stoppable: boolean = true;

  /**
   * Named events and their functions.
   * @type {[string, function(x: Event)][]}
   */
  protected events: [string, (x: Event) => void][] = [];

  /**
   * The SRE highlighter associated with the walker.
   * @type {sre.Highlighter}
   */
  protected highlighter: sre.Highlighter = this.getHighlighter();

  private _active: boolean = false;
  private oldIndex: number = null;


  /**
   * Stops event bubbling.
   * @param {Event} event The event that is stopped.
   */
  protected static stopEvent(event: Event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else if (event.stopPropagation) {
      event.stopPropagation();
    }
    event.cancelBubble = true;
  }

  /**
   * Creator pattern for explorers.
   * @param {A11yDocument} document The current document.
   * @param {Region<T>} region A region to display results.
   * @param {HTMLElement} node The node on which the explorer works.
   * @param {any[]} ...rest Remaining information.
   * @return {Explorer} An object of the particular explorer class.
   *
   * @template T
   */
  public static create<T>(document: A11yDocument,
                region: Region<T>,
                node: HTMLElement, ...rest: any[]): Explorer {
    let explorer = new this(document, region, node, ...rest);
    explorer.Attach();
    return explorer;
  }

  // Maybe the A11yDocument should have a get region?
  // Maybe we need more than one region (Braille)?
  // Maybe some should be read only?
  protected constructor(public document: A11yDocument,
                        protected region: Region<T>,
                        protected node: HTMLElement, ...rest: any[]) {
  }


  protected Events(): [string, (x: Event) => void][] {
    return this.events;
  }


  /**
   * @override
   */
  public get active(): boolean {
    return this._active;
  }

  /**
   * @override
   */
  public set active(flag: boolean) {
    this._active = flag;
  }

  /**
   * @override
   */
  public Attach() {
    this.oldIndex = this.node.tabIndex;
    this.node.tabIndex = 1;
    this.node.setAttribute('role', 'application');
    this.AddEvents();
  }

  /**
   * @override
   */
  public Detach() {
    this.node.tabIndex = this.oldIndex;
    this.oldIndex = null;
    this.node.removeAttribute('role');
    this.RemoveEvents();
  }

  /**
   * @override
   */
  public Start() {
    this.highlighter = this.getHighlighter();
    this.active = true;
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      this.region.Clear();
      this.region.Hide();
      this.active = false;
    }
  }

  /**
   * @override
   */
  public AddEvents() {
    for (let [eventkind, eventfunc]  of this.events) {
      this.node.addEventListener(eventkind, eventfunc);
    }
  }

  /**
   * @override
   */
  public RemoveEvents() {
    for (let [eventkind, eventfunc]  of this.events) {
      this.node.removeEventListener(eventkind, eventfunc);
    }
  }

  /**
   * @override
   */
  public Update(force: boolean = false): void {}


  /**
   * @return {sre.Highlighter} A highlighter for the explorer.
   */
  protected getHighlighter(): sre.Highlighter {
    let opts = this.document.options.a11y;
    let foreground = {color: opts.foregroundColor.toLowerCase(),
                      alpha: opts.foregroundOpacity};
    let background = {color: opts.backgroundColor.toLowerCase(),
                      alpha: opts.backgroundOpacity};
    return sre.HighlighterFactory.highlighter(
      background, foreground,
      {renderer: this.document.outputJax.name, browser: 'v3'});
  }

  /**
   * Stops the events of this explorer from bubbling.
   * @param {Event} event The event to stop.
   */
  protected stopEvent(event: Event) {
    if (this.stoppable) {
      AbstractExplorer.stopEvent(event);
    }
  }

}


export interface KeyExplorer extends Explorer {

  KeyDown(event: KeyboardEvent): void;
  FocusIn(event: FocusEvent): void;
  FocusOut(event: FocusEvent): void;

}

export abstract class AbstractKeyExplorer<T> extends AbstractExplorer<T> implements KeyExplorer {


  protected events: [string, (x: Event) => void][] =
    super.Events().concat(
      [['keydown', this.KeyDown.bind(this)],
       ['focusin', this.FocusIn.bind(this)],
       ['focusout', this.FocusOut.bind(this)]]);

  /**
   * @override
   */
  public abstract KeyDown(event: KeyboardEvent): void;

  /**
   * @override
   */
  public FocusIn(event: FocusEvent) {
  }


  /**
   * @override
   */
  public FocusOut(event: FocusEvent) {
    this.Stop();
  }

}


// We could have the speech/braille, etc explorer have a region as static
// element, which the first generation would set in on the A11ydocument.
export class SpeechExplorer extends AbstractKeyExplorer<string> implements KeyExplorer {


  /**
   * The attached SRE walker.
   * @type {sre.Walker}
   */
  protected walker: sre.Walker;

  /**
   * The SRE speech generator associated with the walker.
   * @type {sre.SpeechGenerator}
   */
  protected speechGenerator: sre.SpeechGenerator;

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
              private mml: HTMLElement) {
    super(document, region, node);
    this.initWalker();
  }


  /**
   * @override
   */
  public Start() {
    super.Start();
    this.speechGenerator = new sre.DirectSpeechGenerator();
    this.walker = new sre.TableWalker(
      this.node, this.speechGenerator, this.highlighter, this.mml);
    this.walker.activate();
    this.Update();
    if (this.document.options.a11y.subtitles) {
      this.region.Show(this.node, this.highlighter);
    }
    this.restarted = true;
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


  /**
   * @override
   */
  public Update(force: boolean = false) {
    if (!this.active && !force) return;
    this.highlighter.unhighlight();
    this.highlighter.highlight(this.walker.getFocus().getNodes());
    this.region.Update(this.walker.speech());
  }


  /**
   * Computes the speech for the current expression once SRE is ready.
   * @param {sre.Walker} walker The sre walker.
   */
  public Speech(walker: sre.Walker) {
    sreReady.then(() => {
      let speech = walker.speech();
      this.node.setAttribute('hasspeech', 'true');
      this.Update();
      if (this.restarted && this.document.options.a11y.subtitles) {
        this.region.Show(this.node, this.highlighter);
      }
    }).catch((error: Error) => console.log(error.message));
  }


  /**
   * @override
   */
  public KeyDown(event: KeyboardEvent) {
    const code = event.keyCode;
    if (code === 27) {
      this.Stop();
      this.stopEvent(event);
      return;
    }
    if (this.active) {
      this.Move(code);
      this.stopEvent(event);
      return;
    }
    if (code === 32 && event.shiftKey) {
      this.Start();
      this.stopEvent(event);
    }
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
    // Add speech
    this.speechGenerator = new sre.TreeSpeechGenerator();
    // We could have this in a separate explorer. Not sure if that makes sense.
    let dummy = new sre.DummyWalker(
      this.node, this.speechGenerator, this.highlighter, this.mml);
    this.Speech(dummy);
  }

}


export class Magnifier extends AbstractKeyExplorer<HTMLElement> {

  /**
   * The walker for the magnifier.
   * @type {sre.Walker}
   */
  private walker: sre.Walker;

  /**
   * @constructor
   * @extends {AbstractKeyExplorer}
   */
  constructor(public document: A11yDocument,
              protected region: Region<HTMLElement>,
              protected node: HTMLElement,
              private mml: HTMLElement) {
    super(document, region, node);
    this.walker = new sre.TableWalker(
        this.node, new sre.DummySpeechGenerator(), this.highlighter, this.mml);
  }

  /**
   * @override
   */
  public Update(force: boolean = false) {
    console.log('highlighting here');
    if (!this.active && !force) return;
    this.highlighter.unhighlight();
    this.highlighter.highlight(this.walker.getFocus().getNodes());
  }



  public Start() {
    super.Start();
    this.region.Show(this.node, this.highlighter);
    this.walker.activate();
    this.Update();
    this.showFocus();
  }

  private showFocus() {
    let node = this.walker.getFocus().getNodes()[0] as HTMLElement;
    this.region.Show(node, this.highlighter);
  }

  public Move(key: number) {
    let result = this.walker.move(key);
    if (result) {
      this.Update();
      this.showFocus();
    }
  }

  public KeyDown(event: KeyboardEvent) {
    const code = event.keyCode;
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
    if (code === 32 && event.shiftKey) {
      this.Start();
      this.stopEvent(event);
    }
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


export interface MouseExplorer extends Explorer {

  MouseOver(event: MouseEvent): void;
  MouseOut(event: MouseEvent): void;
  MouseDown(event: MouseEvent): void;
  MouseUp(event: MouseEvent): void;

}

export abstract class AbstractMouseExplorer<T> extends AbstractExplorer<T> implements MouseExplorer {

  protected events: [string, (x: Event) => void][] =
    super.Events().concat(
      [['mouseover', this.MouseOver.bind(this)],
       ['mouseout', this.MouseOut.bind(this)]
       // Should we have those?
       // ['mousedown', this.MouseDown.bind(this)],
       // ['mouseup', this.MouseUp.bind(this)],
      ]);

  /**
   * @override
   */
  public MouseOver(event: MouseEvent) {
    this.Start();
  }


  /**
   * @override
   */
  public MouseOut(event: MouseEvent) {
    this.Stop();
  }

  /**
   * @override
   */
  public abstract MouseDown(event: MouseEvent): void;


  /**
   * @override
   */
  public abstract MouseUp(event: MouseEvent): void;

}


export abstract class Hoverer<T> extends AbstractMouseExplorer<T> {

  /**
   * Remember the last position to avoid flickering.
   * @type {[number, number]}
   */
  protected coord: [number, number];

  /**
   * @constructor
   * @extends {AbstractMouseExplorer<T>}
   *
   * @param {A11yDocument} document The current document.
   * @param {Region<T>} region A region to display results.
   * @param {HTMLElement} node The node on which the explorer works.
   * @param {(node: HTMLElement) => boolean} nodeQuery Predicate on nodes that
   *    will fire the hoverer.
   * @param {(node: HTMLElement) => T} nodeAccess Accessor to extract node value
   *    that is passed to the region.
   *
   * @template T
   */
  protected constructor(public document: A11yDocument,
              protected region: Region<T>,
              protected node: HTMLElement,
              protected nodeQuery: (node: HTMLElement) => boolean,
              protected nodeAccess: (node: HTMLElement) => T) {
    super(document, region, node);
  }

  /**
   * @override
   */
  public MouseDown(event: MouseEvent) {};

  /**
   * @override
   */
  public MouseUp(event: MouseEvent) {};

  public MouseOut(event: MouseEvent) {
    if (event.clientX === this.coord[0] &&
        event.clientY === this.coord[1]) {
      return;
    }
    this.highlighter.unhighlight();
    this.region.Hide();
    super.MouseOut(event);
  }

  public MouseOver(event: MouseEvent) {
    super.MouseOver(event);
    let target = event.target as HTMLElement;
    this.coord = [event.clientX, event.clientY];
    let [node, kind] = this.getNode(target);
    if (!node) {
      return;
    }
    this.highlighter.unhighlight();
    this.highlighter.highlight([node]);
    this.region.Update(kind);
    this.region.Show(node, this.highlighter);
  }

  public getNode(node: HTMLElement): [HTMLElement, T] {
    let original = node;
    while (node && node !== this.node) {
      if (this.nodeQuery(node)) {
        return [node, this.nodeAccess(node)];
      }
      node = node.parentNode as HTMLElement;
    }
    node = original;
    while (node) {
      if (this.nodeQuery(node)) {
        return [node, this.nodeAccess(node)];
      }
      let child = node.childNodes[0] as HTMLElement;
      node = (child && child.tagName === 'defs') ? // This is for SVG.
        node.childNodes[1] as HTMLElement : child;
    }
    return [null, null];
  }

}


export class ValueHoverer extends Hoverer<string> { }

export class ContentHoverer extends Hoverer<HTMLElement> { }

export class EffectHoverer extends Hoverer<void> {

  /**
   * @override
   */
  protected constructor(
    public document: A11yDocument,
    ignore: any,
    protected node: HTMLElement) {
    super(document, new DummyRegion(document), node,
          x => this.highlighter.isMactionNode(x),
          x => {});
  }

}
