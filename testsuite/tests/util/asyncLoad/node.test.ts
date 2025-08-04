import { describe, test, expect } from '@jest/globals';
import './dirname.mjs';
import '#source/../require.mjs';
import {mathjax} from '#js/mathjax.js';
import {asyncLoad} from '#js/util/AsyncLoad.js';
import {setBaseURL} from '#js/util/asyncLoad/node.js';
import * as path from 'path';

const root = path.dirname(path.dirname(__dirname));
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

    await expect(asyncLoad('#js/../cjs/components/version.js')                  // load using package exports
                 .then((result: any) => result.VERSION)).resolves.toBe(mathjax.version);
    await expect(asyncLoad('@mathjax/src/js/components/version.js')             // load from module
                 .then((result: any) => result.VERSION)).resolves.toBe(mathjax.version);

    await expect(asyncLoad(mjsFile).catch(() => true)).resolves.toBe(true);     // mjs file fails
    expect(mathjax.asyncIsSynchronous).toBe(true);                              // node.js is synchronous
  });

  test('setBaseURL() for node', async () => {
    setBaseURL(lib);
    const relFile = './AsyncLoad.child.cjs';
    const relUnknown = './AsyncLoad.unknown.cjs';
    await expect(asyncLoad(relFile)).resolves.toEqual({loaded: true});          // relative file found
    await expect(asyncLoad(relUnknown).catch(() => true)).resolves.toBe(true);  // relative file not found
  });

});
