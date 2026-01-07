"use strict";
(self["webpackChunkcommunity_car_app"] = self["webpackChunkcommunity_car_app"] || []).push([["src_app_features_auth_auth_module_ts"],{

/***/ 663:
/*!**********************************************!*\
  !*** ./src/app/features/auth/auth.module.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthModule: () => (/* binding */ AuthModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _pages_login_login_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages/login/login.component */ 3090);
/* harmony import */ var _pages_register_register_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/register/register.component */ 7046);
/* harmony import */ var _pages_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/forgot-password/forgot-password.component */ 7398);
/* harmony import */ var _pages_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/reset-password/reset-password.component */ 5390);
/* harmony import */ var _pages_confirm_email_confirm_email_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/confirm-email/confirm-email.component */ 8034);
/* harmony import */ var _core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/guards/auth.guard */ 4978);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 7580);











const routes = [{
  path: '',
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_5__.GuestGuard],
  children: [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }, {
    path: 'login',
    component: _pages_login_login_component__WEBPACK_IMPORTED_MODULE_0__.LoginComponent
  }, {
    path: 'register',
    component: _pages_register_register_component__WEBPACK_IMPORTED_MODULE_1__.RegisterComponent
  }, {
    path: 'forgot-password',
    component: _pages_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_2__.ForgotPasswordComponent
  }, {
    path: 'reset-password',
    component: _pages_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_3__.ResetPasswordComponent
  }, {
    path: 'confirm-email',
    component: _pages_confirm_email_confirm_email_component__WEBPACK_IMPORTED_MODULE_4__.ConfirmEmailComponent
  }]
}];
class AuthModule {
  static {
    this.ɵfac = function AuthModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AuthModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
      type: AuthModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forChild(routes), _pages_login_login_component__WEBPACK_IMPORTED_MODULE_0__.LoginComponent, _pages_register_register_component__WEBPACK_IMPORTED_MODULE_1__.RegisterComponent, _pages_confirm_email_confirm_email_component__WEBPACK_IMPORTED_MODULE_4__.ConfirmEmailComponent, _pages_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_2__.ForgotPasswordComponent, _pages_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_3__.ResetPasswordComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AuthModule, {
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule, _pages_login_login_component__WEBPACK_IMPORTED_MODULE_0__.LoginComponent, _pages_register_register_component__WEBPACK_IMPORTED_MODULE_1__.RegisterComponent, _pages_confirm_email_confirm_email_component__WEBPACK_IMPORTED_MODULE_4__.ConfirmEmailComponent, _pages_forgot_password_forgot_password_component__WEBPACK_IMPORTED_MODULE_2__.ForgotPasswordComponent, _pages_reset_password_reset_password_component__WEBPACK_IMPORTED_MODULE_3__.ResetPasswordComponent]
  });
})();

/***/ }),

/***/ 1415:
/*!**************************************************************************!*\
  !*** ./src/app/shared/components/oauth-button/oauth-button.component.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OAuthButtonComponent: () => (/* binding */ OAuthButtonComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);




