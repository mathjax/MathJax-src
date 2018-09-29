// import {MathDocument} from '../core/MathDocument.js';
import {HTMLDocument} from '../handlers/html/HTMLDocument.js';
import {HTMLAdaptor} from '../adaptors/HTMLAdaptor.js';
import {OptionList} from '../util/Options.js';
import {CssStyles, StyleList} from '../output/chtml/CssStyles.js';

// import 'node_modules/speech-rule-engine/lib/sre_browser.js';
import 'speech-rule-engine/lib/sre_browser.js';

export type A11yDocument = HTMLDocument<HTMLElement, Text, Document>;

export class Explorer {

  private started: boolean = false;
  private active: boolean = false;

  private walker: sre.Walker;
  private highlighter: sre.Highlighter;
  private speechGenerator: sre.SpeechGenerator;
  private foreground: sre.colorType = {color: 'red', alpha: 1};
  private background: sre.colorType = {color: 'blue', alpha: .2};
  
  // Maybe the A11yDocument should have a get region?
  // Maybe we need more than one region (Braille)?
  constructor(public document: A11yDocument,
              private region: LiveRegion,
              private node: HTMLElement,
              private mml: HTMLElement) {
    this.region = region;
    this.node = node;
    this.mml = mml;
    this.Attach();
  }


  /**
   * Attaches navigator to a node.
   */
  private Attach() {
    this.highlighter = sre.HighlighterFactory.highlighter(
      this.background, this.foreground,
      {renderer: this.document.outputJax.name}
    );
    // Add speech
    this.speechGenerator = new sre.TreeSpeechGenerator();
    let dummy = new sre.DummyWalker(
      this.node, this.speechGenerator, this.highlighter, this.mml);
    this.Speech(dummy);
    this.speechGenerator = new sre.DirectSpeechGenerator();
    this.walker = new sre.TableWalker(
      this.node, this.speechGenerator, this.highlighter, this.mml);
    this.node.tabIndex = 1;
    this.node.addEventListener('keydown', this.KeyDown.bind(this));
    this.node.addEventListener('focus', this.FocusIn.bind(this));
    this.node.addEventListener('focusout', this.FocusOut.bind(this));
    this.node.addEventListener('mouseover', this.Hover.bind(this));
    this.node.addEventListener('mouseout', this.Hover.bind(this));
  }

  public Start() {
    this.walker.activate();
    this.highlighter.highlight(this.walker.getFocus().getNodes());
    this.region.Show(this.node, this.highlighter);
    this.region.Update(this.walker.speech());
    this.active = true;
  }
  
  public Stop() {
    if (this.active) {
      this.region.Clear();
      this.region.Hide();
      this.highlighter.unhighlight();
      this.active = false;
    }
  }

  public Speech(walker: any) {
    console.log('In Speech');
    if (sre.Engine.isReady()) {
      let speech = walker.speech();
      this.node.setAttribute('hasspeech', 'true');
    } else {
      setTimeout(
        function() { this.Speech(walker); }.bind(this), 100);
    }
  }

  public Hover(event: MouseEvent) {
    console.log(event.target);
  }
  
  public FocusIn(event: MouseEvent) {
    console.log('Focus in');
    // Announce?
    this.Start();
  }
  
  public FocusOut(event: MouseEvent) {
    console.log('Focus out');
    this.Stop();
  }
  
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

  private stopEvent(event: Event) {
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
  
  public Move(key: number) {
    this.walker.move(key);
    this.highlighter.unhighlight();
    this.highlighter.highlight(this.walker.getFocus().getNodes());
    this.region.Update(this.walker.speech());
  }

}


export abstract class Region {


  /**
   * True if the style has already been added to the document.
   * @type {boolean}
   */
  protected static styleAdded: boolean = false;

  /**
   * The CSS style that needs to be added for this type of region.
   * @type {CssStyles}
   */
  protected static style: CssStyles;

  protected div: HTMLElement;
  protected inner: HTMLElement;

