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
  A extends ADAPTOR_LIST = 'liteDOM'
>(
  config: MATHJAX_CONFIG<T | 'startup', A>,
  component?: MATHJAX_COMPONENTS<T | 'startup', A>
): Promise<MATHJAX_OBJECT<T | 'startup', A>>;

export const MathJax: MathJaxObject;