function OAuthButtonComponent_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "i", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
class OAuthButtonComponent {
  constructor() {
    this.loading = false;
    this.disabled = false;
    this.clicked = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.providerConfigs = {
      google: {
        name: 'Google',
        icon: 'fa-brands fa-google',
        color: '#fff',
        textColor: '#757575'
      },
      github: {
        name: 'GitHub',
        icon: 'fa-brands fa-github',
        color: '#24292e',
        textColor: '#fff'
      },
      facebook: {
        name: 'Facebook',
        icon: 'fa-brands fa-facebook',
        color: '#1877f2',
        textColor: '#fff'
      },
      twitter: {
        name: 'Twitter',
        icon: 'fa-brands fa-twitter',
        color: '#1da1f2',
        textColor: '#fff'
      },
      microsoft: {
        name: 'Microsoft',
        icon: 'fa-brands fa-microsoft',
        color: '#00a4ef',
        textColor: '#fff'
      }
    };
  }
  get config() {
    return this.providerConfigs[this.provider];
  }
  get buttonStyle() {
    return {
      'background-color': this.config.color,
      'color': this.config.textColor,
      'border-color': this.provider === 'google' ? '#dadce0' : this.config.color
    };
  }
  onClick() {
    if (!this.loading && !this.disabled) {
      this.clicked.emit();
    }
  }
  static {
    this.ɵfac = function OAuthButtonComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OAuthButtonComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: OAuthButtonComponent,
      selectors: [["app-oauth-button"]],
      inputs: {
        provider: "provider",
        loading: "loading",
        disabled: "disabled"
      },
      outputs: {
        clicked: "clicked"
      },
      decls: 6,
      vars: 8,
      consts: [["type", "button", 1, "oauth-button", 3, "click", "ngStyle", "disabled"], ["class", "oauth-button__spinner", 4, "ngIf"], [1, "oauth-button__content"], [1, "oauth-button__icon"], [1, "oauth-button__text"], [1, "oauth-button__spinner"], [1, "fa-solid", "fa-spinner", "fa-spin"]],
      template: function OAuthButtonComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function OAuthButtonComponent_Template_button_click_0_listener() {
            return ctx.onClick();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, OAuthButtonComponent_span_1_Template, 2, 0, "span", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "i", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", ctx.buttonStyle)("disabled", ctx.disabled || ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("oauth-button__content--hidden", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"](ctx.config.icon);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Continue with ", ctx.config.name, "");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgStyle],
      styles: [".oauth-button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  padding: 12px 20px;\n  font-size: 15px;\n  font-weight: 600;\n  border: 2px solid;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.3s;\n  position: relative;\n}\n.oauth-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.oauth-button[_ngcontent-%COMP%]:focus {\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);\n}\n.oauth-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.oauth-button__content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  transition: opacity 0.3s;\n}\n.oauth-button__content--hidden[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.oauth-button__icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.oauth-button__text[_ngcontent-%COMP%] {\n  font-size: 15px;\n}\n.oauth-button__spinner[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 1.2em;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9hdXRoLWJ1dHRvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxvQkFBQTtFQUNBLGtCQUFBO0FBQ0o7QUFDSTtFQUNJLDJCQUFBO0VBQ0EsMENBQUE7QUFDUjtBQUVJO0VBQ0ksYUFBQTtFQUNBLHdDQUFBO0FBQVI7QUFHSTtFQUNJLG1CQUFBO0VBQ0EsWUFBQTtBQURSO0FBSUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0Esd0JBQUE7QUFGUjtBQUlRO0VBQ0ksVUFBQTtBQUZaO0FBTUk7RUFDSSxlQUFBO0FBSlI7QUFPSTtFQUNJLGVBQUE7QUFMUjtBQVFJO0VBQ0ksa0JBQUE7RUFDQSxTQUFBO0VBQ0EsUUFBQTtFQUNBLGdDQUFBO0VBQ0EsZ0JBQUE7QUFOUiIsImZpbGUiOiJvYXV0aC1idXR0b24uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIub2F1dGgtYnV0dG9uIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIHBhZGRpbmc6IDEycHggMjBweDtcclxuICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHRyYW5zaXRpb246IGFsbCAwLjNzO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxMnB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XHJcbiAgICB9XHJcblxyXG4gICAgJjpmb2N1cyB7XHJcbiAgICAgICAgb3V0bGluZTogbm9uZTtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDAgMCAzcHggcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG4gICAgfVxyXG5cclxuICAgICY6ZGlzYWJsZWQge1xyXG4gICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbiAgICAgICAgb3BhY2l0eTogMC42O1xyXG4gICAgfVxyXG5cclxuICAgICZfX2NvbnRlbnQge1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICBnYXA6IDEycHg7XHJcbiAgICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjNzO1xyXG5cclxuICAgICAgICAmLS1oaWRkZW4ge1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19pY29uIHtcclxuICAgICAgICBmb250LXNpemU6IDIwcHg7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fdGV4dCB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgfVxyXG5cclxuICAgICZfX3NwaW5uZXIge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICBsZWZ0OiA1MCU7XHJcbiAgICAgICAgdG9wOiA1MCU7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XHJcbiAgICAgICAgZm9udC1zaXplOiAxLjJlbTtcclxuICAgIH1cclxufSJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvb2F1dGgtYnV0dG9uL29hdXRoLWJ1dHRvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxvQkFBQTtFQUNBLGtCQUFBO0FBQ0o7QUFDSTtFQUNJLDJCQUFBO0VBQ0EsMENBQUE7QUFDUjtBQUVJO0VBQ0ksYUFBQTtFQUNBLHdDQUFBO0FBQVI7QUFHSTtFQUNJLG1CQUFBO0VBQ0EsWUFBQTtBQURSO0FBSUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0Esd0JBQUE7QUFGUjtBQUlRO0VBQ0ksVUFBQTtBQUZaO0FBTUk7RUFDSSxlQUFBO0FBSlI7QUFPSTtFQUNJLGVBQUE7QUFMUjtBQVFJO0VBQ0ksa0JBQUE7RUFDQSxTQUFBO0VBQ0EsUUFBQTtFQUNBLGdDQUFBO0VBQ0EsZ0JBQUE7QUFOUjtBQUNBLHd6RUFBd3pFIiwic291cmNlc0NvbnRlbnQiOlsiLm9hdXRoLWJ1dHRvbiB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBwYWRkaW5nOiAxMnB4IDIwcHg7XHJcbiAgICBmb250LXNpemU6IDE1cHg7XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgYm9yZGVyOiAycHggc29saWQ7XHJcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcztcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbiAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCA0cHggMTJweCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xyXG4gICAgfVxyXG5cclxuICAgICY6Zm9jdXMge1xyXG4gICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgM3B4IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICAgIH1cclxuXHJcbiAgICAmOmRpc2FibGVkIHtcclxuICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG4gICAgICAgIG9wYWNpdHk6IDAuNjtcclxuICAgIH1cclxuXHJcbiAgICAmX19jb250ZW50IHtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgZ2FwOiAxMnB4O1xyXG4gICAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcztcclxuXHJcbiAgICAgICAgJi0taGlkZGVuIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJl9faWNvbiB7XHJcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgfVxyXG5cclxuICAgICZfX3RleHQge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgIH1cclxuXHJcbiAgICAmX19zcGlubmVyIHtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgbGVmdDogNTAlO1xyXG4gICAgICAgIHRvcDogNTAlO1xyXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMS4yZW07XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 2853:
/*!************************************************************************!*\
  !*** ./src/app/shared/components/form-button/form-button.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormButtonComponent: () => (/* binding */ FormButtonComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);



const _c0 = ["*"];
function FormButtonComponent_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "span", 5);
  }
  if (rf & 2) {
    const ripple_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("left", ripple_r1.x, "px")("top", ripple_r1.y, "px");
  }
}
function FormButtonComponent_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "i", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function FormButtonComponent_ng_container_4_i_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "i", 9);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"]("fa-solid " + ctx_r1.icon);
  }
}
function FormButtonComponent_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormButtonComponent_ng_container_4_i_1_Template, 1, 2, "i", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.icon);
  }
}
function FormButtonComponent_ng_container_5_i_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "i", 13);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"]("fa-solid " + ctx_r1.icon);
  }
}
function FormButtonComponent_ng_container_5_i_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "i", 14);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"]("fa-solid " + ctx_r1.icon);
  }
}
function FormButtonComponent_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormButtonComponent_ng_container_5_i_1_Template, 1, 2, "i", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, FormButtonComponent_ng_container_5_i_4_Template, 1, 2, "i", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.icon && ctx_r1.iconPosition === "left");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r1.icon && ctx_r1.iconPosition === "right");
  }
}
class FormButtonComponent {
  constructor() {
    this.variant = 'primary';
    this.size = 'md';
    this.type = 'button';
    this.loading = false;
    this.disabled = false;
    this.fullWidth = false;
    this.rounded = false; // Fully rounded button
    this.iconPosition = 'left';
    this.iconOnly = false; // Icon-only button (no text)
    this.ripple = true; // Material Design ripple effect
    this.shadow = false; // Add shadow
    this.elevated = false; // Elevated style
    // Ripple effect state
    this.ripples = [];
    this.rippleId = 0;
  }
  get buttonClasses() {
    const classes = ['form-button', `form-button--${this.variant}`, `form-button--${this.size}`];
    if (this.fullWidth) classes.push('form-button--full-width');
    if (this.loading) classes.push('form-button--loading');
    if (this.rounded) classes.push('form-button--rounded');
    if (this.iconOnly) classes.push('form-button--icon-only');
    if (this.shadow) classes.push('form-button--shadow');
    if (this.elevated) classes.push('form-button--elevated');
    return classes.join(' ');
  }
  onClick(event) {
    if (this.ripple && !this.disabled && !this.loading) {
      this.createRipple(event);
    }
  }
  createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = this.rippleId++;
    this.ripples.push({
      x,
      y,
      id
    });
    // Remove ripple after animation
    setTimeout(() => {
      this.ripples = this.ripples.filter(r => r.id !== id);
    }, 600);
  }
  static {
    this.ɵfac = function FormButtonComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FormButtonComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FormButtonComponent,
      selectors: [["app-form-button"]],
      hostBindings: function FormButtonComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FormButtonComponent_click_HostBindingHandler($event) {
            return ctx.onClick($event);
          });
        }
      },
      inputs: {
        variant: "variant",
        size: "size",
        type: "type",
        loading: "loading",
        disabled: "disabled",
        fullWidth: "fullWidth",
        rounded: "rounded",
        icon: "icon",
        iconPosition: "iconPosition",
        iconOnly: "iconOnly",
        ripple: "ripple",
        shadow: "shadow",
        elevated: "elevated"
      },
      ngContentSelectors: _c0,
      decls: 6,
      vars: 9,
      consts: [[3, "type", "disabled", "ngClass"], ["class", "form-button__ripple", 3, "left", "top", 4, "ngFor", "ngForOf"], ["class", "form-button__spinner", 4, "ngIf"], [1, "form-button__content"], [4, "ngIf"], [1, "form-button__ripple"], [1, "form-button__spinner"], [1, "fa-solid", "fa-spinner", "fa-spin"], ["class", "form-button__icon-only", 3, "class", 4, "ngIf"], [1, "form-button__icon-only"], ["class", "form-button__icon form-button__icon--left", 3, "class", 4, "ngIf"], [1, "form-button__text"], ["class", "form-button__icon form-button__icon--right", 3, "class", 4, "ngIf"], [1, "form-button__icon", "form-button__icon--left"], [1, "form-button__icon", "form-button__icon--right"]],
      template: function FormButtonComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormButtonComponent_span_1_Template, 1, 4, "span", 1)(2, FormButtonComponent_span_2_Template, 2, 0, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, FormButtonComponent_ng_container_4_Template, 2, 1, "ng-container", 4)(5, FormButtonComponent_ng_container_5_Template, 5, 2, "ng-container", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("type", ctx.type)("disabled", ctx.disabled || ctx.loading)("ngClass", ctx.buttonClasses);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.ripples);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("form-button__content--hidden", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.iconOnly);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.iconOnly);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf],
      styles: ["@keyframes _ngcontent-%COMP%_ripple-effect {\n  0% {\n    transform: scale(0);\n    opacity: 0.5;\n  }\n  100% {\n    transform: scale(4);\n    opacity: 0;\n  }\n}\n.form-button[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 600;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  border: 2px solid transparent;\n  font-family: inherit;\n  overflow: hidden;\n  white-space: nowrap;\n}\n.form-button[_ngcontent-%COMP%]:focus {\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);\n}\n.form-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.form-button[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: scale(0.98);\n}\n.form-button--xs[_ngcontent-%COMP%] {\n  padding: 6px 12px;\n  font-size: 12px;\n  gap: 4px;\n}\n.form-button--sm[_ngcontent-%COMP%] {\n  padding: 8px 16px;\n  font-size: 14px;\n  gap: 6px;\n}\n.form-button--md[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  font-size: 16px;\n  gap: 8px;\n}\n.form-button--lg[_ngcontent-%COMP%] {\n  padding: 16px 32px;\n  font-size: 18px;\n  gap: 10px;\n}\n.form-button--xl[_ngcontent-%COMP%] {\n  padding: 20px 40px;\n  font-size: 20px;\n  gap: 12px;\n}\n.form-button--primary[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n}\n.form-button--primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #5568d3 0%, #63408a 100%);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);\n}\n.form-button--secondary[_ngcontent-%COMP%] {\n  background: var(--secondary-color, #6c757d);\n  color: white;\n}\n.form-button--secondary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--secondary-color-dark, #545b62);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(108, 117, 125, 0.3);\n}\n.form-button--success[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);\n  color: white;\n}\n.form-button--success[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #0e8074 0%, #2dd36a 100%);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(17, 153, 142, 0.4);\n}\n.form-button--warning[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);\n  color: white;\n}\n.form-button--warning[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #e67fe6 0%, #e04558 100%);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(240, 147, 251, 0.4);\n}\n.form-button--danger[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #f857a6 0%, #ff5858 100%);\n  color: white;\n}\n.form-button--danger[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: linear-gradient(135deg, #e74593 0%, #e54545 100%);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(248, 87, 166, 0.4);\n}\n.form-button--outline[_ngcontent-%COMP%] {\n  background: transparent;\n  border-color: var(--primary-color, #007bff);\n  color: var(--primary-color, #007bff);\n}\n.form-button--outline[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--primary-color, #007bff);\n  color: white;\n  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);\n}\n.form-button--ghost[_ngcontent-%COMP%] {\n  background: transparent;\n  color: var(--text-color, #333);\n}\n.form-button--ghost[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: rgba(0, 0, 0, 0.05);\n}\n.form-button--full-width[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.form-button--rounded[_ngcontent-%COMP%] {\n  border-radius: 50px;\n}\n.form-button--shadow[_ngcontent-%COMP%] {\n  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);\n}\n.form-button--elevated[_ngcontent-%COMP%] {\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);\n}\n.form-button--elevated[_ngcontent-%COMP%]:hover:not(:disabled) {\n  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);\n}\n.form-button--icon-only[_ngcontent-%COMP%] {\n  padding: 12px;\n  aspect-ratio: 1;\n  border-radius: 50%;\n}\n.form-button--icon-only.form-button--xs[_ngcontent-%COMP%] {\n  padding: 6px;\n}\n.form-button--icon-only.form-button--sm[_ngcontent-%COMP%] {\n  padding: 8px;\n}\n.form-button--icon-only.form-button--md[_ngcontent-%COMP%] {\n  padding: 12px;\n}\n.form-button--icon-only.form-button--lg[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n.form-button--icon-only.form-button--xl[_ngcontent-%COMP%] {\n  padding: 20px;\n}\n.form-button__content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: inherit;\n  transition: opacity 0.3s;\n  position: relative;\n  z-index: 1;\n}\n.form-button__content--hidden[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.form-button__text[_ngcontent-%COMP%] {\n  line-height: 1;\n}\n.form-button__icon[_ngcontent-%COMP%] {\n  font-size: 1em;\n  line-height: 1;\n}\n.form-button__icon--left[_ngcontent-%COMP%] {\n  margin-right: 4px;\n}\n.form-button__icon--right[_ngcontent-%COMP%] {\n  margin-left: 4px;\n}\n.form-button__icon-only[_ngcontent-%COMP%] {\n  font-size: 1.2em;\n  line-height: 1;\n}\n.form-button__spinner[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 1.2em;\n  z-index: 2;\n}\n.form-button--loading[_ngcontent-%COMP%] {\n  cursor: wait;\n}\n.form-button__ripple[_ngcontent-%COMP%] {\n  position: absolute;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.6);\n  width: 20px;\n  height: 20px;\n  margin-left: -10px;\n  margin-top: -10px;\n  pointer-events: none;\n  animation: _ngcontent-%COMP%_ripple-effect 0.6s ease-out;\n  z-index: 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm0tYnV0dG9uLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0k7SUFDSSxtQkFBQTtJQUNBLFlBQUE7RUFDTjtFQUVFO0lBQ0ksbUJBQUE7SUFDQSxVQUFBO0VBQU47QUFDRjtBQUdBO0VBQ0ksa0JBQUE7RUFDQSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLGlEQUFBO0VBQ0EsNkJBQUE7RUFDQSxvQkFBQTtFQUNBLGdCQUFBO0VBQ0EsbUJBQUE7QUFESjtBQUdJO0VBQ0ksYUFBQTtFQUNBLDRDQUFBO0FBRFI7QUFJSTtFQUNJLG1CQUFBO0VBQ0EsWUFBQTtBQUZSO0FBS0k7RUFDSSxzQkFBQTtBQUhSO0FBT0k7RUFDSSxpQkFBQTtFQUNBLGVBQUE7RUFDQSxRQUFBO0FBTFI7QUFRSTtFQUNJLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLFFBQUE7QUFOUjtBQVNJO0VBQ0ksa0JBQUE7RUFDQSxlQUFBO0VBQ0EsUUFBQTtBQVBSO0FBVUk7RUFDSSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxTQUFBO0FBUlI7QUFXSTtFQUNJLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLFNBQUE7QUFUUjtBQWFJO0VBQ0ksNkRBQUE7RUFDQSxZQUFBO0FBWFI7QUFhUTtFQUNJLDZEQUFBO0VBQ0EsMkJBQUE7RUFDQSwrQ0FBQTtBQVhaO0FBZUk7RUFDSSwyQ0FBQTtFQUNBLFlBQUE7QUFiUjtBQWVRO0VBQ0ksZ0RBQUE7RUFDQSwyQkFBQTtFQUNBLCtDQUFBO0FBYlo7QUFpQkk7RUFDSSw2REFBQTtFQUNBLFlBQUE7QUFmUjtBQWlCUTtFQUNJLDZEQUFBO0VBQ0EsMkJBQUE7RUFDQSw4Q0FBQTtBQWZaO0FBbUJJO0VBQ0ksNkRBQUE7RUFDQSxZQUFBO0FBakJSO0FBbUJRO0VBQ0ksNkRBQUE7RUFDQSwyQkFBQTtFQUNBLCtDQUFBO0FBakJaO0FBcUJJO0VBQ0ksNkRBQUE7RUFDQSxZQUFBO0FBbkJSO0FBcUJRO0VBQ0ksNkRBQUE7RUFDQSwyQkFBQTtFQUNBLDhDQUFBO0FBbkJaO0FBdUJJO0VBQ0ksdUJBQUE7RUFDQSwyQ0FBQTtFQUNBLG9DQUFBO0FBckJSO0FBdUJRO0VBQ0kseUNBQUE7RUFDQSxZQUFBO0VBQ0EsNkNBQUE7QUFyQlo7QUF5Qkk7RUFDSSx1QkFBQTtFQUNBLDhCQUFBO0FBdkJSO0FBeUJRO0VBQ0ksK0JBQUE7QUF2Qlo7QUE0Qkk7RUFDSSxXQUFBO0FBMUJSO0FBNkJJO0VBQ0ksbUJBQUE7QUEzQlI7QUE4Qkk7RUFDSSx5Q0FBQTtBQTVCUjtBQStCSTtFQUNJLDBDQUFBO0FBN0JSO0FBK0JRO0VBQ0ksMENBQUE7QUE3Qlo7QUFpQ0k7RUFDSSxhQUFBO0VBQ0EsZUFBQTtFQUNBLGtCQUFBO0FBL0JSO0FBaUNRO0VBQ0ksWUFBQTtBQS9CWjtBQWtDUTtFQUNJLFlBQUE7QUFoQ1o7QUFtQ1E7RUFDSSxhQUFBO0FBakNaO0FBb0NRO0VBQ0ksYUFBQTtBQWxDWjtBQXFDUTtFQUNJLGFBQUE7QUFuQ1o7QUF3Q0k7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0Esd0JBQUE7RUFDQSxrQkFBQTtFQUNBLFVBQUE7QUF0Q1I7QUF3Q1E7RUFDSSxVQUFBO0FBdENaO0FBMENJO0VBQ0ksY0FBQTtBQXhDUjtBQTJDSTtFQUNJLGNBQUE7RUFDQSxjQUFBO0FBekNSO0FBMkNRO0VBQ0ksaUJBQUE7QUF6Q1o7QUE0Q1E7RUFDSSxnQkFBQTtBQTFDWjtBQThDSTtFQUNJLGdCQUFBO0VBQ0EsY0FBQTtBQTVDUjtBQWdESTtFQUNJLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFFBQUE7RUFDQSxnQ0FBQTtFQUNBLGdCQUFBO0VBQ0EsVUFBQTtBQTlDUjtBQWlESTtFQUNJLFlBQUE7QUEvQ1I7QUFtREk7RUFDSSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0NBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxvQkFBQTtFQUNBLHNDQUFBO0VBQ0EsVUFBQTtBQWpEUiIsImZpbGUiOiJmb3JtLWJ1dHRvbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBrZXlmcmFtZXMgcmlwcGxlLWVmZmVjdCB7XHJcbiAgICAwJSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwKTtcclxuICAgICAgICBvcGFjaXR5OiAwLjU7XHJcbiAgICB9XHJcblxyXG4gICAgMTAwJSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSg0KTtcclxuICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgfVxyXG59XHJcblxyXG4uZm9ybS1idXR0b24ge1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKTtcclxuICAgIGJvcmRlcjogMnB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG4gICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuXHJcbiAgICAmOmZvY3VzIHtcclxuICAgICAgICBvdXRsaW5lOiBub25lO1xyXG4gICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDAsIDEyMywgMjU1LCAwLjIpO1xyXG4gICAgfVxyXG5cclxuICAgICY6ZGlzYWJsZWQge1xyXG4gICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbiAgICAgICAgb3BhY2l0eTogMC42O1xyXG4gICAgfVxyXG5cclxuICAgICY6YWN0aXZlOm5vdCg6ZGlzYWJsZWQpIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNpemVzXHJcbiAgICAmLS14cyB7XHJcbiAgICAgICAgcGFkZGluZzogNnB4IDEycHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgIGdhcDogNHB4O1xyXG4gICAgfVxyXG5cclxuICAgICYtLXNtIHtcclxuICAgICAgICBwYWRkaW5nOiA4cHggMTZweDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgZ2FwOiA2cHg7XHJcbiAgICB9XHJcblxyXG4gICAgJi0tbWQge1xyXG4gICAgICAgIHBhZGRpbmc6IDEycHggMjRweDtcclxuICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgZ2FwOiA4cHg7XHJcbiAgICB9XHJcblxyXG4gICAgJi0tbGcge1xyXG4gICAgICAgIHBhZGRpbmc6IDE2cHggMzJweDtcclxuICAgICAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICAgICAgZ2FwOiAxMHB4O1xyXG4gICAgfVxyXG5cclxuICAgICYtLXhsIHtcclxuICAgICAgICBwYWRkaW5nOiAyMHB4IDQwcHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgIGdhcDogMTJweDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBWYXJpYW50c1xyXG4gICAgJi0tcHJpbWFyeSB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzY2N2VlYSAwJSwgIzc2NGJhMiAxMDAlKTtcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcblxyXG4gICAgICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNTU2OGQzIDAlLCAjNjM0MDhhIDEwMCUpO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggcmdiYSgxMDIsIDEyNiwgMjM0LCAwLjQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmLS1zZWNvbmRhcnkge1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLXNlY29uZGFyeS1jb2xvciwgIzZjNzU3ZCk7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG5cclxuICAgICAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tc2Vjb25kYXJ5LWNvbG9yLWRhcmssICM1NDViNjIpO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggcmdiYSgxMDgsIDExNywgMTI1LCAwLjMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmLS1zdWNjZXNzIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMTE5OThlIDAlLCAjMzhlZjdkIDEwMCUpO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuXHJcbiAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICMwZTgwNzQgMCUsICMyZGQzNmEgMTAwJSk7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCA4cHggMjBweCByZ2JhKDE3LCAxNTMsIDE0MiwgMC40KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi0td2FybmluZyB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2YwOTNmYiAwJSwgI2Y1NTc2YyAxMDAlKTtcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcblxyXG4gICAgICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjZTY3ZmU2IDAlLCAjZTA0NTU4IDEwMCUpO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggcmdiYSgyNDAsIDE0NywgMjUxLCAwLjQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmLS1kYW5nZXIge1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNmODU3YTYgMCUsICNmZjU4NTggMTAwJSk7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG5cclxuICAgICAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2U3NDU5MyAwJSwgI2U1NDU0NSAxMDAlKTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDhweCAyMHB4IHJnYmEoMjQ4LCA4NywgMTY2LCAwLjQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmLS1vdXRsaW5lIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgICAgICBib3JkZXItY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuXHJcbiAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSgwLCAxMjMsIDI1NSwgMC4zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi0tZ2hvc3Qge1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yLCAjMzMzKTtcclxuXHJcbiAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4wNSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vZGlmaWVyc1xyXG4gICAgJi0tZnVsbC13aWR0aCB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICB9XHJcblxyXG4gICAgJi0tcm91bmRlZCB7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTBweDtcclxuICAgIH1cclxuXHJcbiAgICAmLS1zaGFkb3cge1xyXG4gICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDE0cHggcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG4gICAgfVxyXG5cclxuICAgICYtLWVsZXZhdGVkIHtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDhweCAyNHB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XHJcblxyXG4gICAgICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDEycHggMzJweCByZ2JhKDAsIDAsIDAsIDAuMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICYtLWljb24tb25seSB7XHJcbiAgICAgICAgcGFkZGluZzogMTJweDtcclxuICAgICAgICBhc3BlY3QtcmF0aW86IDE7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG5cclxuICAgICAgICAmLmZvcm0tYnV0dG9uLS14cyB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICYuZm9ybS1idXR0b24tLXNtIHtcclxuICAgICAgICAgICAgcGFkZGluZzogOHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi5mb3JtLWJ1dHRvbi0tbWQge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxMnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi5mb3JtLWJ1dHRvbi0tbGcge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi5mb3JtLWJ1dHRvbi0teGwge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDb250ZW50XHJcbiAgICAmX19jb250ZW50IHtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgZ2FwOiBpbmhlcml0O1xyXG4gICAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcztcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgei1pbmRleDogMTtcclxuXHJcbiAgICAgICAgJi0taGlkZGVuIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJl9fdGV4dCB7XHJcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcbiAgICB9XHJcblxyXG4gICAgJl9faWNvbiB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxZW07XHJcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XHJcblxyXG4gICAgICAgICYtLWxlZnQge1xyXG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDRweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICYtLXJpZ2h0IHtcclxuICAgICAgICAgICAgbWFyZ2luLWxlZnQ6IDRweDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJl9faWNvbi1vbmx5IHtcclxuICAgICAgICBmb250LXNpemU6IDEuMmVtO1xyXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExvYWRpbmcgc3RhdGVcclxuICAgICZfX3NwaW5uZXIge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICBsZWZ0OiA1MCU7XHJcbiAgICAgICAgdG9wOiA1MCU7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XHJcbiAgICAgICAgZm9udC1zaXplOiAxLjJlbTtcclxuICAgICAgICB6LWluZGV4OiAyO1xyXG4gICAgfVxyXG5cclxuICAgICYtLWxvYWRpbmcge1xyXG4gICAgICAgIGN1cnNvcjogd2FpdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSaXBwbGUgZWZmZWN0XHJcbiAgICAmX19yaXBwbGUge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYpO1xyXG4gICAgICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgICAgIGhlaWdodDogMjBweDtcclxuICAgICAgICBtYXJnaW4tbGVmdDogLTEwcHg7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogLTEwcHg7XHJcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcbiAgICAgICAgYW5pbWF0aW9uOiByaXBwbGUtZWZmZWN0IDAuNnMgZWFzZS1vdXQ7XHJcbiAgICAgICAgei1pbmRleDogMDtcclxuICAgIH1cclxufSJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZm9ybS1idXR0b24vZm9ybS1idXR0b24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSTtJQUNJLG1CQUFBO0lBQ0EsWUFBQTtFQUNOO0VBRUU7SUFDSSxtQkFBQTtJQUNBLFVBQUE7RUFBTjtBQUNGO0FBR0E7RUFDSSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0EsaURBQUE7RUFDQSw2QkFBQTtFQUNBLG9CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtQkFBQTtBQURKO0FBR0k7RUFDSSxhQUFBO0VBQ0EsNENBQUE7QUFEUjtBQUlJO0VBQ0ksbUJBQUE7RUFDQSxZQUFBO0FBRlI7QUFLSTtFQUNJLHNCQUFBO0FBSFI7QUFPSTtFQUNJLGlCQUFBO0VBQ0EsZUFBQTtFQUNBLFFBQUE7QUFMUjtBQVFJO0VBQ0ksaUJBQUE7RUFDQSxlQUFBO0VBQ0EsUUFBQTtBQU5SO0FBU0k7RUFDSSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxRQUFBO0FBUFI7QUFVSTtFQUNJLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLFNBQUE7QUFSUjtBQVdJO0VBQ0ksa0JBQUE7RUFDQSxlQUFBO0VBQ0EsU0FBQTtBQVRSO0FBYUk7RUFDSSw2REFBQTtFQUNBLFlBQUE7QUFYUjtBQWFRO0VBQ0ksNkRBQUE7RUFDQSwyQkFBQTtFQUNBLCtDQUFBO0FBWFo7QUFlSTtFQUNJLDJDQUFBO0VBQ0EsWUFBQTtBQWJSO0FBZVE7RUFDSSxnREFBQTtFQUNBLDJCQUFBO0VBQ0EsK0NBQUE7QUFiWjtBQWlCSTtFQUNJLDZEQUFBO0VBQ0EsWUFBQTtBQWZSO0FBaUJRO0VBQ0ksNkRBQUE7RUFDQSwyQkFBQTtFQUNBLDhDQUFBO0FBZlo7QUFtQkk7RUFDSSw2REFBQTtFQUNBLFlBQUE7QUFqQlI7QUFtQlE7RUFDSSw2REFBQTtFQUNBLDJCQUFBO0VBQ0EsK0NBQUE7QUFqQlo7QUFxQkk7RUFDSSw2REFBQTtFQUNBLFlBQUE7QUFuQlI7QUFxQlE7RUFDSSw2REFBQTtFQUNBLDJCQUFBO0VBQ0EsOENBQUE7QUFuQlo7QUF1Qkk7RUFDSSx1QkFBQTtFQUNBLDJDQUFBO0VBQ0Esb0NBQUE7QUFyQlI7QUF1QlE7RUFDSSx5Q0FBQTtFQUNBLFlBQUE7RUFDQSw2Q0FBQTtBQXJCWjtBQXlCSTtFQUNJLHVCQUFBO0VBQ0EsOEJBQUE7QUF2QlI7QUF5QlE7RUFDSSwrQkFBQTtBQXZCWjtBQTRCSTtFQUNJLFdBQUE7QUExQlI7QUE2Qkk7RUFDSSxtQkFBQTtBQTNCUjtBQThCSTtFQUNJLHlDQUFBO0FBNUJSO0FBK0JJO0VBQ0ksMENBQUE7QUE3QlI7QUErQlE7RUFDSSwwQ0FBQTtBQTdCWjtBQWlDSTtFQUNJLGFBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7QUEvQlI7QUFpQ1E7RUFDSSxZQUFBO0FBL0JaO0FBa0NRO0VBQ0ksWUFBQTtBQWhDWjtBQW1DUTtFQUNJLGFBQUE7QUFqQ1o7QUFvQ1E7RUFDSSxhQUFBO0FBbENaO0FBcUNRO0VBQ0ksYUFBQTtBQW5DWjtBQXdDSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSx3QkFBQTtFQUNBLGtCQUFBO0VBQ0EsVUFBQTtBQXRDUjtBQXdDUTtFQUNJLFVBQUE7QUF0Q1o7QUEwQ0k7RUFDSSxjQUFBO0FBeENSO0FBMkNJO0VBQ0ksY0FBQTtFQUNBLGNBQUE7QUF6Q1I7QUEyQ1E7RUFDSSxpQkFBQTtBQXpDWjtBQTRDUTtFQUNJLGdCQUFBO0FBMUNaO0FBOENJO0VBQ0ksZ0JBQUE7RUFDQSxjQUFBO0FBNUNSO0FBZ0RJO0VBQ0ksa0JBQUE7RUFDQSxTQUFBO0VBQ0EsUUFBQTtFQUNBLGdDQUFBO0VBQ0EsZ0JBQUE7RUFDQSxVQUFBO0FBOUNSO0FBaURJO0VBQ0ksWUFBQTtBQS9DUjtBQW1ESTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQ0FBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtFQUNBLG9CQUFBO0VBQ0Esc0NBQUE7RUFDQSxVQUFBO0FBakRSO0FBQ0EsZy9VQUFnL1UiLCJzb3VyY2VzQ29udGVudCI6WyJAa2V5ZnJhbWVzIHJpcHBsZS1lZmZlY3Qge1xyXG4gICAgMCUge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XHJcbiAgICAgICAgb3BhY2l0eTogMC41O1xyXG4gICAgfVxyXG5cclxuICAgIDEwMCUge1xyXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoNCk7XHJcbiAgICAgICAgb3BhY2l0eTogMDtcclxuICAgIH1cclxufVxyXG5cclxuLmZvcm0tYnV0dG9uIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSk7XHJcbiAgICBib3JkZXI6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcclxuICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcblxyXG4gICAgJjpmb2N1cyB7XHJcbiAgICAgICAgb3V0bGluZTogbm9uZTtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDAgMCAzcHggcmdiYSgwLCAxMjMsIDI1NSwgMC4yKTtcclxuICAgIH1cclxuXHJcbiAgICAmOmRpc2FibGVkIHtcclxuICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG4gICAgICAgIG9wYWNpdHk6IDAuNjtcclxuICAgIH1cclxuXHJcbiAgICAmOmFjdGl2ZTpub3QoOmRpc2FibGVkKSB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaXplc1xyXG4gICAgJi0teHMge1xyXG4gICAgICAgIHBhZGRpbmc6IDZweCAxMnB4O1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICBnYXA6IDRweDtcclxuICAgIH1cclxuXHJcbiAgICAmLS1zbSB7XHJcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIGdhcDogNnB4O1xyXG4gICAgfVxyXG5cclxuICAgICYtLW1kIHtcclxuICAgICAgICBwYWRkaW5nOiAxMnB4IDI0cHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgIGdhcDogOHB4O1xyXG4gICAgfVxyXG5cclxuICAgICYtLWxnIHtcclxuICAgICAgICBwYWRkaW5nOiAxNnB4IDMycHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICAgIGdhcDogMTBweDtcclxuICAgIH1cclxuXHJcbiAgICAmLS14bCB7XHJcbiAgICAgICAgcGFkZGluZzogMjBweCA0MHB4O1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgICBnYXA6IDEycHg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVmFyaWFudHNcclxuICAgICYtLXByaW1hcnkge1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2NjdlZWEgMCUsICM3NjRiYTIgMTAwJSk7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG5cclxuICAgICAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzU1NjhkMyAwJSwgIzYzNDA4YSAxMDAlKTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDhweCAyMHB4IHJnYmEoMTAyLCAxMjYsIDIzNCwgMC40KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi0tc2Vjb25kYXJ5IHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zZWNvbmRhcnktY29sb3IsICM2Yzc1N2QpO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuXHJcbiAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLXNlY29uZGFyeS1jb2xvci1kYXJrLCAjNTQ1YjYyKTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDhweCAyMHB4IHJnYmEoMTA4LCAxMTcsIDEyNSwgMC4zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi0tc3VjY2VzcyB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzExOTk4ZSAwJSwgIzM4ZWY3ZCAxMDAlKTtcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcblxyXG4gICAgICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMGU4MDc0IDAlLCAjMmRkMzZhIDEwMCUpO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggcmdiYSgxNywgMTUzLCAxNDIsIDAuNCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICYtLXdhcm5pbmcge1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNmMDkzZmIgMCUsICNmNTU3NmMgMTAwJSk7XHJcbiAgICAgICAgY29sb3I6IHdoaXRlO1xyXG5cclxuICAgICAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2U2N2ZlNiAwJSwgI2UwNDU1OCAxMDAlKTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDhweCAyMHB4IHJnYmEoMjQwLCAxNDcsIDI1MSwgMC40KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi0tZGFuZ2VyIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjZjg1N2E2IDAlLCAjZmY1ODU4IDEwMCUpO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuXHJcbiAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNlNzQ1OTMgMCUsICNlNTQ1NDUgMTAwJSk7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCA4cHggMjBweCByZ2JhKDI0OCwgODcsIDE2NiwgMC40KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJi0tb3V0bGluZSB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcblxyXG4gICAgICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxMnB4IHJnYmEoMCwgMTIzLCAyNTUsIDAuMyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICYtLWdob3N0IHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvciwgIzMzMyk7XHJcblxyXG4gICAgICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMDUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBNb2RpZmllcnNcclxuICAgICYtLWZ1bGwtd2lkdGgge1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgfVxyXG5cclxuICAgICYtLXJvdW5kZWQge1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwcHg7XHJcbiAgICB9XHJcblxyXG4gICAgJi0tc2hhZG93IHtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxNHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICAgIH1cclxuXHJcbiAgICAmLS1lbGV2YXRlZCB7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCA4cHggMjRweCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xyXG5cclxuICAgICAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxMnB4IDMycHggcmdiYSgwLCAwLCAwLCAwLjIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmLS1pY29uLW9ubHkge1xyXG4gICAgICAgIHBhZGRpbmc6IDEycHg7XHJcbiAgICAgICAgYXNwZWN0LXJhdGlvOiAxO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuXHJcbiAgICAgICAgJi5mb3JtLWJ1dHRvbi0teHMge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA2cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmLmZvcm0tYnV0dG9uLS1zbSB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDhweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICYuZm9ybS1idXR0b24tLW1kIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMTJweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICYuZm9ybS1idXR0b24tLWxnIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMTZweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICYuZm9ybS1idXR0b24tLXhsIHtcclxuICAgICAgICAgICAgcGFkZGluZzogMjBweDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udGVudFxyXG4gICAgJl9fY29udGVudCB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGdhcDogaW5oZXJpdDtcclxuICAgICAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3M7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIHotaW5kZXg6IDE7XHJcblxyXG4gICAgICAgICYtLWhpZGRlbiB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX3RleHQge1xyXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG4gICAgfVxyXG5cclxuICAgICZfX2ljb24ge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMWVtO1xyXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xyXG5cclxuICAgICAgICAmLS1sZWZ0IHtcclxuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiA0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmLS1yaWdodCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiA0cHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX2ljb24tb25seSB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxLjJlbTtcclxuICAgICAgICBsaW5lLWhlaWdodDogMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBMb2FkaW5nIHN0YXRlXHJcbiAgICAmX19zcGlubmVyIHtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgbGVmdDogNTAlO1xyXG4gICAgICAgIHRvcDogNTAlO1xyXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMS4yZW07XHJcbiAgICAgICAgei1pbmRleDogMjtcclxuICAgIH1cclxuXHJcbiAgICAmLS1sb2FkaW5nIHtcclxuICAgICAgICBjdXJzb3I6IHdhaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmlwcGxlIGVmZmVjdFxyXG4gICAgJl9fcmlwcGxlIHtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC42KTtcclxuICAgICAgICB3aWR0aDogMjBweDtcclxuICAgICAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICAgICAgbWFyZ2luLWxlZnQ6IC0xMHB4O1xyXG4gICAgICAgIG1hcmdpbi10b3A6IC0xMHB4O1xyXG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgICAgIGFuaW1hdGlvbjogcmlwcGxlLWVmZmVjdCAwLjZzIGVhc2Utb3V0O1xyXG4gICAgICAgIHotaW5kZXg6IDA7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 3061:
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/form-input/form-input.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormInputComponent: () => (/* binding */ FormInputComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);





function FormInputComponent_label_1_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function FormInputComponent_label_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "label", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormInputComponent_label_1_span_2_Template, 2, 0, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", ctx_r0.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.label, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.required);
  }
}
function FormInputComponent_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "i");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"]("fa-solid " + (ctx_r0.prefixIcon || ctx_r0.icon));
  }
}
function FormInputComponent_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FormInputComponent_button_5_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r0.togglePasswordVisibility());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "i");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("aria-label", ctx_r0.isPasswordVisible ? "Hide password" : "Show password");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"](ctx_r0.isPasswordVisible ? "fa-solid fa-eye-slash" : "fa-solid fa-eye");
  }
}
function FormInputComponent_span_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "i");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"]("fa-solid " + ctx_r0.suffixIcon);
  }
}
function FormInputComponent_p_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.hint, " ");
  }
}
function FormInputComponent_div_8_p_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "i", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const error_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", error_r3, " ");
  }
}
function FormInputComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormInputComponent_div_8_p_1_Template, 3, 1, "p", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.errorMessages);
  }
}
class FormInputComponent {
  constructor() {
    this.label = '';
    this.placeholder = '';
    this.type = 'text';
    this.showToggle = false; // For password visibility toggle
    this.required = false;
    this.disabled = false;
    this.value = '';
    this.isPasswordVisible = false;
    this.isTouched = false;
    this.isFocused = false;
    this.onChange = () => {};
    this.onTouched = () => {};
  }
  ngOnInit() {
    // Support both formControl binding and ControlValueAccessor
  }
  get currentType() {
    if (this.type === 'password' && this.showToggle && this.isPasswordVisible) {
      return 'text';
    }
    return this.type;
  }
  get hasError() {
    if (this.formControl) {
      return this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
    }
    return false;
  }
  get errorMessages() {
    if (!this.formControl || !this.hasError) return [];
    const errors = this.formControl.errors;
    const messages = [];
    if (errors) {
      if (errors['required']) messages.push(`${this.label || 'This field'} is required`);
      if (errors['email']) messages.push('Please enter a valid email address');
      if (errors['minlength']) {
        messages.push(`Minimum ${errors['minlength'].requiredLength} characters required`);
      }
      if (errors['maxlength']) {
        messages.push(`Maximum ${errors['maxlength'].requiredLength} characters allowed`);
      }
      if (errors['pattern']) messages.push('Please enter a valid format');
    }
    return messages;
  }
  writeValue(value) {
    this.value = value || '';
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  onInputChange(event) {
    const target = event.target;
    this.value = target.value;
    this.onChange(this.value);
  }
  onBlur() {
    this.isTouched = true;
    this.isFocused = false;
    this.onTouched();
  }
  onFocus() {
    this.isFocused = true;
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  static {
    this.ɵfac = function FormInputComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FormInputComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FormInputComponent,
      selectors: [["app-form-input"]],
      inputs: {
        label: "label",
        placeholder: "placeholder",
        type: "type",
        icon: "icon",
        prefixIcon: "prefixIcon",
        suffixIcon: "suffixIcon",
        showToggle: "showToggle",
        errorMessage: "errorMessage",
        hint: "hint",
        required: "required",
        disabled: "disabled",
        formControl: "formControl"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
        provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NG_VALUE_ACCESSOR,
        useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => FormInputComponent),
        multi: true
      }])],
      decls: 9,
      vars: 19,
      consts: [[1, "form-input"], ["class", "form-input__label", 3, "for", 4, "ngIf"], [1, "form-input__container"], ["class", "form-input__icon form-input__icon--prefix", 4, "ngIf"], [1, "form-input__field", 3, "input", "blur", "focus", "id", "type", "placeholder", "disabled", "value"], ["type", "button", "class", "form-input__icon form-input__icon--suffix form-input__toggle", 3, "click", 4, "ngIf"], ["class", "form-input__icon form-input__icon--suffix", 4, "ngIf"], ["class", "form-input__hint", 4, "ngIf"], ["class", "form-input__errors", 4, "ngIf"], [1, "form-input__label", 3, "for"], ["class", "form-input__required", 4, "ngIf"], [1, "form-input__required"], [1, "form-input__icon", "form-input__icon--prefix"], ["type", "button", 1, "form-input__icon", "form-input__icon--suffix", "form-input__toggle", 3, "click"], [1, "form-input__icon", "form-input__icon--suffix"], [1, "form-input__hint"], [1, "form-input__errors"], ["class", "form-input__error", 4, "ngFor", "ngForOf"], [1, "form-input__error"], [1, "fa-solid", "fa-circle-exclamation"]],
      template: function FormInputComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormInputComponent_label_1_Template, 3, 3, "label", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, FormInputComponent_span_3_Template, 2, 2, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "input", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("input", function FormInputComponent_Template_input_input_4_listener($event) {
            return ctx.onInputChange($event);
          })("blur", function FormInputComponent_Template_input_blur_4_listener() {
            return ctx.onBlur();
          })("focus", function FormInputComponent_Template_input_focus_4_listener() {
            return ctx.onFocus();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, FormInputComponent_button_5_Template, 2, 3, "button", 5)(6, FormInputComponent_span_6_Template, 2, 2, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, FormInputComponent_p_7_Template, 2, 1, "p", 7)(8, FormInputComponent_div_8_Template, 2, 1, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("form-input--error", ctx.hasError)("form-input--focused", ctx.isFocused);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.label);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.prefixIcon || ctx.icon);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("form-input__field--with-prefix", ctx.prefixIcon || ctx.icon)("form-input__field--with-suffix", ctx.suffixIcon || ctx.showToggle);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", ctx.label)("type", ctx.currentType)("placeholder", ctx.placeholder)("disabled", ctx.disabled)("value", ctx.value);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.type === "password" && ctx.showToggle);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.suffixIcon && !(ctx.type === "password" && ctx.showToggle));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hint && !ctx.hasError);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.hasError);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.ReactiveFormsModule],
      styles: [".form-input[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.form-input__label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--text-color, #333);\n  margin-bottom: 8px;\n}\n.form-input__required[_ngcontent-%COMP%] {\n  color: var(--danger-color, #dc3545);\n  margin-left: 2px;\n}\n.form-input__container[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.form-input__field[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 16px;\n  font-size: 14px;\n  border: 2px solid var(--border-color, #e0e0e0);\n  border-radius: 8px;\n  transition: all 0.3s;\n  background: var(--input-background, #fff);\n  color: var(--text-color, #333);\n}\n.form-input__field[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--primary-color, #007bff);\n  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);\n}\n.form-input__field[_ngcontent-%COMP%]::placeholder {\n  color: var(--text-muted, #999);\n}\n.form-input__field[_ngcontent-%COMP%]:disabled {\n  background: var(--disabled-background, #f5f5f5);\n  cursor: not-allowed;\n  opacity: 0.6;\n}\n.form-input__field--with-prefix[_ngcontent-%COMP%] {\n  padding-left: 44px;\n}\n.form-input__field--with-suffix[_ngcontent-%COMP%] {\n  padding-right: 44px;\n}\n.form-input__icon[_ngcontent-%COMP%] {\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 40px;\n  height: 40px;\n  color: var(--text-muted, #999);\n  pointer-events: none;\n}\n.form-input__icon--prefix[_ngcontent-%COMP%] {\n  left: 4px;\n}\n.form-input__icon--suffix[_ngcontent-%COMP%] {\n  right: 4px;\n}\n.form-input__toggle[_ngcontent-%COMP%] {\n  pointer-events: all;\n  background: none;\n  border: none;\n  cursor: pointer;\n  transition: color 0.3s;\n}\n.form-input__toggle[_ngcontent-%COMP%]:hover {\n  color: var(--primary-color, #007bff);\n}\n.form-input__hint[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  font-size: 12px;\n  color: var(--text-muted, #666);\n}\n.form-input__errors[_ngcontent-%COMP%] {\n  margin-top: 6px;\n}\n.form-input__error[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--danger-color, #dc3545);\n  margin-bottom: 4px;\n}\n.form-input__error[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 14px;\n}\n.form-input__error[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.form-input--error[_ngcontent-%COMP%]   .form-input__field[_ngcontent-%COMP%] {\n  border-color: var(--danger-color, #dc3545);\n}\n.form-input--error[_ngcontent-%COMP%]   .form-input__field[_ngcontent-%COMP%]:focus {\n  border-color: var(--danger-color, #dc3545);\n  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);\n}\n.form-input--focused[_ngcontent-%COMP%]   .form-input__icon[_ngcontent-%COMP%] {\n  color: var(--primary-color, #007bff);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm0taW5wdXQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxtQkFBQTtBQUNKO0FBQ0k7RUFDSSxjQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsOEJBQUE7RUFDQSxrQkFBQTtBQUNSO0FBRUk7RUFDSSxtQ0FBQTtFQUNBLGdCQUFBO0FBQVI7QUFHSTtFQUNJLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0FBRFI7QUFJSTtFQUNJLFdBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7RUFDQSw4Q0FBQTtFQUNBLGtCQUFBO0VBQ0Esb0JBQUE7RUFDQSx5Q0FBQTtFQUNBLDhCQUFBO0FBRlI7QUFJUTtFQUNJLGFBQUE7RUFDQSwyQ0FBQTtFQUNBLDRDQUFBO0FBRlo7QUFLUTtFQUNJLDhCQUFBO0FBSFo7QUFNUTtFQUNJLCtDQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0FBSlo7QUFPUTtFQUNJLGtCQUFBO0FBTFo7QUFRUTtFQUNJLG1CQUFBO0FBTlo7QUFVSTtFQUNJLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDhCQUFBO0VBQ0Esb0JBQUE7QUFSUjtBQVVRO0VBQ0ksU0FBQTtBQVJaO0FBV1E7RUFDSSxVQUFBO0FBVFo7QUFhSTtFQUNJLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLHNCQUFBO0FBWFI7QUFhUTtFQUNJLG9DQUFBO0FBWFo7QUFlSTtFQUNJLGVBQUE7RUFDQSxlQUFBO0VBQ0EsOEJBQUE7QUFiUjtBQWdCSTtFQUNJLGVBQUE7QUFkUjtBQWlCSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7RUFDQSxlQUFBO0VBQ0EsbUNBQUE7RUFDQSxrQkFBQTtBQWZSO0FBaUJRO0VBQ0ksZUFBQTtBQWZaO0FBa0JRO0VBQ0ksZ0JBQUE7QUFoQlo7QUFxQkk7RUFDSSwwQ0FBQTtBQW5CUjtBQXFCUTtFQUNJLDBDQUFBO0VBQ0EsNENBQUE7QUFuQlo7QUF3Qkk7RUFDSSxvQ0FBQTtBQXRCUiIsImZpbGUiOiJmb3JtLWlucHV0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmZvcm0taW5wdXQge1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuXHJcbiAgICAmX19sYWJlbCB7XHJcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtY29sb3IsICMzMzMpO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgIH1cclxuXHJcbiAgICAmX19yZXF1aXJlZCB7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLWRhbmdlci1jb2xvciwgI2RjMzU0NSk7XHJcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDJweDtcclxuICAgIH1cclxuXHJcbiAgICAmX19jb250YWluZXIge1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fZmllbGQge1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yLCAjZTBlMGUwKTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3M7XHJcbiAgICAgICAgYmFja2dyb3VuZDogdmFyKC0taW5wdXQtYmFja2dyb3VuZCwgI2ZmZik7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtY29sb3IsICMzMzMpO1xyXG5cclxuICAgICAgICAmOmZvY3VzIHtcclxuICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcclxuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgM3B4IHJnYmEoMCwgMTIzLCAyNTUsIDAuMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmOjpwbGFjZWhvbGRlciB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjOTk5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICY6ZGlzYWJsZWQge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1kaXNhYmxlZC1iYWNrZ3JvdW5kLCAjZjVmNWY1KTtcclxuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxuICAgICAgICAgICAgb3BhY2l0eTogMC42O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi0td2l0aC1wcmVmaXgge1xyXG4gICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDQ0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmLS13aXRoLXN1ZmZpeCB7XHJcbiAgICAgICAgICAgIHBhZGRpbmctcmlnaHQ6IDQ0cHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX2ljb24ge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgd2lkdGg6IDQwcHg7XHJcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjOTk5KTtcclxuICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcclxuXHJcbiAgICAgICAgJi0tcHJlZml4IHtcclxuICAgICAgICAgICAgbGVmdDogNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi0tc3VmZml4IHtcclxuICAgICAgICAgICAgcmlnaHQ6IDRweDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJl9fdG9nZ2xlIHtcclxuICAgICAgICBwb2ludGVyLWV2ZW50czogYWxsO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzO1xyXG5cclxuICAgICAgICAmOmhvdmVyIHtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19oaW50IHtcclxuICAgICAgICBtYXJnaW4tdG9wOiA2cHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjNjY2KTtcclxuICAgIH1cclxuXHJcbiAgICAmX19lcnJvcnMge1xyXG4gICAgICAgIG1hcmdpbi10b3A6IDZweDtcclxuICAgIH1cclxuXHJcbiAgICAmX19lcnJvciB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGdhcDogNnB4O1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tZGFuZ2VyLWNvbG9yLCAjZGMzNTQ1KTtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiA0cHg7XHJcblxyXG4gICAgICAgIGkge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmOmxhc3QtY2hpbGQge1xyXG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBFcnJvciBzdGF0ZVxyXG4gICAgJi0tZXJyb3IgJl9fZmllbGQge1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogdmFyKC0tZGFuZ2VyLWNvbG9yLCAjZGMzNTQ1KTtcclxuXHJcbiAgICAgICAgJjpmb2N1cyB7XHJcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyKC0tZGFuZ2VyLWNvbG9yLCAjZGMzNTQ1KTtcclxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgM3B4IHJnYmEoMjIwLCA1MywgNjksIDAuMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEZvY3VzZWQgc3RhdGVcclxuICAgICYtLWZvY3VzZWQgJl9faWNvbiB7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgfVxyXG59Il19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZm9ybS1pbnB1dC9mb3JtLWlucHV0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksbUJBQUE7QUFDSjtBQUNJO0VBQ0ksY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLDhCQUFBO0VBQ0Esa0JBQUE7QUFDUjtBQUVJO0VBQ0ksbUNBQUE7RUFDQSxnQkFBQTtBQUFSO0FBR0k7RUFDSSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtBQURSO0FBSUk7RUFDSSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0EsOENBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EseUNBQUE7RUFDQSw4QkFBQTtBQUZSO0FBSVE7RUFDSSxhQUFBO0VBQ0EsMkNBQUE7RUFDQSw0Q0FBQTtBQUZaO0FBS1E7RUFDSSw4QkFBQTtBQUhaO0FBTVE7RUFDSSwrQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtBQUpaO0FBT1E7RUFDSSxrQkFBQTtBQUxaO0FBUVE7RUFDSSxtQkFBQTtBQU5aO0FBVUk7RUFDSSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSw4QkFBQTtFQUNBLG9CQUFBO0FBUlI7QUFVUTtFQUNJLFNBQUE7QUFSWjtBQVdRO0VBQ0ksVUFBQTtBQVRaO0FBYUk7RUFDSSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxzQkFBQTtBQVhSO0FBYVE7RUFDSSxvQ0FBQTtBQVhaO0FBZUk7RUFDSSxlQUFBO0VBQ0EsZUFBQTtFQUNBLDhCQUFBO0FBYlI7QUFnQkk7RUFDSSxlQUFBO0FBZFI7QUFpQkk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0EsZUFBQTtFQUNBLG1DQUFBO0VBQ0Esa0JBQUE7QUFmUjtBQWlCUTtFQUNJLGVBQUE7QUFmWjtBQWtCUTtFQUNJLGdCQUFBO0FBaEJaO0FBcUJJO0VBQ0ksMENBQUE7QUFuQlI7QUFxQlE7RUFDSSwwQ0FBQTtFQUNBLDRDQUFBO0FBbkJaO0FBd0JJO0VBQ0ksb0NBQUE7QUF0QlI7QUFDQSw0MEtBQTQwSyIsInNvdXJjZXNDb250ZW50IjpbIi5mb3JtLWlucHV0IHtcclxuICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcblxyXG4gICAgJl9fbGFiZWwge1xyXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yLCAjMzMzKTtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fcmVxdWlyZWQge1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS1kYW5nZXItY29sb3IsICNkYzM1NDUpO1xyXG4gICAgICAgIG1hcmdpbi1sZWZ0OiAycHg7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fY29udGFpbmVyIHtcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgfVxyXG5cclxuICAgICZfX2ZpZWxkIHtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICBwYWRkaW5nOiAxMnB4IDE2cHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWJvcmRlci1jb2xvciwgI2UwZTBlMCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWlucHV0LWJhY2tncm91bmQsICNmZmYpO1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yLCAjMzMzKTtcclxuXHJcbiAgICAgICAgJjpmb2N1cyB7XHJcbiAgICAgICAgICAgIG91dGxpbmU6IG5vbmU7XHJcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDAsIDEyMywgMjU1LCAwLjEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJjo6cGxhY2Vob2xkZXIge1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCwgIzk5OSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmOmRpc2FibGVkIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tZGlzYWJsZWQtYmFja2dyb3VuZCwgI2Y1ZjVmNSk7XHJcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICYtLXdpdGgtcHJlZml4IHtcclxuICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiA0NHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi0td2l0aC1zdWZmaXgge1xyXG4gICAgICAgICAgICBwYWRkaW5nLXJpZ2h0OiA0NHB4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19pY29uIHtcclxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgIHdpZHRoOiA0MHB4O1xyXG4gICAgICAgIGhlaWdodDogNDBweDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCwgIzk5OSk7XHJcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XHJcblxyXG4gICAgICAgICYtLXByZWZpeCB7XHJcbiAgICAgICAgICAgIGxlZnQ6IDRweDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICYtLXN1ZmZpeCB7XHJcbiAgICAgICAgICAgIHJpZ2h0OiA0cHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX3RvZ2dsZSB7XHJcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IGFsbDtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcztcclxuXHJcbiAgICAgICAgJjpob3ZlciB7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJl9faGludCB7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogNnB4O1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCwgIzY2Nik7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fZXJyb3JzIHtcclxuICAgICAgICBtYXJnaW4tdG9wOiA2cHg7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fZXJyb3Ige1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICBnYXA6IDZweDtcclxuICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLWRhbmdlci1jb2xvciwgI2RjMzU0NSk7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogNHB4O1xyXG5cclxuICAgICAgICBpIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRXJyb3Igc3RhdGVcclxuICAgICYtLWVycm9yICZfX2ZpZWxkIHtcclxuICAgICAgICBib3JkZXItY29sb3I6IHZhcigtLWRhbmdlci1jb2xvciwgI2RjMzU0NSk7XHJcblxyXG4gICAgICAgICY6Zm9jdXMge1xyXG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcigtLWRhbmdlci1jb2xvciwgI2RjMzU0NSk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDIyMCwgNTMsIDY5LCAwLjEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBGb2N1c2VkIHN0YXRlXHJcbiAgICAmLS1mb2N1c2VkICZfX2ljb24ge1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 3090:
/*!**************************************************************!*\
  !*** ./src/app/features/auth/pages/login/login.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginComponent: () => (/* binding */ LoginComponent)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 6196);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _shared_components_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../shared/components/form-input/form-input.component */ 3061);
