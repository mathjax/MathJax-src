/**
 * Trap output produced while running code.
 *
 * @param {string} method The console method to trap.
 * @param {Function} code The code to run.
 * @returns {string} The output sent to the given method.
 */
export function trapOutput(method: string, code: () => void): string {
  const saved = (console as any)[method];
  let message = '';
  (console as any)[method] = (...msg: any[]) => {
    message += (message ? '\n' : '') + msg.join(' ');
  };
  code();
  (console as any)[method] = saved;
  return message;
}

/**
 * Trap errors produced while running code.
 *
 * @param {Function} code The code to run.
 * @returns {string} The error message produced.
 */
export function trapErrors(code: () => void): string {
  let message = '(no error)';
  reportErrors = true;
  try {
    code();
  } catch (e) {
    message = e.message;
  }
  reportErrors = false;
  return message;
}

/**
 * Trap output produced while running async code.
 *
 * @param {string} method The console method to trap.
 * @param {Function} code The code to run.
 * @returns {string} The output sent to the given method.
 */
export async function trapAsyncOutput(
  method: string,
  code: () => Promise<void>
): Promise<string> {
  const saved = (console as any)[method];
  let message = '';
  (console as any)[method] = (...msg: any[]) => {
    message += (message ? '\n' : '') + msg.join(' ');
  };
  await code();
  (console as any)[method] = saved;
  return message;
}

/**
 * Trap errors produced while running async code.
 *
 * @param {Function} code The code to run.
 * @returns {string} The error message produced.
 */
export async function trapAsyncErrors(
  code: () => Promise<void>
): Promise<string> {
  let message = '(no error)';
  reportErrors = true;
  await code().catch((e) => {
    message = e.message;
  });
  reportErrors = false;
  return message;
}

/**
 * When true, errors will throw rather than produce merror elements.
 */
let reportErrors = false;

/**
 * Configuration that causes TeX errors to throw rather than
 * generate merror elements, so we can trap them with trapErrors().
 */
export const throwTexErrors = {
  formatError(jax: any, err: Error) {
    if (reportErrors) throw err;
    return jax.formatError(err);
  },
};

/**
 * Configuration that causes compile errors to throw rather than
 * generate merror elements, so we can trap them with trapErrors().
 */
export const throwCompileErrors = {
  options: {
    compileError(jax: any, math: any, err: Error) {
      if (reportErrors) throw err;
      return jax.compileError(math, err);
    },
  },
};
