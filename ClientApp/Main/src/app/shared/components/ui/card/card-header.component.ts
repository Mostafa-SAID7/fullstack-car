import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-card-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card-header.component.html',
    styleUrls: ['./card-header.component.scss']
})
export class CardHeaderComponent { }
