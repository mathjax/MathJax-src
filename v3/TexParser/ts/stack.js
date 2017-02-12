/*************************************************************
 *
 *  Copyright (c) 2015-2017 The MathJax Consortium
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
"use strict";
/**
 * @fileoverview The parsing stack.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */
var Stack = (function () {
    function Stack(env, inner, start, transform, test) {
        // TODO: Refine this type. Not quite sure yet to what...
        this.global = {};
        // TODO: Refine this type to stack items.
        this.data = [];
        // TODO: Refine this type to environments.
        this.env = {};
        this.global = { isInner: inner };
        this.data = [start(this.global)];
        if (env) {
            this.data[0].env = env;
        }
        this.env = this.data[0].env;
        this.transformMML = transform;
        this.testStackItem = test;
    }
    // TODO: Capitalised methods are temporary and will be removed!
    // This should be rewritten to rest arguments!
    Stack.prototype.Push = function (item) {
        this.push(item);
    };
    Stack.prototype.push = function (item) {
        if (!item)
            return;
        item = this.transformMML(item);
        item.global = this.global;
        var top = (this.data.length ? this.top().checkItem(item) : true);
        // TODO: Can we model this with a multi-stackitem?
        if (top instanceof Array) {
            this.pop();
            for (var _i = 0, top_1 = top; _i < top_1.length; _i++) {
                var it = top_1[_i];
                this.push(it);
            }
        }
        else if (this.testStackItem(top)) {
            this.pop();
            this.push(top);
        }
        else if (top) {
            this.data.push(item);
            if (item.env) {
                for (var id in this.env) {
                    if (this.env.hasOwnProperty(id)) {
                        item.env[id] = this.env[id];
                    }
                }
                this.env = item.env;
            }
            else {
                item.env = this.env;
            }
        }
    };
    Stack.prototype.Pop = function () {
        return this.Pop();
    };
    Stack.prototype.pop = function () {
        var item = this.data.pop();
        if (!item.isOpen) {
            delete item.env;
        }
        this.env = (this.data.length ? this.top().env : {});
        return item;
    };
    Stack.prototype.Top = function (n) {
        return this.top(n);
    };
    Stack.prototype.top = function (n) {
        if (n == null) {
            n = 1;
        }
        if (this.data.length < n) {
            return null;
        }
        return this.data[this.data.length - n];
    };
    Stack.prototype.Prev = function (noPop) {
        return this.prev(noPop);
    };
    Stack.prototype.prev = function (noPop) {
        var top = this.top();
        if (noPop) {
            return top.data[top.data.length - 1];
        }
        return top.Pop();
    };
    /**
     * @override
     */
    Stack.prototype.toString = function () {
        return "stack[\n  " + this.data.join("\n  ") + "\n]";
    };
    return Stack;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stack;
