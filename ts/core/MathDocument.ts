/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @file  Implements the interface and abstract class for MathDocument objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  userOptions,
  defaultOptions,
  OptionList,
  expandable,
} from '../util/Options.js';
import { InputJax, AbstractInputJax } from './InputJax.js';
import { OutputJax, AbstractOutputJax } from './OutputJax.js';
import { MathList, MathListItem, AbstractMathList } from './MathList.js';
import { MathItem, AbstractMathItem, STATE } from './MathItem.js';
import { MmlNode, TextNode } from './MmlTree/MmlNode.js';
import { MmlFactory } from '../core/MmlTree/MmlFactory.js';
import { DOMAdaptor, ContainerSpec } from '../core/DOMAdaptor.js';
import { BitField, BitFieldClass } from '../util/BitField.js';
import { PrioritizedList } from '../util/PrioritizedList.js';
import { localize } from './__locales__/Component.js';
import { mathjax } from '../mathjax.js';
import { DOM, DOM_TYPES, N, D, Constructor } from '../types/Types.js';

/*****************************************************************/

/**
 * The return type for a render action
 */
export type RenderResult = Promise<boolean | void> | boolean | void;

/**
 * A function to call while rendering a document (usually calls a MathDocument method)
 *
 * @template DOM   The DOM element types
 */
export type RenderDoc<DOM extends DOM_TYPES> = (
  document: MathDocument<DOM>
) => RenderResult;

/**
 * A function to call while rendering a MathItem (usually calls one of its methods)
 *
 * @template DOM   The DOM element types
 */
export type RenderMath<DOM extends DOM_TYPES> = (
  math: MathItem<DOM>,
  document: MathDocument<DOM>
) => RenderResult;

/**
 * The data for an action to perform during rendering or conversion
 *
 * @template DOM   The DOM element types
 */
export type RenderData<DOM extends DOM_TYPES> = {
  id: string; //                        The name for the action
  renderDoc: RenderDoc<DOM>; //         The action to take during a render() call
  renderMath: RenderMath<DOM>; //       The action to take during a rerender() or convert() call
  convert: boolean; //                  Whether the action is to be used during convert()
};

/**
 * The data used to define a render action in configurations and options objects
 *   (the key is used as the id, the number in the data below is the priority, and
 *    the remainind data is as described below; if no boolean is given, convert = true
 *    by default)
 *
 * @template DOM   The DOM element types
 */
export type RenderAction<DOM extends DOM_TYPES> =
  | [number] //                                            Id (i.e., key) is method name to use
  | [number, string] //                                    String is method to call
  | [number, string, string] //                            The strings are methods names for doc and math
  | [number, RenderDoc<DOM>, RenderMath<DOM>] //           Explicit functions for doc and math
  | [number, boolean] //                                   Same as first above, with boolean for convert
  | [number, string, boolean] //                           Same as second above, with boolean for convert
  | [number, string, string, boolean] //                   Same as third above, with boolean for convert
  | [number, RenderDoc<DOM>, RenderMath<DOM>, boolean]; // Same as forth above, with boolean for convert

/**
 * An object representing a collection of rendering actions (id's tied to priority-and-method data)
 *
 * @template DOM   The DOM element types
 */
export type RenderActions<DOM extends DOM_TYPES> = {
  [id: string]: RenderAction<DOM>;
};

/**
 * Implements a prioritized list of render actions.  Extensions can add actions to the list
 *   to make it easy to extend the normal typesetting and conversion operations.
 *
 * @template DOM   The DOM element types
 */
export class RenderList<DOM extends DOM_TYPES> extends PrioritizedList<
  RenderData<DOM>
