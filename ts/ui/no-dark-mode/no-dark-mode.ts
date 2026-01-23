/*************************************************************
 *
 *  Copyright (c) 2026 The MathJax Consortium
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
 * @file  An extension to disable dark mode for sites that don't support that
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MathJax } from '../../components/global.js';
import { MathJaxObject } from '../../components/startup.js';
import { AbstractHandler } from '../../core/Handler.js';

[
  [
    MathJax._.ui?.dialog,
    'core',
    () => {
      const { DraggableDialog } = MathJax._.ui.dialog.DraggableDialog;
      delete DraggableDialog.styles['@media (prefers-color-scheme: dark)'];
    },
  ],

  [
    MathJax._.a11y?.explorer,
    'a11y/explorer',
    () => {
      const Region = MathJax._.a11y.explorer.Region;
      for (const region of ['LiveRegion', 'HoverRegion', 'ToolTip']) {
        Region[region].style.styles['@media (prefers-color-scheme: dark)'] = {};
      }
      Region.LiveRegion.style.styles['@media (prefers-color-scheme: dark)'][
        'mjx-ignore'
      ] = { ignore: 1 };
      (MathJax as MathJaxObject).startup.extendHandler(
        (handler: AbstractHandler<any, any, any>) => {
          delete (handler.documentClass as any).speechStyles[
            '@media (prefers-color-scheme: dark) /* explorer */'
          ];
          return handler;
        }
      );
    },
  ],

  [
    MathJax._.output?.chtml,
    'output/chtml',
    () => {
      const { CHTML } = MathJax._.output.chtml_ts;
      delete CHTML.commonStyles['@media (prefers-color-scheme: dark)'];
      const { ChtmlMaction } = MathJax._.output.chtml.Wrappers.maction;
      delete ChtmlMaction.styles[
        '@media (prefers-color-scheme: dark) /* chtml maction */'
      ];
    },
  ],

  [
    MathJax._.output?.svg,
    'output/svg',
    () => {
      const { SVG } = MathJax._.output.svg_ts;
      delete SVG.commonStyles['@media (prefers-color-scheme: dark)'];
      const { SvgMaction } = MathJax._.output.svg.Wrappers.maction;
      delete SvgMaction.styles[
        '@media (prefers-color-scheme: dark) /* svg maction */'
      ];
    },
  ],
].forEach(([immediate, extension, ready]) => {
  if (immediate) {
    ready();
  } else {
    const config = MathJax.config.loader;
    config[extension] ??= {};
    const check = config[extension].checkReady;
    config[extension].checkReady = async () => {
      if (check) await check();
      return ready();
    };
  }
});
