import {ChtmlFontData} from '#js/output/chtml/FontData.js';

export class DefaultFont extends ChtmlFontData {};
export const fontName = 'nofont';

DefaultFont.OPTIONS = {fontURL: '.'};

export const Font = {fontName, DefaultFont};
