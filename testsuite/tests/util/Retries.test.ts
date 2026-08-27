import { describe, test, expect } from '@jest/globals';
import { handleRetriesFor, retryAfter } from '#js/util/Retries.js';
import { MathJax as MJX, MathJaxObject } from '#js/components/global.js';

/**
 * Add the legacy MathJax.CallBack for testing v2-style restarts
 */
type MathJaxGlobal = MathJaxObject & {
  /* eslint-disable @typescript-eslint/no-unsafe-function-type */
  Callback: {
    After(code: Function): void;
    mock(): Function;
  };
};
const MathJax: MathJaxGlobal = Object.assign(MJX, {
  Callback: {
    After(code: () => void) {
      setTimeout(code, 1);
    },
    mock() {
      return Object.assign(() => {}, { isCallback: true });
    },
  },
});

/**********************************************************************************/
/**********************************************************************************/

describe('handleRetriesFor() and retryAfter()', () => {
  /********************************************************************************/

  test('handleRetriesFor() then/catch getting called', () => {
    expect(handleRetriesFor(() => 'success')).resolves.toBe('success');
    expect(
      handleRetriesFor(() => {
        throw Error('failed');
      })
    ).rejects.toThrow('failed');
  });

  /********************************************************************************/

  test('handleRetriesFor().then called after 3 retries', async () => {
    let n = 0;
    const result = await handleRetriesFor(() => {
      if (++n < 3) {
        const p = new Promise<void>((ok, _fail) => {
          setTimeout(ok, 1);
        });
        retryAfter(p);
      }
      return 'success';
    });
    expect(result).toBe('success');
    expect(n).toBe(3);
  });

  /********************************************************************************/

  test('handleRetriesFor().catch called for fail on 3rd retry', async () => {
    let n = 0;
    await handleRetriesFor(() => {
      if (++n < 3) {
        const p = new Promise<void>((ok, fail) => {
          setTimeout(() => (n < 2 ? ok() : fail('fail')), 1);
        });
        retryAfter(p);
      }
      throw 'success';
    }).catch((result: string) => {
      expect(result).toBe('fail');
      expect(n).toBe(2);
    });
  });

  /********************************************************************************/

  test('handleRetriesFor().catch called for error on 3rd retry', async () => {
    let n = 0;
    await handleRetriesFor(() => {
      if (++n < 3) {
        const p = new Promise<void>((ok, _fail) => {
          setTimeout(ok, 1);
        });
        retryAfter(p);
      }
      throw Error('fail');
    }).catch((err: Error) => {
      expect(err.message).toBe('fail');
      expect(n).toBe(3);
    });
  });

  /********************************************************************************/

  test('v2 retry', async () => {
    let n = 0;
    const result = await handleRetriesFor(() => {
      if (++n < 3) {
        throw Object.assign(new Error('restart'), {
          restart: MathJax.Callback.mock(), // mark this error as a v2 restart
        });
      }
      return 'success';
    });
    expect(result).toBe('success');
    expect(n).toBe(3);
  });

  /********************************************************************************/

  test('handleRetriesFor() async success', () => {
    expect(
      handleRetriesFor(async () => {
        const wait = new Promise((ok, _fail) =>
          setTimeout(ok, 1, 'success')
        );
        return await wait;
      })
    ).resolves.toBe('success');
  });

  /********************************************************************************/

  test('handleRetriesFor() async fails', () => {
    expect(
      handleRetriesFor(async () => {
        const wait = new Promise((_ok, fail) =>
          setTimeout(fail, 1, 'fail')
        );
        return await wait;
      })
    ).rejects.toBe('fail');
  });

  /********************************************************************************/

  test('handleRetriesFor() async with retry', async () => {
    let n = 0;
    const result = await handleRetriesFor(async () => {
      if (++n < 3) {
        await new Promise<void>((ok, _fail) => setTimeout(ok, 1));
        const p = new Promise<void>((ok, _fail) => {
          setTimeout(ok, 1);
        });
        retryAfter(p);
      }
      return 'success';
    });
    expect(result).toBe('success');
    expect(n).toBe(3);
  });

  /********************************************************************************/

  test('retryAfter() without restart code', async () => {
    let n = 0;
    const result = await handleRetriesFor(() => {
      if (n++) return 'success';
      retryAfter(Promise.resolve());
      return 'failed';
    })
    expect(result).toBe('success');
    expect(n).toBe(2);
  });

  /********************************************************************************/

  test('retryAfter() with restart code', async () => {
    let n = 0;
    const result = await handleRetriesFor(() => {
      if (n++) return 'failed';
      retryAfter(Promise.resolve(), () => 'success');
      return 'failed';
    });
    expect(result).toBe('success');
    expect(n).toBe(1);
  });

  /********************************************************************************/

  test('retryAfter() throws', async () => {
    let n = 0;
    await handleRetriesFor(() => {
      if (n++) throw 'failed';
      retryAfter(Promise.reject('success'));
      throw 'failed';
    }).catch((result: string) => {
      expect(result).toBe('success');
      expect(n).toBe(1);
    });
  });

  /********************************************************************************/

  test('retryAfter() nested', async () => {
    let n = 0;
    await handleRetriesFor(() => {
      retryAfter(new Promise<void>((_ok, _fail) => {
        retryAfter(n++ < 3 ? Promise.resolve() : Promise.reject('success'))
      }));
      throw 'failed';
    }).catch((result: string) => {
      expect(result).toBe('success');
      expect(n).toBe(4);
    });
  });

  /********************************************************************************/
});

/**********************************************************************************/
/**********************************************************************************/
