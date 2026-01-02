import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({
    selector: '[appLazyLoad]',
    standalone: true
})
export class LazyLoadDirective implements OnInit, OnDestroy {
    private observer?: IntersectionObserver;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = this.el.nativeElement as HTMLImageElement;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                    }
                    this.observer?.unobserve(this.el.nativeElement);
                }
            });
        });

        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
