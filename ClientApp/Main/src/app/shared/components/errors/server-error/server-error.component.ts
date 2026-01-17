import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-server-error',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './server-error.component.html'
})
export class ServerErrorComponent {
    refresh() {
        window.location.reload();
    }
}
