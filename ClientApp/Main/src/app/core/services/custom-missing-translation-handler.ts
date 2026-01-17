import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

/**
 * Custom Missing Translation Handler
 * 
 * Handles missing translation keys by logging warnings and returning a fallback
 */
export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.warn(`Missing translation for key: ${params.key}`);
    return `[${params.key}]`;
  }
}
