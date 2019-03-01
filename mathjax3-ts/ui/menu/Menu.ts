import {MathJax as mathjax} from '../../mathjax.js';

import {MathItem} from '../../core/MathItem.js';
import {OutputJax} from '../../core/OutputJax.js';
import {MathJaxObject as StartupObject} from '../../components/startup.js';
import {MathJaxObject as LoaderObject} from '../../components/loader.js';
import {OptionList, userOptions, defaultOptions, expandable} from '../../util/Options.js';

import {MJContextMenu} from './MJContextMenu.js';
import {MmlVisitor} from './MmlVisitor.js';
import {SelectableInfo} from './SelectableInfo.js';
import {MenuMathDocument} from './MenuHandler.js';

const isMac = false;

declare namespace window {
    const MathJax: StartupObject & LoaderObject;
}

export interface MenuSettings {
    texHints: boolean;
    semantics: boolean;
    zoom: string;
    zscale: string;
    renderer: string;
    alt: boolean;
    cmd: boolean;
    ctrl: boolean;
    shift: boolean;
    scale: string;
    explorer: boolean;
    highlight: string;
    background: string;
    foreground: string;
    speech: boolean;
    subtitles: boolean;
    speechrules: string;
    autocollapse: boolean;
    collapsible: boolean;
    inTabOrder: boolean;
}

export class Menu<N, T, D> {

    public static MENU_STORAGE = 'MathJax-Menu-Settings';

    public static OPTIONS: OptionList = {
        settings: {
            texHints: true,
            semantics: false,
            zoom: 'NoZoom',
            zscale: '200%',
            renderer: 'CHTML',
            alt: false,
            cmd: false,
            ctrl: false,
            shift: false,
            scale: 1,
            explorer: false,
            highlight: 'None',
            background: 'Blue',
            foreground: 'Black',
            speech: true,
            subtitles: false,
            speechrules: 'mathspeak-default',
            autocollapse: false,
            collapsible: false,
            inTabOrder: true,
        },
        jax: {
            CHTML: null,
            SVG: null
        },
        annotationTypes: expandable({
            TeX: ['TeX', 'LaTeX', 'application/x-tex'],
            StarMath: ['StarMath 5.0'],
            Maple: ['Maple'],
            ContentMathML: ['MathML-Content', 'application/mathml-content+xml'],
            OpenMath: ['OpenMath']
        })
    };

    public options: OptionList;

    public settings: MenuSettings = null;
    public defaultSettings: MenuSettings = null;

    public zscale: number = 1.25 * 200;

    public menu: MJContextMenu<N, T, D> = null;

    public MmlVisitor = new MmlVisitor<N, T, D>();

    protected document: MenuMathDocument<N, T, D>;

    protected jax: {[name: string]: OutputJax<N, T, D>} = {
        CHTML: null,
        SVG: null
    };

    public loading: boolean = false;

    protected about = new ContextMenu.Info(
        '<b style="font-size:120%;">MathJax</b> v' + mathjax.version,
        () => {
            const lines = [] as string[];
            lines.push('Input Jax: ' + this.document.inputJax.map(jax => jax.name).join(', '));
            lines.push('Output Jax: ' + this.document.outputJax.name);
            lines.push('Document Type: ' + this.document.kind);
            return lines.join('<br/>');
        },
        '<a href="https://www.mathjax.org">www.mathjax.org</a>'
    );

