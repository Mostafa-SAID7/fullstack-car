import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[appCopyToClipboard]',
    standalone: true
})
export class CopyToClipboardDirective {
    @Input('appCopyToClipboard') textToCopy = '';
    @Output() copied = new EventEmitter<boolean>();

    @HostListener('click')
    async onClick() {
        if (!this.textToCopy) return;

        try {
            await navigator.clipboard.writeText(this.textToCopy);
            this.copied.emit(true);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            this.copied.emit(false);
        }
    }
}
