//
//  Replacement for __dirname for sre-root directory
//

import { mjxRoot } from '@mathjax/src/components/root-pack.js';

export const sreRoot = () => mjxRoot() + '/sre';
