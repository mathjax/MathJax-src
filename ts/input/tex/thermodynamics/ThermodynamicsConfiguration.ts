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
 * @file Configuration file for the thermodynamics package.
 *
 * @author kaiserkarl31@yahoo.com (Karl D. Hammond)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import './ThermodynamicsMappings.js';
//import { ThermodynamicsSetPartialDelimiters} from './ThermodynamicsMethods.js';

export const ThermodynamicsConfiguration = Configuration.create('thermodynamics', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.MACRO]: ['Thermodynamics-macros'],
    [HandlerType.ENVIRONMENT]: ['Thermodynamics-environments'],
  },
  [ConfigurationType.OPTIONS]: {
    thermodynamics: {
//      'intensive-plain' : true,
//      'extensive-plain' : false,
//      'extensive-superscript' : false,
//      'intensive-lowercase' : false,
//      thermolongpm : true,
//      thermoshortpm : false,
      Partialdelimiters : {
        open: '(',
        close: ')',
        emptyclose: ')',
      },
      parentheses : () => {
        this.Partialdelimiters.open='(';
        this.Partialdelimiters.close=')';
        this.Partialdelimiters.emptyclose=')';
      },
//      brackets : false,
//      bar : false,
//      'plain-derivatives' : false,
//      'subscripts' : true,
//      'nosubscripts' : false,
//      'moles-index' : true,
//      'moles-range' : false,
//      'Bejan' : false,
//      'CBK' : false,
//      'ElliottLira' : false,
//      'KlotzRosenberg' : false,
//      'Koretsky' : false,
//      'ModellReid' : false,
//      'MSBB' : false,
//      'Prausnitz' : false,
//      'Sandler' : false,
//      'SVNAS' : false,
//      'TesterModell' : false,
//      'Thompson' : false,
    },
  },
});