    protected help = new ContextMenu.Info(
        '<b>MathJax Help</b>',
        () => {
            return [
                '<p><b>MathJax</b> is a JavaScript library that allows page',
                ' authors to include mathematics within their web pages.',
                ' As a reader, you don\'t need to do anything to make that happen.</p>',
                '<p><b>Browsers</b>: MathJax works with all modern browsers including',
                ' Edge, Firefox, Chrome, Safari, Opera, and most mobile browsers.</p>',
                '<p><b>Math Menu</b>: MathJax adds a contextual menu to equations.',
                ' Right-click or CTRL-click on any mathematics to access the menu.</p>',
                '<div style="margin-left: 1em;">',
                '<p><b>Show Math As:</b> These options allow you to view the formula\'s',
                ' source markup (as MathML or in its original format).</p>',
                '<p><b>Copy to Clipboard:</b> These options copy the formula\'s source markup,',
                ' as MathML or in its original format, to the clipboard',
                ' (in browsers that support that).</p>',
                '<p><b>Math Settings:</b> These give you control over features of MathJax,',
                ' such the size of the mathematics, and the mechanism used',
                ' to display equations.</p>',
                '<p><b>Accessibility</b>: MathJax can work with screen',
                ' readers to make mathematics accessible to the visually impaired.',
                ' Turn on the explorer to enable generation of speech strings',
                ' and the ability to investigate expressions interactively.</p>',
                '<p><b>Language</b>: This menu lets you select the language used by MathJax',
                ' for its menus and warning messages. (Not yet implemented in version 3.)</p>',
                '</div>',
                '<p><b>Math Zoom</b>: If you are having difficulty reading an',
                ' equation, MathJax can enlarge it to help you see it better, or',
                ' you can scall all the math on the page to make it larger.',
                ' Turn these features on in the <b>Math Settings</b> menu.</p>',
                '<p><b>Cookies</b>: MathJax uses cookies to store the preferences set',
                ' via this menu locally in your browser.  These are not used to track you,',
                ' and are not transferred or used remotely by MathJax in any way.</p>'
            ]. join('\n');
        },
        '<a href="https://www.mathjax.org">www.mathjax.org</a>'
    );

    protected mathmlCode = new SelectableInfo(
        'MathJax MathML Expression',
        () => {
            if (!this.menu.mathItem) return '';
            const text = this.toMML(this.menu.mathItem);
            return '<pre>' + this.formatSource(text) + '</pre>';
        },
        '<input type="button" value="Copy to Clipboard" />'
    );

    protected originalText = new SelectableInfo(
        'MathJax Original Source',
        () => {
            if (!this.menu.mathItem) return '';
            const text = this.menu.mathItem.math;
            return '<pre style="font-size:125%; margin:0">' + this.formatSource(text) + '</pre>';
        },
        '<input type="button" value="Copy to Clipboard" />'
    );

    protected annotationText = new SelectableInfo(
        'MathJax Annotation Text',
        () => {
            if (!this.menu.mathItem) return '';
            const text = this.menu.annotation;
            return '<pre style="font-size:125%; margin:0">' + this.formatSource(text) + '</pre>';
        },
        '<input type="button" value="Copy to Clipboard" />'
    );

    protected zoomBox = new ContextMenu.Info(
        'MathJax Zoomed Expression',
        () => {
            if (!this.menu.mathItem) return '';
            const element = (this.menu.mathItem.typesetRoot as any).cloneNode(true) as HTMLElement;
            element.style.margin = '0';
            return '<div style="font-size: ' + this.zscale + '%">' + element.outerHTML + '</div>';
        },
        ''
    );

    constructor(document: MenuMathDocument<N, T, D>, options: OptionList = {}) {
        this.document = document;
        this.options = userOptions(defaultOptions({}, (this.constructor as typeof Menu).OPTIONS), options);
        this.initSettings();
        this.mergeUserSettings();
        this.initMenu();
    }

    protected initSettings() {
        this.settings = this.options.settings;
        this.jax = this.options.jax;
        const jax = this.document.outputJax;
        this.jax[jax.name] = jax;
        this.settings.renderer = jax.name;
        this.settings.scale = jax.options.scale;
        this.defaultSettings = Object.assign({}, this.settings);
    }

    protected mergeUserSettings() {
        try {
            const settings = localStorage.getItem(Menu.MENU_STORAGE);
            if (!settings) return;
            Object.assign(this.settings, JSON.parse(settings));
        } catch (err) {
            console.log('MathJax localStorage error: ' + err.message);
        }
    }

