import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-provider-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Service Providers</h1>
      <p>Find trusted automotive service providers in your area</p>
      <div class="placeholder">
        <i class="fas fa-store"></i>
        <p>Service provider list will be implemented here</p>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; text-align: center; }
    .placeholder { padding: 3rem; color: #6b7280; }
    .placeholder i { font-size: 3rem; margin-bottom: 1rem; }
  `]
})
export class ServiceProviderListComponent implements OnInit {
  ngOnInit(): void {}
}