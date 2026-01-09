"use strict";
(self["webpackChunkmedia_streaming_main_app"] = self["webpackChunkmedia_streaming_main_app"] || []).push([["default-src_app_features_community_components_community-feed_community-feed_component_ts"],{

/***/ 747:
/*!**********************************************************************************!*\
  !*** ./src/app/features/community/components/group-list/group-list.component.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GroupListComponent: () => (/* binding */ GroupListComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _group_card_group_card_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../group-card/group-card.component */ 5215);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/group.service */ 1549);






function GroupListComponent_app_group_card_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-group-card", 7);
  }
  if (rf & 2) {
    const group_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("group", group_r1);
  }
}
function GroupListComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "i", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "No groups available");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
class GroupListComponent {
  constructor(groupService) {
    this.groupService = groupService;
    this.groups = [];
  }
  ngOnInit() {
    this.groupService.getGroups(1, 4).subscribe(result => {
      this.groups = result.items;
    });
  }
  static {
    this.ɵfac = function GroupListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GroupListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_group_service__WEBPACK_IMPORTED_MODULE_1__.GroupService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: GroupListComponent,
      selectors: [["app-group-list"]],
      hostAttrs: [1, "block"],
      decls: 9,
      vars: 2,
      consts: [[1, "space-y-4"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-sm", "font-black", "uppercase", "tracking-widest", "text-primary"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-muted-foreground/60", "hover:text-primary"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [3, "group", 4, "ngFor", "ngForOf"], ["class", "fb-card p-10 text-center animate-pulse", 4, "ngIf"], [3, "group"], [1, "fb-card", "p-10", "text-center", "animate-pulse"], [1, "fa-solid", "fa-users", "text-4xl", "text-muted-foreground/20", "mb-3"], [1, "text-sm", "text-muted-foreground/60", "font-black", "uppercase", "tracking-widest"]],
      template: function GroupListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Suggested Groups");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "button", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "See All");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, GroupListComponent_app_group_card_7_Template, 1, 1, "app-group-card", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, GroupListComponent_div_8_Template, 4, 0, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.groups);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.groups.length === 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule, _group_card_group_card_component__WEBPACK_IMPORTED_MODULE_0__.GroupCardComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 1549:
/*!**************************************************************!*\
  !*** ./src/app/features/community/services/group.service.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GroupService: () => (/* binding */ GroupService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);



class GroupService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v2.0/community/groups`;
  }
  getGroups(pageNumber = 1, pageSize = 10) {
    return this.http.get(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  getGroup(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createGroup(request) {
    return this.http.post(this.apiUrl, request);
  }
  updateGroup(id, request) {
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }
  deleteGroup(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  joinGroup(id) {
    return this.http.post(`${this.apiUrl}/${id}/join`, {});
  }
  leaveGroup(id) {
    return this.http.post(`${this.apiUrl}/${id}/leave`, {});
  }
  getGroupMembers(id, pageNumber = 1, pageSize = 10) {
    return this.http.get(`${this.apiUrl}/${id}/members?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  getGroupPosts(id, pageNumber = 1, pageSize = 10) {
    return this.http.get(`${this.apiUrl}/${id}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  static {
    this.ɵfac = function GroupService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GroupService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: GroupService,
      factory: GroupService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 2055:
/*!******************************************************************************************!*\
  !*** ./src/app/features/community/components/community-feed/community-feed.component.ts ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommunityFeedComponent: () => (/* binding */ CommunityFeedComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _story_list_story_list_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../story-list/story-list.component */ 9747);
/* harmony import */ var _create_post_create_post_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../create-post/create-post.component */ 3761);
/* harmony import */ var _post_list_post_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../post-list/post-list.component */ 3549);
/* harmony import */ var _group_list_group_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../group-list/group-list.component */ 747);
/* harmony import */ var _review_list_review_list_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../review-list/review-list.component */ 8737);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 7580);







class CommunityFeedComponent {
  static {
    this.ɵfac = function CommunityFeedComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CommunityFeedComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
      type: CommunityFeedComponent,
      selectors: [["app-community-feed"]],
      decls: 7,
      vars: 0,
      consts: [[1, "flex-1", "min-w-0", "py-6"], [1, "w-full", "mx-auto", "space-y-6", "md:space-y-8"]],
      template: function CommunityFeedComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](2, "app-story-list")(3, "app-create-post")(4, "app-group-list")(5, "app-review-list")(6, "app-post-list");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _story_list_story_list_component__WEBPACK_IMPORTED_MODULE_0__.StoryListComponent, _create_post_create_post_component__WEBPACK_IMPORTED_MODULE_1__.CreatePostComponent, _post_list_post_list_component__WEBPACK_IMPORTED_MODULE_2__.PostListComponent, _group_list_group_list_component__WEBPACK_IMPORTED_MODULE_3__.GroupListComponent, _review_list_review_list_component__WEBPACK_IMPORTED_MODULE_4__.ReviewListComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 3549:
/*!********************************************************************************!*\
  !*** ./src/app/features/community/components/post-list/post-list.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PostListComponent: () => (/* binding */ PostListComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _post_item_post_item_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../post-item/post-item.component */ 8881);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_post_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/post.service */ 8920);






function PostListComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4)(1, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "div", 8)(5, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "div", 11)(8, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](9, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function PostListComponent_app_post_item_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-post-item", 14);
  }
  if (rf & 2) {
    const post_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("post", post_r1);
  }
}
function PostListComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 15)(1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "i", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "No posts available");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
class PostListComponent {
  constructor(postService) {
    this.postService = postService;
    this.posts = [];
    this.loading = true;
  }
  ngOnInit() {
    this.loadPosts();
  }
  loadPosts() {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: result => {
        this.posts = result.items;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading posts', err);
        this.loading = false;
        // Mock data if backend is not available for now to keep UI WOW
        this.posts = this.getMockPosts();
      }
    });
  }
  getMockPosts() {
    return [{
      id: '1',
      title: 'New Suspension Test',
      content: 'Testing the new @fully2car suspension system on the Sinai dunes today. The performance is beyond expectations! 🏜️🚗💨',
      userFirstName: 'Mahmoud',
      userLastName: 'Abdel Aziz',
      likesCount: 1240,
      commentsCount: 48,
      createdAt: new Date().toISOString(),
      type: 1,
      status: 1,
      viewsCount: 5000,
      userId: 'u1'
    }];
  }
  static {
    this.ɵfac = function PostListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PostListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_post_service__WEBPACK_IMPORTED_MODULE_1__.PostService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: PostListComponent,
      selectors: [["app-post-list"]],
      hostAttrs: [1, "block"],
      decls: 4,
      vars: 3,
      consts: [[1, "space-y-8"], ["class", "fb-card p-5 animate-pulse space-y-4 mb-6 border-primary/5", 4, "ngIf"], [3, "post", 4, "ngFor", "ngForOf"], ["class", "flex flex-col items-center justify-center py-20 mica-effect rounded-3xl border border-primary/5 mx-4 animate-in", 4, "ngIf"], [1, "fb-card", "p-5", "animate-pulse", "space-y-4", "mb-6", "border-primary/5"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "bg-secondary", "rounded-xl"], [1, "flex-1", "space-y-2"], [1, "h-3", "bg-secondary", "rounded-lg", "w-1/4"], [1, "h-2", "bg-secondary", "rounded-lg", "w-1/6"], [1, "space-y-3", "pt-2"], [1, "h-3", "bg-secondary", "rounded-lg", "w-full"], [1, "h-3", "bg-secondary", "rounded-lg", "w-5/6"], [1, "h-64", "bg-secondary/50", "rounded-2xl", "mt-4"], [3, "post"], [1, "flex", "flex-col", "items-center", "justify-center", "py-20", "mica-effect", "rounded-3xl", "border", "border-primary/5", "mx-4", "animate-in"], [1, "w-16", "h-16", "rounded-2xl", "bg-primary/10", "flex", "items-center", "justify-center", "text-primary", "mb-4"], [1, "fa-solid", "fa-cloud-moon", "text-2xl"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-muted-foreground/60"]],
      template: function PostListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, PostListComponent_div_1_Template, 10, 0, "div", 1)(2, PostListComponent_app_post_item_2_Template, 1, 1, "app-post-item", 2)(3, PostListComponent_div_3_Template, 5, 0, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.posts);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.posts.length === 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _post_item_post_item_component__WEBPACK_IMPORTED_MODULE_0__.PostItemComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 3761:
/*!************************************************************************************!*\
  !*** ./src/app/features/community/components/create-post/create-post.component.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreatePostComponent: () => (/* binding */ CreatePostComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _services_post_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/post.service */ 8920);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 8010);









function CreatePostComponent_div_1_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "img", 9);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("src", ctx_r1.currentUser.profileImageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
  }
}
function CreatePostComponent_div_1_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate2"]("", (ctx_r1.currentUser == null ? null : ctx_r1.currentUser.firstName == null ? null : ctx_r1.currentUser.firstName[0]) || "U", "", (ctx_r1.currentUser == null ? null : ctx_r1.currentUser.lastName == null ? null : ctx_r1.currentUser.lastName[0]) || "P", "");
  }
}
function CreatePostComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4)(1, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CreatePostComponent_div_1_img_2_Template, 1, 1, "img", 6)(3, CreatePostComponent_div_1_span_3_Template, 2, 2, "span", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CreatePostComponent_div_1_Template_div_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.toggleExpand());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.currentUser == null ? null : ctx_r1.currentUser.profileImageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !(ctx_r1.currentUser == null ? null : ctx_r1.currentUser.profileImageUrl));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" What's on your mind, ", (ctx_r1.currentUser == null ? null : ctx_r1.currentUser.firstName) || "User", "? ");
  }
}
function CreatePostComponent_form_2_span_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "Post");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CreatePostComponent_form_2_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "i", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Posting...");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CreatePostComponent_form_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "form", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function CreatePostComponent_form_2_Template_form_ngSubmit_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.onSubmit());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 11)(2, "h3", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Create Post");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CreatePostComponent_form_2_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.toggleExpand());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "i", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "input", 16)(8, "textarea", 17)(9, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "div", 19)(11, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](12, CreatePostComponent_form_2_span_12_Template, 2, 0, "span", 3)(13, CreatePostComponent_form_2_span_13_Template, 3, 0, "span", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx_r1.postForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r1.postForm.invalid || ctx_r1.isSubmitting);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.isSubmitting);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.isSubmitting);
  }
}
function CreatePostComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "hr", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 4)(3, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CreatePostComponent_div_3_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.toggleExpand());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "i", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, " Live Video ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CreatePostComponent_div_3_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.toggleExpand());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "i", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, " Photo/Video ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CreatePostComponent_div_3_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.toggleExpand());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](10, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, " Feeling/Activity ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
}
class CreatePostComponent {
  constructor(fb, postService, authService) {
    this.fb = fb;
    this.postService = postService;
    this.authService = authService;
    this.postCreated = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.isExpanded = false;
    this.isSubmitting = false;
    this.postForm = this.fb.group({
      title: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]],
      content: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]],
      imageUrl: [''],
      type: [0] // Default to standard post
    });
  }
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
  onSubmit() {
    if (this.postForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.postService.createPost(this.postForm.value).subscribe({
        next: result => {
          if (result.succeeded) {
            this.postCreated.emit(result.data);
            this.postForm.reset({
              type: 0
            });
            this.isExpanded = false;
          }
          this.isSubmitting = false;
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
  static {
    this.ɵfac = function CreatePostComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CreatePostComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_post_service__WEBPACK_IMPORTED_MODULE_0__.PostService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: CreatePostComponent,
      selectors: [["app-create-post"]],
      hostAttrs: [1, "block"],
      outputs: {
        postCreated: "postCreated"
      },
      decls: 4,
      vars: 3,
      consts: [[1, "fb-card", "p-5", "animate-in", "relative", "overflow-hidden"], ["class", "flex gap-3", 4, "ngIf"], ["class", "space-y-4", 3, "formGroup", "ngSubmit", 4, "ngIf"], [4, "ngIf"], [1, "flex", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-gradient-to-tr", "from-primary/20", "to-primary/5", "flex", "items-center", "justify-center", "text-primary", "font-black", "border", "border-primary/10", "shadow-sm", "overflow-hidden"], ["class", "w-full h-full object-cover", 3, "src", 4, "ngIf"], [1, "flex-1", "bg-secondary/40", "rounded-xl", "px-4", "flex", "items-center", "cursor-pointer", "hover:bg-secondary/60", "hover:shadow-inner", "transition-all", "duration-300", "group", "border", "border-transparent", "hover:border-border/20", 3, "click"], [1, "text-sm", "text-muted-foreground/80", "group-hover:text-foreground", "transition-colors"], [1, "w-full", "h-full", "object-cover", 3, "src"], [1, "space-y-4", 3, "ngSubmit", "formGroup"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-sm", "font-black", "uppercase", "tracking-widest", "text-primary"], ["type", "button", 1, "text-muted-foreground", "hover:text-primary", "transition-colors", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "space-y-3"], ["formControlName", "title", "type", "text", "placeholder", "What's the title of your post?", 1, "w-full", "bg-secondary/20", "border-border/10", "rounded-xl", "px-4", "py-3", "text-sm", "focus:ring-2", "focus:ring-primary/20", "focus:border-primary/30", "outline-none", "transition-all"], ["formControlName", "content", "rows", "4", "placeholder", "Share your thoughts...", 1, "w-full", "bg-secondary/20", "border-border/10", "rounded-xl", "px-4", "py-3", "text-sm", "focus:ring-2", "focus:ring-primary/20", "focus:border-primary/30", "outline-none", "transition-all", "resize-none"], ["formControlName", "imageUrl", "type", "text", "placeholder", "Add an image URL (optional)", 1, "w-full", "bg-secondary/20", "border-border/10", "rounded-xl", "px-4", "py-3", "text-sm", "focus:ring-2", "focus:ring-primary/20", "focus:border-primary/30", "outline-none", "transition-all"], [1, "flex", "gap-3", "pt-2"], ["type", "submit", 1, "flex-1", "bg-primary", "text-white", "font-black", "py-3", "rounded-xl", "hover:bg-primary/90", "transition-all", "disabled:opacity-50", "disabled:cursor-not-allowed", "shadow-lg", "shadow-primary/20", "uppercase", "tracking-widest", "text-[11px]", 3, "disabled"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "mr-2"], [1, "border-border/20", "mx-2", "my-4"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "rounded-xl", "hover:bg-red-500/5", "transition-all", "text-[11px]", "font-black", "uppercase", "tracking-widest", "text-muted-foreground/70", "hover:text-red-500", "group", 3, "click"], [1, "fa-solid", "fa-video", "text-red-500", "scale-110", "group-hover:scale-125", "transition-transform"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "rounded-xl", "hover:bg-emerald-500/5", "transition-all", "text-[11px]", "font-black", "uppercase", "tracking-widest", "text-muted-foreground/70", "hover:text-emerald-500", "group", 3, "click"], [1, "fa-solid", "fa-images", "text-emerald-500", "scale-110", "group-hover:scale-125", "transition-transform"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "rounded-xl", "hover:bg-amber-500/5", "transition-all", "text-[11px]", "font-black", "uppercase", "tracking-widest", "text-muted-foreground/70", "hover:text-amber-500", "group", 3, "click"], [1, "fa-solid", "fa-face-smile", "text-amber-500", "scale-110", "group-hover:scale-125", "transition-transform"]],
      template: function CreatePostComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CreatePostComponent_div_1_Template, 7, 3, "div", 1)(2, CreatePostComponent_form_2_Template, 14, 4, "form", 2)(3, CreatePostComponent_div_3_Template, 12, 0, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.isExpanded);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isExpanded);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.isExpanded);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 5215:
/*!**********************************************************************************!*\
  !*** ./src/app/features/community/components/group-card/group-card.component.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GroupCardComponent: () => (/* binding */ GroupCardComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/group.service */ 1549);





function GroupCardComponent_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 14);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r0.group.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
  }
}
function GroupCardComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "i", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class GroupCardComponent {
  constructor(groupService) {
    this.groupService = groupService;
  }
  joinGroup() {
    this.groupService.joinGroup(this.group.id).subscribe(result => {
      if (result.succeeded) {
        // Update state or emit event
        this.group.membersCount++;
      }
    });
  }
  static {
    this.ɵfac = function GroupCardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GroupCardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_group_service__WEBPACK_IMPORTED_MODULE_0__.GroupService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: GroupCardComponent,
      selectors: [["app-group-card"]],
      hostAttrs: [1, "block"],
      inputs: {
        group: "group"
      },
      decls: 20,
      vars: 6,
      consts: [[1, "fb-card", "group/card", "overflow-hidden", "transition-all", "duration-500", "hover:shadow-2xl", "hover:shadow-primary/10"], [1, "relative", "h-32", "overflow-hidden", "bg-secondary/20"], ["class", "w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110", 3, "src", 4, "ngIf"], ["class", "w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5", 4, "ngIf"], [1, "absolute", "top-3", "right-3"], [1, "mica-effect", "px-3", "py-1", "rounded-lg", "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-primary", "border", "border-primary/20"], [1, "p-5"], [1, "font-black", "text-lg", "mb-1", "group-hover/card:text-primary", "transition-colors", "truncate"], [1, "text-sm", "text-muted-foreground/80", "line-clamp-2", "mb-4", "h-10"], [1, "flex", "items-center", "justify-between", "pt-4", "border-t", "border-border/10"], [1, "flex", "flex-col"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-muted-foreground/60"], [1, "text-sm", "font-black"], [1, "bg-primary/10", "hover:bg-primary", "text-primary", "hover:text-white", "px-6", "py-2", "rounded-xl", "transition-all", "duration-300", "font-black", "text-xs", "uppercase", "tracking-widest", "shadow-lg", "shadow-primary/5", "hover:shadow-primary/20", 3, "click"], [1, "w-full", "h-full", "object-cover", "transition-transform", "duration-700", "group-hover/card:scale-110", 3, "src"], [1, "w-full", "h-full", "flex", "items-center", "justify-center", "bg-gradient-to-br", "from-primary/10", "to-primary/5"], [1, "fa-solid", "fa-users", "text-4xl", "text-primary/20"]],
      template: function GroupCardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, GroupCardComponent_img_2_Template, 1, 1, "img", 2)(3, GroupCardComponent_div_3_Template, 2, 0, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 4)(5, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 6)(8, "h3", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "p", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 9)(13, "div", 10)(14, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Members");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "button", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function GroupCardComponent_Template_button_click_18_listener() {
            return ctx.joinGroup();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, " Join ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.group.imageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.group.imageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.group.privacy === 0 ? "Public" : "Private", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx.group.name, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.group.description);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.group.membersCount);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__.TranslateModule],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 7042:
/*!***************************************************************!*\
  !*** ./src/app/features/community/services/review.service.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReviewService: () => (/* binding */ ReviewService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);



class ReviewService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v2.0/community/reviews`;
  }
  getReviews(pageNumber = 1, pageSize = 10, carBrand, carModel) {
    let url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (carBrand) url += `&carBrand=${carBrand}`;
    if (carModel) url += `&carModel=${carModel}`;
    return this.http.get(url);
  }
  getReview(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createReview(request) {
    return this.http.post(this.apiUrl, request);
  }
  markHelpful(id) {
    return this.http.post(`${this.apiUrl}/${id}/helpful`, {});
  }
  getCarReviews(brand, model, pageNumber = 1, pageSize = 10) {
    return this.http.get(`${this.apiUrl}/car/${brand}/${model}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  getUserReviews(userId, pageNumber = 1, pageSize = 10) {
    return this.http.get(`${this.apiUrl}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  static {
    this.ɵfac = function ReviewService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ReviewService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: ReviewService,
      factory: ReviewService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 8505:
/*!************************************************************************************!*\
  !*** ./src/app/features/community/components/review-item/review-item.component.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReviewItemComponent: () => (/* binding */ ReviewItemComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_review_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/review.service */ 7042);






function ReviewItemComponent_img_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 20);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r0.review.userProfileImageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
  }
}
function ReviewItemComponent_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", ctx_r0.review.userFirstName[0], "", ctx_r0.review.userLastName[0], "");
  }
}
function ReviewItemComponent_i_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "i", 21);
  }
}
function ReviewItemComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "i", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](4, 1, "main.community.reviews.verified"));
  }
}
function ReviewItemComponent_div_23_span_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("(", ctx_r0.review.carYear, ")");
  }
}
function ReviewItemComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 25)(1, "div", 26)(2, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "i", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div")(5, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Car");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, ReviewItemComponent_div_23_span_9_Template, 2, 1, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", ctx_r0.review.carBrand, " ", ctx_r0.review.carModel, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.review.carYear);
  }
}
class ReviewItemComponent {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }
  markHelpful() {
    this.reviewService.markHelpful(this.review.id).subscribe(result => {
      if (result.succeeded) {
        this.review.helpfulCount++;
      }
    });
  }
  getStars() {
    return Array(this.review.rating).fill(0);
  }
  static {
    this.ɵfac = function ReviewItemComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ReviewItemComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_review_service__WEBPACK_IMPORTED_MODULE_0__.ReviewService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ReviewItemComponent,
      selectors: [["app-review-item"]],
      hostAttrs: [1, "block"],
      inputs: {
        review: "review"
      },
      decls: 30,
      vars: 14,
      consts: [[1, "fb-card", "p-5", "animate-fade-in", "group/review", "relative"], [1, "flex", "items-start", "justify-between", "mb-4"], [1, "flex", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-gradient-to-tr", "from-primary/10", "to-primary/5", "flex", "items-center", "justify-center", "font-black", "text-primary", "overflow-hidden", "shadow-sm", "border", "border-primary/10"], ["class", "w-full h-full object-cover", 3, "src", 4, "ngIf"], [4, "ngIf"], [1, "text-sm", "font-black"], [1, "flex", "items-center", "gap-2", "mt-0.5"], [1, "flex", "text-[10px]", "text-amber-500"], ["class", "fa-solid fa-star", 4, "ngFor", "ngForOf"], [1, "text-[10px]", "text-muted-foreground/60"], [1, "text-[10px]", "font-black", "text-muted-foreground/60", "uppercase", "tracking-widest"], ["class", "flex items-center gap-1.5 bg-emerald-500/5 text-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-500/10 scale-90", 4, "ngIf"], [1, "mb-3"], [1, "font-black", "text-primary", "mb-1"], [1, "text-sm", "text-foreground/80", "leading-relaxed"], ["class", "mica-effect px-4 py-3 rounded-xl border border-primary/5 flex items-center justify-between mb-4 mt-2", 4, "ngIf"], [1, "flex", "items-center", "justify-between", "pt-4", "border-t", "border-border/10"], [1, "flex", "items-center", "gap-2", "px-4", "py-2", "rounded-xl", "hover:bg-primary/5", "transition-all", "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-foreground/70", "hover:text-primary", "border", "border-transparent", "hover:border-primary/10", 3, "click"], [1, "fa-solid", "fa-thumbs-up"], [1, "w-full", "h-full", "object-cover", 3, "src"], [1, "fa-solid", "fa-star"], [1, "flex", "items-center", "gap-1.5", "bg-emerald-500/5", "text-emerald-500", "px-3", "py-1.5", "rounded-lg", "border", "border-emerald-500/10", "scale-90"], [1, "fa-solid", "fa-circle-check", "text-[10px]"], [1, "text-[9px]", "font-black", "uppercase", "tracking-widest"], [1, "mica-effect", "px-4", "py-3", "rounded-xl", "border", "border-primary/5", "flex", "items-center", "justify-between", "mb-4", "mt-2"], [1, "flex", "items-center", "gap-3"], [1, "w-8", "h-8", "rounded-lg", "bg-primary/5", "flex", "items-center", "justify-center", "text-primary"], [1, "fa-solid", "fa-car", "text-xs"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-muted-foreground/60", "block", "leading-none", "mb-1"], [1, "text-xs", "font-black"], ["class", "text-muted-foreground/60", 4, "ngIf"], [1, "text-muted-foreground/60"]],
      template: function ReviewItemComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, ReviewItemComponent_img_4_Template, 1, 1, "img", 4)(5, ReviewItemComponent_span_5_Template, 2, 2, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div")(7, "h4", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 7)(10, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](11, ReviewItemComponent_i_11_Template, 1, 0, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "\u2022");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](16, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](17, ReviewItemComponent_div_17_Template, 5, 3, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "div", 13)(19, "h3", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "p", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, ReviewItemComponent_div_23_Template, 10, 3, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "div", 17)(25, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "button", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ReviewItemComponent_Template_button_click_27_listener() {
            return ctx.markHelpful();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](28, "i", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, " Helpful ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.review.userProfileImageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.review.userProfileImageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", ctx.review.userFirstName, " ", ctx.review.userLastName, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.getStars());
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](16, 11, ctx.review.createdAt, "shortDate"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.review.isVerified);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.review.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.review.content);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.review.carBrand);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.review.helpfulCount, " people found this helpful ");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__.TranslatePipe],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8737:
/*!************************************************************************************!*\
  !*** ./src/app/features/community/components/review-list/review-list.component.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReviewListComponent: () => (/* binding */ ReviewListComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _review_item_review_item_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../review-item/review-item.component */ 8505);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_review_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/review.service */ 7042);






