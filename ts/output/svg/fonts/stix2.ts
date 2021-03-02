import {SVGFontData, SVGFontDataClass, SVGCharOptions, SVGVariantData, SVGDelimiterData,
        DelimiterMap, CharMapMap, CssFontMap, RemapMap} from '../FontData.js';
import {CommonSTIX2FontMixin} from '../../common/fonts/stix2.js';

import {normal} from './stix2/normal.js';
import {bold} from './stix2/bold.js';
import {italic} from './stix2/italic.js';
import {boldItalic} from './stix2/bold-italic.js';
import {texCalligraphic} from './stix2/tex-calligraphic.js';
import {texCalligraphicBold} from './stix2/tex-calligraphic-bold.js';
import {texOldstyle} from './stix2/tex-oldstyle.js';
import {texOldstyleBold} from './stix2/tex-oldstyle-bold.js';
import {texMathit} from './stix2/tex-mathit.js';
import {smallop} from './stix2/smallop.js';
import {largeop} from './stix2/largeop.js';
import {size3} from './stix2/size3.js';
import {size4} from './stix2/size4.js';
import {size5} from './stix2/size5.js';
import {size6} from './stix2/size6.js';
import {size7} from './stix2/size7.js';
import {size8} from './stix2/size8.js';
import {size9} from './stix2/size9.js';
import {size10} from './stix2/size10.js';
import {size11} from './stix2/size11.js';
import {size12} from './stix2/size12.js';
import {texVariant} from './stix2/tex-variant.js';
import {extend} from './stix2/extend.js';
import {doubleStruck} from './stix2/double-struck.js';
import {fraktur} from './stix2/fraktur.js';
import {frakturBold} from './stix2/fraktur-bold.js';
import {script} from './stix2/script.js';
import {scriptBold} from './stix2/script-bold.js';
import {monospace} from './stix2/monospace.js';
import {sansSerifBold} from './stix2/sans-serif-bold.js';
import {sansSerifItalic} from './stix2/sans-serif-italic.js';
import {sansSerifBoldItalic} from './stix2/sans-serif-bold-italic.js';
import {sansSerif} from './stix2/sans-serif.js';
import {doubleStruckItalic} from './stix2/double-struck-italic.js';

import {delimiters} from './stix2/delimiters.js';

/***********************************************************************************/
/**
 *  The STIX2Font class
 */
