"use strict";
(self["webpackChunkcommunity_car_app"] = self["webpackChunkcommunity_car_app"] || []).push([["main"],{

/***/ 92:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 2596);
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/shared.module */ 3887);
/* harmony import */ var _layout_components_header_header_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layout/components/header/header.component */ 4868);
/* harmony import */ var _layout_components_sidebar_left_sidebar_left_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./layout/components/sidebar-left/sidebar-left.component */ 8362);
/* harmony import */ var _layout_components_sidebar_right_sidebar_right_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./layout/components/sidebar-right/sidebar-right.component */ 5004);
/* harmony import */ var _core_services_layout_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/services/layout.service */ 2194);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 4460);










function AppComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 7)(1, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function AppComponent_div_8_Template_div_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r1.layoutService.closeMobileMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 9)(3, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](4, "app-sidebar-left");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
  }
}
class AppComponent {
  constructor() {
    this.title = 'Community Car';
    this.layoutService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_core_services_layout_service__WEBPACK_IMPORTED_MODULE_4__.LayoutService);
  }
  static {
    this.ɵfac = function AppComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AppComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 9,
      vars: 1,
      consts: [[1, "min-h-screen", "bg-background", "text-foreground", "flex", "flex-col", "pt-3.5"], [1, "flex-1", "flex", "max-w-[1920px]", "mx-auto", "w-full", "pt-4"], [1, "hidden", "xl:block", "w-[360px]", "fixed", "left-0", "top-14", "h-[calc(100vh-3.5rem)]", "overflow-y-auto", "pl-4", "pb-4", "custom-scrollbar"], [1, "flex-1", "w-full", "xl:ml-[360px]", "xl:mr-[360px]", "px-2", "sm:px-4", "md:px-8", "lg:px-16", "xl:px-8", "2xl:px-16", "min-h-[calc(100vh-3.5rem)]", "pb-8", "flex", "justify-center"], [1, "w-full", "max-w-[700px]"], [1, "hidden", "xl:block", "w-[360px]", "fixed", "right-0", "top-14", "h-[calc(100vh-3.5rem)]", "overflow-y-auto", "pr-4", "pb-4", "custom-scrollbar"], ["class", "fixed inset-0 z-40 xl:hidden", 4, "ngIf"], [1, "fixed", "inset-0", "z-40", "xl:hidden"], [1, "absolute", "inset-0", "bg-black/50", "backdrop-blur-sm", "transition-opacity", 3, "click"], [1, "absolute", "right-0", "top-0", "h-full", "w-[280px]", "bg-background", "shadow-2xl", "transform", "transition-transform", "duration-300", "ease-in-out", "pt-16", "px-4", "overflow-y-auto"], [1, "mb-4"]],
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "app-header");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](3, "app-sidebar-left", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "main", 3)(5, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](6, "router-outlet");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](7, "app-sidebar-right", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](8, AppComponent_div_8_Template, 5, 0, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.layoutService.isMobileMenuOpen());
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterOutlet, _shared_shared_module__WEBPACK_IMPORTED_MODULE_0__.SharedModule, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _layout_components_header_header_component__WEBPACK_IMPORTED_MODULE_1__.HeaderComponent, _layout_components_sidebar_left_sidebar_left_component__WEBPACK_IMPORTED_MODULE_2__.SidebarLeftComponent, _layout_components_sidebar_right_sidebar_right_component__WEBPACK_IMPORTED_MODULE_3__.SidebarRightComponent, _angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n  height: 100%;\n}\n\n.no-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n\n.no-scrollbar[_ngcontent-%COMP%] {\n  -ms-overflow-style: none;\n  scrollbar-width: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGNBQUE7RUFDQSxZQUFBO0FBQ0o7O0FBRUE7RUFDSSxhQUFBO0FBQ0o7O0FBRUE7RUFDSSx3QkFBQTtFQUNBLHFCQUFBO0FBQ0oiLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5uby1zY3JvbGxiYXI6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5uby1zY3JvbGxiYXIge1xyXG4gICAgLW1zLW92ZXJmbG93LXN0eWxlOiBub25lO1xyXG4gICAgc2Nyb2xsYmFyLXdpZHRoOiBub25lO1xyXG59Il19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksY0FBQTtFQUNBLFlBQUE7QUFDSjs7QUFFQTtFQUNJLGFBQUE7QUFDSjs7QUFFQTtFQUNJLHdCQUFBO0VBQ0EscUJBQUE7QUFDSjtBQUNBLG9tQkFBb21CIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5uby1zY3JvbGxiYXI6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5uby1zY3JvbGxiYXIge1xyXG4gICAgLW1zLW92ZXJmbG93LXN0eWxlOiBub25lO1xyXG4gICAgc2Nyb2xsYmFyLXdpZHRoOiBub25lO1xyXG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
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

/***/ 3887:
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedModule: () => (/* binding */ SharedModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 4175);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 3840);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ 5541);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ 3777);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/menu */ 1034);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/divider */ 4102);
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/badge */ 6256);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);











