"use strict";
(self["webpackChunkmedia_streaming_main_app"] = self["webpackChunkmedia_streaming_main_app"] || []).push([["main"],{

/***/ 92:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 2596);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _core_services_layout_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/services/layout.service */ 2194);





class AppComponent {
  constructor() {
    this.title = 'Media Streaming Platform';
    this.layoutService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_core_services_layout_service__WEBPACK_IMPORTED_MODULE_0__.LayoutService);
  }
  static {
    this.ɵfac = function AppComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AppComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 1,
      vars: 0,
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "router-outlet");
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n}\n\n\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGNBQUE7RUFDQSxZQUFBO0FBQ0o7O0FBRUEsMENBQUEiLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi8qIFV0aWxpdGllcyBtb3ZlZCB0byB0YWlsd2luZC5jb25maWcuanMgKi8iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksY0FBQTtFQUNBLFlBQUE7QUFDSjs7QUFFQSwwQ0FBQTtBQUNBLDRaQUE0WiIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59XHJcblxyXG4vKiBVdGlsaXRpZXMgbW92ZWQgdG8gdGFpbHdpbmQuY29uZmlnLmpzICovIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 2194:
/*!*************************************************!*\
  !*** ./src/app/core/services/layout.service.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutService: () => (/* binding */ LayoutService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);


class LayoutService {
  constructor() {
    this.isMobileMenuOpen = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(false);
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
  }
  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
  static {
    this.ɵfac = function LayoutService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LayoutService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: LayoutService,
      factory: LayoutService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 4114:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule),
/* harmony export */   routes: () => (/* binding */ routes)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/guards/auth.guard */ 4978);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);




const routes = [
// Auth Routes (No Layout)
{
  path: 'auth',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_forms_fesm2022_forms_mjs"), __webpack_require__.e("default-src_app_features_auth_pages_login_login_component_ts"), __webpack_require__.e("src_app_features_auth_auth_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./features/auth/auth.module */ 663)).then(m => m.AuthModule)
},
// Simple login route
{
  path: 'login',
  loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_forms_fesm2022_forms_mjs"), __webpack_require__.e("default-src_app_features_auth_pages_login_login_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./features/auth/pages/login/login.component */ 3090)).then(m => m.LoginComponent)
},
// Main application routes with layout
{
  path: '',
  loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_forms_fesm2022_forms_mjs"), __webpack_require__.e("default-node_modules_angular_cdk_fesm2022_boolean-property-DaaVhX5A_mjs-node_modules_angular_-78e518"), __webpack_require__.e("common"), __webpack_require__.e("src_app_layout_layouts_main-layout_main-layout_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./layout/layouts/main-layout/main-layout.component */ 503)).then(m => m.MainLayoutComponent),
  children: [
  // Home/Discovery page - using existing community feed for now
  {
    path: '',
    loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_forms_fesm2022_forms_mjs"), __webpack_require__.e("default-src_app_features_community_components_community-feed_community-feed_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./features/community/components/community-feed/community-feed.component */ 2055)).then(m => m.CommunityFeedComponent)
  },
  // Media streaming routes
  {
    path: 'media',
    loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_forms_fesm2022_forms_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_features_media_media_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./features/media/media.module */ 6661)).then(m => m.MediaModule),
    canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
  },
  // Community features (existing)
  {
    path: 'community',
    loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_forms_fesm2022_forms_mjs"), __webpack_require__.e("default-src_app_features_community_components_community-feed_community-feed_component_ts"), __webpack_require__.e("src_app_features_community_community_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./features/community/community.module */ 9353)).then(m => m.CommunityModule)
  },
  // Marketplace features (existing)
  {
    path: 'marketplace',
    loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_forms_fesm2022_forms_mjs"), __webpack_require__.e("default-node_modules_angular_cdk_fesm2022_boolean-property-DaaVhX5A_mjs-node_modules_angular_-78e518"), __webpack_require__.e("src_app_features_marketplace_marketplace_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./features/marketplace/marketplace.module */ 6389)).then(m => m.MarketplaceModule)
  },
  // Debug routes (development only)
  {
    path: 'debug-routing',
    loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_debug-routing_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./debug-routing.component */ 6767)).then(m => m.DebugRoutingComponent)
  }, {
    path: 'debug-auth',
    loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_debug-auth_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./debug-auth.component */ 8545)).then(m => m.DebugAuthComponent)
  },
  // Error pages
  {
    path: '404',
    loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_shared_components_errors_not-found_not-found_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./shared/components/errors/not-found/not-found.component */ 7193)).then(m => m.NotFoundComponent)
  }, {
    path: '500',
    loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_shared_components_errors_server-error_server-error_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./shared/components/errors/server-error/server-error.component */ 7999)).then(m => m.ServerErrorComponent)
  },
  // Redirects
  {
    path: 'dashboard',
    redirectTo: 'media',
    pathMatch: 'full'
  }]
},
// Redirect unknown routes to 404
{
  path: '**',
  redirectTo: '404'
}];
class AppRoutingModule {
  static {
    this.ɵfac = function AppRoutingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AppRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: AppRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forRoot(routes, {
        enableTracing: false,
        // Set to true for debugging
        preloadingStrategy: undefined,
        // Lazy load on demand
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
        scrollOffset: [0, 64] // Offset for fixed header
      }), _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
  });
})();

