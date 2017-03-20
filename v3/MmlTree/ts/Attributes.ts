/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview Implements Attribute class for MmlNodes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList, Property} from './Node';

/*
 * A constant for when a property shoudl be inherited from the global defaults lists
 */
export const INHERIT = '_inherit_';

/******************************************************************/
/*
 * Implements the Attributes class for MmlNodes
 *  (These can be set explicitly, inherited from parent nodes,
 *   taken from a default list of values, or taken from global
 *   defaults.)
 */

export class Attributes {
    protected attributes: PropertyList;
    protected inherited: PropertyList;
    protected defaults: PropertyList;
    protected global: PropertyList;

    /*
     * @param {PropertyList} defaults  The defaults for this node type
     * @param {PropertyList} global  The global properties (from the math node)
     *
     * @constructor
     */
    constructor(defaults: PropertyList, global: PropertyList) {
        this.defaults = defaults;
        this.inherited = Object.create(defaults);
        this.attributes = Object.create(this.inherited);
        this.global = global;
    }

    /*
     * @param {string} name  The name of the attribute to set
     * @param {Property} value  The value to give the named attribute
     */
    public set(name: string, value: Property) {
        this.attributes[name] = value;
    }

    /*
     * @param {PropertyList} list  An object containing the properties to set
     */
    public setList(list: PropertyList) {
        Object.assign(this.attributes, list);
    }

    /*
     * @param {string} name  The name of the attribute whose value is to be returned
     * @return {Property}  The value of the named attribute (including inheritance and defaults)
     */
    public get(name: string) {
        let value = this.attributes[name];
        if (value === INHERIT) {
            value = this.global[name];
        }
        return value;
    }

    /*
     * @param {string} name  The value of the attribute whose value is to be returned
     * @return {Property}  The attribute whse name was given if it is explicit on the
     *                      node (not inherited or defaulted), null otherwise
     */
    public getExplicit(name: string) {
        if (!(name in this.attributes)) {
            return null;
        }
        return this.attributes[name];
    }

    /*
     * @param {string[]} names  The names of attributes whose values are to be returned
     * @return {PropertyList}  On object containing the attributes and their values
     */
    public getList(...names: string[]) {
        let values: PropertyList = {};
        for (const name of names) {
            values[name] = this.get(name);
        }
        return values;
    }

    /*
     * @param {string} name  The name of an inherited attribute to be set
     * @param {Property} value  The value to assign to the named attribute
     */
    public setInherited(name: string, value: Property) {
        this.inherited[name] = value;
    }

    /*
     * @param {string} name  The name of an inherited attribute whose value is to be returned
     * @return {Property}  THe value of the named attribute if it is inherited, null otherwise
     */
    public getInherited(name: string) {
        return this.inherited[name];
    }

    /*
     * @param {string} name  The name of a default attribute whose value is to be returned
     * @return {Property}  THe value of the named attribute if a default exists for it, null otherwise
     */
    public getDefault(name: string) {
        return this.defaults[name];
    }

    /*
     * @param {string} name  The name of an attribute to test for the existance of a default
     * @return {boolean}  True of there is a default for the named attribute, false otherwise
     */
    public hasDefault(name: string) {
        return (name in this.defaults);
    }

    /*
     * @return {string[]}  The names of all the attributes explicitly set on the node
     */
    public getExplicitNames() {
        return Object.keys(this.attributes);
    }

    /*
     * @return {string[]}  The names of all the inherited attributes for the node
     */
    public getInheritedNames() {
        return Object.keys(this.inherited);
    }

    /*
     * @return {string[]}  The names of all the default attributes for the node
     */
    public getDefaultNames() {
        return Object.keys(this.defaults);
    }

    /*
     * @return {string[]}  The names of all the global attributes
     */
    public getGlobalNames() {
        return Object.keys(this.global);
    }


    /*
     * @return {PropertyList}  The attribute object
     */
    public getAllAttributes() {
        return this.attributes;
    }

    /*
     * @return {PropertyList}  The attribute object
     */
    public getAllInherited() {
        return this.inherited;
    }

    /*
     * @return {PropertyList}  The attribute object
     */
    public getAllDefaults() {
        return this.defaults;
    }

}
