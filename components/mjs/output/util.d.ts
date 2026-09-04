import { OutputJax } from '@mathjax/src/mjs/core/OutputJax.js';
import { Font } from '@mathjax/src/mjs/output/common/FontData.js';

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

  config<N = any, T = any, D = any>(
    jax: string,
    jaxClass: OutputJax<N, T, D>,
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