> {
  /**
   * Creates a new RenderList from an initial list of rendering actions
   *
   * @param {RenderActions} actions   The list of actions to take during render(), rerender(), and convert() calls
   * @returns {RenderList}            The newly created prioritied list
   *
   * @template DOM   The DOM element types
   */
  public static create<DOM extends DOM_TYPES>(
    actions: RenderActions<DOM>
  ): RenderList<DOM> {
    const list = new this<DOM>();
    for (const id of Object.keys(actions)) {
      const [action, priority] = this.action<DOM>(id, actions[id]);
      if (priority) {
        list.add(action, priority);
      }
    }
    return list;
  }

  /**
   * Parses a RenderAction to produce the correspinding RenderData item
   *  (e.g., turn method names into actual functions that call the method)
   *
   * @param {string} id               The id of the action
   * @param {RenderAction} action     The RenderAction defining the action
   * @returns {[RenderData,number]}   The corresponding RenderData definition for the action and its priority
   *
   * @template DOM   The DOM element types
   */
  public static action<DOM extends DOM_TYPES>(
    id: string,
    action: RenderAction<DOM>
  ): [RenderData<DOM>, number] {
    let renderDoc, renderMath;
    let convert = true;
    const priority = action[0];
    if (action.length === 1 || typeof action[1] === 'boolean') {
      if (action.length === 2) {
        convert = action[1] as boolean;
      }
      [renderDoc, renderMath] = this.methodActions(id);
    } else if (typeof action[1] === 'string') {
      if (typeof action[2] === 'string') {
        if (action.length === 4) {
          convert = action[3] as boolean;
        }
        const [method1, method2] = action.slice(1) as [string, string];
        [renderDoc, renderMath] = this.methodActions(method1, method2);
      } else {
        if (action.length === 3) {
          convert = action[2] as boolean;
        }
        [renderDoc, renderMath] = this.methodActions(action[1] as string);
      }
    } else {
      if (action.length === 4) {
        convert = action[3] as boolean;
      }
      [renderDoc, renderMath] = action.slice(1) as [
        RenderDoc<DOM>,
        RenderMath<DOM>,
      ];
    }
    return [
      { id, renderDoc, renderMath, convert } as RenderData<DOM>,
      priority,
    ];
  }

  /**
   * Produces the doc and math actions for the given method name(s)
   *   (a blank name is a no-op)
   *
   * @param {string} method1    The method to use for the render() call
   * @param {string} method2    The method to use for the rerender() and convert() calls
   *
   * @returns {[(document: any) => boolean, (math: any, document: any) => boolean]}
   *     Two render action methods wrapping the parameter methods.
   */
  protected static methodActions(
    method1: string,
    method2: string = method1
  ): [(document: any) => boolean, (math: any, document: any) => boolean] {
    return [
      (document: any) => {
        const result = document[method1]?.() ?? false;
        return result === document ? false : result;
      },
      (math: any, document: any) => {
        return math[method2]?.(document) ?? false;
      },
    ];
  }

  /**
   * Perform the document-level rendering functions
   *
   * @param {MathDocument} document   The MathDocument whose methods are to be called
   * @param {number=} start           The state at which to start rendering (default is UNPROCESSED)
   * @param {number=} i               The index in the renderAction list to start at
   */
  public renderDoc(
    document: MathDocument<DOM>,
    start: number = STATE.UNPROCESSED,
    i: number = 0
  ) {
    let item;
    while ((item = this.items[i++])) {
      if (item.priority < start) continue;
      const result = item.item.renderDoc(document);
      if (result instanceof Promise) {
        mathjax.retryAfter(result, () => this.renderDoc(document, start, i));
      }
      if (result) return;
    }
  }

  /**
   * Perform the MathItem-level rendering functions
   *
   * @param {MathItem} math           The MathItem whose methods are to be called
   * @param {MathDocument} document   The MathDocument to pass to the MathItem methods
   * @param {number=} start           The state at which to start rendering (default is UNPROCESSED)
   * @param {number=} i               The index in the renderAction list to start at
   */
  public renderMath(
    math: MathItem<DOM>,
    document: MathDocument<DOM>,
    start: number = STATE.UNPROCESSED,
    i: number = 0
  ) {
    let item;
    while ((item = this.items[i++])) {
      if (item.priority < start || !item.item.renderMath) continue;
      const result = item.item.renderMath(math, document);
      if (result instanceof Promise) {
        mathjax.retryAfter(result, () =>
          this.renderMath(math, document, start, i)
        );
      }
      if (result) return;
    }
  }

  /**
   * Perform the MathItem-level conversion functions
   *
   * @param {MathItem} math           The MathItem whose methods are to be called
   * @param {MathDocument} document   The MathDocument to pass to the MathItem methods
   * @param {number=} end             The state at which to end rendering (default is LAST)
   * @param {number=} i               The index in the renderAction list to start at
   * @returns {N|MmlNode}             The typeset root or the MathML root, whichever is defined
   */
  public renderConvert(
    math: MathItem<DOM>,
    document: MathDocument<DOM>,
    end: number = STATE.LAST,
    i: number = 0
  ): N<DOM> | MmlNode {
    let item;
    while ((item = this.items[i++])) {
      if (item.priority > end) break;
      if (!item.item.convert) continue;
      const result = item.item.renderMath(math, document);
      if (result instanceof Promise) {
        mathjax.retryAfter(result, () =>
          this.renderConvert(math, document, end, i)
        );
      }
      if (result) break;
    }
    return math.typesetRoot ?? math.root;
  }

  /**
   * Find an entry in the list with a given ID
   *
   * @param {string} id           The id to search for
   * @returns {RenderData|null}   The data for the given id, if found, or null
   */
  public findID(id: string): RenderData<DOM> | null {
    for (const item of this.items) {
      if (item.item.id === id) {
        return item.item;
      }
    }
    return null;
  }
}

