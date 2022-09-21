import {ChtmlFontData, ChtmlCharOptions, ChtmlVariantData,
        ChtmlDelimiterData, DelimiterMap, CharMapMap} from './FontData.js';
import {StringMap} from '../common/Wrapper.js';
import {FontDataClass, DynamicFileList} from '../common/FontData.js';

declare const Base: FontDataClass<ChtmlCharOptions, ChtmlVariantData, ChtmlDelimiterData> & typeof ChtmlFontData;
export declare class DefaultFont extends Base {
    static NAME: string;
    static OPTIONS: {
        fontURL: string;
        dynamicPrefix: string;
    };
    protected static defaultCssFamilyPrefix: string;
    protected static defaultVariantLetters: StringMap;
    protected static defaultDelimiters: DelimiterMap<ChtmlDelimiterData>;
    protected static defaultChars: CharMapMap<ChtmlCharOptions>;
    protected static defaultStyles: {[key: string]: StringMap};
    protected static defaultFonts: {[key: string]: StringMap};
    protected static dynamicFiles: DynamicFileList;
    cssFontPrefix: string;
}
export declare const fontName: string;
export {};