/* harmony import */ var _shared_components_form_button_form_button_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/components/form-button/form-button.component */ 2853);
/* harmony import */ var _shared_components_oauth_button_oauth_button_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/components/oauth-button/oauth-button.component */ 1415);
/* harmony import */ var _shared_components_auth_layout_auth_layout_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/auth-layout/auth-layout.component */ 8973);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 8010);
/* harmony import */ var _core_services_oauth_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../core/services/oauth.service */ 9303);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 2596);
















function LoginComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "i", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r0.error, " ");
  }
}
class LoginComponent {
  constructor(fb, authService, oauthService, router) {
    this.fb = fb;
    this.authService = authService;
    this.oauthService = oauthService;
    this.router = router;
    this.loading = false;
    this.error = null;
  }
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_8__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.Validators.email]],
      password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_8__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
  onSubmit() {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.loginForm.invalid) {
        Object.keys(_this.loginForm.controls).forEach(key => {
          _this.loginForm.get(key)?.markAsTouched();
        });
        return;
      }
      _this.loading = true;
      _this.error = null;
      const loginData = _this.loginForm.value;
      console.log('[Angular LoginComponent] Form data:', loginData);
      console.log('[Angular LoginComponent] Form valid:', _this.loginForm.valid);
      console.log('[Angular LoginComponent] Form errors:', _this.loginForm.errors);
      // Log individual field values and validation
      Object.keys(_this.loginForm.controls).forEach(key => {
        const control = _this.loginForm.get(key);
        console.log(`[Angular LoginComponent] Field ${key}:`, {
          value: control?.value,
          valid: control?.valid,
          errors: control?.errors
        });
      });
      try {
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.firstValueFrom)(_this.authService.login(loginData));
        console.log('[Angular LoginComponent] Login result:', result);
        if (result.succeeded) {
          console.log('[Angular LoginComponent] Login successful, navigating to app dashboard');
          _this.router.navigate(['/app/dashboard']);
        } else {
          const errorMessage = result.errors && result.errors.length > 0 ? result.errors.join(', ') : 'Login failed. Please try again.';
          console.error('[Angular LoginComponent] Login failed:', errorMessage);
          console.error('[Angular LoginComponent] Full result:', result);
          _this.error = errorMessage;
        }
      } catch (error) {
        console.error('[Angular LoginComponent] Login exception:', error);
        _this.error = error.message || 'Login failed. Please try again.';
      } finally {
        _this.loading = false;
      }
    })();
  }
  loginWithGoogle() {
    var _this2 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this2.oauthService.initializeGoogleAuth();
        console.log('Google login not implemented yet');
      } catch (error) {
        console.error('Google login error:', error);
      }
    })();
  }
  loginWithGitHub() {
    var _this3 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const authUrl = _this3.oauthService.getGitHubAuthUrl();
      window.location.href = authUrl;
    })();
  }
  loginWithFacebook() {
    var _this4 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this4.oauthService.initializeFacebookAuth();
        console.log('Facebook login not implemented yet');
      } catch (error) {
        console.error('Facebook login error:', error);
      }
    })();
  }
  get emailControl() {
    return this.loginForm.get('email');
  }
  get passwordControl() {
    return this.loginForm.get('password');
  }
  static {
    this.ɵfac = function LoginComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_5__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_oauth_service__WEBPACK_IMPORTED_MODULE_6__.OAuthService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
      type: LoginComponent,
      selectors: [["app-login"]],
      decls: 26,
      vars: 10,
      consts: [["title", "Welcome Back", "subtitle", "Sign in to continue to Fully2Car"], [3, "ngSubmit", "formGroup"], ["type", "email", "label", "Email Address", "placeholder", "Enter your email", "prefixIcon", "fa-envelope", 3, "formControl", "required"], ["type", "password", "label", "Password", "placeholder", "Enter your password", "prefixIcon", "fa-lock", 3, "formControl", "showToggle", "required"], [1, "login-options"], [1, "checkbox-container"], ["type", "checkbox", "formControlName", "rememberMe"], ["routerLink", "/auth/forgot-password", 1, "forgot-link"], ["class", "error-alert", 4, "ngIf"], ["type", "submit", "variant", "primary", "size", "lg", 3, "loading", "disabled", "fullWidth"], [1, "divider"], [1, "oauth-buttons"], ["provider", "google", 3, "clicked"], ["provider", "github", 3, "clicked"], ["provider", "facebook", 3, "clicked"], ["footer", "", 1, "auth-footer"], ["routerLink", "/auth/register", 1, "link-primary"], [1, "error-alert"], [1, "fa-solid", "fa-circle-exclamation"]],
      template: function LoginComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "app-auth-layout", 0)(1, "form", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngSubmit", function LoginComponent_Template_form_ngSubmit_1_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "app-form-input", 2)(3, "app-form-input", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "div", 4)(5, "label", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](6, "input", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8, "Remember me");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "a", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10, " Forgot password? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](11, LoginComponent_div_11_Template, 3, 1, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](12, "app-form-button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](13, " Sign In ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](14, "div", 10)(15, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](16, "Or continue with");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "div", 11)(18, "app-oauth-button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("clicked", function LoginComponent_Template_app_oauth_button_clicked_18_listener() {
            return ctx.loginWithGoogle();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "app-oauth-button", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("clicked", function LoginComponent_Template_app_oauth_button_clicked_19_listener() {
            return ctx.loginWithGitHub();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](20, "app-oauth-button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("clicked", function LoginComponent_Template_app_oauth_button_clicked_20_listener() {
            return ctx.loginWithFacebook();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](21, "div", 15)(22, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](23, " Don't have an account? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](24, "a", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](25, "Sign up");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("formGroup", ctx.loginForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("formControl", ctx.emailControl)("required", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("formControl", ctx.passwordControl)("showToggle", true)("required", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("loading", ctx.loading)("disabled", ctx.loginForm.invalid)("fullWidth", true);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControlDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterLink, _shared_components_form_input_form_input_component__WEBPACK_IMPORTED_MODULE_1__.FormInputComponent, _shared_components_form_button_form_button_component__WEBPACK_IMPORTED_MODULE_2__.FormButtonComponent, _shared_components_oauth_button_oauth_button_component__WEBPACK_IMPORTED_MODULE_3__.OAuthButtonComponent, _shared_components_auth_layout_auth_layout_component__WEBPACK_IMPORTED_MODULE_4__.AuthLayoutComponent],
      styles: [".login-options[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 24px;\n}\n\n.checkbox-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  font-size: 14px;\n  color: var(--text-color, #333);\n}\n.checkbox-container[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  cursor: pointer;\n}\n\n.forgot-link[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--primary-color, #007bff);\n  text-decoration: none;\n  font-weight: 600;\n}\n.forgot-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.error-alert[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 16px;\n  background: rgba(220, 53, 69, 0.1);\n  border: 1px solid var(--danger-color, #dc3545);\n  border-radius: 8px;\n  color: var(--danger-color, #dc3545);\n  font-size: 14px;\n  margin-bottom: 20px;\n}\n.error-alert[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n\n.divider[_ngcontent-%COMP%] {\n  position: relative;\n  text-align: center;\n  margin: 32px 0;\n}\n.divider[_ngcontent-%COMP%]::before {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 0;\n  right: 0;\n  height: 1px;\n  background: var(--border-color, #e0e0e0);\n}\n.divider[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  position: relative;\n  background: white;\n  padding: 0 16px;\n  font-size: 14px;\n  color: var(--text-muted, #666);\n}\n\n.oauth-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.auth-footer[_ngcontent-%COMP%] {\n  margin-top: 24px;\n}\n.auth-footer[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--text-muted, #666);\n  text-align: center;\n  margin: 0;\n}\n.auth-footer[_ngcontent-%COMP%]   .link-primary[_ngcontent-%COMP%] {\n  color: var(--primary-color, #007bff);\n  text-decoration: none;\n  font-weight: 600;\n  margin-left: 4px;\n}\n.auth-footer[_ngcontent-%COMP%]   .link-primary[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksYUFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtBQUNKOztBQUVBO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtFQUNBLGVBQUE7RUFDQSxlQUFBO0VBQ0EsOEJBQUE7QUFDSjtBQUNJO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0FBQ1I7O0FBR0E7RUFDSSxlQUFBO0VBQ0Esb0NBQUE7RUFDQSxxQkFBQTtFQUNBLGdCQUFBO0FBQUo7QUFFSTtFQUNJLDBCQUFBO0FBQVI7O0FBSUE7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQ0FBQTtFQUNBLDhDQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQ0FBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtBQURKO0FBR0k7RUFDSSxlQUFBO0FBRFI7O0FBS0E7RUFDSSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtBQUZKO0FBSUk7RUFDSSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxRQUFBO0VBQ0EsT0FBQTtFQUNBLFFBQUE7RUFDQSxXQUFBO0VBQ0Esd0NBQUE7QUFGUjtBQUtJO0VBQ0ksa0JBQUE7RUFDQSxpQkFBQTtFQUNBLGVBQUE7RUFDQSxlQUFBO0VBQ0EsOEJBQUE7QUFIUjs7QUFPQTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7QUFKSjs7QUFPQTtFQUNJLGdCQUFBO0FBSko7QUFNSTtFQUNJLGVBQUE7RUFDQSw4QkFBQTtFQUNBLGtCQUFBO0VBQ0EsU0FBQTtBQUpSO0FBT0k7RUFDSSxvQ0FBQTtFQUNBLHFCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtBQUxSO0FBT1E7RUFDSSwwQkFBQTtBQUxaIiwiZmlsZSI6ImxvZ2luLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxvZ2luLW9wdGlvbnMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG59XHJcblxyXG4uY2hlY2tib3gtY29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiA4cHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvciwgIzMzMyk7XHJcblxyXG4gICAgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdIHtcclxuICAgICAgICB3aWR0aDogMThweDtcclxuICAgICAgICBoZWlnaHQ6IDE4cHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgfVxyXG59XHJcblxyXG4uZm9yZ290LWxpbmsge1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuXHJcbiAgICAmOmhvdmVyIHtcclxuICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcclxuICAgIH1cclxufVxyXG5cclxuLmVycm9yLWFsZXJ0IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiAxMHB4O1xyXG4gICAgcGFkZGluZzogMTJweCAxNnB4O1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyMjAsIDUzLCA2OSwgMC4xKTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWRhbmdlci1jb2xvciwgI2RjMzU0NSk7XHJcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICBjb2xvcjogdmFyKC0tZGFuZ2VyLWNvbG9yLCAjZGMzNTQ1KTtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcblxyXG4gICAgaSB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgfVxyXG59XHJcblxyXG4uZGl2aWRlciB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBtYXJnaW46IDMycHggMDtcclxuXHJcbiAgICAmOjpiZWZvcmUge1xyXG4gICAgICAgIGNvbnRlbnQ6ICcnO1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICB0b3A6IDUwJTtcclxuICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICAgIGhlaWdodDogMXB4O1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWJvcmRlci1jb2xvciwgI2UwZTBlMCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BhbiB7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgICAgIHBhZGRpbmc6IDAgMTZweDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQsICM2NjYpO1xyXG4gICAgfVxyXG59XHJcblxyXG4ub2F1dGgtYnV0dG9ucyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGdhcDogMTJweDtcclxufVxyXG5cclxuLmF1dGgtZm9vdGVyIHtcclxuICAgIG1hcmdpbi10b3A6IDI0cHg7XHJcblxyXG4gICAgcCB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjNjY2KTtcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC5saW5rLXByaW1hcnkge1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICBtYXJnaW4tbGVmdDogNHB4O1xyXG5cclxuICAgICAgICAmOmhvdmVyIHtcclxuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZmVhdHVyZXMvYXV0aC9wYWdlcy9sb2dpbi9sb2dpbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGFBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBQUE7QUFDSjs7QUFFQTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7RUFDQSxlQUFBO0VBQ0EsZUFBQTtFQUNBLDhCQUFBO0FBQ0o7QUFDSTtFQUNJLFdBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtBQUNSOztBQUdBO0VBQ0ksZUFBQTtFQUNBLG9DQUFBO0VBQ0EscUJBQUE7RUFDQSxnQkFBQTtBQUFKO0FBRUk7RUFDSSwwQkFBQTtBQUFSOztBQUlBO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLGtCQUFBO0VBQ0Esa0NBQUE7RUFDQSw4Q0FBQTtFQUNBLGtCQUFBO0VBQ0EsbUNBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7QUFESjtBQUdJO0VBQ0ksZUFBQTtBQURSOztBQUtBO0VBQ0ksa0JBQUE7RUFDQSxrQkFBQTtFQUNBLGNBQUE7QUFGSjtBQUlJO0VBQ0ksV0FBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsV0FBQTtFQUNBLHdDQUFBO0FBRlI7QUFLSTtFQUNJLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0VBQ0EsZUFBQTtFQUNBLDhCQUFBO0FBSFI7O0FBT0E7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxTQUFBO0FBSko7O0FBT0E7RUFDSSxnQkFBQTtBQUpKO0FBTUk7RUFDSSxlQUFBO0VBQ0EsOEJBQUE7RUFDQSxrQkFBQTtFQUNBLFNBQUE7QUFKUjtBQU9JO0VBQ0ksb0NBQUE7RUFDQSxxQkFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7QUFMUjtBQU9RO0VBQ0ksMEJBQUE7QUFMWjtBQUNBLDQrSEFBNCtIIiwic291cmNlc0NvbnRlbnQiOlsiLmxvZ2luLW9wdGlvbnMge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG59XHJcblxyXG4uY2hlY2tib3gtY29udGFpbmVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiA4cHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvciwgIzMzMyk7XHJcblxyXG4gICAgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdIHtcclxuICAgICAgICB3aWR0aDogMThweDtcclxuICAgICAgICBoZWlnaHQ6IDE4cHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgfVxyXG59XHJcblxyXG4uZm9yZ290LWxpbmsge1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuXHJcbiAgICAmOmhvdmVyIHtcclxuICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcclxuICAgIH1cclxufVxyXG5cclxuLmVycm9yLWFsZXJ0IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgZ2FwOiAxMHB4O1xyXG4gICAgcGFkZGluZzogMTJweCAxNnB4O1xyXG4gICAgYmFja2dyb3VuZDogcmdiYSgyMjAsIDUzLCA2OSwgMC4xKTtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWRhbmdlci1jb2xvciwgI2RjMzU0NSk7XHJcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICBjb2xvcjogdmFyKC0tZGFuZ2VyLWNvbG9yLCAjZGMzNTQ1KTtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XHJcblxyXG4gICAgaSB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgfVxyXG59XHJcblxyXG4uZGl2aWRlciB7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBtYXJnaW46IDMycHggMDtcclxuXHJcbiAgICAmOjpiZWZvcmUge1xyXG4gICAgICAgIGNvbnRlbnQ6ICcnO1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICB0b3A6IDUwJTtcclxuICAgICAgICBsZWZ0OiAwO1xyXG4gICAgICAgIHJpZ2h0OiAwO1xyXG4gICAgICAgIGhlaWdodDogMXB4O1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWJvcmRlci1jb2xvciwgI2UwZTBlMCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BhbiB7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gICAgICAgIHBhZGRpbmc6IDAgMTZweDtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQsICM2NjYpO1xyXG4gICAgfVxyXG59XHJcblxyXG4ub2F1dGgtYnV0dG9ucyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGdhcDogMTJweDtcclxufVxyXG5cclxuLmF1dGgtZm9vdGVyIHtcclxuICAgIG1hcmdpbi10b3A6IDI0cHg7XHJcblxyXG4gICAgcCB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjNjY2KTtcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC5saW5rLXByaW1hcnkge1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICBtYXJnaW4tbGVmdDogNHB4O1xyXG5cclxuICAgICAgICAmOmhvdmVyIHtcclxuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 5390:
/*!********************************************************************************!*\
  !*** ./src/app/features/auth/pages/reset-password/reset-password.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResetPasswordComponent: () => (/* binding */ ResetPasswordComponent)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 6196);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 8010);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 2596);











