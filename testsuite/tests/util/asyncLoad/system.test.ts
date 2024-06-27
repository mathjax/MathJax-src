import { describe, test, expect } from '@jest/globals';
import './dirname.mjs';
import './system.cjs';
import {mathjax} from '#js/mathjax.js';
import {asyncLoad} from '#js/util/AsyncLoad.js';
import {setBaseURL} from '#js/util/asyncLoad/system.js';
import * as path from 'path';

const root = path.resolve('..', 'mjs');
const lib = path.resolve('lib');

describe('asyncLoad() for node', () => {

  test('asyncLoad()', async () => {
    const cjsFile = path.join('..', 'testsuite', 'lib', 'AsyncLoad.child.cjs');
    const mjsFile = path.join('..', 'testsuite', 'lib', 'AsyncLoad.child.mjs');
    const relUnknown = path.join('..', 'testsuite', 'lib', 'AsyncLoad.unknown.cjs');
    const absFile = path.join(root, cjsFile);
    const absUnknown = path.join(root, relUnknown);

    await expect(asyncLoad(cjsFile)).resolves.toEqual({loaded: true});          // relative file found
    await expect(asyncLoad(relUnknown).catch(() => true)).resolves.toBe(true);  // relative file not found
    await expect(asyncLoad(absFile)).resolves.toEqual({loaded: true});          // absolute file found
    await expect(asyncLoad(absUnknown).catch(() => true)).resolves.toBe(true);  // absolute file not found

    await expect(asyncLoad('#js/components/version.js')                         // can't load using package exports
                 .catch(() => true)).resolves.toBe(true);
    await expect(asyncLoad('mathjax-full/js/components/version.js')             // can't load from module
                 .catch(() => true)).resolves.toBe(true);

    await expect(asyncLoad(mjsFile).then((result: any) => result.loaded)).resolves.toBe(true);  // mjs file loads
    expect(mathjax.asyncIsSynchronous).toBe(false);                             // system.js is asynchronous
  });

  test('setBaseURL() for node', async () => {
    setBaseURL(lib);
    const relFile = './AsyncLoad.child.cjs';
    const relUnknown = './AsyncLoad.unknown.cjs';
    await expect(asyncLoad(relFile)).resolves.toEqual({loaded: true});          // relative file found
    await expect(asyncLoad(relUnknown).catch(() => true)).resolves.toBe(true);  // relative file not found
  });

});
