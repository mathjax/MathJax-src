/*************************************************************
 *
 *  Copyright (c) 2019 The MathJax Consortium
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
 * @fileoverview  Implements the FontCache object for SVG output
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVG} from '../svg.js';

export class FontCache<N, T, D> {

    protected jax: SVG<N, T, D>;

    protected cache: Map<string, string> = new Map();
    protected defs: N = null;

    protected localID: string = '';
    protected nextID: number = 0;

    constructor(jax: SVG<N, T, D>) {
        this.jax = jax;
    }

    public cachePath(variant: string, C: string, path: string) {
        const id = 'MJX-' + this.localID + (this.jax.font.getVariant(variant).cacheID || '') + '-' + C;
        if (!this.cache.has(id)) {
            this.cache.set(id, path);
            this.jax.adaptor.append(this.defs, this.jax.svg('path', {id: id, d: path}));
        }
        return id;
    }

    public clearLocalID() {
        this.localID = '';
    }

    public useLocalID(id: string = null) {
        this.localID = (id == null ? ++this.nextID : id) + (id === '' ? '' : '-');
    }

    public clearCache() {
        this.cache = new Map();
        this.defs = this.jax.svg('defs');
    }

    public getCache() {
        return this.defs;
    }

}
