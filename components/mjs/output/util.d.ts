import { OutputJax } from '@mathjax/src/mjs/core/OutputJax.js';
import { Font } from '@mathjax/src/mjs/output/common/FontData.js';
import { DOM_TYPES } from '@mathjax/src/mjs/types/Types.js';

export function configFont(
  font: string,
  jax: string,
  config: { fontPath?: string },
  extension?: string,
): string;

export function configExtensions(
  jax: string,
  config: {
    fontExtensions?: string[];
    fontPath?: string;
  },
): string[];

export const OutputUtil: {

  config<DOM extends DOM_TYPES>(
    jax: string,
    jaxClass: OutputJax<DOM>,
    defaultFont: Font,
    fontClass: any,
  ): void,

  loadFont(
    startup: (ready: () => void) => Promise<void>,
    jax: string,
    font: string,
    preloaded?: boolean,
  ): Promise<void>;

};
