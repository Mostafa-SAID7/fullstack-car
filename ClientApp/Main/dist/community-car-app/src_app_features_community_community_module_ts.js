"use strict";
(self["webpackChunkcommunity_car_app"] = self["webpackChunkcommunity_car_app"] || []).push([["src_app_features_community_community_module_ts"],{

/***/ 409:
/*!**********************************************************************************!*\
  !*** ./src/app/features/community/components/guide-card/guide-card.component.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GuideCardComponent: () => (/* binding */ GuideCardComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 8503);
/* harmony import */ var _models_guide_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/guide.model */ 9466);








const _c0 = a0 => ["/community/guides", a0];
function GuideCardComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "i", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Featured");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function GuideCardComponent_img_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 21);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r0.guide.thumbnailUrl, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"])("alt", ctx_r0.guide.title);
  }
}
function GuideCardComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "i", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function GuideCardComponent_div_12_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tag_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", tag_r2, " ");
  }
}
function GuideCardComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, GuideCardComponent_div_12_span_1_Template, 2, 1, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r0.guide.tags.slice(0, 3));
  }
}
function GuideCardComponent_img_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 21);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r0.guide.authorAvatar, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"])("alt", ctx_r0.guide.authorName);
  }
}
function GuideCardComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r0.guide.authorName.charAt(0).toUpperCase(), " ");
  }
}
function GuideCardComponent_span_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "i", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r0.guide.averageRating.toFixed(1), " ");
  }
}
class GuideCardComponent {
  constructor() {
    this.bookmarkClick = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
  }
  getDifficultyColor(difficulty) {
    switch (difficulty) {
      case _models_guide_model__WEBPACK_IMPORTED_MODULE_0__.GuideDifficulty.Beginner:
        return 'difficulty-beginner';
      case _models_guide_model__WEBPACK_IMPORTED_MODULE_0__.GuideDifficulty.Intermediate:
        return 'difficulty-intermediate';
      case _models_guide_model__WEBPACK_IMPORTED_MODULE_0__.GuideDifficulty.Advanced:
        return 'difficulty-advanced';
      case _models_guide_model__WEBPACK_IMPORTED_MODULE_0__.GuideDifficulty.Expert:
        return 'difficulty-expert';
      default:
        return '';
    }
  }
  formatReadTime(minutes) {
    if (minutes < 60) {
      return `${minutes} min read`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  onBookmarkClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.bookmarkClick.emit(this.guide);
  }
  static {
    this.ɵfac = function GuideCardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GuideCardComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: GuideCardComponent,
      selectors: [["app-guide-card"]],
      inputs: {
        guide: "guide"
      },
      outputs: {
        bookmarkClick: "bookmarkClick"
      },
      decls: 30,
      vars: 22,
      consts: [[1, "guide-card", 3, "routerLink"], ["class", "guide-card__featured", 4, "ngIf"], [1, "guide-card__media"], [3, "src", "alt", 4, "ngIf"], ["class", "guide-card__media-placeholder", 4, "ngIf"], [1, "guide-card__difficulty", 3, "ngClass"], [1, "guide-card__content"], [1, "guide-card__title"], [1, "guide-card__summary"], ["class", "guide-card__tags", 4, "ngIf"], [1, "guide-card__footer"], [1, "guide-card__author"], ["class", "author-avatar-placeholder", 4, "ngIf"], [1, "guide-card__meta"], [1, "meta-item"], [1, "fa-regular", "fa-clock"], ["class", "meta-item", 4, "ngIf"], [1, "fa-regular", "fa-eye"], [1, "meta-item", "bookmark-btn", 3, "click"], [1, "guide-card__featured"], [1, "fa-solid", "fa-star"], [3, "src", "alt"], [1, "guide-card__media-placeholder"], [1, "fa-solid", "fa-book"], [1, "guide-card__tags"], ["class", "tag", 4, "ngFor", "ngForOf"], [1, "tag"], [1, "author-avatar-placeholder"]],
      template: function GuideCardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "a", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, GuideCardComponent_div_1_Template, 4, 0, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, GuideCardComponent_img_3_Template, 1, 2, "img", 3)(4, GuideCardComponent_div_4_Template, 2, 0, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 6)(8, "h3", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "p", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](12, GuideCardComponent_div_12_Template, 2, 1, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 10)(14, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](15, GuideCardComponent_img_15_Template, 1, 2, "img", 3)(16, GuideCardComponent_div_16_Template, 2, 1, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "div", 13)(20, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "i", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, GuideCardComponent_span_23_Template, 3, 1, "span", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](25, "i", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "button", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function GuideCardComponent_Template_button_click_27_listener($event) {
            return ctx.onBookmarkClick($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](28, "i");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](20, _c0, ctx.guide.id));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.guide.isFeatured);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.guide.thumbnailUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.guide.thumbnailUrl);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.getDifficultyColor(ctx.guide.difficulty));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.guide.difficultyName, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.guide.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.guide.summary);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.guide.tags && ctx.guide.tags.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.guide.authorAvatar);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.guide.authorAvatar);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.guide.authorName);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.formatReadTime(ctx.guide.estimatedReadTime), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.guide.averageRating > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.guide.viewCount, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("bookmarked", ctx.guide.isBookmarked);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMap"](ctx.guide.isBookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.guide.bookmarkCount, " ");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule],
      styles: [".guide-card[_ngcontent-%COMP%] {\n  display: block;\n  background: var(--card-background, #ffffff);\n  border-radius: 16px;\n  overflow: hidden;\n  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  text-decoration: none;\n  color: inherit;\n  position: relative;\n}\n.guide-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-8px);\n  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);\n  border-color: var(--primary-color, #007bff);\n}\n.guide-card__featured[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 12px;\n  left: 12px;\n  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);\n  color: #000;\n  padding: 6px 12px;\n  border-radius: 20px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  z-index: 2;\n  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);\n}\n.guide-card__featured[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.guide-card__media[_ngcontent-%COMP%] {\n  position: relative;\n  height: 200px;\n  overflow: hidden;\n  background: linear-gradient(135deg, rgba(0, 123, 255, 0.05) 0%, rgba(0, 123, 255, 0.1) 100%);\n}\n.guide-card__media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.5s;\n}\n.guide-card__media-placeholder[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 64px;\n  color: rgba(0, 123, 255, 0.2);\n}\n.guide-card[_ngcontent-%COMP%]:hover   .guide-card__media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  transform: scale(1.1);\n}\n.guide-card__difficulty[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 12px;\n  right: 12px;\n  padding: 6px 12px;\n  border-radius: 20px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.guide-card__difficulty.difficulty-beginner[_ngcontent-%COMP%] {\n  background: rgba(76, 175, 80, 0.9);\n  color: white;\n}\n.guide-card__difficulty.difficulty-intermediate[_ngcontent-%COMP%] {\n  background: rgba(255, 193, 7, 0.9);\n  color: #000;\n}\n.guide-card__difficulty.difficulty-advanced[_ngcontent-%COMP%] {\n  background: rgba(255, 152, 0, 0.9);\n  color: white;\n}\n.guide-card__difficulty.difficulty-expert[_ngcontent-%COMP%] {\n  background: rgba(244, 67, 54, 0.9);\n  color: white;\n}\n.guide-card__content[_ngcontent-%COMP%] {\n  padding: 20px;\n}\n.guide-card__title[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 700;\n  margin-bottom: 8px;\n  line-height: 1.4;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  transition: color 0.3s;\n}\n.guide-card[_ngcontent-%COMP%]:hover   .guide-card__title[_ngcontent-%COMP%] {\n  color: var(--primary-color, #007bff);\n}\n.guide-card__summary[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: var(--text-muted, #666);\n  margin-bottom: 16px;\n  line-height: 1.6;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.guide-card__tags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin-bottom: 16px;\n}\n.guide-card__tags[_ngcontent-%COMP%]   .tag[_ngcontent-%COMP%] {\n  background: rgba(0, 123, 255, 0.1);\n  color: var(--primary-color, #007bff);\n  padding: 4px 12px;\n  border-radius: 12px;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.guide-card__footer[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding-top: 16px;\n  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));\n}\n.guide-card__author[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.guide-card__author[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], \n.guide-card__author[_ngcontent-%COMP%]   .author-avatar-placeholder[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  object-fit: cover;\n}\n.guide-card__author[_ngcontent-%COMP%]   .author-avatar-placeholder[_ngcontent-%COMP%] {\n  background: var(--primary-color, #007bff);\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-size: 0.875rem;\n}\n.guide-card__author[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 600;\n}\n.guide-card__meta[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.guide-card__meta[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 0.75rem;\n  color: var(--text-muted, #666);\n}\n.guide-card__meta[_ngcontent-%COMP%]   .meta-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.guide-card__meta[_ngcontent-%COMP%]   .meta-item.bookmark-btn[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  cursor: pointer;\n  transition: color 0.3s;\n  padding: 0;\n}\n.guide-card__meta[_ngcontent-%COMP%]   .meta-item.bookmark-btn[_ngcontent-%COMP%]:hover, .guide-card__meta[_ngcontent-%COMP%]   .meta-item.bookmark-btn.bookmarked[_ngcontent-%COMP%] {\n  color: var(--primary-color, #007bff);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImd1aWRlLWNhcmQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxjQUFBO0VBQ0EsMkNBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EseURBQUE7RUFDQSxpREFBQTtFQUNBLHFCQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0FBQ0o7QUFDSTtFQUNJLDJCQUFBO0VBQ0EsMkNBQUE7RUFDQSwyQ0FBQTtBQUNSO0FBRUk7RUFDSSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EsNkRBQUE7RUFDQSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0EsVUFBQTtFQUNBLDRDQUFBO0FBQVI7QUFFUTtFQUNJLG1CQUFBO0FBQVo7QUFJSTtFQUNJLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLGdCQUFBO0VBQ0EsNEZBQUE7QUFGUjtBQUlRO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtFQUNBLDBCQUFBO0FBRlo7QUFLUTtFQUNJLFdBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxlQUFBO0VBQ0EsNkJBQUE7QUFIWjtBQU9JO0VBQ0kscUJBQUE7QUFMUjtBQVFJO0VBQ0ksa0JBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EseUJBQUE7RUFDQSxxQkFBQTtBQU5SO0FBUVE7RUFDSSxrQ0FBQTtFQUNBLFlBQUE7QUFOWjtBQVNRO0VBQ0ksa0NBQUE7RUFDQSxXQUFBO0FBUFo7QUFVUTtFQUNJLGtDQUFBO0VBQ0EsWUFBQTtBQVJaO0FBV1E7RUFDSSxrQ0FBQTtFQUNBLFlBQUE7QUFUWjtBQWFJO0VBQ0ksYUFBQTtBQVhSO0FBY0k7RUFDSSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLG9CQUFBO0VBQ0EscUJBQUE7RUFDQSw0QkFBQTtFQUNBLGdCQUFBO0VBQ0Esc0JBQUE7QUFaUjtBQWVJO0VBQ0ksb0NBQUE7QUFiUjtBQWdCSTtFQUNJLG1CQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0Esb0JBQUE7RUFDQSxxQkFBQTtFQUNBLDRCQUFBO0VBQ0EsZ0JBQUE7QUFkUjtBQWlCSTtFQUNJLGFBQUE7RUFDQSxlQUFBO0VBQ0EsUUFBQTtFQUNBLG1CQUFBO0FBZlI7QUFpQlE7RUFDSSxrQ0FBQTtFQUNBLG9DQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFmWjtBQW1CSTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxpQkFBQTtFQUNBLDZEQUFBO0FBakJSO0FBb0JJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtBQWxCUjtBQW9CUTs7RUFFSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7QUFsQlo7QUFxQlE7RUFDSSx5Q0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0VBQ0EsbUJBQUE7QUFuQlo7QUFzQlE7RUFDSSxtQkFBQTtFQUNBLGdCQUFBO0FBcEJaO0FBd0JJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLGVBQUE7QUF0QlI7QUF3QlE7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0Esa0JBQUE7RUFDQSw4QkFBQTtBQXRCWjtBQXdCWTtFQUNJLG1CQUFBO0FBdEJoQjtBQXlCWTtFQUNJLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxzQkFBQTtFQUNBLFVBQUE7QUF2QmhCO0FBeUJnQjtFQUVJLG9DQUFBO0FBeEJwQiIsImZpbGUiOiJndWlkZS1jYXJkLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmd1aWRlLWNhcmQge1xyXG4gICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJhY2tncm91bmQsICNmZmZmZmYpO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcclxuICAgIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsIHJnYmEoMCwgMCwgMCwgMC4xKSk7XHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gICAgY29sb3I6IGluaGVyaXQ7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblxyXG4gICAgJjpob3ZlciB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC04cHgpO1xyXG4gICAgICAgIGJveC1zaGFkb3c6IDAgMTJweCAzMnB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XHJcbiAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgIH1cclxuXHJcbiAgICAmX19mZWF0dXJlZCB7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIHRvcDogMTJweDtcclxuICAgICAgICBsZWZ0OiAxMnB4O1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNmZmQ3MDAgMCUsICNmZmVkNGUgMTAwJSk7XHJcbiAgICAgICAgY29sb3I6ICMwMDA7XHJcbiAgICAgICAgcGFkZGluZzogNnB4IDEycHg7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgZ2FwOiA0cHg7XHJcbiAgICAgICAgei1pbmRleDogMjtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDJweCA4cHggcmdiYSgyNTUsIDIxNSwgMCwgMC40KTtcclxuXHJcbiAgICAgICAgaSB7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX21lZGlhIHtcclxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAgICAgaGVpZ2h0OiAyMDBweDtcclxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHJnYmEoMCwgMTIzLCAyNTUsIDAuMDUpIDAlLCByZ2JhKDAsIDEyMywgMjU1LCAwLjEpIDEwMCUpO1xyXG5cclxuICAgICAgICBpbWcge1xyXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICAgICAgICBvYmplY3QtZml0OiBjb3ZlcjtcclxuICAgICAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuNXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmLXBsYWNlaG9sZGVyIHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogNjRweDtcclxuICAgICAgICAgICAgY29sb3I6IHJnYmEoMCwgMTIzLCAyNTUsIDAuMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICY6aG92ZXIgJl9fbWVkaWEgaW1nIHtcclxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fZGlmZmljdWx0eSB7XHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIGJvdHRvbTogMTJweDtcclxuICAgICAgICByaWdodDogMTJweDtcclxuICAgICAgICBwYWRkaW5nOiA2cHggMTJweDtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMC43NXJlbTtcclxuICAgICAgICBmb250LXdlaWdodDogNzAwO1xyXG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xyXG5cclxuICAgICAgICAmLmRpZmZpY3VsdHktYmVnaW5uZXIge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDc2LCAxNzUsIDgwLCAwLjkpO1xyXG4gICAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmLmRpZmZpY3VsdHktaW50ZXJtZWRpYXRlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDE5MywgNywgMC45KTtcclxuICAgICAgICAgICAgY29sb3I6ICMwMDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmLmRpZmZpY3VsdHktYWR2YW5jZWQge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMTUyLCAwLCAwLjkpO1xyXG4gICAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmLmRpZmZpY3VsdHktZXhwZXJ0IHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDQsIDY3LCA1NCwgMC45KTtcclxuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19jb250ZW50IHtcclxuICAgICAgICBwYWRkaW5nOiAyMHB4O1xyXG4gICAgfVxyXG5cclxuICAgICZfX3RpdGxlIHtcclxuICAgICAgICBmb250LXNpemU6IDEuMjVyZW07XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XHJcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNDtcclxuICAgICAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcclxuICAgICAgICAtd2Via2l0LWxpbmUtY2xhbXA6IDI7XHJcbiAgICAgICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcclxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3M7XHJcbiAgICB9XHJcblxyXG4gICAgJjpob3ZlciAmX190aXRsZSB7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgfVxyXG5cclxuICAgICZfX3N1bW1hcnkge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQsICM2NjYpO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNjtcclxuICAgICAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcclxuICAgICAgICAtd2Via2l0LWxpbmUtY2xhbXA6IDI7XHJcbiAgICAgICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcclxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgfVxyXG5cclxuICAgICZfX3RhZ3Mge1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgZmxleC13cmFwOiB3cmFwO1xyXG4gICAgICAgIGdhcDogOHB4O1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcblxyXG4gICAgICAgIC50YWcge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDEyMywgMjU1LCAwLjEpO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX2Zvb3RlciB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgIGdhcDogMTJweDtcclxuICAgICAgICBwYWRkaW5nLXRvcDogMTZweDtcclxuICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yLCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xyXG4gICAgfVxyXG5cclxuICAgICZfX2F1dGhvciB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGdhcDogOHB4O1xyXG5cclxuICAgICAgICBpbWcsXHJcbiAgICAgICAgLmF1dGhvci1hdmF0YXItcGxhY2Vob2xkZXIge1xyXG4gICAgICAgICAgICB3aWR0aDogMzJweDtcclxuICAgICAgICAgICAgaGVpZ2h0OiAzMnB4O1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICAgICAgICAgIG9iamVjdC1maXQ6IGNvdmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmF1dGhvci1hdmF0YXItcGxhY2Vob2xkZXIge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNwYW4ge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19tZXRhIHtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgZ2FwOiAxNnB4O1xyXG4gICAgICAgIGZsZXgtd3JhcDogd3JhcDtcclxuXHJcbiAgICAgICAgLm1ldGEtaXRlbSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGdhcDogNHB4O1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjNjY2KTtcclxuXHJcbiAgICAgICAgICAgIGkge1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJi5ib29rbWFyay1idG4ge1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcclxuICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3M7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAwO1xyXG5cclxuICAgICAgICAgICAgICAgICY6aG92ZXIsXHJcbiAgICAgICAgICAgICAgICAmLmJvb2ttYXJrZWQge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZmVhdHVyZXMvY29tbXVuaXR5L2NvbXBvbmVudHMvZ3VpZGUtY2FyZC9ndWlkZS1jYXJkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksY0FBQTtFQUNBLDJDQUFBO0VBQ0EsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLHlEQUFBO0VBQ0EsaURBQUE7RUFDQSxxQkFBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtBQUNKO0FBQ0k7RUFDSSwyQkFBQTtFQUNBLDJDQUFBO0VBQ0EsMkNBQUE7QUFDUjtBQUVJO0VBQ0ksa0JBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLDZEQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtFQUNBLFVBQUE7RUFDQSw0Q0FBQTtBQUFSO0FBRVE7RUFDSSxtQkFBQTtBQUFaO0FBSUk7RUFDSSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxnQkFBQTtFQUNBLDRGQUFBO0FBRlI7QUFJUTtFQUNJLFdBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7RUFDQSwwQkFBQTtBQUZaO0FBS1E7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsZUFBQTtFQUNBLDZCQUFBO0FBSFo7QUFPSTtFQUNJLHFCQUFBO0FBTFI7QUFRSTtFQUNJLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7RUFDQSxpQkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLHlCQUFBO0VBQ0EscUJBQUE7QUFOUjtBQVFRO0VBQ0ksa0NBQUE7RUFDQSxZQUFBO0FBTlo7QUFTUTtFQUNJLGtDQUFBO0VBQ0EsV0FBQTtBQVBaO0FBVVE7RUFDSSxrQ0FBQTtFQUNBLFlBQUE7QUFSWjtBQVdRO0VBQ0ksa0NBQUE7RUFDQSxZQUFBO0FBVFo7QUFhSTtFQUNJLGFBQUE7QUFYUjtBQWNJO0VBQ0ksa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxvQkFBQTtFQUNBLHFCQUFBO0VBQ0EsNEJBQUE7RUFDQSxnQkFBQTtFQUNBLHNCQUFBO0FBWlI7QUFlSTtFQUNJLG9DQUFBO0FBYlI7QUFnQkk7RUFDSSxtQkFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLG9CQUFBO0VBQ0EscUJBQUE7RUFDQSw0QkFBQTtFQUNBLGdCQUFBO0FBZFI7QUFpQkk7RUFDSSxhQUFBO0VBQ0EsZUFBQTtFQUNBLFFBQUE7RUFDQSxtQkFBQTtBQWZSO0FBaUJRO0VBQ0ksa0NBQUE7RUFDQSxvQ0FBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBZlo7QUFtQkk7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxTQUFBO0VBQ0EsaUJBQUE7RUFDQSw2REFBQTtBQWpCUjtBQW9CSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7QUFsQlI7QUFvQlE7O0VBRUksV0FBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0FBbEJaO0FBcUJRO0VBQ0kseUNBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0FBbkJaO0FBc0JRO0VBQ0ksbUJBQUE7RUFDQSxnQkFBQTtBQXBCWjtBQXdCSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0FBdEJSO0FBd0JRO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtFQUNBLGtCQUFBO0VBQ0EsOEJBQUE7QUF0Qlo7QUF3Qlk7RUFDSSxtQkFBQTtBQXRCaEI7QUF5Qlk7RUFDSSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0Esc0JBQUE7RUFDQSxVQUFBO0FBdkJoQjtBQXlCZ0I7RUFFSSxvQ0FBQTtBQXhCcEI7QUFDQSw0dVRBQTR1VCIsInNvdXJjZXNDb250ZW50IjpbIi5ndWlkZS1jYXJkIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgYmFja2dyb3VuZDogdmFyKC0tY2FyZC1iYWNrZ3JvdW5kLCAjZmZmZmZmKTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yLCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xyXG4gICAgdHJhbnNpdGlvbjogYWxsIDAuM3MgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKTtcclxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICAgIGNvbG9yOiBpbmhlcml0O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxuICAgICY6aG92ZXIge1xyXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOHB4KTtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDEycHggMzJweCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xyXG4gICAgICAgIGJvcmRlci1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fZmVhdHVyZWQge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICB0b3A6IDEycHg7XHJcbiAgICAgICAgbGVmdDogMTJweDtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjZmZkNzAwIDAlLCAjZmZlZDRlIDEwMCUpO1xyXG4gICAgICAgIGNvbG9yOiAjMDAwO1xyXG4gICAgICAgIHBhZGRpbmc6IDZweCAxMnB4O1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcbiAgICAgICAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGdhcDogNHB4O1xyXG4gICAgICAgIHotaW5kZXg6IDI7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMjU1LCAyMTUsIDAsIDAuNCk7XHJcblxyXG4gICAgICAgIGkge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19tZWRpYSB7XHJcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAgIGhlaWdodDogMjAwcHg7XHJcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCByZ2JhKDAsIDEyMywgMjU1LCAwLjA1KSAwJSwgcmdiYSgwLCAxMjMsIDI1NSwgMC4xKSAxMDAlKTtcclxuXHJcbiAgICAgICAgaW1nIHtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgICAgb2JqZWN0LWZpdDogY292ZXI7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi1wbGFjZWhvbGRlciB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDY0cHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiByZ2JhKDAsIDEyMywgMjU1LCAwLjIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmOmhvdmVyICZfX21lZGlhIGltZyB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xyXG4gICAgfVxyXG5cclxuICAgICZfX2RpZmZpY3VsdHkge1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICBib3R0b206IDEycHg7XHJcbiAgICAgICAgcmlnaHQ6IDEycHg7XHJcbiAgICAgICAgcGFkZGluZzogNnB4IDEycHg7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcclxuXHJcbiAgICAgICAgJi5kaWZmaWN1bHR5LWJlZ2lubmVyIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSg3NiwgMTc1LCA4MCwgMC45KTtcclxuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi5kaWZmaWN1bHR5LWludGVybWVkaWF0ZSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAxOTMsIDcsIDAuOSk7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjMDAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi5kaWZmaWN1bHR5LWFkdmFuY2VkIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDE1MiwgMCwgMC45KTtcclxuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi5kaWZmaWN1bHR5LWV4cGVydCB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQ0LCA2NywgNTQsIDAuOSk7XHJcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJl9fY29udGVudCB7XHJcbiAgICAgICAgcGFkZGluZzogMjBweDtcclxuICAgIH1cclxuXHJcbiAgICAmX190aXRsZSB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxLjI1cmVtO1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XHJcbiAgICAgICAgZGlzcGxheTogLXdlYmtpdC1ib3g7XHJcbiAgICAgICAgLXdlYmtpdC1saW5lLWNsYW1wOiAyO1xyXG4gICAgICAgIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XHJcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzO1xyXG4gICAgfVxyXG5cclxuICAgICY6aG92ZXIgJl9fdGl0bGUge1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgIH1cclxuXHJcbiAgICAmX19zdW1tYXJ5IHtcclxuICAgICAgICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjNjY2KTtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xyXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjY7XHJcbiAgICAgICAgZGlzcGxheTogLXdlYmtpdC1ib3g7XHJcbiAgICAgICAgLXdlYmtpdC1saW5lLWNsYW1wOiAyO1xyXG4gICAgICAgIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XHJcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIH1cclxuXHJcbiAgICAmX190YWdzIHtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGZsZXgtd3JhcDogd3JhcDtcclxuICAgICAgICBnYXA6IDhweDtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xyXG5cclxuICAgICAgICAudGFnIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAxMjMsIDI1NSwgMC4xKTtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA0cHggMTJweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19mb290ZXIge1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICBnYXA6IDEycHg7XHJcbiAgICAgICAgcGFkZGluZy10b3A6IDE2cHg7XHJcbiAgICAgICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWJvcmRlci1jb2xvciwgcmdiYSgwLCAwLCAwLCAwLjEpKTtcclxuICAgIH1cclxuXHJcbiAgICAmX19hdXRob3Ige1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICBnYXA6IDhweDtcclxuXHJcbiAgICAgICAgaW1nLFxyXG4gICAgICAgIC5hdXRob3ItYXZhdGFyLXBsYWNlaG9sZGVyIHtcclxuICAgICAgICAgICAgd2lkdGg6IDMycHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogMzJweDtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgICAgICAgICBvYmplY3QtZml0OiBjb3ZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC5hdXRob3ItYXZhdGFyLXBsYWNlaG9sZGVyIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzcGFuIHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJl9fbWV0YSB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XHJcblxyXG4gICAgICAgIC5tZXRhLWl0ZW0ge1xyXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBnYXA6IDRweDtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCwgIzY2Nik7XHJcblxyXG4gICAgICAgICAgICBpIHtcclxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICYuYm9va21hcmstYnRuIHtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzO1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMDtcclxuXHJcbiAgICAgICAgICAgICAgICAmOmhvdmVyLFxyXG4gICAgICAgICAgICAgICAgJi5ib29rbWFya2VkIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 1141:
/*!************************************************************************************!*\
  !*** ./src/app/features/community/components/guides-list/guides-list.component.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GuidesListComponent: () => (/* binding */ GuidesListComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 3900);
