import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ai-agent-dashboard',
  template: `
    <div class="ai-dashboard">
      <div class="dashboard-header">
        <h1>AI Assistant Dashboard</h1>
        <p>Your intelligent car community companion</p>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card" routerLink="/ai-agent/chat">
          <mat-icon>chat</mat-icon>
          <h3>AI Chat</h3>
          <p>Ask questions about cars, maintenance, and more</p>
        </div>

        <div class="dashboard-card" routerLink="/ai-agent/recommendations">
          <mat-icon>recommend</mat-icon>
          <h3>Car Recommendations</h3>
          <p>Get personalized car suggestions based on your needs</p>
        </div>

        <div class="dashboard-card" routerLink="/ai-agent/maintenance">
          <mat-icon>build</mat-icon>
          <h3>Maintenance Assistant</h3>
          <p>Smart maintenance scheduling and reminders</p>
        </div>

        <div class="dashboard-card" routerLink="/ai-agent/price-analysis">
          <mat-icon>analytics</mat-icon>
          <h3>Price Analysis</h3>
          <p>Market analysis for buying and selling cars</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./ai-agent-dashboard.component.scss']
})
export class AiAgentDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}