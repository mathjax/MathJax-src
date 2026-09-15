import type {
  COMPONENT_LIST,
  ADAPTOR_LIST,
  MATHJAX_CONFIG,
  MATHJAX_OBJECT,
  MATHJAX_COMPONENTS,
  ADAPTOR_DOM,
} from '@mathjax/src/mjs/types/mathjax.js';
import type { MathJaxObject } from '@mathjax/src/mjs/components/startup.js';

export function init<
  T extends COMPONENT_LIST<ADAPTOR_DOM<A>> = 'startup',
  A extends ADAPTOR_LIST = 'browser'
>(
  config: MATHJAX_CONFIG<T, A>,
  component?: MATHJAX_COMPONENTS<T, A>
): Promise<MATHJAX_OBJECT<T, A>>;

export const MathJax: MathJaxObject;
