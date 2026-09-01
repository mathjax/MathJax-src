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
 * @file  The data attribute strings for the explorer
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/**
 * The attributes for various markers
 */
export const HILITE = {
  ENCLOSED: 'data-sre-enclosed',
  BBOX: 'data-sre-highlighter-bbox',
  ADDED: 'data-sre-highlighter-added',
  PREFIX: 'data-sre-highlight-',
};

/**
 * The attributes used on clones during magnification
 */
export const MAG = {
  CLONE: 'data-mjx-clone',
  CONTAINER: 'data-mjx-clone-container',
};

/**
 * The attribute used for saving HREF attributes during exploration
 */
export const SAVED_HREF = 'data-mjx-href';
