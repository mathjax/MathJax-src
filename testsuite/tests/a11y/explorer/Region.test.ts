import { describe, expect, test } from '@jest/globals';
import { HoverRegion, LiveRegion, ToolTip } from '#js/a11y/explorer/Region.js';

describe('Explorer region stylesheet IDs', () => {
  test('uses stable region class names', () => {
    expect(ToolTip.sheetId).toBe('MJX-ToolTip-styles');
    expect(LiveRegion.sheetId).toBe('MJX-LiveRegion-styles');
    expect(HoverRegion.sheetId).toBe('MJX-HoverRegion-styles');
  });
});
