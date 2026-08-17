import { describe, test, expect } from '@jest/globals';
import * as Entities from '#js/util/Entities.js';
import { mathjax } from '#js/mathjax.js';
import '#js/util/asyncLoad/esm.js';
import '@mathjax/src/components/require.mjs';

describe('Entities translation', () => {
  test('translate()', () => {
    expect(Entities.translate('&#97;')).toBe('a');
    expect(Entities.translate('&#x61;')).toBe('a');
    expect(Entities.translate('&amp;')).toBe('&');
  });

  test('Unknown entity', async () => {
    await expect(
      mathjax.handleRetriesFor(() => Entities.translate('&xyz;'))
    ).resolves.toBe('&xyz;'); // no such entity
  });

  test('Load entity files', async () => {
    await expect(
      mathjax.handleRetriesFor(() => Entities.translate('&approx;'))
    ).resolves.toBe('\u2248'); // load a.js
    await expect(
      mathjax.handleRetriesFor(() => Entities.translate('&Bscr;'))
    ).resolves.toBe('\u212C'); // load scr.js
    Entities.options.loadMissingEntities = false;
    expect(Entities.translate('&bigwedge;')).toBe('&bigwedge;'); // don't load b.js
    Entities.options.loadMissingEntities = true;
  });

  test('Remove entity', () => {
    Entities.remove('approx');
    expect(Entities.translate('&approx;')).toBe('&approx;'); // undefined entities remain unchanged
  });

  test('Synchronous load', () => {
    const asyncLoad = mathjax.asyncLoad;
    const REQUIRE = require;
    mathjax.asyncIsSynchronous = true;
    mathjax.asyncLoad = (file) => REQUIRE(`#js/../cjs/${file}`);
    expect((() => {
      try {
        Entities.translate('&copy;');
        return 'success';
      } catch (_err) {
        return 'failed';
      }
    })()).toBe('success');
    mathjax.asyncLoad = asyncLoad;
    mathjax.asyncIsSynchronous = false;
  });

  test('AsycLoad retries', () => {
    expect((() => {
      try {
        Entities.translate('&divide;');
        return 'success';
      } catch (_err) {
        return 'failed';
      }
    })()).toBe('failed');
  });
});
