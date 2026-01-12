// Feature: qa-system-integration, Angular Integration Property Tests
// This file contains property-based tests for Angular QA integration

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import * as fc from 'fast-check';

// QA Services
import { QAIntegrationService, QAIntegrationState, QANotification } from '../../services/qa-integration.service';
import { QASignalRService, ConnectionStatus } from '../../services/qa-signalr.service';

// Mock Services
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ToastService } from '../../../../core/services/toast.service';

// Test Component for routing tests
@Component({
  template: '<div>Question Detail: {{questionId}}</div>'
})
class MockQuestionDetailComponent {
  questionId: string = '';
}

@Component({
  template: '<div>Answer Detail: {{answerId}}</div>'
})
class MockAnswerDetailComponent {
  answerId: string = '';
}

describe('QA Angular Integration Property Tests', () => {
  let qaIntegrationService: QAIntegrationService;
  let qaSignalRService: jasmine.SpyObj<QASignalRService>;
  let authService: jasmine.SpyObj<AuthService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    // Create spy objects
    const qaSignalRSpy = jasmine.createSpyObj('QASignalRService', [
      'joinQuestion', 'leaveQuestion', 'joinCategory', 'leaveCategory',
      'startTypingAnswer', 'stopTypingAnswer', 'forceReconnect', 'getConnectionStats'
    ], {
      connectionState$: new BehaviorSubject(ConnectionStatus.Connected),
      reconnecting$: new BehaviorSubject(false),
      questionCreated$: new Subject(),
      answerCreated$: new Subject(),
      answerAccepted$: new Subject(),
      voteCreated$: new Subject(),
      reputationUpdated$: new Subject(),
      badgeEarned$: new Subject(),
      expertNotification$: new Subject(),
      userTypingAnswer$: new Subject(),
      userStoppedTypingAnswer$: new Subject()
    });

    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser'], {
      currentUser$: new BehaviorSubject({ id: 'test-user-id', email: 'test@example.com' }),
      token: 'mock-jwt-token'
    });

    const notificationSpy = jasmine.createSpyObj('NotificationService', ['show', 'clear']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['info', 'success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [MockQuestionDetailComponent, MockAnswerDetailComponent],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'qa/questions/:id', component: MockQuestionDetailComponent },
          { path: 'qa/answers/:id', component: MockAnswerDetailComponent }
        ])
      ],
      providers: [
        QAIntegrationService,
        { provide: QASignalRService, useValue: qaSignalRSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    qaIntegrationService = TestBed.inject(QAIntegrationService);
    qaSignalRService = TestBed.inject(QASignalRService) as jasmine.SpyObj<QASignalRService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  // Feature: qa-system-integration, Property 43: State Synchronization
  // For any QA action performed, the main application state should be updated immediately to reflect the change
  describe('Property 43: State Synchronization', () => {
    it('should synchronize state immediately for any QA action', async () => {
      await fc.assert(fc.asyncProperty(
        fc.record({
          questionId: fc.string({ minLength: 1, maxLength: 50 }),
          userId: fc.string({ minLength: 1, maxLength: 50 }),
          actionType: fc.constantFrom('question', 'answer', 'vote', 'reputation', 'badge', 'expert'),
          timestamp: fc.date()
        }),
        async (qaAction) => {
          // Arrange: Set up initial state
          const initialState = await qaIntegrationService.state$.pipe().toPromise();
          
          // Act: Simulate QA action based on type
          switch (qaAction.actionType) {
            case 'question':
              (qaSignalRService.questionCreated$ as any).next({
                id: qaAction.questionId,
                userId: qaAction.userId,
                title: 'Test Question',
                createdAt: qaAction.timestamp
              });
              break;
            case 'answer':
              (qaSignalRService.answerCreated$ as any).next({
                id: 'answer-id',
                questionId: qaAction.questionId,
                userId: qaAction.userId,
                content: 'Test Answer',
                createdAt: qaAction.timestamp
              });
              break;
            case 'vote':
              (qaSignalRService.voteCreated$ as any).next({
                contentId: qaAction.questionId,
                contentType: 'Question',
                voteType: 'Up',
                voteScore: 1
              });
              break;
            case 'reputation':
              (qaSignalRService.reputationUpdated$ as any).next({
                userId: qaAction.userId,
                reputationScore: 100,
                change: 10,
                reason: 'Answer upvoted'
              });
              break;
            case 'badge':
              (qaSignalRService.badgeEarned$ as any).next({
                userId: qaAction.userId,
                badgeName: 'Helper',
                description: 'First answer'
              });
              break;
            case 'expert':
              (qaSignalRService.expertNotification$ as any).next({
                questionId: qaAction.questionId,
                category: 'Technology',
                title: 'Expert Question'
              });
              break;
          }

          // Allow for async state updates
          await new Promise(resolve => setTimeout(resolve, 10));

          // Assert: State should be updated immediately
          const updatedState = await qaIntegrationService.state$.pipe().toPromise();
          
          // Verify state synchronization occurred
          expect(updatedState).toBeDefined();
          expect(updatedState!.currentUserId).toBe(initialState?.currentUserId || null);
          
          // For notification-generating actions, verify notifications were added
          if (['question', 'answer', 'reputation', 'badge', 'expert'].includes(qaAction.actionType)) {
            expect(updatedState!.notifications.length).toBeGreaterThanOrEqual(initialState?.notifications.length || 0);
          }
        }
      ), { numRuns: 100 });
    });
  });

  // Feature: qa-system-integration, Property 44: Deep Linking Support
  // For any question or answer, a direct URL should navigate to the specific content
  describe('Property 44: Deep Linking Support', () => {
    it('should support deep linking to any question or answer', async () => {
      await fc.assert(fc.asyncProperty(
        fc.record({
          contentType: fc.constantFrom('question', 'answer'),
          contentId: fc.string({ minLength: 1, maxLength: 50 }).filter(id => !id.includes('/'))
        }),
        async (linkData) => {
          // Arrange: Prepare navigation
          const targetUrl = linkData.contentType === 'question' 
            ? `/qa/questions/${linkData.contentId}`
            : `/qa/answers/${linkData.contentId}`;

          // Act: Navigate to the deep link
          await router.navigate([targetUrl]);
          
          // Allow navigation to complete
          await new Promise(resolve => setTimeout(resolve, 10));

          // Assert: URL should match the target
          const currentUrl = location.path();
          expect(currentUrl).toBe(targetUrl);

          // Verify the route is accessible and valid
          expect(currentUrl).toMatch(linkData.contentType === 'question' 
            ? /^\/qa\/questions\/[^\/]+$/ 
            : /^\/qa\/answers\/[^\/]+$/);
        }
      ), { numRuns: 100 });
    });
  });

  // Feature: qa-system-integration, Property 45: Notification Integration
  // For any QA notification, it should be delivered through the main application's notification system
  describe('Property 45: Notification Integration', () => {
    it('should deliver all QA notifications through main notification system', async () => {
      await fc.assert(fc.asyncProperty(
        fc.record({
          notificationType: fc.constantFrom('answer', 'vote', 'acceptance', 'badge', 'expert'),
          title: fc.string({ minLength: 1, maxLength: 100 }),
          message: fc.string({ minLength: 1, maxLength: 200 }),
          questionId: fc.option(fc.string({ minLength: 1, maxLength: 50 })),
          userId: fc.string({ minLength: 1, maxLength: 50 })
        }),
        async (notificationData) => {
          // Arrange: Reset toast service calls
          toastService.info.calls.reset();

          // Act: Trigger notification based on type
          switch (notificationData.notificationType) {
            case 'answer':
              (qaSignalRService.answerCreated$ as any).next({
                id: 'answer-id',
                questionId: notificationData.questionId || 'question-id',
                userId: notificationData.userId,
                content: notificationData.message,
                createdAt: new Date()
              });
              break;
            case 'acceptance':
              (qaSignalRService.answerAccepted$ as any).next({
                answerId: 'answer-id',
                questionId: notificationData.questionId || 'question-id'
              });
              break;
            case 'badge':
              (qaSignalRService.badgeEarned$ as any).next({
                userId: notificationData.userId,
                badgeName: notificationData.title,
                description: notificationData.message
              });
              break;
            case 'expert':
              (qaSignalRService.expertNotification$ as any).next({
                questionId: notificationData.questionId || 'question-id',
                category: 'Technology',
                title: notificationData.title
              });
              break;
            case 'vote':
              (qaSignalRService.reputationUpdated$ as any).next({
                userId: notificationData.userId,
                reputationScore: 100,
                change: 10,
                reason: notificationData.message
              });
              break;
          }

          // Allow for async notification processing
          await new Promise(resolve => setTimeout(resolve, 10));

          // Assert: Notification should be delivered through toast service
          expect(toastService.info).toHaveBeenCalled();
          
          // Verify notification was added to state
          const currentState = await qaIntegrationService.state$.pipe().toPromise();
          expect(currentState?.notifications.length).toBeGreaterThan(0);
          
          // Verify notification structure
          const latestNotification = currentState?.notifications[0];
          expect(latestNotification).toBeDefined();
          expect(latestNotification?.type).toBe(notificationData.notificationType);
          expect(latestNotification?.isRead).toBe(false);
          expect(latestNotification?.timestamp).toBeInstanceOf(Date);
        }
      ), { numRuns: 100 });
    });
  });

  // Feature: qa-system-integration, Property 59: Typing Indicators
  // For any user typing an answer, other viewers should see typing indicators
  describe('Property 59: Typing Indicators', () => {
    it('should show typing indicators for any user typing an answer', async () => {
      await fc.assert(fc.asyncProperty(
        fc.record({
          questionId: fc.string({ minLength: 1, maxLength: 50 }),
          typingUserId: fc.string({ minLength: 1, maxLength: 50 }),
          userName: fc.string({ minLength: 1, maxLength: 50 }),
          isTyping: fc.boolean()
        }),
        async (typingData) => {
          // Arrange: Get initial typing state
          const initialTypingUsers = qaIntegrationService.getTypingUsersForQuestion(typingData.questionId);

          // Act: Simulate typing event
          if (typingData.isTyping) {
            (qaSignalRService.userTypingAnswer$ as any).next({
              questionId: typingData.questionId,
              userId: typingData.typingUserId,
              userName: typingData.userName
            });
          } else {
            (qaSignalRService.userStoppedTypingAnswer$ as any).next({
              questionId: typingData.questionId,
              userId: typingData.typingUserId
            });
          }

          // Allow for async state updates
          await new Promise(resolve => setTimeout(resolve, 10));

          // Assert: Typing indicators should be updated
          const updatedTypingUsers = qaIntegrationService.getTypingUsersForQuestion(typingData.questionId);
          
          if (typingData.isTyping) {
            // User should be added to typing list
            expect(updatedTypingUsers).toContain(typingData.typingUserId);
          } else {
            // User should be removed from typing list
            expect(updatedTypingUsers).not.toContain(typingData.typingUserId);
          }

          // Verify state consistency
          const currentState = await qaIntegrationService.state$.pipe().toPromise();
          const stateTypingUsers = currentState?.typingUsers.get(typingData.questionId) || [];
          expect(stateTypingUsers).toEqual(updatedTypingUsers);
        }
      ), { numRuns: 100 });
    });
  });
});