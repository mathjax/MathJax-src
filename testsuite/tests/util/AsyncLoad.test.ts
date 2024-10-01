import { describe, test, expect } from '@jest/globals';
import {asyncLoad} from '#js/util/AsyncLoad.js';
import {mathjax} from '#js/mathjax.js';

describe('asyncLoad()', () => {

  test('asyncLoad()', async () => {
    //
    // Throws error if not set in mathjax
    //
    expect(asyncLoad('x.js').then(() => false).catch(() => true)).resolves.toBe(true);

    //
    // mathjax.asyncLoad returns value
    //
    mathjax.asyncLoad = (_name: string) => 'success';
    await expect(asyncLoad('x.js')).resolves.toBe('success');

    //
    // mathjax.asyncLoad throws error
    //
    mathjax.asyncLoad = (_name: string) => {throw 'fail'};
    await expect(asyncLoad('x.js')).rejects.toBe('fail');

    //
    // mathjax.asyncLoad returns promise
    //
    mathjax.asyncLoad = (_name: string) => Promise.resolve().then(() => 'success');
    await expect(asyncLoad('x.js')).resolves.toBe('success');

    //
    // mathjax.asyncLoad returns promise that rejects
    //
    mathjax.asyncLoad = (_name: string) => Promise.reject().catch(() => {throw 'fail'});
    await expect(asyncLoad('x.js')).rejects.toBe('fail');

  });

});
