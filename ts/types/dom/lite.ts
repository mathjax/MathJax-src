import { LiteElement } from '../../adaptors/lite/Element.js';
import { LiteDocument } from '../../adaptors/lite/Document.js';
import { LiteText } from '../../adaptors/lite/Text.js';

import { DOM } from '../Types.js';

/**
 * The HTML DOM elements
 */
export type N = LiteElement;
export type T = LiteText;
export type D = LiteDocument;
export type LITE_DOM = DOM<N, T, D>;
