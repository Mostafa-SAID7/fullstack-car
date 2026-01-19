import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Location {
  id: string;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
}

export enum LocationType {
  Dealership = 'dealership',
  ServiceCenter = 'service_center',
  CarWash = 'car_wash',
  GasStation = 'gas_station',
  ParkingLot = 'parking_lot',
  ChargingStation = 'charging_station',
  AutoParts = 'auto_parts',
  Other = 'other'
}

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ location().name }}</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-2">{{ location().address }}</p>
      <span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">{{ location().type }}</span>
    </div>
  `
})
export class LocationCardComponent {
  location = input.required<Location>();
}