"use strict";
(self["webpackChunkmedia_streaming_main_app"] = self["webpackChunkmedia_streaming_main_app"] || []).push([["src_app_shared_components_errors_not-found_not-found_component_ts"],{

/***/ 7193:
/*!***************************************************************************!*\
  !*** ./src/app/shared/components/errors/not-found/not-found.component.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotFoundComponent: () => (/* binding */ NotFoundComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);




class NotFoundComponent {
  goBack() {
    window.history.back();
  }
  static {
    this.ɵfac = function NotFoundComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NotFoundComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: NotFoundComponent,
      selectors: [["app-not-found"]],
      decls: 24,
      vars: 0,
      consts: [[1, "min-h-[80vh]", "flex", "flex-col", "items-center", "justify-center", "p-6", "text-center", "animate-fade-in"], [1, "relative", "mb-8"], [1, "text-9xl", "font-black", "italic", "text-primary/10", "select-none"], [1, "absolute", "inset-0", "flex", "items-center", "justify-center"], [1, "fas", "fa-ghost", "text-6xl", "text-primary", "animate-bounce"], [1, "text-3xl", "font-black", "text-foreground", "mb-4", "tracking-tight"], [1, "text-muted-foreground", "max-w-md", "mb-8", "font-medium"], [1, "flex", "flex-col", "sm:flex-row", "gap-4"], ["routerLink", "/community", 1, "px-8", "py-3", "bg-primary", "text-white", "rounded-2xl", "font-black", "shadow-lg", "shadow-primary/30", "hover:bg-primary/90", "hover:-translate-y-1", "active:scale-95", "transition-all", "flex", "items-center", "gap-3"], [1, "fas", "fa-home"], [1, "px-8", "py-3", "bg-secondary", "text-foreground", "rounded-2xl", "font-black", "hover:bg-secondary/80", "hover:-translate-y-1", "active:scale-95", "transition-all", "flex", "items-center", "gap-3", "border", "border-border/40", 3, "click"], [1, "fas", "fa-arrow-left"], [1, "mt-16", "grid", "grid-cols-2", "gap-8", "opacity-40", "grayscale", "grayscale-[50%]"], [1, "flex", "items-center", "gap-2", "font-black", "text-xs", "uppercase", "tracking-widest", "text-muted-foreground"], [1, "w-8", "h-[2px]", "bg-primary"], [1, "flex", "items-center", "gap-2", "font-black", "text-xs", "uppercase", "tracking-widest", "text-muted-foreground", "justify-end"]],
      template: function NotFoundComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "404");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "i", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h2", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Lost in Gear?");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " The page you're looking for appears to have drifted off track. Let's get you back on the right road. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 7)(11, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, " Back to Feed ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NotFoundComponent_Template_button_click_14_listener() {
            return ctx.goBack();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "i", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " Go Back ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 12)(18, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](19, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " COMMUNITY CAR ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " FULLY2CAR ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_shared_components_errors_not-found_not-found_component_ts.js.map