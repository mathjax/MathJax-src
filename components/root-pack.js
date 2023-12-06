//
//  Replacement for __dirname for root directory
//

import {MathJax} from '#js/components/global.js';

const config = MathJax.config || {};
export const mjxRoot = () => config?.loader?.paths?.mathjax || config?.__dirname || '/';
