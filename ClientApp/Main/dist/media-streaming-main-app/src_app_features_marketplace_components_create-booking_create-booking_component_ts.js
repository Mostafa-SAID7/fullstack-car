"use strict";
(self["webpackChunkmedia_streaming_main_app"] = self["webpackChunkmedia_streaming_main_app"] || []).push([["src_app_features_marketplace_components_create-booking_create-booking_component_ts"],{

/***/ 881:
/*!********************************************************************************************!*\
  !*** ./src/app/features/marketplace/components/create-booking/create-booking.component.ts ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateBookingComponent: () => (/* binding */ CreateBookingComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);


class CreateBookingComponent {
  ngOnInit() {}
  static {
    this.ɵfac = function CreateBookingComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CreateBookingComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CreateBookingComponent,
      selectors: [["app-create-booking"]],
      decls: 9,
      vars: 0,
      consts: [[1, "container"], [1, "placeholder"], [1, "fas", "fa-plus-circle"]],
      template: function CreateBookingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Create Booking");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Book a service appointment");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "i", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Booking form will be implemented here");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule],
      styles: [".container[_ngcontent-%COMP%] {\n  padding: 2rem;\n  text-align: center;\n}\n\n.placeholder[_ngcontent-%COMP%] {\n  padding: 3rem;\n  color: #6b7280;\n}\n\n.placeholder[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyZWF0ZS1ib29raW5nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDSTtFQUFhLGFBQUE7RUFBZSxrQkFBQTtBQUVoQzs7QUFESTtFQUFlLGFBQUE7RUFBZSxjQUFBO0FBTWxDOztBQUxJO0VBQWlCLGVBQUE7RUFBaUIsbUJBQUE7QUFVdEMiLCJmaWxlIjoiY3JlYXRlLWJvb2tpbmcuY29tcG9uZW50LnRzIiwic291cmNlc0NvbnRlbnQiOlsiXG4gICAgLmNvbnRhaW5lciB7IHBhZGRpbmc6IDJyZW07IHRleHQtYWxpZ246IGNlbnRlcjsgfVxuICAgIC5wbGFjZWhvbGRlciB7IHBhZGRpbmc6IDNyZW07IGNvbG9yOiAjNmI3MjgwOyB9XG4gICAgLnBsYWNlaG9sZGVyIGkgeyBmb250LXNpemU6IDNyZW07IG1hcmdpbi1ib3R0b206IDFyZW07IH1cbiAgIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZmVhdHVyZXMvbWFya2V0cGxhY2UvY29tcG9uZW50cy9jcmVhdGUtYm9va2luZy9jcmVhdGUtYm9va2luZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0k7RUFBYSxhQUFBO0VBQWUsa0JBQUE7QUFFaEM7O0FBREk7RUFBZSxhQUFBO0VBQWUsY0FBQTtBQU1sQzs7QUFMSTtFQUFpQixlQUFBO0VBQWlCLG1CQUFBO0FBVXRDO0FBQ0Esd2xCQUF3bEIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAuY29udGFpbmVyIHsgcGFkZGluZzogMnJlbTsgdGV4dC1hbGlnbjogY2VudGVyOyB9XG4gICAgLnBsYWNlaG9sZGVyIHsgcGFkZGluZzogM3JlbTsgY29sb3I6ICM2YjcyODA7IH1cbiAgICAucGxhY2Vob2xkZXIgaSB7IGZvbnQtc2l6ZTogM3JlbTsgbWFyZ2luLWJvdHRvbTogMXJlbTsgfVxuICAiXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_features_marketplace_components_create-booking_create-booking_component_ts.js.map