/*****************************************************************/

/**
 * The ways of specifying a container (a selector string, an actual node,
 * or an array of those (e.g., the result of document.getElementsByTagName())
 *
 * @template DOM   The DOM element types
 */
export type ContainerList<DOM extends DOM_TYPES> =
  ContainerSpec<DOM> | ContainerSpec<DOM>[];

/**
 * The options allowed for the reset() method
 */
export type ResetList = {
  all?: boolean;
  processed?: boolean;
  inputJax?: any[];
  outputJax?: any[];
};

/**
 * The default option list for the reset() method
 */
export const resetOptions: ResetList = {
  all: false,
  processed: false,
  inputJax: null,
  outputJax: null,
};

/**
 * The option list for when all options are to be reset
 */
export const resetAllOptions: ResetList = {
  all: true,
  processed: true,
  inputJax: [],
  outputJax: [],
};

/*****************************************************************/
/**
 *  The MathDocument interface
 *
 *  The MathDocument is created by MathJax.Document() and holds the
 *  document, the math found in it, and so on.  The methods of the
 *  MathDocument all return the MathDocument itself, so you can
 *  chain the method calls.  E.g.,
 *
 *    const html = MathJax.Document('<html>...</html>');
 *    html.findMath()
 *        .compile()
 *        .getMetrics()
 *        .typeset()
 *        .updateDocument();
 *
 *  The MathDocument is the main interface for page authors to
 *  interact with MathJax.
 *
 * @template DOM   The DOM element types
 */
export interface MathDocument<DOM extends DOM_TYPES> {
  /**
   * The document being processed (e.g., DOM document, or Markdown string)
   */
  document: D<DOM>;

  /**
   * The kind of MathDocument (e.g., "HTML")
   */
  kind: string;

  /**
   * The options for the document
   */
  options: DOCUMENT_OPTIONS<DOM>;

  /**
   * The list of MathItems found in this page
   */
  math: MathList<DOM>;

  /**
   * The list of actions to take during a render() or convert() call
   */
  renderActions: RenderList<DOM>;

  /**
   * This object tracks what operations have been performed, so that (when
   *  asynchronous operations are used), the ones that have already been
   *  completed won't be performed again.
   */
  processed: BitField;

  /**
   * An array of input jax to run on the document
   */
  inputJax: InputJax<DOM>[];

  /**
   * The output jax to use for the document
   */
  outputJax: OutputJax<DOM>;

  /**
   * The DOM adaptor to use for input and output
   */
  adaptor: DOMAdaptor<DOM>;

  /**
   * The MmlFactory to be used for input jax and error processing
   */
  mmlFactory: MmlFactory;

  /**
   * @param {string} id      The id of the action to add
   * @param {any[]} action   The RenderAction to take
   */
  addRenderAction(id: string, ...action: any[]): void;

  /**
   * @param {string} id   The id of the action to remove
   */
  removeRenderAction(id: string): void;

  /**
   * Perform the renderActions on the document
   *
   * @returns {MathDocument}    The math document instance
   */
  render(): this;

  /**
   * Perform the renderActions on the document with retry handling
   *
   * @returns {Promise<MathDocument>}   A promise that resolves when the render is complete
   */
  renderPromise(): Promise<this>;

  /**
   * Rerender the MathItems on the page
   *
   * @param {number} start      The state to start rerendering at
   * @returns {MathDocument}    The math document instance
   */
  rerender(start?: number): this;

  /**
   * Rerender the MathItems on the page
   *
   * @param {number} start              The state to start rerendering at
   * @returns {Promise<MathDocument>}   A promise that resolves when the rerender is complete
   */
  rerenderPromise(start?: number): Promise<this>;

  /**
   * Convert a math string to the document's output format
   *
   * @param {string} math           The math string to convert
   * @param {OptionList} options    The options for the conversion (e.g., format, ex, em, etc.)
   * @returns {MmlNode|N<DOM>}      The MmlNode or N node for the converted content
   */
  convert(math: string, options?: OptionList): MmlNode | N<DOM>;

  /**
   * Convert a math string to the document's output format
   *
   * @param {string} math                 The math string to convert
   * @param {OptionList} options          The options for the conversion (e.g., format, ex, em, etc.)
   * @returns {Promise<MmlNode|N<DOM>>}   A promise that resolves when the conversion is complete
   */
  convertPromise(math: string, options?: OptionList): Promise<MmlNode | N<DOM>>;