/***/ }),

/***/ 4429:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomTranslateLoader: () => (/* binding */ CustomTranslateLoader),
/* harmony export */   HttpLoaderFactory: () => (/* binding */ HttpLoaderFactory),
/* harmony export */   authInterceptor: () => (/* binding */ authInterceptor)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ 9736);
/* harmony import */ var _app_app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.component */ 92);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser/animations */ 3835);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ 4054);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _app_app_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/app-routing.module */ 4114);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _app_core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/core/services/auth.service */ 8010);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ 5312);












// Functional Auth Interceptor
const authInterceptor = (req, next) => {
  const authService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_app_core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService);
  const token = authService.token;
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('Auth interceptor: Adding token to request', authReq.url);
    return next(authReq);
  }
  console.log('Auth interceptor: No token found for request', req.url);
  return next(req);
};
class CustomTranslateLoader {
  constructor(http) {
    this.http = http;
  }
  getTranslation(lang) {
    return this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_3__.environment.apiUrl}/v4/shared/localization/resources/${lang}`);
  }
}
function HttpLoaderFactory(http) {
  return new CustomTranslateLoader(http);
}
(0,_angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__.bootstrapApplication)(_app_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent, {
  providers: [(0,_angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_6__.provideAnimations)(), (0,_angular_common_http__WEBPACK_IMPORTED_MODULE_7__.provideHttpClient)((0,_angular_common_http__WEBPACK_IMPORTED_MODULE_7__.withInterceptors)([authInterceptor])), (0,_angular_router__WEBPACK_IMPORTED_MODULE_8__.provideRouter)(_app_app_routing_module__WEBPACK_IMPORTED_MODULE_1__.routes), (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.importProvidersFrom)(_ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateModule.forRoot({
    loader: {
      provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClient]
    },
    defaultLanguage: 'en-US'
  }))]
}).catch(err => console.error(err));

/***/ }),

/***/ 4978:
/*!*******************************************!*\
  !*** ./src/app/core/guards/auth.guard.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminGuard: () => (/* binding */ AdminGuard),
/* harmony export */   AuthGuard: () => (/* binding */ AuthGuard),
/* harmony export */   ContentCreatorGuard: () => (/* binding */ ContentCreatorGuard),
/* harmony export */   GuestGuard: () => (/* binding */ GuestGuard),
/* harmony export */   RoleGuard: () => (/* binding */ RoleGuard)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 2596);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 4334);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 271);
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/auth.service */ 8010);





class AuthGuard {
  constructor() {
    this.authService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
  }
  canActivate(route, state) {
    return this.checkAuth(state.url);
  }
  canActivateChild(route, state) {
    return this.checkAuth(state.url);
  }
  checkAuth(url) {
    return this.authService.currentUser$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.take)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.map)(user => {
      if (user) {
        return true;
      }
      // Store the attempted URL for redirecting after login
      localStorage.setItem('redirectUrl', url);
      this.router.navigate(['/login']);
      return false;
    }));
  }
  static {
    this.ɵfac = function AuthGuard_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AuthGuard)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: AuthGuard,
      factory: AuthGuard.ɵfac,
      providedIn: 'root'
    });
  }
}
class GuestGuard {
  constructor() {
    this.authService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
  }
  canActivate() {
    return this.authService.currentUser$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.take)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.map)(user => {
      if (!user) {
        return true;
      }
      // Redirect authenticated users to media discovery page
      this.router.navigate(['/']);
      return false;
    }));
  }
  static {
    this.ɵfac = function GuestGuard_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GuestGuard)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: GuestGuard,
      factory: GuestGuard.ɵfac,
      providedIn: 'root'
    });
  }
}
class RoleGuard {
  constructor() {
    this.authService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
  }
  canActivate(route) {
    const requiredRoles = route.data['roles'];
    return this.authService.currentUser$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.take)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.map)(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return false;
      }
      // Check if user has any of the required roles
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
      const hasRole = requiredRoles.some(role => user.roles.includes(role));
      if (hasRole) {
        return true;
      }
      this.router.navigate(['/unauthorized']);
      return false;
    }));
  }
  static {
    this.ɵfac = function RoleGuard_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RoleGuard)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: RoleGuard,
      factory: RoleGuard.ɵfac,
      providedIn: 'root'
    });
  }
}
class ContentCreatorGuard {
  constructor() {
    this.authService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
  }
  canActivate() {
    return this.authService.currentUser$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.take)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.map)(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return false;
      }
      // Check if user is a content creator or admin
      const isContentCreator = user.roles.includes('ContentCreator') || user.roles.includes('Admin') || user.roles.includes('Moderator');
      if (isContentCreator) {
        return true;
      }
      this.router.navigate(['/unauthorized']);
      return false;
    }));
  }
  static {
    this.ɵfac = function ContentCreatorGuard_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ContentCreatorGuard)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: ContentCreatorGuard,
      factory: ContentCreatorGuard.ɵfac,
      providedIn: 'root'
    });
  }
}
class AdminGuard {
  constructor() {
    this.authService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
  }
  canActivate() {
    return this.authService.currentUser$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.take)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.map)(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return false;
      }
      // Check if user is an admin
      const isAdmin = user.roles.includes('Admin');
      if (isAdmin) {
        return true;
      }
      this.router.navigate(['/unauthorized']);
      return false;
    }));
  }
  static {
    this.ɵfac = function AdminGuard_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AdminGuard)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: AdminGuard,
      factory: AdminGuard.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 5312:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
const environment = {
  production: false,
  apiUrl: 'http://localhost:5100/api',
  hubUrl: 'http://localhost:5100/hubs'
};

/***/ }),

/***/ 8010:
/*!***********************************************!*\
  !*** ./src/app/core/services/auth.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthService: () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 5797);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 8764);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 1318);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 7919);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 5312);





class AuthService {
  constructor() {
    this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient);
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v1/auth`;
    this.currentUserSubject = new rxjs__WEBPACK_IMPORTED_MODULE_3__.BehaviorSubject(null);
    this.tokenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_3__.BehaviorSubject(null);
    this.isLoadingSubject = new rxjs__WEBPACK_IMPORTED_MODULE_3__.BehaviorSubject(false);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.token$ = this.tokenSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.loadStoredAuth();
  }
  get currentUser() {
    return this.currentUserSubject.value;
  }
  get token() {
    return this.tokenSubject.value;
  }
  get isAuthenticated() {
    return !!this.token && !!this.currentUser;
  }
  get isContentCreator() {
    const user = this.currentUser;
    return !!user && (user.roles.includes('ContentCreator') || user.roles.includes('Admin') || user.roles.includes('Moderator'));
  }
  get isAdmin() {
    const user = this.currentUser;
    return !!user && user.roles.includes('Admin');
  }
  login(request) {
    this.isLoadingSubject.next(true);
    console.log('[Angular AuthService] Making login request to:', `${this.apiUrl}/login`);
    console.log('[Angular AuthService] Request payload:', request);
    return this.http.post(`${this.apiUrl}/login`, request).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.tap)(response => {
      console.log('[Angular AuthService] Login response:', response);
      if (response.succeeded && response.data) {
        // Backend returns AuthResponse, map it to LoginResponse
        const authResponse = response.data;
        const loginResponse = {
          token: authResponse.token,
          refreshToken: authResponse.refreshToken,
          user: authResponse.user,
          expiresAt: authResponse.expiresAt
        };
        this.setAuthData(loginResponse);
        // Note: Router navigation should be handled by the component
      }
      this.isLoadingSubject.next(false);
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.catchError)(error => {
      this.isLoadingSubject.next(false);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.throwError)(() => error);
    }));
  }
  register(request) {
    this.isLoadingSubject.next(true);
    return this.http.post(`${this.apiUrl}/register`, request).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.tap)(response => {
      if (response.succeeded && response.data) {
        this.setAuthData(response.data);
      }
      this.isLoadingSubject.next(false);
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.catchError)(error => {
      this.isLoadingSubject.next(false);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.throwError)(() => error);
    }));
  }
  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const token = this.token;
    if (!refreshToken || !token) {
      throw new Error('No refresh token available');
    }
    const request = {
      token,
      refreshToken
    };
    return this.http.post(`${this.apiUrl}/refresh-token`, request).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.tap)(response => {
      if (response.succeeded && response.data) {
        this.setAuthData(response.data);
      }
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.catchError)(error => {
      // If refresh fails, clear auth data
      this.clearAuthData();
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.throwError)(() => error);
    }));
  }
  confirmEmail(request) {
    return this.http.post(`${this.apiUrl}/confirm-email`, request);
  }
  resendEmailConfirmation(email) {
    return this.http.post(`${this.apiUrl}/resend-email-confirmation`, {
      email
    });
  }
  forgotPassword(request) {
    return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v1/password/forgot`, request);
  }
  resetPassword(request) {
    return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v1/password/reset`, request);
  }
  changePassword(request) {
    return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v1/password/change`, request);
  }
  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.tap)(() => {
      this.clearAuthData();
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.catchError)(error => {
      // Even if logout fails on server, clear local data
      this.clearAuthData();
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.throwError)(() => error);
    }));
  }
  revokeToken(token) {
    return this.http.post(`${this.apiUrl}/revoke-token`, {
      token
    });
  }
  // Media-specific permission checks
  canUploadMedia() {
    return this.isContentCreator;
  }
  canModerateContent() {
    const user = this.currentUser;
    return !!user && (user.roles.includes('Admin') || user.roles.includes('Moderator'));
  }
  canAccessAnalytics() {
    return this.isContentCreator;
  }
  canManageUsers() {
    return this.isAdmin;
  }
  // Check if user owns content
  canEditContent(creatorId) {
    const user = this.currentUser;
    return !!user && (user.id === creatorId || this.canModerateContent());
  }
  setAuthData(response) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('tokenExpiry', response.expiresAt);
    this.tokenSubject.next(response.token);
    this.currentUserSubject.next(response.user);
  }
  loadStoredAuth() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const expiry = localStorage.getItem('tokenExpiry');
    if (token && userJson && expiry) {
      const expiryDate = new Date(expiry);
      if (expiryDate > new Date()) {
        this.tokenSubject.next(token);
        this.currentUserSubject.next(JSON.parse(userJson));
      } else {
        this.clearAuthData();
      }
    }
  }
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('redirectUrl');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }
  static {
    this.ɵfac = function AuthService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AuthService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: AuthService,
      factory: AuthService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4429)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map