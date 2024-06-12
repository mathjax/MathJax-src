import { describe, test, expect } from '@jest/globals';
import * as Entities from '#js/util/Entities.js';
import {handleRetriesFor} from '#js/util/Retries.js';
import '#js/util/asyncLoad/esm.js';

describe('Entities translation', () => {

  test('translate()', async () => {
    expect(Entities.translate('&#97;')).toBe('a');
    expect(Entities.translate('&#x61;')).toBe('a');
    expect(Entities.translate('&amp;')).toBe('&');
    await expect(handleRetriesFor(() => Entities.translate('&xyz;'))).resolves.toBe('&xyz;');     // no such entity
    await expect(handleRetriesFor(() => Entities.translate('&approx;'))).resolves.toBe('\u2248'); // load a.js
    await expect(handleRetriesFor(() => Entities.translate('&Bscr;'))).resolves.toBe('\u212C');   // load scr.js
    Entities.remove('approx');
    expect(Entities.translate('&approx;')).toBe('&approx;');      // undefined entities remain unchanged
    Entities.options.loadMissingEntities = false;
    expect(Entities.translate('&bigwedge;')).toBe('&bigwedge;');  // don't load b.js
  });

});
