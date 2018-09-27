// import {MathDocument} from '../core/MathDocument.js';
import {HTMLDocument} from '../handlers/html/HTMLDocument.js';
import {HTMLAdaptor} from '../adaptors/HTMLAdaptor.js';
import {OptionList} from '../util/Options.js';

// import 'node_modules/speech-rule-engine/lib/sre_browser.js';
import 'speech-rule-engine/lib/sre_browser.js';

export type A11yDocument = HTMLDocument<HTMLElement, Text, Document>;

export class Explorer {

  constructor(public document: A11yDocument,
              private region: LiveRegion,
              private node: HTMLElement,
              private mml: HTMLElement) {
    this.region = region;
    this.node = node;
    this.mml = mml;
    this.Explorer();
  }
  
  public Speech(walker: any) {
    console.log('In Speech');
    if (sre.Engine.isReady()) {
      let speech = walker.speech();
      this.node.setAttribute('hasspeech', 'true');
      // this.node.setAttribute('hasspeech', 'true');
    } else {
      setTimeout(
        function() { this.Speech(walker); }.bind(this), 100);
    }
  }

  public Explorer() {
    console.log('In Explorer NEW');
    let highlighter = sre.HighlighterFactory.highlighter(
      {color: 'blue', alpha: .2},
      {color: 'red', alpha: 1},
      {renderer: 'CommonHTML', browser: 'Chrome'}
    );
    // Add speech
    let speechGenerator = new sre.TreeSpeechGenerator();
    var dummy = new sre.DummyWalker(
      this.node, speechGenerator, highlighter, this.mml);
    this.Speech(dummy);
    speechGenerator = new sre.DirectSpeechGenerator();
    let walker = new sre.TableWalker(
      this.node, speechGenerator, highlighter, this.mml);
    this.node.tabIndex = 1;
    // this.region.old = this.node;
    this.node.addEventListener('keydown',
                                function(event: KeyboardEvent) {
                                  walker.move(event.keyCode);
                                  highlighter.unhighlight();
                                  highlighter.highlight(walker.getFocus().getNodes());
                                  this.region.Update(walker.speech());
                                  event.stopPropagation();
                                }.bind(this));
    walker.activate();
    highlighter.highlight(walker.getFocus().getNodes());
    this.region.Show(this.node, highlighter);
  }

}

export class LiveRegion {

  div: HTMLElement; 
  inner: HTMLElement;
  
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
  
  public static Styles(document: A11yDocument) {
    let styles: {[key: string]: {[key2: string] : string|number}} = {'.MJX_LiveRegion':
                  {
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
                 };
    // TODO: rewrite to use the getstylesheets method.
    for (let rule in styles) {
      let styleStr = [];
      let current = styles[rule];
      for (let style in current) {
        styleStr.push(style + ': ' + current[style]);
      }
      let node = document.adaptor.node('style');
      node.innerHTML = rule + '{' + styleStr.join('; ') + '}';
      document.adaptor.head(document.adaptor.document).appendChild(node);
    }
  }
        
  //
  // Shows the live region as a subtitle of a node.
  //
  Show(node: HTMLElement, highlighter: sre.Highlighter) {
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
  Hide() {
    this.div.classList.remove('MJX_LiveRegion_Show');
  }
  
  //
  // Clears the speech div.
  //
  Clear() {
    this.Update('');
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }
  
  Update(speech: string) {
    this.div.textContent = '';
    this.div.textContent = speech;
  }
  
}
