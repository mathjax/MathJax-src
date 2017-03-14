import {PropertyList, Property} from './Node';

export const INHERIT = "_inherit_";

export class Attributes {
    protected attributes: PropertyList;
    protected inherited: PropertyList;
    protected defaults: PropertyList;
    protected global: PropertyList;

    constructor(defaults: PropertyList, global: PropertyList) {
        this.defaults = defaults;
        this.inherited = Object.create(defaults);
        this.attributes = Object.create(this.inherited);
        this.global = global;
    }

    set(name: string, value: Property) {this.attributes[name] = value}
    setList(list: PropertyList) {Object.assign(this.attributes, list)}
    get(name: string) {
        let value = this.attributes[name];
        if (value === INHERIT) value = this.global[name];
        return value;
    }
    getExplicit(name: string) {
        if (!(name in this.attributes)) return null;
        return this.attributes[name];
    }
    getList(...names: string[]) {
        let values: PropertyList = {};
        for (const name of names) {
            values[name] = this.get(name);
        }
        return values;
    }

    setInherited(name: string, value: Property) {this.inherited[name] = value}
    getInherited(name: string) {return this.inherited[name]}

    getDefault(name: string) {return this.defaults[name]}
    hasDefault(name: string) {return (name in this.defaults)}

    getExplicitNames()  {return Object.keys(this.attributes)}
    getInheritedNames() {return Object.keys(this.inherited)}
    getDefaultNames()   {return Object.keys(this.defaults)}
    getGlobalNames()    {return Object.keys(this.global)}

    getAllAttributes() {return this.attributes}
    getAllInherited()  {return this.inherited}
    getAllDefaults()   {return this.defaults}

}
