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

  private Attach() {
    this.highlighter = sre.HighlighterFactory.highlighter(
      {color: 'blue', alpha: .2},
      {color: 'red', alpha: 1},
      {renderer: 'CommonHTML', browser: 'Chrome'}
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

export class LiveRegion {

  private static styleAdded: boolean = false;
  private static style: CssStyles =
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
    LiveRegion.Styles(document);
    let element = this.document.adaptor.node('div');
    // var element = document.createElement('div');
    element.classList.add('MJX_LiveRegion');
    element.setAttribute('aria-live', 'assertive');
    this.div = element;
    // this.inner = document.createElement('div');
    this.inner = document.adaptor.node('div');
    this.div.appendChild(this.inner);
    console.log(document.documentStyleSheet());
    this.document.adaptor.
      body(this.document.adaptor.document).
      appendChild(this.div);
  }


  //
  // Shows the live region as a subtitle of a node.
  //
  public Show(node: HTMLElement, highlighter: sre.Highlighter) {
    this.div.classList.add('MJX_LiveRegion_Show');
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
    this.div.classList.remove('MJX_LiveRegion_Show');
  }
  
  //
  // Clears the speech div.
  //
  public Clear() {
    this.Update('');
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }
  
  public Update(speech: string) {
    this.div.textContent = '';
    this.div.textContent = speech;
  }
  
}
