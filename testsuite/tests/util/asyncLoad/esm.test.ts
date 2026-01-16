import { describe, test, expect } from '@jest/globals';
import {mathjax} from '#js/mathjax.js';
import {asyncLoad} from '#js/util/AsyncLoad.js';
import {setBaseURL} from '#js/util/asyncLoad/esm.js';
import * as path from 'path';

const root = path.resolve('..', 'mjs');
const lib = path.resolve('lib');

describe('asyncLoad() for esm', () => {

  test('asyncLoad()', async () => {
    const cjsFile = path.join('..', 'testsuite', 'lib', 'AsyncLoad.child.cjs');
    const mjsFile = path.join('..', 'testsuite', 'lib', 'AsyncLoad.child.mjs');
    const jsonFile = path.join('..', 'testsuite', 'lib', 'AsyncLoad.child.json');
    const relUnknown = path.join('..', 'testsuite', 'lib', 'AsyncLoad.unknown.cjs');
    const jsonUnknown = path.join('..', 'testsuite', 'lib', 'AsyncLoad.unknown.json');
    const absFile = path.join(root, cjsFile);
    const absJson = path.join(root, jsonFile);
    const absUnknown = path.join(root, relUnknown);

    await expect(asyncLoad(cjsFile)).resolves.toEqual({loaded: true});          // relative file found
    await expect(asyncLoad(relUnknown).catch(() => true)).resolves.toBe(true);  // relative file not found
    await expect(asyncLoad(absFile)).resolves.toEqual({loaded: true});          // absolute file found
    await expect(asyncLoad(absUnknown).catch(() => true)).resolves.toBe(true);  // absolute file not found

    await expect(asyncLoad(jsonFile)).resolves.toEqual({json: true});           // relative json file found
    await expect(asyncLoad(absJson)).resolves.toEqual({json: true});            // absolute json file found
    await expect(asyncLoad(jsonUnknown).catch(() => true)).resolves.toBe(true); // unknown file not found

    await expect(asyncLoad('#js/components/version.js')                         // load using package exports
                 .then((result: any) => result.VERSION)).resolves.toBe(mathjax.version);
    await expect(asyncLoad('@mathjax/src/js/components/version.js')             // load from module
                 .then((result: any) => result.VERSION)).resolves.toBe(mathjax.version);

    await expect(asyncLoad(mjsFile).then((result: any) => result.loaded)).resolves.toBe(true);  // mjs file loads
    expect(mathjax.asyncIsSynchronous).toBe(false);                             // esm.js is asynchronous
  });

  test('setBaseURL() for esm', async () => {
    setBaseURL(lib);
    const relFile = './AsyncLoad.child.cjs';
    const relUnknown = './AsyncLoad.unknown.cjs';
    await expect(asyncLoad(relFile)).resolves.toEqual({loaded: true});          // relative file found
    await expect(asyncLoad(relUnknown).catch(() => true)).resolves.toBe(true);  // relative file not found
  });

});
