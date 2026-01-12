// QA Feature Exports
// Provides easy access to all QA components and services

// Components
export { QASearchComponent } from './components/qa-search/qa-search.component';
export { QACategoryFilterComponent } from './components/qa-category-filter/qa-category-filter.component';
export { QATagCloudComponent } from './components/qa-tag-cloud/qa-tag-cloud.component';
export { SimilarQuestionsComponent } from './components/similar-questions/similar-questions.component';

// Modules
export { QAModule } from './qa.module';
export { QARoutingModule } from './qa-routing.module';

// Services (re-exported from community services)
export { QASearchService } from '../community/services/qa-search.service';

// Types (re-exported from shared types)
export type {
  QuestionList,
  QuestionSimilarity,
  SearchFilter,
  Category,
  Tag,
  PopularTag
} from '../../shared/types/qa-api.types';