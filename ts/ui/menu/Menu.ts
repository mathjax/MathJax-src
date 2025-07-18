/*************************************************************
 *
 *  Copyright (c) 2019-2025 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @file  Implements a subclass of ContextMenu specific to MathJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { mathjax } from '../../mathjax.js';

import { MathItem, STATE } from '../../core/MathItem.js';
import { OutputJax } from '../../core/OutputJax.js';
import { MathJax as MJX } from '../../components/global.js';
import { MathJaxObject as StartupObject } from '../../components/startup.js';
import { MathJaxObject as LoaderObject } from '../../components/loader.js';
import {
  OptionList,
  userOptions,
  defaultOptions,
  expandable,
} from '../../util/Options.js';
import { ExplorerMathItem } from '../../a11y/explorer.js';

import { SVG } from '../../output/svg.js';

import * as AnnotationMenu from './AnnotationMenu.js';
import { MJContextMenu } from './MJContextMenu.js';
import { RadioCompare } from './RadioCompare.js';
import { MmlVisitor } from './MmlVisitor.js';
import { SelectableInfo } from './SelectableInfo.js';
import { MenuMathDocument } from './MenuHandler.js';
import * as MenuUtil from './MenuUtil.js';

import { Info, Parser, Rule, CssStyles, Submenu } from './mj-context-menu.js';

/*==========================================================================*/

/**
 * The global MathJax object
 */
const MathJax = MJX as StartupObject & LoaderObject;

/**
 * The XML indentifiaction string
 */
const XMLDECLARATION = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';

/*==========================================================================*/

/**
 * The various values that are stored in the menu
 */
export interface MenuSettings {
  showSRE: boolean;
  showTex: boolean;
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
  overflow: string;
  breakInline: boolean;
  autocollapse: boolean;
  collapsible: boolean;
  enrich: boolean;
  inTabOrder: boolean;
  assistiveMml: boolean;
  // A11y settings
  backgroundColor: string;
  backgroundOpacity: string;
  braille: boolean;
  brailleCode: string;
  foregroundColor: string;
  foregroundOpacity: string;
  highlight: string;
  infoPrefix: boolean;
  infoRole: boolean;
  infoType: boolean;
  locale: string;
  magnification: string;
  magnify: string;
  speech: boolean;
  speechRules: string;
  subtitles: boolean;
  treeColoring: boolean;
  viewBraille: boolean;
  voicing: boolean;
  help: boolean;
  roleDescription: string;
  tabSelects: string;
}

export type HTMLMATHITEM = MathItem<HTMLElement, Text, Document>;

export type JaxList = {
  [name: string]: OutputJax<HTMLElement, Text, Document>;
};

/*==========================================================================*/

/**
 * The Menu object that handles the MathJax contextual menu and its actions
 */
export class Menu {
  /**
   * The key for the localStorage for the menu settings
   */
  public static MENU_STORAGE = 'MathJax-Menu-Settings';

  /**
   * The options for the menu, including the default settings, the various output jax
   * and the list of annotation types and their encodings
   */
  public static OPTIONS: OptionList = {
    settings: {
      showSRE: false,
      showTex: false,
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
      overflow: 'Scroll',
      breakInline: true,
      autocollapse: false,
      collapsible: false,
      enrich: true,
      inTabOrder: true,
      assistiveMml: false,
      speech: true,
      braille: true,
      brailleCode: 'nemeth',
      speechRules: 'clearspeak-default',
      roleDescription: 'math',
      tabSelects: 'all',
    },
    jax: {
      CHTML: null,
      SVG: null,
    },
    annotationTypes: expandable({
      TeX: ['TeX', 'LaTeX', 'application/x-tex'],
      StarMath: ['StarMath 5.0'],
      Maple: ['Maple'],
      ContentMathML: ['MathML-Content', 'application/mathml-content+xml'],
      OpenMath: ['OpenMath'],
    }),
  };

  /**
   * The CSS to include in SVG images
   */
  public static SvgCss: string = [
    'svg a{fill:blue;stroke:blue}',
    '[data-mml-node="merror"]>g{fill:red;stroke:red}',
    '[data-mml-node="merror"]>rect[data-background]{fill:yellow;stroke:none}',
    '[data-frame],[data-line]{stroke-width:70px;fill:none}',
    '.mjx-dashed{stroke-dasharray:140}',
    '.mjx-dotted{stroke-linecap:round;stroke-dasharray:0,140}',
    'use[data-c]{stroke-width:3px}',
  ].join('');

  /**
   * The number of startup modules that are currently being loaded
   */
  protected static loading: number = 0;

  /**
   * Promises for the loading components
   */
  protected static loadingPromises: Map<string, Promise<void>> = new Map();

  /**
   * A promise that is resolved when all components are loaded
   */
  protected static _loadingPromise: Promise<void> = null;

  /**
   * Function used to resolve the _loadingPromise
   */
  protected static _loadingOK: () => void = null;
  /**
   * Function used to reject the _loadingPromise
   */
  protected static _loadingFailed: (err: Error) => void = null;

  /**
   * The options for this menu
   */
  public options: OptionList;

  /**
   * The current settings for this menu (the variables attached to the menu's pool)
   */
  public settings: MenuSettings = null;

  /**
   * The original settings (with page options factored in) for use with the reset command
   */
  public defaultSettings: MenuSettings = null;

  /**
   * The contextual menu object that is managed by this Menu
   */
  public menu: MJContextMenu = null;

  /**
   * The current element being explored
   */
  public current: HTMLElement = null;

  /**
   * A MathML serializer that has options corresponding to the menu settings
   */
  public MmlVisitor = new MmlVisitor<HTMLElement, Text, Document>();

  /**
   * The MathDocument in which we are working
   */
  protected document: MenuMathDocument;

  /**
   * Instances of the various output jax that we can switch to
   */
  protected jax: JaxList = {
    CHTML: null,
    SVG: null,
  };

  /**
   * The minium initial state for pending rerender requests (so final rerender gets the right start)
   */
  protected rerenderStart: number = STATE.LAST;

  /**
   * List of font extensions that were loaded via \require
   */
  public requiredExtensions: string[] = [];

  /**
   * @returns {boolean}   true when the menu is loading some component
   */
  public get isLoading(): boolean {
    return Menu.loading > 0;
  }

  /**
   * @returns {Promise}   A promise that is resolved when all pending loads are complete
   */
  public get loadingPromise(): Promise<void> {
    if (!this.isLoading) {
      return Promise.resolve();
    }
    if (!Menu._loadingPromise) {
      Menu._loadingPromise = new Promise<void>((ok, failed) => {
        Menu._loadingOK = ok;
        Menu._loadingFailed = failed;
      });
    }
    return Menu._loadingPromise;
  }

  /*======================================================================*/

  /**
   * The "About MathJax" info box
   */
  protected about = new Info(
    '<b style="font-size:120%;">MathJax</b> v' + mathjax.version,
    () => {
      const lines = [] as string[];
      lines.push(
        'Input Jax: ' + this.document.inputJax.map((jax) => jax.name).join(', ')
      );
      lines.push('Output Jax: ' + this.document.outputJax.name);
      lines.push('Document Type: ' + this.document.kind);
      return lines.join('<br/>');
    },
    '<a href="https://www.mathjax.org">www.mathjax.org</a>'
  );

