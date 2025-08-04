/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file Configuration file for the AMScd package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import './AmsCdMappings.js';

export const AmsCdConfiguration = Configuration.create('amscd', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.CHARACTER]: ['amscd_special'],
    [HandlerType.MACRO]: ['amscd_macros'],
    [HandlerType.ENVIRONMENT]: ['amscd_environment'],
  },
  [ConfigurationType.OPTIONS]: {
    amscd: {
      colspace: '5pt',
      rowspace: '5pt',
      harrowsize: '2.75em',
      varrowsize: '1.75em',
      hideHorizontalLabels: false,
    },
  },
});
