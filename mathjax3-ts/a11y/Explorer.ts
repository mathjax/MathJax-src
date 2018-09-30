// import {MathDocument} from '../core/MathDocument.js';
import {HTMLAdaptor} from '../adaptors/HTMLAdaptor.js';
import {OptionList} from '../util/Options.js';
import {A11yDocument, Region, ToolTip} from './Region.js';

// import 'node_modules/speech-rule-engine/lib/sre_browser.js';
import 'speech-rule-engine/lib/sre_browser.js';


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
    if (event.stopPropagation) {
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

  FocusIn(event: FocusEvent): void;
  FocusOut(event: FocusEvent): void;
  KeyDown(event: KeyboardEvent): void;
  
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
  public FocusIn(event: FocusEvent) {
    this.Start();
  }
  

  /**
   * @override
   */
  public FocusOut(event: FocusEvent) {
    this.Stop();
  }
  

  /**
   * @override
   */
  public abstract KeyDown(event: KeyboardEvent): void;

}


// We could have the speech/braille, etc explorer have a region as static
// element, which the first generation would set in on the A11ydocument.
export class SpeechExplorer extends AbstractKeyExplorer implements KeyExplorer {

  private started: boolean = false;

  private walker: sre.Walker;
  private highlighter: sre.Highlighter;
  private speechGenerator: sre.SpeechGenerator;
  private foreground: sre.colorType = {color: 'red', alpha: 1};
  private background: sre.colorType = {color: 'blue', alpha: .2};
  private hoverRegion = new ToolTip(this.document);

  /**
   * @override
   */
  protected events: [string, (x: Event) => void][] =
    super.Events().concat(
      [['mouseover', this.Hover.bind(this)],
       ['mouseout', this.UnHover.bind(this)]]);

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
    this.highlighter = sre.HighlighterFactory.highlighter(
      this.background, this.foreground,
      {renderer: this.document.outputJax.name}
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
    if (sre.Engine.isReady()) {
      let speech = walker.speech();
      this.node.setAttribute('hasspeech', 'true');
    } else {
      setTimeout(
        function() { this.Speech(walker); }.bind(this), 100);
    }
  }

  public UnHover(event: MouseEvent) {
    this.highlighter.unhighlight();
    this.hoverRegion.Hide();
  }

  public Hover(event: MouseEvent) {
    let target = event.target as HTMLElement;
    let [node, kind] = this.getType(target);
    if (!node) {
      return;
    }
    this.highlighter.unhighlight();
    this.highlighter.highlight([node]);
    this.hoverRegion.Show(node, this.highlighter);
    this.hoverRegion.Update(kind);
  }

  public getType(node: HTMLElement): [HTMLElement, string] {
    let original = node;
    while (node && node !== this.node) {
      console.log('up');
      if (node.hasAttribute('data-semantic-type')) {
        return [node, node.getAttribute('data-semantic-type')];
      }
      node = node.parentNode as HTMLElement;
    }
    node = original;
    while (node) {
      console.log('down');
      if (node.hasAttribute('data-semantic-type')) {
        return [node, node.getAttribute('data-semantic-type')];
      }
      node = node.childNodes[0] as HTMLElement;
    }
    return [null, ''];
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


export interface MouseExplorer extends Explorer {

  MouseIn(event: MouseEvent): void;
  MouseOut(event: MouseEvent): void;
  MouseDown(event: MouseEvent): void;
  MouseUp(event: MouseEvent): void;
  
}

export abstract class AbstractMouseExplorer extends AbstractExplorer implements MouseExplorer {


  protected events: [string, (x: Event) => void][] =
    super.Events().concat(
      [['mousein', this.MouseIn.bind(this)],
       ['mouseout', this.MouseOut.bind(this)],
       ['mousedown', this.MouseDown.bind(this)],
       ['mouseup', this.MouseUp.bind(this)],
      ]);
  
  /**
   * @override
   */
  public MouseIn(event: MouseEvent) {
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