  /**
   * Perform an action when previous actions are complete.
   * (Used to chain promise-based typeset and conversion actions.)
   */
  whenReady(action: () => any): Promise<any>;

  /**
   * Return a promise that resolves when all of the  action promises have been resolved
   */
  actionPromises(): Promise<any[]>;

  /**
   * Clear the action promises
   */
  clearPromises(): void;

  /**
   * Save a promise in the action romises list
   */
  savePromise(promise: Promise<any>): void;

  /**
   * Locates the math in the document and constructs the MathList
   *  for the document.
   *
   * @param {OptionList} options  The options for locating the math
   * @returns {MathDocument}      The math document instance
   */
  findMath(options?: OptionList): this;

  /**
   * Calls the input jax to process the MathItems in the MathList
   *
   * @returns {MathDocument}  The math document instance
   */
  compile(): this | Promise<void>;

  /**
   * Gets the metric information for the MathItems
   *
   * @returns {MathDocument}  The math document instance
   */
  getMetrics(): this;

  /**
   * Calls the output jax to process the compiled math in the MathList
   *
   * @returns {MathDocument}  The math document instance
   */
  typeset(): this | Promise<void>;

  /**
   * Updates the document to include the typeset math
   *
   * @returns {MathDocument}  The math document instance
   */
  updateDocument(): this;

  /**
   * Removes the typeset math from the document
   *
   * @param {boolean} restore   True if the original math should be put
   *                              back into the document as well
   * @returns {MathDocument}    The math document instance
   */
  removeFromDocument(restore?: boolean): this;

  /**
   * Set the state of the document (allowing you to roll back
   *  the state to a previous one, if needed).
   *
   * @param {number} state      The new state of the document
   * @param {boolean} restore   True if the original math should be put
   *                              back into the document during the rollback
   * @returns {MathDocument}    The math document instance
   */
  state(state: number, restore?: boolean): this;

  /**
   * Clear the processed values so that the document can be reprocessed
   *
   * @param {ResetList} options   The things to be reset
   * @returns {MathDocument}      The math document instance
   */
  reset(options?: ResetList): this;

  /**
   * Reset the processed values and clear the MathList (so that new math
   * can be processed in the document).
   *
   * @returns {MathDocument}  The math document instance
   */
  clear(): this;

  /**
   * Indicate that the MathDocument is no longer needed.
   */
  done(): Promise<void>;

  /**
   * Merges a MathList into the list for this document.
   *
   * @param {MathList} list    The MathList to be merged into this document's list
   * @returns {MathDocument}   The math document instance
   */
  concat(list: MathList<DOM>): this;

  /**
   * Clear the typeset MathItems that are within the given container
   *   from the document's MathList.  (E.g., when the content of the
   *   container has been updated and you want to remove the
   *   associated MathItems)
   *
   * @param {ContainerList<DOM>} containers   The container DOM elements whose math items are to be removed
   * @returns {MathItem<DOM>[]}               The removed MathItems
   */
  clearMathItemsWithin(containers: ContainerList<DOM>): MathItem<DOM>[];

  /**
   * Get the typeset MathItems that are within a given container.
   *
   * @param {ContainerList<DOM>} elements   The container DOM elements whose math items are to be found
   * @returns {MathItem<DOM>[]}             The list of MathItems within that container
   */
  getMathItemsWithin(elements: ContainerList<DOM>): MathItem<DOM>[];
}

/*****************************************************************/

/**
 * Defaults used when input jax isn't specified
 *
 * @template DOM   The DOM element types
 */
class DefaultInputJax<DOM extends DOM_TYPES> extends AbstractInputJax<DOM> {
  /**
   * @override
   */
  public compile(_math: MathItem<DOM>) {
    return null as MmlNode;
  }
}

/**
 * Defaults used when ouput jax isn't specified
 *
 * @template DOM   The DOM element types
 */
class DefaultOutputJax<DOM extends DOM_TYPES> extends AbstractOutputJax<DOM> {
  /**
   * @override
   */
  public typeset(_math: MathItem<DOM>, _document: MathDocument<DOM> = null) {
    return null as N<DOM>;
  }
  /**
   * @override
   */
  public escaped(_math: MathItem<DOM>, _document?: MathDocument<DOM>) {
    return null as N<DOM>;
  }
}

/**
 * Default for the MathList when one isn't specified
 *
 * @template DOM   The DOM element types
 */
class DefaultMathList<DOM extends DOM_TYPES> extends AbstractMathList<DOM> {}

