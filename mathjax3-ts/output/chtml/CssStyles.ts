export type StyleData = {
    [property: string]: string | number;
};

export type StyleList = {
    [selector: string]: StyleData;
};

export type StyleDef = StyleList | {[name: string]: StyleList};

export class CssStyles {
    protected styles: StyleList = {};

    get cssText() {
        return this.getStyleString();
    }

    constructor(styles: StyleList = null) {
        this.addStyles(styles);
    }

    public addStyles(styles: StyleList) {
        if (!styles) return;
        for (const style of Object.keys(styles)) {
            if (!this.styles[style]) {
                this.styles[style] = {};
            }
            Object.assign(this.styles[style], styles[style]);
        }
    }

    public removeStyles(...selectors: string[]) {
        for (const selector of selectors) {
            delete this.styles[selector];
        }
    }

    public getStyleString(styles: StyleList = null) {
        if (!styles) {
            styles = this.styles;
        }
        const selectors = Object.keys(styles);
        const defs: string[] = new Array(selectors.length);
        let i = 0;
        for (const selector of selectors) {
            defs[i++] = selector + ' {\n' + this.getStyleDefString(styles[selector]) + '\n}';
        }
        return defs.join('\n\n');
    }

    public getStyleDefString(styles: StyleData) {
        const properties = Object.keys(styles);
        const values: string[] = [];
        let i = 0;
        for (const property of properties) {
            values[i++] = '  ' + property + ': ' + styles[property] + ';';
        }
        return values.join('\n');
    }

}