/* harmony import */ var _shared_components_list_view_list_view_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../shared/components/list-view/list-view.component */ 8989);
/* harmony import */ var _guide_card_guide_card_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../guide-card/guide-card.component */ 409);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_guides_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/guides.service */ 6175);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 2596);











const _c0 = () => ({
  showPagination: true,
  gridCols: 3,
  gap: "24px"
});
function GuidesListComponent_option_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "option", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const category_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngValue", category_r2.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", category_r2.name, " ");
  }
}
function GuidesListComponent_option_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "option", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const difficulty_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngValue", difficulty_r3.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", difficulty_r3.name, " ");
  }
}
function GuidesListComponent_option_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "option", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", option_r4.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", option_r4.label, " ");
  }
}
function GuidesListComponent_ng_template_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "app-guide-card", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("bookmarkClick", function GuidesListComponent_ng_template_43_Template_app_guide_card_bookmarkClick_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r5);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r5.onBookmarkGuide($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const guide_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("guide", guide_r7);
  }
}
class GuidesListComponent {
  constructor(guidesService, router) {
    this.guidesService = guidesService;
    this.router = router;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__.Subject();
    this.guides = [];
    this.loading = false;
    this.error = null;
    this.paginationConfig = {
      currentPage: 1,
      pageSize: 12,
      totalItems: 0,
      totalPages: 0
    };
    // Filters
    this.filters = {
      page: 1,
      pageSize: 12,
      sortBy: 'CreatedAt',
      sortDescending: true
    };
    this.searchTerm = '';
    this.showFeaturedOnly = false;
    // Options
    this.categories = [];
    this.difficulties = [];
    this.sortOptions = [{
      value: 'CreatedAt',
      label: 'Newest First'
    }, {
      value: 'Title',
      label: 'Title A-Z'
    }, {
      value: 'ViewCount',
      label: 'Most Viewed'
    }, {
      value: 'Rating',
      label: 'Highest Rated'
    }, {
      value: 'LikeCount',
      label: 'Most Liked'
    }];
  }
  ngOnInit() {
    this.loadOptions();
    this.loadGuides();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadOptions() {
    this.guidesService.getCategories().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe(categories => this.categories = categories);
    this.guidesService.getDifficulties().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe(difficulties => this.difficulties = difficulties);
  }
  loadGuides() {
    this.loading = true;
    this.error = null;
    this.guidesService.getGuides(this.filters).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: result => {
        this.guides = result.items;
        this.paginationConfig = {
          currentPage: result.pageNumber,
          pageSize: result.pageSize,
          totalItems: result.totalCount,
          totalPages: result.totalPages
        };
        this.loading = false;
      },
      error: error => {
        this.error = 'Failed to load guides. Please try again.';
        this.loading = false;
        console.error('Error loading guides:', error);
      }
    });
  }
  onSearchChange() {
    this.filters.searchTerm = this.searchTerm || undefined;
    this.resetPagination();
  }
  onCategoryChange() {
    this.filters.category = this.selectedCategory;
    this.resetPagination();
  }
  onDifficultyChange() {
    this.filters.difficulty = this.selectedDifficulty;
    this.resetPagination();
  }
  onFeaturedToggle() {
    this.filters.isFeatured = this.showFeaturedOnly ? true : undefined;
    this.resetPagination();
  }
  onSortChange(sortBy) {
    this.filters.sortBy = sortBy;
    this.resetPagination();
  }
  onPageChange(page) {
    this.filters.page = page;
    this.loadGuides();
  }
  onBookmarkGuide(guide) {
    this.guidesService.bookmarkGuide(guide.id).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: () => {
        guide.isBookmarked = !guide.isBookmarked;
        guide.bookmarkCount += guide.isBookmarked ? 1 : -1;
      },
      error: error => {
        console.error('Error bookmarking guide:', error);
      }
    });
  }
  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = undefined;
    this.selectedDifficulty = undefined;
    this.showFeaturedOnly = false;
    this.filters = {
      page: 1,
      pageSize: 12,
      sortBy: 'CreatedAt',
      sortDescending: true
    };
    this.loadGuides();
  }
  resetPagination() {
    this.filters.page = 1;
    this.loadGuides();
  }
  static {
    this.ɵfac = function GuidesListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GuidesListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_services_guides_service__WEBPACK_IMPORTED_MODULE_2__.GuidesService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: GuidesListComponent,
      selectors: [["app-guides-list"]],
      decls: 45,
      vars: 16,
      consts: [["itemTemplate", ""], [1, "guides-list-container"], [1, "header"], [1, "header__content"], ["routerLink", "/community/guides/create", 1, "btn", "btn-primary"], [1, "fa-solid", "fa-plus"], ["emptyMessage", "No guides found", "emptyDescription", "Try adjusting your filters or create a new guide", 3, "pageChange", "items", "loading", "error", "pagination", "config"], ["filters", "", 1, "filters-panel"], [1, "filters-grid"], [1, "filter-item", "filter-item--wide"], ["type", "text", "placeholder", "Search guides...", 1, "input", 3, "ngModelChange", "input", "ngModel"], [1, "filter-item"], [1, "select", 3, "ngModelChange", "change", "ngModel"], [3, "value"], [3, "ngValue", 4, "ngFor", "ngForOf"], [3, "value", 4, "ngFor", "ngForOf"], [1, "filters-footer"], [1, "checkbox-label"], ["type", "checkbox", 3, "ngModelChange", "change", "ngModel"], [1, "btn-link", 3, "click"], [3, "ngValue"], [3, "bookmarkClick", "guide"]],
      template: function GuidesListComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "h1");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Community Guides");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Learn from the community's expertise");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "button", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "i", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, " Create Guide ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "app-list-view", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("pageChange", function GuidesListComponent_Template_app_list_view_pageChange_10_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx.onPageChange($event));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 7)(12, "div", 8)(13, "div", 9)(14, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15, "Search");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "input", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayListener"]("ngModelChange", function GuidesListComponent_Template_input_ngModelChange_16_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayBindingSet"](ctx.searchTerm, $event) || (ctx.searchTerm = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("input", function GuidesListComponent_Template_input_input_16_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx.onSearchChange());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "div", 11)(18, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19, "Category");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "select", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayListener"]("ngModelChange", function GuidesListComponent_Template_select_ngModelChange_20_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayBindingSet"](ctx.selectedCategory, $event) || (ctx.selectedCategory = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("change", function GuidesListComponent_Template_select_change_20_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx.onCategoryChange());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "option", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, "All Categories");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](23, GuidesListComponent_option_23_Template, 2, 2, "option", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 11)(25, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26, "Difficulty");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "select", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayListener"]("ngModelChange", function GuidesListComponent_Template_select_ngModelChange_27_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayBindingSet"](ctx.selectedDifficulty, $event) || (ctx.selectedDifficulty = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("change", function GuidesListComponent_Template_select_change_27_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx.onDifficultyChange());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "option", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](29, "All Levels");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](30, GuidesListComponent_option_30_Template, 2, 2, "option", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "div", 11)(32, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](33, "Sort By");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "select", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayListener"]("ngModelChange", function GuidesListComponent_Template_select_ngModelChange_34_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayBindingSet"](ctx.filters.sortBy, $event) || (ctx.filters.sortBy = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("change", function GuidesListComponent_Template_select_change_34_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx.onSortChange(ctx.filters.sortBy));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](35, GuidesListComponent_option_35_Template, 2, 2, "option", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](36, "div", 16)(37, "label", 17)(38, "input", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayListener"]("ngModelChange", function GuidesListComponent_Template_input_ngModelChange_38_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayBindingSet"](ctx.showFeaturedOnly, $event) || (ctx.showFeaturedOnly = $event);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"]($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("change", function GuidesListComponent_Template_input_change_38_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx.onFeaturedToggle());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](39, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](40, "Featured only");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](41, "button", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GuidesListComponent_Template_button_click_41_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r1);
            return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx.clearFilters());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](42, " Clear Filters ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](43, GuidesListComponent_ng_template_43_Template, 1, 1, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("items", ctx.guides)("loading", ctx.loading)("error", ctx.error)("pagination", ctx.paginationConfig)("config", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](15, _c0));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayProperty"]("ngModel", ctx.searchTerm);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayProperty"]("ngModel", ctx.selectedCategory);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", undefined);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.categories);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayProperty"]("ngModel", ctx.selectedDifficulty);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", undefined);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.difficulties);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayProperty"]("ngModel", ctx.filters.sortBy);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.sortOptions);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtwoWayProperty"]("ngModel", ctx.showFeaturedOnly);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.NgModel, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterLink, _shared_components_list_view_list_view_component__WEBPACK_IMPORTED_MODULE_0__.ListViewComponent, _guide_card_guide_card_component__WEBPACK_IMPORTED_MODULE_1__.GuideCardComponent],
      styles: [".guides-list-container[_ngcontent-%COMP%] {\n  margin-left: auto;\n  margin-right: auto;\n  max-width: 80rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 2rem;\n  padding-bottom: 2rem;\n}\n\n@media (min-width: 640px) {\n\n  .guides-list-container[_ngcontent-%COMP%] {\n    padding-left: 1.5rem;\n    padding-right: 1.5rem;\n  }\n}\n\n@media (min-width: 1024px) {\n\n  .guides-list-container[_ngcontent-%COMP%] {\n    padding-left: 2rem;\n    padding-right: 2rem;\n  }\n}\n\n.line-clamp-2[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.line-clamp-3[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.aspect-video[_ngcontent-%COMP%] {\n  aspect-ratio: 16/9;\n}\n\n[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n\n[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));\n}\n\n[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  border-radius: 9999px;\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));\n}\n\n[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));\n}\n\n.transition-colors[_ngcontent-%COMP%] {\n  transition-property: color, background-color, border-color;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n\n.transition-shadow[_ngcontent-%COMP%] {\n  transition-property: box-shadow;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.animate-spin[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n\n.hover\\:shadow-md[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n}\n\n.hover\\:bg-gray-50[_ngcontent-%COMP%]:hover {\n  background-color: #f9fafb;\n}\n\n.hover\\:bg-blue-700[_ngcontent-%COMP%]:hover {\n  background-color: #1d4ed8;\n}\n\n.hover\\:text-blue-800[_ngcontent-%COMP%]:hover {\n  color: #1e40af;\n}\n\n.focus\\:outline-none[_ngcontent-%COMP%]:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n.focus\\:ring-2[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);\n}\n\n.focus\\:ring-blue-500[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);\n}\n\n.focus\\:border-transparent[_ngcontent-%COMP%]:focus {\n  border-color: transparent;\n}\n\n.disabled\\:opacity-50[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n}\n\n.disabled\\:cursor-not-allowed[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImd1aWRlcy1saXN0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0VBQUEsaUJBQUE7RUFBQSxrQkFBQTtFQUFBLGdCQUFBO0VBQUEsa0JBQUE7RUFBQSxtQkFBQTtFQUFBLGlCQUFBO0VBQUE7QUFBQTs7QUFBQTs7RUFBQTtJQUFBLG9CQUFBO0lBQUE7RUFBQTtBQUFBOztBQUFBOztFQUFBO0lBQUEsa0JBQUE7SUFBQTtFQUFBO0FBQUE7O0FBR0Y7RUFDRSxvQkFBQTtFQUNBLHFCQUFBO0VBQ0EsNEJBQUE7RUFDQSxnQkFBQTtBQUNGOztBQUVBO0VBQ0Usb0JBQUE7RUFDQSxxQkFBQTtFQUNBLDRCQUFBO0VBQ0EsZ0JBQUE7QUFDRjs7QUFFQTtFQUNFLGtCQUFBO0FBQ0Y7O0FBR0E7RUFDRSxVQUFBO0FBQUY7O0FBSUU7RUFBQSxrQkFBQTtFQUFBO0FBQUE7O0FBSUE7RUFBQSxxQkFBQTtFQUFBLGtCQUFBO0VBQUE7QUFBQTs7QUFJQTtFQUFBLGtCQUFBO0VBQUE7QUFBQTs7QUFJRjtFQUNFLDBEQUFBO0VBQ0Esd0RBQUE7RUFDQSwwQkFBQTtBQURGOztBQUlBO0VBQ0UsK0JBQUE7RUFDQSx3REFBQTtFQUNBLDBCQUFBO0FBREY7O0FBS0E7RUFDRTtJQUNFLHlCQUFBO0VBRkY7QUFDRjtBQUtBO0VBQ0Usa0NBQUE7QUFIRjs7QUFPQTtFQUNFLGlGQUFBO0FBSkY7O0FBT0E7RUFDRSx5QkFBQTtBQUpGOztBQU9BO0VBQ0UseUJBQUE7QUFKRjs7QUFPQTtFQUNFLGNBQUE7QUFKRjs7QUFRQTtFQUNFLDhCQUFBO0VBQ0EsbUJBQUE7QUFMRjs7QUFRQTtFQUNFLDZDQUFBO0FBTEY7O0FBUUE7RUFDRSw2Q0FBQTtBQUxGOztBQVFBO0VBQ0UseUJBQUE7QUFMRjs7QUFTQTtFQUNFLFlBQUE7QUFORjs7QUFTQTtFQUNFLG1CQUFBO0FBTkYiLCJmaWxlIjoiZ3VpZGVzLWxpc3QuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZ3VpZGVzLWxpc3QtY29udGFpbmVyIHtcclxuICBAYXBwbHkgbWF4LXctN3hsIG14LWF1dG8gcHgtNCBzbTpweC02IGxnOnB4LTggcHktODtcclxufVxyXG5cclxuLmxpbmUtY2xhbXAtMiB7XHJcbiAgZGlzcGxheTogLXdlYmtpdC1ib3g7XHJcbiAgLXdlYmtpdC1saW5lLWNsYW1wOiAyO1xyXG4gIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxufVxyXG5cclxuLmxpbmUtY2xhbXAtMyB7XHJcbiAgZGlzcGxheTogLXdlYmtpdC1ib3g7XHJcbiAgLXdlYmtpdC1saW5lLWNsYW1wOiAzO1xyXG4gIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxufVxyXG5cclxuLmFzcGVjdC12aWRlbyB7XHJcbiAgYXNwZWN0LXJhdGlvOiAxNiAvIDk7XHJcbn1cclxuXHJcbi8vIEN1c3RvbSBzY3JvbGxiYXIgZm9yIGJldHRlciBVWFxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICB3aWR0aDogNnB4O1xyXG59XHJcblxyXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcclxuICBAYXBwbHkgYmctZ3JheS0xMDA7XHJcbn1cclxuXHJcbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xyXG4gIEBhcHBseSBiZy1ncmF5LTMwMCByb3VuZGVkLWZ1bGw7XHJcbn1cclxuXHJcbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xyXG4gIEBhcHBseSBiZy1ncmF5LTQwMDtcclxufVxyXG5cclxuLy8gU21vb3RoIHRyYW5zaXRpb25zXHJcbi50cmFuc2l0aW9uLWNvbG9ycyB7XHJcbiAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogY29sb3IsIGJhY2tncm91bmQtY29sb3IsIGJvcmRlci1jb2xvcjtcclxuICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKTtcclxuICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAxNTBtcztcclxufVxyXG5cclxuLnRyYW5zaXRpb24tc2hhZG93IHtcclxuICB0cmFuc2l0aW9uLXByb3BlcnR5OiBib3gtc2hhZG93O1xyXG4gIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpO1xyXG4gIHRyYW5zaXRpb24tZHVyYXRpb246IDE1MG1zO1xyXG59XHJcblxyXG4vLyBMb2FkaW5nIGFuaW1hdGlvblxyXG5Aa2V5ZnJhbWVzIHNwaW4ge1xyXG4gIHRvIHtcclxuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XHJcbiAgfVxyXG59XHJcblxyXG4uYW5pbWF0ZS1zcGluIHtcclxuICBhbmltYXRpb246IHNwaW4gMXMgbGluZWFyIGluZmluaXRlO1xyXG59XHJcblxyXG4vLyBIb3ZlciBlZmZlY3RzXHJcbi5ob3ZlclxcOnNoYWRvdy1tZDpob3ZlciB7XHJcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IC0xcHggcmdiYSgwLCAwLCAwLCAwLjEpLCAwIDJweCA0cHggLTFweCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xyXG59XHJcblxyXG4uaG92ZXJcXDpiZy1ncmF5LTUwOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmYWZiO1xyXG59XHJcblxyXG4uaG92ZXJcXDpiZy1ibHVlLTcwMDpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzFkNGVkODtcclxufVxyXG5cclxuLmhvdmVyXFw6dGV4dC1ibHVlLTgwMDpob3ZlciB7XHJcbiAgY29sb3I6ICMxZTQwYWY7XHJcbn1cclxuXHJcbi8vIEZvY3VzIHN0eWxlc1xyXG4uZm9jdXNcXDpvdXRsaW5lLW5vbmU6Zm9jdXMge1xyXG4gIG91dGxpbmU6IDJweCBzb2xpZCB0cmFuc3BhcmVudDtcclxuICBvdXRsaW5lLW9mZnNldDogMnB4O1xyXG59XHJcblxyXG4uZm9jdXNcXDpyaW5nLTI6Zm9jdXMge1xyXG4gIGJveC1zaGFkb3c6IDAgMCAwIDJweCByZ2JhKDU5LCAxMzAsIDI0NiwgMC41KTtcclxufVxyXG5cclxuLmZvY3VzXFw6cmluZy1ibHVlLTUwMDpmb2N1cyB7XHJcbiAgYm94LXNoYWRvdzogMCAwIDAgMnB4IHJnYmEoNTksIDEzMCwgMjQ2LCAwLjUpO1xyXG59XHJcblxyXG4uZm9jdXNcXDpib3JkZXItdHJhbnNwYXJlbnQ6Zm9jdXMge1xyXG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbn1cclxuXHJcbi8vIERpc2FibGVkIHN0eWxlc1xyXG4uZGlzYWJsZWRcXDpvcGFjaXR5LTUwOmRpc2FibGVkIHtcclxuICBvcGFjaXR5OiAwLjU7XHJcbn1cclxuXHJcbi5kaXNhYmxlZFxcOmN1cnNvci1ub3QtYWxsb3dlZDpkaXNhYmxlZCB7XHJcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxufSJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZmVhdHVyZXMvY29tbXVuaXR5L2NvbXBvbmVudHMvZ3VpZGVzLWxpc3QvZ3VpZGVzLWxpc3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFBQSxpQkFBQTtFQUFBLGtCQUFBO0VBQUEsZ0JBQUE7RUFBQSxrQkFBQTtFQUFBLG1CQUFBO0VBQUEsaUJBQUE7RUFBQSxvQkFBQTtBQUFBOztBQUFBOztFQUFBO0lBQUEsb0JBQUE7SUFBQSxxQkFBQTtFQUFBO0FBQUE7O0FBQUE7O0VBQUE7SUFBQSxrQkFBQTtJQUFBLG1CQUFBO0VBQUE7QUFBQTs7QUFHRjtFQUNFLG9CQUFBO0VBQ0EscUJBQUE7RUFDQSw0QkFBQTtFQUNBLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxvQkFBQTtFQUNBLHFCQUFBO0VBQ0EsNEJBQUE7RUFDQSxnQkFBQTtBQUNGOztBQUVBO0VBQ0Usa0JBQUE7QUFDRjs7QUFHQTtFQUNFLFVBQUE7QUFBRjs7QUFJRTtFQUFBLGtCQUFBO0VBQUEsNERBQUE7QUFBQTs7QUFJQTtFQUFBLHFCQUFBO0VBQUEsa0JBQUE7RUFBQSw0REFBQTtBQUFBOztBQUlBO0VBQUEsa0JBQUE7RUFBQSw0REFBQTtBQUFBOztBQUlGO0VBQ0UsMERBQUE7RUFDQSx3REFBQTtFQUNBLDBCQUFBO0FBREY7O0FBSUE7RUFDRSwrQkFBQTtFQUNBLHdEQUFBO0VBQ0EsMEJBQUE7QUFERjs7QUFLQTtFQUNFO0lBQ0UseUJBQUE7RUFGRjtBQUNGO0FBS0E7RUFDRSxrQ0FBQTtBQUhGOztBQU9BO0VBQ0UsaUZBQUE7QUFKRjs7QUFPQTtFQUNFLHlCQUFBO0FBSkY7O0FBT0E7RUFDRSx5QkFBQTtBQUpGOztBQU9BO0VBQ0UsY0FBQTtBQUpGOztBQVFBO0VBQ0UsOEJBQUE7RUFDQSxtQkFBQTtBQUxGOztBQVFBO0VBQ0UsNkNBQUE7QUFMRjs7QUFRQTtFQUNFLDZDQUFBO0FBTEY7O0FBUUE7RUFDRSx5QkFBQTtBQUxGOztBQVNBO0VBQ0UsWUFBQTtBQU5GOztBQVNBO0VBQ0UsbUJBQUE7QUFORjtBQTJCQSxnbUlBQWdtSSIsInNvdXJjZXNDb250ZW50IjpbIi5ndWlkZXMtbGlzdC1jb250YWluZXIge1xyXG4gIEBhcHBseSBtYXgtdy03eGwgbXgtYXV0byBweC00IHNtOnB4LTYgbGc6cHgtOCBweS04O1xyXG59XHJcblxyXG4ubGluZS1jbGFtcC0yIHtcclxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcclxuICAtd2Via2l0LWxpbmUtY2xhbXA6IDI7XHJcbiAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG59XHJcblxyXG4ubGluZS1jbGFtcC0zIHtcclxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcclxuICAtd2Via2l0LWxpbmUtY2xhbXA6IDM7XHJcbiAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG59XHJcblxyXG4uYXNwZWN0LXZpZGVvIHtcclxuICBhc3BlY3QtcmF0aW86IDE2IC8gOTtcclxufVxyXG5cclxuLy8gQ3VzdG9tIHNjcm9sbGJhciBmb3IgYmV0dGVyIFVYXHJcbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xyXG4gIHdpZHRoOiA2cHg7XHJcbn1cclxuXHJcbjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xyXG4gIEBhcHBseSBiZy1ncmF5LTEwMDtcclxufVxyXG5cclxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XHJcbiAgQGFwcGx5IGJnLWdyYXktMzAwIHJvdW5kZWQtZnVsbDtcclxufVxyXG5cclxuOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XHJcbiAgQGFwcGx5IGJnLWdyYXktNDAwO1xyXG59XHJcblxyXG4vLyBTbW9vdGggdHJhbnNpdGlvbnNcclxuLnRyYW5zaXRpb24tY29sb3JzIHtcclxuICB0cmFuc2l0aW9uLXByb3BlcnR5OiBjb2xvciwgYmFja2dyb3VuZC1jb2xvciwgYm9yZGVyLWNvbG9yO1xyXG4gIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpO1xyXG4gIHRyYW5zaXRpb24tZHVyYXRpb246IDE1MG1zO1xyXG59XHJcblxyXG4udHJhbnNpdGlvbi1zaGFkb3cge1xyXG4gIHRyYW5zaXRpb24tcHJvcGVydHk6IGJveC1zaGFkb3c7XHJcbiAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSk7XHJcbiAgdHJhbnNpdGlvbi1kdXJhdGlvbjogMTUwbXM7XHJcbn1cclxuXHJcbi8vIExvYWRpbmcgYW5pbWF0aW9uXHJcbkBrZXlmcmFtZXMgc3BpbiB7XHJcbiAgdG8ge1xyXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcclxuICB9XHJcbn1cclxuXHJcbi5hbmltYXRlLXNwaW4ge1xyXG4gIGFuaW1hdGlvbjogc3BpbiAxcyBsaW5lYXIgaW5maW5pdGU7XHJcbn1cclxuXHJcbi8vIEhvdmVyIGVmZmVjdHNcclxuLmhvdmVyXFw6c2hhZG93LW1kOmhvdmVyIHtcclxuICBib3gtc2hhZG93OiAwIDRweCA2cHggLTFweCByZ2JhKDAsIDAsIDAsIDAuMSksIDAgMnB4IDRweCAtMXB4IHJnYmEoMCwgMCwgMCwgMC4wNik7XHJcbn1cclxuXHJcbi5ob3ZlclxcOmJnLWdyYXktNTA6aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWZhZmI7XHJcbn1cclxuXHJcbi5ob3ZlclxcOmJnLWJsdWUtNzAwOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWQ0ZWQ4O1xyXG59XHJcblxyXG4uaG92ZXJcXDp0ZXh0LWJsdWUtODAwOmhvdmVyIHtcclxuICBjb2xvcjogIzFlNDBhZjtcclxufVxyXG5cclxuLy8gRm9jdXMgc3R5bGVzXHJcbi5mb2N1c1xcOm91dGxpbmUtbm9uZTpmb2N1cyB7XHJcbiAgb3V0bGluZTogMnB4IHNvbGlkIHRyYW5zcGFyZW50O1xyXG4gIG91dGxpbmUtb2Zmc2V0OiAycHg7XHJcbn1cclxuXHJcbi5mb2N1c1xcOnJpbmctMjpmb2N1cyB7XHJcbiAgYm94LXNoYWRvdzogMCAwIDAgMnB4IHJnYmEoNTksIDEzMCwgMjQ2LCAwLjUpO1xyXG59XHJcblxyXG4uZm9jdXNcXDpyaW5nLWJsdWUtNTAwOmZvY3VzIHtcclxuICBib3gtc2hhZG93OiAwIDAgMCAycHggcmdiYSg1OSwgMTMwLCAyNDYsIDAuNSk7XHJcbn1cclxuXHJcbi5mb2N1c1xcOmJvcmRlci10cmFuc3BhcmVudDpmb2N1cyB7XHJcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcclxufVxyXG5cclxuLy8gRGlzYWJsZWQgc3R5bGVzXHJcbi5kaXNhYmxlZFxcOm9wYWNpdHktNTA6ZGlzYWJsZWQge1xyXG4gIG9wYWNpdHk6IDAuNTtcclxufVxyXG5cclxuLmRpc2FibGVkXFw6Y3Vyc29yLW5vdC1hbGxvd2VkOmRpc2FibGVkIHtcclxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 3580:
/*!***********************************************************!*\
  !*** ./src/app/features/community/services/qa.service.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QAService: () => (/* binding */ QAService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);