function ReviewListComponent_app_review_item_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-review-item", 6);
  }
  if (rf & 2) {
    const review_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("review", review_r1);
  }
}
function ReviewListComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "i", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "p", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "No reviews available");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
class ReviewListComponent {
  constructor(reviewService) {
    this.reviewService = reviewService;
    this.reviews = [];
  }
  ngOnInit() {
    this.reviewService.getReviews(1, 3).subscribe(result => {
      this.reviews = result.items;
    });
  }
  static {
    this.ɵfac = function ReviewListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ReviewListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_review_service__WEBPACK_IMPORTED_MODULE_1__.ReviewService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: ReviewListComponent,
      selectors: [["app-review-list"]],
      hostAttrs: [1, "block"],
      decls: 9,
      vars: 2,
      consts: [[1, "space-y-4"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-sm", "font-black", "uppercase", "tracking-widest", "text-primary"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-muted-foreground/60", "hover:text-primary"], [3, "review", 4, "ngFor", "ngForOf"], ["class", "fb-card p-10 text-center border-dashed border-2 border-border/10", 4, "ngIf"], [3, "review"], [1, "fb-card", "p-10", "text-center", "border-dashed", "border-2", "border-border/10"], [1, "fa-solid", "fa-star-half-stroke", "text-4xl", "text-muted-foreground/20", "mb-3"], [1, "text-sm", "text-muted-foreground/60", "font-black", "uppercase", "tracking-widest"]],
      template: function ReviewListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Recent Reviews");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "button", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "See All");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, ReviewListComponent_app_review_item_7_Template, 1, 1, "app-review-item", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, ReviewListComponent_div_8_Template, 4, 0, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.reviews);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.reviews.length === 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule, _review_item_review_item_component__WEBPACK_IMPORTED_MODULE_0__.ReviewItemComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8881:
/*!********************************************************************************!*\
  !*** ./src/app/features/community/components/post-item/post-item.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PostItemComponent: () => (/* binding */ PostItemComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_post_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/post.service */ 8920);






function PostItemComponent_img_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 28);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r0.post.userProfileImageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
  }
}
function PostItemComponent_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", ctx_r0.post.userFirstName[0], "", ctx_r0.post.userLastName[0], "");
  }
}
function PostItemComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r0.post.title);
  }
}
function PostItemComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "img", 32)(2, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, " Performance View ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r0.post.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
  }
}
class PostItemComponent {
  constructor(postService) {
    this.postService = postService;
    this.isLiked = false;
    this.showComments = false;
    this.commentContent = '';
    this.isSubmittingComment = false;
  }
  ngOnInit() {
    // In a real app, we'd check if the current user has liked this post
    // For now, we'll initialize based on backend data if available
  }
  toggleLike() {
    if (this.isLiked) {
      this.postService.unlikePost(this.post.id).subscribe(result => {
        if (result.succeeded) {
          this.isLiked = false;
          this.post.likesCount--;
        }
      });
    } else {
      this.postService.likePost(this.post.id).subscribe(result => {
        if (result.succeeded) {
          this.isLiked = true;
          this.post.likesCount++;
        }
      });
    }
  }
  toggleComments() {
    this.showComments = !this.showComments;
  }
  submitComment() {
    if (this.commentContent.trim() && !this.isSubmittingComment) {
      this.isSubmittingComment = true;
      this.postService.addComment(this.post.id, this.commentContent).subscribe({
        next: result => {
          if (result.succeeded) {
            this.post.commentsCount++;
            this.commentContent = '';
          }
          this.isSubmittingComment = false;
        },
        error: () => {
          this.isSubmittingComment = false;
        }
      });
    }
  }
  static {
    this.ɵfac = function PostItemComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PostItemComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_services_post_service__WEBPACK_IMPORTED_MODULE_0__.PostService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: PostItemComponent,
      selectors: [["app-post-item"]],
      hostAttrs: [1, "block"],
      inputs: {
        post: "post"
      },
      decls: 40,
      vars: 17,
      consts: [[1, "fb-card", "border-primary/5", "group/post", "animate-fade-in", "shadow-xl", "shadow-primary/5"], [1, "p-4", "pb-2", "flex", "items-center", "justify-between"], [1, "flex", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-gradient-to-tr", "from-primary/10", "to-primary/5", "border", "border-primary/10", "flex", "items-center", "justify-center", "font-black", "text-primary", "overflow-hidden", "shadow-sm"], ["class", "w-full h-full object-cover", 3, "src", 4, "ngIf"], ["class", "text-xs", 4, "ngIf"], [1, "text-sm", "font-black", "hover:text-primary", "cursor-pointer", "transition-colors"], [1, "flex", "items-center", "gap-1", "text-[10px]", "font-black", "text-muted-foreground/60", "uppercase", "tracking-widest"], [1, "fa-solid", "fa-earth-africa", "opacity-70"], [1, "w-9", "h-9", "rounded-xl", "hover:bg-primary/5", "flex", "items-center", "justify-center", "text-muted-foreground/60", "hover:text-primary", "transition-all"], [1, "fa-solid", "fa-ellipsis"], ["class", "px-5 py-2 font-black text-lg tracking-tight", 4, "ngIf"], [1, "px-5", "py-3", "text-[15px]", "leading-relaxed", "font-medium", "text-foreground/80"], ["class", "relative bg-secondary/20 h-[480px] flex items-center justify-center overflow-hidden cursor-pointer group/image", 4, "ngIf"], [1, "px-4", "py-3"], [1, "flex", "items-center", "justify-between", "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-muted-foreground/60", "border-b", "border-border/20", "pb-5", "mb-4"], [1, "flex", "items-center", "-space-x-2"], [1, "flex", "items-center", "justify-center", "w-7", "h-7", "bg-primary", "rounded-lg", "text-white", "border-2", "border-background", "z-20", "shadow-lg", "shadow-primary/20", "overflow-hidden"], [1, "fa-solid", "fa-thumbs-up", "text-[10px]"], [1, "ml-4", "font-black", "text-foreground/70"], [1, "hover:text-primary", "cursor-pointer", "transition-colors"], [1, "flex", "gap-4", "py-1"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-3", "rounded-xl", "hover:bg-primary/5", "transition-all", "text-[11px]", "font-black", "uppercase", "tracking-widest", "text-foreground/70", "hover:text-primary", "group/like", 3, "click"], [1, "fa-solid", "fa-thumbs-up", "scale-110", "group-hover/like:rotate-[-10deg]", "transition-transform"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-3", "rounded-xl", "hover:bg-primary/5", "transition-all", "text-[11px]", "font-black", "uppercase", "tracking-widest", "text-foreground/70", "hover:text-primary", "group/comment", 3, "click"], [1, "fa-solid", "fa-comment", "scale-110", "group-hover/comment:scale-125", "transition-transform"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-3", "rounded-xl", "hover:bg-primary/5", "transition-all", "text-[11px]", "font-black", "uppercase", "tracking-widest", "text-foreground/70", "hover:text-primary", "group/share"], [1, "fa-solid", "fa-share", "scale-110", "group-hover/share:translate-x-1", "transition-transform"], [1, "w-full", "h-full", "object-cover", 3, "src"], [1, "text-xs"], [1, "px-5", "py-2", "font-black", "text-lg", "tracking-tight"], [1, "relative", "bg-secondary/20", "h-[480px]", "flex", "items-center", "justify-center", "overflow-hidden", "cursor-pointer", "group/image"], [1, "w-full", "h-full", "object-cover", "transition-transform", "duration-1000", "group-hover/image:scale-105", 3, "src"], [1, "absolute", "inset-0", "bg-gradient-to-t", "from-black/40", "via-transparent", "to-transparent", "opacity-0", "group-hover/image:opacity-100", "transition-opacity", "duration-500"], [1, "absolute", "bottom-4", "right-4", "mica-effect", "text-white", "text-[10px]", "font-black", "px-4", "py-2", "rounded-xl", "uppercase", "tracking-widest", "shadow-2xl", "scale-90", "group-hover/image:scale-100", "transition-transform", "duration-500"]],
      template: function PostItemComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, PostItemComponent_img_4_Template, 1, 1, "img", 4)(5, PostItemComponent_span_5_Template, 2, 2, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div")(7, "h4", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 7)(10, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](12, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, " \u2022 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "i", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](16, "i", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](17, PostItemComponent_div_17_Template, 2, 1, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](20, PostItemComponent_div_20_Template, 5, 1, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "div", 14)(22, "div", 15)(23, "div", 16)(24, "span", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](25, "i", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "span", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "div", 21)(31, "button", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PostItemComponent_Template_button_click_31_listener() {
            return ctx.toggleLike();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](32, "i", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, " Like ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "button", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PostItemComponent_Template_button_click_34_listener() {
            return ctx.toggleComments();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](35, "i", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, " Comment ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "button", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](38, "i", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](39, " Share ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.post.userProfileImageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.post.userProfileImageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", ctx.post.userFirstName, " ", ctx.post.userLastName, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind2"](12, 14, ctx.post.createdAt, "short"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.post.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.post.content, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.post.imageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx.post.likesCount, " likes");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx.post.commentsCount, " comments");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("text-primary", ctx.isLiked);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("fa-bounce", ctx.isLiked);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormsModule],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8920:
