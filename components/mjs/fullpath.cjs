/*************************************************************
 *
 *  Copyright (c) 2023-2025 The MathJax Consortium
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
 * Gets the fully resolved path from a webpack request object using the
 * correct package.json file to map pseudo-packages to the mjs/cjs directories.
 * When this file is in the components/cjs directory, it will use the
 * package.json in that directory, which maps them to the @mathjax/src/cjs files.
 * When in the components/mjs directory, the main package.json file will be used.
 */

let path = require('path');

/**
 * @param {object} resource  The module resource object from webpack
 * @return {string}  The full path to the module
 */
function fullPath(resource) {
  const file = resource.request ?
        (resource.request.charAt(0) === '.' ?
         path.resolve(resource.path, resource.request) :
         resource.request) :
        resource.path;
  return file.charAt(0) === '/' ? file : require.resolve(file);
}

module.exports.fullPath = fullPath;
