"use strict";
(self["webpackChunkmedia_streaming_main_app"] = self["webpackChunkmedia_streaming_main_app"] || []).push([["src_app_shared_components_errors_server-error_server-error_component_ts"],{

/***/ 7999:
/*!*********************************************************************************!*\
  !*** ./src/app/shared/components/errors/server-error/server-error.component.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServerErrorComponent: () => (/* binding */ ServerErrorComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);




class ServerErrorComponent {
  refresh() {
    window.location.reload();
  }
  static {
    this.ɵfac = function ServerErrorComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ServerErrorComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: ServerErrorComponent,
      selectors: [["app-server-error"]],
      decls: 19,
      vars: 0,
      consts: [[1, "min-h-[80vh]", "flex", "flex-col", "items-center", "justify-center", "p-6", "text-center", "animate-fade-in"], [1, "relative", "mb-8"], [1, "text-9xl", "font-black", "italic", "text-primary/10", "select-none"], [1, "absolute", "inset-0", "flex", "items-center", "justify-center"], [1, "fas", "fa-engine-warning", "text-6xl", "text-primary", "animate-pulse"], [1, "text-3xl", "font-black", "text-foreground", "mb-4", "tracking-tight"], [1, "text-muted-foreground", "max-w-md", "mb-8", "font-medium"], [1, "flex", "flex-col", "sm:flex-row", "gap-4"], [1, "px-8", "py-3", "bg-primary", "text-white", "rounded-2xl", "font-black", "shadow-lg", "shadow-primary/30", "hover:bg-primary/90", "hover:-translate-y-1", "active:scale-95", "transition-all", "flex", "items-center", "gap-3", 3, "click"], [1, "fas", "fa-sync"], ["routerLink", "/community", 1, "px-8", "py-3", "bg-secondary", "text-foreground", "rounded-2xl", "font-black", "hover:bg-secondary/80", "hover:-translate-y-1", "active:scale-95", "transition-all", "flex", "items-center", "gap-3", "border", "border-border/40"], [1, "fas", "fa-home"], [1, "mt-16", "text-[10px]", "text-muted-foreground/30", "font-black", "uppercase", "tracking-[0.3em]"]],
      template: function ServerErrorComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "500");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "i", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Engine Failure!");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Our servers encountered an internal stall. Our mechanics are already working on the fix. Please try refreshing or come back later. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 7)(11, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ServerErrorComponent_Template_button_click_11_listener() {
            return ctx.refresh();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, " Refresh Engine ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "i", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " Back to Safety ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, " Error Code: Stall_Internal_500 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_shared_components_errors_server-error_server-error_component_ts.js.map