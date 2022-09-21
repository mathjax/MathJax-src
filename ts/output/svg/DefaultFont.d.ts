import {SvgFontData, SvgCharOptions, SvgVariantData, SvgDelimiterData, DelimiterMap, CharMapMap} from './FontData.js';
import {OptionList} from '../../util/Options.js';
import {FontDataClass, DynamicFileList} from '../common/FontData.js';

declare const Base: FontDataClass<SvgCharOptions, SvgVariantData, SvgDelimiterData> & typeof SvgFontData;
export declare class DefaultFont extends Base {
    static NAME: string;
    static OPTIONS: {
        dynamicPrefix: string;
    };
    protected static defaultDelimiters: DelimiterMap<SvgDelimiterData>;
    protected static defaultChars: CharMapMap<SvgCharOptions>;
    protected static dynamicFiles: DynamicFileList;
    protected static variantCacheIds: {
        [name: string]: string;
    };
    constructor(options?: OptionList);
}
export const fontName: string;
export {};