  /**
   * The "MathJax Help" info box
   */
  protected help = new Info(
    '<b>MathJax Help</b>',
    () => {
      return [
        '<p><b>MathJax</b> is a JavaScript library that allows page',
        ' authors to include mathematics within their web pages.',
        " As a reader, you don't need to do anything to make that happen.</p>",
        '<p><b>Browsers</b>: MathJax works with all modern browsers including',
        ' Edge, Firefox, Chrome, Safari, Opera, and most mobile browsers.</p>',
        '<p><b>Math Menu</b>: MathJax adds a contextual menu to equations.',
        ' Right-click or CTRL-click on any mathematics to access the menu.</p>',
        '<div style="margin-left: 1em;">',
        "<p><b>Show Math As:</b> These options allow you to view the formula's",
        ' source markup (as MathML or in its original format).</p>',
        "<p><b>Copy to Clipboard:</b> These options copy the formula's source markup,",
        ' as MathML or in its original format, to the clipboard',
        ' (in browsers that support that).</p>',
        '<p><b>Math Settings:</b> These give you control over features of MathJax,',
        ' such the size of the mathematics, the mechanism used to display equations,',
        ' how to handle equations that are too wide, and the language to use for',
        " MathJax's menus and error messages (not yet implemented in v4).",
        '</p>',
        '<p><b>Accessibility</b>: MathJax can work with screen',
        ' readers to make mathematics accessible to the visually impaired.',
        ' Turn on speech or braille generation to enable creation of speech strings',
        ' and the ability to investigate expressions interactively.  You can control',
        ' the style of the explorer in its menu.</p>',
        '</div>',
        '<p><b>Math Zoom</b>: If you are having difficulty reading an',
        ' equation, MathJax can enlarge it to help you see it better, or',
        ' you can scale all the math on the page to make it larger.',
        ' Turn these features on in the <b>Math Settings</b> menu.</p>',
        "<p><b>Preferences</b>: MathJax uses your browser's localStorage database",
        ' to save the preferences set via this menu locally in your browser.  These',
        ' are not used to track you, and are not transferred or used remotely by',
        ' MathJax in any way.</p>',
      ].join('\n');
    },
    '<a href="https://www.mathjax.org">www.mathjax.org</a>'
  );

  /**
   * The "Show As MathML" info box
   */
  protected mathmlCode = new SelectableInfo(
    'MathJax MathML Expression',
    () => {
      if (!this.menu.mathItem) return '';
      const text = this.toMML(this.menu.mathItem);
      return '<pre>' + this.formatSource(text) + '</pre>';
    },
    ''
  );

  /**
   * The "Show As (original form)" info box
   */
  protected originalText = new SelectableInfo(
    'MathJax Original Source',
    () => {
      if (!this.menu.mathItem) return '';
      const text = this.menu.mathItem.math;
      return (
        '<pre style="font-size:125%; margin:0">' +
        this.formatSource(text) +
        '</pre>'
      );
    },
    ''
  );

  /**
   * The "Show As Annotation" info box
   */
  protected annotationBox = new SelectableInfo(
    'MathJax Annotation Text',
    () => {
      const text = AnnotationMenu.annotation;
      return (
        '<pre style="font-size:125%; margin:0">' +
        this.formatSource(text) +
        '</pre>'
      );
    },
    ''
  );

  /**
   * The "Show As SVG Image" info box
   */
  protected svgImage = new SelectableInfo(
    'MathJax SVG Image',
    () => {
      //
      // SVG image inserted after it is created
      //
      return (
        '<div id="svg-image" style="font-family: monospace; font-size:125%; margin:0">' +
        'Generative SVG Image...</div>'
      );
    },
    ''
  );

  /**
   * The "Show As Speech Text" info box
   */
  protected speechText = new SelectableInfo(
    'MathJax Speech Text',
    () => {
      if (!this.menu.mathItem) return '';
      return (
        '<div style="font-size:125%; margin:0">' +
        this.formatSource(this.menu.mathItem.outputData.speech) +
        '</div>'
      );
    },
    ''
  );

  /**
   * The "Show As Speech Text" info box
   */
  protected brailleText = new SelectableInfo(
    'MathJax Braille Code',
    () => {
      if (!this.menu.mathItem) return '';
      return (
        '<div style="font-size:125%; margin:0">' +
        this.formatSource(this.menu.mathItem.outputData.braille) +
        '</div>'
      );
    },
    ''
  );

  /**
   * The "Show As Error Message" info box
   */
  protected errorMessage = new SelectableInfo(
    'MathJax Error Message',
    () => {
      if (!this.menu.mathItem) return '';
      return (
        '<pre style="font-size:125%; margin:0">' +
        this.formatSource(this.menu.errorMsg) +
        '</pre>'
      );
    },
    ''
  );

  /**
   * The info box for zoomed expressions
   */
  protected zoomBox = new Info(
    'MathJax Zoomed Expression',
    () => {
      if (!this.menu.mathItem) return '';
      const element = (this.menu.mathItem.typesetRoot as any).cloneNode(
        true
      ) as HTMLElement;
      element.style.margin = '0';
      const scale = 1.25 * parseFloat(this.settings.zscale); // 1.25 is to reverse the default 80% font-size
      return (
        '<div style="font-size: ' + scale + '%">' + element.outerHTML + '</div>'
      );
    },
    ''
  );

  protected postInfo(dialog: Info) {
    if (this.menu.mathItem) {
      this.menu.nofocus = !!this.menu.mathItem.outputData.nofocus;
    }
    dialog.post();
  }

  /*======================================================================*/

  /**
   * Accept options in addition to the MathDocument, and set up the menu based
   *  on the defaults, the passed options, and the user's saved settings.
   *
   * @param {MenuMathDocument} document   The MathDcument where this menu will post
   * @param {OptionList} options          The options for the menu
   * @override
   */
  constructor(document: MenuMathDocument, options: OptionList = {}) {
    this.document = document;
    this.options = userOptions(
      defaultOptions({}, (this.constructor as typeof Menu).OPTIONS),
      options
    );
    this.initSettings();
    this.mergeUserSettings();
    this.initMenu();
    this.applySettings();
  }

  /**
   * Set up the settings and jax objects, and transfer the output jax name and scale to the settings
   */
  protected initSettings() {
    this.settings = this.options.settings;
    this.jax = this.options.jax;
    const jax = this.document.outputJax;
    this.jax[jax.name] = jax;
    this.settings.renderer = jax.name;
    this.settings.scale = jax.options.scale;
    if (jax.options.displayOverflow) {
      this.settings.overflow =
        jax.options.displayOverflow.substring(0, 1).toUpperCase() +
        jax.options.displayOverflow.substring(1).toLowerCase();
    }
    this.settings.breakInline = jax.options.linebreaks?.inline;
    this.defaultSettings = Object.assign(
      {},
      this.document.options.a11y,
      this.settings
    );
    this.setA11y({ roleDescription: this.settings.roleDescription });
  }

