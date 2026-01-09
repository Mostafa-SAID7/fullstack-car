"use strict";
(self["webpackChunkmedia_streaming_main_app"] = self["webpackChunkmedia_streaming_main_app"] || []).push([["common"],{

/***/ 2007:
/*!**********************************************************************!*\
  !*** ./src/app/features/marketplace/services/marketplace.service.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MarketplaceService: () => (/* binding */ MarketplaceService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 4054);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);




class MarketplaceService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v6/marketplace`;
  }
  // Service Provider APIs
  getServiceProviders(filters, pageNumber = 1, pageSize = 10) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    if (filters) {
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.serviceType) params = params.set('serviceType', filters.serviceType);
      if (filters.minRating) params = params.set('minRating', filters.minRating.toString());
      if (filters.latitude) params = params.set('latitude', filters.latitude.toString());
      if (filters.longitude) params = params.set('longitude', filters.longitude.toString());
      if (filters.radiusKm) params = params.set('radiusKm', filters.radiusKm.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDescending !== undefined) params = params.set('sortDescending', filters.sortDescending.toString());
    }
    return this.http.get(`${this.apiUrl}/service-providers`, {
      params
    });
  }
  getServiceProvider(id) {
    return this.http.get(`${this.apiUrl}/service-providers/${id}`);
  }
  createServiceProvider(request) {
    return this.http.post(`${this.apiUrl}/service-providers`, request);
  }
  updateServiceProvider(id, request) {
    return this.http.put(`${this.apiUrl}/service-providers/${id}`, request);
  }
  deleteServiceProvider(id) {
    return this.http.delete(`${this.apiUrl}/service-providers/${id}`);
  }
  getMyServiceProviders(pageNumber = 1, pageSize = 10) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    return this.http.get(`${this.apiUrl}/service-providers/my-providers`, {
      params
    });
  }
  // Car Service APIs
  getServices(filters, pageNumber = 1, pageSize = 10) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    if (filters) {
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.serviceType) params = params.set('type', filters.serviceType);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.isEmergencyService !== undefined) params = params.set('isEmergencyService', filters.isEmergencyService.toString());
      if (filters.isAvailable24x7 !== undefined) params = params.set('isAvailable24x7', filters.isAvailable24x7.toString());
      if (filters.minRating) params = params.set('minRating', filters.minRating.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDescending !== undefined) params = params.set('sortDescending', filters.sortDescending.toString());
    }
    return this.http.get(`${this.apiUrl}/services`, {
      params
    });
  }
  getService(id) {
    return this.http.get(`${this.apiUrl}/services/${id}`);
  }
  createService(serviceProviderId, request) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('serviceProviderId', serviceProviderId);
    return this.http.post(`${this.apiUrl}/services`, request, {
      params
    });
  }
  updateService(id, request) {
    return this.http.put(`${this.apiUrl}/services/${id}`, request);
  }
  deleteService(id) {
    return this.http.delete(`${this.apiUrl}/services/${id}`);
  }
  getServicesByProvider(providerId, pageNumber = 1, pageSize = 10) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    return this.http.get(`${this.apiUrl}/services/provider/${providerId}`, {
      params
    });
  }
  searchServicesByLocation(latitude, longitude, radiusKm = 10, pageNumber = 1, pageSize = 10) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('latitude', latitude.toString()).set('longitude', longitude.toString()).set('radiusKm', radiusKm.toString()).set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    return this.http.get(`${this.apiUrl}/services/search/location`, {
      params
    });
  }
  // Booking APIs
  getMyBookings(filters, pageNumber = 1, pageSize = 10) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
      if (filters.toDate) params = params.set('toDate', filters.toDate);
    }
    return this.http.get(`${this.apiUrl}/bookings`, {
      params
    });
  }
  getBooking(id) {
    return this.http.get(`${this.apiUrl}/bookings/${id}`);
  }
  createBooking(request) {
    return this.http.post(`${this.apiUrl}/bookings`, request);
  }
  cancelBooking(id, reason) {
    const body = {
      cancellationReason: reason
    };
    return this.http.post(`${this.apiUrl}/bookings/${id}/cancel`, body);
  }
  confirmBooking(id, notes) {
    const body = {
      providerNotes: notes
    };
    return this.http.post(`${this.apiUrl}/bookings/${id}/confirm`, body);
  }
  completeBooking(id, notes) {
    const body = {
      completionNotes: notes
    };
    return this.http.post(`${this.apiUrl}/bookings/${id}/complete`, body);
  }
  getProviderBookings(providerId, filters, pageNumber = 1, pageSize = 10) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
      if (filters.toDate) params = params.set('toDate', filters.toDate);
    }
    return this.http.get(`${this.apiUrl}/bookings/provider/${providerId}`, {
      params
    });
  }
  static {
    this.ɵfac = function MarketplaceService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MarketplaceService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: MarketplaceService,
      factory: MarketplaceService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 5423:
/*!************************************************!*\
  !*** ./src/app/core/services/toast.service.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToastService: () => (/* binding */ ToastService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 5797);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);


class ToastService {
  constructor() {
    this.toasts = [];
    this.toastsSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject([]);
    this.toasts$ = this.toastsSubject.asObservable();
  }
  show(toast) {
    const id = toast.id || this.generateId();
    const duration = toast.duration || 5000;
    const toastWithId = {
      ...toast,
      id
    };
    this.toasts.push(toastWithId);
    this.toastsSubject.next([...this.toasts]);
    if (!toast.persistent) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
    console.log(`Toast [${toast.type.toUpperCase()}]: ${toast.message}`);
  }
  success(message, title) {
    this.show({
      type: 'success',
      message,
      title
    });
  }
  error(message, title) {
    this.show({
      type: 'error',
      message,
      title,
      persistent: true
    });
  }
  warning(message, title) {
    this.show({
      type: 'warning',
      message,
      title
    });
  }
  info(message, title) {
    this.show({
      type: 'info',
      message,
      title
    });
  }
  removeToast(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }
  remove(id) {
    this.removeToast(id);
  }
  clear() {
    this.toasts = [];
    this.toastsSubject.next([]);
  }
  getToasts() {
    return this.toasts;
  }
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  static {
    this.ɵfac = function ToastService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ToastService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: ToastService,
      factory: ToastService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=common.js.map