"use strict";
(self["webpackChunkmedia_streaming_main_app"] = self["webpackChunkmedia_streaming_main_app"] || []).push([["src_app_layout_layouts_main-layout_main-layout_component_ts"],{

/***/ 249:
/*!***************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccessTokenHttpClient: () => (/* binding */ AccessTokenHttpClient)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HeaderNames */ 5262);
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HttpClient */ 1598);

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class AccessTokenHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_1__.HttpClient {
  constructor(innerClient, accessTokenFactory) {
    super();
    this._innerClient = innerClient;
    this._accessTokenFactory = accessTokenFactory;
  }
  send(request) {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      let allowRetry = true;
      if (_this._accessTokenFactory && (!_this._accessToken || request.url && request.url.indexOf("/negotiate?") > 0)) {
        // don't retry if the request is a negotiate or if we just got a potentially new token from the access token factory
        allowRetry = false;
        _this._accessToken = yield _this._accessTokenFactory();
      }
      _this._setAuthorizationHeader(request);
      const response = yield _this._innerClient.send(request);
      if (allowRetry && response.statusCode === 401 && _this._accessTokenFactory) {
        _this._accessToken = yield _this._accessTokenFactory();
        _this._setAuthorizationHeader(request);
        return yield _this._innerClient.send(request);
      }
      return response;
    })();
  }
  _setAuthorizationHeader(request) {
    if (!request.headers) {
      request.headers = {};
    }
    if (this._accessToken) {
      request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_2__.HeaderNames.Authorization] = `Bearer ${this._accessToken}`;
    }
    // don't remove the header if there isn't an access token factory, the user manually added the header in this case
    else if (this._accessTokenFactory) {
      if (request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_2__.HeaderNames.Authorization]) {
        delete request.headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_2__.HeaderNames.Authorization];
      }
    }
  }
  getCookieString(url) {
    return this._innerClient.getCookieString(url);
  }
}

/***/ }),

/***/ 503:
/*!*********************************************************************!*\
  !*** ./src/app/layout/layouts/main-layout/main-layout.component.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MainLayoutComponent: () => (/* binding */ MainLayoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _components_header_header_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/header/header.component */ 4868);
/* harmony import */ var _components_sidebar_left_sidebar_left_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/sidebar-left/sidebar-left.component */ 8362);
/* harmony import */ var _components_sidebar_right_sidebar_right_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/sidebar-right/sidebar-right.component */ 5004);
/* harmony import */ var _shared_components_toast_container_toast_container_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/components/toast-container/toast-container.component */ 5614);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_layout_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../core/services/layout.service */ 2194);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 2596);










function MainLayoutComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 10)(1, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function MainLayoutComponent_div_12_Template_div_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r1.layoutService.closeMobileMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 12)(3, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](4, "app-sidebar-left", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
  }
}
class MainLayoutComponent {
  constructor(layoutService) {
    this.layoutService = layoutService;
  }
  static {
    this.ɵfac = function MainLayoutComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MainLayoutComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_core_services_layout_service__WEBPACK_IMPORTED_MODULE_4__.LayoutService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
      type: MainLayoutComponent,
      selectors: [["app-main-layout"]],
      decls: 14,
      vars: 1,
      consts: [[1, "min-h-screen", "bg-background", "text-foreground", "flex", "flex-col"], [1, "fixed", "top-0", "left-0", "w-full", "z-50", "h-14"], [1, "flex-1", "grid", "grid-cols-1", "md:grid-cols-[80px_1fr]", "lg:grid-cols-[240px_1fr]", "xl:grid-cols-[240px_1fr_240px]", "gap-4", "xl:gap-6", "w-full", "h-[calc(100vh-3.5rem)]", "mt-14", "overflow-hidden", "bg-background/50"], [1, "hidden", "md:block", "h-[calc(100vh-3.5rem)]", "pb-4", "md:pl-2", "lg:pl-4", "border-r", "border-border/10", "transition-all", "duration-500"], [1, "block", "h-full", "animate-fade-in"], [1, "w-full", "h-[calc(100vh-3.5rem)]", "pb-8", "px-2", "sm:px-4", "md:px-6", "lg:px-8", "xl:px-4", "2xl:px-6", "flex", "justify-center", "overflow-y-auto", "custom-scroll", "scroll-smooth"], [1, "w-full", "pt-6", "animate-slide-up", "max-w-[1400px]"], ["id", "localization-test", 2, "display", "none"], [1, "hidden", "xl:block", "h-[calc(100vh-3.5rem)]", "pb-4", "pr-4", "border-l", "border-border/10"], ["class", "fixed inset-0 z-40 xl:hidden", 4, "ngIf"], [1, "fixed", "inset-0", "z-40", "xl:hidden"], [1, "absolute", "inset-0", "bg-black/50", "backdrop-blur-sm", "transition-opacity", 3, "click"], [1, "absolute", "right-0", "top-0", "h-full", "w-[240px]", "bg-background", "shadow-2xl", "transform", "transition-transform", "duration-300", "ease-in-out", "pt-16", "px-4", "flex", "flex-col"], [1, "flex-1", "min-h-0", "mb-4"], [1, "h-full", "block"]],
      template: function MainLayoutComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "app-header", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 2)(3, "aside", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](4, "app-sidebar-left", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "main", 5)(6, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](7, "router-outlet");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](9, "Welcome");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "aside", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](11, "app-sidebar-right", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](12, MainLayoutComponent_div_12_Template, 5, 0, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](13, "app-toast-container");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.layoutService.isMobileMenuOpen());
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterOutlet, _components_header_header_component__WEBPACK_IMPORTED_MODULE_0__.HeaderComponent, _components_sidebar_left_sidebar_left_component__WEBPACK_IMPORTED_MODULE_1__.SidebarLeftComponent, _components_sidebar_right_sidebar_right_component__WEBPACK_IMPORTED_MODULE_2__.SidebarRightComponent, _shared_components_toast_container_toast_container_component__WEBPACK_IMPORTED_MODULE_3__.ToastContainerComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 514:
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HubConnection.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HubConnection: () => (/* binding */ HubConnection),
/* harmony export */   HubConnectionState: () => (/* binding */ HubConnectionState)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HandshakeProtocol */ 8448);
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Errors */ 9490);
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./IHubProtocol */ 5695);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _Subject__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Subject */ 1101);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils */ 1720);
/* harmony import */ var _MessageBuffer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./MessageBuffer */ 8440);

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.







const DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
const DEFAULT_PING_INTERVAL_IN_MS = 15 * 1000;
const DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE = 100000;
/** Describes the current state of the {@link HubConnection} to the server. */
var HubConnectionState;
(function (HubConnectionState) {
  /** The hub connection is disconnected. */
  HubConnectionState["Disconnected"] = "Disconnected";
  /** The hub connection is connecting. */
  HubConnectionState["Connecting"] = "Connecting";
  /** The hub connection is connected. */
  HubConnectionState["Connected"] = "Connected";
  /** The hub connection is disconnecting. */
  HubConnectionState["Disconnecting"] = "Disconnecting";
  /** The hub connection is reconnecting. */
  HubConnectionState["Reconnecting"] = "Reconnecting";
})(HubConnectionState || (HubConnectionState = {}));
/** Represents a connection to a SignalR Hub. */
class HubConnection {
  /** @internal */
  // Using a public static factory method means we can have a private constructor and an _internal_
  // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
  // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
  // public parameter-less constructor.
  static create(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
    return new HubConnection(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize);
  }
  constructor(connection, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
    this._nextKeepAlive = 0;
    this._freezeEventListener = () => {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
    };
    _Utils__WEBPACK_IMPORTED_MODULE_2__.Arg.isRequired(connection, "connection");
    _Utils__WEBPACK_IMPORTED_MODULE_2__.Arg.isRequired(logger, "logger");
    _Utils__WEBPACK_IMPORTED_MODULE_2__.Arg.isRequired(protocol, "protocol");
    this.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds !== null && serverTimeoutInMilliseconds !== void 0 ? serverTimeoutInMilliseconds : DEFAULT_TIMEOUT_IN_MS;
    this.keepAliveIntervalInMilliseconds = keepAliveIntervalInMilliseconds !== null && keepAliveIntervalInMilliseconds !== void 0 ? keepAliveIntervalInMilliseconds : DEFAULT_PING_INTERVAL_IN_MS;
    this._statefulReconnectBufferSize = statefulReconnectBufferSize !== null && statefulReconnectBufferSize !== void 0 ? statefulReconnectBufferSize : DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE;
    this._logger = logger;
    this._protocol = protocol;
    this.connection = connection;
    this._reconnectPolicy = reconnectPolicy;
    this._handshakeProtocol = new _HandshakeProtocol__WEBPACK_IMPORTED_MODULE_3__.HandshakeProtocol();
    this.connection.onreceive = data => this._processIncomingData(data);
    this.connection.onclose = error => this._connectionClosed(error);
    this._callbacks = {};
    this._methods = {};
    this._closedCallbacks = [];
    this._reconnectingCallbacks = [];
    this._reconnectedCallbacks = [];
    this._invocationId = 0;
    this._receivedHandshakeResponse = false;
    this._connectionState = HubConnectionState.Disconnected;
    this._connectionStarted = false;
    this._cachedPingMessage = this._protocol.writeMessage({
      type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Ping
    });
  }
  /** Indicates the state of the {@link HubConnection} to the server. */
  get state() {
    return this._connectionState;
  }
  /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
   *  in the disconnected state or if the negotiation step was skipped.
   */
  get connectionId() {
    return this.connection ? this.connection.connectionId || null : null;
  }
  /** Indicates the url of the {@link HubConnection} to the server. */
  get baseUrl() {
    return this.connection.baseUrl || "";
  }
  /**
   * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
   * Reconnecting states.
   * @param {string} url The url to connect to.
   */
  set baseUrl(url) {
    if (this._connectionState !== HubConnectionState.Disconnected && this._connectionState !== HubConnectionState.Reconnecting) {
      throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
    }
    if (!url) {
      throw new Error("The HubConnection url must be a valid url.");
    }
    this.connection.baseUrl = url;
  }
  /** Starts the connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
   */
  start() {
    this._startPromise = this._startWithStateTransitions();
    return this._startPromise;
  }
  _startWithStateTransitions() {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this._connectionState !== HubConnectionState.Disconnected) {
        return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
      }
      _this._connectionState = HubConnectionState.Connecting;
      _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, "Starting HubConnection.");
      try {
        yield _this._startInternal();
        if (_Utils__WEBPACK_IMPORTED_MODULE_2__.Platform.isBrowser) {
          // Log when the browser freezes the tab so users know why their connection unexpectedly stopped working
          window.document.addEventListener("freeze", _this._freezeEventListener);
        }
        _this._connectionState = HubConnectionState.Connected;
        _this._connectionStarted = true;
        _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, "HubConnection connected successfully.");
      } catch (e) {
        _this._connectionState = HubConnectionState.Disconnected;
        _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, `HubConnection failed to start successfully because of error '${e}'.`);
        return Promise.reject(e);
      }
    })();
  }
  _startInternal() {
    var _this2 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this2._stopDuringStartError = undefined;
      _this2._receivedHandshakeResponse = false;
      // Set up the promise before any connection is (re)started otherwise it could race with received messages
      const handshakePromise = new Promise((resolve, reject) => {
        _this2._handshakeResolver = resolve;
        _this2._handshakeRejecter = reject;
      });
      yield _this2.connection.start(_this2._protocol.transferFormat);
      try {
        let version = _this2._protocol.version;
        if (!_this2.connection.features.reconnect) {
          // Stateful Reconnect starts with HubProtocol version 2, newer clients connecting to older servers will fail to connect due to
          // the handshake only supporting version 1, so we will try to send version 1 during the handshake to keep old servers working.
          version = 1;
        }
        const handshakeRequest = {
          protocol: _this2._protocol.name,
          version
        };
        _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, "Sending handshake request.");
        yield _this2._sendMessage(_this2._handshakeProtocol.writeHandshakeRequest(handshakeRequest));
        _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, `Using HubProtocol '${_this2._protocol.name}'.`);
        // defensively cleanup timeout in case we receive a message from the server before we finish start
        _this2._cleanupTimeout();
        _this2._resetTimeoutPeriod();
        _this2._resetKeepAliveInterval();
        yield handshakePromise;
        // It's important to check the stopDuringStartError instead of just relying on the handshakePromise
        // being rejected on close, because this continuation can run after both the handshake completed successfully
        // and the connection was closed.
        if (_this2._stopDuringStartError) {
          // It's important to throw instead of returning a rejected promise, because we don't want to allow any state
          // transitions to occur between now and the calling code observing the exceptions. Returning a rejected promise
          // will cause the calling continuation to get scheduled to run later.
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw _this2._stopDuringStartError;
        }
        const useStatefulReconnect = _this2.connection.features.reconnect || false;
        if (useStatefulReconnect) {
          _this2._messageBuffer = new _MessageBuffer__WEBPACK_IMPORTED_MODULE_5__.MessageBuffer(_this2._protocol, _this2.connection, _this2._statefulReconnectBufferSize);
          _this2.connection.features.disconnected = _this2._messageBuffer._disconnected.bind(_this2._messageBuffer);
          _this2.connection.features.resend = () => {
            if (_this2._messageBuffer) {
              return _this2._messageBuffer._resend();
            }
          };
        }
        if (!_this2.connection.features.inherentKeepAlive) {
          yield _this2._sendMessage(_this2._cachedPingMessage);
        }
      } catch (e) {
        _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`);
        _this2._cleanupTimeout();
        _this2._cleanupPingTimer();
        // HttpConnection.stop() should not complete until after the onclose callback is invoked.
        // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
        yield _this2.connection.stop(e);
        throw e;
      }
    })();
  }
  /** Stops the connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
   */
  stop() {
    var _this3 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      // Capture the start promise before the connection might be restarted in an onclose callback.
      const startPromise = _this3._startPromise;
      _this3.connection.features.reconnect = false;
      _this3._stopPromise = _this3._stopInternal();
      yield _this3._stopPromise;
      try {
        // Awaiting undefined continues immediately
        yield startPromise;
      } catch (e) {
        // This exception is returned to the user as a rejected Promise from the start method.
      }
    })();
  }
  _stopInternal(error) {
    if (this._connectionState === HubConnectionState.Disconnected) {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, `Call to HubConnection.stop(${error}) ignored because it is already in the disconnected state.`);
      return Promise.resolve();
    }
    if (this._connectionState === HubConnectionState.Disconnecting) {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
      return this._stopPromise;
    }
    const state = this._connectionState;
    this._connectionState = HubConnectionState.Disconnecting;
    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, "Stopping HubConnection.");
    if (this._reconnectDelayHandle) {
      // We're in a reconnect delay which means the underlying connection is currently already stopped.
      // Just clear the handle to stop the reconnect loop (which no one is waiting on thankfully) and
      // fire the onclose callbacks.
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, "Connection stopped during reconnect delay. Done reconnecting.");
      clearTimeout(this._reconnectDelayHandle);
      this._reconnectDelayHandle = undefined;
      this._completeClose();
      return Promise.resolve();
    }
    if (state === HubConnectionState.Connected) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._sendCloseMessage();
    }
    this._cleanupTimeout();
    this._cleanupPingTimer();
    this._stopDuringStartError = error || new _Errors__WEBPACK_IMPORTED_MODULE_6__.AbortError("The connection was stopped before the hub handshake could complete.");
    // HttpConnection.stop() should not complete until after either HttpConnection.start() fails
    // or the onclose callback is invoked. The onclose callback will transition the HubConnection
    // to the disconnected state if need be before HttpConnection.stop() completes.
    return this.connection.stop(error);
  }
  _sendCloseMessage() {
    var _this4 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this4._sendWithProtocol(_this4._createCloseMessage());
      } catch {
        // Ignore, this is a best effort attempt to let the server know the client closed gracefully.
      }
    })();
  }
  /** Invokes a streaming hub method on the server using the specified name and arguments.
   *
   * @typeparam T The type of the items returned by the server.
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
   */
  stream(methodName, ...args) {
    const [streams, streamIds] = this._replaceStreamingParams(args);
    const invocationDescriptor = this._createStreamInvocation(methodName, args, streamIds);
    // eslint-disable-next-line prefer-const
    let promiseQueue;
    const subject = new _Subject__WEBPACK_IMPORTED_MODULE_7__.Subject();
    subject.cancelCallback = () => {
      const cancelInvocation = this._createCancelInvocation(invocationDescriptor.invocationId);
      delete this._callbacks[invocationDescriptor.invocationId];
      return promiseQueue.then(() => {
        return this._sendWithProtocol(cancelInvocation);
      });
    };
    this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
      if (error) {
        subject.error(error);
        return;
      } else if (invocationEvent) {
        // invocationEvent will not be null when an error is not passed to the callback
        if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Completion) {
          if (invocationEvent.error) {
            subject.error(new Error(invocationEvent.error));
          } else {
            subject.complete();
          }
        } else {
          subject.next(invocationEvent.item);
        }
      }
    };
    promiseQueue = this._sendWithProtocol(invocationDescriptor).catch(e => {
      subject.error(e);
      delete this._callbacks[invocationDescriptor.invocationId];
    });
    this._launchStreams(streams, promiseQueue);
    return subject;
  }
  _sendMessage(message) {
    this._resetKeepAliveInterval();
    return this.connection.send(message);
  }
  /**
   * Sends a js object to the server.
   * @param message The js object to serialize and send.
   */
  _sendWithProtocol(message) {
    if (this._messageBuffer) {
      return this._messageBuffer._send(message);
    } else {
      return this._sendMessage(this._protocol.writeMessage(message));
    }
  }
  /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
   *
   * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
   * be processing the invocation.
   *
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
   */
  send(methodName, ...args) {
    const [streams, streamIds] = this._replaceStreamingParams(args);
    const sendPromise = this._sendWithProtocol(this._createInvocation(methodName, args, true, streamIds));
    this._launchStreams(streams, sendPromise);
    return sendPromise;
  }
  /** Invokes a hub method on the server using the specified name and arguments.
   *
   * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
   * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
   * resolving the Promise.
   *
   * @typeparam T The expected return type.
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
   */
  invoke(methodName, ...args) {
    const [streams, streamIds] = this._replaceStreamingParams(args);
    const invocationDescriptor = this._createInvocation(methodName, args, false, streamIds);
    const p = new Promise((resolve, reject) => {
      // invocationId will always have a value for a non-blocking invocation
      this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
        if (error) {
          reject(error);
          return;
        } else if (invocationEvent) {
          // invocationEvent will not be null when an error is not passed to the callback
          if (invocationEvent.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Completion) {
            if (invocationEvent.error) {
              reject(new Error(invocationEvent.error));
            } else {
              resolve(invocationEvent.result);
            }
          } else {
            reject(new Error(`Unexpected message type: ${invocationEvent.type}`));
          }
        }
      };
      const promiseQueue = this._sendWithProtocol(invocationDescriptor).catch(e => {
        reject(e);
        // invocationId will always have a value for a non-blocking invocation
        delete this._callbacks[invocationDescriptor.invocationId];
      });
      this._launchStreams(streams, promiseQueue);
    });
    return p;
  }
  on(methodName, newMethod) {
    if (!methodName || !newMethod) {
      return;
    }
    methodName = methodName.toLowerCase();
    if (!this._methods[methodName]) {
      this._methods[methodName] = [];
    }
    // Preventing adding the same handler multiple times.
    if (this._methods[methodName].indexOf(newMethod) !== -1) {
      return;
    }
    this._methods[methodName].push(newMethod);
  }
  off(methodName, method) {
    if (!methodName) {
      return;
    }
    methodName = methodName.toLowerCase();
    const handlers = this._methods[methodName];
    if (!handlers) {
      return;
    }
    if (method) {
      const removeIdx = handlers.indexOf(method);
      if (removeIdx !== -1) {
        handlers.splice(removeIdx, 1);
        if (handlers.length === 0) {
          delete this._methods[methodName];
        }
      }
    } else {
      delete this._methods[methodName];
    }
  }
  /** Registers a handler that will be invoked when the connection is closed.
   *
   * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
   */
  onclose(callback) {
    if (callback) {
      this._closedCallbacks.push(callback);
    }
  }
  /** Registers a handler that will be invoked when the connection starts reconnecting.
   *
   * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
   */
  onreconnecting(callback) {
    if (callback) {
      this._reconnectingCallbacks.push(callback);
    }
  }
  /** Registers a handler that will be invoked when the connection successfully reconnects.
   *
   * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
   */
  onreconnected(callback) {
    if (callback) {
      this._reconnectedCallbacks.push(callback);
    }
  }
  _processIncomingData(data) {
    this._cleanupTimeout();
    if (!this._receivedHandshakeResponse) {
      data = this._processHandshakeResponse(data);
      this._receivedHandshakeResponse = true;
    }
    // Data may have all been read when processing handshake response
    if (data) {
      // Parse the messages
      const messages = this._protocol.parseMessages(data, this._logger);
      for (const message of messages) {
        if (this._messageBuffer && !this._messageBuffer._shouldProcessMessage(message)) {
          // Don't process the message, we are either waiting for a SequenceMessage or received a duplicate message
          continue;
        }
        switch (message.type) {
          case _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Invocation:
            this._invokeClientMethod(message).catch(e => {
              this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `Invoke client method threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_2__.getErrorString)(e)}`);
            });
            break;
          case _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.StreamItem:
          case _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Completion:
            {
              const callback = this._callbacks[message.invocationId];
              if (callback) {
                if (message.type === _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Completion) {
                  delete this._callbacks[message.invocationId];
                }
                try {
                  callback(message);
                } catch (e) {
                  this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `Stream callback threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_2__.getErrorString)(e)}`);
                }
              }
              break;
            }
          case _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Ping:
            // Don't care about pings
            break;
          case _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Close:
            {
              this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, "Close message received from server.");
              const error = message.error ? new Error("Server returned an error on close: " + message.error) : undefined;
              if (message.allowReconnect === true) {
                // It feels wrong not to await connection.stop() here, but processIncomingData is called as part of an onreceive callback which is not async,
                // this is already the behavior for serverTimeout(), and HttpConnection.Stop() should catch and log all possible exceptions.
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.connection.stop(error);
              } else {
                // We cannot await stopInternal() here, but subsequent calls to stop() will await this if stopInternal() is still ongoing.
                this._stopPromise = this._stopInternal(error);
              }
              break;
            }
          case _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Ack:
            if (this._messageBuffer) {
              this._messageBuffer._ack(message);
            }
            break;
          case _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Sequence:
            if (this._messageBuffer) {
              this._messageBuffer._resetSequence(message);
            }
            break;
          default:
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Warning, `Invalid message type: ${message.type}.`);
            break;
        }
      }
    }
    this._resetTimeoutPeriod();
  }
  _processHandshakeResponse(data) {
    let responseMessage;
    let remainingData;
    try {
      [remainingData, responseMessage] = this._handshakeProtocol.parseHandshakeResponse(data);
    } catch (e) {
      const message = "Error parsing handshake response: " + e;
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, message);
      const error = new Error(message);
      this._handshakeRejecter(error);
      throw error;
    }
    if (responseMessage.error) {
      const message = "Server returned handshake error: " + responseMessage.error;
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, message);
      const error = new Error(message);
      this._handshakeRejecter(error);
      throw error;
    } else {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, "Server handshake complete.");
    }
    this._handshakeResolver();
    return remainingData;
  }
  _resetKeepAliveInterval() {
    if (this.connection.features.inherentKeepAlive) {
      return;
    }
    // Set the time we want the next keep alive to be sent
    // Timer will be setup on next message receive
    this._nextKeepAlive = new Date().getTime() + this.keepAliveIntervalInMilliseconds;
    this._cleanupPingTimer();
  }
  _resetTimeoutPeriod() {
    var _this5 = this;
    if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
      // Set the timeout timer
      this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
      // Immediately fire Keep-Alive ping if nextPing is overdue to avoid dependency on JS timers
      let nextPing = this._nextKeepAlive - new Date().getTime();
      if (nextPing < 0) {
        if (this._connectionState === HubConnectionState.Connected) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this._trySendPingMessage();
        }
        return;
      }
      // Set keepAlive timer if there isn't one
      if (this._pingServerHandle === undefined) {
        if (nextPing < 0) {
          nextPing = 0;
        }
        // The timer needs to be set from a networking callback to avoid Chrome timer throttling from causing timers to run once a minute
        this._pingServerHandle = setTimeout(/*#__PURE__*/(0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
          if (_this5._connectionState === HubConnectionState.Connected) {
            yield _this5._trySendPingMessage();
          }
        }), nextPing);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  serverTimeout() {
    // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
    // Terminate the connection, but we don't need to wait on the promise. This could trigger reconnecting.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
  }
  _invokeClientMethod(invocationMessage) {
    var _this6 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const methodName = invocationMessage.target.toLowerCase();
      const methods = _this6._methods[methodName];
      if (!methods) {
        _this6._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Warning, `No client method with the name '${methodName}' found.`);
        // No handlers provided by client but the server is expecting a response still, so we send an error
        if (invocationMessage.invocationId) {
          _this6._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
          yield _this6._sendWithProtocol(_this6._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null));
        }
        return;
      }
      // Avoid issues with handlers removing themselves thus modifying the list while iterating through it
      const methodsCopy = methods.slice();
      // Server expects a response
      const expectsResponse = invocationMessage.invocationId ? true : false;
      // We preserve the last result or exception but still call all handlers
      let res;
      let exception;
      let completionMessage;
      for (const m of methodsCopy) {
        try {
          const prevRes = res;
          res = yield m.apply(_this6, invocationMessage.arguments);
          if (expectsResponse && res && prevRes) {
            _this6._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `Multiple results provided for '${methodName}'. Sending error to server.`);
            completionMessage = _this6._createCompletionMessage(invocationMessage.invocationId, `Client provided multiple results.`, null);
          }
          // Ignore exception if we got a result after, the exception will be logged
          exception = undefined;
        } catch (e) {
          exception = e;
          _this6._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `A callback for the method '${methodName}' threw error '${e}'.`);
        }
      }
      if (completionMessage) {
        yield _this6._sendWithProtocol(completionMessage);
      } else if (expectsResponse) {
        // If there is an exception that means either no result was given or a handler after a result threw
        if (exception) {
          completionMessage = _this6._createCompletionMessage(invocationMessage.invocationId, `${exception}`, null);
        } else if (res !== undefined) {
          completionMessage = _this6._createCompletionMessage(invocationMessage.invocationId, null, res);
        } else {
          _this6._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
          // Client didn't provide a result or throw from a handler, server expects a response so we send an error
          completionMessage = _this6._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null);
        }
        yield _this6._sendWithProtocol(completionMessage);
      } else {
        if (res) {
          _this6._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `Result given for '${methodName}' method but server is not expecting a result.`);
        }
      }
    })();
  }
  _connectionClosed(error) {
    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, `HubConnection.connectionClosed(${error}) called while in state ${this._connectionState}.`);
    // Triggering this.handshakeRejecter is insufficient because it could already be resolved without the continuation having run yet.
    this._stopDuringStartError = this._stopDuringStartError || error || new _Errors__WEBPACK_IMPORTED_MODULE_6__.AbortError("The underlying connection was closed before the hub handshake could complete.");
    // If the handshake is in progress, start will be waiting for the handshake promise, so we complete it.
    // If it has already completed, this should just noop.
    if (this._handshakeResolver) {
      this._handshakeResolver();
    }
    this._cancelCallbacksWithError(error || new Error("Invocation canceled due to the underlying connection being closed."));
    this._cleanupTimeout();
    this._cleanupPingTimer();
    if (this._connectionState === HubConnectionState.Disconnecting) {
      this._completeClose(error);
    } else if (this._connectionState === HubConnectionState.Connected && this._reconnectPolicy) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._reconnect(error);
    } else if (this._connectionState === HubConnectionState.Connected) {
      this._completeClose(error);
    }
    // If none of the above if conditions were true were called the HubConnection must be in either:
    // 1. The Connecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail it.
    // 2. The Reconnecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail the current reconnect attempt
    //    and potentially continue the reconnect() loop.
    // 3. The Disconnected state in which case we're already done.
  }
  _completeClose(error) {
    if (this._connectionStarted) {
      this._connectionState = HubConnectionState.Disconnected;
      this._connectionStarted = false;
      if (this._messageBuffer) {
        this._messageBuffer._dispose(error !== null && error !== void 0 ? error : new Error("Connection closed."));
        this._messageBuffer = undefined;
      }
      if (_Utils__WEBPACK_IMPORTED_MODULE_2__.Platform.isBrowser) {
        window.document.removeEventListener("freeze", this._freezeEventListener);
      }
      try {
        this._closedCallbacks.forEach(c => c.apply(this, [error]));
      } catch (e) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `An onclose callback called with error '${error}' threw error '${e}'.`);
      }
    }
  }
  _reconnect(error) {
    var _this7 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const reconnectStartTime = Date.now();
      let previousReconnectAttempts = 0;
      let retryError = error !== undefined ? error : new Error("Attempting to reconnect due to a unknown error.");
      let nextRetryDelay = _this7._getNextRetryDelay(previousReconnectAttempts, 0, retryError);
      if (nextRetryDelay === null) {
        _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt.");
        _this7._completeClose(error);
        return;
      }
      _this7._connectionState = HubConnectionState.Reconnecting;
      if (error) {
        _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, `Connection reconnecting because of error '${error}'.`);
      } else {
        _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, "Connection reconnecting.");
      }
      if (_this7._reconnectingCallbacks.length !== 0) {
        try {
          _this7._reconnectingCallbacks.forEach(c => c.apply(_this7, [error]));
        } catch (e) {
          _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `An onreconnecting callback called with error '${error}' threw error '${e}'.`);
        }
        // Exit early if an onreconnecting callback called connection.stop().
        if (_this7._connectionState !== HubConnectionState.Reconnecting) {
          _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
          return;
        }
      }
      while (nextRetryDelay !== null) {
        _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, `Reconnect attempt number ${previousReconnectAttempts + 1} will start in ${nextRetryDelay} ms.`);
        yield new Promise(resolve => {
          _this7._reconnectDelayHandle = setTimeout(resolve, nextRetryDelay);
        });
        _this7._reconnectDelayHandle = undefined;
        if (_this7._connectionState !== HubConnectionState.Reconnecting) {
          _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
          return;
        }
        try {
          yield _this7._startInternal();
          _this7._connectionState = HubConnectionState.Connected;
          _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, "HubConnection reconnected successfully.");
          if (_this7._reconnectedCallbacks.length !== 0) {
            try {
              _this7._reconnectedCallbacks.forEach(c => c.apply(_this7, [_this7.connection.connectionId]));
            } catch (e) {
              _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `An onreconnected callback called with connectionId '${_this7.connection.connectionId}; threw error '${e}'.`);
            }
          }
          return;
        } catch (e) {
          _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, `Reconnect attempt failed because of error '${e}'.`);
          if (_this7._connectionState !== HubConnectionState.Reconnecting) {
            _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Debug, `Connection moved to the '${_this7._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`);
            // The TypeScript compiler thinks that connectionState must be Connected here. The TypeScript compiler is wrong.
            if (_this7._connectionState === HubConnectionState.Disconnecting) {
              _this7._completeClose();
            }
            return;
          }
          previousReconnectAttempts++;
          retryError = e instanceof Error ? e : new Error(e.toString());
          nextRetryDelay = _this7._getNextRetryDelay(previousReconnectAttempts, Date.now() - reconnectStartTime, retryError);
        }
      }
      _this7._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Information, `Reconnect retries have been exhausted after ${Date.now() - reconnectStartTime} ms and ${previousReconnectAttempts} failed attempts. Connection disconnecting.`);
      _this7._completeClose();
    })();
  }
  _getNextRetryDelay(previousRetryCount, elapsedMilliseconds, retryReason) {
    try {
      return this._reconnectPolicy.nextRetryDelayInMilliseconds({
        elapsedMilliseconds,
        previousRetryCount,
        retryReason
      });
    } catch (e) {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${previousRetryCount}, ${elapsedMilliseconds}) threw error '${e}'.`);
      return null;
    }
  }
  _cancelCallbacksWithError(error) {
    const callbacks = this._callbacks;
    this._callbacks = {};
    Object.keys(callbacks).forEach(key => {
      const callback = callbacks[key];
      try {
        callback(null, error);
      } catch (e) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_1__.LogLevel.Error, `Stream 'error' callback called with '${error}' threw error: ${(0,_Utils__WEBPACK_IMPORTED_MODULE_2__.getErrorString)(e)}`);
      }
    });
  }
  _cleanupPingTimer() {
    if (this._pingServerHandle) {
      clearTimeout(this._pingServerHandle);
      this._pingServerHandle = undefined;
    }
  }
  _cleanupTimeout() {
    if (this._timeoutHandle) {
      clearTimeout(this._timeoutHandle);
    }
  }
  _createInvocation(methodName, args, nonblocking, streamIds) {
    if (nonblocking) {
      if (streamIds.length !== 0) {
        return {
          target: methodName,
          arguments: args,
          streamIds,
          type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Invocation
        };
      } else {
        return {
          target: methodName,
          arguments: args,
          type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Invocation
        };
      }
    } else {
      const invocationId = this._invocationId;
      this._invocationId++;
      if (streamIds.length !== 0) {
        return {
          target: methodName,
          arguments: args,
          invocationId: invocationId.toString(),
          streamIds,
          type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Invocation
        };
      } else {
        return {
          target: methodName,
          arguments: args,
          invocationId: invocationId.toString(),
          type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Invocation
        };
      }
    }
  }
  _launchStreams(streams, promiseQueue) {
    if (streams.length === 0) {
      return;
    }
    // Synchronize stream data so they arrive in-order on the server
    if (!promiseQueue) {
      promiseQueue = Promise.resolve();
    }
    // We want to iterate over the keys, since the keys are the stream ids
    // eslint-disable-next-line guard-for-in
    for (const streamId in streams) {
      streams[streamId].subscribe({
        complete: () => {
          promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId)));
        },
        error: err => {
          let message;
          if (err instanceof Error) {
            message = err.message;
          } else if (err && err.toString) {
            message = err.toString();
          } else {
            message = "Unknown error";
          }
          promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId, message)));
        },
        next: item => {
          promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createStreamItemMessage(streamId, item)));
        }
      });
    }
  }
  _replaceStreamingParams(args) {
    const streams = [];
    const streamIds = [];
    for (let i = 0; i < args.length; i++) {
      const argument = args[i];
      if (this._isObservable(argument)) {
        const streamId = this._invocationId;
        this._invocationId++;
        // Store the stream for later use
        streams[streamId] = argument;
        streamIds.push(streamId.toString());
        // remove stream from args
        args.splice(i, 1);
      }
    }
    return [streams, streamIds];
  }
  _isObservable(arg) {
    // This allows other stream implementations to just work (like rxjs)
    return arg && arg.subscribe && typeof arg.subscribe === "function";
  }
  _createStreamInvocation(methodName, args, streamIds) {
    const invocationId = this._invocationId;
    this._invocationId++;
    if (streamIds.length !== 0) {
      return {
        target: methodName,
        arguments: args,
        invocationId: invocationId.toString(),
        streamIds,
        type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.StreamInvocation
      };
    } else {
      return {
        target: methodName,
        arguments: args,
        invocationId: invocationId.toString(),
        type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.StreamInvocation
      };
    }
  }
  _createCancelInvocation(id) {
    return {
      invocationId: id,
      type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.CancelInvocation
    };
  }
  _createStreamItemMessage(id, item) {
    return {
      invocationId: id,
      item,
      type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.StreamItem
    };
  }
  _createCompletionMessage(id, error, result) {
    if (error) {
      return {
        error,
        invocationId: id,
        type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Completion
      };
    }
    return {
      invocationId: id,
      result,
      type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Completion
    };
  }
  _createCloseMessage() {
    return {
      type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_4__.MessageType.Close
    };
  }
  _trySendPingMessage() {
    var _this8 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this8._sendMessage(_this8._cachedPingMessage);
      } catch {
        // We don't care about the error. It should be seen elsewhere in the client.
        // The connection is probably in a bad or closed state now, cleanup the timer so it stops triggering
        _this8._cleanupPingTimer();
      }
    })();
  }
}

/***/ }),

/***/ 893:
/*!****************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/ITransport.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpTransportType: () => (/* binding */ HttpTransportType),
/* harmony export */   TransferFormat: () => (/* binding */ TransferFormat)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// This will be treated as a bit flag in the future, so we keep it using power-of-two values.
/** Specifies a specific HTTP transport type. */
var HttpTransportType;
(function (HttpTransportType) {
  /** Specifies no transport preference. */
  HttpTransportType[HttpTransportType["None"] = 0] = "None";
  /** Specifies the WebSockets transport. */
  HttpTransportType[HttpTransportType["WebSockets"] = 1] = "WebSockets";
  /** Specifies the Server-Sent Events transport. */
  HttpTransportType[HttpTransportType["ServerSentEvents"] = 2] = "ServerSentEvents";
  /** Specifies the Long Polling transport. */
  HttpTransportType[HttpTransportType["LongPolling"] = 4] = "LongPolling";
})(HttpTransportType || (HttpTransportType = {}));
/** Specifies the transfer format for a connection. */
var TransferFormat;
(function (TransferFormat) {
  /** Specifies that only text data will be transmitted over the connection. */
  TransferFormat[TransferFormat["Text"] = 1] = "Text";
  /** Specifies that binary data will be transmitted over the connection. */
  TransferFormat[TransferFormat["Binary"] = 2] = "Binary";
})(TransferFormat || (TransferFormat = {}));

/***/ }),

/***/ 1081:
/*!********************************************************************************************!*\
  !*** ./src/app/features/community/components/friend-requests/friend-requests.component.ts ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FriendRequestsComponent: () => (/* binding */ FriendRequestsComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_friend_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/friend.service */ 1398);





function FriendRequestsComponent_div_7_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 17);
  }
  if (rf & 2) {
    const request_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", request_r2.requesterProfileImageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
  }
}
function FriendRequestsComponent_div_7_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const request_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"](" ", request_r2.requesterFirstName[0], "", request_r2.requesterLastName[0], " ");
  }
}
function FriendRequestsComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 7)(1, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, FriendRequestsComponent_div_7_img_2_Template, 1, 1, "img", 9)(3, FriendRequestsComponent_div_7_div_3_Template, 2, 2, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 11)(5, "h4", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](9, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 14)(11, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function FriendRequestsComponent_div_7_Template_button_click_11_listener() {
      const request_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1).$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r2.accept(request_r2.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, " Accept ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function FriendRequestsComponent_div_7_Template_button_click_13_listener() {
      const request_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1).$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r2.decline(request_r2.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, " Decline ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const request_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", request_r2.requesterProfileImageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !request_r2.requesterProfileImageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", request_r2.requesterFirstName, " ", request_r2.requesterLastName, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](9, 5, request_r2.requestedAt, "shortDate"));
  }
}
function FriendRequestsComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "No friend requests");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
class FriendRequestsComponent {
  constructor(friendService) {
    this.friendService = friendService;
    this.requests = [];
  }
  ngOnInit() {
    this.friendService.getFriendRequests(1, 5).subscribe(result => {
      this.requests = result.items;
    });
  }
  accept(id) {
    this.friendService.acceptFriendRequest(id).subscribe(result => {
      if (result.succeeded) {
        this.requests = this.requests.filter(r => r.id !== id);
      }
    });
  }
  decline(id) {
    this.friendService.declineFriendRequest(id).subscribe(result => {
      if (result.succeeded) {
        this.requests = this.requests.filter(r => r.id !== id);
      }
    });
  }
  static {
    this.ɵfac = function FriendRequestsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FriendRequestsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_friend_service__WEBPACK_IMPORTED_MODULE_0__.FriendService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: FriendRequestsComponent,
      selectors: [["app-friend-requests"]],
      hostAttrs: [1, "block"],
      decls: 9,
      vars: 3,
      consts: [[1, "fb-card", "p-5"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-sm", "font-black", "uppercase", "tracking-widest", "text-primary"], [1, "bg-primary", "text-white", "text-[10px]", "font-black", "px-2", "py-0.5", "rounded-full"], [1, "space-y-4"], ["class", "flex items-start gap-3 p-2 rounded-xl hover:bg-secondary/10 transition-colors", 4, "ngFor", "ngForOf"], ["class", "py-4 text-center", 4, "ngIf"], [1, "flex", "items-start", "gap-3", "p-2", "rounded-xl", "hover:bg-secondary/10", "transition-colors"], [1, "w-10", "h-10", "rounded-xl", "bg-gradient-to-tr", "from-primary/10", "to-primary/5", "border", "border-primary/10", "overflow-hidden", "shadow-sm", "flex-shrink-0"], ["class", "w-full h-full object-cover", 3, "src", 4, "ngIf"], ["class", "w-full h-full flex items-center justify-center font-black text-primary", 4, "ngIf"], [1, "flex-1", "min-w-0"], [1, "text-xs", "font-black", "truncate"], [1, "text-[9px]", "text-muted-foreground/60", "block", "mb-2"], [1, "flex", "gap-2"], [1, "flex-1", "bg-primary", "text-white", "text-[9px]", "font-black", "py-1.5", "rounded-lg", "hover:bg-primary/90", "transition-all", "uppercase", "tracking-widest", 3, "click"], [1, "flex-1", "bg-secondary", "text-foreground", "text-[9px]", "font-black", "py-1.5", "rounded-lg", "hover:bg-secondary/80", "transition-all", "uppercase", "tracking-widest", 3, "click"], [1, "w-full", "h-full", "object-cover", 3, "src"], [1, "w-full", "h-full", "flex", "items-center", "justify-center", "font-black", "text-primary"], [1, "py-4", "text-center"], [1, "text-[10px]", "text-muted-foreground/60", "font-black", "uppercase", "tracking-widest"]],
      template: function FriendRequestsComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Friend Requests");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, FriendRequestsComponent_div_7_Template, 15, 8, "div", 5)(8, FriendRequestsComponent_div_8_Template, 3, 0, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.requests.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.requests);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.requests.length === 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__.TranslateModule],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 1101:
/*!*************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Subject.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Subject: () => (/* binding */ Subject)
/* harmony export */ });
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ 1720);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

/** Stream implementation to stream items to the server. */
class Subject {
  constructor() {
    this.observers = [];
  }
  next(item) {
    for (const observer of this.observers) {
      observer.next(item);
    }
  }
  error(err) {
    for (const observer of this.observers) {
      if (observer.error) {
        observer.error(err);
      }
    }
  }
  complete() {
    for (const observer of this.observers) {
      if (observer.complete) {
        observer.complete();
      }
    }
  }
  subscribe(observer) {
    this.observers.push(observer);
    return new _Utils__WEBPACK_IMPORTED_MODULE_0__.SubjectSubscription(this, observer);
  }
}

/***/ }),

/***/ 1398:
/*!***************************************************************!*\
  !*** ./src/app/features/community/services/friend.service.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FriendService: () => (/* binding */ FriendService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);



class FriendService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v2.0/community/social/friends`;
  }
  getFriends(pageNumber = 1, pageSize = 10) {
    return this.http.get(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  getFriendRequests(pageNumber = 1, pageSize = 10) {
    return this.http.get(`${this.apiUrl}/requests?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  sendFriendRequest(friendId) {
    return this.http.post(`${this.apiUrl}/request/${friendId}`, {});
  }
  acceptFriendRequest(requestId) {
    return this.http.put(`${this.apiUrl}/request/${requestId}/accept`, {});
  }
  declineFriendRequest(requestId) {
    return this.http.put(`${this.apiUrl}/request/${requestId}/decline`, {});
  }
  removeFriend(friendId) {
    return this.http.delete(`${this.apiUrl}/${friendId}`);
  }
  static {
    this.ɵfac = function FriendService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || FriendService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: FriendService,
      factory: FriendService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 1515:
/*!***********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/DefaultHttpClient.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultHttpClient: () => (/* binding */ DefaultHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Errors */ 9490);
/* harmony import */ var _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FetchHttpClient */ 8250);
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ 1598);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ 1720);
/* harmony import */ var _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./XhrHttpClient */ 3000);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





/** Default implementation of {@link @microsoft/signalr.HttpClient}. */
class DefaultHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
  /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
  constructor(logger) {
    super();
    if (typeof fetch !== "undefined" || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode) {
      this._httpClient = new _FetchHttpClient__WEBPACK_IMPORTED_MODULE_2__.FetchHttpClient(logger);
    } else if (typeof XMLHttpRequest !== "undefined") {
      this._httpClient = new _XhrHttpClient__WEBPACK_IMPORTED_MODULE_3__.XhrHttpClient(logger);
    } else {
      throw new Error("No usable HttpClient found.");
    }
  }
  /** @inheritDoc */
  send(request) {
    // Check that abort was not signaled before calling send
    if (request.abortSignal && request.abortSignal.aborted) {
      return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_4__.AbortError());
    }
    if (!request.method) {
      return Promise.reject(new Error("No method defined."));
    }
    if (!request.url) {
      return Promise.reject(new Error("No url defined."));
    }
    return this._httpClient.send(request);
  }
  getCookieString(url) {
    return this._httpClient.getCookieString(url);
  }
}

/***/ }),

/***/ 1598:
/*!****************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HttpClient.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpClient: () => (/* binding */ HttpClient),
/* harmony export */   HttpResponse: () => (/* binding */ HttpResponse)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Represents an HTTP response. */
class HttpResponse {
  constructor(statusCode, statusText, content) {
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.content = content;
  }
}
/** Abstraction over an HTTP client.
 *
 * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
 */
class HttpClient {
  get(url, options) {
    return this.send({
      ...options,
      method: "GET",
      url
    });
  }
  post(url, options) {
    return this.send({
      ...options,
      method: "POST",
      url
    });
  }
  delete(url, options) {
    return this.send({
      ...options,
      method: "DELETE",
      url
    });
  }
  /** Gets all cookies that apply to the specified URL.
   *
   * @param url The URL that the cookies are valid for.
   * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
   */
  // @ts-ignore
  getCookieString(url) {
    return "";
  }
}

/***/ }),

/***/ 1720:
/*!***********************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Utils.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Arg: () => (/* binding */ Arg),
/* harmony export */   ConsoleLogger: () => (/* binding */ ConsoleLogger),
/* harmony export */   Platform: () => (/* binding */ Platform),
/* harmony export */   SubjectSubscription: () => (/* binding */ SubjectSubscription),
/* harmony export */   VERSION: () => (/* reexport safe */ _pkg_version__WEBPACK_IMPORTED_MODULE_1__.VERSION),
/* harmony export */   constructUserAgent: () => (/* binding */ constructUserAgent),
/* harmony export */   createLogger: () => (/* binding */ createLogger),
/* harmony export */   formatArrayBuffer: () => (/* binding */ formatArrayBuffer),
/* harmony export */   getDataDetail: () => (/* binding */ getDataDetail),
/* harmony export */   getErrorString: () => (/* binding */ getErrorString),
/* harmony export */   getGlobalThis: () => (/* binding */ getGlobalThis),
/* harmony export */   getUserAgentHeader: () => (/* binding */ getUserAgentHeader),
/* harmony export */   isArrayBuffer: () => (/* binding */ isArrayBuffer),
/* harmony export */   sendMessage: () => (/* binding */ sendMessage)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Loggers */ 6944);
/* harmony import */ var _pkg_version__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pkg-version */ 7185);

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.



// Version token that will be replaced by the prepack command
/** The version of the SignalR client. */

/** @private */
class Arg {
  static isRequired(val, name) {
    if (val === null || val === undefined) {
      throw new Error(`The '${name}' argument is required.`);
    }
  }
  static isNotEmpty(val, name) {
    if (!val || val.match(/^\s*$/)) {
      throw new Error(`The '${name}' argument should not be empty.`);
    }
  }
  static isIn(val, values, name) {
    // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
    if (!(val in values)) {
      throw new Error(`Unknown ${name} value: ${val}.`);
    }
  }
}
/** @private */
class Platform {
  // react-native has a window but no document so we should check both
  static get isBrowser() {
    return !Platform.isNode && typeof window === "object" && typeof window.document === "object";
  }
  // WebWorkers don't have a window object so the isBrowser check would fail
  static get isWebWorker() {
    return !Platform.isNode && typeof self === "object" && "importScripts" in self;
  }
  // react-native has a window but no document
  static get isReactNative() {
    return !Platform.isNode && typeof window === "object" && typeof window.document === "undefined";
  }
  // Node apps shouldn't have a window object, but WebWorkers don't either
  // so we need to check for both WebWorker and window
  static get isNode() {
    return typeof process !== "undefined" && process.release && process.release.name === "node";
  }
}
/** @private */
function getDataDetail(data, includeContent) {
  let detail = "";
  if (isArrayBuffer(data)) {
    detail = `Binary data of length ${data.byteLength}`;
    if (includeContent) {
      detail += `. Content: '${formatArrayBuffer(data)}'`;
    }
  } else if (typeof data === "string") {
    detail = `String data of length ${data.length}`;
    if (includeContent) {
      detail += `. Content: '${data}'`;
    }
  }
  return detail;
}
/** @private */
function formatArrayBuffer(data) {
  const view = new Uint8Array(data);
  // Uint8Array.map only supports returning another Uint8Array?
  let str = "";
  view.forEach(num => {
    const pad = num < 16 ? "0" : "";
    str += `0x${pad}${num.toString(16)} `;
  });
  // Trim of trailing space.
  return str.substring(0, str.length - 1);
}
// Also in signalr-protocol-msgpack/Utils.ts
/** @private */
function isArrayBuffer(val) {
  return val && typeof ArrayBuffer !== "undefined" && (val instanceof ArrayBuffer ||
  // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
  val.constructor && val.constructor.name === "ArrayBuffer");
}
/** @private */
function sendMessage(_x, _x2, _x3, _x4, _x5, _x6) {
  return _sendMessage.apply(this, arguments);
}
/** @private */
function _sendMessage() {
  _sendMessage = (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (logger, transportName, httpClient, url, content, options) {
    const headers = {};
    const [name, value] = getUserAgentHeader();
    headers[name] = value;
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(${transportName} transport) sending data. ${getDataDetail(content, options.logMessageContent)}.`);
    const responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
    const response = yield httpClient.post(url, {
      content,
      headers: {
        ...headers,
        ...options.headers
      },
      responseType,
      timeout: options.timeout,
      withCredentials: options.withCredentials
    });
    logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Trace, `(${transportName} transport) request complete. Response status: ${response.statusCode}.`);
  });
  return _sendMessage.apply(this, arguments);
}
function createLogger(logger) {
  if (logger === undefined) {
    return new ConsoleLogger(_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information);
  }
  if (logger === null) {
    return _Loggers__WEBPACK_IMPORTED_MODULE_3__.NullLogger.instance;
  }
  if (logger.log !== undefined) {
    return logger;
  }
  return new ConsoleLogger(logger);
}
/** @private */
class SubjectSubscription {
  constructor(subject, observer) {
    this._subject = subject;
    this._observer = observer;
  }
  dispose() {
    const index = this._subject.observers.indexOf(this._observer);
    if (index > -1) {
      this._subject.observers.splice(index, 1);
    }
    if (this._subject.observers.length === 0 && this._subject.cancelCallback) {
      this._subject.cancelCallback().catch(_ => {});
    }
  }
}
/** @private */
class ConsoleLogger {
  constructor(minimumLogLevel) {
    this._minLevel = minimumLogLevel;
    this.out = console;
  }
  log(logLevel, message) {
    if (logLevel >= this._minLevel) {
      const msg = `[${new Date().toISOString()}] ${_ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel[logLevel]}: ${message}`;
      switch (logLevel) {
        case _ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Critical:
        case _ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Error:
          this.out.error(msg);
          break;
        case _ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Warning:
          this.out.warn(msg);
          break;
        case _ILogger__WEBPACK_IMPORTED_MODULE_2__.LogLevel.Information:
          this.out.info(msg);
          break;
        default:
          // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
          this.out.log(msg);
          break;
      }
    }
  }
}
/** @private */
function getUserAgentHeader() {
  let userAgentHeaderName = "X-SignalR-User-Agent";
  if (Platform.isNode) {
    userAgentHeaderName = "User-Agent";
  }
  return [userAgentHeaderName, constructUserAgent(_pkg_version__WEBPACK_IMPORTED_MODULE_1__.VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
}
/** @private */
function constructUserAgent(version, os, runtime, runtimeVersion) {
  // Microsoft SignalR/[Version] ([Detailed Version]; [Operating System]; [Runtime]; [Runtime Version])
  let userAgent = "Microsoft SignalR/";
  const majorAndMinor = version.split(".");
  userAgent += `${majorAndMinor[0]}.${majorAndMinor[1]}`;
  userAgent += ` (${version}; `;
  if (os && os !== "") {
    userAgent += `${os}; `;
  } else {
    userAgent += "Unknown OS; ";
  }
  userAgent += `${runtime}`;
  if (runtimeVersion) {
    userAgent += `; ${runtimeVersion}`;
  } else {
    userAgent += "; Unknown Runtime Version";
  }
  userAgent += ")";
  return userAgent;
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/
function getOsName() {
  if (Platform.isNode) {
    switch (process.platform) {
      case "win32":
        return "Windows NT";
      case "darwin":
        return "macOS";
      case "linux":
        return "Linux";
      default:
        return process.platform;
    }
  } else {
    return "";
  }
}
// eslint-disable-next-line spaced-comment
/*#__PURE__*/
function getRuntimeVersion() {
  if (Platform.isNode) {
    return process.versions.node;
  }
  return undefined;
}
function getRuntime() {
  if (Platform.isNode) {
    return "NodeJS";
  } else {
    return "Browser";
  }
}
/** @private */
function getErrorString(e) {
  if (e.stack) {
    return e.stack;
  } else if (e.message) {
    return e.message;
  }
  return `${e}`;
}
/** @private */
function getGlobalThis() {
  // globalThis is semi-new and not available in Node until v12
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("could not find global");
}

/***/ }),

/***/ 2281:
/*!*********************************************************************!*\
  !*** ./node_modules/@angular/material/fesm2022/module-C9K6ZqpI.mjs ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ MAT_TOOLTIP_SCROLL_STRATEGY),
/* harmony export */   S: () => (/* binding */ SCROLL_THROTTLE_MS),
/* harmony export */   T: () => (/* binding */ TOOLTIP_PANEL_CLASS),
/* harmony export */   a: () => (/* binding */ MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY),
/* harmony export */   b: () => (/* binding */ MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER),
/* harmony export */   c: () => (/* binding */ MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY),
/* harmony export */   d: () => (/* binding */ MAT_TOOLTIP_DEFAULT_OPTIONS),
/* harmony export */   e: () => (/* binding */ MatTooltip),
/* harmony export */   f: () => (/* binding */ TooltipComponent),
/* harmony export */   g: () => (/* binding */ getMatTooltipInvalidPositionError),
/* harmony export */   h: () => (/* binding */ MatTooltipModule)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/cdk/a11y */ 2102);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/a11y */ 2418);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/cdk/a11y */ 9211);
/* harmony import */ var _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/cdk/overlay */ 6895);
/* harmony import */ var _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/cdk/scrolling */ 9975);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 3900);
/* harmony import */ var _angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/cdk/coercion */ 4527);
/* harmony import */ var _angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/cdk/coercion */ 4724);
/* harmony import */ var _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/cdk/keycodes */ 5758);
/* harmony import */ var _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/cdk/keycodes */ 4879);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/common */ 9770);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/cdk/platform */ 2516);
/* harmony import */ var _angular_cdk_platform__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/cdk/platform */ 4733);
/* harmony import */ var _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/cdk/bidi */ 9932);
/* harmony import */ var _angular_cdk_portal__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/cdk/portal */ 7480);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 819);
/* harmony import */ var _common_module_WayjW0Pb_mjs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./common-module-WayjW0Pb.mjs */ 7708);















/** Time in ms to throttle repositioning after scroll events. */
const _c0 = ["tooltip"];
const SCROLL_THROTTLE_MS = 20;
/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @docs-private
 */
function getMatTooltipInvalidPositionError(position) {
  return Error(`Tooltip position "${position}" is invalid.`);
}
/** Injection token that determines the scroll handling while a tooltip is visible. */
const MAT_TOOLTIP_SCROLL_STRATEGY = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('mat-tooltip-scroll-strategy', {
  providedIn: 'root',
  factory: () => {
    const overlay = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_1__.a);
    return () => overlay.scrollStrategies.reposition({
      scrollThrottle: SCROLL_THROTTLE_MS
    });
  }
});
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
function MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay) {
  return () => overlay.scrollStrategies.reposition({
    scrollThrottle: SCROLL_THROTTLE_MS
  });
}
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: MAT_TOOLTIP_SCROLL_STRATEGY,
  deps: [_angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_1__.a],
  useFactory: MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY
};
/**
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
function MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY() {
  return {
    showDelay: 0,
    hideDelay: 0,
    touchendHideDelay: 1500
  };
}
/** Injection token to be used to override the default options for `matTooltip`. */
const MAT_TOOLTIP_DEFAULT_OPTIONS = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('mat-tooltip-default-options', {
  providedIn: 'root',
  factory: MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY
});
/**
 * CSS class that will be attached to the overlay panel.
 * @deprecated
 * @breaking-change 13.0.0 remove this variable
 */
const TOOLTIP_PANEL_CLASS = 'mat-mdc-tooltip-panel';
const PANEL_CLASS = 'tooltip-panel';
/** Options used to bind passive event listeners. */
const passiveListenerOptions = (0,_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_2__.n)({
  passive: true
});
// These constants were taken from MDC's `numbers` object. We can't import them from MDC,
// because they have some top-level references to `window` which break during SSR.
const MIN_VIEWPORT_TOOLTIP_THRESHOLD = 8;
const UNBOUNDED_ANCHOR_GAP = 8;
const MIN_HEIGHT = 24;
const MAX_WIDTH = 200;
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.io/design/components/tooltips.html
 */