class QAService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v2.0/community/qa`;
  }
  getQuestions(pageNumber = 1, pageSize = 10, groupId) {
    let url = `${this.apiUrl}/questions?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (groupId) {
      url += `&groupId=${groupId}`;
    }
    return this.http.get(url);
  }
  getQuestion(id) {
    return this.http.get(`${this.apiUrl}/questions/${id}`);
  }
  askQuestion(request) {
    return this.http.post(`${this.apiUrl}/questions`, request);
  }
  answerQuestion(request) {
    return this.http.post(`${this.apiUrl}/answers`, request);
  }
  voteQuestion(id, isUpvote) {
    return this.http.post(`${this.apiUrl}/questions/${id}/vote`, {
      isUpvote
    });
  }
  voteAnswer(id, isUpvote) {
    return this.http.post(`${this.apiUrl}/answers/${id}/vote`, {
      isUpvote
    });
  }
  acceptAnswer(questionId, answerId) {
    return this.http.post(`${this.apiUrl}/questions/${questionId}/accept-answer/${answerId}`, {});
  }
  static {
    this.ɵfac = function QAService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || QAService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: QAService,
      factory: QAService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 3741:
/*!****************************************************************************!*\
  !*** ./src/app/shared/components/loading-state/loading-state.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoadingStateComponent: () => (/* binding */ LoadingStateComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);



function LoadingStateComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.message);
  }
}
function LoadingStateComponent_div_2_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "div", 12)(4, "div", 13)(5, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
}
function LoadingStateComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, LoadingStateComponent_div_2_div_1_Template, 6, 0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.items);
  }
}
function LoadingStateComponent_div_3_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "div", 12)(4, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
}
function LoadingStateComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, LoadingStateComponent_div_3_div_1_Template, 5, 0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.items);
  }
}
function LoadingStateComponent_div_4_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "div", 12)(4, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
}
function LoadingStateComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, LoadingStateComponent_div_4_div_1_Template, 5, 0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r0.items);
  }
}
class LoadingStateComponent {
  constructor() {
    this.type = 'spinner';
    this.count = 3;
    this.message = 'Loading...';
  }
  get items() {
    return Array(this.count).fill(0).map((_, i) => i);
  }
  static {
    this.ɵfac = function LoadingStateComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LoadingStateComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: LoadingStateComponent,
      selectors: [["app-loading-state"]],
      inputs: {
        type: "type",
        count: "count",
        message: "message"
      },
      decls: 5,
      vars: 5,
      consts: [[1, "loading-state", 3, "ngClass"], ["class", "loading-spinner", 4, "ngIf"], ["class", "loading-skeleton", 4, "ngIf"], ["class", "loading-grid", 4, "ngIf"], ["class", "loading-list", 4, "ngIf"], [1, "loading-spinner"], [1, "spinner"], [1, "loading-skeleton"], ["class", "skeleton-card", 4, "ngFor", "ngForOf"], [1, "skeleton-card"], [1, "skeleton-image"], [1, "skeleton-content"], [1, "skeleton-line", "skeleton-line--title"], [1, "skeleton-line", "skeleton-line--text"], [1, "loading-grid"], [1, "loading-list"], ["class", "skeleton-list-item", 4, "ngFor", "ngForOf"], [1, "skeleton-list-item"], [1, "skeleton-avatar"]],
      template: function LoadingStateComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, LoadingStateComponent_div_1_Template, 4, 1, "div", 1)(2, LoadingStateComponent_div_2_Template, 2, 1, "div", 2)(3, LoadingStateComponent_div_3_Template, 2, 1, "div", 3)(4, LoadingStateComponent_div_4_Template, 2, 1, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", "loading-state--" + ctx.type);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.type === "spinner");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.type === "skeleton");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.type === "grid");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.type === "list");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf],
      styles: ["@keyframes _ngcontent-%COMP%_shimmer {\n  0% {\n    background-position: -1000px 0;\n  }\n  100% {\n    background-position: 1000px 0;\n  }\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.loading-state[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.loading-state[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 48px;\n}\n.loading-state[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%]   .spinner[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border: 4px solid var(--border-color, #e0e0e0);\n  border-top-color: var(--primary-color, #007bff);\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n.loading-state[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 16px;\n  color: var(--text-muted, #666);\n}\n.loading-state[_ngcontent-%COMP%]   .loading-grid[_ngcontent-%COMP%], \n.loading-state[_ngcontent-%COMP%]   .loading-skeleton[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n@media (max-width: 1024px) {\n  .loading-state[_ngcontent-%COMP%]   .loading-grid[_ngcontent-%COMP%], \n   .loading-state[_ngcontent-%COMP%]   .loading-skeleton[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n@media (max-width: 640px) {\n  .loading-state[_ngcontent-%COMP%]   .loading-grid[_ngcontent-%COMP%], \n   .loading-state[_ngcontent-%COMP%]   .loading-skeleton[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.loading-state[_ngcontent-%COMP%]   .skeleton-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  overflow: hidden;\n  background: var(--card-background, #fff);\n  border: 1px solid var(--border-color, #e0e0e0);\n}\n.loading-state[_ngcontent-%COMP%]   .skeleton-image[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 200px;\n  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\n  background-size: 2000px 100%;\n  animation: _ngcontent-%COMP%_shimmer 2s infinite;\n}\n.loading-state[_ngcontent-%COMP%]   .skeleton-content[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n.loading-state[_ngcontent-%COMP%]   .skeleton-line[_ngcontent-%COMP%] {\n  height: 16px;\n  margin-bottom: 12px;\n  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\n  background-size: 2000px 100%;\n  animation: _ngcontent-%COMP%_shimmer 2s infinite;\n  border-radius: 4px;\n}\n.loading-state[_ngcontent-%COMP%]   .skeleton-line--title[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 70%;\n}\n.loading-state[_ngcontent-%COMP%]   .skeleton-line--text[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.loading-state[_ngcontent-%COMP%]   .skeleton-line[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n  width: 85%;\n}\n.loading-state[_ngcontent-%COMP%]   .loading-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.loading-state[_ngcontent-%COMP%]   .skeleton-list-item[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  padding: 16px;\n  background: var(--card-background, #fff);\n  border: 1px solid var(--border-color, #e0e0e0);\n  border-radius: 12px;\n}\n.loading-state[_ngcontent-%COMP%]   .skeleton-avatar[_ngcontent-%COMP%] {\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  flex-shrink: 0;\n  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\n  background-size: 2000px 100%;\n  animation: _ngcontent-%COMP%_shimmer 2s infinite;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvYWRpbmctc3RhdGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSTtJQUNJLDhCQUFBO0VBQ047RUFFRTtJQUNJLDZCQUFBO0VBQU47QUFDRjtBQUdBO0VBQ0k7SUFDSSx5QkFBQTtFQUROO0FBQ0Y7QUFJQTtFQUNJLFdBQUE7QUFGSjtBQUtJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7QUFIUjtBQUtRO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSw4Q0FBQTtFQUNBLCtDQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQ0FBQTtBQUhaO0FBTVE7RUFDSSxnQkFBQTtFQUNBLDhCQUFBO0FBSlo7QUFTSTs7RUFFSSxhQUFBO0VBQ0EscUNBQUE7RUFDQSxTQUFBO0FBUFI7QUFTUTtFQU5KOztJQU9RLHFDQUFBO0VBTFY7QUFDRjtBQU9RO0VBVko7O0lBV1EsMEJBQUE7RUFIVjtBQUNGO0FBTUk7RUFDSSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0Esd0NBQUE7RUFDQSw4Q0FBQTtBQUpSO0FBT0k7RUFDSSxXQUFBO0VBQ0EsYUFBQTtFQUNBLHlFQUFBO0VBSUEsNEJBQUE7RUFDQSw4QkFBQTtBQVJSO0FBV0k7RUFDSSxhQUFBO0FBVFI7QUFZSTtFQUNJLFlBQUE7RUFDQSxtQkFBQTtFQUNBLHlFQUFBO0VBSUEsNEJBQUE7RUFDQSw4QkFBQTtFQUNBLGtCQUFBO0FBYlI7QUFlUTtFQUNJLFlBQUE7RUFDQSxVQUFBO0FBYlo7QUFnQlE7RUFDSSxXQUFBO0FBZFo7QUFpQlE7RUFDSSxnQkFBQTtFQUNBLFVBQUE7QUFmWjtBQW9CSTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7QUFsQlI7QUFxQkk7RUFDSSxhQUFBO0VBQ0EsU0FBQTtFQUNBLGFBQUE7RUFDQSx3Q0FBQTtFQUNBLDhDQUFBO0VBQ0EsbUJBQUE7QUFuQlI7QUFzQkk7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLHlFQUFBO0VBSUEsNEJBQUE7RUFDQSw4QkFBQTtBQXZCUiIsImZpbGUiOiJsb2FkaW5nLXN0YXRlLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGtleWZyYW1lcyBzaGltbWVyIHtcclxuICAgIDAlIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtMTAwMHB4IDA7XHJcbiAgICB9XHJcblxyXG4gICAgMTAwJSB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTAwMHB4IDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc3BpbiB7XHJcbiAgICB0byB7XHJcbiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcclxuICAgIH1cclxufVxyXG5cclxuLmxvYWRpbmctc3RhdGUge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcblxyXG4gICAgLy8gU3Bpbm5lclxyXG4gICAgLmxvYWRpbmctc3Bpbm5lciB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgcGFkZGluZzogNDhweDtcclxuXHJcbiAgICAgICAgLnNwaW5uZXIge1xyXG4gICAgICAgICAgICB3aWR0aDogNDhweDtcclxuICAgICAgICAgICAgaGVpZ2h0OiA0OHB4O1xyXG4gICAgICAgICAgICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMGUwZTApO1xyXG4gICAgICAgICAgICBib3JkZXItdG9wLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgICAgICAgICBhbmltYXRpb246IHNwaW4gMXMgbGluZWFyIGluZmluaXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDE2cHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjNjY2KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR3JpZCAmIFNrZWxldG9uIHNoYXJlZCBzdHlsZXNcclxuICAgIC5sb2FkaW5nLWdyaWQsXHJcbiAgICAubG9hZGluZy1za2VsZXRvbiB7XHJcbiAgICAgICAgZGlzcGxheTogZ3JpZDtcclxuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCAxZnIpO1xyXG4gICAgICAgIGdhcDogMjBweDtcclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCAxZnIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDY0MHB4KSB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAuc2tlbGV0b24tY2FyZCB7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWNhcmQtYmFja2dyb3VuZCwgI2ZmZik7XHJcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yLCAjZTBlMGUwKTtcclxuICAgIH1cclxuXHJcbiAgICAuc2tlbGV0b24taW1hZ2Uge1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIGhlaWdodDogMjAwcHg7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLFxyXG4gICAgICAgICAgICAgICAgI2YwZjBmMCAyNSUsXHJcbiAgICAgICAgICAgICAgICAjZTBlMGUwIDUwJSxcclxuICAgICAgICAgICAgICAgICNmMGYwZjAgNzUlKTtcclxuICAgICAgICBiYWNrZ3JvdW5kLXNpemU6IDIwMDBweCAxMDAlO1xyXG4gICAgICAgIGFuaW1hdGlvbjogc2hpbW1lciAycyBpbmZpbml0ZTtcclxuICAgIH1cclxuXHJcbiAgICAuc2tlbGV0b24tY29udGVudCB7XHJcbiAgICAgICAgcGFkZGluZzogMTZweDtcclxuICAgIH1cclxuXHJcbiAgICAuc2tlbGV0b24tbGluZSB7XHJcbiAgICAgICAgaGVpZ2h0OiAxNnB4O1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEycHg7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLFxyXG4gICAgICAgICAgICAgICAgI2YwZjBmMCAyNSUsXHJcbiAgICAgICAgICAgICAgICAjZTBlMGUwIDUwJSxcclxuICAgICAgICAgICAgICAgICNmMGYwZjAgNzUlKTtcclxuICAgICAgICBiYWNrZ3JvdW5kLXNpemU6IDIwMDBweCAxMDAlO1xyXG4gICAgICAgIGFuaW1hdGlvbjogc2hpbW1lciAycyBpbmZpbml0ZTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcblxyXG4gICAgICAgICYtLXRpdGxlIHtcclxuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xyXG4gICAgICAgICAgICB3aWR0aDogNzAlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJi0tdGV4dCB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcclxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICAgICAgd2lkdGg6IDg1JTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTGlzdCBzcGVjaWZpY1xyXG4gICAgLmxvYWRpbmctbGlzdCB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgIGdhcDogMTJweDtcclxuICAgIH1cclxuXHJcbiAgICAuc2tlbGV0b24tbGlzdC1pdGVtIHtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGdhcDogMTZweDtcclxuICAgICAgICBwYWRkaW5nOiAxNnB4O1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWNhcmQtYmFja2dyb3VuZCwgI2ZmZik7XHJcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yLCAjZTBlMGUwKTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xyXG4gICAgfVxyXG5cclxuICAgIC5za2VsZXRvbi1hdmF0YXIge1xyXG4gICAgICAgIHdpZHRoOiA1NnB4O1xyXG4gICAgICAgIGhlaWdodDogNTZweDtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgICAgICAgZmxleC1zaHJpbms6IDA7XHJcbiAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLFxyXG4gICAgICAgICAgICAgICAgI2YwZjBmMCAyNSUsXHJcbiAgICAgICAgICAgICAgICAjZTBlMGUwIDUwJSxcclxuICAgICAgICAgICAgICAgICNmMGYwZjAgNzUlKTtcclxuICAgICAgICBiYWNrZ3JvdW5kLXNpemU6IDIwMDBweCAxMDAlO1xyXG4gICAgICAgIGFuaW1hdGlvbjogc2hpbW1lciAycyBpbmZpbml0ZTtcclxuICAgIH1cclxufSJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvbG9hZGluZy1zdGF0ZS9sb2FkaW5nLXN0YXRlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0k7SUFDSSw4QkFBQTtFQUNOO0VBRUU7SUFDSSw2QkFBQTtFQUFOO0FBQ0Y7QUFHQTtFQUNJO0lBQ0kseUJBQUE7RUFETjtBQUNGO0FBSUE7RUFDSSxXQUFBO0FBRko7QUFLSTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxhQUFBO0FBSFI7QUFLUTtFQUNJLFdBQUE7RUFDQSxZQUFBO0VBQ0EsOENBQUE7RUFDQSwrQ0FBQTtFQUNBLGtCQUFBO0VBQ0Esa0NBQUE7QUFIWjtBQU1RO0VBQ0ksZ0JBQUE7RUFDQSw4QkFBQTtBQUpaO0FBU0k7O0VBRUksYUFBQTtFQUNBLHFDQUFBO0VBQ0EsU0FBQTtBQVBSO0FBU1E7RUFOSjs7SUFPUSxxQ0FBQTtFQUxWO0FBQ0Y7QUFPUTtFQVZKOztJQVdRLDBCQUFBO0VBSFY7QUFDRjtBQU1JO0VBQ0ksbUJBQUE7RUFDQSxnQkFBQTtFQUNBLHdDQUFBO0VBQ0EsOENBQUE7QUFKUjtBQU9JO0VBQ0ksV0FBQTtFQUNBLGFBQUE7RUFDQSx5RUFBQTtFQUlBLDRCQUFBO0VBQ0EsOEJBQUE7QUFSUjtBQVdJO0VBQ0ksYUFBQTtBQVRSO0FBWUk7RUFDSSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSx5RUFBQTtFQUlBLDRCQUFBO0VBQ0EsOEJBQUE7RUFDQSxrQkFBQTtBQWJSO0FBZVE7RUFDSSxZQUFBO0VBQ0EsVUFBQTtBQWJaO0FBZ0JRO0VBQ0ksV0FBQTtBQWRaO0FBaUJRO0VBQ0ksZ0JBQUE7RUFDQSxVQUFBO0FBZlo7QUFvQkk7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxTQUFBO0FBbEJSO0FBcUJJO0VBQ0ksYUFBQTtFQUNBLFNBQUE7RUFDQSxhQUFBO0VBQ0Esd0NBQUE7RUFDQSw4Q0FBQTtFQUNBLG1CQUFBO0FBbkJSO0FBc0JJO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLGNBQUE7RUFDQSx5RUFBQTtFQUlBLDRCQUFBO0VBQ0EsOEJBQUE7QUF2QlI7QUFDQSxndExBQWd0TCIsInNvdXJjZXNDb250ZW50IjpbIkBrZXlmcmFtZXMgc2hpbW1lciB7XHJcbiAgICAwJSB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTEwMDBweCAwO1xyXG4gICAgfVxyXG5cclxuICAgIDEwMCUge1xyXG4gICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IDEwMDBweCAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIHNwaW4ge1xyXG4gICAgdG8ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi5sb2FkaW5nLXN0YXRlIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG5cclxuICAgIC8vIFNwaW5uZXJcclxuICAgIC5sb2FkaW5nLXNwaW5uZXIge1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgIHBhZGRpbmc6IDQ4cHg7XHJcblxyXG4gICAgICAgIC5zcGlubmVyIHtcclxuICAgICAgICAgICAgd2lkdGg6IDQ4cHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogNDhweDtcclxuICAgICAgICAgICAgYm9yZGVyOiA0cHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yLCAjZTBlMGUwKTtcclxuICAgICAgICAgICAgYm9yZGVyLXRvcC1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDFzIGxpbmVhciBpbmZpbml0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHAge1xyXG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAxNnB4O1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCwgIzY2Nik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEdyaWQgJiBTa2VsZXRvbiBzaGFyZWQgc3R5bGVzXHJcbiAgICAubG9hZGluZy1ncmlkLFxyXG4gICAgLmxvYWRpbmctc2tlbGV0b24ge1xyXG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XHJcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMywgMWZyKTtcclxuICAgICAgICBnYXA6IDIwcHg7XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAxMDI0cHgpIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgMWZyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkge1xyXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLnNrZWxldG9uLWNhcmQge1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XHJcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJhY2tncm91bmQsICNmZmYpO1xyXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlci1jb2xvciwgI2UwZTBlMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLnNrZWxldG9uLWltYWdlIHtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICBoZWlnaHQ6IDIwMHB4O1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZyxcclxuICAgICAgICAgICAgICAgICNmMGYwZjAgMjUlLFxyXG4gICAgICAgICAgICAgICAgI2UwZTBlMCA1MCUsXHJcbiAgICAgICAgICAgICAgICAjZjBmMGYwIDc1JSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC1zaXplOiAyMDAwcHggMTAwJTtcclxuICAgICAgICBhbmltYXRpb246IHNoaW1tZXIgMnMgaW5maW5pdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLnNrZWxldG9uLWNvbnRlbnQge1xyXG4gICAgICAgIHBhZGRpbmc6IDE2cHg7XHJcbiAgICB9XHJcblxyXG4gICAgLnNrZWxldG9uLWxpbmUge1xyXG4gICAgICAgIGhlaWdodDogMTZweDtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAxMnB4O1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZyxcclxuICAgICAgICAgICAgICAgICNmMGYwZjAgMjUlLFxyXG4gICAgICAgICAgICAgICAgI2UwZTBlMCA1MCUsXHJcbiAgICAgICAgICAgICAgICAjZjBmMGYwIDc1JSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC1zaXplOiAyMDAwcHggMTAwJTtcclxuICAgICAgICBhbmltYXRpb246IHNoaW1tZXIgMnMgaW5maW5pdGU7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG5cclxuICAgICAgICAmLS10aXRsZSB7XHJcbiAgICAgICAgICAgIGhlaWdodDogMjBweDtcclxuICAgICAgICAgICAgd2lkdGg6IDcwJTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICYtLXRleHQge1xyXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICY6bGFzdC1jaGlsZCB7XHJcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XHJcbiAgICAgICAgICAgIHdpZHRoOiA4NSU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIExpc3Qgc3BlY2lmaWNcclxuICAgIC5sb2FkaW5nLWxpc3Qge1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICBnYXA6IDEycHg7XHJcbiAgICB9XHJcblxyXG4gICAgLnNrZWxldG9uLWxpc3QtaXRlbSB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBnYXA6IDE2cHg7XHJcbiAgICAgICAgcGFkZGluZzogMTZweDtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jYXJkLWJhY2tncm91bmQsICNmZmYpO1xyXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlci1jb2xvciwgI2UwZTBlMCk7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuICAgIH1cclxuXHJcbiAgICAuc2tlbGV0b24tYXZhdGFyIHtcclxuICAgICAgICB3aWR0aDogNTZweDtcclxuICAgICAgICBoZWlnaHQ6IDU2cHg7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZyxcclxuICAgICAgICAgICAgICAgICNmMGYwZjAgMjUlLFxyXG4gICAgICAgICAgICAgICAgI2UwZTBlMCA1MCUsXHJcbiAgICAgICAgICAgICAgICAjZjBmMGYwIDc1JSk7XHJcbiAgICAgICAgYmFja2dyb3VuZC1zaXplOiAyMDAwcHggMTAwJTtcclxuICAgICAgICBhbmltYXRpb246IHNoaW1tZXIgMnMgaW5maW5pdGU7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 3869:
/*!*************************************************************!*\
  !*** ./src/app/features/community/services/maps.service.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MapsService: () => (/* binding */ MapsService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);



class MapsService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v2.0/community/maps`;
  }
  getLocations(type, pageNumber = 1, pageSize = 10) {
    let url = `${this.apiUrl}/locations?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (type !== undefined) {
      url += `&type=${type}`;
    }
    return this.http.get(url);
  }
  getLocation(id) {
    return this.http.get(`${this.apiUrl}/locations/${id}`);
  }
  checkIn(locationId, comment) {
    return this.http.post(`${this.apiUrl}/locations/${locationId}/check-in`, {
      comment
    });
  }
  addReview(locationId, rating, title, content) {
    return this.http.post(`${this.apiUrl}/locations/${locationId}/reviews`, {
      rating,
      title,
      content
    });
  }
  getNearbyLocations(lat, lng, radiusInKm = 10) {
    return this.http.get(`${this.apiUrl}/locations/nearby?lat=${lat}&lng=${lng}&radius=${radiusInKm}`);
  }
  static {
    this.ɵfac = function MapsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MapsService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: MapsService,
      factory: MapsService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 4797:
/*!****************************************************************************!*\
  !*** ./src/app/features/community/components/qa-list/qa-list.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QAListComponent: () => (/* binding */ QAListComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _qa_item_qa_item_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../qa-item/qa-item.component */ 6725);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_qa_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/qa.service */ 3580);





