import {AbstractFindMath} from '../../core/FindMath.js';
import {ProtoItem, protoItem} from '../../core/MathItem.js';
import {OptionList} from '../../util/Options.js';

type Delims = [string, string];

export type FINDTYPST_OPTIONS = {
  inlineDelimiters: Delims[];
  displayDelimiters: Delims[];
  processEscapes: boolean;
};

const options: FINDTYPST_OPTIONS = {
  inlineDelimiters: [['$', '$']],
  displayDelimiters: [['$$', '$$']],
  processEscapes: true,
};

type StartItem = {
  open: string;
  close: string;
  display: boolean;
};

export class FindTypst<N, T, D> extends AbstractFindMath<N, T, D> {

  public static OPTIONS = options;

  protected starts: StartItem[];

  constructor(options: OptionList = {}) {
    super(options);

    this.starts = [
      ...this.options.displayDelimiters.map(
        ([open, close]: Delims) => ({open, close, display: true})
      ),
      ...this.options.inlineDelimiters.map(
        ([open, close]: Delims) => ({open, close, display: false})
      ),
    ].sort((a, b) => b.open.length - a.open.length);
  }

  protected isEscaped(text: string, index: number) {
    let n = 0;

    for (let i = index - 1; i >= 0 && text[i] === '\\'; i--) {
      n++;
    }

    return n % 2 === 1;
  }

  protected closing(
    text: string,
    close: string,
    start: number
  ): number {
    let i = start;

    while (i <= text.length - close.length) {
      i = text.indexOf(close, i);

      if (i < 0) {
        return -1;
      }

      if (
        !this.options.processEscapes ||
        !this.isEscaped(text, i)
      ) {
        return i;
      }

      i += close.length;
    }

    return -1;
  }

  protected findMathInString(
    result: ProtoItem<N, T>[],
    n: number,
    text: string
  ) {
    let cursor = 0;

    while (cursor < text.length) {
      let match: (StartItem & {index: number}) | null = null;

      for (const candidate of this.starts) {
        let index = text.indexOf(candidate.open, cursor);

        while (
          index >= 0 &&
          this.options.processEscapes &&
          this.isEscaped(text, index)
        ) {
          index = text.indexOf(
            candidate.open,
            index + candidate.open.length
          );
        }

        if (index < 0) {
          continue;
        }

        if (
          !match ||
          index < match.index ||
          (
            index === match.index &&
            candidate.open.length > match.open.length
          )
        ) {
          match = {...candidate, index};
        }
      }

      if (!match) {
        break;
      }

      const bodyStart = match.index + match.open.length;
      const endIndex = this.closing(
        text,
        match.close,
        bodyStart
      );

      if (endIndex < 0) {
        cursor = bodyStart;
        continue;
      }

      const end = endIndex + match.close.length;

      result.push(
        protoItem<N, T>(
          match.open,
          text.substring(bodyStart, endIndex),
          match.close,
          n,
          match.index,
          end,
          match.display
        )
      );

      cursor = end;
    }
  }

  public findMath(strings: string[]) {
    const result: ProtoItem<N, T>[] = [];

    strings.forEach((text, n) => {
      this.findMathInString(result, n, text);
    });

    return result;
  }
}