/*!*************************************************************!*\
  !*** ./src/app/features/community/services/post.service.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PostService: () => (/* binding */ PostService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);



class PostService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v2.0/community/posts`;
  }
  getPosts(pageNumber = 1, pageSize = 10, groupId) {
    let url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (groupId) {
      url += `&groupId=${groupId}`;
    }
    return this.http.get(url);
  }
  getPost(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createPost(request) {
    return this.http.post(this.apiUrl, request);
  }
  likePost(id) {
    return this.http.post(`${this.apiUrl}/${id}/like`, {});
  }
  unlikePost(id) {
    return this.http.delete(`${this.apiUrl}/${id}/like`);
  }
  addComment(id, content) {
    return this.http.post(`${this.apiUrl}/${id}/comments`, {
      content
    });
  }
  deletePost(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updatePost(id, request) {
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }
  reportPost(id, reason, description) {
    return this.http.post(`${this.apiUrl}/${id}/report`, {
      reason,
      description
    });
  }
  getPostComments(id, pageNumber = 1, pageSize = 10) {
    return this.http.get(`${this.apiUrl}/${id}/comments?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  static {
    this.ɵfac = function PostService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PostService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: PostService,
      factory: PostService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 9747:
/*!**********************************************************************************!*\
  !*** ./src/app/features/community/components/story-list/story-list.component.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StoryListComponent: () => (/* binding */ StoryListComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);