    protected saveUserSettings() {
        const settings = {} as {[key: string]: any};
        for (const name of Object.keys(this.settings) as (keyof MenuSettings)[]) {
            if (this.settings[name] !== this.defaultSettings[name]) {
                settings[name] = this.settings[name];
            }
        }
        try {
            if (Object.keys(settings).length) {
                localStorage.setItem(Menu.MENU_STORAGE, JSON.stringify(settings));
            } else {
                localStorage.removeItem(Menu.MENU_STORAGE);
            }
        } catch (err) {
            console.log('MathJax localStorage error: ' + err.message);
        }
    }

    protected initMenu() {
        this.menu = MJContextMenu.parse({
            menu: {
                id: 'MathJax_Menu',
                pool: [
                    this.variable<boolean>('texHints'),
                    this.variable<boolean>('semantics'),
                    this.variable<string> ('zoom'),
                    this.variable<string> ('zscale', (scale: string) => this.setZScale(scale)),
                    this.variable<string> ('renderer', (jax: string) => this.setRenderer(jax)),
                    this.variable<boolean>('alt'),
                    this.variable<boolean>('cmd'),
                    this.variable<boolean>('ctrl'),
                    this.variable<boolean>('shift'),
                    this.variable<string> ('scale', (scale: string) => this.setScale(scale)),
                    this.variable<boolean>('explorer', (explore: boolean) => this.setExplorer(explore)),
                    this.variable<string> ('highlight'),
                    this.variable<string> ('background'),
                    this.variable<string> ('foreground'),
                    this.variable<boolean>('speech'),
                    this.variable<boolean>('subtitles'),
                    this.variable<string> ('speechrules'),
                    this.variable<boolean>('autocollapse'),
                    this.variable<boolean>('collapsible', (collapse: boolean) => this.setCollapsible(collapse)),
                    this.variable<boolean>('inTabOrder', (tab: boolean) => this.setTabOrder(tab))
                ],
                items: [
                    this.submenu('Show', 'Show Math As', [
                        this.command('MathMLcode', 'MathML Code', () => this.mathmlCode.post()),
                        this.command('Original', 'Original Form', () => this.originalText.post()),
                        this.submenu('Annotation', 'Annotation')
                    ]),
                    this.submenu('Copy', 'Copy to Clipboard', [
                        this.command('MathMLcode', 'MathML Code', () => this.copyMathML()),
                        this.command('Original', 'Original Form', () => this.copyOriginal()),
                        this.submenu('Annotation', 'Annotation')
                    ]),
                    this.rule(),
                    this.submenu('Settings', 'Math Settings',[
                        this.submenu('Renderer', 'Math Renderer', this.radioGroup('renderer', [['CHTML'], ['SVG']])),
                        this.rule(),
                        this.submenu('ZoomTrigger', 'Zoom Trigger', [
                            this.radioGroup('zoom', [
                                ['Click'], ['DoubleClick', 'Double-Click'], ['NoZoom', 'No Zoom']
                            ]),
                            this.rule(),
                            this.label('TriggerRequires', 'Trigger Requires:'),
                            this.checkbox((isMac ? 'Option' : 'Alt'), (isMac ? 'Option' : 'Alt'), 'alt'),
                            this.checkbox('Command', 'Command', 'cmd', {hidden: !isMac}),
                            this.checkbox('Control', 'Control', 'ctrl', {hiddne: isMac}),
                            this.checkbox('Shift', 'Shift', 'shift')
                        ]),
                        this.submenu('ZoomFactor', 'Zoom Factor', this.radioGroup('zscale', [
                            ['150%'], ['175%'], ['200%'], ['250%'], ['300%'], ['400%']
                        ])),
                        this.rule(),
                        this.command('Scale', 'Scale All Math...', () => this.scaleAllMath()),
                        this.rule(),
                        this.checkbox('texHints', 'Add TeX hints to MathML', 'texHints'),
                        this.checkbox('semantics', 'Add original as annotation', 'semantics'),
                        this.rule(),
                        this.command('Reset', 'Reset to defaults', () => this.resetDefaults())
                    ]),
                    this.submenu('Accessibility', 'Accessibility', [
                        this.submenu('Explorer', 'Explorer', [
                            this.checkbox('Active', 'Active', 'explorer'),
                            this.rule(),
                            this.submenu('Highlight', 'Highlight', this.radioGroup('highlight', [
                                ['None'], ['Hover'], ['Flame']
                            ]), true),
                            this.submenu('Background', 'Background', this.radioGroup('background', [
                                ['Blue'], ['Red'], ['Green'], ['Yellow'], ['Cyan'], ['Magenta'], ['White'], ['Black']
                            ])),
                            this.submenu('Foreground', 'Foreground', this.radioGroup('foreground', [
                                ['Black'], ['White'], ['Magenta'], ['Cyan'], ['Yellow'], ['Green'], ['Red'], ['Blue']
                            ])),
                            this.rule(),
                            this.checkbox('Speech', 'Speech Output', 'speech'),
                            this.checkbox('Subtitles', 'Subtities', 'subtitles'),
                            this.rule(),
                            this.submenu('Mathspeak', 'Mathspeak Rules', this.radioGroup('speechrules', [
                                ['mathspeak-default', 'Verbose'],
                                ['mathspeak-brief', 'Brief'],
                                ['mathspeak-sbrief', 'Superbrief']
                            ])),
                            this.submenu('ChromeVox', 'ChromeVox Rules', this.radioGroup('speechrules', [
                                ['chromvox-default', 'Verbose'],
                                ['chromevox-short', 'Short'],
                                ['chromevox-alternative', 'Alternative']
                            ]))
                        ]),
                        this.rule(),
                        this.checkbox('Collapsible', 'Collapsible Math', 'collapsible'),
                        this.checkbox('AutoCollapse', 'Auto Collapse', 'autocollapse', {disabled: true}),
                        this.rule(),
                        this.checkbox('InTabOrder', 'Include in Tab Order', 'inTabOrder')
                    ]),
                    this.submenu('Language', 'Language'),
                    this.rule(),
                    this.command('About', 'About MathJax', () => this.about.post()),
                    this.command('Help', 'MathJax Help', () => this.help.post())
                ]
            }
        }) as MJContextMenu<N, T, D>;
        const menu = this.menu;
        this.about.attachMenu(menu);
        this.help.attachMenu(menu);
        this.originalText.attachMenu(menu);
        this.annotationText.attachMenu(menu);
        this.mathmlCode.attachMenu(menu);
        this.zoomBox.attachMenu(menu);
        this.disableUnloadableItems();
        menu.showAnnotation = this.annotationText;
        menu.copyAnnotation = this.copyAnnotation.bind(this);
        menu.annotationTypes = this.options.annotationTypes;
        ContextMenu.CssStyles.addInfoStyles(this.document.document as any);
        ContextMenu.CssStyles.addMenuStyles(this.document.document as any);
    }

