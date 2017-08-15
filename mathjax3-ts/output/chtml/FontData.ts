import {OptionList} from '../../util/Options.js';

/*
 * Data about a character
 *   [height, depth, width, italic-correction, skew, options]
 */
export type CharData =
    [number] |
    [number, number, number, number, number, OptionList];

export type CharMap = {
    [n: number]: CharData;
}

export type CharMapMap = {
    [name: string]: CharMap;
}

/*
 * Data for a variant
 */
export type VariantData = {
    /*
     * A list of CharMaps that must be updated when characters are
     * added to this variant
     */
    linked: CharMap[];
    /*
     * The character data for this variant
     */
    chars: CharMap;
};

export type VariantMap = {
    [name: string]: VariantData;
}

/*
 * Stretchy delimiter data
 */
export type DelimiterData = {
    dir: string;
    sizes?: number[];
    variants?: number[];
    stretch?: number[];
};

export type DelimiterMap = {
    [n: number]: DelimiterData;
};

/*
 * The stretch direction
 */
export const V = 'V';
export const H = 'H';

export class FontData {

    /*
     *  The standard variants to define
     */
    protected static defaultVariants = [
        ['normal'],
        ['bold', 'normal'],
        ['italic', 'normal'],
        ['bold-italic', 'italic', 'bold'],
        ['double-struck', 'bold'],
        ['fraktur', 'normal'],
        ['bold-fraktur', 'bold', 'fraktur'],
        ['script', 'normal'],
        ['bold-script', 'bold', 'script'],
        ['sans-serif', 'normal'],
        ['bold-sans-serif', 'bold', 'sans-serif'],
        ['sans-serif-italic', 'italic', 'sans-serif'],
        ['bold-sans-serif-italic', 'bold-italic', 'sans-serif'],
        ['monospace', 'normal']
    ];

    protected static defaultDelimiters: DelimiterMap = {};
    protected static defaultChars: CharMapMap = {};

    protected static defaultSizeVariants: string[] = [];

    protected variant: VariantMap = {};
    protected delimiters: DelimiterMap = {};
    protected sizeVariants: string[];

    constructor() {
        let CLASS = (this.constructor as typeof FontData)
        this.sizeVariants = CLASS.defaultSizeVariants;
        this.createVariants(CLASS.defaultVariants);
        this.defineDelimiters(CLASS.defaultDelimiters);
        for (const name of Object.keys(CLASS.defaultChars)) {
            this.defineChars(name, CLASS.defaultChars[name]);
        }
    }

    public createVariant(name: string, inherit: string = null, link: string = null) {
        let variant = {
            linked: [] as CharMap[],
            chars: (inherit ? Object.create(this.variant[inherit].chars) : {}) as CharMap
        };
        if (link && this.variant[link]) {
            Object.assign(variant.chars, this.variant[link].chars);
            this.variant[link].linked.push(variant.chars);
            variant.chars = Object.create(variant.chars);
        }
        this.variant[name] = variant;
    }

    public createVariants(variants: string[][]) {
        for (const variant of variants) {
            this.createVariant.apply(this, variant);
        }
    }

    public defineChars(name: string, chars: CharMap) {
        let variant = this.variant[name];
        Object.assign(variant.chars, chars);
        for (const link of variant.linked) {
            Object.assign(link, chars);
        }
    }

    public defineDelimiters(delims: DelimiterMap) {
        Object.assign(this.delimiters, delims);
    }

    public getDelimiter(n: number) {
        return this.delimiters[n];
    }

    public getSizeVariant(n: number, i: number) {
        return this.sizeVariants[this.delimiters[n].variants[i]];
    }

    public getChar(name: string, n: number) {
        return this.variant[name].chars[n];
    }

    public getVariant(name: string) {
        return this.variant[name];
    }

}