/**
 * Default for the Mathitem when one isn't specified
 *
 * @template DOM   The DOM element types
 */
class DefaultMathItem<DOM extends DOM_TYPES> extends AbstractMathItem<DOM> {}

/*****************************************************************/

/**
 * The MathDocument option types.
 *
 * @template DOM   The DOM element types
 */
export type DOCUMENT_OPTIONS<DOM extends DOM_TYPES> = {
  OutputJax: OutputJax<DOM>; //                      Instance of an OutputJax for the document
  InputJax: InputJax<DOM> | InputJax<DOM>[]; //      Instance of an InputJax or an array of them
  MmlFactory: MmlFactory; //                         Instance of a MmlFactory for this document
  MathList: Constructor<MathList<DOM>>; //           Constructor for a MathList to use for the document
  MathItem: Constructor<AbstractMathItem<DOM>>; //   Constructor for a MathItem to use for the MathList
  compileError: (
    doc: AbstractMathDocument<DOM>,
    math: MathItem<DOM>,
    err: Error
  ) => void;
  typesetError: (
    doc: AbstractMathDocument<DOM>,
    math: MathItem<DOM>,
    err: Error
  ) => void;
  renderActions: RenderActions<DOM>;
};

/**
 * The MathDocument default options.
 */
const options: DOCUMENT_OPTIONS<DOM> = {
  OutputJax: null,
  InputJax: null,
  MmlFactory: null,
  MathList: DefaultMathList,
  MathItem: DefaultMathItem,
  compileError(doc, math, err) {
    doc.compileError(math, err);
  },
  typesetError(doc, math, err) {
    doc.typesetError(math, err);
  },
  renderActions: expandable({
    find: [STATE.FINDMATH, 'findMath', '', false],
    compile: [STATE.COMPILED, 'compileAction', 'compile'],
    metrics: [STATE.METRICS, 'getMetrics', '', false],
    typeset: [STATE.TYPESET, 'typesetAction', 'typeset'],
    update: [STATE.INSERTED, 'updateDocument', false],
  }),
};

/**
 *  Implements the abstract MathDocument class
 *
 * @template DOM   The DOM element types
 */
export abstract class AbstractMathDocument<
  DOM extends DOM_TYPES,