class MatTooltip {
  _elementRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef);
  _ngZone = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone);
  _platform = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_cdk_platform__WEBPACK_IMPORTED_MODULE_3__.P);
  _ariaDescriber = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_4__.AriaDescriber);
  _focusMonitor = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_5__.F);
  _dir = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_6__.D);
  _injector = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.Injector);
  _viewContainerRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewContainerRef);
  _defaultOptions = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(MAT_TOOLTIP_DEFAULT_OPTIONS, {
    optional: true
  });
  _overlayRef;
  _tooltipInstance;
  _portal;
  _position = 'below';
  _positionAtOrigin = false;
  _disabled = false;
  _tooltipClass;
  _viewInitialized = false;
  _pointerExitEventsInitialized = false;
  _tooltipComponent = TooltipComponent;
  _viewportMargin = 8;
  _currentPosition;
  _cssClassPrefix = 'mat-mdc';
  _ariaDescriptionPending;
  _dirSubscribed = false;
  /** Allows the user to define the position of the tooltip relative to the parent element */
  get position() {
    return this._position;
  }
  set position(value) {
    if (value !== this._position) {
      this._position = value;
      if (this._overlayRef) {
        this._updatePosition(this._overlayRef);
        this._tooltipInstance?.show(0);
        this._overlayRef.updatePosition();
      }
    }
  }
  /**
   * Whether tooltip should be relative to the click or touch origin
   * instead of outside the element bounding box.
   */
  get positionAtOrigin() {
    return this._positionAtOrigin;
  }
  set positionAtOrigin(value) {
    this._positionAtOrigin = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_7__.c)(value);
    this._detach();
    this._overlayRef = null;
  }
  /** Disables the display of the tooltip. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    const isDisabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_7__.c)(value);
    if (this._disabled !== isDisabled) {
      this._disabled = isDisabled;
      // If tooltip is disabled, hide immediately.
      if (isDisabled) {
        this.hide(0);
      } else {
        this._setupPointerEnterEventsIfNeeded();
      }
      this._syncAriaDescription(this.message);
    }
  }
  /** The default delay in ms before showing the tooltip after show is called */
  get showDelay() {
    return this._showDelay;
  }
  set showDelay(value) {
    this._showDelay = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_8__.c)(value);
  }
  _showDelay;
  /** The default delay in ms before hiding the tooltip after hide is called */
  get hideDelay() {
    return this._hideDelay;
  }
  set hideDelay(value) {
    this._hideDelay = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_8__.c)(value);
    if (this._tooltipInstance) {
      this._tooltipInstance._mouseLeaveHideDelay = this._hideDelay;
    }
  }
  _hideDelay;
  /**
   * How touch gestures should be handled by the tooltip. On touch devices the tooltip directive
   * uses a long press gesture to show and hide, however it can conflict with the native browser
   * gestures. To work around the conflict, Angular Material disables native gestures on the
   * trigger, but that might not be desirable on particular elements (e.g. inputs and draggable
   * elements). The different values for this option configure the touch event handling as follows:
   * - `auto` - Enables touch gestures for all elements, but tries to avoid conflicts with native
   *   browser gestures on particular elements. In particular, it allows text selection on inputs
   *   and textareas, and preserves the native browser dragging on elements marked as `draggable`.
   * - `on` - Enables touch gestures for all elements and disables native
   *   browser gestures with no exceptions.
   * - `off` - Disables touch gestures. Note that this will prevent the tooltip from
   *   showing on touch devices.
   */
  touchGestures = 'auto';
  /** The message to be displayed in the tooltip */
  get message() {
    return this._message;
  }
  set message(value) {
    const oldMessage = this._message;
    // If the message is not a string (e.g. number), convert it to a string and trim it.
    // Must convert with `String(value)`, not `${value}`, otherwise Closure Compiler optimises
    // away the string-conversion: https://github.com/angular/components/issues/20684
    this._message = value != null ? String(value).trim() : '';
    if (!this._message && this._isTooltipVisible()) {
      this.hide(0);
    } else {
      this._setupPointerEnterEventsIfNeeded();
      this._updateTooltipMessage();
    }
    this._syncAriaDescription(oldMessage);
  }
  _message = '';
  /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
  get tooltipClass() {
    return this._tooltipClass;
  }
  set tooltipClass(value) {
    this._tooltipClass = value;
    if (this._tooltipInstance) {
      this._setTooltipClass(this._tooltipClass);
    }
  }
  /** Manually-bound passive event listeners. */
  _passiveListeners = [];
  /** Timer started at the last `touchstart` event. */
  _touchstartTimeout = null;
  /** Emits when the component is destroyed. */
  _destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_9__.Subject();
  /** Whether ngOnDestroyed has been called. */
  _isDestroyed = false;
  constructor() {
    const defaultOptions = this._defaultOptions;
    if (defaultOptions) {
      this._showDelay = defaultOptions.showDelay;
      this._hideDelay = defaultOptions.hideDelay;
      if (defaultOptions.position) {
        this.position = defaultOptions.position;
      }
      if (defaultOptions.positionAtOrigin) {
        this.positionAtOrigin = defaultOptions.positionAtOrigin;
      }
      if (defaultOptions.touchGestures) {
        this.touchGestures = defaultOptions.touchGestures;
      }
      if (defaultOptions.tooltipClass) {
        this.tooltipClass = defaultOptions.tooltipClass;
      }
    }
    this._viewportMargin = MIN_VIEWPORT_TOOLTIP_THRESHOLD;
  }
  ngAfterViewInit() {
    // This needs to happen after view init so the initial values for all inputs have been set.
    this._viewInitialized = true;
    this._setupPointerEnterEventsIfNeeded();
    this._focusMonitor.monitor(this._elementRef).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this._destroyed)).subscribe(origin => {
      // Note that the focus monitor runs outside the Angular zone.
      if (!origin) {
        this._ngZone.run(() => this.hide(0));
      } else if (origin === 'keyboard') {
        this._ngZone.run(() => this.show());
      }
    });
  }
  /**
   * Dispose the tooltip when destroyed.
   */
  ngOnDestroy() {
    const nativeElement = this._elementRef.nativeElement;
    // Optimization: Do not call clearTimeout unless there is an active timer.
    if (this._touchstartTimeout) {
      clearTimeout(this._touchstartTimeout);
    }
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._tooltipInstance = null;
    }
    // Clean up the event listeners set in the constructor
    this._passiveListeners.forEach(([event, listener]) => {
      nativeElement.removeEventListener(event, listener, passiveListenerOptions);
    });
    this._passiveListeners.length = 0;
    this._destroyed.next();
    this._destroyed.complete();
    this._isDestroyed = true;
    this._ariaDescriber.removeDescription(nativeElement, this.message, 'tooltip');
    this._focusMonitor.stopMonitoring(nativeElement);
  }
  /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
  show(delay = this.showDelay, origin) {
    if (this.disabled || !this.message || this._isTooltipVisible()) {
      this._tooltipInstance?._cancelPendingAnimations();
      return;
    }
    const overlayRef = this._createOverlay(origin);
    this._detach();
    this._portal = this._portal || new _angular_cdk_portal__WEBPACK_IMPORTED_MODULE_11__.C(this._tooltipComponent, this._viewContainerRef);
    const instance = this._tooltipInstance = overlayRef.attach(this._portal).instance;
    instance._triggerElement = this._elementRef.nativeElement;
    instance._mouseLeaveHideDelay = this._hideDelay;
    instance.afterHidden().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this._destroyed)).subscribe(() => this._detach());
    this._setTooltipClass(this._tooltipClass);
    this._updateTooltipMessage();
    instance.show(delay);
  }
  /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
  hide(delay = this.hideDelay) {
    const instance = this._tooltipInstance;
    if (instance) {
      if (instance.isVisible()) {
        instance.hide(delay);
      } else {
        instance._cancelPendingAnimations();
        this._detach();
      }
    }
  }
  /** Shows/hides the tooltip */
  toggle(origin) {
    this._isTooltipVisible() ? this.hide() : this.show(undefined, origin);
  }
  /** Returns true if the tooltip is currently visible to the user */
  _isTooltipVisible() {
    return !!this._tooltipInstance && this._tooltipInstance.isVisible();
  }
  /** Create the overlay config and position strategy */
  _createOverlay(origin) {
    if (this._overlayRef) {
      const existingStrategy = this._overlayRef.getConfig().positionStrategy;
      if ((!this.positionAtOrigin || !origin) && existingStrategy._origin instanceof _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef) {
        return this._overlayRef;
      }
      this._detach();
    }
    const scrollableAncestors = this._injector.get(_angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_12__.ScrollDispatcher).getAncestorScrollContainers(this._elementRef);
    const overlay = this._injector.get(_angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_1__.a);
    // Create connected position strategy that listens for scroll events to reposition.
    const strategy = overlay.position().flexibleConnectedTo(this.positionAtOrigin ? origin || this._elementRef : this._elementRef).withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`).withFlexibleDimensions(false).withViewportMargin(this._viewportMargin).withScrollableContainers(scrollableAncestors);
    strategy.positionChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this._destroyed)).subscribe(change => {
      this._updateCurrentPositionClass(change.connectionPair);
      if (this._tooltipInstance) {
        if (change.scrollableViewProperties.isOverlayClipped && this._tooltipInstance.isVisible()) {
          // After position changes occur and the overlay is clipped by
          // a parent scrollable then close the tooltip.
          this._ngZone.run(() => this.hide(0));
        }
      }
    });
    this._overlayRef = overlay.create({
      direction: this._dir,
      positionStrategy: strategy,
      panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}`,
      scrollStrategy: this._injector.get(MAT_TOOLTIP_SCROLL_STRATEGY)()
    });
    this._updatePosition(this._overlayRef);
    this._overlayRef.detachments().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this._destroyed)).subscribe(() => this._detach());
    this._overlayRef.outsidePointerEvents().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this._destroyed)).subscribe(() => this._tooltipInstance?._handleBodyInteraction());
    this._overlayRef.keydownEvents().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this._destroyed)).subscribe(event => {
      if (this._isTooltipVisible() && event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_13__.g && !(0,_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_14__.hasModifierKey)(event)) {
        event.preventDefault();
        event.stopPropagation();
        this._ngZone.run(() => this.hide(0));
      }
    });
    if (this._defaultOptions?.disableTooltipInteractivity) {
      this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`);
    }
    if (!this._dirSubscribed) {
      this._dirSubscribed = true;
      this._dir.change.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this._destroyed)).subscribe(() => {
        if (this._overlayRef) {
          this._updatePosition(this._overlayRef);
        }
      });
    }
    return this._overlayRef;
  }
  /** Detaches the currently-attached tooltip. */
  _detach() {
    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
    }
    this._tooltipInstance = null;
  }
  /** Updates the position of the current tooltip. */
  _updatePosition(overlayRef) {
    const position = overlayRef.getConfig().positionStrategy;
    const origin = this._getOrigin();
    const overlay = this._getOverlayPosition();
    position.withPositions([this._addOffset({
      ...origin.main,
      ...overlay.main
    }), this._addOffset({
      ...origin.fallback,
      ...overlay.fallback
    })]);
  }
  /** Adds the configured offset to a position. Used as a hook for child classes. */
  _addOffset(position) {
    const offset = UNBOUNDED_ANCHOR_GAP;
    const isLtr = !this._dir || this._dir.value == 'ltr';
    if (position.originY === 'top') {
      position.offsetY = -offset;
    } else if (position.originY === 'bottom') {
      position.offsetY = offset;
    } else if (position.originX === 'start') {
      position.offsetX = isLtr ? -offset : offset;
    } else if (position.originX === 'end') {
      position.offsetX = isLtr ? offset : -offset;
    }
    return position;
  }
  /**
   * Returns the origin position and a fallback position based on the user's position preference.
   * The fallback position is the inverse of the origin (e.g. `'below' -> 'above'`).
   */
  _getOrigin() {
    const isLtr = !this._dir || this._dir.value == 'ltr';
    const position = this.position;
    let originPosition;
    if (position == 'above' || position == 'below') {
      originPosition = {
        originX: 'center',
        originY: position == 'above' ? 'top' : 'bottom'
      };
    } else if (position == 'before' || position == 'left' && isLtr || position == 'right' && !isLtr) {
      originPosition = {
        originX: 'start',
        originY: 'center'
      };
    } else if (position == 'after' || position == 'right' && isLtr || position == 'left' && !isLtr) {
      originPosition = {
        originX: 'end',
        originY: 'center'
      };
    } else if (typeof ngDevMode === 'undefined' || ngDevMode) {
      throw getMatTooltipInvalidPositionError(position);
    }
    const {
      x,
      y
    } = this._invertPosition(originPosition.originX, originPosition.originY);
    return {
      main: originPosition,
      fallback: {
        originX: x,
        originY: y
      }
    };
  }
  /** Returns the overlay position and a fallback position based on the user's preference */
  _getOverlayPosition() {
    const isLtr = !this._dir || this._dir.value == 'ltr';
    const position = this.position;
    let overlayPosition;
    if (position == 'above') {
      overlayPosition = {
        overlayX: 'center',
        overlayY: 'bottom'
      };
    } else if (position == 'below') {
      overlayPosition = {
        overlayX: 'center',
        overlayY: 'top'
      };
    } else if (position == 'before' || position == 'left' && isLtr || position == 'right' && !isLtr) {
      overlayPosition = {
        overlayX: 'end',
        overlayY: 'center'
      };
    } else if (position == 'after' || position == 'right' && isLtr || position == 'left' && !isLtr) {
      overlayPosition = {
        overlayX: 'start',
        overlayY: 'center'
      };
    } else if (typeof ngDevMode === 'undefined' || ngDevMode) {
      throw getMatTooltipInvalidPositionError(position);
    }
    const {
      x,
      y
    } = this._invertPosition(overlayPosition.overlayX, overlayPosition.overlayY);
    return {
      main: overlayPosition,
      fallback: {
        overlayX: x,
        overlayY: y
      }
    };
  }
  /** Updates the tooltip message and repositions the overlay according to the new message length */
  _updateTooltipMessage() {
    // Must wait for the message to be painted to the tooltip so that the overlay can properly
    // calculate the correct positioning based on the size of the text.
    if (this._tooltipInstance) {
      this._tooltipInstance.message = this.message;
      this._tooltipInstance._markForCheck();
      (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.afterNextRender)(() => {
        if (this._tooltipInstance) {
          this._overlayRef.updatePosition();
        }
      }, {
        injector: this._injector
      });
    }
  }
  /** Updates the tooltip class */
  _setTooltipClass(tooltipClass) {
    if (this._tooltipInstance) {
      this._tooltipInstance.tooltipClass = tooltipClass;
      this._tooltipInstance._markForCheck();
    }
  }
  /** Inverts an overlay position. */
  _invertPosition(x, y) {
    if (this.position === 'above' || this.position === 'below') {
      if (y === 'top') {
        y = 'bottom';
      } else if (y === 'bottom') {
        y = 'top';
      }
    } else {
      if (x === 'end') {
        x = 'start';
      } else if (x === 'start') {
        x = 'end';
      }
    }
    return {
      x,
      y
    };
  }
  /** Updates the class on the overlay panel based on the current position of the tooltip. */
  _updateCurrentPositionClass(connectionPair) {
    const {
      overlayY,
      originX,
      originY
    } = connectionPair;
    let newPosition;
    // If the overlay is in the middle along the Y axis,
    // it means that it's either before or after.
    if (overlayY === 'center') {
      // Note that since this information is used for styling, we want to
      // resolve `start` and `end` to their real values, otherwise consumers
      // would have to remember to do it themselves on each consumption.
      if (this._dir && this._dir.value === 'rtl') {
        newPosition = originX === 'end' ? 'left' : 'right';
      } else {
        newPosition = originX === 'start' ? 'left' : 'right';
      }
    } else {
      newPosition = overlayY === 'bottom' && originY === 'top' ? 'above' : 'below';
    }
    if (newPosition !== this._currentPosition) {
      const overlayRef = this._overlayRef;
      if (overlayRef) {
        const classPrefix = `${this._cssClassPrefix}-${PANEL_CLASS}-`;
        overlayRef.removePanelClass(classPrefix + this._currentPosition);
        overlayRef.addPanelClass(classPrefix + newPosition);
      }
      this._currentPosition = newPosition;
    }
  }
  /** Binds the pointer events to the tooltip trigger. */
  _setupPointerEnterEventsIfNeeded() {
    // Optimization: Defer hooking up events if there's no message or the tooltip is disabled.
    if (this._disabled || !this.message || !this._viewInitialized || this._passiveListeners.length) {
      return;
    }
    // The mouse events shouldn't be bound on mobile devices, because they can prevent the
    // first tap from firing its click event or can cause the tooltip to open for clicks.
    if (this._platformSupportsMouseEvents()) {
      this._passiveListeners.push(['mouseenter', event => {
        this._setupPointerExitEventsIfNeeded();
        let point = undefined;
        if (event.x !== undefined && event.y !== undefined) {
          point = event;
        }
        this.show(undefined, point);
      }]);
    } else if (this.touchGestures !== 'off') {
      this._disableNativeGesturesIfNecessary();
      this._passiveListeners.push(['touchstart', event => {
        const touch = event.targetTouches?.[0];
        const origin = touch ? {
          x: touch.clientX,
          y: touch.clientY
        } : undefined;
        // Note that it's important that we don't `preventDefault` here,
        // because it can prevent click events from firing on the element.
        this._setupPointerExitEventsIfNeeded();
        if (this._touchstartTimeout) {
          clearTimeout(this._touchstartTimeout);
        }
        const DEFAULT_LONGPRESS_DELAY = 500;
        this._touchstartTimeout = setTimeout(() => {
          this._touchstartTimeout = null;
          this.show(undefined, origin);
        }, this._defaultOptions?.touchLongPressShowDelay ?? DEFAULT_LONGPRESS_DELAY);
      }]);
    }
    this._addListeners(this._passiveListeners);
  }
  _setupPointerExitEventsIfNeeded() {
    if (this._pointerExitEventsInitialized) {
      return;
    }
    this._pointerExitEventsInitialized = true;
    const exitListeners = [];
    if (this._platformSupportsMouseEvents()) {
      exitListeners.push(['mouseleave', event => {
        const newTarget = event.relatedTarget;
        if (!newTarget || !this._overlayRef?.overlayElement.contains(newTarget)) {
          this.hide();
        }
      }], ['wheel', event => this._wheelListener(event)]);
    } else if (this.touchGestures !== 'off') {
      this._disableNativeGesturesIfNecessary();
      const touchendListener = () => {
        if (this._touchstartTimeout) {
          clearTimeout(this._touchstartTimeout);
        }
        this.hide(this._defaultOptions?.touchendHideDelay);
      };
      exitListeners.push(['touchend', touchendListener], ['touchcancel', touchendListener]);
    }
    this._addListeners(exitListeners);
    this._passiveListeners.push(...exitListeners);
  }
  _addListeners(listeners) {
    listeners.forEach(([event, listener]) => {
      this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions);
    });
  }
  _platformSupportsMouseEvents() {
    return !this._platform.IOS && !this._platform.ANDROID;
  }
  /** Listener for the `wheel` event on the element. */
  _wheelListener(event) {
    if (this._isTooltipVisible()) {
      const elementUnderPointer = this._injector.get(_angular_common__WEBPACK_IMPORTED_MODULE_15__.DOCUMENT).elementFromPoint(event.clientX, event.clientY);
      const element = this._elementRef.nativeElement;
      // On non-touch devices we depend on the `mouseleave` event to close the tooltip, but it
      // won't fire if the user scrolls away using the wheel without moving their cursor. We
      // work around it by finding the element under the user's cursor and closing the tooltip
      // if it's not the trigger.
      if (elementUnderPointer !== element && !element.contains(elementUnderPointer)) {
        this.hide();
      }
    }
  }
  /** Disables the native browser gestures, based on how the tooltip has been configured. */
  _disableNativeGesturesIfNecessary() {
    const gestures = this.touchGestures;
    if (gestures !== 'off') {
      const element = this._elementRef.nativeElement;
      const style = element.style;
      // If gestures are set to `auto`, we don't disable text selection on inputs and
      // textareas, because it prevents the user from typing into them on iOS Safari.
      if (gestures === 'on' || element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA') {
        style.userSelect = style.msUserSelect = style.webkitUserSelect = style.MozUserSelect = 'none';
      }
      // If we have `auto` gestures and the element uses native HTML dragging,
      // we don't set `-webkit-user-drag` because it prevents the native behavior.
      if (gestures === 'on' || !element.draggable) {
        style.webkitUserDrag = 'none';
      }
      style.touchAction = 'none';
      style.webkitTapHighlightColor = 'transparent';
    }
  }
  /** Updates the tooltip's ARIA description based on it current state. */
  _syncAriaDescription(oldMessage) {
    if (this._ariaDescriptionPending) {
      return;
    }
    this._ariaDescriptionPending = true;
    this._ariaDescriber.removeDescription(this._elementRef.nativeElement, oldMessage, 'tooltip');
    // The `AriaDescriber` has some functionality that avoids adding a description if it's the
    // same as the `aria-label` of an element, however we can't know whether the tooltip trigger
    // has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
    // issue by deferring the description by a tick so Angular has time to set the `aria-label`.
    if (!this._isDestroyed) {
      (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.afterNextRender)({
        write: () => {
          this._ariaDescriptionPending = false;
          if (this.message && !this.disabled) {
            this._ariaDescriber.describe(this._elementRef.nativeElement, this.message, 'tooltip');
          }
        }
      }, {
        injector: this._injector
      });
    }
  }
  static ɵfac = function MatTooltip_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MatTooltip)();
  };
  static ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
    type: MatTooltip,
    selectors: [["", "matTooltip", ""]],
    hostAttrs: [1, "mat-mdc-tooltip-trigger"],
    hostVars: 2,
    hostBindings: function MatTooltip_HostBindings(rf, ctx) {
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mat-mdc-tooltip-disabled", ctx.disabled);
      }
    },
    inputs: {
      position: [0, "matTooltipPosition", "position"],
      positionAtOrigin: [0, "matTooltipPositionAtOrigin", "positionAtOrigin"],
      disabled: [0, "matTooltipDisabled", "disabled"],
      showDelay: [0, "matTooltipShowDelay", "showDelay"],
      hideDelay: [0, "matTooltipHideDelay", "hideDelay"],
      touchGestures: [0, "matTooltipTouchGestures", "touchGestures"],
      message: [0, "matTooltip", "message"],
      tooltipClass: [0, "matTooltipClass", "tooltipClass"]
    },
    exportAs: ["matTooltip"]
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatTooltip, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: '[matTooltip]',
      exportAs: 'matTooltip',
      host: {
        'class': 'mat-mdc-tooltip-trigger',
        '[class.mat-mdc-tooltip-disabled]': 'disabled'
      }
    }]
  }], () => [], {
    position: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matTooltipPosition']
    }],
    positionAtOrigin: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matTooltipPositionAtOrigin']
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matTooltipDisabled']
    }],
    showDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matTooltipShowDelay']
    }],
    hideDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matTooltipHideDelay']
    }],
    touchGestures: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matTooltipTouchGestures']
    }],
    message: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matTooltip']
    }],
    tooltipClass: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matTooltipClass']
    }]
  });
})();
/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
class TooltipComponent {
  _changeDetectorRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef);
  _elementRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef);
  /* Whether the tooltip text overflows to multiple lines */
  _isMultiline = false;
  /** Message to display in the tooltip */
  message;
  /** Classes to be added to the tooltip. Supports the same syntax as `ngClass`. */
  tooltipClass;
  /** The timeout ID of any current timer set to show the tooltip */
  _showTimeoutId;
  /** The timeout ID of any current timer set to hide the tooltip */
  _hideTimeoutId;
  /** Element that caused the tooltip to open. */
  _triggerElement;
  /** Amount of milliseconds to delay the closing sequence. */
  _mouseLeaveHideDelay;
  /** Whether animations are currently disabled. */
  _animationsDisabled;
  /** Reference to the internal tooltip element. */
  _tooltip;
  /** Whether interactions on the page should close the tooltip */
  _closeOnInteraction = false;
  /** Whether the tooltip is currently visible. */
  _isVisible = false;
  /** Subject for notifying that the tooltip has been hidden from the view */
  _onHide = new rxjs__WEBPACK_IMPORTED_MODULE_9__.Subject();
  /** Name of the show animation and the class that toggles it. */
  _showAnimation = 'mat-mdc-tooltip-show';
  /** Name of the hide animation and the class that toggles it. */
  _hideAnimation = 'mat-mdc-tooltip-hide';
  constructor() {
    const animationMode = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_MODULE_TYPE, {
      optional: true
    });
    this._animationsDisabled = animationMode === 'NoopAnimations';
  }
  /**
   * Shows the tooltip with an animation originating from the provided origin
   * @param delay Amount of milliseconds to the delay showing the tooltip.
   */
  show(delay) {
    // Cancel the delayed hide if it is scheduled
    if (this._hideTimeoutId != null) {
      clearTimeout(this._hideTimeoutId);
    }
    this._showTimeoutId = setTimeout(() => {
      this._toggleVisibility(true);
      this._showTimeoutId = undefined;
    }, delay);
  }
  /**
   * Begins the animation to hide the tooltip after the provided delay in ms.
   * @param delay Amount of milliseconds to delay showing the tooltip.
   */
  hide(delay) {
    // Cancel the delayed show if it is scheduled
    if (this._showTimeoutId != null) {
      clearTimeout(this._showTimeoutId);
    }
    this._hideTimeoutId = setTimeout(() => {
      this._toggleVisibility(false);
      this._hideTimeoutId = undefined;
    }, delay);
  }
  /** Returns an observable that notifies when the tooltip has been hidden from view. */
  afterHidden() {
    return this._onHide;
  }
  /** Whether the tooltip is being displayed. */
  isVisible() {
    return this._isVisible;
  }
  ngOnDestroy() {
    this._cancelPendingAnimations();
    this._onHide.complete();
    this._triggerElement = null;
  }
  /**
   * Interactions on the HTML body should close the tooltip immediately as defined in the
   * material design spec.
   * https://material.io/design/components/tooltips.html#behavior
   */
  _handleBodyInteraction() {
    if (this._closeOnInteraction) {
      this.hide(0);
    }
  }
  /**
   * Marks that the tooltip needs to be checked in the next change detection run.
   * Mainly used for rendering the initial text before positioning a tooltip, which
   * can be problematic in components with OnPush change detection.
   */
  _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }
  _handleMouseLeave({
    relatedTarget
  }) {
    if (!relatedTarget || !this._triggerElement.contains(relatedTarget)) {
      if (this.isVisible()) {
        this.hide(this._mouseLeaveHideDelay);
      } else {
        this._finalizeAnimation(false);
      }
    }
  }
  /**
   * Callback for when the timeout in this.show() gets completed.
   * This method is only needed by the mdc-tooltip, and so it is only implemented
   * in the mdc-tooltip, not here.
   */
  _onShow() {
    this._isMultiline = this._isTooltipMultiline();
    this._markForCheck();
  }
  /** Whether the tooltip text has overflown to the next line */
  _isTooltipMultiline() {
    const rect = this._elementRef.nativeElement.getBoundingClientRect();
    return rect.height > MIN_HEIGHT && rect.width >= MAX_WIDTH;
  }
  /** Event listener dispatched when an animation on the tooltip finishes. */
  _handleAnimationEnd({
    animationName
  }) {
    if (animationName === this._showAnimation || animationName === this._hideAnimation) {
      this._finalizeAnimation(animationName === this._showAnimation);
    }
  }
  /** Cancels any pending animation sequences. */
  _cancelPendingAnimations() {
    if (this._showTimeoutId != null) {
      clearTimeout(this._showTimeoutId);
    }
    if (this._hideTimeoutId != null) {
      clearTimeout(this._hideTimeoutId);
    }
    this._showTimeoutId = this._hideTimeoutId = undefined;
  }
  /** Handles the cleanup after an animation has finished. */
  _finalizeAnimation(toVisible) {
    if (toVisible) {
      this._closeOnInteraction = true;
    } else if (!this.isVisible()) {
      this._onHide.next();
    }
  }
  /** Toggles the visibility of the tooltip element. */
  _toggleVisibility(isVisible) {
    // We set the classes directly here ourselves so that toggling the tooltip state
    // isn't bound by change detection. This allows us to hide it even if the
    // view ref has been detached from the CD tree.
    const tooltip = this._tooltip.nativeElement;
    const showClass = this._showAnimation;
    const hideClass = this._hideAnimation;
    tooltip.classList.remove(isVisible ? hideClass : showClass);
    tooltip.classList.add(isVisible ? showClass : hideClass);
    if (this._isVisible !== isVisible) {
      this._isVisible = isVisible;
      this._changeDetectorRef.markForCheck();
    }
    // It's common for internal apps to disable animations using `* { animation: none !important }`
    // which can break the opening sequence. Try to detect such cases and work around them.
    if (isVisible && !this._animationsDisabled && typeof getComputedStyle === 'function') {
      const styles = getComputedStyle(tooltip);
      // Use `getPropertyValue` to avoid issues with property renaming.
      if (styles.getPropertyValue('animation-duration') === '0s' || styles.getPropertyValue('animation-name') === 'none') {
        this._animationsDisabled = true;
      }
    }
    if (isVisible) {
      this._onShow();
    }
    if (this._animationsDisabled) {
      tooltip.classList.add('_mat-animation-noopable');
      this._finalizeAnimation(isVisible);
    }
  }
  static ɵfac = function TooltipComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || TooltipComponent)();
  };
  static ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: TooltipComponent,
    selectors: [["mat-tooltip-component"]],
    viewQuery: function TooltipComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, 7);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._tooltip = _t.first);
      }
    },
    hostAttrs: ["aria-hidden", "true"],
    hostBindings: function TooltipComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("mouseleave", function TooltipComponent_mouseleave_HostBindingHandler($event) {
          return ctx._handleMouseLeave($event);
        });
      }
    },
    decls: 4,
    vars: 4,
    consts: [["tooltip", ""], [1, "mdc-tooltip", "mat-mdc-tooltip", 3, "animationend", "ngClass"], [1, "mat-mdc-tooltip-surface", "mdc-tooltip__surface"]],
    template: function TooltipComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1, 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("animationend", function TooltipComponent_Template_div_animationend_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
          return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx._handleAnimationEnd($event));
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mdc-tooltip--multiline", ctx._isMultiline);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx.tooltipClass);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.message);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_16__.NgClass],
    styles: [".mat-mdc-tooltip{position:relative;transform:scale(0);display:inline-flex}.mat-mdc-tooltip::before{content:\"\";top:0;right:0;bottom:0;left:0;z-index:-1;position:absolute}.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before{top:-8px}.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before{bottom:-8px}.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before{left:-8px}.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before{right:-8px}.mat-mdc-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-surface{word-break:normal;overflow-wrap:anywhere;padding:4px 8px;min-width:40px;max-width:200px;min-height:24px;max-height:40vh;box-sizing:border-box;overflow:hidden;text-align:center;will-change:transform,opacity;background-color:var(--mdc-plain-tooltip-container-color, var(--mat-sys-inverse-surface));color:var(--mdc-plain-tooltip-supporting-text-color, var(--mat-sys-inverse-on-surface));border-radius:var(--mdc-plain-tooltip-container-shape, var(--mat-sys-corner-extra-small));font-family:var(--mdc-plain-tooltip-supporting-text-font, var(--mat-sys-body-small-font));font-size:var(--mdc-plain-tooltip-supporting-text-size, var(--mat-sys-body-small-size));font-weight:var(--mdc-plain-tooltip-supporting-text-weight, var(--mat-sys-body-small-weight));line-height:var(--mdc-plain-tooltip-supporting-text-line-height, var(--mat-sys-body-small-line-height));letter-spacing:var(--mdc-plain-tooltip-supporting-text-tracking, var(--mat-sys-body-small-tracking))}.mat-mdc-tooltip-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:left}[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:right}.mat-mdc-tooltip-panel{line-height:normal}.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-mdc-tooltip-show{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}@keyframes mat-mdc-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.8)}}.mat-mdc-tooltip-show{animation:mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-mdc-tooltip-hide{animation:mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TooltipComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Component,
    args: [{
      selector: 'mat-tooltip-component',
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewEncapsulation.None,
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectionStrategy.OnPush,
      host: {
        '(mouseleave)': '_handleMouseLeave($event)',
        'aria-hidden': 'true'
      },
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_16__.NgClass],
      template: "<div\n  #tooltip\n  class=\"mdc-tooltip mat-mdc-tooltip\"\n  [ngClass]=\"tooltipClass\"\n  (animationend)=\"_handleAnimationEnd($event)\"\n  [class.mdc-tooltip--multiline]=\"_isMultiline\">\n  <div class=\"mat-mdc-tooltip-surface mdc-tooltip__surface\">{{message}}</div>\n</div>\n",
      styles: [".mat-mdc-tooltip{position:relative;transform:scale(0);display:inline-flex}.mat-mdc-tooltip::before{content:\"\";top:0;right:0;bottom:0;left:0;z-index:-1;position:absolute}.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before{top:-8px}.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before{bottom:-8px}.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before{left:-8px}.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before{right:-8px}.mat-mdc-tooltip._mat-animation-noopable{animation:none;transform:scale(1)}.mat-mdc-tooltip-surface{word-break:normal;overflow-wrap:anywhere;padding:4px 8px;min-width:40px;max-width:200px;min-height:24px;max-height:40vh;box-sizing:border-box;overflow:hidden;text-align:center;will-change:transform,opacity;background-color:var(--mdc-plain-tooltip-container-color, var(--mat-sys-inverse-surface));color:var(--mdc-plain-tooltip-supporting-text-color, var(--mat-sys-inverse-on-surface));border-radius:var(--mdc-plain-tooltip-container-shape, var(--mat-sys-corner-extra-small));font-family:var(--mdc-plain-tooltip-supporting-text-font, var(--mat-sys-body-small-font));font-size:var(--mdc-plain-tooltip-supporting-text-size, var(--mat-sys-body-small-size));font-weight:var(--mdc-plain-tooltip-supporting-text-weight, var(--mat-sys-body-small-weight));line-height:var(--mdc-plain-tooltip-supporting-text-line-height, var(--mat-sys-body-small-line-height));letter-spacing:var(--mdc-plain-tooltip-supporting-text-tracking, var(--mat-sys-body-small-tracking))}.mat-mdc-tooltip-surface::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:\"\";pointer-events:none}.mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:left}[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface{text-align:right}.mat-mdc-tooltip-panel{line-height:normal}.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive{pointer-events:none}@keyframes mat-mdc-tooltip-show{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}@keyframes mat-mdc-tooltip-hide{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.8)}}.mat-mdc-tooltip-show{animation:mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards}.mat-mdc-tooltip-hide{animation:mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards}\n"]
    }]
  }], () => [], {
    _tooltip: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewChild,
      args: ['tooltip', {
        // Use a static query here since we interact directly with
        // the DOM which can happen before `ngAfterViewInit`.
        static: true
      }]
    }]
  });
})();
class MatTooltipModule {
  static ɵfac = function MatTooltipModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MatTooltipModule)();
  };
  static ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
    type: MatTooltipModule
  });
  static ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
    providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
    imports: [_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_17__.A, _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_1__.m, _common_module_WayjW0Pb_mjs__WEBPACK_IMPORTED_MODULE_18__.M, _common_module_WayjW0Pb_mjs__WEBPACK_IMPORTED_MODULE_18__.M, _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_12__.CdkScrollableModule]
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatTooltipModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
    args: [{
      imports: [_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_17__.A, _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_1__.m, _common_module_WayjW0Pb_mjs__WEBPACK_IMPORTED_MODULE_18__.M, MatTooltip, TooltipComponent],
      exports: [MatTooltip, TooltipComponent, _common_module_WayjW0Pb_mjs__WEBPACK_IMPORTED_MODULE_18__.M, _angular_cdk_overlay__WEBPACK_IMPORTED_MODULE_12__.CdkScrollableModule],
      providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER]
    }]
  }], null, null);
})();


/***/ }),

/***/ 2393:
/*!****************************************************************!*\
  !*** ./src/app/features/ai-agent/services/ai-agent.service.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AIAgentService: () => (/* binding */ AIAgentService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 4054);


class AIAgentService {
  constructor(http) {
    this.http = http;
    this.apiUrl = 'http://localhost:8000/api';
  }
  chat(request) {
    return this.http.post(`${this.apiUrl}/chat`, request);
  }
  getRecommendations(request) {
    return this.http.post(`${this.apiUrl}/recommendations`, request);
  }
  getMaintenanceAdvice(request) {
    return this.http.post(`${this.apiUrl}/maintenance/advice`, request);
  }
  analyzeMarket(request) {
    return this.http.post(`${this.apiUrl}/analysis/market`, request);
  }
  static {
    this.ɵfac = function AIAgentService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || AIAgentService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: AIAgentService,
      factory: AIAgentService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 3000:
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/XhrHttpClient.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XhrHttpClient: () => (/* binding */ XhrHttpClient)
/* harmony export */ });
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Errors */ 9490);
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HttpClient */ 1598);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils */ 1720);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




class XhrHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpClient {
  constructor(logger) {
    super();
    this._logger = logger;
  }
  /** @inheritDoc */
  send(request) {
    // Check that abort was not signaled before calling send
    if (request.abortSignal && request.abortSignal.aborted) {
      return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
    }
    if (!request.method) {
      return Promise.reject(new Error("No method defined."));
    }
    if (!request.url) {
      return Promise.reject(new Error("No url defined."));
    }
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(request.method, request.url, true);
      xhr.withCredentials = request.withCredentials === undefined ? true : request.withCredentials;
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      if (request.content === "") {
        request.content = undefined;
      }
      if (request.content) {
        // Explicitly setting the Content-Type header for React Native on Android platform.
        if ((0,_Utils__WEBPACK_IMPORTED_MODULE_2__.isArrayBuffer)(request.content)) {
          xhr.setRequestHeader("Content-Type", "application/octet-stream");
        } else {
          xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        }
      }
      const headers = request.headers;
      if (headers) {
        Object.keys(headers).forEach(header => {
          xhr.setRequestHeader(header, headers[header]);
        });
      }
      if (request.responseType) {
        xhr.responseType = request.responseType;
      }
      if (request.abortSignal) {
        request.abortSignal.onabort = () => {
          xhr.abort();
          reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.AbortError());
        };
      }
      if (request.timeout) {
        xhr.timeout = request.timeout;
      }
      xhr.onload = () => {
        if (request.abortSignal) {
          request.abortSignal.onabort = null;
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new _HttpClient__WEBPACK_IMPORTED_MODULE_0__.HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
        } else {
          reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.response || xhr.responseText || xhr.statusText, xhr.status));
        }
      };
      xhr.onerror = () => {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Error from HTTP request. ${xhr.status}: ${xhr.statusText}.`);
        reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.HttpError(xhr.statusText, xhr.status));
      };
      xhr.ontimeout = () => {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Warning, `Timeout from HTTP request.`);
        reject(new _Errors__WEBPACK_IMPORTED_MODULE_1__.TimeoutError());
      };
      xhr.send(request.content);
    });
  }
}