    protected disableUnloadableItems() {
        const MathJax = window.MathJax;
        if (!(MathJax && MathJax._ && MathJax.loader && MathJax.startup)) {
            const menu = this.menu;
            for (const name of Object.keys(this.jax)) {
                if (!this.jax[name]) {
                    menu.findID('Settings', 'Renderer', name).disable();
                }
            }
            menu.findID('Accessibility', 'Explorer').disable();
            menu.findID('Accessibility', 'AutoCollapse').disable();
            menu.findID('Accessibility', 'Collapsible').disable();
        }
    }

    protected setZScale(scale: string) {
        this.settings.zscale = scale;
        this.zscale = 1.25 * parseFloat(scale);
    }

    protected setScale(scale: string) {
        this.settings.scale = scale;
        this.document.outputJax.options.scale = parseFloat(scale);
        this.document.rerender();
    }

    protected setRenderer(jax: string) {
        this.settings.renderer = jax;
        if (this.jax[jax]) {
            this.setOutputJax(jax);
        } else {
            const name = jax.toLowerCase();
            this.loadComponent(name + '-output', () => {
                const startup = window.MathJax.startup;
                if (name in startup.constructors) {
                    startup.useOutput(name, true);
                    startup.output = startup.getOutputJax();
                    this.jax[jax] = startup.output;
                    this.setOutputJax(jax);
                }
            });
        }
    }

