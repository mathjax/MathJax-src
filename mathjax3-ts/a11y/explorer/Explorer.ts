import {A11yDocument, HoverRegion, Region, ToolTip} from './Region.js';
import {sreReady} from '../sre.js';


export interface Explorer {

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
 */
export class AbstractExplorer implements Explorer {

  protected events: [string, (x: Event) => void][] = [];

  protected active: boolean = false;
  private oldIndex: number = null;

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

  // Maybe the A11yDocument should have a get region?
  // Maybe we need more than one region (Braille)?
  // Maybe some should be read only?
  protected constructor(public document: A11yDocument,
                        protected region: Region,
                        protected node: HTMLElement, ...rest: any[]) {
  }


  protected Events(): [string, (x: Event) => void][] {
    return this.events;
  }


  // The creator pattern!
  static create(document: A11yDocument,
                region: Region,
                node: HTMLElement, ...rest: any[]): Explorer {
    let explorer = new this(document, region, node, ...rest);
    explorer.Attach();
    return explorer;
  }

  /**
   * @override
   */
  public Attach() {
    this.oldIndex = this.node.tabIndex;
    this.node.tabIndex = 1;
    this.AddEvents();
  }


  /**
   * @override
   */
  public Detach() {
    this.node.tabIndex = this.oldIndex;
    this.oldIndex = null;
    this.RemoveEvents();
  }


  /**
   * @override
   */
  public Start() {
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

}


export interface KeyExplorer extends Explorer {

  KeyDown(event: KeyboardEvent): void;
  FocusIn(event: FocusEvent): void;
  FocusOut(event: FocusEvent): void;

}

export abstract class AbstractKeyExplorer extends AbstractExplorer implements KeyExplorer {


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
export class SpeechExplorer extends AbstractKeyExplorer implements KeyExplorer {

  private started: boolean = false;

  protected walker: sre.Walker;
  protected highlighter: sre.Highlighter;
  private speechGenerator: sre.SpeechGenerator;
  private foreground: sre.colorType = {color: 'red', alpha: 1};
  private background: sre.colorType = {color: 'blue', alpha: .2};

  // /**
  //  * @override
  //  */
  // protected events: [string, (x: Event) => void][] =
  //   super.Events().concat(
  //     [['mouseover', this.Hover.bind(this)],
  //      ['mouseout', this.UnHover.bind(this)]]);

  // Maybe the A11yDocument should have a get region?
  // Maybe we need more than one region (Braille)?
  constructor(public document: A11yDocument,
              protected region: Region,
              protected node: HTMLElement,
              private mml: HTMLElement) {
    super(document, region, node);
    this.initWalker();
  }

  private initWalker() {
    const jax = this.document.outputJax.name;
    this.highlighter = sre.HighlighterFactory.highlighter(
      this.background, this.foreground,
      {renderer: jax === 'CHTML' ? 'CommonHTML' : jax}
    );
    // Add speech
    this.speechGenerator = new sre.TreeSpeechGenerator();
    // We could have this in a separator explorer. Not sure if that makes sense.
    let dummy = new sre.DummyWalker(
      this.node, this.speechGenerator, this.highlighter, this.mml);
    this.Speech(dummy);
    this.speechGenerator = new sre.DirectSpeechGenerator();
    this.walker = new sre.TableWalker(
      this.node, this.speechGenerator, this.highlighter, this.mml);
  }

  public Start() {
    super.Start();
    this.region.Show(this.node, this.highlighter);
    this.walker.activate();
    this.highlighter.highlight(this.walker.getFocus().getNodes());
    this.region.Update(this.walker.speech());
  }

  public Stop() {
    if (this.active) {
      this.highlighter.unhighlight();
    }
    super.Stop();
  }

  public Speech(walker: any) {
    sreReady.then(() => {
      let speech = walker.speech();
      this.node.setAttribute('hasspeech', 'true');
    }).catch((error: Error) => console.log(error.message));
  }

  public KeyDown(event: KeyboardEvent) {
    const code = event.keyCode;
    if (code === 27) {
      this.Stop();
      AbstractExplorer.stopEvent(event);
      return;
    }
    if (this.active) {
      this.Move(code);
      AbstractExplorer.stopEvent(event);
      return;
    }
    if (code === 32 && event.shiftKey) {
      this.Start();
      AbstractExplorer.stopEvent(event);
    }
  }

  public Move(key: number) {
    this.walker.move(key);
    this.highlighter.unhighlight();
    this.highlighter.highlight(this.walker.getFocus().getNodes());
    this.region.Update(this.walker.speech());
  }

}


// Reimplement without speech and proper setting of region.
export class Magnifier extends SpeechExplorer {

  public Start() {
    super.Start();
    this.region.Show(this.node, this.highlighter);
    this.walker.activate();
    this.highlighter.highlight(this.walker.getFocus().getNodes());
    this.showFocus();
  }

  private showFocus() {
    let node = this.walker.getFocus().getNodes()[0] as HTMLElement;
    let mjx = node.cloneNode(true) as HTMLElement;
    const region = this.region as HoverRegion;
    region.Show(node, this.highlighter);
    region.AddNode(mjx);
  }

  public Move(key: number) {
    this.walker.move(key);
    this.showFocus();
  }

}


export interface MouseExplorer extends Explorer {

  MouseOver(event: MouseEvent): void;
  MouseOut(event: MouseEvent): void;
  MouseDown(event: MouseEvent): void;
  MouseUp(event: MouseEvent): void;

}

export abstract class AbstractMouseExplorer extends AbstractExplorer implements MouseExplorer {

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


export class HoverExplorer extends AbstractMouseExplorer {

  private foreground: sre.colorType = {color: 'red', alpha: 1};
  private background: sre.colorType = {color: 'blue', alpha: .2};
  private highlighter: sre.Highlighter;

  protected nodeQuery = function(node: HTMLElement) {
    return true;
  };
  protected nodeAccess = function(node: HTMLElement) {
    return '';
  };


  constructor(public document: A11yDocument,
              protected region: Region,
              protected node: HTMLElement) {
    super(document, region, node);
    this.highlighter = sre.HighlighterFactory.highlighter(
      this.background, this.foreground,
      {renderer: this.document.outputJax.name}
    );
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
    this.highlighter.unhighlight();
    this.region.Hide();
    super.MouseOut(event);
  }

  public MouseOver(event: MouseEvent) {
    super.MouseOver(event);
    let target = event.target as HTMLElement;
    let [node, kind] = this.getNode(target);
    if (!node) {
      return;
    }
    this.highlighter.unhighlight();
    this.highlighter.highlight([node]);
    this.region.Show(node, this.highlighter);
    this.region.Update(kind);
  }

  public getNode(node: HTMLElement): [HTMLElement, string] {
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
      node = node.childNodes[0] as HTMLElement;
    }
    return [null, ''];
  }

}


export class TypeExplorer extends HoverExplorer {

  protected nodeQuery = (node: HTMLElement) => {
    return node.hasAttribute('data-semantic-type');
  };
  protected nodeAccess = (node: HTMLElement) => {
    return node.getAttribute('data-semantic-type');
  };

}


export class RoleExplorer extends HoverExplorer {

  protected nodeQuery = (node: HTMLElement) => {
    return node.hasAttribute('data-semantic-role');
  };
  protected nodeAccess = (node: HTMLElement) => {
    return node.getAttribute('data-semantic-role');
  };

}


export class TagExplorer extends HoverExplorer {

  protected nodeQuery = (node: HTMLElement) => {return !!node.tagName; };
  protected nodeAccess = (node: HTMLElement) => {return node.tagName; };

}
