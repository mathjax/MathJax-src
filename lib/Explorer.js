// import 'node_modules/speech-rule-engine/lib/sre_browser.js';
import 'speech-rule-engine/lib/sre_browser.js';


export class Explorer {

  constructor(region, node, mml) {
    console.log('here');
    console.log(region);
    console.log(node);
    this.region = region;
    this.node = node;
    this.mml = mml;
    this.Explorer(node);
  }
  
  Speech(node, walker) {
    console.log('In Speech');
    if (sre.Engine.isReady()) {
      var speech = walker.speech();
      node.setAttribute('hasspeech', 'true');
    } else {
      setTimeout(
        function() {this.Speech(node, walker);}.bind(this), 100);
    }
  }

  Explorer(node) {
    console.log('In Explorer');
    let highlighter = sre.HighlighterFactory.highlighter(
      {color: 'blue', alpha: .2},
      {color: 'red', alpha: 1},
      {renderer: 'CommonHTML', browser: 'Chrome'}
    );
    // Add speech
    let speechGenerator = new sre.TreeSpeechGenerator();
    var dummy = new sre.DummyWalker(
      node, speechGenerator, highlighter, this.mml);
    this.Speech(node, dummy);
    speechGenerator = new sre.DirectSpeechGenerator();
    let walker = new sre.TableWalker(
      node, speechGenerator, highlighter, this.mml);
    node.tabIndex = 1;
    this.region.old = node;
    this.node.addEventListener('keydown',
                                function(event) {
                                  walker.move(event.keyCode);
                                  highlighter.unhighlight();
                                  highlighter.highlight(walker.getFocus().getNodes());
                                  this.region.Update(walker.speech());
                                  event.stopPropagation();
                                }.bind(this));
    walker.activate();
    highlighter.highlight(walker.getFocus().getNodes());
    this.region.Show(node, highlighter);
  }

}

export class LiveRegion {

  constructor(document = null) {
    document = document || window.document;
    console.log(document.adaptor.create);
    this.Styles();
    let element = document.adaptor.create('div');
    // var element = document.createElement('div');
    element.classList.add('MJX_LiveRegion');
    element.setAttribute('aria-live', 'assertive');
    this.region = element;
    // this.inner = document.createElement('div');
    this.inner = document.adaptor.create('div');
    this.region.appendChild(this.inner);
    console.log(document.documentStyleSheet());
    document.body.appendChild(element);
  }
  
  Styles() {
    let styles = {'.MJX_LiveRegion':
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
    let sheet = window.document.styleSheets[0];
    for (let rule in styles) {
      let styleStr = [];
      let current = styles[rule];
      for (let style in current) {
        styleStr.push(style + ': ' + current[style]);
      }
      console.log(styleStr.join('; '));
      let node = document.createElement('style');
      node.innerHTML = rule + '{' + styleStr.join('; ') + '}';
      document.head.appendChild(node);
    }
  }
        
  //
  // Shows the live region as a subtitle of a node.
  //
  Show(node, highlighter) {
    this.region.classList.add('MJX_LiveRegion_Show');
    var rect = node.getBoundingClientRect();
    var bot = rect.bottom + 10 + window.pageYOffset;
    var left = rect.left + window.pageXOffset;
    this.region.style.top = bot + 'px';
    this.region.style.left = left + 'px';
    var color = highlighter.colorString();
    this.inner.style.backgroundColor = color.background;
    this.inner.style.color = color.foreground;
  }


  //
  // Takes the live region out of the page flow.
  //
  Hide(node) {
    this.region.classList.remove('MJX_LiveRegion_Show');
  }
  
  //
  // Clears the speech div.
  //
  Clear() {
    this.Update('');
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }
  
  Update(speech) {
    this.region.textContent = '';
    this.region.textContent = speech;
  }
  
}