function ResetPasswordComponent_span_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function ResetPasswordComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.error, " ");
  }
}
function ResetPasswordComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.success, " ");
  }
}
class ResetPasswordComponent {
  constructor(fb, authService, router, route) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.route = route;
    this.loading = false;
    this.error = null;
    this.success = null;
    this.token = null;
    this.email = null;
  }
  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.minLength(6)]],
      confirmPassword: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
    // Get token and email from query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      if (!this.token || !this.email) {
        this.error = 'Invalid reset link. Please request a new password reset.';
      }
    });
  }
  passwordMatchValidator(form) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({
        passwordMismatch: true
      });
      return {
        passwordMismatch: true
      };
    }
    return null;
  }
  onSubmit() {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.resetPasswordForm.invalid || !_this.token || !_this.email) return;
      _this.loading = true;
      _this.error = null;
      _this.success = null;
      try {
        const request = {
          email: _this.email,
          token: _this.token,
          newPassword: _this.resetPasswordForm.value.password,
          confirmPassword: _this.resetPasswordForm.value.confirmPassword
        };
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.firstValueFrom)(_this.authService.resetPassword(request));
        if (result?.succeeded) {
          _this.success = 'Password has been reset successfully. You can now sign in with your new password.';
          setTimeout(() => {
            _this.router.navigate(['/auth/login']);
          }, 2000);
        } else {
          _this.error = result?.errors?.[0] || 'Failed to reset password. Please try again.';
        }
      } catch (error) {
        _this.error = error.message || 'Failed to reset password. Please try again.';
      } finally {
        _this.loading = false;
      }
    })();
  }
  static {
    this.ɵfac = function ResetPasswordComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ResetPasswordComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__.ActivatedRoute));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: ResetPasswordComponent,
      selectors: [["app-reset-password"]],
      decls: 28,
      vars: 6,
      consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-gray-50", "py-12", "px-4", "sm:px-6", "lg:px-8"], [1, "max-w-md", "w-full", "space-y-8"], [1, "mt-6", "text-center", "text-3xl", "font-extrabold", "text-gray-900"], [1, "mt-2", "text-center", "text-sm", "text-gray-600"], [1, "mt-8", "space-y-6", 3, "ngSubmit", "formGroup"], [1, "space-y-4"], ["for", "password", 1, "block", "text-sm", "font-medium", "text-gray-700"], ["id", "password", "name", "password", "type", "password", "formControlName", "password", "required", "", "placeholder", "New password", 1, "mt-1", "appearance-none", "relative", "block", "w-full", "px-3", "py-2", "border", "border-gray-300", "placeholder-gray-500", "text-gray-900", "rounded-md", "focus:outline-none", "focus:ring-indigo-500", "focus:border-indigo-500", "sm:text-sm"], ["for", "confirmPassword", 1, "block", "text-sm", "font-medium", "text-gray-700"], ["id", "confirmPassword", "name", "confirmPassword", "type", "password", "formControlName", "confirmPassword", "required", "", "placeholder", "Confirm password", 1, "mt-1", "appearance-none", "relative", "block", "w-full", "px-3", "py-2", "border", "border-gray-300", "placeholder-gray-500", "text-gray-900", "rounded-md", "focus:outline-none", "focus:ring-indigo-500", "focus:border-indigo-500", "sm:text-sm"], ["type", "submit", 1, "group", "relative", "w-full", "flex", "justify-center", "py-2", "px-4", "border", "border-transparent", "text-sm", "font-medium", "rounded-md", "text-white", "bg-indigo-600", "hover:bg-indigo-700", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-indigo-500", "disabled:opacity-50", 3, "disabled"], ["class", "absolute left-0 inset-y-0 flex items-center pl-3", 4, "ngIf"], ["class", "text-red-600 text-sm text-center", 4, "ngIf"], ["class", "text-green-600 text-sm text-center", 4, "ngIf"], [1, "text-center"], [1, "text-sm", "text-gray-600"], ["routerLink", "/auth/login", 1, "font-medium", "text-indigo-600", "hover:text-indigo-500"], [1, "absolute", "left-0", "inset-y-0", "flex", "items-center", "pl-3"], [1, "animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-white"], [1, "text-red-600", "text-sm", "text-center"], [1, "text-green-600", "text-sm", "text-center"]],
      template: function ResetPasswordComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, " Reset your password ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, " Enter your new password below. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "form", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function ResetPasswordComponent_Template_form_ngSubmit_7_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 5)(9, "div")(10, "label", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, "New Password");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](12, "input", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "div")(14, "label", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "Confirm Password");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](16, "input", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "div")(18, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](19, ResetPasswordComponent_span_19_Template, 2, 0, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](21, ResetPasswordComponent_div_21_Template, 2, 1, "div", 12)(22, ResetPasswordComponent_div_22_Template, 2, 1, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "div", 14)(24, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](25, " Remember your password? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "a", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](27, " Sign in ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.resetPasswordForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.resetPasswordForm.invalid || ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx.loading ? "Resetting..." : "Reset password", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.success);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 6196:
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/firstValueFrom.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   firstValueFrom: () => (/* binding */ firstValueFrom)
/* harmony export */ });
/* harmony import */ var _util_EmptyError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/EmptyError */ 3335);
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Subscriber */ 9285);