  /**
   * Create the menu object, attach the info boxes to it, and output any CSS needed for it
   */
  protected initMenu() {
    const parser = new Parser([
      ['contextMenu', MJContextMenu.fromJson.bind(MJContextMenu)],
      ['radioCompare', RadioCompare.fromJson.bind(RadioCompare)],
    ]);
    this.menu = parser.parse({
      type: 'contextMenu',
      id: 'MathJax_Menu',
      pool: [
        this.variable<boolean>('showSRE'),
        this.variable<boolean>('showTex'),
        this.variable<boolean>('texHints'),
        this.variable<boolean>('semantics'),
        this.variable<string>('zoom'),
        this.variable<string>('zscale'),
        this.variable<string>('renderer', (jax) => this.setRenderer(jax)),
        this.variable<string>('overflow', (overflow) =>
          this.setOverflow(overflow)
        ),
        this.variable<boolean>('breakInline', (breaks) =>
          this.setInlineBreaks(breaks)
        ),
        this.variable<boolean>('alt'),
        this.variable<boolean>('cmd'),
        this.variable<boolean>('ctrl'),
        this.variable<boolean>('shift'),
        this.variable<string>('scale', (scale) => this.setScale(scale)),
        this.a11yVar<boolean>('speech', (speech) => this.setSpeech(speech)),
        this.a11yVar<boolean>('braille', (braille) => this.setBraille(braille)),
        this.variable<string>('brailleCode', (code) =>
          this.setBrailleCode(code)
        ),
        this.a11yVar<string>('highlight', (value) => this.setHighlight(value)),
        this.a11yVar<string>('backgroundColor'),
        this.a11yVar<string>('backgroundOpacity'),
        this.a11yVar<string>('foregroundColor'),
        this.a11yVar<string>('foregroundOpacity'),
        this.a11yVar<boolean>('subtitles'),
        this.a11yVar<boolean>('viewBraille'),
        this.a11yVar<boolean>('voicing'),
        this.a11yVar<string>('roleDescription', () =>
          this.setRoleDescription()
        ),
        this.a11yVar<boolean>('help'),
        this.a11yVar<string>('locale', (locale) => this.setLocale(locale)),
        this.variable<string>('speechRules', (value) => {
          const [domain, style] = value.split('-');
          this.document.options.sre.domain = domain;
          this.document.options.sre.style = style;
          this.rerender(STATE.COMPILED);
        }),
        this.a11yVar<string>('magnification'),
        this.a11yVar<string>('magnify'),
        this.a11yVar<boolean>('treeColoring'),
        this.a11yVar<boolean>('infoType'),
        this.a11yVar<boolean>('infoRole'),
        this.a11yVar<boolean>('infoPrefix'),
        this.variable<boolean>('autocollapse'),
        this.variable<boolean>('collapsible', (collapse) =>
          this.setCollapsible(collapse)
        ),
        this.variable<boolean>('enrich', (enrich) =>
          this.setEnrichment(enrich)
        ),
        this.variable<boolean>('inTabOrder', (tab) => this.setTabOrder(tab)),
        this.a11yVar<string>('tabSelects'),
        this.variable<boolean>('assistiveMml', (mml) =>
          this.setAssistiveMml(mml)
        ),
      ],
      items: [
        this.submenu('Show', 'Show Math As', [
          this.command('MathMLcode', 'MathML Code', () =>
            this.postInfo(this.mathmlCode)
          ),
          this.command('Original', 'Original Form', () =>
            this.postInfo(this.originalText)
          ),
          this.rule(),
          this.command(
            'Speech',
            'Speech Text',
            () => this.postInfo(this.speechText),
            {
              disabled: true,
            }
          ),
          this.command(
            'Braille',
            'Braille Code',
            () => this.postInfo(this.brailleText),
            { disabled: true }
          ),
          this.command('SVG', 'SVG Image', () => this.postSvgImage(), {
            disabled: true,
          }),
          this.submenu('ShowAnnotation', 'Annotation'),
          this.rule(),
          this.command(
            'Error',
            'Error Message',
            () => this.postInfo(this.errorMessage),
            { disabled: true }
          ),
        ]),
        this.submenu('Copy', 'Copy to Clipboard', [
          this.command('MathMLcode', 'MathML Code', () => this.copyMathML()),
          this.command('Original', 'Original Form', () => this.copyOriginal()),
          this.rule(),
          this.command('Speech', 'Speech Text', () => this.copySpeechText(), {
            disabled: true,
          }),
          this.command(
            'Braille',
            'Braille Code',
            () => this.copyBrailleText(),
            { disabled: true }
          ),
          this.command('SVG', 'SVG Image', () => this.copySvgImage(), {
            disabled: true,
          }),
          this.submenu('CopyAnnotation', 'Annotation'),
          this.rule(),
          this.command(
            'Error',
            'Error Message',
            () => this.copyErrorMessage(),
            { disabled: true }
          ),
        ]),
        this.rule(),
        this.submenu('Settings', 'Math Settings', [
          this.submenu(
            'Renderer',
            'Math Renderer',
            this.radioGroup('renderer', [['CHTML'], ['SVG']])
          ),
          this.submenu('Overflow', 'Wide Expressions', [
            this.radioGroup('overflow', [
              ['Overflow'],
              ['Scroll'],
              ['Linebreak'],
              ['Scale'],
              ['Truncate'],
              ['Elide'],
            ]),
            this.rule(),
            this.checkbox('BreakInline', 'Allow In-line Breaks', 'breakInline'),
          ]),
          this.rule(),
          this.submenu('MathmlIncludes', 'MathML/SVG has', [
            this.checkbox('showSRE', 'Semantic attributes', 'showSRE'),
            this.checkbox('showTex', 'LaTeX attributes', 'showTex'),
            this.checkbox('texHints', 'TeX hints', 'texHints'),
            this.checkbox('semantics', 'Original as annotation', 'semantics'),
          ]),
          this.submenu('Language', 'Language'),
          this.rule(),
          this.submenu('ZoomTrigger', 'Zoom Trigger', [
            this.command('ZoomNow', 'Zoom Once Now', () =>
              this.zoom(null, '', this.menu.mathItem)
            ),
            this.rule(),
            this.radioGroup('zoom', [
              ['Click'],
              ['DoubleClick', 'Double-Click'],
              ['NoZoom', 'No Zoom'],
            ]),
            this.rule(),
            this.label('TriggerRequires', 'Trigger Requires:'),
            this.checkbox(
              MenuUtil.isMac ? 'Option' : 'Alt',
              MenuUtil.isMac ? 'Option' : 'Alt',
              'alt'
            ),
            this.checkbox('Command', 'Command', 'cmd', {
              hidden: !MenuUtil.isMac,
            }),
            this.checkbox('Control', 'Control', 'ctrl', {
              hiddne: MenuUtil.isMac,
            }),
            this.checkbox('Shift', 'Shift', 'shift'),
          ]),
          this.submenu(
            'ZoomFactor',
            'Zoom Factor',
            this.radioGroup('zscale', [
              ['150%'],
              ['175%'],
              ['200%'],
              ['250%'],
              ['300%'],
              ['400%'],
            ])
          ),
          this.rule(),
          this.command('Scale', 'Scale All Math...', () => this.scaleAllMath()),
          this.rule(),
          this.command('Reset', 'Reset to defaults', () =>
            this.resetDefaults()
          ),
        ]),
        this.rule(),
        this.label('Accessibility', '\xA0\xA0 Accessibility:'),
        this.submenu('Speech', '\xA0 \xA0 Speech', [
          this.checkbox('Generate', 'Generate', 'speech'),
          this.checkbox('Subtitles', 'Show Subtitles', 'subtitles'),
          this.checkbox('Auto Voicing', 'Auto Voicing', 'voicing'),
          this.rule(),
          this.label('Rules', 'Rules:'),
          this.submenu(
            'Mathspeak',
            'Mathspeak',
            this.radioGroup('speechRules', [
              ['mathspeak-default', 'Verbose'],
              ['mathspeak-brief', 'Brief'],
              ['mathspeak-sbrief', 'Superbrief'],
            ])
          ),
          this.submenu(
            'Clearspeak',
            'Clearspeak',
            this.radioGroup('speechRules', [['clearspeak-default', 'Auto']])
          ),
          this.rule(),
          this.submenu('A11yLanguage', 'Language'),
        ]),
        this.submenu('Braille', '\xA0 \xA0 Braille', [
          this.checkbox('Generate', 'Generate', 'braille'),
          this.checkbox('Subtitles', 'Show Subtitles', 'viewBraille'),
          this.rule(),
          this.label('Code', 'Code Format:'),
          this.radioGroup('brailleCode', [
            ['nemeth', 'Nemeth'],
            ['ueb', 'UEB'],
            ['euro', 'Euro'],
          ]),
        ]),
        this.submenu('Explorer', '\xA0 \xA0 Explorer', [
          this.submenu('Highlight', 'Highlight', [
            this.submenu(
              'Background',
              'Background',
              this.radioGroup('backgroundColor', [
                ['Blue'],
                ['Red'],
                ['Green'],
                ['Yellow'],
                ['Cyan'],
                ['Magenta'],
                ['White'],
                ['Black'],
              ])
            ),
            { type: 'slider', variable: 'backgroundOpacity', content: ' ' },
            this.submenu(
              'Foreground',
              'Foreground',
              this.radioGroup('foregroundColor', [
                ['Black'],
                ['White'],
                ['Magenta'],
                ['Cyan'],
                ['Yellow'],
                ['Green'],
                ['Red'],
                ['Blue'],
              ])
            ),
            { type: 'slider', variable: 'foregroundOpacity', content: ' ' },
            this.rule(),
            this.radioGroup('highlight', [['None'], ['Hover'], ['Flame']]),
            this.rule(),
            this.checkbox('TreeColoring', 'Tree Coloring', 'treeColoring'),
          ]),
          this.submenu('Magnification', 'Magnification', [
            this.radioGroup('magnification', [
              ['None'],
              ['Keyboard'],
              ['Mouse'],
            ]),
            this.rule(),
            this.radioGroup('magnify', [
              ['200%'],
              ['300%'],
              ['400%'],
              ['500%'],
            ]),
          ]),
          this.submenu('Semantic Info', 'Semantic Info', [
            this.checkbox('Type', 'Type', 'infoType'),
            this.checkbox('Role', 'Role', 'infoRole'),
            this.checkbox('Prefix', 'Prefix', 'infoPrefix'),
          ]),
          this.rule(),
          this.submenu('Role Description', 'Describe math as', [
            this.radioGroup('roleDescription', [
              ['MathJax expression'],
              ['MathJax'],
              ['math'],
              ['clickable math'],
              ['explorable math'],
              ['none'],
            ]),
          ]),
          this.checkbox('Math Help', 'Help message on focus', 'help'),
        ]),
        this.submenu('Options', '\xA0 \xA0 Options', [
          this.checkbox('Enrich', 'Semantic Enrichment', 'enrich'),
          this.checkbox('Collapsible', 'Collapsible Math', 'collapsible'),
          this.checkbox('AutoCollapse', 'Auto Collapse', 'autocollapse', {
            disabled: true,
          }),
          this.rule(),
          this.checkbox('InTabOrder', 'Include in Tab Order', 'inTabOrder'),
          this.submenu('TabSelects', 'Tabbing Focuses on', [
            this.radioGroup('tabSelects', [
              ['all', 'Whole Expression'],
              ['last', 'Last Explored Node'],
            ]),
          ]),
          this.rule(),
          this.checkbox(
            'AssistiveMml',
            'Include Hidden MathML',
            'assistiveMml'
          ),
        ]),
        this.rule(),
        this.command('About', 'About MathJax', () => this.postInfo(this.about)),
        this.command('Help', 'MathJax Help', () => this.postInfo(this.help)),
      ],
    }) as MJContextMenu;
    const menu = this.menu;
    menu.settings = this.settings;
    menu.findID('Settings', 'Overflow', 'Elide').disable();
    menu.findID('Braille', 'ueb').hide();
    menu.setJax(this.jax);
    this.attachDialogMenus(menu);
    this.checkLoadableItems();
    const cache: [string, string][] = [];
    MJContextMenu.DynamicSubmenus.set('ShowAnnotation', [
      AnnotationMenu.showAnnotations(
        this.annotationBox,
        this.options.annotationTypes,
        cache
      ),
      '',
    ]);
    MJContextMenu.DynamicSubmenus.set('CopyAnnotation', [
      AnnotationMenu.copyAnnotations(cache),
      '',
    ]);
    CssStyles.addInfoStyles(this.document.document as any);
    CssStyles.addMenuStyles(this.document.document as any);
  }

