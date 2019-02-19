import {MathItem} from '../../core/MathItem.js';
import '../../../../context-menu/scripts/js/context_menu.js';

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

    public post(x?:any, y?: number) {
        if (this.mathItem) {
            // FIXME:  look for annotations
            // FIXME:  handle error output jax
            const input = this.mathItem.inputJax.name;
            const original = this.findID('Show', 'Original');
            original.content = (input === 'MathML' ? 'Original MathML' : input + ' Commands');
            const clipboard = this.findID('Copy', 'Original');
            clipboard.content = original.content;
            const semantics = this.findID('Settings', 'semantics');
            input === 'MathML' ? semantics.disable() : semantics.enable();
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

}

