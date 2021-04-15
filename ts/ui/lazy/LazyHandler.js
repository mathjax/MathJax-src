"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistiveMmlHandler = exports.AssistiveMmlMathDocumentMixin = exports.AssistiveMmlMathItemMixin = exports.LimitedMmlVisitor = void 0;
var MathItem_js_1 = require("../core/MathItem.js");
var SerializedMmlVisitor_js_1 = require("../core/MmlTree/SerializedMmlVisitor.js");
var Options_js_1 = require("../util/Options.js");
/*==========================================================================*/
var LimitedMmlVisitor = /** @class */ (function (_super) {
    __extends(LimitedMmlVisitor, _super);
    function LimitedMmlVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @override
     */
    LimitedMmlVisitor.prototype.getAttributes = function (node) {
        /**
         * Remove id from attribute output
         */
        return _super.prototype.getAttributes.call(this, node).replace(/ ?id=".*?"/, '');
    };
    return LimitedMmlVisitor;
}(SerializedMmlVisitor_js_1.SerializedMmlVisitor));
exports.LimitedMmlVisitor = LimitedMmlVisitor;
/*==========================================================================*/
/**
 * Add STATE value for having assistive MathML (after TYPESETTING)
 */
MathItem_js_1.newState('ASSISTIVEMML', 153);
/**
 * The mixin for adding assistive MathML to MathItems
 *
 * @param {B} BaseMathItem      The MathItem class to be extended
 * @return {AssistiveMathItem}  The augmented MathItem class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathItem class to extend
 */
function AssistiveMmlMathItemMixin(BaseMathItem) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @param {MathDocument} document   The MathDocument for the MathItem
         * @param {boolean} force           True to force assistive MathML evenif enableAssistiveMml is false
         */
        class_1.prototype.assistiveMml = function (document, force) {
            if (force === void 0) { force = false; }
            if (this.state() >= MathItem_js_1.STATE.ASSISTIVEMML)
                return;
            if (!this.isEscaped && (document.options.enableAssistiveMml || force)) {
                var adaptor = document.adaptor;
                //
                // Get the serialized MathML
                //
                var mml = document.toMML(this.root).replace(/\n */g, '').replace(/<!--.*?-->/g, '');
                //
                // Parse is as HTML and retrieve the <math> element
                //
                var mmlNodes = adaptor.firstChild(adaptor.body(adaptor.parse(mml, 'text/html')));
                //
                // Create a container for the hidden MathML
                //
                var node = adaptor.node('mjx-assistive-mml', {
                    unselectable: 'on', display: (this.display ? 'block' : 'inline')
                }, [mmlNodes]);
                //
                // Hide the typeset math from assistive technology and append the MathML that is visually
                //   hidden from other users
                //
                adaptor.setAttribute(adaptor.firstChild(this.typesetRoot), 'aria-hidden', 'true');
                adaptor.setStyle(this.typesetRoot, 'position', 'relative');
                adaptor.append(this.typesetRoot, node);
            }
            this.state(MathItem_js_1.STATE.ASSISTIVEMML);
        };
        return class_1;
    }(BaseMathItem));
}
exports.AssistiveMmlMathItemMixin = AssistiveMmlMathItemMixin;
/**
 * The mixin for adding assistive MathML to MathDocuments
 *
 * @param {B} BaseDocument         The MathDocument class to be extended
 * @return {AssistiveMmlMathDocument}  The Assistive MathML MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathDocument class to extend
 */
function AssistiveMmlMathDocumentMixin(BaseDocument) {
    var _a;
    return _a = /** @class */ (function (_super) {
            __extends(BaseClass, _super);
            /**
             * Augment the MathItem class used for this MathDocument, and create the serialization visitor.
             *
             * @override
             * @constructor
             */
            function BaseClass() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, args) || this;
                var CLASS = _this.constructor;
                var ProcessBits = CLASS.ProcessBits;
                if (!ProcessBits.has('assistive-mml')) {
                    ProcessBits.allocate('assistive-mml');
                }
                _this.visitor = new LimitedMmlVisitor(_this.mmlFactory);
                _this.options.MathItem =
                    AssistiveMmlMathItemMixin(_this.options.MathItem);
                if ('addStyles' in _this) {
                    _this.addStyles(CLASS.assistiveStyles);
                }
                return _this;
            }
            /**
             * @param {MmlNode} node   The node to be serializes
             * @return {string}        The serialization of the node
             */
            BaseClass.prototype.toMML = function (node) {
                return this.visitor.visitTree(node);
            };
            /**
             * Add assistive MathML to the MathItems in this MathDocument
             */
            BaseClass.prototype.assistiveMml = function () {
                if (!this.processed.isSet('assistive-mml')) {
                    for (var _i = 0, _a = this.math; _i < _a.length; _i++) {
                        var math = _a[_i];
                        math.assistiveMml(this);
                    }
                    this.processed.set('assistive-mml');
                }
                return this;
            };
            /**
             * @override
             */
            BaseClass.prototype.state = function (state, restore) {
                if (restore === void 0) { restore = false; }
                _super.prototype.state.call(this, state, restore);
                if (state < MathItem_js_1.STATE.ASSISTIVEMML) {
                    this.processed.clear('assistive-mml');
                }
                return this;
            };
            return BaseClass;
        }(BaseDocument)),
        /**
         * @override
         */
        _a.OPTIONS = __assign(__assign({}, BaseDocument.OPTIONS), { enableAssistiveMml: true, renderActions: Options_js_1.expandable(__assign(__assign({}, BaseDocument.OPTIONS.renderActions), { assistiveMml: [MathItem_js_1.STATE.ASSISTIVEMML] })) }),
        /**
         * styles needed for the hidden MathML
         */
        _a.assistiveStyles = {
            'mjx-assistive-mml': {
                position: 'absolute !important',
                top: '0px', left: '0px',
                clip: 'rect(1px, 1px, 1px, 1px)',
                padding: '1px 0px 0px 0px !important',
                border: '0px !important',
                display: 'block !important',
                width: 'auto !important',
                overflow: 'hidden !important',
                /*
                 *  Don't allow the assistive MathML to become part of the selection
                 */
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none'
            },
            'mjx-assistive-mml[display="block"]': {
                width: '100% !important'
            }
        },
        _a;
}
exports.AssistiveMmlMathDocumentMixin = AssistiveMmlMathDocumentMixin;
/*==========================================================================*/
/**
 * Add assitive MathML support a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @return {Handler}          The handler that was modified (for purposes of chainging extensions)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
function AssistiveMmlHandler(handler) {
    handler.documentClass =
        AssistiveMmlMathDocumentMixin(handler.documentClass);
    return handler;
}
exports.AssistiveMmlHandler = AssistiveMmlHandler;
