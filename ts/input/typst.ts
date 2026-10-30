import {
  AbstractInputJax,
  INPUTJAX_OPTIONS,
} from '../core/InputJax.js';
import {MathDocument} from '../core/MathDocument.js';
import {MathItem} from '../core/MathItem.js';
import {DOM, DOM_TYPES, N, T, D} from '../types/Types.js';
import {OptionList, separateOptions} from '../util/Options.js';
import {DOMAdaptor} from '../core/DOMAdaptor.js';
import {MmlFactory} from '../core/MmlTree/MmlFactory.js';

import {FindTypst} from './typst/FindTypst.js';
import {TypstCompile} from './typst/TypstCompile.js';


export interface TYPST_OPTIONS<
  DOM extends DOM_TYPES,
> extends INPUTJAX_OPTIONS<DOM> {
  FindTypst: FindTypst<N<DOM>, T<DOM>, D<DOM>>;
  TypstCompile: TypstCompile<N<DOM>, T<DOM>, D<DOM>>;
}


const options: TYPST_OPTIONS<DOM> = {
  ...AbstractInputJax.OPTIONS,
  FindTypst: null,
  TypstCompile: null,
};


export class Typst<N, T, D>
  extends AbstractInputJax<N, T, D> {

  public static NAME = 'Typst';

  public static OPTIONS = options;

  protected findTypst: FindTypst<N, T, D>;
  protected typst: TypstCompile<N, T, D>;

  constructor(options: OptionList = {}) {
    const [typst, find, compile] = separateOptions(
      options,
      FindTypst.OPTIONS,
      TypstCompile.OPTIONS
    );

    super(typst);

    this.findTypst =
      this.options.FindTypst ||
      new FindTypst<N, T, D>(find);

    this.typst =
      this.options.TypstCompile ||
      new TypstCompile<N, T, D>(compile);
  }

  public setAdaptor(adaptor: DOMAdaptor<N, T, D>) {
    super.setAdaptor(adaptor);
    this.typst.setAdaptor(adaptor);
  }

  public setMmlFactory(factory: MmlFactory) {
    super.setMmlFactory(factory);
    this.typst.setMmlFactory(factory);
  }

  public compile(
    math: MathItem<N, T, D>,
    document: MathDocument<N, T, D>
) {
  const source = this.executeFilters(
    this.preFilters,
    math,
    document,
    String(math.math ?? '')
  );

  let root = this.typst.compile(source, Boolean(math.display));

  root = this.executeFilters(
    this.postFilters,
    math,
    document,
    root
  );

  math.display = root.attributes.get('display') === 'block';

  return root;
}

  public findMath(strings: string[]) {
    return this.findTypst.findMath(strings);
  }
}
