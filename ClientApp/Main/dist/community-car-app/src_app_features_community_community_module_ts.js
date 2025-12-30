"use strict";
(self["webpackChunkcommunity_car_app"] = self["webpackChunkcommunity_car_app"] || []).push([["src_app_features_community_community_module_ts"],{

/***/ 2055:
/*!******************************************************************************************!*\
  !*** ./src/app/features/community/components/community-feed/community-feed.component.ts ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommunityFeedComponent: () => (/* binding */ CommunityFeedComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _story_list_story_list_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../story-list/story-list.component */ 9747);
/* harmony import */ var _create_post_create_post_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../create-post/create-post.component */ 3761);
/* harmony import */ var _post_list_post_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../post-list/post-list.component */ 3549);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);





class CommunityFeedComponent {
  static {
    this.ɵfac = function CommunityFeedComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CommunityFeedComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: CommunityFeedComponent,
      selectors: [["app-community-feed"]],
      decls: 5,
      vars: 0,
      consts: [[1, "flex-1", "min-w-0", "py-6"], [1, "max-w-[680px]", "mx-auto", "space-y-4"]],
      template: function CommunityFeedComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "app-story-list")(3, "app-create-post")(4, "app-post-list");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _story_list_story_list_component__WEBPACK_IMPORTED_MODULE_0__.StoryListComponent, _create_post_create_post_component__WEBPACK_IMPORTED_MODULE_1__.CreatePostComponent, _post_list_post_list_component__WEBPACK_IMPORTED_MODULE_2__.PostListComponent],
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
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " No posts found. Be the first to share something! ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
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
      decls: 4,
      vars: 3,
      consts: [[1, "space-y-6"], ["class", "fb-card p-4 animate-pulse space-y-4 mb-6", 4, "ngIf"], [3, "post", 4, "ngFor", "ngForOf"], ["class", "text-center py-10 text-muted-foreground", 4, "ngIf"], [1, "fb-card", "p-4", "animate-pulse", "space-y-4", "mb-6"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "bg-muted", "rounded-full"], [1, "flex-1", "space-y-2"], [1, "h-3", "bg-muted", "rounded", "w-1/4"], [1, "h-2", "bg-muted", "rounded", "w-1/6"], [1, "space-y-2"], [1, "h-3", "bg-muted", "rounded", "w-full"], [1, "h-3", "bg-muted", "rounded", "w-5/6"], [1, "h-64", "bg-muted", "rounded-xl"], [3, "post"], [1, "text-center", "py-10", "text-muted-foreground"]],
      template: function PostListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, PostListComponent_div_1_Template, 10, 0, "div", 1)(2, PostListComponent_app_post_item_2_Template, 1, 1, "app-post-item", 2)(3, PostListComponent_div_3_Template, 2, 0, "div", 3);
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
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _post_item_post_item_component__WEBPACK_IMPORTED_MODULE_0__.PostItemComponent],
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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);


class CreatePostComponent {
  static {
    this.ɵfac = function CreatePostComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CreatePostComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CreatePostComponent,
      selectors: [["app-create-post"]],
      decls: 18,
      vars: 0,
      consts: [[1, "fb-card", "p-4", "shadow-md", "border-primary/5", "mb-6"], [1, "flex", "gap-3", "mb-4"], [1, "w-10", "h-10", "rounded-full", "bg-primary/10", "flex", "items-center", "justify-center", "text-primary", "font-black", "border", "border-primary/20"], [1, "flex-1", "bg-[#f0f2f5]", "dark:bg-[#3a3b3c]", "rounded-full", "px-4", "flex", "items-center", "cursor-pointer", "hover:bg-[#e4e6e9]", "dark:hover:bg-[#4e4f50]", "transition-colors", "group"], [1, "text-sm", "text-muted-foreground", "group-hover:text-foreground/80", "transition-colors"], [1, "border-border/50", "mx-2"], [1, "flex", "mt-3"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-2", "rounded-xl", "hover:bg-accent", "transition-all", "text-sm", "font-bold", "text-muted-foreground", "group"], [1, "fa-solid", "fa-video", "text-red-500", "scale-110", "group-hover:scale-125", "transition-transform"], [1, "fa-solid", "fa-images", "text-emerald-500", "scale-110", "group-hover:scale-125", "transition-transform"], [1, "fa-solid", "fa-face-smile", "text-amber-500", "scale-110", "group-hover:scale-125", "transition-transform"]],
      template: function CreatePostComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "JD");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3)(5, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "What's on your mind, John?");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "hr", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 6)(9, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "i", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, " Live video ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Photo/video ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "i", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " Feeling/activity ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule],
      encapsulation: 2
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
  apiUrl: 'http://localhost:5000/api',
  hubUrl: 'http://localhost:5000/hubs'
};

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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);



