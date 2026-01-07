import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marketplace-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './marketplace-dashboard.component.html',
  styleUrls: ['./marketplace-dashboard.component.scss']
})
export class MarketplaceDashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  navigateToServices(): void {
    this.router.navigate(['/marketplace/services']);
  }

  navigateToProviders(): void {
    this.router.navigate(['/marketplace/providers']);
  }

  navigateToBookings(): void {
    this.router.navigate(['/marketplace/bookings']);
  }
}