  /**
   * @param {MJContextMenu} menu   The menu to attach
   */
  protected attachDialogMenus(menu: MJContextMenu) {
    this.about.attachMenu(menu);
    this.help.attachMenu(menu);
    this.originalText.attachMenu(menu);
    this.mathmlCode.attachMenu(menu);
    this.originalText.attachMenu(menu);
    this.svgImage.attachMenu(menu);
    this.speechText.attachMenu(menu);
    this.brailleText.attachMenu(menu);
    this.errorMessage.attachMenu(menu);
    this.zoomBox.attachMenu(menu);
  }

  /**
   * Check whether the startup and loader modules are available, and
   *   if not, disable the a11y modules (since we can't load them
   *   or know if they are available).
   * Otherwise, check if any need to be loaded
   */
  protected checkLoadableItems() {
    if (MathJax && MathJax._ && MathJax.loader && MathJax.startup) {
      const settings = this.settings;
      const options = this.document.options;
      if (
        (settings.enrich ||
          (settings.speech && options.enableSpeech) ||
          (settings.braille && options.enableBraille)) &&
        !MathJax._?.a11y?.explorer
      ) {
        this.loadA11y('explorer');
      }
      if (settings.collapsible && !MathJax._?.a11y?.complexity) {
        this.loadA11y('complexity');
      }
      if (settings.assistiveMml && !MathJax._?.a11y?.['assistive-mml']) {
        this.loadA11y('assistive-mml');
      }
    } else {
      const menu = this.menu;
      for (const name of Object.keys(this.jax)) {
        if (!this.jax[name]) {
          menu.findID('Settings', 'Renderer', name).disable();
        }
      }
      menu.findID('Speech').disable();
      menu.findID('Braille').disable();
      menu.findID('Explorer').disable();
      menu.findID('Options', 'AutoCollapse').disable();
      menu.findID('Options', 'Collapsible').disable();
      menu.findID('Options', 'Enrich').disable();
      menu.findID('Options', 'AssistiveMml').disable();
    }
  }

