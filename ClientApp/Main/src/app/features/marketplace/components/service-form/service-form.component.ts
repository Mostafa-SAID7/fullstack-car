import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Service Form</h1>
      <div class="placeholder">
        <i class="fas fa-wrench"></i>
        <p>Service form will be implemented here</p>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; text-align: center; }
    .placeholder { padding: 3rem; color: #6b7280; }
    .placeholder i { font-size: 3rem; margin-bottom: 1rem; }
  `]
})
export class ServiceFormComponent implements OnInit {
  ngOnInit(): void {}
}