const _c0 = () => [1, 2, 3, 4];
function QAListComponent_div_18_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 13);
  }
}
function QAListComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, QAListComponent_div_18_div_1_Template, 1, 0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c0));
  }
}
function QAListComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "i", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h3", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Be the first to ask!");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
function QAListComponent_div_20_app_qa_item_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-qa-item", 18);
  }
  if (rf & 2) {
    const question_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("question", question_r1);
  }
}
function QAListComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, QAListComponent_div_20_app_qa_item_1_Template, 1, 1, "app-qa-item", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.questions);
  }
}
class QAListComponent {
  constructor(qaService) {
    this.qaService = qaService;
    this.questions = [];
    this.loading = true;
  }
  ngOnInit() {
    this.loadQuestions();
  }
  loadQuestions() {
    this.loading = true;
    this.qaService.getQuestions(1, 10).subscribe({
      next: result => {
        this.questions = result.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  static {
    this.ɵfac = function QAListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || QAListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_qa_service__WEBPACK_IMPORTED_MODULE_1__.QAService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: QAListComponent,
      selectors: [["app-qa-list"]],
      decls: 21,
      vars: 3,
      consts: [[1, "space-y-8", "animate-fade-in"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-6"], [1, "text-3xl", "font-black", "text-foreground", "tracking-tight", "uppercase", "italic"], [1, "text-primary"], [1, "text-muted-foreground", "font-bold", "text-xs", "uppercase", "tracking-widest", "mt-1"], [1, "bg-primary", "hover:bg-primary-dark", "text-white", "px-6", "py-3", "rounded-2xl", "font-black", "uppercase", "italic", "tracking-widest", "text-xs", "transition-all", "duration-300", "shadow-lg", "shadow-primary/20", "hover:scale-105", "active:scale-95"], [1, "flex", "items-center", "space-x-4"], [1, "px-4", "py-2", "rounded-xl", "bg-white/10", "text-foreground", "text-xs", "font-bold", "uppercase", "transition-all", "hover:bg-primary", "hover:text-white"], [1, "px-4", "py-2", "rounded-xl", "bg-white/5", "text-muted-foreground", "text-xs", "font-bold", "uppercase", "transition-all", "hover:bg-white/10"], ["class", "space-y-4", 4, "ngIf"], ["class", "flex flex-col items-center justify-center py-20 mica-effect rounded-3xl border border-white/5 bg-surface/10", 4, "ngIf"], [1, "space-y-4"], ["class", "h-48 rounded-3xl bg-surface/20 mica-effect animate-pulse", 4, "ngFor", "ngForOf"], [1, "h-48", "rounded-3xl", "bg-surface/20", "mica-effect", "animate-pulse"], [1, "flex", "flex-col", "items-center", "justify-center", "py-20", "mica-effect", "rounded-3xl", "border", "border-white/5", "bg-surface/10"], [1, "fa-solid", "fa-circle-question", "text-6xl", "text-muted-foreground/20", "mb-4"], [1, "text-xl", "font-black", "text-muted-foreground", "uppercase", "italic", "tracking-widest"], [3, "question", 4, "ngFor", "ngForOf"], [3, "question"]],
      template: function QAListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, " Q&A ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Knowledge");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, " Get expert help from the community ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "button", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, " Ask a Question ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 6)(12, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "Newest");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "Frequent");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "Unanswered");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](18, QAListComponent_div_18_Template, 2, 2, "div", 9)(19, QAListComponent_div_19_Template, 4, 0, "div", 10)(20, QAListComponent_div_20_Template, 2, 1, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](18);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.questions.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.questions.length > 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _qa_item_qa_item_component__WEBPACK_IMPORTED_MODULE_0__.QAItemComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 4815:
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/pagination/pagination.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PaginationComponent: () => (/* binding */ PaginationComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);




function PaginationComponent_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_button_6_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.goToPage(1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " 1 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function PaginationComponent_span_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function PaginationComponent_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_button_8_Template_button_click_0_listener() {
      const page_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.goToPage(page_r4));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const page_r4 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("pagination__page--active", page_r4 === ctx_r1.currentPage);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", page_r4, " ");
  }
}
function PaginationComponent_span_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function PaginationComponent_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_button_10_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.goToPage(ctx_r1.totalPages));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r1.totalPages, " ");
  }
}
class PaginationComponent {
  constructor() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalItems = 0;
    this.totalPages = 1;
    this.maxVisible = 5;
    this.pageChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
  }
  get pages() {
    const pages = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisible / 2));
    let endPage = Math.min(this.totalPages, startPage + this.maxVisible - 1);
    if (endPage - startPage < this.maxVisible - 1) {
      startPage = Math.max(1, endPage - this.maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  get showFirstPage() {
    return this.pages[0] > 1;
  }
  get showLastPage() {
    return this.pages[this.pages.length - 1] < this.totalPages;
  }
  get startItem() {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  get endItem() {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
  goToPage(page) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
  previousPage() {
    this.goToPage(this.currentPage - 1);
  }
  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
  static {
    this.ɵfac = function PaginationComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || PaginationComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: PaginationComponent,
      selectors: [["app-pagination"]],
      inputs: {
        currentPage: "currentPage",
        pageSize: "pageSize",
        totalItems: "totalItems",
        totalPages: "totalPages",
        maxVisible: "maxVisible"
      },
      outputs: {
        pageChange: "pageChange"
      },
      decls: 13,
      vars: 10,
      consts: [[1, "pagination"], [1, "pagination__info"], [1, "pagination__controls"], [1, "pagination__btn", 3, "click", "disabled"], [1, "fa-solid", "fa-chevron-left"], ["class", "pagination__btn pagination__page", 3, "click", 4, "ngIf"], ["class", "pagination__ellipsis", 4, "ngIf"], ["class", "pagination__btn pagination__page", 3, "pagination__page--active", "click", 4, "ngFor", "ngForOf"], [1, "fa-solid", "fa-chevron-right"], [1, "pagination__btn", "pagination__page", 3, "click"], [1, "pagination__ellipsis"]],
      template: function PaginationComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2)(4, "button", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_Template_button_click_4_listener() {
            return ctx.previousPage();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "i", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, PaginationComponent_button_6_Template, 2, 0, "button", 5)(7, PaginationComponent_span_7_Template, 2, 0, "span", 6)(8, PaginationComponent_button_8_Template, 2, 3, "button", 7)(9, PaginationComponent_span_9_Template, 2, 0, "span", 6)(10, PaginationComponent_button_10_Template, 2, 1, "button", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "button", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_Template_button_click_11_listener() {
            return ctx.nextPage();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "i", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate3"](" Showing ", ctx.startItem, " - ", ctx.endItem, " of ", ctx.totalItems, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.currentPage === 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showFirstPage);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showFirstPage && ctx.pages[0] > 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.pages);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showLastPage && ctx.pages[ctx.pages.length - 1] < ctx.totalPages - 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showLastPage);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.currentPage === ctx.totalPages);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf],
      styles: [".pagination[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  flex-wrap: wrap;\n}\n.pagination__info[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--text-muted, #666);\n}\n.pagination__controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.pagination__btn[_ngcontent-%COMP%] {\n  min-width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid var(--border-color, #e0e0e0);\n  background: var(--background, #fff);\n  color: var(--text-color, #333);\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.2s;\n  font-weight: 500;\n}\n.pagination__btn[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--primary-color-light, #e3f2fd);\n  border-color: var(--primary-color, #007bff);\n  color: var(--primary-color, #007bff);\n}\n.pagination__btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.pagination__page--active[_ngcontent-%COMP%] {\n  background: var(--primary-color, #007bff);\n  border-color: var(--primary-color, #007bff);\n  color: white;\n}\n.pagination__page--active[_ngcontent-%COMP%]:hover {\n  background: var(--primary-color-dark, #0056b3);\n  border-color: var(--primary-color-dark, #0056b3);\n  color: white;\n}\n.pagination__ellipsis[_ngcontent-%COMP%] {\n  padding: 0 4px;\n  color: var(--text-muted, #666);\n}\n@media (max-width: 640px) {\n  .pagination[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .pagination__info[_ngcontent-%COMP%] {\n    text-align: center;\n  }\n  .pagination__controls[_ngcontent-%COMP%] {\n    justify-content: center;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2luYXRpb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw4QkFBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0FBQ0o7QUFDSTtFQUNJLGVBQUE7RUFDQSw4QkFBQTtBQUNSO0FBRUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0FBQVI7QUFHSTtFQUNJLGVBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSw4Q0FBQTtFQUNBLG1DQUFBO0VBQ0EsOEJBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxvQkFBQTtFQUNBLGdCQUFBO0FBRFI7QUFHUTtFQUNJLCtDQUFBO0VBQ0EsMkNBQUE7RUFDQSxvQ0FBQTtBQURaO0FBSVE7RUFDSSxZQUFBO0VBQ0EsbUJBQUE7QUFGWjtBQU9RO0VBQ0kseUNBQUE7RUFDQSwyQ0FBQTtFQUNBLFlBQUE7QUFMWjtBQU9ZO0VBQ0ksOENBQUE7RUFDQSxnREFBQTtFQUNBLFlBQUE7QUFMaEI7QUFVSTtFQUNJLGNBQUE7RUFDQSw4QkFBQTtBQVJSO0FBV0k7RUEvREo7SUFnRVEsc0JBQUE7SUFDQSxvQkFBQTtFQVJOO0VBVU07SUFDSSxrQkFBQTtFQVJWO0VBV007SUFDSSx1QkFBQTtFQVRWO0FBQ0YiLCJmaWxlIjoicGFnaW5hdGlvbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5wYWdpbmF0aW9uIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgZ2FwOiAxNnB4O1xyXG4gICAgZmxleC13cmFwOiB3cmFwO1xyXG5cclxuICAgICZfX2luZm8ge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCwgIzY2Nik7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fY29udHJvbHMge1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICBnYXA6IDRweDtcclxuICAgIH1cclxuXHJcbiAgICAmX19idG4ge1xyXG4gICAgICAgIG1pbi13aWR0aDogNDBweDtcclxuICAgICAgICBoZWlnaHQ6IDQwcHg7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlci1jb2xvciwgI2UwZTBlMCk7XHJcbiAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZCwgI2ZmZik7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtY29sb3IsICMzMzMpO1xyXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnM7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuXHJcbiAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktY29sb3ItbGlnaHQsICNlM2YyZmQpO1xyXG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmOmRpc2FibGVkIHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMC41O1xyXG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19wYWdlIHtcclxuICAgICAgICAmLS1hY3RpdmUge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG5cclxuICAgICAgICAgICAgJjpob3ZlciB7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LWNvbG9yLWRhcmssICMwMDU2YjMpO1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLWRhcmssICMwMDU2YjMpO1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX2VsbGlwc2lzIHtcclxuICAgICAgICBwYWRkaW5nOiAwIDRweDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCwgIzY2Nik7XHJcbiAgICB9XHJcblxyXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDY0MHB4KSB7XHJcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcclxuXHJcbiAgICAgICAgJl9faW5mbyB7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICZfX2NvbnRyb2xzIHtcclxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsOEJBQUE7RUFDQSxTQUFBO0VBQ0EsZUFBQTtBQUNKO0FBQ0k7RUFDSSxlQUFBO0VBQ0EsOEJBQUE7QUFDUjtBQUVJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtBQUFSO0FBR0k7RUFDSSxlQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsOENBQUE7RUFDQSxtQ0FBQTtFQUNBLDhCQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0Esb0JBQUE7RUFDQSxnQkFBQTtBQURSO0FBR1E7RUFDSSwrQ0FBQTtFQUNBLDJDQUFBO0VBQ0Esb0NBQUE7QUFEWjtBQUlRO0VBQ0ksWUFBQTtFQUNBLG1CQUFBO0FBRlo7QUFPUTtFQUNJLHlDQUFBO0VBQ0EsMkNBQUE7RUFDQSxZQUFBO0FBTFo7QUFPWTtFQUNJLDhDQUFBO0VBQ0EsZ0RBQUE7RUFDQSxZQUFBO0FBTGhCO0FBVUk7RUFDSSxjQUFBO0VBQ0EsOEJBQUE7QUFSUjtBQVdJO0VBL0RKO0lBZ0VRLHNCQUFBO0lBQ0Esb0JBQUE7RUFSTjtFQVVNO0lBQ0ksa0JBQUE7RUFSVjtFQVdNO0lBQ0ksdUJBQUE7RUFUVjtBQUNGO0FBQ0EsdytHQUF3K0ciLCJzb3VyY2VzQ29udGVudCI6WyIucGFnaW5hdGlvbiB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGdhcDogMTZweDtcclxuICAgIGZsZXgtd3JhcDogd3JhcDtcclxuXHJcbiAgICAmX19pbmZvIHtcclxuICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQsICM2NjYpO1xyXG4gICAgfVxyXG5cclxuICAgICZfX2NvbnRyb2xzIHtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgZ2FwOiA0cHg7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fYnRuIHtcclxuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XHJcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMGUwZTApO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQsICNmZmYpO1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yLCAjMzMzKTtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzO1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcblxyXG4gICAgICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LWNvbG9yLWxpZ2h0LCAjZTNmMmZkKTtcclxuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICAgICAgY29sb3I6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJjpkaXNhYmxlZCB7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNTtcclxuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJl9fcGFnZSB7XHJcbiAgICAgICAgJi0tYWN0aXZlIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuXHJcbiAgICAgICAgICAgICY6aG92ZXIge1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1jb2xvci1kYXJrLCAjMDA1NmIzKTtcclxuICAgICAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyKC0tcHJpbWFyeS1jb2xvci1kYXJrLCAjMDA1NmIzKTtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19lbGxpcHNpcyB7XHJcbiAgICAgICAgcGFkZGluZzogMCA0cHg7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQsICM2NjYpO1xyXG4gICAgfVxyXG5cclxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkge1xyXG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XHJcblxyXG4gICAgICAgICZfX2luZm8ge1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAmX19jb250cm9scyB7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 4881:
/*!****************************************************************************************!*\
  !*** ./src/app/features/community/components/location-card/location-card.component.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocationCardComponent: () => (/* binding */ LocationCardComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _core_models_maps_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../core/models/maps.model */ 5319);





function LocationCardComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "i", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class LocationCardComponent {
  constructor() {
    this.onCheckIn = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
  }
  getLocationTypeName(type) {
    switch (type) {
      case _core_models_maps_model__WEBPACK_IMPORTED_MODULE_0__.LocationType.Showroom:
        return 'Showroom';
      case _core_models_maps_model__WEBPACK_IMPORTED_MODULE_0__.LocationType.ServiceCenter:
        return 'Service Center';
      case _core_models_maps_model__WEBPACK_IMPORTED_MODULE_0__.LocationType.SpareParts:
        return 'Spare Parts';
      case _core_models_maps_model__WEBPACK_IMPORTED_MODULE_0__.LocationType.ChargingStation:
        return 'Charging Station';
      case _core_models_maps_model__WEBPACK_IMPORTED_MODULE_0__.LocationType.GasStation:
        return 'Gas Station';
      default:
        return 'Automotive';
    }
  }
  static {
    this.ɵfac = function LocationCardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || LocationCardComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: LocationCardComponent,
      selectors: [["app-location-card"]],
      inputs: {
        location: "location"
      },
      outputs: {
        onCheckIn: "onCheckIn"
      },
      decls: 26,
      vars: 7,
      consts: [[1, "card", "mica-effect", "bg-surface/30", "p-4", "border", "border-white/5", "hover:border-primary/30", "transition-all", "duration-500", "hover:shadow-xl", "group"], [1, "flex", "gap-4"], [1, "w-24", "h-24", "rounded-2xl", "overflow-hidden", "border", "border-white/10", "shrink-0"], [1, "w-full", "h-full", "object-cover", "group-hover:scale-110", "transition-transform", "duration-500", 3, "src"], [1, "flex-1", "min-w-0"], [1, "flex", "items-start", "justify-between"], [1, "text-[9px]", "font-black", "uppercase", "tracking-widest", "text-primary", "mb-1"], ["class", "text-sky-500 text-xs", 4, "ngIf"], [1, "font-bold", "text-foreground", "text-base", "truncate", "group-hover:text-primary", "transition-colors"], [1, "text-xs", "text-muted-foreground", "line-clamp-1", "mb-2"], [1, "flex", "items-center", "space-x-3", "mt-auto"], [1, "flex", "items-center", "space-x-1"], [1, "fa-solid", "fa-star", "text-yellow-500", "text-[10px]"], [1, "text-xs", "font-black", "text-foreground"], [1, "text-[10px]", "text-muted-foreground/60", "font-bold", "uppercase"], [1, "mt-4", "pt-4", "border-t", "border-white/5", "flex", "gap-2"], [1, "flex-1", "bg-white/5", "hover:bg-primary/20", "text-foreground", "text-[10px]", "font-black", "uppercase", "tracking-widest", "py-2.5", "rounded-xl", "border", "border-white/5", "transition-all", 3, "click"], [1, "fa-solid", "fa-location-dot", "mr-1.5"], [1, "px-3", "bg-white/5", "hover:bg-white/10", "text-foreground", "py-2.5", "rounded-xl", "border", "border-white/5", "transition-all"], [1, "fa-solid", "fa-share-nodes", "text-[10px]"], [1, "text-sky-500", "text-xs"], [1, "fa-solid", "fa-circle-check"]],
      template: function LocationCardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "img", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 4)(5, "div", 5)(6, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, LocationCardComponent_div_8_Template, 2, 0, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "h3", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "p", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 10)(14, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](15, "i", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "span", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 15)(21, "button", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function LocationCardComponent_Template_button_click_21_listener() {
            return ctx.onCheckIn.emit(ctx.location);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](22, "i", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, " Check-in ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "button", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](25, "i", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx.location.featuredImageUrl || "assets/images/location-placeholder.jpg", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.getLocationTypeName(ctx.location.type));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.location.isVerified);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.location.name);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.location.address);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.location.rating);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx.location.reviewCount, " Reviews");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 5319:
/*!*******************************************!*\
  !*** ./src/app/core/models/maps.model.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocationType: () => (/* binding */ LocationType)
/* harmony export */ });
var LocationType;
(function (LocationType) {
  LocationType[LocationType["Showroom"] = 0] = "Showroom";
  LocationType[LocationType["ServiceCenter"] = 1] = "ServiceCenter";
  LocationType[LocationType["SpareParts"] = 2] = "SpareParts";
  LocationType[LocationType["ChargingStation"] = 3] = "ChargingStation";
  LocationType[LocationType["GasStation"] = 4] = "GasStation";
  LocationType[LocationType["Other"] = 5] = "Other";
})(LocationType || (LocationType = {}));

/***/ }),

/***/ 5577:
/*!************************************************************************!*\
  !*** ./src/app/shared/components/empty-state/empty-state.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EmptyStateComponent: () => (/* binding */ EmptyStateComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);



function EmptyStateComponent_button_7_i_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "i");
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"]("fa-solid " + ctx_r0.actionIcon);
  }
}
function EmptyStateComponent_button_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, EmptyStateComponent_button_7_i_1_Template, 1, 2, "i", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.actionIcon);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.actionText, " ");
  }
}
class EmptyStateComponent {
  constructor() {
    this.icon = 'fa-inbox';
    this.message = 'No items found';
    this.description = 'Try adjusting your filters or search terms';
  }
  static {
    this.ɵfac = function EmptyStateComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || EmptyStateComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: EmptyStateComponent,
      selectors: [["app-empty-state"]],
      inputs: {
        icon: "icon",
        message: "message",
        description: "description",
        actionText: "actionText",
        actionIcon: "actionIcon"
      },
      decls: 8,
      vars: 5,
      consts: [[1, "empty-state"], [1, "empty-state__icon"], [1, "empty-state__message"], [1, "empty-state__description"], ["class", "empty-state__action", 4, "ngIf"], [1, "empty-state__action"], [3, "class", 4, "ngIf"]],
      template: function EmptyStateComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "i");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, EmptyStateComponent_button_7_Template, 3, 2, "button", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"]("fa-solid " + ctx.icon);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.message);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.description);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.actionText);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf],
      styles: [".empty-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 64px 24px;\n  text-align: center;\n}\n.empty-state__icon[_ngcontent-%COMP%] {\n  font-size: 64px;\n  color: var(--text-muted, #999);\n  margin-bottom: 24px;\n  opacity: 0.5;\n}\n.empty-state__message[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  color: var(--text-color, #333);\n  margin-bottom: 8px;\n}\n.empty-state__description[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--text-muted, #666);\n  margin-bottom: 24px;\n  max-width: 400px;\n}\n.empty-state__action[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  border-radius: 8px;\n  border: none;\n  background: var(--primary-color, #007bff);\n  color: white;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.empty-state__action[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVtcHR5LXN0YXRlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7QUFDSjtBQUNJO0VBQ0ksZUFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0FBQ1I7QUFFSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLDhCQUFBO0VBQ0Esa0JBQUE7QUFBUjtBQUdJO0VBQ0ksZUFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFDQSxnQkFBQTtBQURSO0FBSUk7RUFDSSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLHlDQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLG9CQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtBQUZSO0FBSVE7RUFDSSwyQkFBQTtFQUNBLDZDQUFBO0FBRloiLCJmaWxlIjoiZW1wdHktc3RhdGUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZW1wdHktc3RhdGUge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICBwYWRkaW5nOiA2NHB4IDI0cHg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcblxyXG4gICAgJl9faWNvbiB7XHJcbiAgICAgICAgZm9udC1zaXplOiA2NHB4O1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjOTk5KTtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG4gICAgICAgIG9wYWNpdHk6IDAuNTtcclxuICAgIH1cclxuXHJcbiAgICAmX19tZXNzYWdlIHtcclxuICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvciwgIzMzMyk7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG4gICAgfVxyXG5cclxuICAgICZfX2Rlc2NyaXB0aW9uIHtcclxuICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQsICM2NjYpO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XHJcbiAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcclxuICAgIH1cclxuXHJcbiAgICAmX19hY3Rpb24ge1xyXG4gICAgICAgIHBhZGRpbmc6IDEycHggMjRweDtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktY29sb3IsICMwMDdiZmYpO1xyXG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcztcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgICAgICAgZ2FwOiA4cHg7XHJcblxyXG4gICAgICAgICY6aG92ZXIge1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSgwLCAxMjMsIDI1NSwgMC4zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZW1wdHktc3RhdGUvZW1wdHktc3RhdGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtBQUNKO0FBQ0k7RUFDSSxlQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7QUFDUjtBQUVJO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EsOEJBQUE7RUFDQSxrQkFBQTtBQUFSO0FBR0k7RUFDSSxlQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0FBRFI7QUFJSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxZQUFBO0VBQ0EseUNBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0Esb0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0FBRlI7QUFJUTtFQUNJLDJCQUFBO0VBQ0EsNkNBQUE7QUFGWjtBQUNBLG95RUFBb3lFIiwic291cmNlc0NvbnRlbnQiOlsiLmVtcHR5LXN0YXRlIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgcGFkZGluZzogNjRweCAyNHB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG5cclxuICAgICZfX2ljb24ge1xyXG4gICAgICAgIGZvbnQtc2l6ZTogNjRweDtcclxuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCwgIzk5OSk7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcclxuICAgICAgICBvcGFjaXR5OiAwLjU7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fbWVzc2FnZSB7XHJcbiAgICAgICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtY29sb3IsICMzMzMpO1xyXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDhweDtcclxuICAgIH1cclxuXHJcbiAgICAmX19kZXNjcmlwdGlvbiB7XHJcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkLCAjNjY2KTtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xyXG4gICAgICAgIG1heC13aWR0aDogNDAwcHg7XHJcbiAgICB9XHJcblxyXG4gICAgJl9fYWN0aW9uIHtcclxuICAgICAgICBwYWRkaW5nOiAxMnB4IDI0cHg7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3M7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgIGdhcDogOHB4O1xyXG5cclxuICAgICAgICAmOmhvdmVyIHtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xyXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxMnB4IHJnYmEoMCwgMTIzLCAyNTUsIDAuMyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 5601:
/*!****************************************************************************************!*\
  !*** ./src/app/features/community/components/maps-explorer/maps-explorer.component.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MapsExplorerComponent: () => (/* binding */ MapsExplorerComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _location_card_location_card_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../location-card/location-card.component */ 4881);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_maps_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/maps.service */ 3869);