> implements MathDocument<DOM> {
  /**
   * The type of MathDocument
   */
  public static KIND: string = 'MathDocument';

  /**
   * The default options for the document
   */
  public static OPTIONS = options;

  /**
   * A bit-field for the actions that have been processed
   */
  public static ProcessBits = BitFieldClass(
    'findMath',
    'compile',
    'getMetrics',
    'typeset',
    'updateDocument'
  );

  /**
   * The document managed by this MathDocument
   */
  public document: D<DOM>;
  /**
   * The actual options for this document (with user-supplied ones merged in)
   */
  public options: DOCUMENT_OPTIONS<DOM>;

  /**
   * The list of MathItems for this document
   */
  public math: MathList<DOM>;

  /**
   * The list of render actions
   */
  public renderActions: RenderList<DOM>;

  /**
   * The render action promise list
   */
  protected _actionPromises: Promise<void>[];

  /**
   * Promise for the current typeset or conversion action
   * (used to chain the promise-based calls so they don't
   * overlap).
   */
  protected _readyPromise: Promise<any>;

  /**
   * The bit-field used to tell what steps have been taken on the document (for retries)
   */
  public processed: BitField;

  /**
   * The list of input jax for the document
   */
  public inputJax: InputJax<DOM>[];

  /**
   * The output jax for the document
   */
  public outputJax: OutputJax<DOM>;

  /**
   * The DOM adaptor for the document
   */
  public adaptor: DOMAdaptor<DOM>;

  /**
   * The MathML node factory for the internal MathML representation
   */
  public mmlFactory: MmlFactory;

  /**
   * @param {any} document           The document (HTML string, parsed DOM, etc.) to be processed
   * @param {DOMAdaptor} adaptor     The DOM adaptor for this document
   * @param {OptionList} options     The options for this document
   * @class
   */
  constructor(document: D<DOM>, adaptor: DOMAdaptor<DOM>, options: OptionList) {
    const CLASS = this.constructor as typeof AbstractMathDocument;
    this.document = document;
    this.options = userOptions(
      defaultOptions({}, CLASS.OPTIONS),
      options
    ) as DOCUMENT_OPTIONS<DOM>;
    this.math = new (this.options.MathList ?? DefaultMathList)();
    this.renderActions = RenderList.create<DOM>(this.options.renderActions);
    this._actionPromises = [];
    this._readyPromise = Promise.resolve();
    this.processed = new AbstractMathDocument.ProcessBits();
    this.outputJax = this.options.OutputJax ?? new DefaultOutputJax<DOM>();
    let inputJax = this.options.InputJax ?? [new DefaultInputJax<DOM>()];
    if (!Array.isArray(inputJax)) {
      inputJax = [inputJax];
    }
    this.inputJax = inputJax;
    //
    // Pass the DOM adaptor to the jax
    //
    this.adaptor = adaptor;
    this.outputJax.setAdaptor(adaptor);
    this.inputJax.map((jax) => jax.setAdaptor(adaptor));
    //
    // Pass the MmlFactory to the jax
    //
    this.mmlFactory = this.options.MmlFactory || new MmlFactory();
    this.inputJax.map((jax) => jax.setMmlFactory(this.mmlFactory));
    //
    // Do any initialization that requires adaptors or factories
    //
    this.outputJax.initialize();
    this.inputJax.map((jax) => jax.initialize());
  }

  /**
   * @returns {string}  The kind of document
   */
  public get kind(): string {
    return (this.constructor as typeof AbstractMathDocument).KIND;
  }

  /**
   * @override
   */
  public addRenderAction(id: string, ...action: any[]) {
    const [fn, p] = RenderList.action<DOM>(id, action as RenderAction<DOM>);
    this.renderActions.add(fn, p);
  }

  /**
   * @override
   */
  public removeRenderAction(id: string): void {
    const action = this.renderActions.findID(id);
    if (action) {
      this.renderActions.remove(action);
    }
  }

  /**
   * @override
   */
  public render() {
    this.clearPromises();
    this.renderActions.renderDoc(this, STATE.UNPROCESSED, 0);
    return this;
  }

  /**
   * @override
   */
  public renderPromise(): Promise<this> {
    return this.whenReady(() =>
      mathjax.handleRetriesFor(async () => {
        this.render();
        await this.actionPromises();
        this.clearPromises();
        return this;
      })
    );
  }

  /**
   * @override
   */
  public rerender(start: number = STATE.RERENDER): this {
    this.state(start - 1);
    this.render();
    return this;
  }

  /**
   * @override
   */
  public rerenderPromise(start: number = STATE.RERENDER): Promise<this> {
    return this.whenReady(() =>
      mathjax.handleRetriesFor(async () => {
        this.rerender(start);
        await this.actionPromises();
        this.clearPromises();
        return this;
      })
    );
  }

  /**
   * @override
   */
  public convert(math: string, options: OptionList = {}): MmlNode | N<DOM> {
    let { format, display, end, ex, em, containerWidth, scale, family } =
      userOptions(
        {
          format: this.inputJax[0].name,
          display: true,
          end: STATE.LAST,
          em: 16,
          ex: 8,
          containerWidth: null,
          scale: 1,
          family: '',
        },
        options
      );
    if (containerWidth === null) {
      containerWidth = 80 * ex;
    }
    const jax = this.inputJax.reduce(
      (jax, ijax) => (ijax.name === format ? ijax : jax),
      null
    );
    const mitem = new this.options.MathItem(math, jax, display);
    mitem.start.node = this.adaptor.body(this.document);
    mitem.setMetrics(em, ex, containerWidth, scale);
    if (family && this.outputJax.options.mtextInheritFont) {
      mitem.outputData.mtextFamily = family;
    }
    if (family && this.outputJax.options.merrorInheritFont) {
      mitem.outputData.merrorFamily = family;
    }
    this.clearPromises();
    const result = mitem.convert(this, end);
    if (result instanceof Promise) {
      mathjax.retryAfter(result, () => mitem.typesetRoot || mitem.root);
    }
    return mitem.typesetRoot || mitem.root;
  }

  /**
   * @override
   */
  public convertPromise(
    math: string,
    options: OptionList = {}
  ): Promise<MmlNode | N<DOM>> {
    return this.whenReady(() =>
      mathjax.handleRetriesFor(async () => {
        const node = this.convert(math, options);
        await this.actionPromises();
        this.clearPromises();
        return node;
      })
    );
  }

  /**
   * @override
   */
  public whenReady(action: () => any): Promise<any> {
    return (this._readyPromise = this._readyPromise
      .catch((_) => {})
      .then(() => {
        //
        // Cache old _readyPromise and replace it with a resolved
        // promise in case action() calls whenReady(), so we don't get
        // a circular dependency where the action is waiting on itself.
        //
        const ready = this._readyPromise;
        this._readyPromise = Promise.resolve();
        //
        // Do the action and save its result.
        //
        const result = action();
        //
        // Get a promise that returns the result after
        // any new _readyPromise resolves (in case action
        // called whenReady() or another function that does).
        //
        const promise = this._readyPromise.then(() => result);
        //
        // Put back the original promise.
        //
        this._readyPromise = ready;
        //
        // Return promise that returns the result.  The original
        // _readyPromise will wait on it to complete before it resolves,
        // since promises that return promises automatically chain.
        // This inserts any new _readyPromise promises into the
        // original _readyPromise chain at this point.
        //
        return promise;
      }));
  }

  /**
   * @override
   */
  public actionPromises(): Promise<void[]> {
    return Promise.all(this._actionPromises);
  }

  /**
   * @override
   */
  public clearPromises(): void {
    this._actionPromises = [];
  }

  /**
   * @override
   */
  public savePromise(promise: Promise<any>): void {
    this._actionPromises.push(promise);
  }

  /**
   * @override
   */
  public findMath(_options: OptionList = null): this {
    this.processed.set('findMath');
    return this;
  }

  /**
   * @override
   */
  public compile(): this | Promise<void> {
    return this.compileAction(false);
  }

  /**
   * Compile action that handles retryAfter() calls.
   *
   * @param {boolean} action           True when called as a renderAction
   * @param {MathListItem} item        The MathListItem to begin with
   * @param {MathItem[]} recompile     Array of MathItems to be rerendered (e.g., with forward references)
   * @returns {MathDocument|Promise}   A promise for restarting, otherwise void
   */
  protected compileAction(
    action: boolean = true,
    item: MathListItem<DOM> = this.math.first(),
    recompile: MathItem<DOM>[] = []
  ): this | Promise<void> {
    if (this.processed.isSet('compile')) return this;
    while (!item.isEnd) {
      const math = item.data as MathItem<DOM>;
      try {
        this.compileMath(math);
      } catch (err) {
        if (action && err.retry) {
          return err.retry.then(() =>
            this.compileAction(action, item, recompile)
          );
        }
        throw err;
      }
      if (math.inputData.recompile !== undefined) {
        recompile.push(math);
      }
      item = item.next;
    }
    const result = this.recompileAction(action, recompile, 0);
    if (result) return result;
    this.processed.set('compile');
    return this;
  }

  /**
   * If any were added to the recompile list, compile them again
   *
   * @param {boolean} action         True when called as a renderAction
   * @param {MathItem[]} recompile   Array of MathItems to be rerendered (e.g., with forward references)
   * @param {number} i               The entry in the recompile list to start at
   * @returns {Promise|void}         A promise for restarting, otherwise void
   */
  protected recompileAction(
    action: boolean,
    recompile: MathItem<DOM>[],
    i: number = 0
  ): Promise<void> | void {
    while (i < recompile.length) {
      const math = recompile[i++];
      const data = math.inputData.recompile;
      math.state(data.state);
      math.inputData.recompile = data;
      try {
        this.compileMath(math);
      } catch (err) {
        if (action && err.retry) {
          return err.retry.then(() =>
            this.recompileAction(action, recompile, i)
          );
        }
        throw err;
      }
    }
  }

  /**
   * @param {MathItem} math   The item to compile
   */
  protected compileMath(math: MathItem<DOM>): void {
    try {
      math.compile(this);
    } catch (err) {
      if (err.retry) {
        throw err;
      }
      this.options.compileError(this, math, err);
      math.inputData.error = err;
    }
  }

  /**
   * Produce an error using MmlNodes
   *
   * @param {MathItem} math  The MathItem producing the error
   * @param {Error} err      The Error object for the error
   */
  public compileError(math: MathItem<DOM>, err: Error): void {
    math.root = this.mmlFactory.create('math', null, [
      this.mmlFactory.create(
        'merror',
        { 'data-mjx-error': err.message, title: err.message },
        [
          this.mmlFactory.create('mtext', null, [
            (this.mmlFactory.create('text') as TextNode).setText(
              localize('InputError')
            ),
          ]),
        ]
      ),
    ]);
    if (math.display) {
      math.root.attributes.set('display', 'block');
    }
    math.inputData.error = err.message;
  }

  /**
   * @override
   */
  public typeset(): this | Promise<void> {
    return this.typesetAction(false);
  }

  /**
   * Typeset action that handles retryAfter() calls.
   *
   * @param {boolean} action      True when called as a renderAction
   * @param {MathListItem} item   The MathList item to start with
   * @returns {MathDocument}      The current MathDocument (for chaining)
   */
  protected typesetAction(
    action: boolean = true,
    item: MathListItem<DOM> = this.math.first()
  ): this | Promise<void> {
    if (this.processed.isSet('typeset')) return this;
    while (!item.isEnd) {
      const math = item.data as MathItem<DOM>;
      try {
        math.typeset(this);
      } catch (err) {
        if (err.retry) {
          if (action) {
            return err.retry.then(() => this.typesetAction(action, item));
          }
          throw err;
        }
        this.options.typesetError(this, math, err);
        math.outputData.error = err;
      }
      item = item.next;
    }
    this.processed.set('typeset');
    return this;
  }

  /**
   * Produce an error using HTML
   *
   * @param {MathItem} math  The MathItem producing the error
   * @param {Error} err      The Error object for the error
   */
  public typesetError(math: MathItem<DOM>, err: Error): void {
    math.typesetRoot = this.adaptor.node(
      'mjx-container',
      {
        class: 'MathJax mjx-output-error',
        jax: this.outputJax.name,
      },
      [
        this.adaptor.node(
          'span',
          {
            'data-mjx-error': err.message,
            title: err.message,
            style: {
              color: 'red',
              'background-color': 'yellow',
              'line-height': 'normal',
            },
          },
          [this.adaptor.text(localize('OutputError'))]
        ),
      ]
    );
    if (math.display) {
      this.adaptor.setAttributes(math.typesetRoot, {
        style: {
          display: 'block',
          margin: '1em 0',
          'text-align': 'center',
        },
      });
    }
    math.outputData.error = err.message;
  }

  /**
   * @override
   */
  public getMetrics(): this {
    if (!this.processed.isSet('getMetrics')) {
      this.outputJax.getMetrics(this);
      this.processed.set('getMetrics');
    }
    return this;
  }

  /**
   * @override
   */
  public updateDocument(): this {
    if (!this.processed.isSet('updateDocument')) {
      for (const math of this.math.reversed()) {
        math.updateDocument(this);
      }
      this.processed.set('updateDocument');
    }
    return this;
  }

  /**
   * @override
   */
  public removeFromDocument(_restore: boolean = false): this {
    return this;
  }

  /**
   * @override
   */
  public state(state: number, restore: boolean = false): this {
    for (const math of this.math) {
      math.state(state, restore);
    }
    if (state < STATE.INSERTED) {
      this.processed.clear('updateDocument');
    }
    if (state < STATE.TYPESET) {
      this.processed.clear('typeset');
      this.processed.clear('getMetrics');
    }
    if (state < STATE.COMPILED) {
      this.processed.clear('compile');
    }
    if (state < STATE.FINDMATH) {
      this.processed.clear('findMath');
    }
    return this;
  }

  /**
   * @override
   */
  public reset(options: ResetList = { processed: true }): this {
    options = userOptions(Object.assign({}, resetOptions), options);
    if (options.all) {
      Object.assign(options, resetAllOptions);
    }
    if (options.processed) {
      this.processed.reset();
    }
    if (options.inputJax) {
      this.inputJax.forEach((jax) => jax.reset(...options.inputJax));
    }
    if (options.outputJax) {
      this.outputJax.reset(...options.outputJax);
    }
    return this;
  }

  /**
   * @override
   */
  public clear(): this {
    this.reset();
    this.math.clear();
    return this;
  }

  /**
   * @override
   */
  public done(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * @override
   */
  public concat(list: MathList<DOM>): this {
    this.math.merge(list);
    return this;
  }

  /**
   * @override
   */
  public clearMathItemsWithin(containers: ContainerList<DOM>): MathItem<DOM>[] {
    const items = this.getMathItemsWithin(containers);
    for (const item of items.slice(0).reverse()) {
      item.clear();
    }
    this.math.remove(...items);
    return items;
  }

  /**
   * @override
   */
  public getMathItemsWithin(elements: ContainerList<DOM>): MathItem<DOM>[] {
    if (!Array.isArray(elements)) {
      elements = [elements];
    }
    const adaptor = this.adaptor;
    const items = [] as MathItem<DOM>[];
    const containers = adaptor.getElements(
      elements as ContainerSpec<DOM>[],
      this.document
    );
    ITEMS: for (const item of this.math) {
      for (const container of containers) {
        if (item.start.node && adaptor.contains(container, item.start.node)) {
          items.push(item);
          continue ITEMS;
        }
      }
    }
    return items;
  }
}

/**
 * The constructor type for a MathDocument
 *
 * @template DOC   The MathDocument type this constructor is for
 * @template D     The DOM types in use
 */
export interface MathDocumentConstructor<
  DOC extends MathDocument<D>,
  D extends DOM_TYPES,
> {
  KIND: string;
  OPTIONS: DOCUMENT_OPTIONS<D>;
  ProcessBits: typeof BitField;
  new (...args: any[]): DOC;
}
