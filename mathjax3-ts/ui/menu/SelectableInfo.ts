import '../../../../context-menu/scripts/js/context_menu.js';

export class SelectableInfo extends ContextMenu.Info {

    public addEvents(element: HTMLElement) {
        element.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
                this.selectAll();
                this.stop(event);
            }
        });
    }

    public selectAll() {
        const selection = document.getSelection();
        selection.selectAllChildren(this.getHtml().querySelector('pre'));
    }

    public copyToClipboard() {
        this.selectAll();
        document.execCommand('copy');
        document.getSelection().removeAllRanges();
    }

    public generateHtml() {
        super.generateHtml();
        const button = this.getHtml().querySelector('input');
        button.addEventListener('click', (event: MouseEvent) => this.copyToClipboard());
    }

}