  /**
   * Adds a style sheet for the live region to the document.
   * @param {A11yDocument} document The current document.
   */
  public addStyles(document: A11yDocument) {
    let CLASS = this.constructor as typeof Region;
    if (CLASS.styleAdded) {
      return;
    }
    // TODO: should that be added to document.documentStyleSheet()?
    let node = document.adaptor.node('style');
    node.innerHTML = CLASS.style.cssText;
    document.adaptor.head(document.adaptor.document).appendChild(node);
  }

  public addElement() {}
}

export class ToolTip {

  private static styleAdded: boolean = false;
  private static style: CssStyles =
    new CssStyles({'.tooltip': {
      position: 'relative',
      display: 'inline-block',
      'border-bottom': '1px dotted black',
    },
                   '.tooltip .tooltiptext': {
                     visibility: 'hidden',
                     width: '120px',
                     'background-color': 'black',
                     color: '#fff',
                     'text-align': 'center',
                     'border-radius': '6px',
                     padding: '5px 0',
                     position: 'absolute',
                     'z-index': 1
                   },
                   '.tooltip:hover .tooltiptext': {
                     visibility: 'visible',
                   }
                  }
                 );

  private div: HTMLElement;
  private inner: HTMLElement;

}

export class LiveRegion {

  protected static className = 'MJX_LiveRegion';
  protected static styleAdded: boolean = false;
  protected static style: CssStyles =
    new CssStyles({'.MJX_LiveRegion': {
      position: 'absolute', top: '0', height: '1px', width: '1px',
      padding: '1px', overflow: 'hidden'
    },
                   '.MJX_LiveRegion_Show':
                   {
                     top: '0', position: 'absolute', width: 'auto', height: 'auto',
                     padding: '0px 0px', opacity: 1, 'z-index': '202',
                     left: 0, right: 0, 'margin': '0 auto',
                     'background-color': 'rgba(0, 0, 255, 0.2)', 'box-shadow': '0px 10px 20px #888',
                     border: '2px solid #CCCCCC'
                   }
                  });
  
  private div: HTMLElement;
  private inner: HTMLElement;

  /**
   * Adds a style sheet for the live region to the document.
   * @param {A11yDocument} document The current document.
   */
  public static Styles(document: A11yDocument) {
    if (LiveRegion.styleAdded) {
      return;
    }
    // TODO: should that be added to document.documentStyleSheet()?
    let node = document.adaptor.node('style');
    node.innerHTML = LiveRegion.style.cssText;
    document.adaptor.head(document.adaptor.document).appendChild(node);
  }

  /**
   * @constructor
   * @param {A11yDocument} document The document the live region is added to.
   */
  constructor(public document: A11yDocument) {
    this.AddStyles();
    this.AddElement();
    this.div.setAttribute('aria-live', 'assertive');
  }

  public AddStyles() {
    LiveRegion.Styles(this.document);
  }

  public AddElement() {
    let element = this.document.adaptor.node('div');
    element.classList.add(LiveRegion.className);
    this.div = element;
    this.inner = this.document.adaptor.node('div');
    this.div.appendChild(this.inner);
    this.document.adaptor.
      body(this.document.adaptor.document).
      appendChild(this.div);

  }

  //
  // Shows the live region as a subtitle of a node.
  //
  public Show(node: HTMLElement, highlighter: sre.Highlighter) {
    this.div.classList.add(LiveRegion.className + '_Show');
    const rect = node.getBoundingClientRect();
    const bot = rect.bottom + 10 + window.pageYOffset;
    const left = rect.left + window.pageXOffset;
    this.div.style.top = bot + 'px';
    this.div.style.left = left + 'px';
    const color = highlighter.colorString();
    this.inner.style.backgroundColor = color.background;
    this.inner.style.color = color.foreground;
  }


  //
  // Takes the live region out of the page flow.
  //
  public Hide() {
    this.div.classList.remove(LiveRegion.className + '_Show');
  }


  /**
   * Clears the content of the region.
   */
  public Clear() {
    this.Update('');
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }


  /**
   * Updates the content of the region.
   */
  public Update(speech: string) {
    this.div.textContent = '';
    this.div.textContent = speech;
  }

}