function PostItemComponent_img_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 27);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r0.post.userProfileImageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
  }
}
function PostItemComponent_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.post.userFirstName[0]);
  }
}
function PostItemComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.post.title);
  }
}
function PostItemComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Full View ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r0.post.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
  }
}
class PostItemComponent {
  static {
    this.ɵfac = function PostItemComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PostItemComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: PostItemComponent,
      selectors: [["app-post-item"]],
      inputs: {
        post: "post"
      },
      decls: 40,
      vars: 13,
      consts: [[1, "fb-card", "shadow-lg", "border-primary/5", "group/post", "mb-6"], [1, "p-4", "pb-2", "flex", "items-center", "justify-between"], [1, "flex", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-primary/10", "border-2", "border-primary/20", "flex", "items-center", "justify-center", "font-black", "text-primary", "overflow-hidden"], ["class", "w-full h-full object-cover", 3, "src", 4, "ngIf"], [4, "ngIf"], [1, "text-sm", "font-black", "hover:underline", "cursor-pointer"], [1, "flex", "items-center", "gap-1", "text-[10px]", "font-bold", "text-muted-foreground", "uppercase", "tracking-widest"], [1, "fa-solid", "fa-earth-africa"], [1, "w-9", "h-9", "rounded-full", "hover:bg-accent", "flex", "items-center", "justify-center", "text-muted-foreground", "transition-all"], [1, "fa-solid", "fa-ellipsis"], ["class", "px-4 py-2 font-bold text-lg", 4, "ngIf"], [1, "px-4", "py-3", "text-[15px]", "leading-relaxed"], ["class", "relative bg-muted h-[450px] flex items-center justify-center overflow-hidden cursor-pointer", 4, "ngIf"], [1, "px-4", "py-3"], [1, "flex", "items-center", "justify-between", "text-xs", "text-muted-foreground", "border-b", "border-border/30", "pb-4", "mb-1"], [1, "flex", "items-center", "-space-x-1"], [1, "flex", "items-center", "justify-center", "w-6", "h-6", "bg-primary", "rounded-full", "text-white", "border-2", "border-white", "dark:border-[#18191a]", "z-20", "shadow-sm"], [1, "fa-solid", "fa-thumbs-up", "text-[10px]"], [1, "ml-2", "font-bold", "text-foreground/70"], [1, "font-bold", "hover:underline", "cursor-pointer"], [1, "flex", "gap-1", "py-1"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "rounded-xl", "hover:bg-accent", "transition-all", "text-sm", "font-black", "text-primary", "group/like"], [1, "fa-solid", "fa-thumbs-up", "scale-110", "group-hover/like:scale-125", "transition-transform", "group-active/like:scale-90"], [1, "flex-1", "flex", "items-center", "justify-center", "gap-2", "py-2.5", "rounded-xl", "hover:bg-accent", "transition-all", "text-sm", "font-black", "text-muted-foreground", "group"], [1, "fa-solid", "fa-comment", "scale-110", "group-hover:scale-125", "transition-transform"], [1, "fa-solid", "fa-share", "scale-110", "group-hover:scale-125", "transition-transform"], [1, "w-full", "h-full", "object-cover", 3, "src"], [1, "px-4", "py-2", "font-bold", "text-lg"], [1, "relative", "bg-muted", "h-[450px]", "flex", "items-center", "justify-center", "overflow-hidden", "cursor-pointer"], [1, "w-full", "h-full", "object-cover", "transition-transform", "duration-700", "group-hover/post:scale-105", 3, "src"], [1, "absolute", "bottom-4", "right-4", "bg-black/50", "backdrop-blur-md", "text-white", "text-[10px]", "font-bold", "px-3", "py-1.5", "rounded-full", "uppercase", "tracking-tighter", "shadow-xl"]],
      template: function PostItemComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, PostItemComponent_img_4_Template, 1, 1, "img", 4)(5, PostItemComponent_span_5_Template, 2, 1, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div")(7, "h4", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 7)(10, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](12, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, " \u2022 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "i", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "i", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](17, PostItemComponent_div_17_Template, 2, 1, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](20, PostItemComponent_div_20_Template, 4, 1, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 14)(22, "div", 15)(23, "div", 16)(24, "span", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "i", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "span", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 21)(31, "button", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](32, "i", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, " Like ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "button", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](35, "i", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, " Comment ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "button", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](38, "i", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, " Share ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.post.userProfileImageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.post.userProfileImageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", ctx.post.userFirstName, " ", ctx.post.userLastName, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](12, 10, ctx.post.createdAt, "short"));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.post.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.post.content, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.post.imageUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.post.likesCount, " people like this");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.post.commentsCount, " comments");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DatePipe],
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