const _c0 = () => [1, 2, 3, 4, 5];
function StoryListComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 12)(2, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "img", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 16)(6, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "2h ago");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const i_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("User ", i_r1, "");
  }
}
class StoryListComponent {
  static {
    this.ɵfac = function StoryListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || StoryListComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: StoryListComponent,
      selectors: [["app-story-list"]],
      decls: 12,
      vars: 2,
      consts: [[1, "flex", "gap-3", "overflow-x-auto", "pb-6", "custom-scroll", "animate-fade-in"], [1, "flex-shrink-0", "w-32", "h-52", "rounded-2xl", "bg-card", "border", "border-border/40", "overflow-hidden", "cursor-pointer", "relative", "group/story", "shadow-sm", "hover:shadow-primary/10", "transition-all", "duration-300"], [1, "h-3/5", "overflow-hidden", "relative"], [1, "w-full", "h-full", "bg-secondary/30", "flex", "items-center", "justify-center", "transition-transform", "duration-700", "group-hover/story:scale-110"], [1, "fa-solid", "fa-plus", "text-3xl", "text-primary", "animate-pulse"], [1, "absolute", "inset-0", "bg-gradient-to-t", "from-black/20", "to-transparent", "opacity-0", "group-hover/story:opacity-100", "transition-opacity"], [1, "h-2/5", "flex", "items-center", "justify-center", "relative", "p-2"], [1, "absolute", "-top-5", "w-10", "h-10", "rounded-full", "bg-primary", "border-4", "border-background", "flex", "items-center", "justify-center", "text-white", "shadow-xl", "group-hover/story:scale-110", "transition-transform"], [1, "fa-solid", "fa-plus", "text-sm"], [1, "text-[10px]", "font-black", "uppercase", "tracking-widest", "text-center", "mt-4"], ["class", "flex-shrink-0 w-32 h-52 rounded-2xl bg-card border border-border/40 overflow-hidden cursor-pointer relative group/item shadow-sm hover:shadow-xl transition-all duration-500", 4, "ngFor", "ngForOf"], [1, "flex-shrink-0", "w-32", "h-52", "rounded-2xl", "bg-card", "border", "border-border/40", "overflow-hidden", "cursor-pointer", "relative", "group/item", "shadow-sm", "hover:shadow-xl", "transition-all", "duration-500"], ["src", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400", 1, "w-full", "h-full", "object-cover", "group-hover/item:scale-110", "transition-transform", "duration-1000"], [1, "absolute", "inset-0", "bg-gradient-to-b", "from-black/40", "via-transparent", "to-black/80", "group-hover/item:from-black/60", "transition-colors"], [1, "absolute", "top-3", "left-3", "w-9", "h-9", "rounded-xl", "border", "border-primary/50", "overflow-hidden", "shadow-lg", "shadow-primary/20", "p-[1px]", "bg-primary/20", "backdrop-blur-md", "transition-transform", "group-hover/item:scale-110"], ["src", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", 1, "w-full", "h-full", "object-cover", "rounded-lg"], [1, "absolute", "bottom-3", "left-3", "flex", "flex-col", "gap-0.5"], [1, "text-white", "text-[10px]", "font-black", "uppercase", "tracking-[0.1em]", "drop-shadow-md"], [1, "text-white/60", "text-[8px]", "font-bold", "uppercase", "tracking-wider", "drop-shadow-md"]],
      template: function StoryListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "i", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 6)(7, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "i", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "Create Story");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, StoryListComponent_div_11_Template, 10, 1, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__.TranslateModule],
      encapsulation: 2
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=default-src_app_features_community_components_community-feed_community-feed_component_ts.js.map