export class STIX2Font extends
CommonSTIX2FontMixin<SVGCharOptions, SVGVariantData, SVGDelimiterData, SVGFontDataClass>(SVGFontData) {

  /**
   *  Remap accents
   */
  protected static defaultAccentMap: RemapMap = {
    0x005E: '\u02C6',
    0x007E: '\u02DC',
    0x0300: '\u02CB',
    0x0301: '\u02CA',
    0x0302: '\u02C6',
    0x0303: '\u02DC',
    0x0304: '\u02C9',
    0x0306: '\u02D8',
    0x0307: '\u02D9',
    0x0308: '\u00A8',
    0x030A: '\u02DA',
    0x030C: '\u02C7',
    0x2192: '\u20D7'
  };

  /**
   *  The stretchy delimiter data
   */
  protected static defaultDelimiters: DelimiterMap<SVGDelimiterData> = delimiters;

  /**
   *  The variants to define
   */
  public static defaultVariants: string[][] = [
    ...SVGFontData.defaultVariants,
    ['-tex-calligraphic', 'normal'],
    ['-tex-bold-calligraphic', 'normal'],
    ['-tex-oldstyle', 'normal'],
    ['-tex-bold-oldstyle', 'normal'],
    ['-tex-mathit', 'normal'],
    ['-smallop', 'normal'],
    ['-largeop', 'normal'],
    ['-size3', 'normal'],
    ['-size4', 'normal'],
    ['-size5', 'normal'],
    ['-size6', 'normal'],
    ['-size7', 'normal'],
    ['-size8', 'normal'],
    ['-size9', 'normal'],
    ['-size10', 'normal'],
    ['-size11', 'normal'],
    ['-size12', 'normal'],
    ['-tex-variant', 'normal'],
    ['-extend', 'normal'],
    ['-double-struck-italic', 'normal']
  ];

  /**
   * The style and weight to use for each variant (for unkown characters)
   */
  public static defaultCssFonts: CssFontMap = {
    ...SVGFontData.defaultCssFonts,
    '-tex-calligraphic': ['serif', false, false],
    '-tex-bold-calligraphic': ['serif', false, false],
    '-tex-oldstyle': ['serif', false, false],
    '-tex-bold-oldstyle': ['serif', false, false],
    '-tex-mathit': ['serif', false, false],
    '-smallop': ['serif', false, false],
    '-largeop': ['serif', false, false],
    '-size3': ['serif', false, false],
    '-size4': ['serif', false, false],
    '-size5': ['serif', false, false],
    '-size6': ['serif', false, false],
    '-size7': ['serif', false, false],
    '-size8': ['serif', false, false],
    '-size9': ['serif', false, false],
    '-size10': ['serif', false, false],
    '-size11': ['serif', false, false],
    '-size12': ['serif', false, false],
    '-tex-variant': ['serif', false, false],
    '-extend': ['serif', false, false],
    '-double-struck-italic': ['serif', false, false]
  };

  /**
   *  The character data by variant
   */
  protected static defaultChars: CharMapMap<SVGCharOptions> = {
    'normal': normal,
    'bold': bold,
    'italic': italic,
    'bold-italic': boldItalic,
    '-tex-calligraphic': texCalligraphic,
    '-tex-bold-calligraphic': texCalligraphicBold,
    '-tex-oldstyle': texOldstyle,
    '-tex-bold-oldstyle': texOldstyleBold,
    '-tex-mathit': texMathit,
    '-smallop': smallop,
    '-largeop': largeop,
    '-size3': size3,
    '-size4': size4,
    '-size5': size5,
    '-size6': size6,
    '-size7': size7,
    '-size8': size8,
    '-size9': size9,
    '-size10': size10,
    '-size11': size11,
    '-size12': size12,
    '-tex-variant': texVariant,
    '-extend': extend,
    'double-struck': doubleStruck,
    'fraktur': fraktur,
    'bold-fraktur': frakturBold,
    'script': script,
    'bold-script': scriptBold,
    'monospace': monospace,
    'bold-sans-serif': sansSerifBold,
    'sans-serif-italic': sansSerifItalic,
    'sans-serif-bold-italic': sansSerifBoldItalic,
    'sans-serif': sansSerif,
    '-double-struck-italic': doubleStruckItalic
  };

  /**
   * The cacheIDs to use for the variants in font-caching
   */
  protected static variantCacheIds: {[name: string]: string} = {
    'normal': 'N',
    'bold': 'B',
    'italic': 'I',
    'bold-italic': 'BI',
    '-tex-calligraphic': 'C',
    '-tex-bold-calligraphic': 'CB',
    '-tex-oldstyle': 'OS',
    '-tex-bold-oldstyle': 'OB',
    '-tex-mathit': 'MI',
    '-smallop': 'SO',
    '-largeop': 'LO',
    '-size3': 'S3',
    '-size4': 'S4',
    '-size5': 'S5',
    '-size6': 'S6',
    '-size7': 'S7',
    '-size8': 'S8',
    '-size9': 'S9',
    '-size10': 'S10',
    '-size11': 'S11',
    '-size12': 'S12',
    '-tex-variant': 'V',
    '-extend': 'E',
    'double-struck': 'DS',
    'fraktur': 'F',
    'bold-fraktur': 'FB',
    'script': 'S',
    'bold-script': 'SB',
    'monospace': 'M',
    'bold-sans-serif': 'SSB',
    'sans-serif-italic': 'SSI',
    'sans-serif-bold-italic': 'SSBI',
    'sans-serif': 'SS',
    '-double-struck-italic': 'DSI'
  };

  /**
   * The default variants for the fixed size stretchy delimiters
   */
  protected static defaultSizeVariants: string[] = ['normal', '-smallop', '-largeop', '-size3', '-size4', '-size5', '-size6', '-size7', '-size8', '-size9', '-size10', '-size11', '-size12'];

  /**
   * The default variants for the assembly parts for stretchy delimiters
   */
  protected static defaultStretchVariants: string[] = ['-extend', 'normal', '-size4', '-smallop', '-tex-variant'];

  /**
   * @override
   */
  constructor() {
    super();
    //
    //  Add the cacheIDs to the variants
    //
    const CLASS = this.constructor as typeof STIX2Font;
    for (const variant of Object.keys(CLASS.variantCacheIds)) {
      this.variant[variant].cacheID = 'STX-' + CLASS.variantCacheIds[variant];
    }
  }

}