/***/ 9353:
/*!********************************************************!*\
  !*** ./src/app/features/community/community.module.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommunityModule: () => (/* binding */ CommunityModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _components_community_feed_community_feed_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/community-feed/community-feed.component */ 2055);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);





const routes = [{
  path: '',
  component: _components_community_feed_community_feed_component__WEBPACK_IMPORTED_MODULE_0__.CommunityFeedComponent
}];
class CommunityModule {
  static {
    this.ɵfac = function CommunityModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CommunityModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: CommunityModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes), _components_community_feed_community_feed_component__WEBPACK_IMPORTED_MODULE_0__.CommunityFeedComponent // Import standalone component
      , _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](CommunityModule, {
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _components_community_feed_community_feed_component__WEBPACK_IMPORTED_MODULE_0__.CommunityFeedComponent // Import standalone component
    ],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
  });
})();

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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);



const _c0 = () => [1, 2, 3, 4];
function StoryListComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "i", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const i_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" U", i_r1, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
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
      decls: 10,
      vars: 2,
      consts: [[1, "flex", "gap-2", "py-2", "overflow-x-auto", "no-scrollbar", "mb-6"], [1, "flex-shrink-0", "w-28", "h-48", "bg-white", "dark:bg-[#18191a]", "rounded-xl", "border", "border-border/50", "shadow-sm", "relative", "cursor-pointer", "overflow-hidden", "group"], [1, "h-[70%]", "bg-muted/50", "flex", "items-center", "justify-center", "group-hover:scale-110", "transition-transform", "duration-500", "overflow-hidden"], [1, "fa-solid", "fa-image", "text-muted-foreground/30", "text-3xl"], [1, "absolute", "bottom-0", "left-0", "right-0", "h-[30%]", "bg-white", "dark:bg-[#18191a]", "flex", "flex-col", "items-center", "justify-center", "p-2", "z-10"], [1, "absolute", "-top-5", "w-10", "h-10", "rounded-full", "bg-primary", "border-4", "border-white", "dark:border-[#18191a]", "flex", "items-center", "justify-center", "text-white", "shadow-lg"], [1, "fa-solid", "fa-plus", "text-sm"], [1, "text-[11px]", "font-bold", "mt-3"], ["class", "flex-shrink-0 w-28 h-48 bg-muted rounded-xl border border-border shadow-sm relative cursor-pointer overflow-hidden group", 4, "ngFor", "ngForOf"], [1, "flex-shrink-0", "w-28", "h-48", "bg-muted", "rounded-xl", "border", "border-border", "shadow-sm", "relative", "cursor-pointer", "overflow-hidden", "group"], [1, "absolute", "inset-0", "bg-gradient-to-t", "from-black/60", "via-transparent", "to-transparent", "z-10"], [1, "absolute", "top-3", "left-3", "w-9", "h-9", "rounded-full", "border-4", "border-primary", "z-20", "overflow-hidden", "bg-primary/20", "flex", "items-center", "justify-center", "font-bold", "text-white", "text-[10px]"], [1, "absolute", "bottom-3", "left-3", "text-white", "text-[10px]", "font-bold", "z-20"], [1, "w-full", "h-full", "transition-transform", "duration-500", "group-hover:scale-110", "flex", "items-center", "justify-center", "bg-primary/5"], [1, "fa-solid", "fa-car", "text-primary/10", "text-4xl"]],
      template: function StoryListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "i", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 4)(5, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "i", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "span", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Create Story");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, StoryListComponent_div_9_Template, 8, 2, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf],
      encapsulation: 2
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_features_community_community_module_ts.js.map