const _c0 = () => [1, 2, 3, 4];
function MapsExplorerComponent_div_23_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 16);
  }
}
function MapsExplorerComponent_div_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, MapsExplorerComponent_div_23_div_1_Template, 1, 0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c0));
  }
}
function MapsExplorerComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "i", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h3", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "No locations nearby");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
function MapsExplorerComponent_div_25_app_location_card_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "app-location-card", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("onCheckIn", function MapsExplorerComponent_div_25_app_location_card_1_Template_app_location_card_onCheckIn_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r1.handleCheckIn($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const loc_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("location", loc_r3);
  }
}
function MapsExplorerComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, MapsExplorerComponent_div_25_app_location_card_1_Template, 1, 1, "app-location-card", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.locations);
  }
}
class MapsExplorerComponent {
  constructor(mapsService) {
    this.mapsService = mapsService;
    this.locations = [];
    this.loading = true;
  }
  ngOnInit() {
    this.loadLocations();
  }
  loadLocations() {
    this.loading = true;
    this.mapsService.getLocations().subscribe({
      next: result => {
        this.locations = result.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  handleCheckIn(location) {
    // Implement check-in logic here
    console.log('Checking into', location.name);
  }
  static {
    this.ɵfac = function MapsExplorerComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || MapsExplorerComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_maps_service__WEBPACK_IMPORTED_MODULE_1__.MapsService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: MapsExplorerComponent,
      selectors: [["app-maps-explorer"]],
      decls: 26,
      vars: 3,
      consts: [[1, "space-y-8", "animate-fade-in"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-6"], [1, "text-3xl", "font-black", "text-foreground", "tracking-tight", "uppercase", "italic"], [1, "text-primary"], [1, "text-muted-foreground", "font-bold", "text-xs", "uppercase", "tracking-widest", "mt-1"], [1, "flex", "mica-effect", "border", "border-white/10", "rounded-2xl", "overflow-hidden"], [1, "px-6", "py-3", "bg-primary", "text-white", "font-black", "text-[10px]", "uppercase", "tracking-widest", "italic"], [1, "px-6", "py-3", "text-muted-foreground", "font-black", "text-[10px]", "uppercase", "tracking-widest", "italic", "hover:bg-white/5", "transition-all"], [1, "flex", "items-center", "space-x-2", "overflow-x-auto", "pb-2", "scrollbar-none"], [1, "shrink-0", "px-5", "py-2.5", "rounded-2xl", "bg-white/10", "text-foreground", "text-[10px]", "font-black", "uppercase", "tracking-widest", "border", "border-white/5", "transition-all", "hover:bg-primary", "hover:text-white"], [1, "shrink-0", "px-5", "py-2.5", "rounded-2xl", "bg-white/5", "text-muted-foreground", "text-[10px]", "font-black", "uppercase", "tracking-widest", "border", "border-white/5", "transition-all", "hover:bg-white/10"], ["class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6", 4, "ngIf"], ["class", "flex flex-col items-center justify-center py-20 mica-effect rounded-3xl border border-white/5 bg-surface/10", 4, "ngIf"], ["class", "grid grid-cols-1 lg:grid-cols-2 gap-6", 4, "ngIf"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-2", "gap-6"], ["class", "h-40 rounded-3xl bg-surface/20 mica-effect animate-pulse", 4, "ngFor", "ngForOf"], [1, "h-40", "rounded-3xl", "bg-surface/20", "mica-effect", "animate-pulse"], [1, "flex", "flex-col", "items-center", "justify-center", "py-20", "mica-effect", "rounded-3xl", "border", "border-white/5", "bg-surface/10"], [1, "fa-solid", "fa-map-location-dot", "text-6xl", "text-muted-foreground/20", "mb-4"], [1, "text-xl", "font-black", "text-muted-foreground", "uppercase", "italic", "tracking-widest"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [3, "location", "onCheckIn", 4, "ngFor", "ngForOf"], [3, "onCheckIn", "location"]],
      template: function MapsExplorerComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, " Automotive ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Near You");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, " Discover service centers, showrooms, and more ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 5)(10, "button", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11, "Grid View");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "Map View");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 8)(15, "button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "All");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "Showrooms");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, "Service Centers");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, "Charging");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](23, MapsExplorerComponent_div_23_Template, 2, 2, "div", 11)(24, MapsExplorerComponent_div_24_Template, 4, 0, "div", 12)(25, MapsExplorerComponent_div_25_Template, 2, 1, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](23);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.locations.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.locations.length > 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _location_card_location_card_component__WEBPACK_IMPORTED_MODULE_0__.LocationCardComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 5821:
/*!*************************************************************!*\
  !*** ./src/app/features/community/services/news.service.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NewsService: () => (/* binding */ NewsService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 5312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);