/***/ }),

/***/ 3044:
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/AbortController.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortController: () => (/* binding */ AbortController)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Rough polyfill of https://developer.mozilla.org/en-US/docs/Web/API/AbortController
// We don't actually ever use the API being polyfilled, we always use the polyfill because
// it's a very new API right now.
// Not exported from index.
/** @private */
class AbortController {
  constructor() {
    this._isAborted = false;
    this.onabort = null;
  }
  abort() {
    if (!this._isAborted) {
      this._isAborted = true;
      if (this.onabort) {
        this.onabort();
      }
    }
  }
  get signal() {
    return this;
  }
  get aborted() {
    return this._isAborted;
  }
}

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
    this.systemThemeSignal = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(this.getSystemTheme());
    // Signal to hold the current mode
    this.themeMode = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)(this.getStoredTheme());
    // Computed signal for the resolved theme (actual theme to apply)
    this.resolvedTheme = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {
      const mode = this.themeMode();
      if (mode === 'system') {
        return this.systemThemeSignal();
      }
      return mode;
    });
    // Initialize system theme listener
    this.initSystemThemeListener();
    // Apply theme when resolved theme changes
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.effect)(() => {
      const theme = this.resolvedTheme();
      this.applyTheme(theme === 'dark');
      localStorage.setItem(this.THEME_KEY, this.themeMode());
    });
  }
  initSystemThemeListener() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      // Update system theme signal when system preference changes
      const handleChange = e => {
        this.systemThemeSignal.set(e.matches ? 'dark' : 'light');
      };
      // Listen for changes
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers (using deprecated addListener)
        mediaQuery.addListener(e => {
          this.systemThemeSignal.set(e.matches ? 'dark' : 'light');
        });
      }
    }
  }
  setThemeMode(mode) {
    this.themeMode.set(mode);
  }
  isDark() {
    return this.resolvedTheme() === 'dark';
  }
  getThemeMode() {
    return this.themeMode();
  }
  getStoredTheme() {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(this.THEME_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    // Default to system preference
    return 'system';
  }
  getSystemTheme() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default to dark if system preference cannot be determined
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

/***/ 4085:
/*!********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HttpConnection.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpConnection: () => (/* binding */ HttpConnection),
/* harmony export */   TransportSendQueue: () => (/* binding */ TransportSendQueue)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _AccessTokenHttpClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AccessTokenHttpClient */ 249);
/* harmony import */ var _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DefaultHttpClient */ 1515);
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Errors */ 9490);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ITransport */ 893);
/* harmony import */ var _LongPollingTransport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./LongPollingTransport */ 8335);
/* harmony import */ var _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ServerSentEventsTransport */ 4312);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ 1720);
/* harmony import */ var _WebSocketTransport__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./WebSocketTransport */ 6817);

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.









