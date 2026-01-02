import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-provider-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Service Provider Details</h1>
      <div class="placeholder">
        <i class="fas fa-store"></i>
        <p>Service provider details will be implemented here</p>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; text-align: center; }
    .placeholder { padding: 3rem; color: #6b7280; }
    .placeholder i { font-size: 3rem; margin-bottom: 1rem; }
  `]
})
export class ServiceProviderDetailComponent implements OnInit {
  ngOnInit(): void {}
}