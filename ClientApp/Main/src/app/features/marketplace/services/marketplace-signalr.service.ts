/**
 * Marketplace SignalR Service
 * Handles real-time updates for marketplace features (Products and Services)
 * Integrates with the core SignalR service
 */

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { SignalRService } from '../../../core/services/signalr.service';
import { ProductDto, ServiceDto } from '../models';
import * as signalR from '@microsoft/signalr';

/**
 * Marketplace event types
 */
export interface MarketplaceEvents {
  // Product events
  ProductCreated: ProductDto;
  ProductUpdated: ProductDto;
  ProductDeleted: string;
  ProductPriceChanged: { id: string, oldPrice: number, newPrice: number };

  // Service events
  ServiceCreated: ServiceDto;
  ServiceUpdated: ServiceDto;
  ServiceDeleted: string;
  ServiceStatusChanged: { id: string, status: string };
}

@Injectable({
  providedIn: 'root'
})
export class MarketplaceSignalRService implements OnDestroy {
  // Product Subjects
  private productCreatedSubject = new Subject<ProductDto>();
  private productUpdatedSubject = new Subject<ProductDto>();
  private productDeletedSubject = new Subject<string>();
  private priceChangedSubject = new Subject<{ id: string, oldPrice: number, newPrice: number }>();

  // Service Subjects
  private serviceCreatedSubject = new Subject<ServiceDto>();
  private serviceUpdatedSubject = new Subject<ServiceDto>();
  private serviceDeletedSubject = new Subject<string>();
  private serviceStatusSubject = new Subject<{ id: string, status: string }>();

  // Connection status
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  // Public Observables
  productCreated$ = this.productCreatedSubject.asObservable();
  productUpdated$ = this.productUpdatedSubject.asObservable();
  productDeleted$ = this.productDeletedSubject.asObservable();
  priceChanged$ = this.priceChangedSubject.asObservable();

  serviceCreated$ = this.serviceCreatedSubject.asObservable();
  serviceUpdated$ = this.serviceUpdatedSubject.asObservable();
  serviceDeleted$ = this.serviceDeletedSubject.asObservable();
  serviceStatus$ = this.serviceStatusSubject.asObservable();

  private connectionSubscription?: Subscription;
  private handlersRegistered = false;

  constructor(private signalRService: SignalRService) {
    this.initializeService();
  }

  ngOnDestroy(): void {
    this.unregisterHandlers();
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
  }

  /**
   * Initialize the service and monitor connection state
   */
  private initializeService(): void {
    // Subscribe to connection state changes
    this.connectionSubscription = this.signalRService.connectionState$.subscribe(state => {
      const isConnected = state === signalR.HubConnectionState.Connected;
      this.connectionStatusSubject.next(isConnected);

      if (isConnected && !this.handlersRegistered) {
        // Register handlers when connection is established
        this.registerHandlers();
      } else if (!isConnected && this.handlersRegistered) {
        // Mark handlers as unregistered when connection is lost
        this.handlersRegistered = false;
      }
    });

    // If already connected, register handlers immediately
    if (this.signalRService.isConnected() && !this.handlersRegistered) {
      this.registerHandlers();
    }
  }

  /**
   * Register SignalR event handlers
   */
  private registerHandlers(): void {
    if (this.handlersRegistered) {
      return;
    }

    console.log('Registering marketplace SignalR handlers...');

    // Product events
    this.signalRService.on<ProductDto>('ProductCreated', (product) => {
      console.log('ProductCreated event received:', product);
      this.productCreatedSubject.next(product);
    });

    this.signalRService.on<ProductDto>('ProductUpdated', (product) => {
      console.log('ProductUpdated event received:', product);
      this.productUpdatedSubject.next(product);
    });

    this.signalRService.on<string>('ProductDeleted', (id) => {
      console.log('ProductDeleted event received:', id);
      this.productDeletedSubject.next(id);
    });

    this.signalRService.on<{ id: string, oldPrice: number, newPrice: number }>('ProductPriceChanged',
      (data) => {
        console.log('ProductPriceChanged event received:', data);
        this.priceChangedSubject.next(data);
      });

    // Service events
    this.signalRService.on<ServiceDto>('ServiceCreated', (service) => {
      console.log('ServiceCreated event received:', service);
      this.serviceCreatedSubject.next(service);
    });

    this.signalRService.on<ServiceDto>('ServiceUpdated', (service) => {
      console.log('ServiceUpdated event received:', service);
      this.serviceUpdatedSubject.next(service);
    });

    this.signalRService.on<string>('ServiceDeleted', (id) => {
      console.log('ServiceDeleted event received:', id);
      this.serviceDeletedSubject.next(id);
    });

    this.signalRService.on<{ id: string, status: string }>('ServiceStatusChanged',
      (data) => {
        console.log('ServiceStatusChanged event received:', data);
        this.serviceStatusSubject.next(data);
      });

    this.handlersRegistered = true;
    console.log('Marketplace SignalR handlers registered successfully');
  }

  /**
   * Unregister handlers when service is destroyed
   */
  private unregisterHandlers(): void {
    if (!this.handlersRegistered) {
      return;
    }

    console.log('Unregistering marketplace SignalR handlers...');

    this.signalRService.off('ProductCreated');
    this.signalRService.off('ProductUpdated');
    this.signalRService.off('ProductDeleted');
    this.signalRService.off('ProductPriceChanged');
    this.signalRService.off('ServiceCreated');
    this.signalRService.off('ServiceUpdated');
    this.signalRService.off('ServiceDeleted');
    this.signalRService.off('ServiceStatusChanged');

    this.handlersRegistered = false;
    console.log('Marketplace SignalR handlers unregistered');
  }

  /**
   * Check if the service is connected
   */
  public get isConnected(): boolean {
    return this.signalRService.isConnected();
  }
}