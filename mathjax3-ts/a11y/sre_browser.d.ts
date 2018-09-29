
declare namespace sre {

  export type colorType = {color: string, alpha: number};
  export type colorString = {foreground: string, background: string};

  interface SpeechGenerator {
    speech(): string;
  }

  class AbstractSpeechGenerator implements SpeechGenerator {
    speech(): string;
  }

  class TreeSpeechGenerator extends AbstractSpeechGenerator { }
  
  class DirectSpeechGenerator extends AbstractSpeechGenerator { }
  

  interface Highlighter {
    highlight(nodes: Node[]): void;
    unhighlight(): void;
    colorString(): colorString;
  }

  interface Focus {
    getNodes(): Node[];
  }
  
  interface Walker {
    activate(): void;
    speech(): string;
    move(key: number): void;
    getFocus(): Focus;
  }

  class AbstractWalker implements Walker {
    constructor(node: Node, generator: SpeechGenerator, highlighter: Highlighter, mml: Node);
    activate(): void;
    speech(): string;
    move(key: number): void;
    getFocus(): Focus;
  }

  class DummyWalker extends AbstractWalker { }
  
  class TableWalker extends AbstractWalker { }
  
  // class AbstractHighlighter implements Highlighter {
  //   highlight(nodes: Node[]): void;
  //   unhighlight(): void;
  // }

  // class 

}

declare namespace sre.Engine {
  export function isReady(): boolean;
}

declare namespace sre.HighlighterFactory {

  export function highlighter(fore: sre.colorType,
                              back: sre.colorType,
                              info: {renderer: string, browser?: string}
                             ): Highlighter;
  
}

// export interface SpeechGenerator {
//   speech(): string;
// }
