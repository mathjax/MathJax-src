/*************************************************************
 *
 *  Copyright (c) 2024-2025 The MathJax Consortium
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
 * @file  Provides the browser window and document values
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

declare const process: { platform: string };

/**
 * True if there is a window object
 */
export const hasWindow = typeof window !== 'undefined';

/**
 * The browsers window and document objects, if any
 */
export const context = {
  window: hasWindow ? window : null,
  document: hasWindow ? window.document : null,
  os: (() => {
    if (hasWindow && window.navigator) {
      const app = window.navigator.appVersion;
      const osNames = [
        ['Win', 'Windows'],
        ['Mac', 'MacOS'],
        ['X11', 'Unix'],
        ['Linux', 'Unix'],
      ];
      for (const [key, os] of osNames) {
        if (app.includes(key)) {
          return os;
        }
      }
      if (window.navigator.userAgent.includes('Android')) {
        return 'Unix';
      }
    } else if (typeof process !== 'undefined') {
      return (
        {
          linux: 'Unix',
          android: 'Unix',
          aix: 'Unix',
          freebsd: 'Unix',
          netbsd: 'Unix',
          openbsd: 'Unix',
          sunos: 'Unix',
          darwin: 'MacOS',
          win32: 'Windows',
          cygwin: 'Windows',
        }[process.platform] || process.platform
      );
    }
    return 'unknown';
  })(),
  path: (file: string) => file,
};

if (context.os === 'Windows') {
  context.path = (file: string) =>
    file.match(/^[/\\]?[a-zA-Z]:[/\\]/)
      ? file.replace(/\\/g, '/').replace(/^\//, '')
      : file;
}