const MAX_REDIRECTS = 100;
/** @private */
class HttpConnection {
  constructor(url, options = {}) {
    this._stopPromiseResolver = () => {};
    this.features = {};
    this._negotiateVersion = 1;
    _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
    this._logger = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.createLogger)(options.logger);
    this.baseUrl = this._resolveUrl(url);
    options = options || {};
    options.logMessageContent = options.logMessageContent === undefined ? false : options.logMessageContent;
    if (typeof options.withCredentials === "boolean" || options.withCredentials === undefined) {
      options.withCredentials = options.withCredentials === undefined ? true : options.withCredentials;
    } else {
      throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");
    }
    options.timeout = options.timeout === undefined ? 100 * 1000 : options.timeout;
    let webSocketModule = null;
    let eventSourceModule = null;
    if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode && "function" !== "undefined") {
      // In order to ignore the dynamic require in webpack builds we need to do this magic
      // @ts-ignore: TS doesn't know about these names
      const requireFunc =  true ? require : 0;
      webSocketModule = requireFunc("ws");
      eventSourceModule = requireFunc("eventsource");
    }
    if (!_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode && typeof WebSocket !== "undefined" && !options.WebSocket) {
      options.WebSocket = WebSocket;
    } else if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode && !options.WebSocket) {
      if (webSocketModule) {
        options.WebSocket = webSocketModule;
      }
    }
    if (!_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode && typeof EventSource !== "undefined" && !options.EventSource) {
      options.EventSource = EventSource;
    } else if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode && !options.EventSource) {
      if (typeof eventSourceModule !== "undefined") {
        options.EventSource = eventSourceModule;
      }
    }
    this._httpClient = new _AccessTokenHttpClient__WEBPACK_IMPORTED_MODULE_2__.AccessTokenHttpClient(options.httpClient || new _DefaultHttpClient__WEBPACK_IMPORTED_MODULE_3__.DefaultHttpClient(this._logger), options.accessTokenFactory);
    this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
    this._connectionStarted = false;
    this._options = options;
    this.onreceive = null;
    this.onclose = null;
  }
  start(transferFormat) {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      transferFormat = transferFormat || _ITransport__WEBPACK_IMPORTED_MODULE_4__.TransferFormat.Binary;
      _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_4__.TransferFormat, "transferFormat");
      _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Starting connection with transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_4__.TransferFormat[transferFormat]}'.`);
      if (_this._connectionState !== "Disconnected" /* ConnectionState.Disconnected */) {
        return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
      }
      _this._connectionState = "Connecting" /* ConnectionState.Connecting */;
      _this._startInternalPromise = _this._startInternal(transferFormat);
      yield _this._startInternalPromise;
      // The TypeScript compiler thinks that connectionState must be Connecting here. The TypeScript compiler is wrong.
      if (_this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
        // stop() was called and transitioned the client into the Disconnecting state.
        const message = "Failed to start the HttpConnection before stop() was called.";
        _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Error, message);
        // We cannot await stopPromise inside startInternal since stopInternal awaits the startInternalPromise.
        yield _this._stopPromise;
        return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_6__.AbortError(message));
      } else if (_this._connectionState !== "Connected" /* ConnectionState.Connected */) {
        // stop() was called and transitioned the client into the Disconnecting state.
        const message = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
        _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Error, message);
        return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_6__.AbortError(message));
      }
      _this._connectionStarted = true;
    })();
  }
  send(data) {
    if (this._connectionState !== "Connected" /* ConnectionState.Connected */) {
      return Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State."));
    }
    if (!this._sendQueue) {
      this._sendQueue = new TransportSendQueue(this.transport);
    }
    // Transport will not be null if state is connected
    return this._sendQueue.send(data);
  }
  stop(error) {
    var _this2 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
        _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnected state.`);
        return Promise.resolve();
      }
      if (_this2._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
        _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
        return _this2._stopPromise;
      }
      _this2._connectionState = "Disconnecting" /* ConnectionState.Disconnecting */;
      _this2._stopPromise = new Promise(resolve => {
        // Don't complete stop() until stopConnection() completes.
        _this2._stopPromiseResolver = resolve;
      });
      // stopInternal should never throw so just observe it.
      yield _this2._stopInternal(error);
      yield _this2._stopPromise;
    })();
  }
  _stopInternal(error) {
    var _this3 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      // Set error as soon as possible otherwise there is a race between
      // the transport closing and providing an error and the error from a close message
      // We would prefer the close message error.
      _this3._stopError = error;
      try {
        yield _this3._startInternalPromise;
      } catch (e) {
        // This exception is returned to the user as a rejected Promise from the start method.
      }
      // The transport's onclose will trigger stopConnection which will run our onclose event.
      // The transport should always be set if currently connected. If it wasn't set, it's likely because
      // stop was called during start() and start() failed.
      if (_this3.transport) {
        try {
          yield _this3.transport.stop();
        } catch (e) {
          _this3._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Error, `HttpConnection.transport.stop() threw error '${e}'.`);
          _this3._stopConnection();
        }
        _this3.transport = undefined;
      } else {
        _this3._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
      }
    })();
  }
  _startInternal(transferFormat) {
    var _this4 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      // Store the original base url and the access token factory since they may change
      // as part of negotiating
      let url = _this4.baseUrl;
      _this4._accessTokenFactory = _this4._options.accessTokenFactory;
      _this4._httpClient._accessTokenFactory = _this4._accessTokenFactory;
      try {
        if (_this4._options.skipNegotiation) {
          if (_this4._options.transport === _ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType.WebSockets) {
            // No need to add a connection ID in this case
            _this4.transport = _this4._constructTransport(_ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType.WebSockets);
            // We should just call connect directly in this case.
            // No fallback or negotiate in this case.
            yield _this4._startTransport(url, transferFormat);
          } else {
            throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
          }
        } else {
          let negotiateResponse = null;
          let redirects = 0;
          do {
            negotiateResponse = yield _this4._getNegotiationResponse(url);
            // the user tries to stop the connection when it is being started
            if (_this4._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */ || _this4._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
              throw new _Errors__WEBPACK_IMPORTED_MODULE_6__.AbortError("The connection was stopped during negotiation.");
            }
            if (negotiateResponse.error) {
              throw new Error(negotiateResponse.error);
            }
            if (negotiateResponse.ProtocolVersion) {
              throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
            }
            if (negotiateResponse.url) {
              url = negotiateResponse.url;
            }
            if (negotiateResponse.accessToken) {
              // Replace the current access token factory with one that uses
              // the returned access token
              const accessToken = negotiateResponse.accessToken;
              _this4._accessTokenFactory = () => accessToken;
              // set the factory to undefined so the AccessTokenHttpClient won't retry with the same token, since we know it won't change until a connection restart
              _this4._httpClient._accessToken = accessToken;
              _this4._httpClient._accessTokenFactory = undefined;
            }
            redirects++;
          } while (negotiateResponse.url && redirects < MAX_REDIRECTS);
          if (redirects === MAX_REDIRECTS && negotiateResponse.url) {
            throw new Error("Negotiate redirection limit exceeded.");
          }
          yield _this4._createTransport(url, _this4._options.transport, negotiateResponse, transferFormat);
        }
        if (_this4.transport instanceof _LongPollingTransport__WEBPACK_IMPORTED_MODULE_7__.LongPollingTransport) {
          _this4.features.inherentKeepAlive = true;
        }
        if (_this4._connectionState === "Connecting" /* ConnectionState.Connecting */) {
          // Ensure the connection transitions to the connected state prior to completing this.startInternalPromise.
          // start() will handle the case when stop was called and startInternal exits still in the disconnecting state.
          _this4._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, "The HttpConnection connected successfully.");
          _this4._connectionState = "Connected" /* ConnectionState.Connected */;
        }
        // stop() is waiting on us via this.startInternalPromise so keep this.transport around so it can clean up.
        // This is the only case startInternal can exit in neither the connected nor disconnected state because stopConnection()
        // will transition to the disconnected state. start() will wait for the transition using the stopPromise.
      } catch (e) {
        _this4._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Error, "Failed to start the connection: " + e);
        _this4._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
        _this4.transport = undefined;
        // if start fails, any active calls to stop assume that start will complete the stop promise
        _this4._stopPromiseResolver();
        return Promise.reject(e);
      }
    })();
  }
  _getNegotiationResponse(url) {
    var _this5 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const headers = {};
      const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
      headers[name] = value;
      const negotiateUrl = _this5._resolveNegotiateUrl(url);
      _this5._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Sending negotiation request: ${negotiateUrl}.`);
      try {
        const response = yield _this5._httpClient.post(negotiateUrl, {
          content: "",
          headers: {
            ...headers,
            ..._this5._options.headers
          },
          timeout: _this5._options.timeout,
          withCredentials: _this5._options.withCredentials
        });
        if (response.statusCode !== 200) {
          return Promise.reject(new Error(`Unexpected status code returned from negotiate '${response.statusCode}'`));
        }
        const negotiateResponse = JSON.parse(response.content);
        if (!negotiateResponse.negotiateVersion || negotiateResponse.negotiateVersion < 1) {
          // Negotiate version 0 doesn't use connectionToken
          // So we set it equal to connectionId so all our logic can use connectionToken without being aware of the negotiate version
          negotiateResponse.connectionToken = negotiateResponse.connectionId;
        }
        if (negotiateResponse.useStatefulReconnect && _this5._options._useStatefulReconnect !== true) {
          return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_6__.FailedToNegotiateWithServerError("Client didn't negotiate Stateful Reconnect but the server did."));
        }
        return negotiateResponse;
      } catch (e) {
        let errorMessage = "Failed to complete negotiation with the server: " + e;
        if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_6__.HttpError) {
          if (e.statusCode === 404) {
            errorMessage = errorMessage + " Either this is not a SignalR endpoint or there is a proxy blocking the connection.";
          }
        }
        _this5._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Error, errorMessage);
        return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_6__.FailedToNegotiateWithServerError(errorMessage));
      }
    })();
  }
  _createConnectUrl(url, connectionToken) {
    if (!connectionToken) {
      return url;
    }
    return url + (url.indexOf("?") === -1 ? "?" : "&") + `id=${connectionToken}`;
  }
  _createTransport(url, requestedTransport, negotiateResponse, requestedTransferFormat) {
    var _this6 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      let connectUrl = _this6._createConnectUrl(url, negotiateResponse.connectionToken);
      if (_this6._isITransport(requestedTransport)) {
        _this6._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, "Connection was provided an instance of ITransport, using that directly.");
        _this6.transport = requestedTransport;
        yield _this6._startTransport(connectUrl, requestedTransferFormat);
        _this6.connectionId = negotiateResponse.connectionId;
        return;
      }
      const transportExceptions = [];
      const transports = negotiateResponse.availableTransports || [];
      let negotiate = negotiateResponse;
      for (const endpoint of transports) {
        const transportOrError = _this6._resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, (negotiate === null || negotiate === void 0 ? void 0 : negotiate.useStatefulReconnect) === true);
        if (transportOrError instanceof Error) {
          // Store the error and continue, we don't want to cause a re-negotiate in these cases
          transportExceptions.push(`${endpoint.transport} failed:`);
          transportExceptions.push(transportOrError);
        } else if (_this6._isITransport(transportOrError)) {
          _this6.transport = transportOrError;
          if (!negotiate) {
            try {
              negotiate = yield _this6._getNegotiationResponse(url);
            } catch (ex) {
              return Promise.reject(ex);
            }
            connectUrl = _this6._createConnectUrl(url, negotiate.connectionToken);
          }
          try {
            yield _this6._startTransport(connectUrl, requestedTransferFormat);
            _this6.connectionId = negotiate.connectionId;
            return;
          } catch (ex) {
            _this6._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Error, `Failed to start the transport '${endpoint.transport}': ${ex}`);
            negotiate = undefined;
            transportExceptions.push(new _Errors__WEBPACK_IMPORTED_MODULE_6__.FailedToStartTransportError(`${endpoint.transport} failed: ${ex}`, _ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType[endpoint.transport]));
            if (_this6._connectionState !== "Connecting" /* ConnectionState.Connecting */) {
              const message = "Failed to select transport before stop() was called.";
              _this6._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, message);
              return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_6__.AbortError(message));
            }
          }
        }
      }
      if (transportExceptions.length > 0) {
        return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_6__.AggregateErrors(`Unable to connect to the server with any of the available transports. ${transportExceptions.join(" ")}`, transportExceptions));
      }
      return Promise.reject(new Error("None of the transports supported by the client are supported by the server."));
    })();
  }
  _constructTransport(transport) {
    switch (transport) {
      case _ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType.WebSockets:
        if (!this._options.WebSocket) {
          throw new Error("'WebSocket' is not supported in your environment.");
        }
        return new _WebSocketTransport__WEBPACK_IMPORTED_MODULE_8__.WebSocketTransport(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
      case _ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType.ServerSentEvents:
        if (!this._options.EventSource) {
          throw new Error("'EventSource' is not supported in your environment.");
        }
        return new _ServerSentEventsTransport__WEBPACK_IMPORTED_MODULE_9__.ServerSentEventsTransport(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
      case _ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType.LongPolling:
        return new _LongPollingTransport__WEBPACK_IMPORTED_MODULE_7__.LongPollingTransport(this._httpClient, this._logger, this._options);
      default:
        throw new Error(`Unknown transport: ${transport}.`);
    }
  }
  _startTransport(url, transferFormat) {
    var _this7 = this;
    this.transport.onreceive = this.onreceive;
    if (this.features.reconnect) {
      this.transport.onclose = /*#__PURE__*/function () {
        var _ref = (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (e) {
          let callStop = false;
          if (_this7.features.reconnect) {
            try {
              _this7.features.disconnected();
              yield _this7.transport.connect(url, transferFormat);
              yield _this7.features.resend();
            } catch {
              callStop = true;
            }
          } else {
            _this7._stopConnection(e);
            return;
          }
          if (callStop) {
            _this7._stopConnection(e);
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();
    } else {
      this.transport.onclose = e => this._stopConnection(e);
    }
    return this.transport.connect(url, transferFormat);
  }
  _resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, useStatefulReconnect) {
    const transport = _ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType[endpoint.transport];
    if (transport === null || transport === undefined) {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
      return new Error(`Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
    } else {
      if (transportMatches(requestedTransport, transport)) {
        const transferFormats = endpoint.transferFormats.map(s => _ITransport__WEBPACK_IMPORTED_MODULE_4__.TransferFormat[s]);
        if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
          if (transport === _ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType.WebSockets && !this._options.WebSocket || transport === _ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType.ServerSentEvents && !this._options.EventSource) {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType[transport]}' because it is not supported in your environment.'`);
            return new _Errors__WEBPACK_IMPORTED_MODULE_6__.UnsupportedTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType[transport]}' is not supported in your environment.`, transport);
          } else {
            this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Selecting transport '${_ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType[transport]}'.`);
            try {
              this.features.reconnect = transport === _ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType.WebSockets ? useStatefulReconnect : undefined;
              return this._constructTransport(transport);
            } catch (ex) {
              return ex;
            }
          }
        } else {
          this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType[transport]}' because it does not support the requested transfer format '${_ITransport__WEBPACK_IMPORTED_MODULE_4__.TransferFormat[requestedTransferFormat]}'.`);
          return new Error(`'${_ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType[transport]}' does not support ${_ITransport__WEBPACK_IMPORTED_MODULE_4__.TransferFormat[requestedTransferFormat]}.`);
        }
      } else {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Skipping transport '${_ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType[transport]}' because it was disabled by the client.`);
        return new _Errors__WEBPACK_IMPORTED_MODULE_6__.DisabledTransportError(`'${_ITransport__WEBPACK_IMPORTED_MODULE_4__.HttpTransportType[transport]}' is disabled by the client.`, transport);
      }
    }
  }
  _isITransport(transport) {
    return transport && typeof transport === "object" && "connect" in transport;
  }
  _stopConnection(error) {
    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `HttpConnection.stopConnection(${error}) called while in state ${this._connectionState}.`);
    this.transport = undefined;
    // If we have a stopError, it takes precedence over the error from the transport
    error = this._stopError || error;
    this._stopError = undefined;
    if (this._connectionState === "Disconnected" /* ConnectionState.Disconnected */) {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Debug, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is already in the disconnected state.`);
      return;
    }
    if (this._connectionState === "Connecting" /* ConnectionState.Connecting */) {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Warning, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is still in the connecting state.`);
      throw new Error(`HttpConnection.stopConnection(${error}) was called while the connection is still in the connecting state.`);
    }
    if (this._connectionState === "Disconnecting" /* ConnectionState.Disconnecting */) {
      // A call to stop() induced this call to stopConnection and needs to be completed.
      // Any stop() awaiters will be scheduled to continue after the onclose callback fires.
      this._stopPromiseResolver();
    }
    if (error) {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Error, `Connection disconnected with error '${error}'.`);
    } else {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Information, "Connection disconnected.");
    }
    if (this._sendQueue) {
      this._sendQueue.stop().catch(e => {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Error, `TransportSendQueue.stop() threw error '${e}'.`);
      });
      this._sendQueue = undefined;
    }
    this.connectionId = undefined;
    this._connectionState = "Disconnected" /* ConnectionState.Disconnected */;
    if (this._connectionStarted) {
      this._connectionStarted = false;
      try {
        if (this.onclose) {
          this.onclose(error);
        }
      } catch (e) {
        this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Error, `HttpConnection.onclose(${error}) threw error '${e}'.`);
      }
    }
  }
  _resolveUrl(url) {
    // startsWith is not supported in IE
    if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
      return url;
    }
    if (!_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser) {
      throw new Error(`Cannot resolve '${url}'.`);
    }
    // Setting the url to the href propery of an anchor tag handles normalization
    // for us. There are 3 main cases.
    // 1. Relative path normalization e.g "b" -> "http://localhost:5000/a/b"
    // 2. Absolute path normalization e.g "/a/b" -> "http://localhost:5000/a/b"
    // 3. Networkpath reference normalization e.g "//localhost:5000/a/b" -> "http://localhost:5000/a/b"
    const aTag = window.document.createElement("a");
    aTag.href = url;
    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Information, `Normalizing '${url}' to '${aTag.href}'.`);
    return aTag.href;
  }
  _resolveNegotiateUrl(url) {
    const negotiateUrl = new URL(url);
    if (negotiateUrl.pathname.endsWith('/')) {
      negotiateUrl.pathname += "negotiate";
    } else {
      negotiateUrl.pathname += "/negotiate";
    }
    const searchParams = new URLSearchParams(negotiateUrl.searchParams);
    if (!searchParams.has("negotiateVersion")) {
      searchParams.append("negotiateVersion", this._negotiateVersion.toString());
    }
    if (searchParams.has("useStatefulReconnect")) {
      if (searchParams.get("useStatefulReconnect") === "true") {
        this._options._useStatefulReconnect = true;
      }
    } else if (this._options._useStatefulReconnect === true) {
      searchParams.append("useStatefulReconnect", "true");
    }
    negotiateUrl.search = searchParams.toString();
    return negotiateUrl.toString();
  }
}
function transportMatches(requestedTransport, actualTransport) {
  return !requestedTransport || (actualTransport & requestedTransport) !== 0;
}
/** @private */
class TransportSendQueue {
  constructor(_transport) {
    this._transport = _transport;
    this._buffer = [];
    this._executing = true;
    this._sendBufferedData = new PromiseSource();
    this._transportResult = new PromiseSource();
    this._sendLoopPromise = this._sendLoop();
  }
  send(data) {
    this._bufferData(data);
    if (!this._transportResult) {
      this._transportResult = new PromiseSource();
    }
    return this._transportResult.promise;
  }
  stop() {
    this._executing = false;
    this._sendBufferedData.resolve();
    return this._sendLoopPromise;
  }
  _bufferData(data) {
    if (this._buffer.length && typeof this._buffer[0] !== typeof data) {
      throw new Error(`Expected data to be of type ${typeof this._buffer} but was of type ${typeof data}`);
    }
    this._buffer.push(data);
    this._sendBufferedData.resolve();
  }
  _sendLoop() {
    var _this8 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      while (true) {
        yield _this8._sendBufferedData.promise;
        if (!_this8._executing) {
          if (_this8._transportResult) {
            _this8._transportResult.reject("Connection stopped.");
          }
          break;
        }
        _this8._sendBufferedData = new PromiseSource();
        const transportResult = _this8._transportResult;
        _this8._transportResult = undefined;
        const data = typeof _this8._buffer[0] === "string" ? _this8._buffer.join("") : TransportSendQueue._concatBuffers(_this8._buffer);
        _this8._buffer.length = 0;
        try {
          yield _this8._transport.send(data);
          transportResult.resolve();
        } catch (error) {
          transportResult.reject(error);
        }
      }
    })();
  }
  static _concatBuffers(arrayBuffers) {
    const totalLength = arrayBuffers.map(b => b.byteLength).reduce((a, b) => a + b);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const item of arrayBuffers) {
      result.set(new Uint8Array(item), offset);
      offset += item.byteLength;
    }
    return result.buffer;
  }
}
class PromiseSource {
  constructor() {
    this.promise = new Promise((resolve, reject) => [this._resolver, this._rejecter] = [resolve, reject]);
  }
  resolve() {
    this._resolver();
  }
  reject(reason) {
    this._rejecter(reason);
  }
}

/***/ }),

/***/ 4312:
/*!*******************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/ServerSentEventsTransport.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServerSentEventsTransport: () => (/* binding */ ServerSentEventsTransport)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ITransport */ 893);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ 1720);

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.



/** @private */
class ServerSentEventsTransport {
  constructor(httpClient, accessToken, logger, options) {
    this._httpClient = httpClient;
    this._accessToken = accessToken;
    this._logger = logger;
    this._options = options;
    this.onreceive = null;
    this.onclose = null;
  }
  connect(url, transferFormat) {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
      _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(transferFormat, "transferFormat");
      _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat, "transferFormat");
      _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(SSE transport) Connecting.");
      // set url before accessTokenFactory because this._url is only for send and we set the auth header instead of the query string for send
      _this._url = url;
      if (_this._accessToken) {
        url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(_this._accessToken)}`;
      }
      return new Promise((resolve, reject) => {
        let opened = false;
        if (transferFormat !== _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Text) {
          reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
          return;
        }
        let eventSource;
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isBrowser || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isWebWorker) {
          eventSource = new _this._options.EventSource(url, {
            withCredentials: _this._options.withCredentials
          });
        } else {
          // Non-browser passes cookies via the dictionary
          const cookies = _this._httpClient.getCookieString(url);
          const headers = {};
          headers.Cookie = cookies;
          const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
          headers[name] = value;
          eventSource = new _this._options.EventSource(url, {
            withCredentials: _this._options.withCredentials,
            headers: {
              ...headers,
              ..._this._options.headers
            }
          });
        }
        try {
          eventSource.onmessage = e => {
            if (_this.onreceive) {
              try {
                _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(SSE transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getDataDetail)(e.data, _this._options.logMessageContent)}.`);
                _this.onreceive(e.data);
              } catch (error) {
                _this._close(error);
                return;
              }
            }
          };
          // @ts-ignore: not using event on purpose
          eventSource.onerror = e => {
            // EventSource doesn't give any useful information about server side closes.
            if (opened) {
              _this._close();
            } else {
              reject(new Error("EventSource failed to connect. The connection could not be found on the server," + " either the connection ID is not present on the server, or a proxy is refusing/buffering the connection." + " If you have multiple servers check that sticky sessions are enabled."));
            }
          };
          eventSource.onopen = () => {
            _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Information, `SSE connected to ${_this._url}`);
            _this._eventSource = eventSource;
            opened = true;
            resolve();
          };
        } catch (e) {
          reject(e);
          return;
        }
      });
    })();
  }
  send(data) {
    var _this2 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this2._eventSource) {
        return Promise.reject(new Error("Cannot send until the transport is connected"));
      }
      return (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.sendMessage)(_this2._logger, "SSE", _this2._httpClient, _this2._url, data, _this2._options);
    })();
  }
  stop() {
    this._close();
    return Promise.resolve();
  }
  _close(e) {
    if (this._eventSource) {
      this._eventSource.close();
      this._eventSource = undefined;
      if (this.onclose) {
        this.onclose(e);
      }
    }
  }
}

/***/ }),

/***/ 4443:
/*!**************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HubConnectionBuilder: () => (/* binding */ HubConnectionBuilder)
/* harmony export */ });
/* harmony import */ var _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultReconnectPolicy */ 9221);
/* harmony import */ var _HttpConnection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HttpConnection */ 4085);
/* harmony import */ var _HubConnection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./HubConnection */ 514);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./JsonHubProtocol */ 8184);
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Loggers */ 6944);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ 1720);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.







const LogLevelNameMapping = {
  trace: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Trace,
  debug: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Debug,
  info: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
  information: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Information,
  warn: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
  warning: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Warning,
  error: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Error,
  critical: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.Critical,
  none: _ILogger__WEBPACK_IMPORTED_MODULE_0__.LogLevel.None
};
function parseLogLevel(name) {
  // Case-insensitive matching via lower-casing
  // Yes, I know case-folding is a complicated problem in Unicode, but we only support
  // the ASCII strings defined in LogLevelNameMapping anyway, so it's fine -anurse.
  const mapping = LogLevelNameMapping[name.toLowerCase()];
  if (typeof mapping !== "undefined") {
    return mapping;
  } else {
    throw new Error(`Unknown log level: ${name}`);
  }
}
/** A builder for configuring {@link @microsoft/signalr.HubConnection} instances. */
class HubConnectionBuilder {
  configureLogging(logging) {
    _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(logging, "logging");
    if (isLogger(logging)) {
      this.logger = logging;
    } else if (typeof logging === "string") {
      const logLevel = parseLogLevel(logging);
      this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logLevel);
    } else {
      this.logger = new _Utils__WEBPACK_IMPORTED_MODULE_1__.ConsoleLogger(logging);
    }
    return this;
  }
  withUrl(url, transportTypeOrOptions) {
    _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
    _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isNotEmpty(url, "url");
    this.url = url;
    // Flow-typing knows where it's at. Since HttpTransportType is a number and IHttpConnectionOptions is guaranteed
    // to be an object, we know (as does TypeScript) this comparison is all we need to figure out which overload was called.
    if (typeof transportTypeOrOptions === "object") {
      this.httpConnectionOptions = {
        ...this.httpConnectionOptions,
        ...transportTypeOrOptions
      };
    } else {
      this.httpConnectionOptions = {
        ...this.httpConnectionOptions,
        transport: transportTypeOrOptions
      };
    }
    return this;
  }
  /** Configures the {@link @microsoft/signalr.HubConnection} to use the specified Hub Protocol.
   *
   * @param {IHubProtocol} protocol The {@link @microsoft/signalr.IHubProtocol} implementation to use.
   */
  withHubProtocol(protocol) {
    _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(protocol, "protocol");
    this.protocol = protocol;
    return this;
  }
  withAutomaticReconnect(retryDelaysOrReconnectPolicy) {
    if (this.reconnectPolicy) {
      throw new Error("A reconnectPolicy has already been set.");
    }
    if (!retryDelaysOrReconnectPolicy) {
      this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy();
    } else if (Array.isArray(retryDelaysOrReconnectPolicy)) {
      this.reconnectPolicy = new _DefaultReconnectPolicy__WEBPACK_IMPORTED_MODULE_2__.DefaultReconnectPolicy(retryDelaysOrReconnectPolicy);
    } else {
      this.reconnectPolicy = retryDelaysOrReconnectPolicy;
    }
    return this;
  }
  /** Configures {@link @microsoft/signalr.HubConnection.serverTimeoutInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
   *
   * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
   */
  withServerTimeout(milliseconds) {
    _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(milliseconds, "milliseconds");
    this._serverTimeoutInMilliseconds = milliseconds;
    return this;
  }
  /** Configures {@link @microsoft/signalr.HubConnection.keepAliveIntervalInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
   *
   * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
   */
  withKeepAliveInterval(milliseconds) {
    _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(milliseconds, "milliseconds");
    this._keepAliveIntervalInMilliseconds = milliseconds;
    return this;
  }
  /** Enables and configures options for the Stateful Reconnect feature.
   *
   * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
   */
  withStatefulReconnect(options) {
    if (this.httpConnectionOptions === undefined) {
      this.httpConnectionOptions = {};
    }
    this.httpConnectionOptions._useStatefulReconnect = true;
    this._statefulReconnectBufferSize = options === null || options === void 0 ? void 0 : options.bufferSize;
    return this;
  }
  /** Creates a {@link @microsoft/signalr.HubConnection} from the configuration options specified in this builder.
   *
   * @returns {HubConnection} The configured {@link @microsoft/signalr.HubConnection}.
   */
  build() {
    // If httpConnectionOptions has a logger, use it. Otherwise, override it with the one
    // provided to configureLogger
    const httpConnectionOptions = this.httpConnectionOptions || {};
    // If it's 'null', the user **explicitly** asked for null, don't mess with it.
    if (httpConnectionOptions.logger === undefined) {
      // If our logger is undefined or null, that's OK, the HttpConnection constructor will handle it.
      httpConnectionOptions.logger = this.logger;
    }
    // Now create the connection
    if (!this.url) {
      throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
    }
    const connection = new _HttpConnection__WEBPACK_IMPORTED_MODULE_3__.HttpConnection(this.url, httpConnectionOptions);
    return _HubConnection__WEBPACK_IMPORTED_MODULE_4__.HubConnection.create(connection, this.logger || _Loggers__WEBPACK_IMPORTED_MODULE_5__.NullLogger.instance, this.protocol || new _JsonHubProtocol__WEBPACK_IMPORTED_MODULE_6__.JsonHubProtocol(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
  }
}
function isLogger(logger) {
  return logger.log !== undefined;
}

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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/tooltip */ 2281);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/menu */ 1034);
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/badge */ 6256);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 2596);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _core_services_theme_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/services/theme.service */ 4081);
/* harmony import */ var _core_services_layout_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/services/layout.service */ 2194);
/* harmony import */ var _core_services_notification_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../core/services/notification.service */ 5567);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/auth.service */ 8010);
/* harmony import */ var _features_ai_agent_services_ai_agent_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../features/ai-agent/services/ai-agent.service */ 2393);



















const _c0 = ["aiChatContainer"];
const _c1 = () => ({
  exact: true
});
const _c2 = (a0, a1) => ({
  "fa-sun text-primary scale-110 drop-shadow-[0_0_8px_hsl(var(--color-primary)/0.4)] rotate-0 animate-sun-glow": a0,
  "fa-moon text-primary scale-100 rotate-0 animate-moon-pulse": a1
});
const _c3 = a0 => ({
  "text-primary bg-primary/10": a0
});
const _c4 = a0 => ({
  "text-primary bg-primary/20": a0
});
const _c5 = (a0, a1) => ({
  "bg-blue-50": a0,
  "bg-blue-900/10": a1
});
function HeaderComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 85)(1, "button", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_div_34_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r2);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.setAiMode("chat"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](2, "i", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3, " General Chat ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "button", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_div_34_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r2);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.setAiMode("maintenance"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](5, "i", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6, " Maintenance ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "button", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_div_34_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r2);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.setAiMode("recommendation"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](8, "i", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](9, " Car Matching ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](3, _c3, ctx_r2.aiMode === "chat"));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](5, _c3, ctx_r2.aiMode === "maintenance"));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](7, _c4, ctx_r2.aiMode === "recommendation"));
  }
}
function HeaderComponent_div_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "div", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "span", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](4, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const msg_r4 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵclassProp"]("self-end", msg_r4.isUser)("items-end", msg_r4.isUser)("self-start", !msg_r4.isUser)("items-start", !msg_r4.isUser);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵclassMap"](msg_r4.isUser ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none shadow-lg shadow-primary/20" : "bg-secondary/50 text-foreground rounded-2xl rounded-tl-none border border-border/50");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("innerHTML", ctx_r2.parseMarkdown(msg_r4.text || ""), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind2"](4, 12, msg_r4.timestamp, "shortTime"), " ");
  }
}
function HeaderComponent_div_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "span", 94)(2, "span", 94)(3, "span", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵstyleProp"]("animation-delay", "-0.16s");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵstyleProp"]("animation-delay", "-0.32s");
  }
}
function HeaderComponent_div_45_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 95)(1, "div", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_div_45_Template_div_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r5);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.toggleSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "div", 97)(3, "div", 98);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](4, "i", 99);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "input", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("keyup.escape", function HeaderComponent_div_45_Template_input_keyup_escape_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r5);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.toggleSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "button", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_div_45_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r5);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.toggleSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](7, "ESC");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
  }
}
function HeaderComponent_div_74_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "span", 111);
  }
}
function HeaderComponent_div_74_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 102)(1, "div", 28)(2, "div", 103)(3, "div", 104);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](5, HeaderComponent_div_74_span_5_Template, 1, 0, "span", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "div", 106)(7, "div", 107)(8, "span", 108);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "span", 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "p", 110);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const msg_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", msg_r6.user[0], " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", msg_r6.online);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](msg_r6.user);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](msg_r6.time);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](msg_r6.text);
  }
}
function HeaderComponent_span_81_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span", 112);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](3, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, ctx_r2.unreadCount$) > 99 ? "99+" : _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](3, 3, ctx_r2.unreadCount$), " ");
  }
}
function HeaderComponent_ng_template_85_ng_container_6_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 120);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "i", 121);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3, "No notifications yet");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
}
function HeaderComponent_ng_template_85_ng_container_6_a_2_img_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "img", 130);
  }
  if (rf & 2) {
    const note_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("src", note_r9.sourceUserAvatar, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsanitizeUrl"]);
  }
}
function HeaderComponent_ng_template_85_ng_container_6_a_2_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "i", 131);
  }
}
function HeaderComponent_ng_template_85_ng_container_6_a_2_span_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "span", 132);
  }
}
function HeaderComponent_ng_template_85_ng_container_6_a_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "a", 122);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_ng_template_85_ng_container_6_a_2_Template_a_click_0_listener() {
      const note_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r8).$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.handleNotificationClick(note_r9));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "span", 123)(2, "span", 124);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](3, HeaderComponent_ng_template_85_ng_container_6_a_2_img_3_Template, 1, 1, "img", 125)(4, HeaderComponent_ng_template_85_ng_container_6_a_2_ng_template_4_Template, 1, 0, "ng-template", null, 6, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplateRefExtractor"])(6, HeaderComponent_ng_template_85_ng_container_6_a_2_span_6_Template, 1, 0, "span", 126);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "span", 127)(8, "span", 128);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "span", 129);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](12, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const note_r9 = ctx.$implicit;
    const defaultAvatar_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](5);
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction2"](9, _c5, !note_r9.isRead && !ctx_r2.themeService.isDark(), !note_r9.isRead && ctx_r2.themeService.isDark()));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", note_r9.sourceUserAvatar)("ngIfElse", defaultAvatar_r10);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !note_r9.isRead);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", note_r9.message, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind2"](12, 6, note_r9.createdAt, "short"));
  }
}
function HeaderComponent_ng_template_85_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, HeaderComponent_ng_template_85_ng_container_6_div_1_Template, 4, 0, "div", 118)(2, HeaderComponent_ng_template_85_ng_container_6_a_2_Template, 13, 12, "a", 119);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const notifications_r11 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", notifications_r11.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", notifications_r11);
  }
}
function HeaderComponent_ng_template_85_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 113);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_ng_template_85_Template_div_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r7);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "h3", 114);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2, "Notifications");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "button", 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_ng_template_85_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r7);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.markAllRead());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4, "Mark all as read");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "div", 116);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](6, HeaderComponent_ng_template_85_ng_container_6_Template, 3, 2, "ng-container", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](7, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](7, 1, ctx_r2.notifications$));
  }
}
class HeaderComponent {
  constructor() {
    this.themeService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_core_services_theme_service__WEBPACK_IMPORTED_MODULE_0__.ThemeService);
    this.layoutService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_core_services_layout_service__WEBPACK_IMPORTED_MODULE_1__.LayoutService);
    this.notificationService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_core_services_notification_service__WEBPACK_IMPORTED_MODULE_2__.NotificationService);
    this.authService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_core_services_auth_service__WEBPACK_IMPORTED_MODULE_3__.AuthService);
    this.aiAgentService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_features_ai_agent_services_ai_agent_service__WEBPACK_IMPORTED_MODULE_4__.AIAgentService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router);
    this.isSearchOpen = false;
    this.currentLang = 'en-US';
    // AI Chat State
    this.aiMessages = [];
    this.currentChatMsg = '';
    this.isAiTyping = false;
    this.aiMode = 'chat';
    this.showAiModes = false;
    this.notifications$ = this.notificationService.notifications$;
    this.unreadCount$ = this.notificationService.unreadCount$;
    this.currentUser$ = this.authService.currentUser$;
    // Messenger Mock Data
    this.mockMessages = [{
      id: 1,
      user: 'Sarah Jenkins',
      text: 'Hey, did you see the new Off-road guide?',
      time: '2m ago',
      online: true
    }, {
      id: 2,
      user: 'Mike Ross',
      text: 'The Egypt meet is next Friday!',
      time: '1h ago',
      online: true
    }, {
      id: 3,
      user: 'Alex Cooper',
      text: 'Thanks for the maintenance advice.',
      time: '5h ago',
      online: false
    }];
  }
  ngOnInit() {
    this.aiMessages.push({
      text: "Hello! I'm your AI automotive assistant. **How can I help you today?**",
      isUser: false,
      timestamp: new Date()
    });
  }
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }
  // AI Chat Methods
  sendAiMessage() {
    if (!this.currentChatMsg.trim() || this.isAiTyping) return;
    const userMsg = this.currentChatMsg;
    this.aiMessages.push({
      text: userMsg,
      isUser: true,
      timestamp: new Date()
    });
    this.currentChatMsg = '';
    this.isAiTyping = true;
    this.scrollToAiBottom();
    this.aiAgentService.chat({
      message: this.aiMode !== 'chat' ? `[${this.aiMode.toUpperCase()} MODE] ${userMsg}` : userMsg,
      context: 'Header Chat Dropdown'
    }).subscribe({
      next: res => {
        this.isAiTyping = false;
        this.aiMessages.push({
          text: res?.message || 'No response.',
          isUser: false,
          timestamp: new Date()
        });
        this.scrollToAiBottom();
      },
      error: () => {
        this.isAiTyping = false;
        this.aiMessages.push({
          text: 'Connection trouble. Try again later.',
          isUser: false,
          timestamp: new Date()
        });
        this.scrollToAiBottom();
      }
    });
  }
  setAiMode(mode) {
    this.aiMode = mode;
    this.showAiModes = false;
  }
  parseMarkdown(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n- (.*)/g, '<br>• $1').replace(/\n/g, '<br>');
  }
  scrollToAiBottom() {
    setTimeout(() => {
      if (this.aiChatContainer) {
        this.aiChatContainer.nativeElement.scrollTop = this.aiChatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
  // Auth Methods
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
  toggleTheme() {
    const newMode = this.themeService.isDark() ? 'light' : 'dark';
    this.themeService.setThemeMode(newMode);
  }
  getThemeTooltip() {
    return `Theme: ${this.themeService.isDark() ? 'Dark' : 'Light'}`;
  }
  handleNotificationClick(note) {
    if (!note.isRead) {
      this.notificationService.markAsRead(note.id).subscribe();
    }
  }
  markAllRead() {
    this.notificationService.markAllAsRead().subscribe();
  }
  switchLanguage(lang) {
    localStorage.setItem('language', lang);
  }
  static {
    this.ɵfac = function HeaderComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || HeaderComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
      type: HeaderComponent,
      selectors: [["app-header"]],
      viewQuery: function HeaderComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵloadQuery"]()) && (ctx.aiChatContainer = _t.first);
        }
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵProvidersFeature"]([_angular_common__WEBPACK_IMPORTED_MODULE_7__.DatePipe])],
      decls: 114,
      vars: 46,
      consts: [["aiMenu", "matMenu"], ["aiChatContainer", ""], ["langMenu", "matMenu"], ["messengerMenu", "matMenu"], ["notificationMenu", "matMenu"], ["accountMenu", "matMenu"], ["defaultAvatar", ""], [1, "h-14", "relative", "before:absolute", "before:top-0", "before:left-0", "before:w-full", "before:h-[1px]", "before:bg-gradient-to-r", "before:from-transparent", "before:via-white/20", "before:to-transparent", "before:opacity-50", "flex", "items-center", "justify-between", "px-2", "sm:px-4", "md:px-6", "transition-all", "duration-400", "ease-[cubic-bezier(0.4,0,0.2,1)]", "backdrop-blur-md", "border-b", "border-white/5", "shadow-sm"], [1, "flex", "items-center", "gap-2", "sm:gap-3"], ["routerLink", "/", 1, "w-10", "h-10", "bg-primary", "rounded-full", "flex", "items-center", "justify-center", "cursor-pointer", "hover:opacity-90", "transition-opacity", "flex-shrink-0", "shadow-lg", "shadow-primary/20"], [1, "text-white", "font-black", "text-xl", "tracking-tighter", "italic"], [1, "flex", "items-center", "h-full", "hidden", "lg:flex", "gap-1", "lg:gap-4", "xl:gap-8", "flex-1", "justify-center", "max-w-2xl", "px-4"], ["routerLink", "/", "routerLinkActive", "active", "matTooltip", "Home", 1, "relative", "h-full", "flex-1", "flex", "items-center", "justify-center", "cursor-pointer", "text-muted-foreground", "transition-all", "duration-300", "hover:bg-gradient-to-br", "hover:from-secondary/80", "hover:to-secondary/60", "hover:shadow-lg", "hover:shadow-primary/10", "hover:border", "hover:border-primary/20", "rounded-xl", "my-1", "group", "active:text-primary", "[&.active]:text-primary", "[&.active]:bg-gradient-to-br", "[&.active]:from-primary/10", "[&.active]:to-primary/5", "[&.active]:shadow-lg", "[&.active]:shadow-primary/20", "[&.active]:border", "[&.active]:border-primary/30", "[&.active]:after:w-12", "after:absolute", "after:bottom-0", "after:left-1/2", "after:-translate-x-1/2", "after:w-0", "hover:after:w-12", "after:h-[3px]", "after:bg-primary", "after:rounded-t-full", "after:transition-all", "after:duration-300", "after:shadow-[0_-4px_12px_rgba(220,38,38,0.5)]", 3, "routerLinkActiveOptions"], [1, "fa-solid", "fa-house", "text-2xl", "group-active:scale-95", "group-hover:scale-110", "transition-transform"], ["routerLink", "/community", "routerLinkActive", "active", "matTooltip", "Friends", 1, "relative", "h-full", "flex-1", "flex", "items-center", "justify-center", "cursor-pointer", "text-muted-foreground", "hover:bg-gradient-to-br", "hover:from-secondary/80", "hover:to-secondary/60", "hover:shadow-lg", "hover:shadow-primary/10", "hover:border", "hover:border-primary/20", "rounded-xl", "my-1", "transition-all", "duration-300", "group", "active:text-primary", "[&.active]:text-primary", "[&.active]:bg-gradient-to-br", "[&.active]:from-primary/10", "[&.active]:to-primary/5", "[&.active]:shadow-lg", "[&.active]:shadow-primary/20", "[&.active]:border", "[&.active]:border-primary/30", "[&.active]:after:w-12", "after:absolute", "after:bottom-0", "after:left-1/2", "after:-translate-x-1/2", "after:w-0", "hover:after:w-12", "after:h-[3px]", "after:bg-primary", "after:rounded-t-full", "after:transition-all", "after:duration-300", "after:shadow-[0_-4px_12px_rgba(220,38,38,0.5)]"], [1, "fa-solid", "fa-user-group", "text-2xl", "group-active:scale-95", "group-hover:scale-110", "transition-transform"], ["routerLink", "/media", "routerLinkActive", "active", "matTooltip", "Video", 1, "relative", "h-full", "flex-1", "flex", "items-center", "justify-center", "cursor-pointer", "text-muted-foreground", "hover:bg-gradient-to-br", "hover:from-secondary/80", "hover:to-secondary/60", "hover:shadow-lg", "hover:shadow-primary/10", "hover:border", "hover:border-primary/20", "rounded-xl", "my-1", "transition-all", "duration-300", "group", "active:text-primary", "[&.active]:text-primary", "[&.active]:bg-gradient-to-br", "[&.active]:from-primary/10", "[&.active]:to-primary/5", "[&.active]:shadow-lg", "[&.active]:shadow-primary/20", "[&.active]:border", "[&.active]:border-primary/30", "[&.active]:after:w-12", "after:absolute", "after:bottom-0", "after:left-1/2", "after:-translate-x-1/2", "after:w-0", "hover:after:w-12", "after:h-[3px]", "after:bg-primary", "after:rounded-t-full", "after:transition-all", "after:duration-300", "after:shadow-[0_-4px_12px_rgba(220,38,38,0.5)]"], [1, "relative", "group-active:scale-95", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-tv", "text-2xl", "transition-transform"], [1, "absolute", "-top-1.5", "-right-2", "bg-primary", "text-[10px]", "font-black", "text-white", "px-1.5", "py-0.5", "rounded-full", "border-2", "border-background", "shadow-lg", "shadow-primary/20", "min-w-[18px]", "h-[18px]", "flex", "items-center", "justify-center", "animate-badge-pulse", "animate-badge-bounce", "z-10", "after:absolute", "after:inset-0", "after:rounded-full", "after:bg-primary", "after:opacity-40", "after:animate-ping"], ["routerLink", "/marketplace", "routerLinkActive", "active", "matTooltip", "Marketplace", 1, "relative", "h-full", "flex-1", "flex", "items-center", "justify-center", "cursor-pointer", "text-muted-foreground", "hover:bg-gradient-to-br", "hover:from-secondary/80", "hover:to-secondary/60", "hover:shadow-lg", "hover:shadow-primary/10", "hover:border", "hover:border-primary/20", "rounded-xl", "my-1", "transition-all", "duration-300", "group", "active:text-primary", "[&.active]:text-primary", "[&.active]:bg-gradient-to-br", "[&.active]:from-primary/10", "[&.active]:to-primary/5", "[&.active]:shadow-lg", "[&.active]:shadow-primary/20", "[&.active]:border", "[&.active]:border-primary/30", "[&.active]:after:w-12", "after:absolute", "after:bottom-0", "after:left-1/2", "after:-translate-x-1/2", "after:w-0", "hover:after:w-12", "after:h-[3px]", "after:bg-primary", "after:rounded-t-full", "after:transition-all", "after:duration-300", "after:shadow-[0_-4px_12px_rgba(220,38,38,0.5)]"], [1, "fa-solid", "fa-store", "text-2xl", "group-active:scale-95", "group-hover:scale-110", "transition-transform"], [1, "flex", "items-center", "gap-1", "sm:gap-2", "flex-shrink-0"], ["matTooltip", "AI Assistant", 1, "w-9", "h-9", "rounded-xl", "bg-secondary/50", "flex", "items-center", "justify-center", "text-foreground/70", "hover:bg-gradient-to-br", "hover:from-primary/20", "hover:to-primary/10", "hover:text-primary", "hover:shadow-lg", "hover:shadow-primary/20", "hover:border", "hover:border-primary/30", "transition-all", "duration-300", "cursor-pointer", "active:scale-90", "touch-manipulation", "group", 3, "matMenuTriggerFor"], [1, "fa-solid", "fa-robot", "text-lg", "group-hover:scale-110", "transition-transform"], [1, "custom-mat-menu", "!max-w-none"], [1, "w-[320px]", "sm:w-[380px]", "h-[500px]", "flex", "flex-col", "overflow-hidden", "bg-background/80", "backdrop-blur-3xl", 3, "click"], [1, "p-4", "flex", "items-center", "justify-between", "border-b", "border-border/50", "bg-white/5", "relative"], [1, "flex", "items-center", "gap-3"], [1, "w-8", "h-8", "bg-primary/10", "border", "border-primary/20", "rounded-xl", "flex", "items-center", "justify-center", "text-primary", "cursor-pointer", "hover:bg-primary/20", "transition-colors", 3, "click"], [1, "fas", "fa-robot", "text-xs"], [1, "cursor-pointer", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "font-bold", "text-sm", "text-foreground", "tracking-tight"], [1, "fas", "fa-chevron-down", "text-[8px]", "text-muted-foreground", "transition-transform", "duration-300"], [1, "text-[9px]", "text-emerald-500", "font-bold", "uppercase", "tracking-[0.2em]", "block", "leading-none", "mt-0.5"], ["class", "absolute top-full left-4 right-4 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-2 z-20 shadow-2xl mt-2 animate-fade-in", 4, "ngIf"], [1, "flex-1", "overflow-y-auto", "p-4", "flex", "flex-col", "gap-4", "custom-scroll", "scroll-smooth"], ["class", "flex flex-col max-w-[85%] relative animate-slide-up", 3, "self-end", "items-end", "self-start", "items-start", 4, "ngFor", "ngForOf"], ["class", "flex gap-1.5 p-3 bg-secondary/30 rounded-2xl w-fit animate-fade-in", 4, "ngIf"], [1, "p-3", "bg-black/5", "border-t", "border-border/50", "flex", "gap-2"], ["type", "text", "placeholder", "Ask AI assistant...", 1, "flex-1", "bg-secondary/50", "border", "border-transparent", "rounded-xl", "px-3", "py-2", "text-xs", "text-foreground", "focus:outline-none", "focus:border-primary/50", "focus:bg-background", "transition-all", "placeholder:text-muted-foreground/40", "shadow-inner", 3, "ngModelChange", "keyup.enter", "ngModel", "disabled"], [1, "bg-primary", "text-white", "rounded-xl", "w-10", "h-8", "flex", "items-center", "justify-center", "transition-all", "hover:-translate-y-0.5", "hover:shadow-lg", "hover:shadow-primary/40", "disabled:opacity-30", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fas", "fa-paper-plane", "text-xs"], ["matTooltip", "Search", 1, "w-9", "h-9", "rounded-xl", "bg-secondary/50", "flex", "items-center", "justify-center", "text-foreground/70", "hover:bg-gradient-to-br", "hover:from-primary/20", "hover:to-primary/10", "hover:text-primary", "hover:shadow-lg", "hover:shadow-primary/20", "hover:border", "hover:border-primary/30", "transition-all", "duration-300", "cursor-pointer", "active:scale-90", "touch-manipulation", "group", 3, "click"], [1, "fa-solid", "fa-search", "text-lg", "group-hover:scale-110", "transition-transform"], ["class", "fixed inset-0 z-[100] flex items-start justify-center pt-2 sm:pt-4 px-2 sm:px-4 animate-fade-in", 4, "ngIf"], ["matTooltip", "Language", 1, "w-9", "h-9", "rounded-xl", "bg-secondary/50", "flex", "items-center", "justify-center", "text-foreground/70", "hover:bg-gradient-to-br", "hover:from-primary/20", "hover:to-primary/10", "hover:text-primary", "hover:shadow-lg", "hover:shadow-primary/20", "hover:border", "hover:border-primary/30", "transition-all", "duration-300", "cursor-pointer", "active:scale-90", "touch-manipulation", "group", 3, "matMenuTriggerFor"], [1, "fa-solid", "fa-globe", "text-xl", "group-hover:scale-110", "transition-transform"], [1, "custom-mat-menu"], ["mat-menu-item", "", 3, "click"], [1, "mr-2"], [1, "w-9", "h-9", "rounded-xl", "bg-secondary/50", "flex", "items-center", "justify-center", "text-foreground/70", "hover:bg-gradient-to-br", "hover:from-primary/20", "hover:to-primary/10", "hover:text-primary", "hover:shadow-lg", "hover:shadow-primary/20", "hover:border", "hover:border-primary/30", "transition-all", "duration-300", "cursor-pointer", "active:scale-90", "touch-manipulation", "group", 3, "click", "matTooltip"], [1, "fa-solid", "text-xl", "transition-all", "duration-500", "ease-[cubic-bezier(0.34,1.56,0.64,1)]", "group-hover:scale-110", 3, "ngClass"], ["matTooltip", "Menu", 1, "w-9", "h-9", "rounded-xl", "bg-secondary/50", "flex", "items-center", "justify-center", "text-foreground/70", "hover:bg-gradient-to-br", "hover:from-primary/20", "hover:to-primary/10", "hover:text-primary", "hover:shadow-lg", "hover:shadow-primary/20", "hover:border", "hover:border-primary/30", "transition-all", "duration-300", "cursor-pointer", "active:scale-90", "touch-manipulation", "lg:hidden", "group", 3, "click"], [1, "fa-solid", "fa-bars", "text-xl", "group-hover:scale-110", "transition-transform"], ["matTooltip", "Messenger", 1, "w-9", "h-9", "rounded-xl", "bg-secondary/50", "flex", "items-center", "justify-center", "text-foreground/70", "hover:bg-gradient-to-br", "hover:from-primary/20", "hover:to-primary/10", "hover:text-primary", "hover:shadow-lg", "hover:shadow-primary/20", "hover:border", "hover:border-primary/30", "transition-all", "duration-300", "cursor-pointer", "active:scale-90", "relative", "touch-manipulation", "group", 3, "matMenuTriggerFor"], [1, "fa-brands", "fa-facebook-messenger", "text-xl", "group-hover:scale-110", "transition-transform"], [1, "absolute", "-top-1", "-right-1", "bg-primary", "text-[10px]", "font-black", "text-white", "px-1.5", "py-0.5", "rounded-full", "border-2", "border-background", "shadow-lg", "shadow-primary/20", "min-w-[18px]", "h-[18px]", "flex", "items-center", "justify-center", "animate-badge-pulse", "animate-badge-bounce", "z-10", "after:absolute", "after:inset-0", "after:rounded-full", "after:bg-primary", "after:opacity-40", "after:animate-ping", "scale-75", "origin-top-right"], [1, "notification-menu", "w-80", "sm:w-96"], [1, "px-4", "py-3", "border-b", "border-border/50", "flex", "items-center", "justify-between", 3, "click"], [1, "font-bold", "text-lg", "text-foreground"], [1, "text-xs", "text-primary", "hover:underline", "font-bold"], [1, "py-2"], ["mat-menu-item", "", "class", "!h-auto !py-3 !px-4 hover:bg-secondary/30 transition-colors border-b border-border/10 last:border-0", 4, "ngFor", "ngForOf"], ["routerLink", "/messages", 1, "p-3", "border-t", "border-border/50", "bg-secondary/10"], [1, "w-full", "text-center", "text-xs", "font-bold", "text-primary", "hover:underline"], ["matTooltip", "Notifications", 1, "w-9", "h-9", "rounded-xl", "bg-secondary/50", "flex", "items-center", "justify-center", "text-foreground/70", "hover:bg-gradient-to-br", "hover:from-primary/20", "hover:to-primary/10", "hover:text-primary", "hover:shadow-lg", "hover:shadow-primary/20", "hover:border", "hover:border-primary/30", "transition-all", "duration-300", "cursor-pointer", "active:scale-90", "relative", "touch-manipulation", "group", 3, "matMenuTriggerFor"], [1, "fa-solid", "fa-bell", "text-xl", "group-hover:rotate-12", "group-hover:scale-110", "transition-transform"], ["class", "absolute -top-1 -right-1 bg-primary text-[10px] font-black text-white px-1.5 py-0.5 rounded-full border-2 border-background shadow-lg shadow-primary/20 min-w-[18px] h-[18px] flex items-center justify-center animate-badge-pulse animate-badge-bounce z-10 after:absolute after:inset-0 after:rounded-full after:bg-primary after:opacity-40 after:animate-ping", 4, "ngIf"], ["matMenuContent", ""], ["matTooltip", "Account", 1, "w-10", "h-10", "rounded-xl", "bg-secondary/80", "backdrop-blur-3xl", "bg-background/60", "border", "border-white/5", "shadow-sm", "relative", "overflow-hidden", "flex", "items-center", "justify-center", "cursor-pointer", "hover:bg-gradient-to-br", "hover:from-primary/20", "hover:to-primary/10", "hover:border-primary/30", "hover:shadow-lg", "hover:shadow-primary/20", "transition-all", "active:scale-90", "ml-1", "group", 3, "matMenuTriggerFor"], [1, "absolute", "inset-0", "bg-gradient-to-br", "from-white/5", "to-transparent", "pointer-events-none"], [1, "w-full", "h-full", "flex", "items-center", "justify-center", "text-primary", "font-black", "italic", "text-sm", "group-hover:scale-110", "transition-transform"], [1, "custom-mat-menu", "w-56"], [1, "px-4", "py-3", "border-b", "border-border/50", "bg-secondary/5", 3, "click"], [1, "text-xs", "text-muted-foreground", "font-bold", "uppercase", "tracking-widest", "mb-1"], [1, "text-sm", "font-bold", "text-foreground", "truncate"], ["mat-menu-item", "", "routerLink", "/community/profile"], [1, "fa-solid", "fa-user-circle", "mr-3", "text-primary/70"], ["mat-menu-item", "", "routerLink", "/settings"], [1, "fa-solid", "fa-cog", "mr-3", "text-primary/70"], [1, "border-t", "border-border/50", "my-1"], ["mat-menu-item", "", 1, "!text-destructive", 3, "click"], [1, "fa-solid", "fa-sign-out-alt", "mr-3"], [1, "absolute", "top-full", "left-4", "right-4", "bg-card/95", "backdrop-blur-xl", "border", "border-border/50", "rounded-2xl", "p-2", "z-20", "shadow-2xl", "mt-2", "animate-fade-in"], [1, "w-full", "flex", "items-center", "gap-3", "p-2", "rounded-xl", "transition-all", "hover:bg-white/5", "text-xs", 3, "click", "ngClass"], [1, "fas", "fa-comments", "w-4"], [1, "fas", "fa-wrench", "w-4"], [1, "fas", "fa-search", "w-4"], [1, "flex", "flex-col", "max-w-[85%]", "relative", "animate-slide-up"], [1, "p-3", "text-xs", "leading-relaxed", 3, "innerHTML"], [1, "text-[8px]", "text-muted-foreground/60", "mt-1", "px-1", "font-bold", "uppercase", "tracking-wider"], [1, "flex", "gap-1.5", "p-3", "bg-secondary/30", "rounded-2xl", "w-fit", "animate-fade-in"], [1, "w-1.5", "h-1.5", "bg-primary/40", "rounded-full", "animate-typing"], [1, "fixed", "inset-0", "z-[100]", "flex", "items-start", "justify-center", "pt-2", "sm:pt-4", "px-2", "sm:px-4", "animate-fade-in"], [1, "absolute", "inset-0", "bg-background/80", "backdrop-blur-md", 3, "click"], [1, "relative", "w-full", "max-w-2xl", "bg-card", "border", "border-border/40", "shadow-2xl", "rounded-2xl", "overflow-hidden", "mt-2"], [1, "flex", "items-center", "p-4", "gap-4"], [1, "fa-solid", "fa-search", "text-primary", "text-xl"], ["type", "text", "placeholder", "Search Community Car...", "autoFocus", "", 1, "w-full", "bg-transparent", "border-none", "outline-none", "text-lg", "text-foreground", "placeholder:text-muted-foreground/50", 3, "keyup.escape"], [1, "px-3", "py-1", "bg-secondary", "rounded-lg", "text-xs", "font-bold", "hover:bg-secondary/80", "transition-colors", 3, "click"], ["mat-menu-item", "", 1, "!h-auto", "!py-3", "!px-4", "hover:bg-secondary/30", "transition-colors", "border-b", "border-border/10", "last:border-0"], [1, "relative", "w-12", "h-12", "flex-shrink-0"], [1, "w-full", "h-full", "rounded-full", "bg-gradient-to-tr", "from-primary", "to-purple-600", "flex", "items-center", "justify-center", "text-white", "font-bold", "text-sm", "ring-2", "ring-primary/10"], ["class", "absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card", 4, "ngIf"], [1, "flex-1", "min-w-0"], [1, "flex", "justify-between", "items-center", "mb-1"], [1, "font-bold", "text-sm", "text-foreground", "truncate"], [1, "text-[10px]", "text-muted-foreground"], [1, "text-[12px]", "text-muted-foreground", "truncate", "leading-snug"], [1, "absolute", "bottom-0", "right-0", "w-3", "h-3", "bg-emerald-500", "rounded-full", "border-2", "border-card"], [1, "absolute", "-top-1", "-right-1", "bg-primary", "text-[10px]", "font-black", "text-white", "px-1.5", "py-0.5", "rounded-full", "border-2", "border-background", "shadow-lg", "shadow-primary/20", "min-w-[18px]", "h-[18px]", "flex", "items-center", "justify-center", "animate-badge-pulse", "animate-badge-bounce", "z-10", "after:absolute", "after:inset-0", "after:rounded-full", "after:bg-primary", "after:opacity-40", "after:animate-ping"], [1, "px-4", "py-3", "border-b", "flex", "items-center", "justify-between", 3, "click"], [1, "font-bold", "text-lg"], [1, "text-xs", "text-primary", "hover:underline", 3, "click"], [1, "max-h-[70vh]", "overflow-y-auto"], [4, "ngIf"], ["class", "p-8 text-center text-muted-foreground", 4, "ngIf"], ["mat-menu-item", "", "class", "!h-auto !py-3 !px-4 border-b last:border-0 hover:bg-secondary/50 transition-colors no-underline block", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], [1, "p-8", "text-center", "text-muted-foreground"], [1, "fa-regular", "fa-bell-slash", "text-4xl", "mb-2", "opacity-50"], ["mat-menu-item", "", 1, "!h-auto", "!py-3", "!px-4", "border-b", "last:border-0", "hover:bg-secondary/50", "transition-colors", "no-underline", "block", 3, "click", "ngClass"], [1, "flex", "items-start", "gap-3", "w-full", "text-left"], [1, "w-10", "h-10", "rounded-full", "bg-secondary", "flex-shrink-0", "overflow-hidden", "relative", "block"], ["class", "w-full h-full object-cover", 3, "src", 4, "ngIf", "ngIfElse"], ["class", "absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-card", 4, "ngIf"], [1, "flex-1", "min-w-0", "flex", "flex-col", "items-start"], [1, "text-sm", "font-medium", "leading-tight", "mb-1", "line-clamp-2", "truncate-2-lines", "whitespace-normal", "text-left", "block"], [1, "text-xs", "text-muted-foreground"], [1, "w-full", "h-full", "object-cover", 3, "src"], [1, "fa-solid", "fa-user", "absolute", "top-1/2", "left-1/2", "-translate-x-1/2", "-translate-y-1/2", "text-gray-500"], [1, "absolute", "top-0", "right-0", "w-3", "h-3", "bg-blue-500", "rounded-full", "border-2", "border-card"]],
      template: function HeaderComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 7)(1, "div", 8)(2, "div", 9)(3, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4, "CC");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "nav", 11)(6, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](7, "i", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "div", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](9, "i", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "div", 16)(11, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](12, "i", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](13, "span", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](14, "9+");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](15, "div", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](16, "i", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](17, "div", 22)(18, "button", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](19, "i", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](20, "mat-menu", 25, 0)(22, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_22_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"]($event.stopPropagation());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](23, "div", 27)(24, "div", 28)(25, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_25_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.showAiModes = !ctx.showAiModes);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](26, "i", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](27, "div", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_27_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.showAiModes = !ctx.showAiModes);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](28, "div", 32)(29, "span", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](30, "AI Assistant");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](31, "i", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](32, "span", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](33);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](34, HeaderComponent_div_34_Template, 10, 9, "div", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](35, "div", 37, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](37, HeaderComponent_div_37_Template, 5, 15, "div", 38)(38, HeaderComponent_div_38_Template, 4, 4, "div", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](39, "div", 40)(40, "input", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtwoWayListener"]("ngModelChange", function HeaderComponent_Template_input_ngModelChange_40_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtwoWayBindingSet"](ctx.currentChatMsg, $event) || (ctx.currentChatMsg = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("keyup.enter", function HeaderComponent_Template_input_keyup_enter_40_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.sendAiMessage());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](41, "button", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_41_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.sendAiMessage());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](42, "i", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](43, "button", 44);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_43_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.toggleSearch());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](44, "i", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](45, HeaderComponent_div_45_Template, 8, 0, "div", 46);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](46, "button", 47);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](47, "i", 48);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](48, "mat-menu", 49, 2)(50, "button", 50);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_50_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.switchLanguage("en-US"));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](51, "span", 51);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](52, "\uD83C\uDDFA\uD83C\uDDF8");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](53, " English ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](54, "button", 50);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_54_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.switchLanguage("ar-EG"));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](55, "span", 51);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](56, "\uD83C\uDDEA\uD83C\uDDEC");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](57, " \u0627\u0644\u0639\u0631\u0628\u064A\u0629 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](58, "button", 52);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_58_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.toggleTheme());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](59, "i", 53);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](60, "button", 54);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_60_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.layoutService.toggleMobileMenu());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](61, "i", 55);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](62, "button", 56);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](63, "i", 57);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](64, "span", 58);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](65, "3");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](66, "mat-menu", 59, 3)(68, "div", 60);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_68_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"]($event.stopPropagation());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](69, "h3", 61);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](70, "Messages");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](71, "button", 62);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](72, "New Message");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](73, "div", 63);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](74, HeaderComponent_div_74_Template, 14, 5, "div", 64);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](75, "div", 65)(76, "button", 66);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](77, "See all in Messenger");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](78, "button", 67);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](79, "i", 68);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](80, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](81, HeaderComponent_span_81_Template, 4, 5, "span", 69);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](82, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](83, "mat-menu", 59, 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](85, HeaderComponent_ng_template_85_Template, 8, 3, "ng-template", 70);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](86, "button", 71);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](87, "div", 72);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](88, "div", 73);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](89);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](90, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](91, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](92, "mat-menu", 74, 5)(94, "div", 75);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_94_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"]($event.stopPropagation());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](95, "p", 76);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](96, "Signed in as");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](97, "p", 77);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](98);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](99, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](100, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](101, "button", 78);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](102, "i", 79);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](103, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](104, "My Profile");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](105, "button", 80);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](106, "i", 81);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](107, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](108, "Settings");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](109, "div", 82);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](110, "button", 83);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_110_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.logout());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](111, "i", 84);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](112, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](113, "Sign Out");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          let tmp_28_0;
          let tmp_29_0;
          const aiMenu_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](21);
          const langMenu_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](49);
          const messengerMenu_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](67);
          const notificationMenu_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](84);
          const accountMenu_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](93);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("routerLinkActiveOptions", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction0"](42, _c1));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matMenuTriggerFor", aiMenu_r12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](13);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵclassProp"]("rotate-180", ctx.showAiModes);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", ctx.aiMode, " Mode");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.showAiModes);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx.aiMessages);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.isAiTyping);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtwoWayProperty"]("ngModel", ctx.currentChatMsg);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx.isAiTyping);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", !ctx.currentChatMsg.trim() || ctx.isAiTyping);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.isSearchOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matMenuTriggerFor", langMenu_r13);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵclassProp"]("bg-secondary", ctx.currentLang === "en-US");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵclassProp"]("bg-secondary", ctx.currentLang === "ar-EG");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matTooltip", ctx.getThemeTooltip());
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction2"](43, _c2, !ctx.themeService.isDark(), ctx.themeService.isDark()));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matMenuTriggerFor", messengerMenu_r14);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx.mockMessages);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matMenuTriggerFor", notificationMenu_r15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵclassProp"]("text-primary", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](80, 30, ctx.unreadCount$) > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](82, 32, ctx.unreadCount$) > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matMenuTriggerFor", accountMenu_r16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate2"](" ", ((tmp_28_0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](90, 34, ctx.currentUser$)) == null ? null : tmp_28_0.firstName == null ? null : tmp_28_0.firstName[0]) || "U", "", ((tmp_28_0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](91, 36, ctx.currentUser$)) == null ? null : tmp_28_0.lastName == null ? null : tmp_28_0.lastName[0]) || "P", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate2"]("", (tmp_29_0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](99, 38, ctx.currentUser$)) == null ? null : tmp_29_0.firstName, " ", (tmp_29_0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](100, 40, ctx.currentUser$)) == null ? null : tmp_29_0.lastName, "");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.AsyncPipe, _angular_common__WEBPACK_IMPORTED_MODULE_7__.DatePipe, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__.h, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_8__.e, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_10__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_10__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_10__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_10__.MatMenuContent, _angular_material_menu__WEBPACK_IMPORTED_MODULE_10__.MatMenuTrigger, _angular_material_badge__WEBPACK_IMPORTED_MODULE_11__.MatBadgeModule, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterLinkActive, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgModel],
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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _features_community_components_friend_requests_friend_requests_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../features/community/components/friend-requests/friend-requests.component */ 1081);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _features_community_services_friend_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../features/community/services/friend.service */ 1398);






function SidebarRightComponent_div_11_img_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "img", 30);
  }
  if (rf & 2) {
    const friend_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("src", friend_r1.profileImageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
  }
}
function SidebarRightComponent_div_11_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const friend_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate2"](" ", friend_r1.firstName[0], "", friend_r1.lastName[0], " ");
  }
}
function SidebarRightComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 22)(2, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 24)(4, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, SidebarRightComponent_div_11_img_5_Template, 1, 1, "img", 26)(6, SidebarRightComponent_div_11_div_6_Template, 2, 2, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const friend_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", friend_r1.profileImageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !friend_r1.profileImageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate2"](" ", friend_r1.firstName, " ", friend_r1.lastName, " ");
  }
}
function SidebarRightComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " No friends found ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
class SidebarRightComponent {
  constructor(friendService) {
    this.friendService = friendService;
    this.friends = [];
  }
  ngOnInit() {
    this.friendService.getFriends(1, 10).subscribe(result => {
      this.friends = result.items;
    });
  }
  static {
    this.ɵfac = function SidebarRightComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SidebarRightComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_features_community_services_friend_service__WEBPACK_IMPORTED_MODULE_1__.FriendService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: SidebarRightComponent,
      selectors: [["app-sidebar-right"]],
      decls: 27,
      vars: 2,
      consts: [[1, "flex", "flex-col", "h-full", "p-2", "space-y-4", "animate-fade-in"], [1, "flex-1", "overflow-y-auto", "custom-scroll", "space-y-4", "pr-1"], [1, "space-y-0.5"], [1, "flex", "items-center", "justify-between", "text-muted-foreground/60", "font-black", "px-4", "mb-2", "tracking-[0.15em]", "text-[10px]", "uppercase"], [1, "flex", "gap-4", "text-sm", "opacity-60"], [1, "fa-solid", "fa-video", "hover:text-primary", "cursor-pointer", "transition-all"], [1, "fa-solid", "fa-search", "hover:text-primary", "cursor-pointer", "transition-all"], [1, "fa-solid", "fa-ellipsis", "hover:text-primary", "cursor-pointer", "transition-all"], ["class", "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/5 text-foreground/80 font-semibold text-sm hover:text-primary relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 group relative", 4, "ngFor", "ngForOf"], ["class", "px-4 py-2 text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest text-center", 4, "ngIf"], [1, "mt-auto", "pt-2"], [1, "mx-2", "p-4", "backdrop-blur-3xl", "bg-background/60", "border-b", "border-white/10", "shadow-sm", "transition-all", "duration-500", "relative", "overflow-hidden", "rounded-2xl", "border", "border-primary/20", "flex", "flex-col", "gap-3", "group/nitro"], [1, "absolute", "inset-0", "bg-gradient-to-br", "from-white/5", "to-transparent", "pointer-events-none"], [1, "absolute", "-inset-x-full", "top-0", "h-full", "w-full", "bg-gradient-to-r", "from-transparent", "via-white/10", "to-transparent", "skew-x-12", "group-hover/nitro:animate-[shine_1.5s_ease-in-out_infinite]"], [1, "flex", "items-center", "gap-3", "relative", "z-10"], [1, "w-10", "h-10", "rounded-xl", "bg-primary", "flex", "items-center", "justify-center", "text-white", "shadow-lg", "shadow-primary/20", "animate-pulse"], [1, "fa-solid", "fa-bolt-lightning", "text-lg"], [1, "flex", "flex-col"], [1, "text-[10px]", "font-black", "uppercase", "tracking-wider", "text-primary"], [1, "text-[9px]", "text-muted-foreground", "font-bold"], [1, "w-full", "py-2", "bg-gradient-to-r", "from-primary", "to-purple-600", "text-white", "text-[10px]", "font-black", "uppercase", "tracking-widest", "rounded-xl", "shadow-xl", "hover:shadow-primary/40", "hover:scale-[1.02]", "transition-all", "active:scale-95", "relative", "z-10"], [1, "flex", "items-center", "gap-3", "px-3", "py-2.5", "rounded-xl", "cursor-pointer", "transition-all", "duration-300", "hover:bg-white/5", "text-foreground/80", "font-semibold", "text-sm", "hover:text-primary", "relative", "overflow-hidden", "group", "hover:shadow-lg", "hover:shadow-black/5", "hover:-translate-y-0.5", "group", "relative"], [1, "absolute", "inset-0", "bg-gradient-to-r", "from-white/5", "to-transparent", "opacity-0", "group-hover:opacity-100", "transition-opacity", "duration-300", "pointer-events-none"], [1, "absolute", "left-0", "top-1/2", "-translate-y-1/2", "w-1", "h-0", "bg-primary", "rounded-full", "transition-all", "duration-300", "group-hover:h-6"], [1, "relative", "z-10"], [1, "w-9", "h-9", "rounded-xl", "bg-gradient-to-br", "from-secondary", "to-background", "border", "border-border/50", "flex", "items-center", "justify-center", "overflow-hidden", "group-hover:border-primary/30", "transition-all", "duration-300", "shadow-sm"], ["class", "w-full h-full object-cover", 3, "src", 4, "ngIf"], ["class", "w-full h-full flex items-center justify-center text-[10px] font-black text-muted-foreground group-hover:text-primary transition-all", 4, "ngIf"], [1, "absolute", "-bottom-0.5", "-right-0.5", "w-3", "h-3", "bg-emerald-500", "border-2", "border-background", "rounded-full", "shadow-lg", "ring-1", "ring-emerald-500/20"], [1, "font-bold", "text-foreground/80", "group-hover:text-primary", "transition-colors", "truncate", "relative", "z-10"], [1, "w-full", "h-full", "object-cover", 3, "src"], [1, "w-full", "h-full", "flex", "items-center", "justify-center", "text-[10px]", "font-black", "text-muted-foreground", "group-hover:text-primary", "transition-all"], [1, "px-4", "py-2", "text-[10px]", "text-muted-foreground/40", "font-bold", "uppercase", "tracking-widest", "text-center"]],
      template: function SidebarRightComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "app-friend-requests");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 2)(4, "div", 3)(5, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Contacts");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](8, "i", 5)(9, "i", 6)(10, "i", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](11, SidebarRightComponent_div_11_Template, 10, 4, "div", 8)(12, SidebarRightComponent_div_12_Template, 2, 0, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](13, "div", 10)(14, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](15, "div", 12)(16, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "div", 14)(18, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](19, "i", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "div", 17)(21, "span", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, "Nitro Performance");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "span", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](24, "Turbocharge your experience");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "button", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](26, " Activate Nitro ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.friends);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.friends.length === 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule, _features_community_components_friend_requests_friend_requests_component__WEBPACK_IMPORTED_MODULE_0__.FriendRequestsComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 5262:
/*!*****************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HeaderNames.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderNames: () => (/* binding */ HeaderNames)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
class HeaderNames {}
HeaderNames.Authorization = "Authorization";
HeaderNames.Cookie = "Cookie";

/***/ }),

/***/ 5567:
/*!*******************************************************!*\
  !*** ./src/app/core/services/notification.service.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationService: () => (/* binding */ NotificationService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 4054);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 5797);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 8764);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 1318);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 9452);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 3942);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 5312);
/* harmony import */ var _signalr_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./signalr.service */ 8302);






class NotificationService {
  constructor() {
    this.http = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient);
    this.signalRService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_signalr_service__WEBPACK_IMPORTED_MODULE_1__.SignalRService);
    this.baseUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v4/shared/notifications`;
    this.notificationsSubject = new rxjs__WEBPACK_IMPORTED_MODULE_4__.BehaviorSubject([]);
    this.notifications$ = this.notificationsSubject.asObservable();
    this.unreadCountSubject = new rxjs__WEBPACK_IMPORTED_MODULE_4__.BehaviorSubject(0);
    this.unreadCount$ = this.unreadCountSubject.asObservable();
    this.refreshNotifications();
    this.setupSignalRListeners();
  }
  setupSignalRListeners() {
    // Listen for real-time notifications
    this.signalRService.notificationReceived$.subscribe(notification => {
      if (notification) {
        this.handleNewNotification(notification);
      }
    });
  }
  handleNewNotification(notificationData) {
    const notification = {
      id: notificationData.id,
      title: notificationData.title,
      message: notificationData.message,
      targetUrl: notificationData.targetUrl,
      isRead: false,
      // New notifications are unread
      createdAt: new Date(notificationData.createdAt || new Date()),
      sourceUserId: notificationData.sourceUserId
    };
    // Add to the beginning of the list
    const current = this.notificationsSubject.value;
    const updated = [notification, ...current];
    this.notificationsSubject.next(updated);
    this.updateUnreadCount(updated);
    // Show browser notification if supported
    this.showBrowserNotification(notification);
  }
  showBrowserNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icons/notification-icon.png',
        tag: notification.id
      });
    }
  }
  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
  refreshNotifications() {
    this.http.get(`${this.baseUrl}?pageNumber=1&pageSize=50`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.tap)(response => {
      if (response.succeeded && response.data) {
        this.processNotifications(response.data.items);
      }
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.catchError)(err => {
      console.error('Failed to fetch notifications', err);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)({
        succeeded: false,
        data: null,
        errors: []
      });
    })).subscribe();
  }
  processNotifications(data) {
    const notifications = data.map(item => ({
      id: item.id,
      title: item.title,
      message: item.message,
      targetUrl: item.targetUrl,
      isRead: item.isRead,
      createdAt: new Date(item.createdAt),
      sourceUserId: item.sourceUserId
    }));
    // Sort by date desc
    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount(notifications);
  }
  updateUnreadCount(notifications) {
    const count = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(count);
  }
  markAsRead(id) {
    // Optimistic update
    const current = this.notificationsSubject.value;
    const updated = current.map(n => n.id === id ? {
      ...n,
      isRead: true
    } : n);
    this.notificationsSubject.next(updated);
    this.updateUnreadCount(updated);
    return this.http.patch(`${this.baseUrl}/${id}/read`, {}).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.catchError)(err => {
      console.error('Failed to mark read', err);
      // Revert on failure
      this.notificationsSubject.next(current);
      this.updateUnreadCount(current);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)({
        succeeded: false,
        data: undefined,
        errors: ['Failed to mark notification as read']
      });
    }));
  }
  markAllAsRead() {
    const current = this.notificationsSubject.value;
    const unreadIds = current.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)({
        succeeded: true,
        data: undefined,
        errors: []
      });
    }
    // Optimistic update
    const updated = current.map(n => ({
      ...n,
      isRead: true
    }));
    this.notificationsSubject.next(updated);
    this.updateUnreadCount(updated);
    // Mark each unread notification as read
    const markAllRequests = unreadIds.map(id => this.http.patch(`${this.baseUrl}/${id}/read`, {}));
    // Execute all requests and handle results
    return new rxjs__WEBPACK_IMPORTED_MODULE_8__.Observable(observer => {
      Promise.all(markAllRequests.map(req => req.toPromise())).then(results => {
        const allSucceeded = results.every(result => result?.succeeded);
        if (allSucceeded) {
          observer.next({
            succeeded: true,
            data: undefined,
            errors: []
          });
        } else {
          // Revert on failure
          this.notificationsSubject.next(current);
          this.updateUnreadCount(current);
          observer.next({
            succeeded: false,
            data: undefined,
            errors: ['Failed to mark all notifications as read']
          });
        }
        observer.complete();
      }).catch(error => {
        // Revert on failure
        this.notificationsSubject.next(current);
        this.updateUnreadCount(current);
        observer.error(error);
      });
    });
  }
  getNotifications(pageNumber = 1, pageSize = 20) {
    return this.http.get(`${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.tap)(response => {
      if (response.succeeded && response.data) {
        const notifications = response.data.items.map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          targetUrl: item.targetUrl,
          isRead: item.isRead,
          createdAt: new Date(item.createdAt),
          sourceUserId: item.sourceUserId
        }));
        // Update local state if this is the first page
        if (pageNumber === 1) {
          this.notificationsSubject.next(notifications);
          this.updateUnreadCount(notifications);
        }
      }
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.catchError)(err => {
      console.error('Failed to fetch notifications', err);
      const emptyResult = {
        succeeded: false,
        data: {
          items: [],
          pageNumber: pageNumber,
          pageSize: pageSize,
          totalCount: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false
        },
        errors: ['Failed to fetch notifications']
      };
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)(emptyResult);
    }));
  }
  static {
    this.ɵfac = function NotificationService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NotificationService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: NotificationService,
      factory: NotificationService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 5614:
/*!********************************************************************************!*\
  !*** ./src/app/shared/components/toast-container/toast-container.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ToastContainerComponent: () => (/* binding */ ToastContainerComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _core_services_toast_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/services/toast.service */ 5423);




const _forTrack0 = ($index, $item) => $item.id;
function ToastContainerComponent_For_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const toast_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](toast_r2.title);
  }
}
function ToastContainerComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 2)(1, "div", 3)(2, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "i");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, ToastContainerComponent_For_2_Conditional_5_Template, 2, 1, "p", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ToastContainerComponent_For_2_Template_button_click_8_listener() {
      const toast_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1).$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r2.removeToast(toast_r2.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "i", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const toast_r2 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMap"](ctx_r2.getToastClasses(toast_r2));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMap"](ctx_r2.getIconClass(toast_r2.type));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditional"](toast_r2.title ? 5 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](toast_r2.message);
  }
}
class ToastContainerComponent {
  constructor() {
    this.toastService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_core_services_toast_service__WEBPACK_IMPORTED_MODULE_0__.ToastService);
    this.toasts = [];
  }
  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  getToastClasses(toast) {
    const baseClasses = 'relative overflow-hidden';
    switch (toast.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200 text-gray-800`;
    }
  }
  getIconClass(type) {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-green-500';
      case 'error':
        return 'fas fa-exclamation-circle text-red-500';
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-500';
      case 'info':
        return 'fas fa-info-circle text-blue-500';
      default:
        return 'fas fa-bell text-gray-500';
    }
  }
  removeToast(id) {
    this.toastService.removeToast(id);
  }
  static {
    this.ɵfac = function ToastContainerComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ToastContainerComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ToastContainerComponent,
      selectors: [["app-toast-container"]],
      decls: 3,
      vars: 0,
      consts: [[1, "fixed", "top-4", "right-4", "z-50", "space-y-2", "max-w-sm"], [1, "transform", "transition-all", "duration-300", "ease-in-out", "animate-in", "slide-in-from-right-full", 3, "class"], [1, "transform", "transition-all", "duration-300", "ease-in-out", "animate-in", "slide-in-from-right-full"], [1, "flex", "items-start", "gap-3", "p-4", "rounded-lg", "shadow-lg", "border", "backdrop-blur-sm"], [1, "flex-shrink-0", "mt-0.5"], [1, "flex-1", "min-w-0"], [1, "text-sm", "font-semibold", "mb-1"], [1, "text-sm"], [1, "flex-shrink-0", "ml-2", "text-gray-400", "hover:text-gray-600", "transition-colors", 3, "click"], [1, "fas", "fa-times", "text-xs"]],
      template: function ToastContainerComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrepeaterCreate"](1, ToastContainerComponent_For_2_Template, 10, 6, "div", 1, _forTrack0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrepeater"](ctx.toasts);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 5695:
/*!******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/IHubProtocol.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageType: () => (/* binding */ MessageType)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Defines the type of a Hub Message. */
var MessageType;
(function (MessageType) {
  /** Indicates the message is an Invocation message and implements the {@link @microsoft/signalr.InvocationMessage} interface. */
  MessageType[MessageType["Invocation"] = 1] = "Invocation";
  /** Indicates the message is a StreamItem message and implements the {@link @microsoft/signalr.StreamItemMessage} interface. */
  MessageType[MessageType["StreamItem"] = 2] = "StreamItem";
  /** Indicates the message is a Completion message and implements the {@link @microsoft/signalr.CompletionMessage} interface. */
  MessageType[MessageType["Completion"] = 3] = "Completion";
  /** Indicates the message is a Stream Invocation message and implements the {@link @microsoft/signalr.StreamInvocationMessage} interface. */
  MessageType[MessageType["StreamInvocation"] = 4] = "StreamInvocation";
  /** Indicates the message is a Cancel Invocation message and implements the {@link @microsoft/signalr.CancelInvocationMessage} interface. */
  MessageType[MessageType["CancelInvocation"] = 5] = "CancelInvocation";
  /** Indicates the message is a Ping message and implements the {@link @microsoft/signalr.PingMessage} interface. */
  MessageType[MessageType["Ping"] = 6] = "Ping";
  /** Indicates the message is a Close message and implements the {@link @microsoft/signalr.CloseMessage} interface. */
  MessageType[MessageType["Close"] = 7] = "Close";
  MessageType[MessageType["Ack"] = 8] = "Ack";
  MessageType[MessageType["Sequence"] = 9] = "Sequence";
})(MessageType || (MessageType = {}));