class NewsService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/v2.0/community/news`;
  }
  getArticles(pageNumber = 1, pageSize = 10) {
    return this.http.get(`${this.apiUrl}/articles?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  getArticle(id) {
    return this.http.get(`${this.apiUrl}/articles/${id}`);
  }
  likeArticle(id) {
    return this.http.post(`${this.apiUrl}/articles/${id}/like`, {});
  }
  addComment(id, content) {
    return this.http.post(`${this.apiUrl}/articles/${id}/comments`, {
      content
    });
  }
  getFeaturedArticles() {
    return this.http.get(`${this.apiUrl}/articles/featured`);
  }
  static {
    this.ɵfac = function NewsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NewsService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: NewsService,
      factory: NewsService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 6175:
/*!***************************************************************!*\
  !*** ./src/app/features/community/services/guides.service.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GuidesService: () => (/* binding */ GuidesService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 4054);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 5312);
/* harmony import */ var _models_guide_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/guide.model */ 9466);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);





class GuidesService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/community/guides`;
  }
  getGuides(filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams();
    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
      if (filters.category !== undefined) params = params.set('category', filters.category.toString());
      if (filters.difficulty !== undefined) params = params.set('difficulty', filters.difficulty.toString());
      if (filters.searchTerm) params = params.set('searchTerm', filters.searchTerm);
      if (filters.isFeatured !== undefined) params = params.set('isFeatured', filters.isFeatured.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortDescending !== undefined) params = params.set('sortDescending', filters.sortDescending.toString());
    }
    return this.http.get(this.apiUrl, {
      params
    });
  }
  getGuideById(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createGuide(request) {
    return this.http.post(this.apiUrl, request);
  }
  updateGuide(id, request) {
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }
  rateGuide(request) {
    return this.http.post(`${this.apiUrl}/${request.guideId}/rate`, request);
  }
  bookmarkGuide(id, notes) {
    return this.http.post(`${this.apiUrl}/${id}/bookmark`, {
      notes
    });
  }
  getBookmarkedGuides(page = 1, pageSize = 10) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());
    return this.http.get(`${this.apiUrl}/bookmarks`, {
      params
    });
  }
  getCategories() {
    return this.http.get(`${this.apiUrl}/categories`);
  }
  getDifficulties() {
    return this.http.get(`${this.apiUrl}/difficulties`);
  }
  // Helper methods
  getCategoryName(category) {
    return _models_guide_model__WEBPACK_IMPORTED_MODULE_1__.GuideCategory[category] || 'Unknown';
  }
  getDifficultyName(difficulty) {
    return _models_guide_model__WEBPACK_IMPORTED_MODULE_1__.GuideDifficulty[difficulty] || 'Unknown';
  }
  getDifficultyColor(difficulty) {
    switch (difficulty) {
      case _models_guide_model__WEBPACK_IMPORTED_MODULE_1__.GuideDifficulty.Beginner:
        return 'text-green-600';
      case _models_guide_model__WEBPACK_IMPORTED_MODULE_1__.GuideDifficulty.Intermediate:
        return 'text-yellow-600';
      case _models_guide_model__WEBPACK_IMPORTED_MODULE_1__.GuideDifficulty.Advanced:
        return 'text-orange-600';
      case _models_guide_model__WEBPACK_IMPORTED_MODULE_1__.GuideDifficulty.Expert:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }
  static {
    this.ɵfac = function GuidesService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || GuidesService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: GuidesService,
      factory: GuidesService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 6725:
/*!****************************************************************************!*\
  !*** ./src/app/features/community/components/qa-item/qa-item.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QAItemComponent: () => (/* binding */ QAItemComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);





const _c0 = a0 => ["/community/qa", a0];
function QAItemComponent_span_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Urgent");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function QAItemComponent_span_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("+", ctx_r0.question.bountyAmount, " Bounty");
  }
}
function QAItemComponent_span_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tag_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" #", tag_r2, " ");
  }
}
class QAItemComponent {
  getTags(tagsString) {
    if (!tagsString) return [];
    try {
      return JSON.parse(tagsString);
    } catch {
      return tagsString.split(',').map(t => t.trim());
    }
  }
  static {
    this.ɵfac = function QAItemComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || QAItemComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: QAItemComponent,
      selectors: [["app-qa-item"]],
      inputs: {
        question: "question"
      },
      decls: 35,
      vars: 18,
      consts: [[1, "card", "mica-effect", "bg-surface/30", "p-5", "border", "border-white/5", "hover:border-primary/20", "transition-all", "duration-300", "group"], [1, "flex", "gap-5"], [1, "flex", "flex-col", "items-center", "space-y-4"], [1, "flex", "flex-col", "items-center"], [1, "text-lg", "font-black", "text-foreground"], [1, "text-[9px]", "font-black", "uppercase", "tracking-tighter", "text-muted-foreground"], [1, "flex", "flex-col", "items-center", "px-2", "py-1.5", "rounded-xl", "border", 3, "ngClass"], [1, "text-lg", "font-black"], [1, "text-[9px]", "font-black", "uppercase", "tracking-tighter"], [1, "flex", "flex-col", "items-center", "text-muted-foreground/40"], [1, "text-xs", "font-bold"], [1, "fa-regular", "fa-eye", "text-[10px]"], [1, "flex-1", "space-y-3"], [1, "flex", "items-center", "space-x-2"], ["class", "px-2 py-0.5 rounded bg-red-500 text-white text-[9px] font-black uppercase", 4, "ngIf"], ["class", "px-2 py-0.5 rounded bg-yellow-500/90 text-black text-[9px] font-black uppercase", 4, "ngIf"], [1, "text-lg", "font-bold", "text-foreground", "group-hover:text-primary", "transition-colors", "cursor-pointer", "line-clamp-2"], [3, "routerLink"], [1, "text-sm", "text-muted-foreground/80", "line-clamp-2", "leading-relaxed"], [1, "pt-2", "flex", "flex-wrap", "gap-2"], ["class", "px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg border border-primary/5 hover:bg-primary/20 cursor-pointer transition-colors", 4, "ngFor", "ngForOf"], [1, "pt-4", "flex", "items-center", "justify-between", "border-t", "border-white/5"], [1, "w-6", "h-6", "rounded-full", "bg-purple-500/20", "flex", "items-center", "justify-center", "text-[10px]", "font-black", "border", "border-white/10", "uppercase", "italic"], [1, "text-xs", "font-bold", "text-foreground/60"], [1, "px-2", "py-0.5", "rounded", "bg-red-500", "text-white", "text-[9px]", "font-black", "uppercase"], [1, "px-2", "py-0.5", "rounded", "bg-yellow-500/90", "text-black", "text-[9px]", "font-black", "uppercase"], [1, "px-3", "py-1", "bg-primary/10", "text-primary", "text-[10px]", "font-black", "rounded-lg", "border", "border-primary/5", "hover:bg-primary/20", "cursor-pointer", "transition-colors"]],
      template: function QAItemComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Votes");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 6)(9, "span", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Answers");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 9)(14, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "i", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 12)(18, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](19, QAItemComponent_span_19_Template, 2, 0, "span", 14)(20, QAItemComponent_span_20_Template, 2, 1, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "h3", 16)(22, "a", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "p", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](27, QAItemComponent_span_27_Template, 2, 1, "span", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 21)(29, "div", 13)(30, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](34, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.question.upvotesCount - ctx.question.downvotesCount);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx.question.hasAcceptedAnswer ? "bg-green-500/10 border-green-500/30 text-green-500" : "border-white/10 text-muted-foreground");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.question.answersCount);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.question.viewsCount);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.question.priority === 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.question.bountyAmount > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](16, _c0, ctx.question.id));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.question.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.question.content, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.getTags(ctx.question.tags));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", (ctx.question.user == null ? null : ctx.question.user.firstName == null ? null : ctx.question.user.firstName[0]) || "Q", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", ctx.question.user == null ? null : ctx.question.user.firstName, " asked ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](34, 13, ctx.question.createdAt, "shortTime"), "");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DatePipe, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8181:
/*!********************************************************************************!*\
  !*** ./src/app/features/community/components/news-list/news-list.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NewsListComponent: () => (/* binding */ NewsListComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _news_card_news_card_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../news-card/news-card.component */ 9865);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _services_news_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/news.service */ 5821);





const _c0 = () => [1, 2, 3, 4, 5, 6];
function NewsListComponent_div_13_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 13);
  }
}
function NewsListComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, NewsListComponent_div_13_div_1_Template, 1, 0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c0));
  }
}
function NewsListComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "i", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h3", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "No articles found");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
function NewsListComponent_div_15_app_news_card_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-news-card", 18);
  }
  if (rf & 2) {
    const article_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("article", article_r1);
  }
}
function NewsListComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, NewsListComponent_div_15_app_news_card_1_Template, 1, 1, "app-news-card", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.articles);
  }
}
class NewsListComponent {
  constructor(newsService) {
    this.newsService = newsService;
    this.articles = [];
    this.loading = true;
  }
  ngOnInit() {
    this.loadNews();
  }
  loadNews() {
    this.loading = true;
    this.newsService.getArticles(1, 12).subscribe({
      next: result => {
        this.articles = result.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  static {
    this.ɵfac = function NewsListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NewsListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_news_service__WEBPACK_IMPORTED_MODULE_1__.NewsService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: NewsListComponent,
      selectors: [["app-news-list"]],
      decls: 16,
      vars: 3,
      consts: [[1, "space-y-8", "animate-fade-in"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4"], [1, "text-3xl", "font-black", "text-foreground", "tracking-tight", "uppercase", "italic"], [1, "text-primary"], [1, "text-muted-foreground", "font-bold", "text-xs", "uppercase", "tracking-widest", "mt-1"], [1, "flex", "items-center", "space-x-2"], [1, "mica-effect", "bg-white/5", "border", "border-white/10", "rounded-xl", "px-4", "py-2", "flex", "items-center"], [1, "fa-solid", "fa-magnifying-glass", "text-muted-foreground", "mr-3"], ["type", "text", "placeholder", "Search news...", 1, "bg-transparent", "border-none", "outline-none", "text-sm", "font-bold", "w-48"], ["class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", 4, "ngIf"], ["class", "flex flex-col items-center justify-center py-20 mica-effect rounded-3xl border border-white/5 bg-surface/10", 4, "ngIf"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6"], ["class", "h-[400px] rounded-2xl bg-surface/20 mica-effect animate-pulse", 4, "ngFor", "ngForOf"], [1, "h-[400px]", "rounded-2xl", "bg-surface/20", "mica-effect", "animate-pulse"], [1, "flex", "flex-col", "items-center", "justify-center", "py-20", "mica-effect", "rounded-3xl", "border", "border-white/5", "bg-surface/10"], [1, "hugeicons-folder-open", "text-6xl", "text-muted-foreground/20", "mb-4"], [1, "text-xl", "font-black", "text-muted-foreground", "uppercase", "italic", "tracking-widest"], [3, "article", 4, "ngFor", "ngForOf"], [3, "article"]],
      template: function NewsListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, " Community ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "News");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, " Latest updates from the automotive world ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 5)(10, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "i", 7)(12, "input", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, NewsListComponent_div_13_Template, 2, 2, "div", 9)(14, NewsListComponent_div_14_Template, 4, 0, "div", 10)(15, NewsListComponent_div_15_Template, 2, 1, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.articles.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.articles.length > 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _news_card_news_card_component__WEBPACK_IMPORTED_MODULE_0__.NewsCardComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8989:
/*!********************************************************************!*\
  !*** ./src/app/shared/components/list-view/list-view.component.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListViewComponent: () => (/* binding */ ListViewComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 7580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _loading_state_loading_state_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../loading-state/loading-state.component */ 3741);
/* harmony import */ var _empty_state_empty_state_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../empty-state/empty-state.component */ 5577);
/* harmony import */ var _pagination_pagination_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pagination/pagination.component */ 4815);







const _c0 = ["itemTemplate"];
const _c1 = [[["", "filters", ""]]];
const _c2 = ["[filters]"];
const _c3 = a0 => ({
  $implicit: a0
});
function ListViewComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵprojection"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function ListViewComponent_app_loading_state_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "app-loading-state", 8);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("type", "grid")("count", ctx_r0.config.gridCols || 3);
  }
}
function ListViewComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 9)(1, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "i", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ListViewComponent_div_3_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r0.onRetry());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "i", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, " Try Again ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r0.error);
  }
}
function ListViewComponent_app_empty_state_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "app-empty-state", 14);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("message", ctx_r0.emptyMessage)("description", ctx_r0.emptyDescription);
  }
}
function ListViewComponent_div_5_ng_container_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainer"](0);
  }
}
function ListViewComponent_div_5_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, ListViewComponent_div_5_ng_container_1_ng_container_1_Template, 1, 0, "ng-container", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngTemplateOutlet", ctx_r0.itemTemplate || null)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](2, _c3, item_r3));
  }
}
function ListViewComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, ListViewComponent_div_5_ng_container_1_Template, 2, 4, "ng-container", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngStyle", ctx_r0.gridStyle);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r0.items)("ngForTrackBy", ctx_r0.trackByFn);
  }
}
function ListViewComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 18)(1, "app-pagination", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("pageChange", function ListViewComponent_div_6_Template_app_pagination_pageChange_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r4);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r0.onPageChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("currentPage", ctx_r0.pagination.currentPage)("pageSize", ctx_r0.pagination.pageSize)("totalItems", ctx_r0.pagination.totalItems)("totalPages", ctx_r0.pagination.totalPages);
  }
}
class ListViewComponent {
  constructor() {
    /**
     * Array of items to display
     */
    this.items = [];
    /**
     * Loading state
     */
    this.loading = false;
    /**
     * Error message
     */
    this.error = null;
    /**
     * Configuration
     */
    this.config = {
      showPagination: true,
      gridCols: 3,
      gap: '20px'
    };
    /**
     * Empty state message
     */
    this.emptyMessage = 'No items found';
    /**
     * Empty state description
     */
    this.emptyDescription = 'Try adjusting your filters';
    /**
     * Item template
     */
    this.itemTemplate = null;
    /**
     * Page change event
     */
    this.pageChange = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    /**
     * Retry event (when error occurs)
     */
    this.retry = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
  }
  get gridStyle() {
    return {
      'display': 'grid',
      'grid-template-columns': `repeat(${this.config.gridCols}, minmax(0, 1fr))`,
      'gap': this.config.gap
    };
  }
  get hasFilters() {
    // Returns true if filters content is projected
    return true; // Simplified - Angular checks content projection automatically
  }
  trackByFn(index, item) {
    return item.id || index;
  }
  onPageChange(page) {
    this.pageChange.emit(page);
  }
  onRetry() {
    this.retry.emit();
  }
  static {
    this.ɵfac = function ListViewComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || ListViewComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: ListViewComponent,
      selectors: [["app-list-view"]],
      contentQueries: function ListViewComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵcontentQuery"](dirIndex, _c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.itemTemplate = _t.first);
        }
      },
      inputs: {
        items: "items",
        loading: "loading",
        error: "error",
        config: "config",
        pagination: "pagination",
        emptyMessage: "emptyMessage",
        emptyDescription: "emptyDescription"
      },
      outputs: {
        pageChange: "pageChange",
        retry: "retry"
      },
      ngContentSelectors: _c2,
      decls: 7,
      vars: 6,
      consts: [[1, "list-view"], ["class", "list-view__filters", 4, "ngIf"], [3, "type", "count", 4, "ngIf"], ["class", "list-view__error", 4, "ngIf"], [3, "message", "description", 4, "ngIf"], ["class", "list-view__grid", 3, "ngStyle", 4, "ngIf"], ["class", "list-view__pagination", 4, "ngIf"], [1, "list-view__filters"], [3, "type", "count"], [1, "list-view__error"], [1, "error-card"], [1, "fa-solid", "fa-exclamation-triangle"], [1, "btn", "btn-primary", 3, "click"], [1, "fa-solid", "fa-rotate-right"], [3, "message", "description"], [1, "list-view__grid", 3, "ngStyle"], [4, "ngFor", "ngForOf", "ngForTrackBy"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "list-view__pagination"], [3, "pageChange", "currentPage", "pageSize", "totalItems", "totalPages"]],
      template: function ListViewComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵprojectionDef"](_c1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, ListViewComponent_div_1_Template, 2, 0, "div", 1)(2, ListViewComponent_app_loading_state_2_Template, 1, 2, "app-loading-state", 2)(3, ListViewComponent_div_3_Template, 8, 1, "div", 3)(4, ListViewComponent_app_empty_state_4_Template, 1, 2, "app-empty-state", 4)(5, ListViewComponent_div_5_Template, 2, 3, "div", 5)(6, ListViewComponent_div_6_Template, 2, 4, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.hasFilters);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.error && !ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.loading && !ctx.error && ctx.items.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.loading && !ctx.error && ctx.items.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.config.showPagination && ctx.pagination && ctx.items.length > 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgStyle, _loading_state_loading_state_component__WEBPACK_IMPORTED_MODULE_0__.LoadingStateComponent, _empty_state_empty_state_component__WEBPACK_IMPORTED_MODULE_1__.EmptyStateComponent, _pagination_pagination_component__WEBPACK_IMPORTED_MODULE_2__.PaginationComponent],
      styles: [".list-view[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.list-view__filters[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n@media (max-width: 1024px) {\n  .list-view__grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;\n  }\n}\n@media (max-width: 640px) {\n  .list-view__grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;\n  }\n}\n.list-view__error[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 48px 24px;\n}\n.list-view__error[_ngcontent-%COMP%]   .error-card[_ngcontent-%COMP%] {\n  text-align: center;\n  max-width: 400px;\n}\n.list-view__error[_ngcontent-%COMP%]   .error-card[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 48px;\n  color: var(--danger-color, #dc3545);\n  margin-bottom: 16px;\n}\n.list-view__error[_ngcontent-%COMP%]   .error-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: var(--text-color, #333);\n  margin-bottom: 24px;\n}\n.list-view__error[_ngcontent-%COMP%]   .error-card[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  border-radius: 8px;\n  border: none;\n  background: var(--primary-color, #007bff);\n  color: white;\n  cursor: pointer;\n  font-weight: 600;\n  transition: all 0.3s;\n}\n.list-view__error[_ngcontent-%COMP%]   .error-card[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);\n}\n.list-view__error[_ngcontent-%COMP%]   .error-card[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 14px;\n  margin-right: 8px;\n  color: white;\n}\n.list-view__pagination[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  margin-top: 32px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpc3Qtdmlldy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7QUFDSjtBQUNJO0VBQ0ksbUJBQUE7QUFDUjtBQUdRO0VBREo7SUFFUSwyREFBQTtFQUFWO0FBQ0Y7QUFFUTtFQUxKO0lBTVEsMkRBQUE7RUFDVjtBQUNGO0FBRUk7RUFDSSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtBQUFSO0FBRVE7RUFDSSxrQkFBQTtFQUNBLGdCQUFBO0FBQVo7QUFFWTtFQUNJLGVBQUE7RUFDQSxtQ0FBQTtFQUNBLG1CQUFBO0FBQWhCO0FBR1k7RUFDSSw4QkFBQTtFQUNBLG1CQUFBO0FBRGhCO0FBSVk7RUFDSSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLHlDQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLG9CQUFBO0FBRmhCO0FBSWdCO0VBQ0ksMkJBQUE7RUFDQSw2Q0FBQTtBQUZwQjtBQUtnQjtFQUNJLGVBQUE7RUFDQSxpQkFBQTtFQUNBLFlBQUE7QUFIcEI7QUFTSTtFQUNJLGFBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0FBUFIiLCJmaWxlIjoibGlzdC12aWV3LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxpc3QtdmlldyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGdhcDogMjRweDtcclxuXHJcbiAgICAmX19maWx0ZXJzIHtcclxuICAgICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xyXG4gICAgfVxyXG5cclxuICAgICZfX2dyaWQge1xyXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiAxMDI0cHgpIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNjQwcHgpIHtcclxuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMSwgbWlubWF4KDAsIDFmcikpICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX2Vycm9yIHtcclxuICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgIHBhZGRpbmc6IDQ4cHggMjRweDtcclxuXHJcbiAgICAgICAgLmVycm9yLWNhcmQge1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XHJcblxyXG4gICAgICAgICAgICBpIHtcclxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogNDhweDtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1kYW5nZXItY29sb3IsICNkYzM1NDUpO1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaDMge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXRleHQtY29sb3IsICMzMzMpO1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLmJ0biB7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAxMnB4IDI0cHg7XHJcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICAgICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LWNvbG9yLCAjMDA3YmZmKTtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcclxuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4zcztcclxuXHJcbiAgICAgICAgICAgICAgICAmOmhvdmVyIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCA0cHggMTJweCByZ2JhKDAsIDEyMywgMjU1LCAwLjMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDhweDtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJl9fcGFnaW5hdGlvbiB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICBtYXJnaW4tdG9wOiAzMnB4O1xyXG4gICAgfVxyXG59Il19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvbGlzdC12aWV3L2xpc3Qtdmlldy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7QUFDSjtBQUNJO0VBQ0ksbUJBQUE7QUFDUjtBQUdRO0VBREo7SUFFUSwyREFBQTtFQUFWO0FBQ0Y7QUFFUTtFQUxKO0lBTVEsMkRBQUE7RUFDVjtBQUNGO0FBRUk7RUFDSSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtBQUFSO0FBRVE7RUFDSSxrQkFBQTtFQUNBLGdCQUFBO0FBQVo7QUFFWTtFQUNJLGVBQUE7RUFDQSxtQ0FBQTtFQUNBLG1CQUFBO0FBQWhCO0FBR1k7RUFDSSw4QkFBQTtFQUNBLG1CQUFBO0FBRGhCO0FBSVk7RUFDSSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLHlDQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLG9CQUFBO0FBRmhCO0FBSWdCO0VBQ0ksMkJBQUE7RUFDQSw2Q0FBQTtBQUZwQjtBQUtnQjtFQUNJLGVBQUE7RUFDQSxpQkFBQTtFQUNBLFlBQUE7QUFIcEI7QUFTSTtFQUNJLGFBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0FBUFI7QUFDQSxvdUdBQW91RyIsInNvdXJjZXNDb250ZW50IjpbIi5saXN0LXZpZXcge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBnYXA6IDI0cHg7XHJcblxyXG4gICAgJl9fZmlsdGVycyB7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcclxuICAgIH1cclxuXHJcbiAgICAmX19ncmlkIHtcclxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogMTAyNHB4KSB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDY0MHB4KSB7XHJcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEsIG1pbm1heCgwLCAxZnIpKSAhaW1wb3J0YW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAmX19lcnJvciB7XHJcbiAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgICAgICBwYWRkaW5nOiA0OHB4IDI0cHg7XHJcblxyXG4gICAgICAgIC5lcnJvci1jYXJkIHtcclxuICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xyXG5cclxuICAgICAgICAgICAgaSB7XHJcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDQ4cHg7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tZGFuZ2VyLWNvbG9yLCAjZGMzNTQ1KTtcclxuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGgzIHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LWNvbG9yLCAjMzMzKTtcclxuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC5idG4ge1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMTJweCAyNHB4O1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1jb2xvciwgIzAwN2JmZik7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuM3M7XHJcblxyXG4gICAgICAgICAgICAgICAgJjpob3ZlciB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSgwLCAxMjMsIDI1NSwgMC4zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiA4cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICZfX3BhZ2luYXRpb24ge1xyXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgICAgICAgbWFyZ2luLXRvcDogMzJweDtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 4456);
/* harmony import */ var _components_community_feed_community_feed_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/community-feed/community-feed.component */ 2055);
/* harmony import */ var _components_guides_list_guides_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/guides-list/guides-list.component */ 1141);
/* harmony import */ var _components_news_list_news_list_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/news-list/news-list.component */ 8181);
/* harmony import */ var _components_qa_list_qa_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/qa-list/qa-list.component */ 4797);
/* harmony import */ var _components_maps_explorer_maps_explorer_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/maps-explorer/maps-explorer.component */ 5601);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 7580);










const routes = [{
  path: '',
  component: _components_community_feed_community_feed_component__WEBPACK_IMPORTED_MODULE_0__.CommunityFeedComponent
}, {
  path: 'guides',
  component: _components_guides_list_guides_list_component__WEBPACK_IMPORTED_MODULE_1__.GuidesListComponent
}, {
  path: 'news',
  component: _components_news_list_news_list_component__WEBPACK_IMPORTED_MODULE_2__.NewsListComponent
}, {
  path: 'qa',
  component: _components_qa_list_qa_list_component__WEBPACK_IMPORTED_MODULE_3__.QAListComponent
}, {
  path: 'maps',
  component: _components_maps_explorer_maps_explorer_component__WEBPACK_IMPORTED_MODULE_4__.MapsExplorerComponent
}];
class CommunityModule {
  static {
    this.ɵfac = function CommunityModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || CommunityModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({
      type: CommunityModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule.forChild(routes), _components_community_feed_community_feed_component__WEBPACK_IMPORTED_MODULE_0__.CommunityFeedComponent, _components_news_list_news_list_component__WEBPACK_IMPORTED_MODULE_2__.NewsListComponent, _components_qa_list_qa_list_component__WEBPACK_IMPORTED_MODULE_3__.QAListComponent, _components_maps_explorer_maps_explorer_component__WEBPACK_IMPORTED_MODULE_4__.MapsExplorerComponent, _components_guides_list_guides_list_component__WEBPACK_IMPORTED_MODULE_1__.GuidesListComponent, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](CommunityModule, {
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule, _components_community_feed_community_feed_component__WEBPACK_IMPORTED_MODULE_0__.CommunityFeedComponent, _components_news_list_news_list_component__WEBPACK_IMPORTED_MODULE_2__.NewsListComponent, _components_qa_list_qa_list_component__WEBPACK_IMPORTED_MODULE_3__.QAListComponent, _components_maps_explorer_maps_explorer_component__WEBPACK_IMPORTED_MODULE_4__.MapsExplorerComponent, _components_guides_list_guides_list_component__WEBPACK_IMPORTED_MODULE_1__.GuidesListComponent],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule]
  });
})();

/***/ }),

/***/ 9466:
/*!**********************************************************!*\
  !*** ./src/app/features/community/models/guide.model.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GuideCategory: () => (/* binding */ GuideCategory),
/* harmony export */   GuideDifficulty: () => (/* binding */ GuideDifficulty)
/* harmony export */ });
var GuideCategory;
(function (GuideCategory) {
  GuideCategory[GuideCategory["Maintenance"] = 1] = "Maintenance";
  GuideCategory[GuideCategory["Repair"] = 2] = "Repair";
  GuideCategory[GuideCategory["Modification"] = 3] = "Modification";
  GuideCategory[GuideCategory["Buying"] = 4] = "Buying";
  GuideCategory[GuideCategory["Selling"] = 5] = "Selling";
  GuideCategory[GuideCategory["Insurance"] = 6] = "Insurance";
  GuideCategory[GuideCategory["Safety"] = 7] = "Safety";
  GuideCategory[GuideCategory["Performance"] = 8] = "Performance";
  GuideCategory[GuideCategory["Restoration"] = 9] = "Restoration";
  GuideCategory[GuideCategory["Electronics"] = 10] = "Electronics";
  GuideCategory[GuideCategory["Interior"] = 11] = "Interior";
  GuideCategory[GuideCategory["Exterior"] = 12] = "Exterior";
  GuideCategory[GuideCategory["Engine"] = 13] = "Engine";
  GuideCategory[GuideCategory["Transmission"] = 14] = "Transmission";
  GuideCategory[GuideCategory["Suspension"] = 15] = "Suspension";
  GuideCategory[GuideCategory["Brakes"] = 16] = "Brakes";
  GuideCategory[GuideCategory["Wheels"] = 17] = "Wheels";
  GuideCategory[GuideCategory["Detailing"] = 18] = "Detailing";
  GuideCategory[GuideCategory["Tools"] = 19] = "Tools";
  GuideCategory[GuideCategory["General"] = 20] = "General";
})(GuideCategory || (GuideCategory = {}));
var GuideDifficulty;
(function (GuideDifficulty) {
  GuideDifficulty[GuideDifficulty["Beginner"] = 1] = "Beginner";
  GuideDifficulty[GuideDifficulty["Intermediate"] = 2] = "Intermediate";
  GuideDifficulty[GuideDifficulty["Advanced"] = 3] = "Advanced";
  GuideDifficulty[GuideDifficulty["Expert"] = 4] = "Expert";
})(GuideDifficulty || (GuideDifficulty = {}));

/***/ }),

/***/ 9865:
/*!********************************************************************************!*\
  !*** ./src/app/features/community/components/news-card/news-card.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NewsCardComponent: () => (/* binding */ NewsCardComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4460);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 8431);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 7580);





const _c0 = a0 => ["/community/news", a0];
class NewsCardComponent {
  static {
    this.ɵfac = function NewsCardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || NewsCardComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: NewsCardComponent,
      selectors: [["app-news-card"]],
      inputs: {
        article: "article"
      },
      decls: 35,
      vars: 17,
      consts: [[1, "group", "relative", "bg-surface/40", "mica-effect", "rounded-2xl", "overflow-hidden", "border", "border-white/10", "hover:border-primary/30", "transition-all", "duration-500", "hover:shadow-2xl", "hover:shadow-primary/10", "animate-fade-in"], [1, "aspect-[16/9]", "overflow-hidden", "relative"], [1, "w-full", "h-full", "object-cover", "transition-transform", "duration-700", "group-hover:scale-110", 3, "src", "alt"], [1, "absolute", "inset-0", "bg-gradient-to-t", "from-black/80", "via-black/20", "to-transparent", "opacity-60", "group-hover:opacity-40", "transition-opacity"], [1, "absolute", "top-4", "left-4"], [1, "px-3", "py-1", "rounded-full", "bg-primary/90", "text-white", "text-[10px]", "font-black", "uppercase", "tracking-widest", "shadow-lg"], [1, "p-5", "space-y-3"], [1, "flex", "items-center", "space-x-2", "text-[10px]", "text-muted-foreground", "font-bold", "uppercase", "tracking-wider"], [1, "flex", "items-center"], [1, "fa-regular", "fa-calendar-days", "mr-1.5", "text-primary"], [1, "w-1", "h-1", "rounded-full", "bg-white/20"], [1, "fa-regular", "fa-clock", "mr-1.5", "text-primary"], [1, "text-lg", "font-bold", "text-foreground", "leading-tight", "group-hover:text-primary", "transition-colors", "line-clamp-2"], [1, "text-sm", "text-muted-foreground/80", "line-clamp-3", "leading-relaxed"], [1, "pt-4", "flex", "items-center", "justify-between", "border-t", "border-white/5"], [1, "flex", "items-center", "space-x-2"], [1, "w-6", "h-6", "rounded-full", "bg-primary/20", "flex", "items-center", "justify-center", "text-[10px]", "font-black", "italic", "border", "border-white/10"], [1, "text-xs", "font-bold", "text-foreground/70"], [1, "flex", "items-center", "space-x-3", "text-muted-foreground/60"], [1, "flex", "items-center", "text-[10px]", "font-bold"], [1, "fa-regular", "fa-heart", "mr-1", "group-hover:text-red-500", "transition-colors"], [1, "fa-regular", "fa-comment", "mr-1"], [1, "absolute", "inset-0", "z-10", 3, "routerLink"]],
      template: function NewsCardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2)(3, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 4)(5, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 6)(8, "div", 7)(9, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "i", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](12, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "i", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " 5 min read ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "h3", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "p", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 14)(22, "div", 15)(23, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "span", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 18)(28, "span", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](29, "i", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "span", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](32, "i", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](34, "a", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx.article.featuredImageUrl || "assets/images/news-placeholder.jpg", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"])("alt", ctx.article.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", (ctx.article.category == null ? null : ctx.article.category.name) || "News", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](12, 12, ctx.article.publishedAt, "MMM d, y"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.article.title, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.article.summary, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", (ctx.article.author == null ? null : ctx.article.author.firstName == null ? null : ctx.article.author.firstName[0]) || "A", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", ctx.article.author == null ? null : ctx.article.author.firstName, " ", ctx.article.author == null ? null : ctx.article.author.lastName, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.article.likesCount, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.article.commentsCount, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](15, _c0, ctx.article.id));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DatePipe, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_features_community_community_module_ts.js.map