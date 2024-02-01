import {Configuration} from '../../Configuration.js';
import {CommandMap} from '../../TokenMap.js';
import BaseMethods from '../../base/BaseMethods.js';
import {ParseMethod} from '../../Types.js';

/**
 * The methods that implement the ieee euler package.
 */
let EulerIeeeMethods: Record<string, ParseMethod> = {};

EulerIeeeMethods.Macro = BaseMethods.Macro;
EulerIeeeMethods.MathFont = BaseMethods.MathFont;

new CommandMap('euler_ieee', {
  matheur: ['MathFont','-euler-R'],
  matheuf: ['MathFont','-euler-F'],
  matheus: ['MathFont','-euler-S'],
}, EulerIeeeMethods);

//
//  Define the package for our new environment
//
export const EulerIeeeConfiguration = Configuration.create('eulerieee', {
  handler: {
    macro: ['euler_ieee'],
  }
});