/***/ }),

/***/ 6817:
/*!************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/WebSocketTransport.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebSocketTransport: () => (/* binding */ WebSocketTransport)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _HeaderNames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./HeaderNames */ 5262);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ITransport */ 893);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ 1720);

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




/** @private */
class WebSocketTransport {
  constructor(httpClient, accessTokenFactory, logger, logMessageContent, webSocketConstructor, headers) {
    this._logger = logger;
    this._accessTokenFactory = accessTokenFactory;
    this._logMessageContent = logMessageContent;
    this._webSocketConstructor = webSocketConstructor;
    this._httpClient = httpClient;
    this.onreceive = null;
    this.onclose = null;
    this._headers = headers;
  }
  connect(url, transferFormat) {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(url, "url");
      _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isRequired(transferFormat, "transferFormat");
      _Utils__WEBPACK_IMPORTED_MODULE_1__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat, "transferFormat");
      _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(WebSockets transport) Connecting.");
      let token;
      if (_this._accessTokenFactory) {
        token = yield _this._accessTokenFactory();
      }
      return new Promise((resolve, reject) => {
        url = url.replace(/^http/, "ws");
        let webSocket;
        const cookies = _this._httpClient.getCookieString(url);
        let opened = false;
        if (_Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isNode || _Utils__WEBPACK_IMPORTED_MODULE_1__.Platform.isReactNative) {
          const headers = {};
          const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getUserAgentHeader)();
          headers[name] = value;
          if (token) {
            headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_4__.HeaderNames.Authorization] = `Bearer ${token}`;
          }
          if (cookies) {
            headers[_HeaderNames__WEBPACK_IMPORTED_MODULE_4__.HeaderNames.Cookie] = cookies;
          }
          // Only pass headers when in non-browser environments
          webSocket = new _this._webSocketConstructor(url, undefined, {
            headers: {
              ...headers,
              ..._this._headers
            }
          });
        } else {
          if (token) {
            url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
          }
        }
        if (!webSocket) {
          // Chrome is not happy with passing 'undefined' as protocol
          webSocket = new _this._webSocketConstructor(url);
        }
        if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_2__.TransferFormat.Binary) {
          webSocket.binaryType = "arraybuffer";
        }
        webSocket.onopen = _event => {
          _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Information, `WebSocket connected to ${url}.`);
          _this._webSocket = webSocket;
          opened = true;
          resolve();
        };
        webSocket.onerror = event => {
          let error = null;
          // ErrorEvent is a browser only type we need to check if the type exists before using it
          if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
            error = event.error;
          } else {
            error = "There was an error with the transport";
          }
          _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Information, `(WebSockets transport) ${error}.`);
        };
        webSocket.onmessage = message => {
          _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(WebSockets transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getDataDetail)(message.data, _this._logMessageContent)}.`);
          if (_this.onreceive) {
            try {
              _this.onreceive(message.data);
            } catch (error) {
              _this._close(error);
              return;
            }
          }
        };
        webSocket.onclose = event => {
          // Don't call close handler if connection was never established
          // We'll reject the connect call instead
          if (opened) {
            _this._close(event);
          } else {
            let error = null;
            // ErrorEvent is a browser only type we need to check if the type exists before using it
            if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
              error = event.error;
            } else {
              error = "WebSocket failed to connect. The connection could not be found on the server," + " either the endpoint may not be a SignalR endpoint," + " the connection ID is not present on the server, or there is a proxy blocking WebSockets." + " If you have multiple servers check that sticky sessions are enabled.";
            }
            reject(new Error(error));
          }
        };
      });
    })();
  }
  send(data) {
    if (this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN) {
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, `(WebSockets transport) sending data. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_1__.getDataDetail)(data, this._logMessageContent)}.`);
      this._webSocket.send(data);
      return Promise.resolve();
    }
    return Promise.reject("WebSocket is not in the OPEN state");
  }
  stop() {
    if (this._webSocket) {
      // Manually invoke onclose callback inline so we know the HttpConnection was closed properly before returning
      // This also solves an issue where websocket.onclose could take 18+ seconds to trigger during network disconnects
      this._close(undefined);
    }
    return Promise.resolve();
  }
  _close(event) {
    // webSocket will be null if the transport did not start successfully
    if (this._webSocket) {
      // Clear websocket handlers because we are considering the socket closed now
      this._webSocket.onclose = () => {};
      this._webSocket.onmessage = () => {};
      this._webSocket.onerror = () => {};
      this._webSocket.close();
      this._webSocket = undefined;
    }
    this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_3__.LogLevel.Trace, "(WebSockets transport) socket closed.");
    if (this.onclose) {
      if (this._isCloseEvent(event) && (event.wasClean === false || event.code !== 1000)) {
        this.onclose(new Error(`WebSocket closed with status code: ${event.code} (${event.reason || "no reason given"}).`));
      } else if (event instanceof Error) {
        this.onclose(event);
      } else {
        this.onclose();
      }
    }
  }
  _isCloseEvent(event) {
    return event && typeof event.wasClean === "boolean" && typeof event.code === "number";
  }
}

/***/ }),

/***/ 6944:
/*!*************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Loggers.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NullLogger: () => (/* binding */ NullLogger)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** A logger that does nothing when log messages are sent to it. */
class NullLogger {
  constructor() {}
  /** @inheritDoc */
  // eslint-disable-next-line
  log(_logLevel, _message) {}
}
/** The singleton instance of the {@link @microsoft/signalr.NullLogger}. */
NullLogger.instance = new NullLogger();

/***/ }),

/***/ 7185:
/*!*****************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/pkg-version.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION = '10.0.0';

/***/ }),

/***/ 7422:
/*!*************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/ILogger.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogLevel: () => (/* binding */ LogLevel)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// These values are designed to match the ASP.NET Log Levels since that's the pattern we're emulating here.
/** Indicates the severity of a log message.
 *
 * Log Levels are ordered in increasing severity. So `Debug` is more severe than `Trace`, etc.
 */
var LogLevel;
(function (LogLevel) {
  /** Log level for very low severity diagnostic messages. */
  LogLevel[LogLevel["Trace"] = 0] = "Trace";
  /** Log level for low severity diagnostic messages. */
  LogLevel[LogLevel["Debug"] = 1] = "Debug";
  /** Log level for informational diagnostic messages. */
  LogLevel[LogLevel["Information"] = 2] = "Information";
  /** Log level for diagnostic messages that indicate a non-fatal problem. */
  LogLevel[LogLevel["Warning"] = 3] = "Warning";
  /** Log level for diagnostic messages that indicate a failure in the current operation. */
  LogLevel[LogLevel["Error"] = 4] = "Error";
  /** Log level for diagnostic messages that indicate a failure that will terminate the entire application. */
  LogLevel[LogLevel["Critical"] = 5] = "Critical";
  /** The highest possible log level. Used when configuring logging to indicate that no log messages should be emitted. */
  LogLevel[LogLevel["None"] = 6] = "None";
})(LogLevel || (LogLevel = {}));

/***/ }),

/***/ 7876:
/*!***********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/TextMessageFormat.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextMessageFormat: () => (/* binding */ TextMessageFormat)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Not exported from index
/** @private */
class TextMessageFormat {
  static write(output) {
    return `${output}${TextMessageFormat.RecordSeparator}`;
  }
  static parse(input) {
    if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
      throw new Error("Message is incomplete.");
    }
    const messages = input.split(TextMessageFormat.RecordSeparator);
    messages.pop();
    return messages;
  }
}
TextMessageFormat.RecordSeparatorCode = 0x1e;
TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);

/***/ }),

/***/ 8184:
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/JsonHubProtocol.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JsonHubProtocol: () => (/* binding */ JsonHubProtocol)
/* harmony export */ });
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IHubProtocol */ 5695);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ITransport */ 893);
/* harmony import */ var _Loggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Loggers */ 6944);
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TextMessageFormat */ 7876);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





const JSON_HUB_PROTOCOL_NAME = "json";
/** Implements the JSON Hub Protocol. */
class JsonHubProtocol {
  constructor() {
    /** @inheritDoc */
    this.name = JSON_HUB_PROTOCOL_NAME;
    /** @inheritDoc */
    this.version = 2;
    /** @inheritDoc */
    this.transferFormat = _ITransport__WEBPACK_IMPORTED_MODULE_0__.TransferFormat.Text;
  }
  /** Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
   *
   * @param {string} input A string containing the serialized representation.
   * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
   */
  parseMessages(input, logger) {
    // The interface does allow "ArrayBuffer" to be passed in, but this implementation does not. So let's throw a useful error.
    if (typeof input !== "string") {
      throw new Error("Invalid input for JSON hub protocol. Expected a string.");
    }
    if (!input) {
      return [];
    }
    if (logger === null) {
      logger = _Loggers__WEBPACK_IMPORTED_MODULE_1__.NullLogger.instance;
    }
    // Parse the messages
    const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.parse(input);
    const hubMessages = [];
    for (const message of messages) {
      const parsedMessage = JSON.parse(message);
      if (typeof parsedMessage.type !== "number") {
        throw new Error("Invalid payload.");
      }
      switch (parsedMessage.type) {
        case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Invocation:
          this._isInvocationMessage(parsedMessage);
          break;
        case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.StreamItem:
          this._isStreamItemMessage(parsedMessage);
          break;
        case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Completion:
          this._isCompletionMessage(parsedMessage);
          break;
        case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ping:
          // Single value, no need to validate
          break;
        case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Close:
          // All optional values, no need to validate
          break;
        case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Ack:
          this._isAckMessage(parsedMessage);
          break;
        case _IHubProtocol__WEBPACK_IMPORTED_MODULE_3__.MessageType.Sequence:
          this._isSequenceMessage(parsedMessage);
          break;
        default:
          // Future protocol changes can add message types, old clients can ignore them
          logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, "Unknown message type '" + parsedMessage.type + "' ignored.");
          continue;
      }
      hubMessages.push(parsedMessage);
    }
    return hubMessages;
  }
  /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
   *
   * @param {HubMessage} message The message to write.
   * @returns {string} A string containing the serialized representation of the message.
   */
  writeMessage(message) {
    return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_2__.TextMessageFormat.write(JSON.stringify(message));
  }
  _isInvocationMessage(message) {
    this._assertNotEmptyString(message.target, "Invalid payload for Invocation message.");
    if (message.invocationId !== undefined) {
      this._assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
    }
  }
  _isStreamItemMessage(message) {
    this._assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");
    if (message.item === undefined) {
      throw new Error("Invalid payload for StreamItem message.");
    }
  }
  _isCompletionMessage(message) {
    if (message.result && message.error) {
      throw new Error("Invalid payload for Completion message.");
    }
    if (!message.result && message.error) {
      this._assertNotEmptyString(message.error, "Invalid payload for Completion message.");
    }
    this._assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
  }
  _isAckMessage(message) {
    if (typeof message.sequenceId !== 'number') {
      throw new Error("Invalid SequenceId for Ack message.");
    }
  }
  _isSequenceMessage(message) {
    if (typeof message.sequenceId !== 'number') {
      throw new Error("Invalid SequenceId for Sequence message.");
    }
  }
  _assertNotEmptyString(value, errorMessage) {
    if (typeof value !== "string" || value === "") {
      throw new Error(errorMessage);
    }
  }
}

/***/ }),

/***/ 8250:
/*!*********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FetchHttpClient: () => (/* binding */ FetchHttpClient)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Errors */ 9490);
/* harmony import */ var _HttpClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HttpClient */ 1598);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils */ 1720);

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.




class FetchHttpClient extends _HttpClient__WEBPACK_IMPORTED_MODULE_1__.HttpClient {
  constructor(logger) {
    super();
    this._logger = logger;
    // Node added a fetch implementation to the global scope starting in v18.
    // We need to add a cookie jar in node to be able to share cookies with WebSocket
    if (typeof fetch === "undefined" || _Utils__WEBPACK_IMPORTED_MODULE_2__.Platform.isNode) {
      // In order to ignore the dynamic require in webpack builds we need to do this magic
      // @ts-ignore: TS doesn't know about these names
      const requireFunc =  true ? require : 0;
      // Cookies aren't automatically handled in Node so we need to add a CookieJar to preserve cookies across requests
      this._jar = new (requireFunc("tough-cookie").CookieJar)();
      if (typeof fetch === "undefined") {
        this._fetchType = requireFunc("node-fetch");
      } else {
        // Use fetch from Node if available
        this._fetchType = fetch;
      }
      // node-fetch doesn't have a nice API for getting and setting cookies
      // fetch-cookie will wrap a fetch implementation with a default CookieJar or a provided one
      this._fetchType = requireFunc("fetch-cookie")(this._fetchType, this._jar);
    } else {
      this._fetchType = fetch.bind((0,_Utils__WEBPACK_IMPORTED_MODULE_2__.getGlobalThis)());
    }
    if (typeof AbortController === "undefined") {
      // In order to ignore the dynamic require in webpack builds we need to do this magic
      // @ts-ignore: TS doesn't know about these names
      const requireFunc =  true ? require : 0;
      // Node needs EventListener methods on AbortController which our custom polyfill doesn't provide
      this._abortControllerType = requireFunc("abort-controller");
    } else {
      this._abortControllerType = AbortController;
    }
  }
  /** @inheritDoc */
  send(request) {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      // Check that abort was not signaled before calling send
      if (request.abortSignal && request.abortSignal.aborted) {
        throw new _Errors__WEBPACK_IMPORTED_MODULE_3__.AbortError();
      }
      if (!request.method) {
        throw new Error("No method defined.");
      }
      if (!request.url) {
        throw new Error("No url defined.");
      }
      const abortController = new _this._abortControllerType();
      let error;
      // Hook our abortSignal into the abort controller
      if (request.abortSignal) {
        request.abortSignal.onabort = () => {
          abortController.abort();
          error = new _Errors__WEBPACK_IMPORTED_MODULE_3__.AbortError();
        };
      }
      // If a timeout has been passed in, setup a timeout to call abort
      // Type needs to be any to fit window.setTimeout and NodeJS.setTimeout
      let timeoutId = null;
      if (request.timeout) {
        const msTimeout = request.timeout;
        timeoutId = setTimeout(() => {
          abortController.abort();
          _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Warning, `Timeout from HTTP request.`);
          error = new _Errors__WEBPACK_IMPORTED_MODULE_3__.TimeoutError();
        }, msTimeout);
      }
      if (request.content === "") {
        request.content = undefined;
      }
      if (request.content) {
        // Explicitly setting the Content-Type header for React Native on Android platform.
        request.headers = request.headers || {};
        if ((0,_Utils__WEBPACK_IMPORTED_MODULE_2__.isArrayBuffer)(request.content)) {
          request.headers["Content-Type"] = "application/octet-stream";
        } else {
          request.headers["Content-Type"] = "text/plain;charset=UTF-8";
        }
      }
      let response;
      try {
        response = yield _this._fetchType(request.url, {
          body: request.content,
          cache: "no-cache",
          credentials: request.withCredentials === true ? "include" : "same-origin",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            ...request.headers
          },
          method: request.method,
          mode: "cors",
          redirect: "follow",
          signal: abortController.signal
        });
      } catch (e) {
        if (error) {
          throw error;
        }
        _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Warning, `Error from HTTP request. ${e}.`);
        throw e;
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (request.abortSignal) {
          request.abortSignal.onabort = null;
        }
      }
      if (!response.ok) {
        const errorMessage = yield deserializeContent(response, "text");
        throw new _Errors__WEBPACK_IMPORTED_MODULE_3__.HttpError(errorMessage || response.statusText, response.status);
      }
      const content = deserializeContent(response, request.responseType);
      const payload = yield content;
      return new _HttpClient__WEBPACK_IMPORTED_MODULE_1__.HttpResponse(response.status, response.statusText, payload);
    })();
  }
  getCookieString(url) {
    let cookies = "";
    if (_Utils__WEBPACK_IMPORTED_MODULE_2__.Platform.isNode && this._jar) {
      // @ts-ignore: unused variable
      this._jar.getCookies(url, (e, c) => cookies = c.join("; "));
    }
    return cookies;
  }
}
function deserializeContent(response, responseType) {
  let content;
  switch (responseType) {
    case "arraybuffer":
      content = response.arrayBuffer();
      break;
    case "text":
      content = response.text();
      break;
    case "blob":
    case "document":
    case "json":
      throw new Error(`${responseType} is not supported.`);
    default:
      content = response.text();
      break;
  }
  return content;
}

/***/ }),

/***/ 8302:
/*!**************************************************!*\
  !*** ./src/app/core/services/signalr.service.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SignalRService: () => (/* binding */ SignalRService)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _microsoft_signalr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @microsoft/signalr */ 4443);
/* harmony import */ var _microsoft_signalr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @microsoft/signalr */ 7422);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 5797);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth.service */ 8010);






class SignalRService {
  constructor(authService) {
    this.authService = authService;
    this.hubConnection = null;
    this.connectionStateSubject = new rxjs__WEBPACK_IMPORTED_MODULE_3__.BehaviorSubject(false);
    this.connectionState$ = this.connectionStateSubject.asObservable();
    // Notification events
    this.notificationReceivedSubject = new rxjs__WEBPACK_IMPORTED_MODULE_3__.BehaviorSubject(null);
    this.notificationReceived$ = this.notificationReceivedSubject.asObservable();
    // Auto-connect when user is authenticated
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.startConnection();
      } else {
        this.stopConnection();
      }
    });
  }
  startConnection() {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.hubConnection?.state === 'Connected') {
        return;
      }
      try {
        const token = _this.authService.token;
        console.log('Starting SignalR connection...', {
          hasToken: !!token,
          tokenPreview: token?.substring(0, 20) + '...',
          hubUrl: `${_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.hubUrl}/notificationHub`
        });
        _this.hubConnection = new _microsoft_signalr__WEBPACK_IMPORTED_MODULE_4__.HubConnectionBuilder().withUrl(`${_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.hubUrl}/notificationHub`, {
          accessTokenFactory: () => token || ''
        }).withAutomaticReconnect().configureLogging(_microsoft_signalr__WEBPACK_IMPORTED_MODULE_5__.LogLevel.Information).build();
        // Set up event handlers
        _this.setupEventHandlers();
        yield _this.hubConnection.start();
        console.log('SignalR connection established successfully');
        _this.connectionStateSubject.next(true);
        // Join user group for notifications if authenticated
        const userId = _this.authService.currentUser?.id;
        if (userId && token) {
          try {
            yield _this.hubConnection.invoke('JoinUserGroup', userId);
            console.log('Joined user group:', userId);
          } catch (error) {
            console.error('Error joining user group:', error);
          }
        }
      } catch (error) {
        console.error('Error starting SignalR connection:', error);
        _this.connectionStateSubject.next(false);
        // Retry connection after delay only if we have a token
        if (_this.authService.token) {
          setTimeout(() => _this.startConnection(), 5000);
        }
      }
    })();
  }
  setupEventHandlers() {
    if (!this.hubConnection) return;
    // Handle notification received
    this.hubConnection.on('NotificationReceived', notification => {
      console.log('Notification received via SignalR:', notification);
      this.notificationReceivedSubject.next(notification);
    });
    // Handle connection events
    this.hubConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
      this.connectionStateSubject.next(false);
    });
    this.hubConnection.onreconnected(() => {
      console.log('SignalR reconnected');
      this.connectionStateSubject.next(true);
      // Rejoin user group after reconnection
      const userId = this.authService.currentUser?.id;
      if (userId) {
        this.hubConnection?.invoke('JoinUserGroup', userId);
      }
    });
    this.hubConnection.onclose(() => {
      console.log('SignalR connection closed');
      this.connectionStateSubject.next(false);
    });
  }
  stopConnection() {
    var _this2 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.hubConnection) {
        try {
          yield _this2.hubConnection.stop();
          console.log('SignalR connection stopped');
        } catch (error) {
          console.error('Error stopping SignalR connection:', error);
        } finally {
          _this2.hubConnection = null;
          _this2.connectionStateSubject.next(false);
        }
      }
    })();
  }
  sendMessage(method, ...args) {
    var _this3 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3.hubConnection?.state === 'Connected') {
        try {
          return yield _this3.hubConnection.invoke(method, ...args);
        } catch (error) {
          console.error(`Error invoking ${method}:`, error);
          throw error;
        }
      } else {
        throw new Error('SignalR connection not established');
      }
    })();
  }
  get isConnected() {
    return this.hubConnection?.state === 'Connected';
  }
  static {
    this.ɵfac = function SignalRService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SignalRService)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({
      token: SignalRService,
      factory: SignalRService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 8335:
/*!**************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/LongPollingTransport.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LongPollingTransport: () => (/* binding */ LongPollingTransport)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _AbortController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbortController */ 3044);
/* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Errors */ 9490);
/* harmony import */ var _ILogger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ILogger */ 7422);
/* harmony import */ var _ITransport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ITransport */ 893);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Utils */ 1720);

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.





// Not exported from 'index', this type is internal.
/** @private */
class LongPollingTransport {
  // This is an internal type, not exported from 'index' so this is really just internal.
  get pollAborted() {
    return this._pollAbort.aborted;
  }
  constructor(httpClient, logger, options) {
    this._httpClient = httpClient;
    this._logger = logger;
    this._pollAbort = new _AbortController__WEBPACK_IMPORTED_MODULE_1__.AbortController();
    this._options = options;
    this._running = false;
    this.onreceive = null;
    this.onclose = null;
  }
  connect(url, transferFormat) {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _Utils__WEBPACK_IMPORTED_MODULE_2__.Arg.isRequired(url, "url");
      _Utils__WEBPACK_IMPORTED_MODULE_2__.Arg.isRequired(transferFormat, "transferFormat");
      _Utils__WEBPACK_IMPORTED_MODULE_2__.Arg.isIn(transferFormat, _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat, "transferFormat");
      _this._url = url;
      _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, "(LongPolling transport) Connecting.");
      // Allow binary format on Node and Browsers that support binary content (indicated by the presence of responseType property)
      if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat.Binary && typeof XMLHttpRequest !== "undefined" && typeof new XMLHttpRequest().responseType !== "string") {
        throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
      }
      const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_2__.getUserAgentHeader)();
      const headers = {
        [name]: value,
        ..._this._options.headers
      };
      const pollOptions = {
        abortSignal: _this._pollAbort.signal,
        headers,
        timeout: 100000,
        withCredentials: _this._options.withCredentials
      };
      if (transferFormat === _ITransport__WEBPACK_IMPORTED_MODULE_3__.TransferFormat.Binary) {
        pollOptions.responseType = "arraybuffer";
      }
      // Make initial long polling request
      // Server uses first long polling request to finish initializing connection and it returns without data
      const pollUrl = `${url}&_=${Date.now()}`;
      _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
      const response = yield _this._httpClient.get(pollUrl, pollOptions);
      if (response.statusCode !== 200) {
        _this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
        // Mark running as false so that the poll immediately ends and runs the close logic
        _this._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_5__.HttpError(response.statusText || "", response.statusCode);
        _this._running = false;
      } else {
        _this._running = true;
      }
      _this._receiving = _this._poll(_this._url, pollOptions);
    })();
  }
  _poll(url, pollOptions) {
    var _this2 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        while (_this2._running) {
          try {
            const pollUrl = `${url}&_=${Date.now()}`;
            _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
            const response = yield _this2._httpClient.get(pollUrl, pollOptions);
            if (response.statusCode === 204) {
              _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
              _this2._running = false;
            } else if (response.statusCode !== 200) {
              _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
              // Unexpected status code
              _this2._closeError = new _Errors__WEBPACK_IMPORTED_MODULE_5__.HttpError(response.statusText || "", response.statusCode);
              _this2._running = false;
            } else {
              // Process the response
              if (response.content) {
                _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, `(LongPolling transport) data received. ${(0,_Utils__WEBPACK_IMPORTED_MODULE_2__.getDataDetail)(response.content, _this2._options.logMessageContent)}.`);
                if (_this2.onreceive) {
                  _this2.onreceive(response.content);
                }
              } else {
                // This is another way timeout manifest.
                _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
              }
            }
          } catch (e) {
            if (!_this2._running) {
              // Log but disregard errors that occur after stopping
              _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
            } else {
              if (e instanceof _Errors__WEBPACK_IMPORTED_MODULE_5__.TimeoutError) {
                // Ignore timeouts and reissue the poll.
                _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
              } else {
                // Close the connection with the error as the result.
                _this2._closeError = e;
                _this2._running = false;
              }
            }
          }
        }
      } finally {
        _this2._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, "(LongPolling transport) Polling complete.");
        // We will reach here with pollAborted==false when the server returned a response causing the transport to stop.
        // If pollAborted==true then client initiated the stop and the stop method will raise the close event after DELETE is sent.
        if (!_this2.pollAborted) {
          _this2._raiseOnClose();
        }
      }
    })();
  }
  send(data) {
    var _this3 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this3._running) {
        return Promise.reject(new Error("Cannot send until the transport is connected"));
      }
      return (0,_Utils__WEBPACK_IMPORTED_MODULE_2__.sendMessage)(_this3._logger, "LongPolling", _this3._httpClient, _this3._url, data, _this3._options);
    })();
  }
  stop() {
    var _this4 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this4._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, "(LongPolling transport) Stopping polling.");
      // Tell receiving loop to stop, abort any current request, and then wait for it to finish
      _this4._running = false;
      _this4._pollAbort.abort();
      try {
        yield _this4._receiving;
        // Send DELETE to clean up long polling on the server
        _this4._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, `(LongPolling transport) sending DELETE request to ${_this4._url}.`);
        const headers = {};
        const [name, value] = (0,_Utils__WEBPACK_IMPORTED_MODULE_2__.getUserAgentHeader)();
        headers[name] = value;
        const deleteOptions = {
          headers: {
            ...headers,
            ..._this4._options.headers
          },
          timeout: _this4._options.timeout,
          withCredentials: _this4._options.withCredentials
        };
        let error;
        try {
          yield _this4._httpClient.delete(_this4._url, deleteOptions);
        } catch (err) {
          error = err;
        }
        if (error) {
          if (error instanceof _Errors__WEBPACK_IMPORTED_MODULE_5__.HttpError) {
            if (error.statusCode === 404) {
              _this4._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.");
            } else {
              _this4._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, `(LongPolling transport) Error sending a DELETE request: ${error}`);
            }
          }
        } else {
          _this4._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, "(LongPolling transport) DELETE request accepted.");
        }
      } finally {
        _this4._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, "(LongPolling transport) Stop finished.");
        // Raise close event here instead of in polling
        // It needs to happen after the DELETE request is sent
        _this4._raiseOnClose();
      }
    })();
  }
  _raiseOnClose() {
    if (this.onclose) {
      let logMessage = "(LongPolling transport) Firing onclose event.";
      if (this._closeError) {
        logMessage += " Error: " + this._closeError;
      }
      this._logger.log(_ILogger__WEBPACK_IMPORTED_MODULE_4__.LogLevel.Trace, logMessage);
      this.onclose(this._closeError);
    }
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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../core/services/auth.service */ 8010);







function SidebarLeftComponent_img_60_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 44);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r0.currentUser.profileImageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
  }
}
function SidebarLeftComponent_span_61_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", (ctx_r0.currentUser == null ? null : ctx_r0.currentUser.firstName == null ? null : ctx_r0.currentUser.firstName[0]) || "U", "", (ctx_r0.currentUser == null ? null : ctx_r0.currentUser.lastName == null ? null : ctx_r0.currentUser.lastName[0]) || "P", "");
  }
}
class SidebarLeftComponent {
  constructor(authService) {
    this.authService = authService;
  }
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {});
  }
  get currentYear() {
    return new Date().getFullYear();
  }
  static {
    this.ɵfac = function SidebarLeftComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SidebarLeftComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: SidebarLeftComponent,
      selectors: [["app-sidebar-left"]],
      decls: 70,
      vars: 4,
      consts: [[1, "flex", "flex-col", "h-full", "p-2", "space-y-0.5", "animate-fade-in", "items-center", "lg:items-stretch"], [1, "flex-1", "space-y-0.5", "overflow-y-auto", "custom-scroll", "w-full"], ["routerLink", "/community", "routerLinkActive", "!bg-primary/10 transition-all duration-500", 1, "flex", "items-center", "justify-center", "lg:justify-start", "gap-3", "p-2", "rounded-xl", "transition-all", "hover:bg-secondary/50", "active:scale-95", "cursor-pointer", "group"], [1, "w-10", "h-10", "flex-shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "bg-sky-500/10", "text-sky-500", "group-hover:bg-sky-500", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "fa-solid", "fa-user-group", "text-lg"], [1, "text-sm", "font-bold", "text-foreground/80", "group-hover:text-foreground", "hidden", "lg:inline"], [1, "flex", "items-center", "justify-center", "lg:justify-start", "gap-3", "p-2", "rounded-xl", "transition-all", "hover:bg-secondary/50", "active:scale-95", "cursor-pointer", "group"], [1, "w-10", "h-10", "flex-shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "bg-blue-500/10", "text-blue-500", "group-hover:bg-blue-500", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "fa-solid", "fa-clock", "text-lg"], [1, "w-10", "h-10", "flex-shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "bg-purple-500/10", "text-purple-500", "group-hover:bg-purple-500", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "fa-solid", "fa-bookmark", "text-lg"], ["routerLink", "/community/news", "routerLinkActive", "!bg-primary/10 transition-all duration-500", 1, "flex", "items-center", "justify-center", "lg:justify-start", "gap-3", "p-2", "rounded-xl", "transition-all", "hover:bg-secondary/50", "active:scale-95", "cursor-pointer", "group"], [1, "w-10", "h-10", "flex-shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "bg-orange-500/10", "text-orange-500", "group-hover:bg-orange-500", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "fa-solid", "fa-newspaper", "text-lg"], ["routerLink", "/community/qa", "routerLinkActive", "!bg-primary/10 transition-all duration-500", 1, "flex", "items-center", "justify-center", "lg:justify-start", "gap-3", "p-2", "rounded-xl", "transition-all", "hover:bg-secondary/50", "active:scale-95", "cursor-pointer", "group"], [1, "w-10", "h-10", "flex-shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "bg-emerald-500/10", "text-emerald-500", "group-hover:bg-emerald-500", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "fa-solid", "fa-circle-question", "text-lg"], ["routerLink", "/community/maps", "routerLinkActive", "!bg-primary/10 transition-all duration-500", 1, "flex", "items-center", "justify-center", "lg:justify-start", "gap-3", "p-2", "rounded-xl", "transition-all", "hover:bg-secondary/50", "active:scale-95", "cursor-pointer", "group"], [1, "w-10", "h-10", "flex-shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "bg-rose-500/10", "text-rose-500", "group-hover:bg-rose-500", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "fa-solid", "fa-map-location-dot", "text-lg"], ["routerLink", "/community/guides", "routerLinkActive", "!bg-primary/10 transition-all duration-500", 1, "flex", "items-center", "justify-center", "lg:justify-start", "gap-3", "p-2", "rounded-xl", "transition-all", "hover:bg-secondary/50", "active:scale-95", "cursor-pointer", "group"], [1, "w-10", "h-10", "flex-shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "bg-amber-500/10", "text-amber-500", "group-hover:bg-amber-500", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "fa-solid", "fa-book-open", "text-lg"], ["routerLink", "/media", "routerLinkActive", "!bg-primary/10 transition-all duration-500", 1, "flex", "items-center", "justify-center", "lg:justify-start", "gap-3", "p-2", "rounded-xl", "transition-all", "hover:bg-secondary/50", "active:scale-95", "cursor-pointer", "group"], [1, "w-10", "h-10", "flex-shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "bg-red-500/10", "text-red-500", "group-hover:bg-red-500", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "fa-solid", "fa-play", "text-lg"], ["routerLink", "/marketplace", "routerLinkActive", "!bg-primary/10 transition-all duration-500", 1, "flex", "items-center", "justify-center", "lg:justify-start", "gap-3", "p-2", "rounded-xl", "transition-all", "hover:bg-secondary/50", "active:scale-95", "cursor-pointer", "group"], [1, "w-10", "h-10", "flex-shrink-0", "flex", "items-center", "justify-center", "rounded-xl", "bg-green-500/10", "text-green-500", "group-hover:bg-green-500", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "fa-solid", "fa-store", "text-lg"], [1, "my-4", "border-border/10", "mx-3", "w-full", "lg:w-auto"], [1, "px-4", "text-[10px]", "text-muted-foreground/50", "font-black", "mb-3", "uppercase", "tracking-[0.2em]", "flex", "items-center", "gap-2", "lg:justify-start", "justify-center"], [1, "w-1", "h-1", "bg-primary", "rounded-full"], [1, "hidden", "lg:inline"], [1, "w-10", "h-10", "flex-shrink-0", "bg-primary/20", "rounded-xl", "flex", "items-center", "justify-center", "text-primary", "font-black", "italic", "text-[10px]", "group-hover:bg-primary", "group-hover:text-white", "transition-all", "duration-300", "shadow-sm"], [1, "text-sm", "font-bold", "text-foreground/80", "truncate", "group-hover:text-foreground", "hidden", "lg:inline"], [1, "mt-auto", "pt-4", "space-y-3", "w-full"], ["routerLink", "/community/profile", 1, "flex", "items-center", "justify-center", "lg:justify-start", "gap-3", "p-2", "rounded-2xl", "transition-all", "hover:mica-effect", "active:scale-95", "cursor-pointer", "group", "bg-white/5", "border", "border-white/5", "mx-1"], [1, "w-10", "h-10", "flex-shrink-0", "rounded-full", "bg-gradient-to-tr", "from-primary/80", "to-purple-600", "flex", "items-center", "justify-center", "text-white", "font-bold", "shadow-lg", "ring-2", "ring-primary/10", "overflow-hidden"], ["class", "w-full h-full object-cover", 3, "src", 4, "ngIf"], [4, "ngIf"], [1, "flex-col", "min-w-0", "hidden", "lg:flex"], [1, "font-bold", "text-sm", "text-foreground", "truncate"], [1, "text-[10px]", "text-muted-foreground/60", "font-medium", "tracking-tight"], [1, "px-2", "py-4", "text-[8px]", "text-muted-foreground/30", "font-bold", "tracking-tighter", "uppercase", "text-center", "mica-effect", "rounded-2xl", "border", "border-white/5", "hidden", "lg:block", "mx-1"], [1, "w-full", "h-full", "object-cover", 3, "src"]],
      template: function SidebarLeftComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "i", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Friends");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 6)(8, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "i", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Memories");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 6)(13, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "i", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Saved");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 11)(18, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "i", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "Latest News");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "div", 14)(23, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](24, "i", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "Knowledge Center");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 17)(28, "div", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](29, "i", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](31, "Automotive Maps");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "div", 20)(33, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](34, "i", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, "Maintenance Guides");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "div", 23)(38, "div", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](39, "i", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41, "Videos & Podcasts");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "div", 26)(43, "div", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](44, "i", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](45, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](46, "Marketplace");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](47, "hr", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "h3", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](49, "span", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](50, "span", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](51, "Shortcuts");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](52, "div", 6)(53, "div", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](54, " OFF");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "span", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](56, "Off-road Lovers Egypt");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](57, "div", 35)(58, "div", 36)(59, "div", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](60, SidebarLeftComponent_img_60_Template, 1, 1, "img", 38)(61, SidebarLeftComponent_span_61_Template, 2, 2, "span", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](62, "div", 40)(63, "span", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](64);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](65, "span", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](66, "View Profile");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](67, "div", 43)(68, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](69);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](60);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.currentUser == null ? null : ctx.currentUser.profileImageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !(ctx.currentUser == null ? null : ctx.currentUser.profileImageUrl));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"]((ctx.currentUser == null ? null : ctx.currentUser.firstName) ? ctx.currentUser.firstName + " " + ctx.currentUser.lastName : "User Profile");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("\u00A9 ", ctx.currentYear, " COMMUNITY CAR");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__.TranslateModule, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLinkActive],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8440:
/*!*******************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/MessageBuffer.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageBuffer: () => (/* binding */ MessageBuffer)
/* harmony export */ });
/* harmony import */ var C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 9204);
/* harmony import */ var _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IHubProtocol */ 5695);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ 1720);

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class MessageBuffer {
  constructor(protocol, connection, bufferSize) {
    this._bufferSize = 100000;
    this._messages = [];
    this._totalMessageCount = 0;
    this._waitForSequenceMessage = false;
    // Message IDs start at 1 and always increment by 1
    this._nextReceivingSequenceId = 1;
    this._latestReceivedSequenceId = 0;
    this._bufferedByteCount = 0;
    this._reconnectInProgress = false;
    this._protocol = protocol;
    this._connection = connection;
    this._bufferSize = bufferSize;
  }
  _send(message) {
    var _this = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const serializedMessage = _this._protocol.writeMessage(message);
      let backpressurePromise = Promise.resolve();
      // Only count invocation messages. Acks, pings, etc. don't need to be resent on reconnect
      if (_this._isInvocationMessage(message)) {
        _this._totalMessageCount++;
        let backpressurePromiseResolver = () => {};
        let backpressurePromiseRejector = () => {};
        if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(serializedMessage)) {
          _this._bufferedByteCount += serializedMessage.byteLength;
        } else {
          _this._bufferedByteCount += serializedMessage.length;
        }
        if (_this._bufferedByteCount >= _this._bufferSize) {
          backpressurePromise = new Promise((resolve, reject) => {
            backpressurePromiseResolver = resolve;
            backpressurePromiseRejector = reject;
          });
        }
        _this._messages.push(new BufferedItem(serializedMessage, _this._totalMessageCount, backpressurePromiseResolver, backpressurePromiseRejector));
      }
      try {
        // If this is set it means we are reconnecting or resending
        // We don't want to send on a disconnected connection
        // And we don't want to send if resend is running since that would mean sending
        // this message twice
        if (!_this._reconnectInProgress) {
          yield _this._connection.send(serializedMessage);
        }
      } catch {
        _this._disconnected();
      }
      yield backpressurePromise;
    })();
  }
  _ack(ackMessage) {
    let newestAckedMessage = -1;
    // Find index of newest message being acked
    for (let index = 0; index < this._messages.length; index++) {
      const element = this._messages[index];
      if (element._id <= ackMessage.sequenceId) {
        newestAckedMessage = index;
        if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(element._message)) {
          this._bufferedByteCount -= element._message.byteLength;
        } else {
          this._bufferedByteCount -= element._message.length;
        }
        // resolve items that have already been sent and acked
        element._resolver();
      } else if (this._bufferedByteCount < this._bufferSize) {
        // resolve items that now fall under the buffer limit but haven't been acked
        element._resolver();
      } else {
        break;
      }
    }
    if (newestAckedMessage !== -1) {
      // We're removing everything including the message pointed to, so add 1
      this._messages = this._messages.slice(newestAckedMessage + 1);
    }
  }
  _shouldProcessMessage(message) {
    if (this._waitForSequenceMessage) {
      if (message.type !== _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.Sequence) {
        return false;
      } else {
        this._waitForSequenceMessage = false;
        return true;
      }
    }
    // No special processing for acks, pings, etc.
    if (!this._isInvocationMessage(message)) {
      return true;
    }
    const currentId = this._nextReceivingSequenceId;
    this._nextReceivingSequenceId++;
    if (currentId <= this._latestReceivedSequenceId) {
      if (currentId === this._latestReceivedSequenceId) {
        // Should only hit this if we just reconnected and the server is sending
        // Messages it has buffered, which would mean it hasn't seen an Ack for these messages
        this._ackTimer();
      }
      // Ignore, this is a duplicate message
      return false;
    }
    this._latestReceivedSequenceId = currentId;
    // Only start the timer for sending an Ack message when we have a message to ack. This also conveniently solves
    // timer throttling by not having a recursive timer, and by starting the timer via a network call (recv)
    this._ackTimer();
    return true;
  }
  _resetSequence(message) {
    if (message.sequenceId > this._nextReceivingSequenceId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._connection.stop(new Error("Sequence ID greater than amount of messages we've received."));
      return;
    }
    this._nextReceivingSequenceId = message.sequenceId;
  }
  _disconnected() {
    this._reconnectInProgress = true;
    this._waitForSequenceMessage = true;
  }
  _resend() {
    var _this2 = this;
    return (0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const sequenceId = _this2._messages.length !== 0 ? _this2._messages[0]._id : _this2._totalMessageCount + 1;
      yield _this2._connection.send(_this2._protocol.writeMessage({
        type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.Sequence,
        sequenceId
      }));
      // Get a local variable to the _messages, just in case messages are acked while resending
      // Which would slice the _messages array (which creates a new copy)
      const messages = _this2._messages;
      for (const element of messages) {
        yield _this2._connection.send(element._message);
      }
      _this2._reconnectInProgress = false;
    })();
  }
  _dispose(error) {
    error !== null && error !== void 0 ? error : error = new Error("Unable to reconnect to server.");
    // Unblock backpressure if any
    for (const element of this._messages) {
      element._rejector(error);
    }
  }
  _isInvocationMessage(message) {
    // There is no way to check if something implements an interface.
    // So we individually check the messages in a switch statement.
    // To make sure we don't miss any message types we rely on the compiler
    // seeing the function returns a value and it will do the
    // exhaustive check for us on the switch statement, since we don't use 'case default'
    switch (message.type) {
      case _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.Invocation:
      case _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.StreamItem:
      case _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.Completion:
      case _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.StreamInvocation:
      case _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.CancelInvocation:
        return true;
      case _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.Close:
      case _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.Sequence:
      case _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.Ping:
      case _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.Ack:
        return false;
    }
  }
  _ackTimer() {
    var _this3 = this;
    if (this._ackTimerHandle === undefined) {
      this._ackTimerHandle = setTimeout(/*#__PURE__*/(0,C_Users_memos_OneDrive_Desktop_Projects_fully2car_ClientApp_Main_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        try {
          if (!_this3._reconnectInProgress) {
            yield _this3._connection.send(_this3._protocol.writeMessage({
              type: _IHubProtocol__WEBPACK_IMPORTED_MODULE_2__.MessageType.Ack,
              sequenceId: _this3._latestReceivedSequenceId
            }));
          }
          // Ignore errors, that means the connection is closed and we don't care about the Ack message anymore.
        } catch {}
        clearTimeout(_this3._ackTimerHandle);
        _this3._ackTimerHandle = undefined;
        // 1 second delay so we don't spam Ack messages if there are many messages being received at once.
      }), 1000);
    }
  }
}
class BufferedItem {
  constructor(message, id, resolver, rejector) {
    this._message = message;
    this._id = id;
    this._resolver = resolver;
    this._rejector = rejector;
  }
}

/***/ }),

/***/ 8448:
/*!***********************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HandshakeProtocol: () => (/* binding */ HandshakeProtocol)
/* harmony export */ });
/* harmony import */ var _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextMessageFormat */ 7876);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ 1720);
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.


/** @private */
class HandshakeProtocol {
  // Handshake request is always JSON
  writeHandshakeRequest(handshakeRequest) {
    return _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.write(JSON.stringify(handshakeRequest));
  }
  parseHandshakeResponse(data) {
    let messageData;
    let remainingData;
    if ((0,_Utils__WEBPACK_IMPORTED_MODULE_1__.isArrayBuffer)(data)) {
      // Format is binary but still need to read JSON text from handshake response
      const binaryData = new Uint8Array(data);
      const separatorIndex = binaryData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparatorCode);
      if (separatorIndex === -1) {
        throw new Error("Message is incomplete.");
      }
      // content before separator is handshake response
      // optional content after is additional messages
      const responseLength = separatorIndex + 1;
      messageData = String.fromCharCode.apply(null, Array.prototype.slice.call(binaryData.slice(0, responseLength)));
      remainingData = binaryData.byteLength > responseLength ? binaryData.slice(responseLength).buffer : null;
    } else {
      const textData = data;
      const separatorIndex = textData.indexOf(_TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.RecordSeparator);
      if (separatorIndex === -1) {
        throw new Error("Message is incomplete.");
      }
      // content before separator is handshake response
      // optional content after is additional messages
      const responseLength = separatorIndex + 1;
      messageData = textData.substring(0, responseLength);
      remainingData = textData.length > responseLength ? textData.substring(responseLength) : null;
    }
    // At this point we should have just the single handshake message
    const messages = _TextMessageFormat__WEBPACK_IMPORTED_MODULE_0__.TextMessageFormat.parse(messageData);
    const response = JSON.parse(messages[0]);
    if (response.type) {
      throw new Error("Expected a handshake response from the server.");
    }
    const responseMessage = response;
    // multiple messages could have arrived with handshake
    // return additional data to be parsed as usual, or null if all parsed
    return [remainingData, responseMessage];
  }
}

/***/ }),

/***/ 9221:
/*!****************************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/DefaultReconnectPolicy.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultReconnectPolicy: () => (/* binding */ DefaultReconnectPolicy)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// 0, 2, 10, 30 second delays before reconnect attempts.
const DEFAULT_RETRY_DELAYS_IN_MILLISECONDS = [0, 2000, 10000, 30000, null];
/** @private */
class DefaultReconnectPolicy {
  constructor(retryDelays) {
    this._retryDelays = retryDelays !== undefined ? [...retryDelays, null] : DEFAULT_RETRY_DELAYS_IN_MILLISECONDS;
  }
  nextRetryDelayInMilliseconds(retryContext) {
    return this._retryDelays[retryContext.previousRetryCount];
  }
}

/***/ }),

/***/ 9490:
/*!************************************************************!*\
  !*** ./node_modules/@microsoft/signalr/dist/esm/Errors.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError),
/* harmony export */   AggregateErrors: () => (/* binding */ AggregateErrors),
/* harmony export */   DisabledTransportError: () => (/* binding */ DisabledTransportError),
/* harmony export */   FailedToNegotiateWithServerError: () => (/* binding */ FailedToNegotiateWithServerError),
/* harmony export */   FailedToStartTransportError: () => (/* binding */ FailedToStartTransportError),
/* harmony export */   HttpError: () => (/* binding */ HttpError),
/* harmony export */   TimeoutError: () => (/* binding */ TimeoutError),
/* harmony export */   UnsupportedTransportError: () => (/* binding */ UnsupportedTransportError)
/* harmony export */ });
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/** Error thrown when an HTTP request fails. */
class HttpError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
   *
   * @param {string} errorMessage A descriptive error message.
   * @param {number} statusCode The HTTP status code represented by this error.
   */
  constructor(errorMessage, statusCode) {
    const trueProto = new.target.prototype;
    super(`${errorMessage}: Status code '${statusCode}'`);
    this.statusCode = statusCode;
    // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
    this.__proto__ = trueProto;
  }
}
/** Error thrown when a timeout elapses. */
class TimeoutError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
   *
   * @param {string} errorMessage A descriptive error message.
   */
  constructor(errorMessage = "A timeout occurred.") {
    const trueProto = new.target.prototype;
    super(errorMessage);
    // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
    this.__proto__ = trueProto;
  }
}
/** Error thrown when an action is aborted. */
class AbortError extends Error {
  /** Constructs a new instance of {@link AbortError}.
   *
   * @param {string} errorMessage A descriptive error message.
   */
  constructor(errorMessage = "An abort occurred.") {
    const trueProto = new.target.prototype;
    super(errorMessage);
    // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
    this.__proto__ = trueProto;
  }
}
/** Error thrown when the selected transport is unsupported by the browser. */
/** @private */
class UnsupportedTransportError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.UnsupportedTransportError}.
   *
   * @param {string} message A descriptive error message.
   * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
   */
  constructor(message, transport) {
    const trueProto = new.target.prototype;
    super(message);
    this.transport = transport;
    this.errorType = 'UnsupportedTransportError';
    // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
    this.__proto__ = trueProto;
  }
}
/** Error thrown when the selected transport is disabled by the browser. */
/** @private */
class DisabledTransportError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.DisabledTransportError}.
   *
   * @param {string} message A descriptive error message.
   * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
   */
  constructor(message, transport) {
    const trueProto = new.target.prototype;
    super(message);
    this.transport = transport;
    this.errorType = 'DisabledTransportError';
    // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
    this.__proto__ = trueProto;
  }
}
/** Error thrown when the selected transport cannot be started. */
/** @private */
class FailedToStartTransportError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.FailedToStartTransportError}.
   *
   * @param {string} message A descriptive error message.
   * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
   */
  constructor(message, transport) {
    const trueProto = new.target.prototype;
    super(message);
    this.transport = transport;
    this.errorType = 'FailedToStartTransportError';
    // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
    this.__proto__ = trueProto;
  }
}
/** Error thrown when the negotiation with the server failed to complete. */
/** @private */
class FailedToNegotiateWithServerError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.FailedToNegotiateWithServerError}.
   *
   * @param {string} message A descriptive error message.
   */
  constructor(message) {
    const trueProto = new.target.prototype;
    super(message);
    this.errorType = 'FailedToNegotiateWithServerError';
    // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
    this.__proto__ = trueProto;
  }
}
/** Error thrown when multiple errors have occurred. */
/** @private */
class AggregateErrors extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.AggregateErrors}.
   *
   * @param {string} message A descriptive error message.
   * @param {Error[]} innerErrors The collection of errors this error is aggregating.
   */
  constructor(message, innerErrors) {
    const trueProto = new.target.prototype;
    super(message);
    this.innerErrors = innerErrors;
    // Workaround issue in Typescript compiler
    // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
    this.__proto__ = trueProto;
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_layout_layouts_main-layout_main-layout_component_ts.js.map