function firstValueFrom(source, config) {
  const hasConfig = typeof config === 'object';
  return new Promise((resolve, reject) => {
    const subscriber = new _Subscriber__WEBPACK_IMPORTED_MODULE_0__.SafeSubscriber({
      next: value => {
        resolve(value);
        subscriber.unsubscribe();
      },
      error: reject,
      complete: () => {
        if (hasConfig) {
          resolve(config.defaultValue);
        } else {
          reject(new _util_EmptyError__WEBPACK_IMPORTED_MODULE_1__.EmptyError());
        }
      }
    });
    source.subscribe(subscriber);
  });
}

/***/ }),

/***/ 7046:
/*!********************************************************************!*\
  !*** ./src/app/features/auth/pages/register/register.component.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RegisterComponent: () => (/* binding */ RegisterComponent)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 6196);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 8010);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 2596);










function RegisterComponent_span_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function RegisterComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.error, " ");
  }
}
class RegisterComponent {
  constructor(fb, authService, router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.loading = false;
    this.error = null;
  }
  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]],
      lastName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]],
      email: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.email]],
      password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.minLength(6)]],
      confirmPassword: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]]
    });
  }
  onSubmit() {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.registerForm.invalid) return;
      _this.loading = true;
      _this.error = null;
      try {
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.firstValueFrom)(_this.authService.register(_this.registerForm.value));
        if (result.succeeded) {
          _this.router.navigate(['/app/dashboard']);
        } else {
          _this.error = result.errors && result.errors.length > 0 ? result.errors.join(', ') : 'Registration failed. Please try again.';
        }
      } catch (error) {
        _this.error = error.message || 'Registration failed. Please try again.';
      } finally {
        _this.loading = false;
      }
    })();
  }
  static {
    this.ɵfac = function RegisterComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || RegisterComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: RegisterComponent,
      selectors: [["app-register"]],
      decls: 38,
      vars: 5,
      consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-gray-50", "py-12", "px-4", "sm:px-6", "lg:px-8"], [1, "max-w-md", "w-full", "space-y-8"], [1, "mt-6", "text-center", "text-3xl", "font-extrabold", "text-gray-900"], [1, "mt-8", "space-y-6", 3, "ngSubmit", "formGroup"], [1, "space-y-4"], [1, "grid", "grid-cols-2", "gap-4"], ["for", "firstName", 1, "block", "text-sm", "font-medium", "text-gray-700"], ["id", "firstName", "name", "firstName", "type", "text", "formControlName", "firstName", "required", "", "placeholder", "First Name", 1, "mt-1", "appearance-none", "relative", "block", "w-full", "px-3", "py-2", "border", "border-gray-300", "placeholder-gray-500", "text-gray-900", "rounded-md", "focus:outline-none", "focus:ring-indigo-500", "focus:border-indigo-500", "sm:text-sm"], ["for", "lastName", 1, "block", "text-sm", "font-medium", "text-gray-700"], ["id", "lastName", "name", "lastName", "type", "text", "formControlName", "lastName", "required", "", "placeholder", "Last Name", 1, "mt-1", "appearance-none", "relative", "block", "w-full", "px-3", "py-2", "border", "border-gray-300", "placeholder-gray-500", "text-gray-900", "rounded-md", "focus:outline-none", "focus:ring-indigo-500", "focus:border-indigo-500", "sm:text-sm"], ["for", "email", 1, "block", "text-sm", "font-medium", "text-gray-700"], ["id", "email", "name", "email", "type", "email", "formControlName", "email", "required", "", "placeholder", "Email address", 1, "mt-1", "appearance-none", "relative", "block", "w-full", "px-3", "py-2", "border", "border-gray-300", "placeholder-gray-500", "text-gray-900", "rounded-md", "focus:outline-none", "focus:ring-indigo-500", "focus:border-indigo-500", "sm:text-sm"], ["for", "password", 1, "block", "text-sm", "font-medium", "text-gray-700"], ["id", "password", "name", "password", "type", "password", "formControlName", "password", "required", "", "placeholder", "Password", 1, "mt-1", "appearance-none", "relative", "block", "w-full", "px-3", "py-2", "border", "border-gray-300", "placeholder-gray-500", "text-gray-900", "rounded-md", "focus:outline-none", "focus:ring-indigo-500", "focus:border-indigo-500", "sm:text-sm"], ["for", "confirmPassword", 1, "block", "text-sm", "font-medium", "text-gray-700"], ["id", "confirmPassword", "name", "confirmPassword", "type", "password", "formControlName", "confirmPassword", "required", "", "placeholder", "Confirm Password", 1, "mt-1", "appearance-none", "relative", "block", "w-full", "px-3", "py-2", "border", "border-gray-300", "placeholder-gray-500", "text-gray-900", "rounded-md", "focus:outline-none", "focus:ring-indigo-500", "focus:border-indigo-500", "sm:text-sm"], ["type", "submit", 1, "group", "relative", "w-full", "flex", "justify-center", "py-2", "px-4", "border", "border-transparent", "text-sm", "font-medium", "rounded-md", "text-white", "bg-indigo-600", "hover:bg-indigo-700", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-indigo-500", "disabled:opacity-50", 3, "disabled"], ["class", "absolute left-0 inset-y-0 flex items-center pl-3", 4, "ngIf"], ["class", "text-red-600 text-sm text-center", 4, "ngIf"], [1, "text-center"], [1, "text-sm", "text-gray-600"], ["routerLink", "/auth/login", 1, "font-medium", "text-indigo-600", "hover:text-indigo-500"], [1, "absolute", "left-0", "inset-y-0", "flex", "items-center", "pl-3"], [1, "animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-white"], [1, "text-red-600", "text-sm", "text-center"]],
      template: function RegisterComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, " Create your account ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "form", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function RegisterComponent_Template_form_ngSubmit_5_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 4)(7, "div", 5)(8, "div")(9, "label", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "First Name");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "input", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div")(13, "label", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14, "Last Name");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](15, "input", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "div")(17, "label", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "Email");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](19, "input", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "div")(21, "label", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, "Password");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](23, "input", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](24, "div")(25, "label", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](26, "Confirm Password");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](27, "input", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "div")(29, "button", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](30, RegisterComponent_span_30_Template, 2, 0, "span", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](31);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](32, RegisterComponent_div_32_Template, 2, 1, "div", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "div", 19)(34, "span", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, " Already have an account? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "a", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, " Sign in ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.registerForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](24);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.registerForm.invalid || ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx.loading ? "Creating account..." : "Create account", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.error);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 7398:
/*!**********************************************************************************!*\
  !*** ./src/app/features/auth/pages/forgot-password/forgot-password.component.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ForgotPasswordComponent: () => (/* binding */ ForgotPasswordComponent)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 6196);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 8010);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 2596);











function ForgotPasswordComponent_span_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function ForgotPasswordComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.error, " ");
  }
}
function ForgotPasswordComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.success, " ");
  }
}
class ForgotPasswordComponent {
  constructor(fb, authService, router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.loading = false;
    this.error = null;
    this.success = null;
  }
  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.email]]
    });
  }
  onSubmit() {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.forgotPasswordForm.invalid) return;
      _this.loading = true;
      _this.error = null;
      _this.success = null;
      try {
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.firstValueFrom)(_this.authService.forgotPassword(_this.forgotPasswordForm.value));
        if (result?.succeeded) {
          _this.success = 'Password reset link has been sent to your email.';
        } else {
          _this.error = result?.errors?.[0] || 'Failed to send reset link. Please try again.';
        }
      } catch (error) {
        _this.error = error.message || 'Failed to send reset link. Please try again.';
      } finally {
        _this.loading = false;
      }
    })();
  }
  static {
    this.ɵfac = function ForgotPasswordComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ForgotPasswordComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: ForgotPasswordComponent,
      selectors: [["app-forgot-password"]],
      decls: 23,
      vars: 6,
      consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-gray-50", "py-12", "px-4", "sm:px-6", "lg:px-8"], [1, "max-w-md", "w-full", "space-y-8"], [1, "mt-6", "text-center", "text-3xl", "font-extrabold", "text-gray-900"], [1, "mt-2", "text-center", "text-sm", "text-gray-600"], [1, "mt-8", "space-y-6", 3, "ngSubmit", "formGroup"], ["for", "email", 1, "block", "text-sm", "font-medium", "text-gray-700"], ["id", "email", "name", "email", "type", "email", "formControlName", "email", "required", "", "placeholder", "Email address", 1, "mt-1", "appearance-none", "relative", "block", "w-full", "px-3", "py-2", "border", "border-gray-300", "placeholder-gray-500", "text-gray-900", "rounded-md", "focus:outline-none", "focus:ring-indigo-500", "focus:border-indigo-500", "sm:text-sm"], ["type", "submit", 1, "group", "relative", "w-full", "flex", "justify-center", "py-2", "px-4", "border", "border-transparent", "text-sm", "font-medium", "rounded-md", "text-white", "bg-indigo-600", "hover:bg-indigo-700", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-indigo-500", "disabled:opacity-50", 3, "disabled"], ["class", "absolute left-0 inset-y-0 flex items-center pl-3", 4, "ngIf"], ["class", "text-red-600 text-sm text-center", 4, "ngIf"], ["class", "text-green-600 text-sm text-center", 4, "ngIf"], [1, "text-center"], [1, "text-sm", "text-gray-600"], ["routerLink", "/auth/login", 1, "font-medium", "text-indigo-600", "hover:text-indigo-500"], [1, "absolute", "left-0", "inset-y-0", "flex", "items-center", "pl-3"], [1, "animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-white"], [1, "text-red-600", "text-sm", "text-center"], [1, "text-green-600", "text-sm", "text-center"]],
      template: function ForgotPasswordComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, " Forgot your password? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, " Enter your email address and we'll send you a link to reset your password. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "form", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function ForgotPasswordComponent_Template_form_ngSubmit_7_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div")(9, "label", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, "Email");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "input", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div")(13, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](14, ForgotPasswordComponent_span_14_Template, 2, 0, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](16, ForgotPasswordComponent_div_16_Template, 2, 1, "div", 9)(17, ForgotPasswordComponent_div_17_Template, 2, 1, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "div", 11)(19, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, " Remember your password? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "a", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, " Sign in ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.forgotPasswordForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.forgotPasswordForm.invalid || ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx.loading ? "Sending..." : "Send reset link", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.success);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8034:
/*!******************************************************************************!*\
  !*** ./src/app/features/auth/pages/confirm-email/confirm-email.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfirmEmailComponent: () => (/* binding */ ConfirmEmailComponent)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 6196);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 2596);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 8010);








function ConfirmEmailComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h2", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Confirming your email...");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Please wait while we verify your email address.");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
function ConfirmEmailComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 5)(1, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "svg", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "path", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "h2", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Email confirmed!");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "Your email has been successfully verified. You can now access all features.");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ConfirmEmailComponent_div_4_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.goToLogin());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, " Continue to Sign In ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
function ConfirmEmailComponent_div_5_span_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "span", 20);
  }
}
function ConfirmEmailComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 5)(1, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "svg", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "path", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "h2", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Confirmation failed");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 16)(9, "button", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ConfirmEmailComponent_div_5_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.resendConfirmation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](10, ConfirmEmailComponent_div_5_span_10_Template, 1, 0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div")(13, "a", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14, " Back to Sign In ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.error || "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r1.resendLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.resendLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r1.resendLoading ? "Sending..." : "Resend confirmation email", " ");
  }
}
function ConfirmEmailComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Confirmation email has been sent. Please check your inbox. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
class ConfirmEmailComponent {
  constructor(route, router, authService) {
    this.route = route;
    this.router = router;
    this.authService = authService;
    this.loading = true;
    this.success = false;
    this.error = null;
    this.resendLoading = false;
    this.resendSuccess = false;
    this.userId = null;
    this.token = null;
    this.email = null;
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.token = params['token'];
      this.email = params['email'];
      if (this.userId && this.token) {
        this.confirmEmail();
      } else {
        this.loading = false;
        this.error = 'Invalid confirmation link. Please check your email for the correct link.';
      }
    });
  }
  confirmEmail() {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this.userId || !_this.token) return;
      try {
        const request = {
          userId: _this.userId,
          token: _this.token
        };
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.firstValueFrom)(_this.authService.confirmEmail(request));
        if (result?.succeeded) {
          _this.success = true;
        } else {
          _this.error = result?.errors?.[0] || 'Email confirmation failed. The link may be expired or invalid.';
        }
      } catch (error) {
        _this.error = error.message || 'Email confirmation failed. Please try again.';
      } finally {
        _this.loading = false;
      }
    })();
  }
  resendConfirmation() {
    var _this2 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this2.email) {
        _this2.error = 'Email address not available. Please try signing up again.';
        return;
      }
      _this2.resendLoading = true;
      _this2.resendSuccess = false;
      try {
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.firstValueFrom)(_this2.authService.resendEmailConfirmation(_this2.email));
        if (result?.succeeded) {
          _this2.resendSuccess = true;
        } else {
          _this2.error = result?.errors?.[0] || 'Failed to resend confirmation email.';
        }
      } catch (error) {
        _this2.error = error.message || 'Failed to resend confirmation email.';
      } finally {
        _this2.resendLoading = false;
      }
    })();
  }
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
  static {
    this.ɵfac = function ConfirmEmailComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ConfirmEmailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: ConfirmEmailComponent,
      selectors: [["app-confirm-email"]],
      decls: 7,
      vars: 4,
      consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-gray-50", "py-12", "px-4", "sm:px-6", "lg:px-8"], [1, "max-w-md", "w-full", "space-y-8"], [1, "text-center"], ["class", "space-y-4", 4, "ngIf"], ["class", "mt-4 text-green-600 text-sm", 4, "ngIf"], [1, "space-y-4"], [1, "animate-spin", "rounded-full", "h-12", "w-12", "border-b-2", "border-indigo-600", "mx-auto"], [1, "text-2xl", "font-bold", "text-gray-900"], [1, "text-gray-600"], [1, "w-12", "h-12", "bg-green-100", "rounded-full", "flex", "items-center", "justify-center", "mx-auto"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-green-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M5 13l4 4L19 7"], [1, "inline-flex", "items-center", "px-4", "py-2", "border", "border-transparent", "text-sm", "font-medium", "rounded-md", "text-white", "bg-indigo-600", "hover:bg-indigo-700", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-indigo-500", 3, "click"], [1, "w-12", "h-12", "bg-red-100", "rounded-full", "flex", "items-center", "justify-center", "mx-auto"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-red-600"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M6 18L18 6M6 6l12 12"], [1, "space-y-2"], [1, "inline-flex", "items-center", "px-4", "py-2", "border", "border-transparent", "text-sm", "font-medium", "rounded-md", "text-white", "bg-indigo-600", "hover:bg-indigo-700", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-indigo-500", "disabled:opacity-50", 3, "click", "disabled"], ["class", "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2", 4, "ngIf"], ["routerLink", "/auth/login", 1, "text-sm", "text-indigo-600", "hover:text-indigo-500"], [1, "animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-white", "mr-2"], [1, "mt-4", "text-green-600", "text-sm"]],
      template: function ConfirmEmailComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, ConfirmEmailComponent_div_3_Template, 6, 0, "div", 3)(4, ConfirmEmailComponent_div_4_Template, 10, 0, "div", 3)(5, ConfirmEmailComponent_div_5_Template, 15, 4, "div", 3)(6, ConfirmEmailComponent_div_6_Template, 2, 0, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.success);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.resendSuccess);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8973:
/*!************************************************************************!*\
  !*** ./src/app/shared/components/auth-layout/auth-layout.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthLayoutComponent: () => (/* binding */ AuthLayoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);



const _c0 = ["*", [["", "footer", ""]]];
const _c1 = ["*", "[footer]"];
function AuthLayoutComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r0.logoUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
  }
}
function AuthLayoutComponent_p_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.subtitle);
  }
}
class AuthLayoutComponent {
  constructor() {
    this.title = '';
    this.subtitle = '';
    this.logoUrl = '/assets/logo.png';
    this.showLogo = true;
  }
  static {
    this.ɵfac = function AuthLayoutComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AuthLayoutComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AuthLayoutComponent,
      selectors: [["app-auth-layout"]],
      inputs: {
        title: "title",
        subtitle: "subtitle",
        logoUrl: "logoUrl",
        showLogo: "showLogo"
      },
      ngContentSelectors: _c1,
      decls: 11,
      vars: 3,
      consts: [[1, "auth-layout"], [1, "auth-layout__container"], ["class", "auth-layout__logo", 4, "ngIf"], [1, "auth-layout__header"], [1, "auth-layout__title"], ["class", "auth-layout__subtitle", 4, "ngIf"], [1, "auth-layout__content"], [1, "auth-layout__footer"], [1, "auth-layout__logo"], ["alt", "Logo", 3, "src"], [1, "auth-layout__subtitle"]],
      template: function AuthLayoutComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"](_c0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, AuthLayoutComponent_div_2_Template, 2, 1, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3)(4, "h1", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, AuthLayoutComponent_p_6_Template, 2, 1, "p", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](10, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showLogo);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.subtitle);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf],
      styles: [".auth-layout[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  padding: 20px;\n}\n.auth-layout__container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 450px;\n  background: white;\n  border-radius: 16px;\n  padding: 40px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n}\n.auth-layout__logo[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 32px;\n}\n.auth-layout__logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 150px;\n  height: auto;\n}\n.auth-layout__header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 32px;\n}\n.auth-layout__title[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 700;\n  color: var(--text-color, #333);\n  margin-bottom: 8px;\n}\n.auth-layout__subtitle[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--text-muted, #666);\n}\n.auth-layout__content[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.auth-layout__footer[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 24px;\n}\n@media (max-width: 640px) {\n  .auth-layout[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n  .auth-layout__container[_ngcontent-%COMP%] {\n    padding: 24px;\n  }\n  .auth-layout__title[_ngcontent-%COMP%] {\n    font-size: 24px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGgtbGF5b3V0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksaUJBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLDZEQUFBO0VBQ0EsYUFBQTtBQUNKO0FBQ0k7RUFDSSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLDBDQUFBO0FBQ1I7QUFFSTtFQUNJLGtCQUFBO0VBQ0EsbUJBQUE7QUFBUjtBQUVRO0VBQ0ksZ0JBQUE7RUFDQSxZQUFBO0FBQVo7QUFJSTtFQUNJLGtCQUFBO0VBQ0EsbUJBQUE7QUFGUjtBQUtJO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EsOEJBQUE7RUFDQSxrQkFBQTtBQUhSO0FBTUk7RUFDSSxlQUFBO0VBQ0EsOEJBQUE7QUFKUjtBQU9JO0VBQ0ksbUJBQUE7QUFMUjtBQVFJO0VBQ0ksa0JBQUE7RUFDQSxnQkFBQTtBQU5SO0FBU0k7RUFyREo7SUFzRFEsYUFBQTtFQU5OO0VBUU07SUFDSSxhQUFBO0VBTlY7RUFTTTtJQUNJLGVBQUE7RUFQVjtBQUNGIiwiZmlsZSI6ImF1dGgtbGF5b3V0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmF1dGgtbGF5b3V0IHtcclxuICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICM2NjdlZWEgMCUsICM3NjRiYTIgMTAwJSk7XHJcbiAgICBwYWRkaW5nOiAyMHB4O1xyXG5cclxuICAgICZfX2NvbnRhaW5lciB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgbWF4LXdpZHRoOiA0NTBweDtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xyXG4gICAgICAgIHBhZGRpbmc6IDQwcHg7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAyMHB4IDYwcHggcmdiYSgwLCAwLCAwLCAwLjMpO1xyXG4gICAgfVxyXG5cclxuICAgICZfX2xvZ28ge1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4O1xyXG5cclxuICAgICAgICBpbWcge1xyXG4gICAgICAgICAgICBtYXgtd2lkdGg6IDE1MHB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX2hlYWRlciB7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDMycHg7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fdGl0bGUge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMjhweDtcclxuICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yLCAjMzMzKTtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fc3VidGl0bGUge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCwgIzY2Nik7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fY29udGVudCB7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcclxuICAgIH1cclxuXHJcbiAgICAmX19mb290ZXIge1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICBtYXJnaW4tdG9wOiAyNHB4O1xyXG4gICAgfVxyXG5cclxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkge1xyXG4gICAgICAgIHBhZGRpbmc6IDEycHg7XHJcblxyXG4gICAgICAgICZfX2NvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDI0cHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmX190aXRsZSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvYXV0aC1sYXlvdXQvYXV0aC1sYXlvdXQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxpQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsNkRBQUE7RUFDQSxhQUFBO0FBQ0o7QUFDSTtFQUNJLFdBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0VBQ0EsMENBQUE7QUFDUjtBQUVJO0VBQ0ksa0JBQUE7RUFDQSxtQkFBQTtBQUFSO0FBRVE7RUFDSSxnQkFBQTtFQUNBLFlBQUE7QUFBWjtBQUlJO0VBQ0ksa0JBQUE7RUFDQSxtQkFBQTtBQUZSO0FBS0k7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSw4QkFBQTtFQUNBLGtCQUFBO0FBSFI7QUFNSTtFQUNJLGVBQUE7RUFDQSw4QkFBQTtBQUpSO0FBT0k7RUFDSSxtQkFBQTtBQUxSO0FBUUk7RUFDSSxrQkFBQTtFQUNBLGdCQUFBO0FBTlI7QUFTSTtFQXJESjtJQXNEUSxhQUFBO0VBTk47RUFRTTtJQUNJLGFBQUE7RUFOVjtFQVNNO0lBQ0ksZUFBQTtFQVBWO0FBQ0Y7QUFDQSxnbkZBQWduRiIsInNvdXJjZXNDb250ZW50IjpbIi5hdXRoLWxheW91dCB7XHJcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjY3ZWVhIDAlLCAjNzY0YmEyIDEwMCUpO1xyXG4gICAgcGFkZGluZzogMjBweDtcclxuXHJcbiAgICAmX19jb250YWluZXIge1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIG1heC13aWR0aDogNDUwcHg7XHJcbiAgICAgICAgYmFja2dyb3VuZDogd2hpdGU7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcclxuICAgICAgICBwYWRkaW5nOiA0MHB4O1xyXG4gICAgICAgIGJveC1zaGFkb3c6IDAgMjBweCA2MHB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcclxuICAgIH1cclxuXHJcbiAgICAmX19sb2dvIHtcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMzJweDtcclxuXHJcbiAgICAgICAgaW1nIHtcclxuICAgICAgICAgICAgbWF4LXdpZHRoOiAxNTBweDtcclxuICAgICAgICAgICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19oZWFkZXIge1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4O1xyXG4gICAgfVxyXG5cclxuICAgICZfX3RpdGxlIHtcclxuICAgICAgICBmb250LXNpemU6IDI4cHg7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvciwgIzMzMyk7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG4gICAgfVxyXG5cclxuICAgICZfX3N1YnRpdGxlIHtcclxuICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQsICM2NjYpO1xyXG4gICAgfVxyXG5cclxuICAgICZfX2NvbnRlbnQge1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fZm9vdGVyIHtcclxuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogMjRweDtcclxuICAgIH1cclxuXHJcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNjQwcHgpIHtcclxuICAgICAgICBwYWRkaW5nOiAxMnB4O1xyXG5cclxuICAgICAgICAmX19jb250YWluZXIge1xyXG4gICAgICAgICAgICBwYWRkaW5nOiAyNHB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJl9fdGl0bGUge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 9303:
/*!************************************************!*\
  !*** ./src/app/core/services/oauth.service.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OAuthService: () => (/* binding */ OAuthService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);



class OAuthService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v1/oauth`;
  }
  googleLogin(request) {
    return this.http.post(`${this.apiUrl}/google`, request);
  }
  githubLogin(request) {
    return this.http.post(`${this.apiUrl}/github`, request);
  }
  facebookLogin(request) {
    return this.http.post(`${this.apiUrl}/facebook`, request);
  }
  linkExternalAccount(provider, providerKey) {
    return this.http.post(`${this.apiUrl}/link/${provider}`, providerKey);
  }
  unlinkExternalAccount(provider) {
    return this.http.delete(`${this.apiUrl}/unlink/${provider}`);
  }
  getExternalLogins() {
    return this.http.get(`${this.apiUrl}/external-logins`);
  }
  // Helper methods for OAuth providers
  initializeGoogleAuth() {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.google) {
        resolve(window.google);
      } else {
        // Load Google API script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => resolve(window.google);
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }
  initializeFacebookAuth() {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.FB) {
        resolve(window.FB);
      } else {
        // Load Facebook SDK
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.onload = () => {
          window.FB.init({
            appId: 'YOUR_FACEBOOK_APP_ID',
            // Replace with actual app ID
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
          resolve(window.FB);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }
  getGitHubAuthUrl() {
    const clientId = 'YOUR_GITHUB_CLIENT_ID'; // Replace with actual client ID
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
    const scope = encodeURIComponent('user:email');
    const state = this.generateRandomState();
    localStorage.setItem('github_oauth_state', state);
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  }
  generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  static {
    this.ɵfac = function OAuthService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || OAuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: OAuthService,
      factory: OAuthService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_features_auth_auth_module_ts.js.map