  /**
   * Enable/disable an assistive submenu's items
   *
   * @param {string} name The name of the item
   * @param {boolean} enable  True to enable, false to disable
   */
  protected enableAccessibilityItems(name: string, enable: boolean) {
    const menu = (this.menu.findID(name) as Submenu).submenu;
    for (const item of menu.items.slice(1)) {
      if (item instanceof Rule) continue;
      enable && (!(item instanceof Submenu) || item.submenu.items.length)
        ? item.enable()
        : item.disable();
    }
  }

  /*======================================================================*/

  /**
   * Look up the saved settings from localStorage and merge them into the menu settings
   */
  protected mergeUserSettings() {
    try {
      const settings = localStorage.getItem(Menu.MENU_STORAGE);
      if (!settings) return;
      Object.assign(this.settings, JSON.parse(settings));
      this.setA11y(this.settings);
    } catch (err) {
      console.log('MathJax localStorage error: ' + err.message);
    }
  }

  /**
   * Save any non-default menu settings in localStorage
   */
  protected saveUserSettings() {
    const settings = {} as { [key: string]: any };
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

  /**
   * Merge menu settings into the a11y document options.
   *
   * @param {{[key: string]: any}} options The options.
   */
  protected setA11y(options: { [key: string]: any }) {
    if (MathJax._?.a11y?.explorer) {
      MathJax._.a11y.explorer_ts.setA11yOptions(this.document, options);
    }
  }

  /**
   * Get the the value of an a11y option
   *
   * @param {string} option   The name of the ptions to get
   * @returns {any}            The value of the option
   */
  protected getA11y(option: string): any {
    if (MathJax._?.a11y?.explorer) {
      if (this.document.options.a11y[option] !== undefined) {
        return this.document.options.a11y[option];
      }
      return this.document.options.sre[option];
    }
  }

  /*======================================================================*/

  /**
   * Do what is needed to apply the initial user settings
   */
  protected applySettings() {
    this.setTabOrder(this.settings.inTabOrder);
    const options = this.document.options;
    options.enableAssistiveMml = this.settings.assistiveMml;
    this.enableAccessibilityItems('Speech', this.settings.speech);
    this.enableAccessibilityItems('Braille', this.settings.braille);
    this.setAccessibilityMenus();
    const renderer =
      this.settings.renderer.replace(/[^a-zA-Z0-9]/g, '') || 'CHTML';
    (Menu._loadingPromise || Promise.resolve()).then(() => {
      const settings = this.settings;
      const options = this.document.outputJax.options;
      options.scale = parseFloat(settings.scale);
      options.displayOverflow = settings.overflow.toLowerCase();
      if (options.linebreaks) {
        options.linebreaks.inline = settings.breakInline;
      }
      if (!settings.speechRules) {
        const sre = this.document.options.sre;
        settings.speechRules = `${sre.domain || 'clearspeak'}-${sre.style || 'default'}`;
      }
      if (renderer !== this.defaultSettings.renderer) {
        this.document.whenReady(() => this.setRenderer(renderer, false));
      }
    });
  }

  /**
   * @param {string} overflow   The new overflow value
   */
  protected setOverflow(overflow: string) {
    this.document.outputJax.options.displayOverflow = overflow.toLowerCase();
    if (!Menu.loading) {
      this.document.rerenderPromise();
    }
  }

  /**
   * @param {boolean} breaks   The new in-line break value
   */
  protected setInlineBreaks(breaks: boolean) {
    this.document.outputJax.options.linebreaks.inline = breaks;
    if (!Menu.loading) {
      this.document.rerenderPromise();
    }
  }

  /**
   * @param {string} scale   The new scaling value
   */
  protected setScale(scale: string) {
    this.document.outputJax.options.scale = parseFloat(scale);
    if (!Menu.loading) {
      this.document.rerenderPromise();
    }
  }

  /**
   * If the jax is already on record, just use it, otherwise load the new one
   *
   * @param {string} jax         The name of the jax to switch to
   * @param {boolean} rerender   True if the document should be rerendered
   * @returns {Promise}           A promise that is resolved when the renderer is set
   *                               and rerendering complete
   */
  protected setRenderer(jax: string, rerender: boolean = true): Promise<void> {
    if (Object.hasOwn(this.jax, jax) && this.jax[jax]) {
      return this.setOutputJax(jax, rerender);
    }
    const name = jax.toLowerCase();
    return new Promise<void>((ok, fail) => {
      this.loadComponent('output/' + name, () => {
        const startup = MathJax.startup;
        if (!(name in startup.constructors)) {
          return fail(new Error(`Component ${name} not loaded`));
        }
        startup.useOutput(name, true);
        startup.output = startup.getOutputJax();
        startup.output.setAdaptor(this.document.adaptor);
        startup.output.initialize();
        this.jax[jax] = startup.output;
        this.setOutputJax(jax, rerender)
          .then(() => ok())
          .catch((err) => fail(err));
      });
    });
  }

  /**
   * Set up the new jax and link it to the document,
   * load any needed extensions, and then rerender the math, if needed
   *
   * @param {string} jax         The name of the jax to switch to
   * @param {boolean} rerender   True if the document should be rerendered
   * @returns {Promise}           A promise that is resolved when the renderer is set
   *                               and rerendering complete
   */
  protected setOutputJax(jax: string, rerender: boolean = true): Promise<void> {
    this.jax[jax].setAdaptor(this.document.adaptor);
    this.document.outputJax = this.jax[jax];
    const promise = this.loadRequiredExtensions();
    return rerender
      ? promise.then(() => mathjax.handleRetriesFor(() => this.rerender()))
      : promise.then(() => {});
  }

  /**
   * Load the required extensions into the new output jax
   *
   * @returns {Promise} The promise combining all loading promises
   */
  protected loadRequiredExtensions(): Promise<string[]> {
    const jax = this.document.outputJax.name.toLowerCase();
    const promises = [];
    for (const path of this.requiredExtensions) {
      promises.push(MathJax.loader.load(`[${path}]/${jax}`));
    }
    this.requiredExtensions = [];
    return Promise.all(promises);
  }

  /**
   * Add extensions that need to be loaded when the renderer changes
   *
   * @param {string[]} extensions The list of extensions
   */
  public addRequiredExtensions(extensions: string[]) {
    if (extensions) {
      const set = new Set<string>([...this.requiredExtensions, ...extensions]);
      this.requiredExtensions = [...set];
    }
  }

  /**
   * @param {boolean} tab   True for including math in the tab order, false for not
   */
  protected setTabOrder(tab: boolean) {
    const menu = this.menu.findID('Options', 'TabSelects');
    tab ? menu.enable() : menu.disable();
    this.menu.store.inTaborder(tab);
  }

  /**
   * @param {boolean} mml   True to output hidden Mathml, false to not
   */
  protected setAssistiveMml(mml: boolean) {
    this.document.options.enableAssistiveMml = mml;
    if (!mml || MathJax._?.a11y?.['assistive-mml']) {
      this.rerender();
    } else {
      this.loadA11y('assistive-mml');
    }
  }

  /**
   * Enable/disable assistive menus based on enrichment setting
   */
  protected setAccessibilityMenus() {
    const enable = this.settings.enrich;
    const method = enable ? 'enable' : 'disable';
    ['Speech', 'Braille', 'Explorer'].forEach((id) =>
      this.menu.findID(id)[method]()
    );
    const options = this.document.options;
    options.enableSpeech =
      options.enableBraille =
      options.enableExplorer =
        enable;
    if (!enable) {
      this.settings.collapsible = false;
      this.document.options.enableCollapsible = false;
    }
  }

  /**
   * @param {boolean} speech   True to enable speech, false to not
   */
  protected setSpeech(speech: boolean) {
    this.enableAccessibilityItems('Speech', speech);
    this.document.options.enableSpeech = speech;
    if (!speech || MathJax._?.a11y?.explorer) {
      this.rerender(STATE.COMPILED);
    } else {
      this.loadA11y('explorer');
    }
  }

  /**
   * @param {boolean} braille   True to enable braille, false to not
   */
  protected setBraille(braille: boolean) {
    this.enableAccessibilityItems('Braille', braille);
    this.document.options.enableBraille = braille;
    if (!braille || MathJax._?.a11y?.explorer) {
      this.rerender(STATE.COMPILED);
    } else {
      this.loadA11y('explorer');
    }
  }

  /**
   * @param {string} code  The Braille code format (nemeth or euro)
   */
  protected setBrailleCode(code: string) {
    this.document.options.sre.braille = code;
    this.rerender(STATE.COMPILED);
  }

  /**
   * @param {string} locale  The speech locale
   */
  protected setLocale(locale: string) {
    this.document.options.sre.locale = locale;
    this.rerender(STATE.COMPILED);
  }

  /**
   * Rerender when the role description changes
   */
  protected setRoleDescription() {
    this.rerender(STATE.COMPILED);
  }

  /**
   * @param {boolean} enrich   True to enable enriched math, false to not
   */
  protected setEnrichment(enrich: boolean) {
    this.document.options.enableEnrichment = enrich;
    this.setAccessibilityMenus();
    if (!enrich || MathJax._?.a11y?.explorer) {
      this.rerender(STATE.COMPILED);
    } else {
      this.loadA11y('explorer');
    }
  }

  /**
   * @param {boolean} collapse   True to enable collapsible math, false to not
   */
  protected setCollapsible(collapse: boolean) {
    this.document.options.enableComplexity = collapse;
    if (collapse && !this.settings.enrich) {
      this.settings.enrich = this.document.options.enableEnrichment = true;
      this.setAccessibilityMenus();
    }
    if (!collapse) {
      this.menu.pool.lookup('highlight').setValue('None');
    }
    if (!collapse || MathJax._?.a11y?.complexity) {
      this.rerender(STATE.COMPILED);
    } else {
      this.loadA11y('complexity');
      if (!MathJax._?.a11y?.explorer) {
        this.loadA11y('explorer');
      }
    }
  }

  /**
   * @param {string} value   The value that highlighting should have
   */
  protected setHighlight(value: string) {
    if (value === 'None') return;
    if (!this.settings.collapsible) {
      //
      //  Turn on collapsible math if it isn't already
      //
      const variable = this.menu.pool.lookup('collapsible');
      variable.setValue(true);
      (variable as any).items[0]?.executeCallbacks_?.();
    }
    if (!Menu.loadingPromises.has('a11y/complexity')) {
      this.rerender(STATE.COMPILED);
    }
  }

  /**
   * Request the scaling value from the user and save it in the settings
   */
  protected scaleAllMath() {
    const scale = (parseFloat(this.settings.scale) * 100)
      .toFixed(1)
      .replace(/.0$/, '');
    const percent = prompt(
      'Scale all mathematics (compared to surrounding text) by',
      scale + '%'
    );
    if (this.current) {
      const speech = (this.menu.mathItem as ExplorerMathItem).explorers.speech;
      speech.refocus = this.current;
      speech.focus();
    }
    if (percent) {
      if (percent.match(/^\s*\d+(\.\d*)?\s*%?\s*$/)) {
        const scale = parseFloat(percent) / 100;
        if (scale) {
          this.menu.pool.lookup('scale').setValue(String(scale));
        } else {
          alert('The scale should not be zero');
        }
      } else {
        alert('The scale should be a percentage (e.g., 120%)');
      }
    }
  }

  /**
   * Reset all menu settings to the (page) defaults
   */
  protected resetDefaults() {
    Menu.loading++; // pretend we're loading, to suppress rerendering for each variable change
    const pool = this.menu.pool;
    const settings = this.defaultSettings;
    for (const name of Object.keys(settings) as (keyof MenuSettings)[]) {
      const variable = pool.lookup(name);
      if (variable) {
        if (variable.getValue() !== settings[name]) {
          variable.setValue(settings[name] as string | boolean);
          const item = (variable as any).items[0];
          if (item) {
            item.executeCallbacks_();
          }
        }
      } else if (Object.hasOwn(this.settings, name)) {
        (this.settings as any)[name] = settings[name];
      }
    }
    Menu.loading--;
    this.rerender(STATE.COMPILED);
  }

  /*======================================================================*/

  /**
   * Check if a component is loading, and restart if it is
   *
   * @param {string} name        The name of the component to check if it is loading
   */
  public checkComponent(name: string) {
    const promise = Menu.loadingPromises.get(name);
    if (promise) {
      mathjax.retryAfter(promise);
    }
  }

  /**
   * Attempt to load a component and perform a callback when done
   *
   * @param {string} name The name of the component to load
   * @param {() => void} callback The callback for after loading
   */
  protected loadComponent(name: string, callback: () => void) {
    if (Menu.loadingPromises.has(name)) return;
    const loader = MathJax.loader;
    if (!loader) return;
    Menu.loading++;
    const promise = loader
      .load(name)
      .then(() => {
        Menu.loading--;
        Menu.loadingPromises.delete(name);
        if (Menu.loading === 0 && Menu._loadingPromise) {
          Menu._loadingPromise = null;
          Menu._loadingOK();
        }
        callback();
      })
      .catch((err) => {
        if (Menu._loadingPromise) {
          Menu._loadingPromise = null;
          Menu._loadingFailed(err);
        } else {
          console.log(err);
        }
      });
    Menu.loadingPromises.set(name, promise);
  }

  /**
   * Attempt to load an a11y component
   *
   * @param {string} component   The name of the a11y component to load
   */
  public loadA11y(component: string) {
    const noEnrich = !STATE.ENRICHED;
    this.loadComponent('a11y/' + component, () => {
      const startup = MathJax.startup;
      //
      // Unregister the handler and get a new one (since the component
      // will have added a handler extension), then register the new one
      //
      mathjax.handlers.unregister(startup.handler);
      startup.handler = startup.getHandler();
      mathjax.handlers.register(startup.handler);
      //
      // Save the old document and get a new one, attaching the
      //   original menu (this), and transfering any math items
      //   from the original document, then rerender with the
      //   updated document (from the new handler)
      //
      const document = this.document;
      this.document = startup.document = startup.getDocument();
      this.document.processed = document.processed;
      this.document.menu = this;
      if (document.webworker) {
        this.document.webworker = document.webworker;
      }
      this.setA11y(this.settings);
      this.defaultSettings = Object.assign(
        {},
        this.document.options.a11y,
        MathJax.config?.options?.a11y || {},
        this.defaultSettings
      );
      this.document.outputJax.reset();
      this.transferMathList(document);
      this.document.processed = document.processed;
      if (!Menu._loadingPromise) {
        this.document.outputJax.reset();
        mathjax.handleRetriesFor(() => {
          this.rerender(
            component === 'complexity' || noEnrich
              ? STATE.COMPILED
              : STATE.TYPESET
          );
        });
      }
    });
  }

  /**
   * @param {MenuMathDocument} document  The original document whose list is to be transferred
   */
  protected transferMathList(document: MenuMathDocument) {
    const MathItem = this.document.options.MathItem; // This has been updated by the new handler
    for (const item of document.math) {
      const math = new MathItem(); // Make a new MathItem
      Object.assign(math, item); // Copy the old data to the new math item
      this.document.math.push(math); // Add it to the current document
    }
  }

  /**
   * @param {string} text   The text to be displayed in an Info box
   * @returns {string}      The text with HTML specials being escaped
   */
  protected formatSource(text: string): string {
    return text
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * @param {HTMLMATHITEM} math   The MathItem to serialize as MathML
   * @returns {string}            The serialized version of the internal MathML
   */
  protected toMML(math: HTMLMATHITEM): string {
    return this.MmlVisitor.visitTree(math.root, math, {
      filterSRE: !this.settings.showSRE,
      filterTex: !this.settings.showTex,
      texHints: this.settings.texHints,
      semantics: this.settings.semantics && math.inputJax.name !== 'MathML',
    });
  }

  /**
   * @param {HTMLMATHITEM} math   The MathItem to serialize as SVG
   * @returns {Promise<string>}   A promise returning the serialized SVG
   */
  protected toSVG(math: HTMLMATHITEM): Promise<string> {
    const jax = this.jax.SVG;
    if (!jax)
      return Promise.resolve(
        "SVG can't be produced.<br>Try switching to SVG output first."
      );
    const adaptor = jax.adaptor;
    const cache = jax.options.fontCache;
    const breaks = !!math.root.getProperty('process-breaks');
    if (
      cache !== 'global' &&
      (math.display || !breaks) &&
      adaptor.getAttribute(math.typesetRoot, 'jax') === 'SVG'
    ) {
      for (const child of adaptor.childNodes(math.typesetRoot)) {
        if (adaptor.kind(child) === 'svg') {
          return Promise.resolve(
            this.formatSvg(adaptor.serializeXML(child as HTMLElement))
          );
        }
      }
    }
    return this.typesetSVG(math, cache, breaks);
  }

  /**
   * @param {HTMLMATHITEM} math   The MathItem to serialize as SVG
   * @param {string} cache        The SVG font cache type
   * @param {boolean} breaks      True if there are inline breaks
   * @returns {Promise<string>}   A promise returning the serialized SVG
   */
  protected async typesetSVG(
    math: HTMLMATHITEM,
    cache: string,
    breaks: boolean
  ): Promise<string> {
    const jax = this.jax.SVG as SVG<HTMLElement, Text, Document>;
    const div = jax.html('div');
    if (cache === 'global') {
      jax.options.fontCache = 'local';
    }
    const root = math.root;
    math.root = root.copy(true);
    math.root.setInheritedAttributes({}, math.display, 0, false);
    if (breaks) {
      jax.unmarkInlineBreaks(math.root);
      math.root.setProperty('inlineMarked', false);
    }
    const promise = mathjax.handleRetriesFor(() => {
      jax.toDOM(math, div, jax.document);
    });
    return promise.then(() => {
      math.root = root;
      jax.options.fontCache = cache;
      return this.formatSvg(jax.adaptor.innerHTML(div));
    });
  }

  /**
   * @param {string} svg   The serialzied SVG to adjust
   * @returns {string} The adjusted SVG string
   */
  protected formatSvg(svg: string): string {
    const css = (this.constructor as typeof Menu).SvgCss;
    svg = svg.match(/^<svg.*?><defs>/)
      ? svg.replace(/<defs>/, `<defs><style>${css}</style>`)
      : svg.replace(/^(<svg.*?>)/, `$1<defs><style>${css}</style></defs>`);
    svg = svg
      .replace(/ (?:role|focusable)=".*?"/g, '')
      .replace(/"currentColor"/g, '"black"');
    if (!this.settings.showSRE) {
      svg = svg.replace(
        / (?:data-semantic-.*?|data-speech-node|role|aria-(?:level|posinset|setsize|owns))=".*?"/g,
        ''
      );
    }
    if (!this.settings.showTex) {
      svg = svg.replace(/ data-latex(?:-item)?=".*?"/g, '');
    }
    if (!this.settings.texHints) {
      svg = svg
        .replace(
          / data-mjx-(?:texclass|alternate|variant|pseudoscript|smallmatrix|mathaccent|auto-op|script-align|vbox)=".*?"/g,
          ''
        )
        .replace(/ data-mml-node="TeXAtom"/g, '');
    }
    return `${XMLDECLARATION}\n${svg}`;
  }

  /**
   * Get the SVG image and post it
   */
  public postSvgImage() {
    this.postInfo(this.svgImage);
    this.toSVG(this.menu.mathItem).then((svg) => {
      const html = this.svgImage.html.querySelector('#svg-image');
      html.innerHTML = this.formatSource(svg).replace(/\n/g, '<br>');
    });
  }

  /*======================================================================*/

  /**
   * @param {MouseEvent|null} event   The event triggering the zoom (or null for from a menu pick)
   * @param {string} type             The type of event occurring (click, dblclick)
   * @param {HTMLMATHITEM} math       The MathItem triggering the event
   */
  protected zoom(event: MouseEvent, type: string, math: HTMLMATHITEM) {
    if (!event || this.isZoomEvent(event, type)) {
      this.menu.mathItem = math;
      if (event) {
        //
        // The zoomBox.post() below assumes the menu is open,
        //   so if this zoom() call is from an event (not the menu),
        //   make sure the menu is open before posting the zoom box
        //
        this.menu.post(event);
      }
      this.postInfo(this.zoomBox);
    }
  }

  /**
   * @param {MouseEvent} event   The event triggering the zoom action
   * @param {string} zoom        The type of event (click, dblclick) that occurred
   * @returns {boolean}          True if the event is the right type and has the needed modifiers
   */
  protected isZoomEvent(event: MouseEvent, zoom: string): boolean {
    return (
      this.settings.zoom === zoom &&
      (!this.settings.alt || event.altKey) &&
      (!this.settings.ctrl || event.ctrlKey) &&
      (!this.settings.cmd || event.metaKey) &&
      (!this.settings.shift || event.shiftKey)
    );
  }

  /**
   * Rerender the output if we aren't in the middle of loading a new component
   *   (in which case, we will rerender in the callback performed after it is loaded)
   *
   * @param {number=} start   The state at which to start rerendering
   */
  protected rerender(start: number = STATE.TYPESET) {
    this.rerenderStart = Math.min(start, this.rerenderStart);
    const startup = MathJax.startup;
    if (!Menu.loading && startup.hasTypeset) {
      startup.document.whenReady(async () => {
        if (this.rerenderStart <= STATE.COMPILED) {
          this.document.reset({ inputJax: [] });
        }
        await this.document.rerenderPromise(this.rerenderStart);
        this.rerenderStart = STATE.LAST;
      });
    }
  }

  /**
   * Copy the serialzied MathML to the clipboard
   */
  protected copyMathML() {
    MenuUtil.copyToClipboard(this.toMML(this.menu.mathItem));
  }

  /**
   * Copy the original form to the clipboard
   */
  protected copyOriginal() {
    MenuUtil.copyToClipboard(this.menu.mathItem.math.trim());
  }

  /**
   * Copy the SVG image to the clipboard
   */
  protected copySvgImage() {
    this.toSVG(this.menu.mathItem).then((svg) => {
      MenuUtil.copyToClipboard(svg);
    });
  }

  /**
   * Copy the speech text to the clipboard
   */
  protected copySpeechText() {
    MenuUtil.copyToClipboard(this.menu.mathItem.outputData.speech);
  }

  /**
   * Copy the speech text to the clipboard
   */
  protected copyBrailleText() {
    MenuUtil.copyToClipboard(this.menu.mathItem.outputData.braille);
  }

  /**
   * Copy the error message to the clipboard
   */
  protected copyErrorMessage() {
    MenuUtil.copyToClipboard(this.menu.errorMsg.trim());
  }

  /*======================================================================*/

  /**
   * @param {HTMLMATHITEM} math   The math to attach the context menu and zoom triggers to
   */
  public addMenu(math: HTMLMATHITEM) {
    this.addEvents(math);
    this.menu.store.insert(math.typesetRoot);
    math.typesetRoot.tabIndex = this.settings.inTabOrder ? 0 : -1;
  }

  public addEvents(math: HTMLMATHITEM) {
    const node = math.typesetRoot;
    node.addEventListener(
      'mousedown',
      () => {
        this.menu.mathItem = math;
        this.current = (math as any).explorers?.speech?.current;
      },
      true
    );
    node.addEventListener(
      'contextmenu',
      () => {
        this.menu.mathItem = math;
        const speech = (math as any).explorers?.speech;
        if (speech) {
          math.outputData.nofocus = !this.current;
          speech.refocus = this.current;
        }
      },
      true
    );
    node.addEventListener('keydown', () => (this.menu.mathItem = math), true);
    node.addEventListener(
      'click',
      (event) => this.zoom(event, 'Click', math),
      true
    );
    node.addEventListener(
      'dblclick',
      (event) => this.zoom(event, 'DoubleClick', math),
      true
    );
  }

  /**
   * Clear the information about stored context menus
   */
  public clear() {
    this.menu.store.clear();
  }

  /*======================================================================*/

  /**
   * Create JSON for a variable controlling a menu setting
   *
   * @param {keyof MenuSettings} name   The setting for which to make a variable
   * @param {(value: T) => void} action Optional function to perform after setting the value
   * @returns {object}                  The JSON for the variable
   *
   * @template T    The type of variable being defined
   */
  public variable<T extends string | boolean>(
    name: keyof MenuSettings,
    action?: (value: T) => void
  ): object {
    return {
      name: name,
      getter: () => this.settings[name],
      setter: (value: T) => {
        (this.settings as any)[name] = value;
        if (action) {
          action(value);
        }
        this.saveUserSettings();
      },
    };
  }

  /**
   * Create JSON for an a11y specific variable.
   *
   * @param {keyof MenuSettings} name   The setting for which to make a variable
   * @param {(value: T) => void} action The action to perform when the variable
   *                                      is updated
   * @returns {object}                  The JSON for the variable
   *
   * @template T    The type of variable being defined
   */
  public a11yVar<T extends string | boolean>(
    name: keyof MenuSettings,
    action?: (value: T) => void
  ): object {
    return {
      name: name,
      getter: () => this.getA11y(name),
      setter: (value: T) => {
        (this.settings as any)[name] = value;
        this.setA11y({ [name]: value });
        if (action) {
          action(value);
        }
        this.saveUserSettings();
      },
    };
  }

  /**
   * Create JSON for a submenu item
   *
   * @param {string} id           The id for the item
   * @param {string} content      The content for the item
   * @param {any[]} entries       The JSON for the entries
   * @param {boolean=} disabled   True if this item is diabled initially
   * @returns {object}            The JSON for the submenu item
   */
  public submenu(
    id: string,
    content: string,
    entries: any[] = [],
    disabled: boolean = false
  ): object {
    let items = [] as Array<object>;
    for (const entry of entries) {
      if (Array.isArray(entry)) {
        items = items.concat(entry);
      } else {
        items.push(entry);
      }
    }
    return {
      type: 'submenu',
      id,
      content,
      menu: { items },
      disabled: items.length === 0 || disabled,
    };
  }

  /**
   * Create JSON for a command item
   *
   * @param {string} id           The id for the item
   * @param {string} content      The content for the item
   * @param {() => void} action   The action function for the command
   * @param {object} other        Other values to include in the generated JSON object
   * @returns {object}            The JSON for the command item
   */
  public command(
    id: string,
    content: string,
    action: () => void,
    other: object = {}
  ): object {
    return Object.assign({ type: 'command', id, content, action }, other);
  }

  /**
   * Create JSON for a checkbox item
   *
   * @param {string} id           The id for the item
   * @param {string} content      The content for the item
   * @param {string} variable     The (pool) variable to attach to this checkbox
   * @param {object} other        Other values to include in the generated JSON object
   * @returns {object}            The JSON for the checkbox item
   */
  public checkbox(
    id: string,
    content: string,
    variable: string,
    other: object = {}
  ): object {
    return Object.assign({ type: 'checkbox', id, content, variable }, other);
  }

  /**
   * Create JSON for a group of connected radio buttons
   *
   * @param {string} variable     The (pool) variable to attach to each radio button
   * @param {string[][]} radios   An array of [string] or [string, string], giving the id and content
   *                                for each radio button (if only one string is given it is used for both)
   * @returns {object[]}          An array of JSON objects for radion buttons
   */
  public radioGroup(variable: string, radios: string[][]): object[] {
    return radios.map((def) => this.radio(def[0], def[1] || def[0], variable));
  }

  /**
   * Create JSON for a radio button item
   *
   * @param {string} id           The id for the item
   * @param {string} content      The content for the item
   * @param {string} variable     The (pool) variable to attach to this radio button
   * @param {object} other        Other values to include in the generated JSON object
   * @returns {object}            The JSON for the radio button item
   */
  public radio(
    id: string,
    content: string,
    variable: string,
    other: object = {}
  ): object {
    return Object.assign({ type: 'radio', id, content, variable }, other);
  }

  /**
   * Create JSON for a label item
   *
   * @param {string} id           The id for the item
   * @param {string} content      The content for the item
   * @returns {object}            The JSON for the label item
   */
  public label(id: string, content: string): object {
    return { type: 'label', id, content };
  }

  /**
   * Create JSON for a menu rule
   *
   * @returns {object}            The JSON for the rule item
   */
  public rule(): object {
    return { type: 'rule' };
  }

  /*======================================================================*/
}
