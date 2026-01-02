import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort',
    standalone: true
})
export class SortPipe implements PipeTransform {
    transform(items: any[], field: string, reverse: boolean = false): any[] {
        if (!items || !field) return items;

        const sorted = [...items].sort((a, b) => {
            const valA = a[field];
            const valB = b[field];

            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });

        return reverse ? sorted.reverse() : sorted;
    }
}
