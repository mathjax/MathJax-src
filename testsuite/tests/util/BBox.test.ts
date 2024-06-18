import { describe, test, expect } from '@jest/globals';
import {BBox} from '#js/util/BBox.js';
import {BIGDIMEN} from '#js/util/lengths.js';

describe('BBox object', () => {

  test('BBox creation', () => {
    expect(BBox.zero()).toEqual(expect.objectContaining({w: 0, h: 0, d: 0}));
    expect(BBox.empty()).toEqual(expect.objectContaining({w: 0, h: -BIGDIMEN, d: -BIGDIMEN}));
    expect(new BBox({w: 1, h: 2, d: 0})).toEqual({
      w: 1, h: 2, d: 0,
      L: 0, R: 0,
      ic: 0, oc: 0, sk: 0, dx: 0,
      scale: 1, rscale: 1,
      pwidth: ''
    });
    expect(new BBox({w: 1})).toEqual(expect.objectContaining({w: 1, h: -BIGDIMEN, d: -BIGDIMEN}));
  });

  test('empty()', () => {
    expect(BBox.zero().empty()).toEqual(expect.objectContaining({w: 0, h: -BIGDIMEN, d: -BIGDIMEN}));
  });

  test('clean()', () => {
    const bbox = BBox.empty();
    bbox.w = -BIGDIMEN;
    bbox.clean();
    expect(bbox).toEqual(expect.objectContaining({w: 0, h: 0, d: 0}));
  });

  test('rescale()', () => {
    const bbox = new BBox({w: 1, h: 2, d: 3});
    bbox.rescale(2);
    expect(bbox).toEqual(expect.objectContaining({w: 2, h: 4, d: 6}));
    bbox.rescale(0);
    expect(bbox).toEqual(BBox.zero());
  });

  test('copy()', () => {
    const bbox = Object.assign(new BBox({w: 1, h: 2, d: 3}), {
      L: 4, R: 5,
      ic: 6, oc: 7, sk: 8, dx: 9,
      scale: 10, rscale: 11,
      pwidth: '10%'
    });
    const copy = bbox.copy();
    expect(copy).toEqual(bbox);
    expect(copy).not.toBe(bbox);
  });

  test('updateFrom()', () => {
    const bbox1 = Object.assign(new BBox({w: 1, h: 2, d: 3}), {
      L: 4, R: 5,
      ic: 6, oc: 7, sk: 8, dx: 9,
      scale: 10, rscale: 11,
      pwidth: ''
    });
    bbox1.updateFrom(BBox.empty());
    expect(bbox1).toEqual({
      w: 0, h: -BIGDIMEN, d: -BIGDIMEN,
      L: 4, R: 5,
      ic: 6, oc: 7, sk: 8, dx: 9,
      scale: 10, rscale: 11,
      pwidth: ''
    });
    bbox1.pwidth = '100%';
    const bbox2 = BBox.zero();
    bbox2.updateFrom(bbox1);
    expect(bbox2).toEqual({
      w: 0, h: -BIGDIMEN, d: -BIGDIMEN,
      L: 0, R: 0,
      ic: 0, oc: 0, sk: 0, dx: 0,
      scale: 1, rscale: 1,
      pwidth: '100%'
    });
  });

  test('combine()', () => {
    let bbox = BBox.empty();
    const cbox = new BBox({w: 1, h: 2, d: 3});
    bbox.combine(cbox);
    expect(bbox).toEqual(expect.objectContaining({w: 1, h: 2, d: 3}));

    //
    //  Check that a scaled bbox is placed properly
    //
    cbox.rscale = 2;
    bbox.combine(cbox);
    expect(bbox).toEqual(expect.objectContaining({w: 2, h: 4, d: 6}));

    //
    //  Check x and y positioning
    //
    bbox = BBox.empty();
    cbox.L = 2;
    cbox.R = 1;
    cbox.rscale = .5;
    bbox.combine(cbox, 1, 2);
    expect(bbox).toEqual(expect.objectContaining({w: 3, h: 3, d: -.5}));

    //
    //  Check box that doesn't change current bbox
    //
    cbox.rscale = .01;
    bbox.combine(cbox, 1, 1);
    expect(bbox).toEqual(expect.objectContaining({w: 3, h: 3, d: -.5}));
  });

  test('append()', () => {
    let bbox = BBox.empty();
    const cbox = new BBox({w: 1, h: 2, d: 3});
    bbox.append(cbox);
    expect(bbox).toEqual(expect.objectContaining({w: 1, h: 2, d: 3}));

    //
    //  Check that a scaled bbox is placed properly
    //
    cbox.rscale = 2;
    bbox.append(cbox);
    expect(bbox).toEqual(expect.objectContaining({w: 3, h: 4, d: 6}));

    //
    //  Check that h and d don't change
    //
    cbox.rscale = 1;
    bbox.append(cbox);
    expect(bbox).toEqual(expect.objectContaining({w: 4, h: 4, d: 6}));
  });

});
