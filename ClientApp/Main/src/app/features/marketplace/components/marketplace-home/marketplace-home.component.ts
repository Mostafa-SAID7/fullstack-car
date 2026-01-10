import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { CarService, ServiceType } from '../../models/marketplace.model';

@Component({
    selector: 'app-marketplace-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './marketplace-home.component.html'
})
export class MarketplaceHomeComponent implements OnInit {
    featuredServices: CarService[] = [];
    categories = [
        { type: ServiceType.Maintenance, icon: 'fa-tools', count: 12 },
        { type: ServiceType.Repair, icon: 'fa-wrench', count: 8 },
        { type: ServiceType.Emergency, icon: 'fa-ambulance', count: 5 },
        { type: ServiceType.Inspection, icon: 'fa-clipboard-check', count: 15 },
        { type: ServiceType.Cleaning, icon: 'fa-shining', count: 10 },
        { type: ServiceType.Towing, icon: 'fa-truck-pickup', count: 3 }
    ];
    loading = true;

    constructor(private marketplaceService: MarketplaceService) { }

    ngOnInit(): void {
        this.loadFeaturedServices();
    }

    loadFeaturedServices(): void {
        this.loading = true;
        this.marketplaceService.getServices(undefined, 1, 6).subscribe({
            next: (response) => {
                if (response.success) {
                    this.featuredServices = response.data.items;
                }
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading featured services:', error);
                this.loading = false;
            }
        });
    }

    getServiceTypeLabel(type: ServiceType): string {
        return type.replace(/([A-Z])/g, ' $1').trim();
    }
}
