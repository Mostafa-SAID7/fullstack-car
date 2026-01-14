import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReviewService } from '../../services/review.service';
import { TranslationService } from '../../../../core/services/translation.service';

describe('Review Localization Integration', () => {
  let reviewService: ReviewService;
  let translationService: jasmine.SpyObj<TranslationServi