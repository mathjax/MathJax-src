import {MathItem} from '../../core/MathItem.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import '../../../../context-menu/scripts/js/context_menu.js';
import {SelectableInfo} from './SelectableInfo.js';

export type MenuJSON = {menu: {pool: Array<Object>, items: Array<Object>, id: string}};
export type PoolItem = {name: string, getter: () => string | boolean, setter: (x: (string | boolean)) => void};

export class MJContextMenu<N, T, D> extends ContextMenu.ContextMenu {

    public static parse({menu}: MenuJSON): ContextMenu.ContextMenu {
        if (!menu) {
            ContextMenu.MenuUtil.error(null, 'Wrong JSON format for menu.');
            return;
        }
        const {pool, items, id} = menu;
        const ctxtMenu = new this();
        const menuPool = ctxtMenu.getPool();
        pool.forEach(({name, getter, setter}: PoolItem) => {
            menuPool.insert(new ContextMenu.Variable(name, getter, setter));
        });
        ctxtMenu.parseItems(items);
        return ctxtMenu;
    }

    public mathItem: MathItem<N, T, D> = null;

    public annotation: string = '';

    public showAnnotation: SelectableInfo;
    public copyAnnotation: () => void;

    public annotationTypes: {[type: string]: string[]} = {};

    public post(x?:any, y?: number) {
        if (this.mathItem) {
            if (y !== undefined) {
                // FIXME:  handle error output jax
                const input = this.mathItem.inputJax.name;
                const original = this.findID('Show', 'Original');
                original.content = (input === 'MathML' ? 'Original MathML' : input + ' Commands');
                const clipboard = this.findID('Copy', 'Original');
                clipboard.content = original.content;
                const semantics = this.findID('Settings', 'semantics');
                input === 'MathML' ? semantics.disable() : semantics.enable();
                this.getAnnotationMenu();
            }
            super.post(x, y);
        }
    }

    public unpost() {
        super.unpost();
        this.mathItem = null;
    }

    public findID(...names: string[]) {
        let menu = this as ContextMenu.Menu;
        let item = null as ContextMenu.Item;
        for (const name of names) {
            if (menu) {
                item = menu.find(name);
                menu = (item instanceof ContextMenu.Submenu ? item.getSubmenu() : null);
            } else {
                item = null;
            }
        }
        return item;
    }

    protected getAnnotationMenu() {
        const annotations = this.getAnnotations(this.getSemanticNode());
        this.createAnnotationMenu('Show', annotations, () => this.showAnnotation.post());
        this.createAnnotationMenu('Copy', annotations, () => this.copyAnnotation());
    }

    protected getSemanticNode() {
        let node: MmlNode = this.mathItem.root;
        while (node && !node.isKind('semantics'))  {
            if (node.isToken || node.childNodes.length !== 1) return;
            node = node.childNodes[0] as MmlNode;
        }
        return node;
    }

    protected getAnnotations(node: MmlNode) {
        const annotations = [] as [string, string][];
        if (!node) return annotations;
        for (const child of node.childNodes as MmlNode[]) {
            if (child.isKind('annotation')) {
                const match = this.annotationMatch(child);
                if (match) {
                    const value = child.childNodes.reduce((text, chars) => text + chars.toString(), '');
                    annotations.push([match, value]);
                }
            }
        }
        return annotations;
    }

    protected annotationMatch(child: MmlNode) {
        const encoding = child.attributes.get('encoding') as string;
        for (const type of Object.keys(this.annotationTypes)) {
            if (this.annotationTypes[type].indexOf(encoding) >= 0) {
                return type;
            }
        }
        return null;
    }

    protected createAnnotationMenu(id: string, annotations: [string, string][], action: () => void) {
        const menu = this.findID(id, 'Annotation') as ContextMenu.Submenu;
        menu.setSubmenu(ContextMenu.SubMenu.parse({
            items: annotations.map(([type, value]) => {
                return {
                    type: 'command',
                    id: type,
                    content: type,
                    action: () => {
                        this.annotation = value;
                        action();
                    }
                };
            }),
            id: 'annotations'
        }, menu));
        if (annotations.length) {
            menu.enable();
        } else {
            menu.disable();
        }
    }

}

