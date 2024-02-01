import {Configuration} from '../../Configuration.js';
import {CommandMap} from '../../TokenMap.js';
import BaseMethods from '../../base/BaseMethods.js';
import {ParseMethod} from '../../Types.js';

/**
 * The methods that implement the ieee dsfont package.
 */
let DsfontMethods: Record<string, ParseMethod> = {};

DsfontMethods.Macro = BaseMethods.Macro;
DsfontMethods.MathFont = BaseMethods.MathFont;

new CommandMap('dsfont', {
  mathds: ['MathFont','-ds-rm'],
  mathdss: ['MathFont','-ds-ss'],
  mathbbm: ['MathFront', '-bboldx'],
  mathbbmss: ['MathFront', '-ds-rm'],
}, DsfontMethods);

//
//  Define the package for our new environment
//
export const DsfontConfiguration = Configuration.create('dsfont', {
  handler: {
    macro: ['dsfont'],
  }
});

