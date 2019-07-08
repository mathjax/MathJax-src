
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
  
  class DummySpeechGenerator extends AbstractSpeechGenerator { }


  interface Highlighter {
    highlight(nodes: Node[]): void;
    unhighlight(): void;
    colorString(): colorString;
    isMactionNode(node: Node): boolean;
  }

  interface Focus {
    getNodes(): Node[];
  }
  
  interface Walker {
    activate(): void;
    deactivate(): void;
    speech(): string;
    move(key: number): boolean;
    getFocus(update?: boolean): Focus;
  }

}

declare namespace sre.WalkerFactory {
  export function walker(kind: string,
                         node: Node,
                         generator: SpeechGenerator,
                         highlighter: Highlighter,
                         mml: Node): Walker;
  
}

declare namespace sre.Engine {
  export function isReady(): boolean;
}

declare namespace sre.HighlighterFactory {

  export function highlighter(fore: colorType,
                              back: colorType,
                              info: {renderer: string, browser?: string}
                             ): Highlighter;

}