class SharedModule {
  static {
    this.ɵfac = function SharedModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SharedModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: SharedModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInputModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_7__.MatCardModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_8__.MatMenuModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_9__.MatDividerModule, _angular_material_badge__WEBPACK_IMPORTED_MODULE_10__.MatBadgeModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInputModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_7__.MatCardModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_8__.MatMenuModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_9__.MatDividerModule, _angular_material_badge__WEBPACK_IMPORTED_MODULE_10__.MatBadgeModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](SharedModule, {
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInputModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_7__.MatCardModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_8__.MatMenuModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_9__.MatDividerModule, _angular_material_badge__WEBPACK_IMPORTED_MODULE_10__.MatBadgeModule],
    exports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInputModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_7__.MatCardModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_8__.MatMenuModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_9__.MatDividerModule, _angular_material_badge__WEBPACK_IMPORTED_MODULE_10__.MatBadgeModule]
  });
})();

/***/ }),

/***/ 4081:
/*!************************************************!*\
  !*** ./src/app/core/services/theme.service.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ThemeService: () => (/* binding */ ThemeService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);


class ThemeService {
  constructor() {
    this.THEME_KEY = 'app-theme-mode';
    // Signal to hold the current mode (true = dark, false = light)
    this.isDark = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(this.getStoredTheme());
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.effect)(() => {
      const dark = this.isDark();
      this.applyTheme(dark);
      localStorage.setItem(this.THEME_KEY, dark ? 'dark' : 'light');
    });
  }
  toggleTheme() {
    this.isDark.update(d => !d);
  }
  getStoredTheme() {
    const stored = localStorage.getItem(this.THEME_KEY);
    // Default to light if nothing stored, or check system preference? 
    // For now, default to false (light).
    return stored === 'dark';
  }
  applyTheme(isDark) {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
  static {
    this.ɵfac = function ThemeService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ThemeService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: ThemeService,
      factory: ThemeService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 4429:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 9736);
/* harmony import */ var _app_app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.component */ 92);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser/animations */ 3835);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 4054);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 8431);





const routes = [
// Add your routes here
{
  path: '',
  redirectTo: '/community',
  pathMatch: 'full'
}, {
  path: 'community',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_features_community_community_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./app/features/community/community.module */ 9353)).then(m => m.CommunityModule)
}
// Add more routes as needed
];
(0,_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.bootstrapApplication)(_app_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent, {
  providers: [(0,_angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__.provideAnimations)(), (0,_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.provideHttpClient)(), (0,_angular_router__WEBPACK_IMPORTED_MODULE_4__.provideRouter)(routes)]
}).catch(err => console.error(err));

/***/ }),

/***/ 4868:
/*!**************************************************************!*\
  !*** ./src/app/layout/components/header/header.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderComponent: () => (/* binding */ HeaderComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/tooltip */ 2281);
/* harmony import */ var _core_services_theme_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/services/theme.service */ 4081);
/* harmony import */ var _core_services_layout_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/services/layout.service */ 2194);








function HeaderComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 36)(1, "i", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function HeaderComponent_div_7_Template_i_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.toggleSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
class HeaderComponent {
  constructor() {
    this.themeService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_core_services_theme_service__WEBPACK_IMPORTED_MODULE_0__.ThemeService);
    this.layoutService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_core_services_layout_service__WEBPACK_IMPORTED_MODULE_1__.LayoutService);
    this.isSearchOpen = false;
  }
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }
  static {
    this.ɵfac = function HeaderComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || HeaderComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: HeaderComponent,
      selectors: [["app-header"]],
      decls: 41,
      vars: 3,
      consts: [[1, "h-14", "glass", "fixed", "top-0", "left-0", "w-full", "z-50", "shadow-sm", "flex", "items-center", "justify-between", "px-2", "sm:px-4", "md:px-6", "transition-colors", "duration-300"], [1, "flex", "items-center", "gap-2", "sm:gap-3"], [1, "w-10", "h-10", "bg-primary", "rounded-full", "flex", "items-center", "justify-center", "cursor-pointer", "hover:opacity-90", "transition-opacity", "flex-shrink-0"], [1, "text-white", "font-black", "text-2xl", "tracking-tighter", "italic"], [1, "w-10", "h-10", "bg-secondary", "rounded-full", "flex", "md:hidden", "items-center", "justify-center", "cursor-pointer", "hover:bg-black/10", "dark:hover:bg-white/10", "transition-colors", "flex-shrink-0", 3, "click"], [1, "fa-solid", "fa-search", "text-foreground"], ["class", "absolute top-0 left-0 w-full h-14 bg-card flex items-center px-4 z-50 md:hidden animate-fade-in shadow-md", 4, "ngIf"], [1, "relative", "hidden", "md:block", "group"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-muted-foreground", "z-10", "group-focus-within:hidden"], ["type", "text", "placeholder", "Search Facebook", 1, "fb-input", "pl-10", "w-[240px]", "lg:w-[280px]", "xl:w-[320px]", "transition-all", "focus:pl-4", "focus:shadow-md"], [1, "flex", "items-center", "h-full", "hidden", "md:flex", "gap-1", "lg:gap-8", "xl:gap-14", "flex-1", "justify-center", "max-w-2xl", "px-4"], ["matTooltip", "Home", 1, "relative", "h-full", "flex-1", "flex", "items-center", "justify-center", "cursor-pointer", "border-b-[3px]", "border-primary", "text-primary", "transition-all", "duration-200", "hover:bg-secondary/50", "rounded-lg", "my-1", "group"], [1, "fa-solid", "fa-house", "text-2xl", "group-active:scale-95", "transition-transform"], ["matTooltip", "Friends", 1, "relative", "h-full", "flex-1", "flex", "items-center", "justify-center", "cursor-pointer", "border-b-[3px]", "border-transparent", "text-muted-foreground", "hover:bg-secondary", "rounded-lg", "my-1", "transition-all", "duration-200", "group"], [1, "fa-solid", "fa-user-group", "text-2xl", "group-active:scale-95", "transition-transform"], ["matTooltip", "Video", 1, "relative", "h-full", "flex-1", "flex", "items-center", "justify-center", "cursor-pointer", "border-b-[3px]", "border-transparent", "text-muted-foreground", "hover:bg-secondary", "rounded-lg", "my-1", "transition-all", "duration-200", "group"], [1, "relative", "group-active:scale-95", "transition-transform"], [1, "fa-solid", "fa-tv", "text-2xl"], [1, "absolute", "-top-1.5", "-right-2", "bg-red-500", "text-[10px]", "font-bold", "text-white", "px-1", "rounded-full", "border", "border-card"], ["matTooltip", "Marketplace", 1, "relative", "h-full", "flex-1", "flex", "items-center", "justify-center", "cursor-pointer", "border-b-[3px]", "border-transparent", "text-muted-foreground", "hover:bg-secondary", "rounded-lg", "my-1", "transition-all", "duration-200", "group"], [1, "fa-solid", "fa-store", "text-2xl", "group-active:scale-95", "transition-transform"], ["matTooltip", "Groups", 1, "relative", "h-full", "flex-1", "flex", "items-center", "justify-center", "cursor-pointer", "border-b-[3px]", "border-transparent", "text-muted-foreground", "hover:bg-secondary", "rounded-lg", "my-1", "transition-all", "duration-200", "group"], [1, "fa-solid", "fa-users", "text-2xl", "group-active:scale-95", "transition-transform"], [1, "flex", "items-center", "gap-2", "sm:gap-3", "flex-shrink-0"], [1, "fb-icon-btn", "active:scale-95", "touch-manipulation", 3, "click", "matTooltip"], [1, "fa-solid", "text-xl", "transition-transform", "duration-500", "rotate-0", 3, "ngClass"], ["matTooltip", "Menu", 1, "fb-icon-btn", "active:scale-95", "touch-manipulation", "lg:hidden", 3, "click"], [1, "fa-solid", "fa-bars", "text-xl"], ["matTooltip", "Menu", 1, "fb-icon-btn", "active:scale-95", "touch-manipulation", "hidden", "lg:flex"], ["matTooltip", "Messenger", 1, "fb-icon-btn", "active:scale-95", "touch-manipulation"], [1, "fa-brands", "fa-facebook-messenger", "text-xl"], ["matTooltip", "Notifications", 1, "fb-icon-btn", "relative", "active:scale-95", "touch-manipulation"], [1, "fa-solid", "fa-bell", "text-xl"], [1, "absolute", "-top-1", "-right-1", "bg-red-500", "text-[11px]", "font-bold", "text-white", "px-1.5", "py-0.5", "rounded-full", "border-2", "border-card"], ["matTooltip", "Account", 1, "w-10", "h-10", "rounded-full", "bg-secondary", "overflow-hidden", "cursor-pointer", "hover:opacity-90", "transition-opacity", "ml-1", "active:scale-95", "touch-manipulation"], [1, "w-full", "h-full", "bg-gray-300", "flex", "items-center", "justify-center", "text-muted-foreground", "font-bold"], [1, "absolute", "top-0", "left-0", "w-full", "h-14", "bg-card", "flex", "items-center", "px-4", "z-50", "md:hidden", "animate-fade-in", "shadow-md"], [1, "fa-solid", "fa-arrow-left", "text-xl", "text-muted-foreground", "mr-4", "cursor-pointer", 3, "click"], ["type", "text", "placeholder", "Search Facebook", "autoFocus", "", 1, "fb-input", "w-full"]],
      template: function HeaderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "f");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_5_listener() {
            return ctx.toggleSearch();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "i", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, HeaderComponent_div_7_Template, 3, 0, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](9, "i", 8)(10, "input", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "nav", 10)(12, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](13, "i", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](15, "i", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "div", 15)(17, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](18, "i", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "span", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, "9+");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "div", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](22, "i", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](24, "i", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "div", 23)(26, "button", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_26_listener() {
            return ctx.themeService.toggleTheme();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](27, "i", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "button", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_28_listener() {
            return ctx.layoutService.toggleMobileMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](29, "i", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "button", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](31, "i", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](32, "button", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](33, "i", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "button", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](35, "i", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, "3");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "div", 34)(39, "div", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](40, "JD");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isSearchOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](19);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matTooltip", ctx.themeService.isDark() ? "Switch to Light Mode" : "Switch to Dark Mode");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", ctx.themeService.isDark() ? "fa-sun text-yellow-500 rotate-180" : "fa-moon text-gray-600");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_4__.h, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_4__.e],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 5004:
/*!****************************************************************************!*\
  !*** ./src/app/layout/components/sidebar-right/sidebar-right.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidebarRightComponent: () => (/* binding */ SidebarRightComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);



const _c0 = () => [1, 2, 3, 4, 5];
function SidebarRightComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 7)(1, "div", 8)(2, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const user_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("animation-delay", i_r2 * 0.1 + "s");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("U", user_r1, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("User ", user_r1, "");
  }
}
class SidebarRightComponent {
  static {
    this.ɵfac = function SidebarRightComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SidebarRightComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: SidebarRightComponent,
      selectors: [["app-sidebar-right"]],
      decls: 9,
      vars: 2,
      consts: [[1, "hidden", "lg:flex", "w-72", "flex-col", "p-4", "fixed", "right-0", "top-14", "h-[calc(100vh-3.5rem)]", "overflow-y-auto", "z-10", "scrollbar-thin", "scrollbar-thumb-secondary", "scrollbar-track-transparent"], [1, "flex", "items-center", "justify-between", "text-muted-foreground", "font-semibold", "px-3", "mb-4", "tracking-wide", "text-xs", "uppercase", "opacity-80"], [1, "flex", "gap-4", "text-sm"], [1, "fa-solid", "fa-video", "hover:text-primary", "cursor-pointer", "transition-colors"], [1, "fa-solid", "fa-search", "hover:text-primary", "cursor-pointer", "transition-colors"], [1, "fa-solid", "fa-ellipsis", "hover:text-primary", "cursor-pointer", "transition-colors"], ["class", "fb-sidebar-item group relative animate-in", 3, "animation-delay", 4, "ngFor", "ngForOf"], [1, "fb-sidebar-item", "group", "relative", "animate-in"], [1, "relative"], [1, "w-9", "h-9", "rounded-full", "bg-muted", "flex", "items-center", "justify-center", "text-xs", "font-bold", "text-muted-foreground", "group-hover:bg-primary/20", "group-hover:text-primary", "transition-colors"], [1, "absolute", "bottom-0", "right-0", "w-3", "h-3", "bg-emerald-500", "border-2", "border-white", "dark:border-[#18191a]", "rounded-full", "shadow-sm"], [1, "font-medium", "text-foreground/80", "group-hover:text-primary", "transition-colors"]],
      template: function SidebarRightComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "aside", 0)(1, "div", 1)(2, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Contacts");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "i", 3)(6, "i", 4)(7, "i", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, SidebarRightComponent_div_8_Template, 7, 4, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8362:
/*!**************************************************************************!*\
  !*** ./src/app/layout/components/sidebar-left/sidebar-left.component.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidebarLeftComponent: () => (/* binding */ SidebarLeftComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);


class SidebarLeftComponent {
  static {
    this.ɵfac = function SidebarLeftComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SidebarLeftComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: SidebarLeftComponent,
      selectors: [["app-sidebar-left"]],
      decls: 33,
      vars: 0,
      consts: [[1, "hidden", "lg:flex", "w-72", "flex-col", "p-4", "fixed", "left-0", "top-14", "h-[calc(100vh-3.5rem)]", "overflow-y-auto", "z-10", "scrollbar-thin", "scrollbar-thumb-secondary", "scrollbar-track-transparent"], [1, "fb-sidebar-item", "hover:scale-105", "transition-transform", "duration-200"], [1, "w-9", "h-9", "rounded-full", "bg-gradient-to-tr", "from-primary", "to-purple-500", "flex", "items-center", "justify-center", "text-white", "font-bold", "shadow-md"], [1, "font-medium", "text-foreground/90"], [1, "fb-sidebar-item", "group"], [1, "fa-solid", "fa-user-group", "text-sky-500", "text-xl", "w-9", "flex", "justify-center", "group-hover:scale-110", "transition-transform"], [1, "font-medium", "text-foreground/80", "group-hover:text-primary", "transition-colors"], [1, "fa-solid", "fa-clock", "text-blue-500", "text-xl", "w-9", "flex", "justify-center", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-bookmark", "text-purple-500", "text-xl", "w-9", "flex", "justify-center", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-people-group", "text-primary", "text-xl", "w-9", "flex", "justify-center", "group-hover:scale-110", "transition-transform"], [1, "my-4", "border-border/50"], [1, "px-3", "text-muted-foreground", "font-semibold", "mb-2", "text-sm", "uppercase", "tracking-wider"], [1, "w-9", "h-9", "bg-primary/20", "rounded-lg", "flex", "items-center", "justify-center", "text-primary", "font-black", "italic", "text-xs", "group-hover:bg-primary", "group-hover:text-white", "transition-colors", "duration-300"], [1, "font-medium", "truncate", "text-foreground/80", "group-hover:text-primary", "transition-colors"], [1, "mt-auto", "px-3", "py-4", "text-xs", "text-muted-foreground/60", "text-center"]],
      template: function SidebarLeftComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "aside", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "JD");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "John Doe");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "i", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Friends");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "i", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Memories");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "i", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Saved");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Groups");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "hr", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "h3", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Your Shortcuts");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 4)(26, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "OFF");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "span", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Off-road Lovers Egypt");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 14)(31, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "\u00A9 2024 Community Car");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule],
      encapsulation: 2
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