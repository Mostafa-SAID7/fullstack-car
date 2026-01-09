"use strict";
(self["webpackChunkmedia_streaming_main_app"] = self["webpackChunkmedia_streaming_main_app"] || []).push([["src_app_debug-auth_component_ts"],{

/***/ 8545:
/*!*****************************************!*\
  !*** ./src/app/debug-auth.component.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DebugAuthComponent: () => (/* binding */ DebugAuthComponent)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/services/auth.service */ 8010);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 4054);







function DebugAuthComponent_div_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 15)(1, "pre", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](3, "json");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](3, 1, ctx_r0.testResult));
  }
}
class DebugAuthComponent {
  constructor(authService, http) {
    this.authService = authService;
    this.http = http;
    this.testResult = null;
  }
  getTokenPreview() {
    const token = this.authService.token;
    return token ? token.substring(0, 20) + '...' : 'No token';
  }
  hasTokenInStorage() {
    return !!localStorage.getItem('token');
  }
  hasRefreshTokenInStorage() {
    return !!localStorage.getItem('refreshToken');
  }
  hasUserInStorage() {
    return !!localStorage.getItem('user');
  }
  testAuthenticatedCall() {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const response = yield _this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl}/v7/media/videos`).toPromise();
        _this.testResult = {
          success: true,
          data: response
        };
      } catch (error) {
        _this.testResult = {
          success: false,
          error: error.message,
          status: error.status,
          details: error.error
        };
      }
    })();
  }
  testPodcastUploadAuth() {
    var _this2 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        // Test with a simple OPTIONS request to the upload endpoint
        const response = yield _this2.http.options(`${_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl}/v7/media/upload/podcast`).toPromise();
        _this2.testResult = {
          success: true,
          message: 'Upload endpoint accessible',
          data: response
        };
      } catch (error) {
        _this2.testResult = {
          success: false,
          error: 'Upload endpoint test failed',
          status: error.status,
          details: error.error
        };
      }
    })();
  }
  static {
    this.ɵfac = function DebugAuthComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || DebugAuthComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpClient));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: DebugAuthComponent,
      selectors: [["app-debug-auth"]],
      decls: 71,
      vars: 13,
      consts: [[1, "p-6", "max-w-4xl", "mx-auto"], [1, "text-2xl", "font-bold", "mb-4"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], [1, "p-4", "bg-gray-100", "rounded"], [1, "font-bold", "mb-2"], [1, "space-y-1", "text-sm"], [1, "space-y-2"], [1, "px-4", "py-2", "bg-blue-500", "text-white", "rounded", "mr-2", 3, "click"], [1, "px-4", "py-2", "bg-green-500", "text-white", "rounded", 3, "click"], ["class", "text-sm", 4, "ngIf"], [1, "mt-6", "p-4", "bg-gray-100", "rounded"], [1, "text-xs"], [1, "whitespace-pre-wrap"], [1, "mt-2"], [1, "whitespace-pre-wrap", "break-all"], [1, "text-sm"]],
      template: function DebugAuthComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "h2", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Debug Authentication");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 2)(4, "div", 3)(5, "h3", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Authentication Status");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 5)(8, "p")(9, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, "Is Authenticated:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "p")(13, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14, "Has Token:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "p")(17, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, "Has User:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "p")(21, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, "User Email:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](23);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 3)(25, "h3", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26, "Token Information");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "div", 5)(28, "p")(29, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](30, "Token (first 20 chars):");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](31);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](32, "p")(33, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](34, "Token in localStorage:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](35);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](36, "p")(37, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](38, "RefreshToken in localStorage:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](39);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](40, "p")(41, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](42, "User in localStorage:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](43);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](44, "div", 3)(45, "h3", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](46, "Test API Calls");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](47, "div", 6)(48, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function DebugAuthComponent_Template_button_click_48_listener() {
            return ctx.testAuthenticatedCall();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](49, " Test Auth Call ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](50, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function DebugAuthComponent_Template_button_click_50_listener() {
            return ctx.testPodcastUploadAuth();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](51, " Test Upload Auth ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](52, "div", 3)(53, "h3", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](54, "Test Results");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](55, DebugAuthComponent_div_55_Template, 4, 3, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](56, "div", 10)(57, "h3", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](58, "Raw Authentication Data");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](59, "div", 11)(60, "p")(61, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](62, "Current User Object:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](63, "pre", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](64);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](65, "json");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](66, "p", 13)(67, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](68, "Token:");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](69, "pre", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](70);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx.authService.isAuthenticated, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", !!ctx.authService.token, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", !!ctx.authService.currentUser, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", (ctx.authService.currentUser == null ? null : ctx.authService.currentUser.email) || "N/A", "");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx.getTokenPreview(), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx.hasTokenInStorage(), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx.hasRefreshTokenInStorage(), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx.hasUserInStorage(), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.testResult);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](65, 11, ctx.authService.currentUser));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.authService.token);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.JsonPipe],
      encapsulation: 2
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_debug-auth_component_ts.js.map