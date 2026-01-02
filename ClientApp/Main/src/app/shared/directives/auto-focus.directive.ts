import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appAutoFocus]',
    standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
    @Input() appAutoFocus = true;

    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        if (this.appAutoFocus) {
            setTimeout(() => {
                this.el.nativeElement.focus();
            }, 0);
        }
    }
}