    protected setOutputJax(jax: string) {
        this.jax[jax].setAdaptor(this.document.adaptor);
        this.document.outputJax = this.jax[jax];
        this.rerender();
    }

    protected setTabOrder(tab: boolean) {
        this.settings.inTabOrder = tab;
        this.menu.getStore().inTaborder(tab);
    }

    protected setExplorer(explore: boolean) {
        this.settings.explorer = explore;
        //
        //  Enable/disable the submenu items
        //
        const menu = (this.menu.findID('Accessibility', 'Explorer') as ContextMenu.Submenu).getSubmenu();
        for (const item of menu.getItems().slice(3)) {
            if (!(item instanceof ContextMenu.Rule)) {
                explore ? item.enable() : item.disable();
            }
        }
        //
        // If already loaded, rerender otherwise load the component (and rerender afterward)
        //
        if (!explore || (window.MathJax._.a11y && window.MathJax._.a11y.Explorer)) {
            this.rerender();
        } else {
            this.loadA11y('explorer');
        }
    }

    protected setCollapsible(collapse: boolean) {
        this.settings.collapsible = collapse;
        if (!collapse || (window.MathJax._.a11y && window.MathJax._.a11y.complexity)) {
            this.rerender();
        } else {
            this.loadA11y('complexity');
        }
    }

    public loadA11y(component: string) {
        const startup = window.MathJax.startup;
        this.loadComponent('a11y/' + component, () => {
            mathjax.handlers.unregister(startup.handler);
            startup.handler = startup.getHandler();
            mathjax.handlers.register(startup.handler);
            const document = this.document;
            this.document = startup.getDocument();
            this.document.menu = this;
            this.transferMathList(document);
            this.rerender();
        });
    }

    protected transferMathList(document: MenuMathDocument<N, T, D>) {
        const MathItem = this.document.options.MathItem;
        for (const item of document.math) {
            const math = new MathItem();
            Object.assign(math, item);    // copy old data to new math item
            this.document.math.push(math);
        }
    }

    protected loadComponent(name: string, callback: () => void) {
        if (!window.MathJax.loader) return;
        this.loading = true;
        window.MathJax.loader.load(name).then(() => {
            this.loading = false;
            callback();
        }).catch((err) => console.log(err));
    }

