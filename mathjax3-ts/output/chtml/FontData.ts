import {OptionList} from '../../util/Options.js';

/*
 * Data about a character
 *   [height, depth, width, italic-correction, skew, options]
 */
export type CharData =
    [number, number, number] |
    [number, number, number, number] |
    [number, number, number, number, number] |
    [number, number, number, number, number, OptionList];

export type CharMap = {
    [n: number]: CharData;
};

export type CharMapMap = {
    [name: string]: CharMap;
};

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
};

/*
 * Stretchy delimiter data
 */
export type DelimiterData = {
    dir: string;
    sizes?: number[];
    variants?: number[];
    stretch?: number[];
    HDW?: number[];
};

export type DelimiterMap = {
    [n: number]: DelimiterData;
};

/*
 * Font parameters
 */
export type FontParameters = {
    x_height: number,
    quad: number,
    num1: number,
    num2: number,
    num3: number,
    denom1: number,
    denom2: number,
    sup1: number,
    sup2: number,
    sup3: number,
    sub1: number,
    sub2: number,
    sup_drop: number,
    sub_drop: number,
    delim1: number,
    delim2: number,
    axis_height: number,
    rule_thickness: number,
    big_op_spacing1: number,
    big_op_spacing2: number,
    big_op_spacing3: number,
    big_op_spacing4: number,
    big_op_spacing5: number,

    surd_height: number,

    scriptspace: number,
    nulldelimiterspace: number,
    delimiterfactor: number,
    delimitershortfall: number,

    min_rule_thickness: number
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

    public static defaultParams: FontParameters = {
        x_height:         .442,
        quad:             1,
        num1:             .676,
        num2:             .394,
        num3:             .444,
        denom1:           .686,
        denom2:           .345,
        sup1:             .413,
        sup2:             .363,
        sup3:             .289,
        sub1:             .15,
        sub2:             .247,
        sup_drop:         .386,
        sub_drop:         .05,
        delim1:          2.39,
        delim2:          1.0,
        axis_height:      .25,
        rule_thickness:   .06,
        big_op_spacing1:  .111,
        big_op_spacing2:  .167,
        big_op_spacing3:  .2,
        big_op_spacing4:  .45, // .6,  // better spacing for under arrows and braces
        big_op_spacing5:  .1,

        surd_height:      .075,

        scriptspace:         .05,
        nulldelimiterspace:  .12,
        delimiterfactor:     901,
        delimitershortfall:   .3,

        min_rule_thickness:  1.25     // in pixels
    };


    protected static defaultDelimiters: DelimiterMap = {};
    protected static defaultChars: CharMapMap = {};

    protected static defaultSizeVariants: string[] = [];

    protected variant: VariantMap = {};
    protected delimiters: DelimiterMap = {};
    protected sizeVariants: string[];

    public params: FontParameters;

    constructor() {
        let CLASS = (this.constructor as typeof FontData);
        this.params = Object.assign({}, CLASS.defaultParams);
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
        if (this.delimiters[n].variants) {
            i = this.delimiters[n].variants[i];
        }
        return this.sizeVariants[i];
    }

    public getChar(name: string, n: number) {
        return this.variant[name].chars[n];
    }

    public getVariant(name: string) {
        return this.variant[name];
    }

}