    protected formatSource(text: string) {
        return text.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    protected toMML(math: MathItem<N, T, D>) {
        return this.MmlVisitor.visitTree(math.root, math, {
            texHints: this.settings.texHints,
            semantics: (this.settings.semantics && math.inputJax.name !== 'MathML')
        });
    }

    protected resetDefaults() {
        this.loading = true;
        const pool = this.menu.getPool();
        const settings = this.defaultSettings;
        for (const name of Object.keys(this.settings) as (keyof MenuSettings)[]) {
            const variable = pool.lookup(name);
            if (variable) {
                variable.setValue(settings[name] as (string | boolean));
                const item = (variable as any).items[0];
                if (item) {
                    item.executeCallbacks_();
                }
            } else {
                this.settings[name] = settings[name];
            }
        }
        this.loading = false;
        this.rerender();
    }

    protected rerender() {
        if (!this.loading) {
            this.document.rerender();
        }
    }

    protected copyMathML() {
        this.copyToClipboard(this.toMML(this.menu.mathItem));
    }

    protected copyOriginal() {
        this.copyToClipboard(this.menu.mathItem.math);
    }

    public copyAnnotation() {
        this.copyToClipboard(this.menu.annotation);
    }

    protected copyToClipboard(text: string) {
        const input = document.createElement('textarea');
        input.value = text;
        input.setAttribute('readonly', '');
        input.style.cssText = 'height: 1px; width: 1px; padding: 1px; position: absolute; left: -10px';
        document.body.appendChild(input);
        input.select();
        try {
            document.execCommand('copy');
        } catch (error) {
            alert('Can\'t copy to clipboard: ' + error.message);
        }
        document.body.removeChild(input);
    }

    public addMenu(math: MathItem<N, T, D>) {
        const element = math.typesetRoot as any as HTMLElement;
        element.addEventListener('contextmenu', () => this.menu.mathItem = math, true);
        element.addEventListener('keydown', () => this.menu.mathItem = math, true);
        element.addEventListener('click', (event: MouseEvent) => this.zoom(event, 'Click', math), true);
        element.addEventListener('dblclick', (event: MouseEvent) => this.zoom(event,'DoubleClick', math), true);
        this.menu.getStore().insert(element);
    }

    protected scaleAllMath() {
        const scale = (parseFloat(this.settings.scale) * 100).toFixed(1).replace(/.0$/, '');
        const percent = prompt('Scale all mathematics (compared to surrounding text) by', scale + '%');
        if (percent) {
            if (percent.match(/^\s*\d+(\.\d*)?\s*%?\s*$/)) {
                const scale = parseFloat(percent) / 100;
                if (scale) {
                    this.setScale(String(scale));
                } else {
                    alert('The scale should not be zero');
                }
            } else {
                alert('The scale should be a percentage (e.g., 120%)');
            }
        }
    }

    protected zoom(event: MouseEvent, type: string, math: MathItem<N, T, D>) {
        if (this.isZoomEvent(event, type)) {
            this.menu.mathItem = math;
            this.menu.post(event);
            this.zoomBox.post();
        }
    }

    protected isZoomEvent(event: MouseEvent, zoom: string) {
        return (this.settings.zoom === zoom &&
                (!this.settings.alt   || event.altKey) &&
                (!this.settings.ctrl  || event.ctrlKey) &&
                (!this.settings.cmd   || event.metaKey) &&
                (!this.settings.shift || event.shiftKey));
    }

    public clear() {
        this.menu.getStore().clear();
    }

    public variable<T extends (string | boolean)>(name: keyof MenuSettings, setter?: (value: T) => void) {
        return {
            name: name,
            getter: () => this.settings[name],
            setter: (value: T) => {
console.log('setting '+name+' to '+value);
                (setter || (v => this.settings[name] = v))(value);
                this.saveUserSettings();
            }
        };
    }

    public submenu(id: string, content: string, entries: any[] = [], disabled: boolean = false) {
        let items = [] as Array<Object>;
        for (const entry of entries) {
            if (Array.isArray(entry)) {
                items = items.concat(entry);
            } else {
                items.push(entry);
            }
        }
        return {type: 'submenu', id, content, menu: {items}, disabled: (items.length === 0) || disabled};
    }

    public command(id: string, content: string, action: () => void, other: Object = {}) {
        return Object.assign({type: 'command', id, content, action}, other);
    }

    public checkbox(id: string, content: string, variable: string, other: Object = {}) {
        return Object.assign({type: 'checkbox', id, content, variable}, other);
    }

    public radioGroup(variable: string, radios: string[][]) {
        return radios.map(def => this.radio(def[0], def[1] || def[0], variable));
    }

    public radio(id: string, content: string, variable: string, other: Object = {}) {
        return Object.assign({type: 'radio', id, content, variable}, other);
    }

    public label(id: string, content: string) {
        return {type: 'label', id, content};
    }

    public rule() {
        return {type: 'rule'};
    }

}
