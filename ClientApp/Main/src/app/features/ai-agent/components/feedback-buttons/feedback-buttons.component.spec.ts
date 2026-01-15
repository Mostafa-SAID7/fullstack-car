import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackButtonsComponent, FeedbackEvent } from './feedback-buttons.component';
import { FeedbackType } from '../../models/ai-agent.models';

describe('FeedbackButtonsComponent', () => {
  let component: FeedbackButtonsComponent;
  let fixture: ComponentFixture<FeedbackButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackButtonsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackButtonsComponent);
    component = fixture.componentInstance;
    component.messageId = 'msg-123';
    component.conversationId = 'conv-456';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with required inputs', () => {
      expect(component.messageId).toBe('msg-123');
      expect(component.conversationId).toBe('conv-456');
      expect(component.compact).toBe(false);
      expect(component.feedbackGiven).toBeUndefined();
    });

    it('should accept compact mode', () => {
      component.compact = true;
      fixture.detectChanges();
      expect(component.compact).toBe(true);
    });

    it('should accept feedback given state', () => {
      component.feedbackGiven = FeedbackType.POSITIVE;
      fixture.detectChanges();
      expect(component.feedbackGiven).toBe(FeedbackType.POSITIVE);
    });
  });

  describe('Thumbs Up Feedback', () => {
    it('should emit positive feedback event', (done) => {
      component.feedbackClick.subscribe((event: FeedbackEvent) => {
        expect(event.messageId).toBe('msg-123');
        expect(event.conversationId).toBe('conv-456');
        expect(event.type).toBe(FeedbackType.POSITIVE);
        done();
      });

      component.onThumbsUp();
    });

    it('should not emit if positive feedback already given', () => {
      component.feedbackGiven = FeedbackType.POSITIVE;
      spyOn(component.feedbackClick, 'emit');

      component.onThumbsUp();

      expect(component.feedbackClick.emit).not.toHaveBeenCalled();
    });

    it('should allow changing from negative to positive', (done) => {
      component.feedbackGiven = FeedbackType.NEGATIVE;

      component.feedbackClick.subscribe((event: FeedbackEvent) => {
        expect(event.type).toBe(FeedbackType.POSITIVE);
        done();
      });

      component.onThumbsUp();
    });

    it('should identify positive feedback state', () => {
      component.feedbackGiven = FeedbackType.POSITIVE;
      expect(component.isPositive()).toBe(true);
      expect(component.isNegative()).toBe(false);
      expect(component.isCorrection()).toBe(false);
    });
  });

  describe('Thumbs Down Feedback', () => {
    it('should emit negative feedback event', (done) => {
      component.feedbackClick.subscribe((event: FeedbackEvent) => {
        expect(event.messageId).toBe('msg-123');
        expect(event.conversationId).toBe('conv-456');
        expect(event.type).toBe(FeedbackType.NEGATIVE);
        done();
      });

      component.onThumbsDown();
    });

    it('should not emit if negative feedback already given', () => {
      component.feedbackGiven = FeedbackType.NEGATIVE;
      spyOn(component.feedbackClick, 'emit');

      component.onThumbsDown();

      expect(component.feedbackClick.emit).not.toHaveBeenCalled();
    });

    it('should allow changing from positive to negative', (done) => {
      component.feedbackGiven = FeedbackType.POSITIVE;

      component.feedbackClick.subscribe((event: FeedbackEvent) => {
        expect(event.type).toBe(FeedbackType.NEGATIVE);
        done();
      });

      component.onThumbsDown();
    });

    it('should identify negative feedback state', () => {
      component.feedbackGiven = FeedbackType.NEGATIVE;
      expect(component.isNegative()).toBe(true);
      expect(component.isPositive()).toBe(false);
      expect(component.isCorrection()).toBe(false);
    });
  });

  describe('Correction Feedback', () => {
    it('should emit correction click event', (done) => {
      component.correctionClick.subscribe((event) => {
        expect(event.messageId).toBe('msg-123');
        expect(event.conversationId).toBe('conv-456');
        done();
      });

      component.onCorrection();
    });

    it('should allow correction regardless of other feedback', (done) => {
      component.feedbackGiven = FeedbackType.POSITIVE;

      component.correctionClick.subscribe((event) => {
        expect(event.messageId).toBe('msg-123');
        done();
      });

      component.onCorrection();
    });

    it('should identify correction feedback state', () => {
      component.feedbackGiven = FeedbackType.CORRECTION;
      expect(component.isCorrection()).toBe(true);
      expect(component.isPositive()).toBe(false);
      expect(component.isNegative()).toBe(false);
    });
  });

  describe('Feedback State Checks', () => {
    it('should return false for all states when no feedback given', () => {
      component.feedbackGiven = undefined;
      expect(component.isPositive()).toBe(false);
      expect(component.isNegative()).toBe(false);
      expect(component.isCorrection()).toBe(false);
    });

    it('should correctly identify each feedback type', () => {
      // Test positive
      component.feedbackGiven = FeedbackType.POSITIVE;
      expect(component.isPositive()).toBe(true);
      expect(component.isNegative()).toBe(false);
      expect(component.isCorrection()).toBe(false);

      // Test negative
      component.feedbackGiven = FeedbackType.NEGATIVE;
      expect(component.isPositive()).toBe(false);
      expect(component.isNegative()).toBe(true);
      expect(component.isCorrection()).toBe(false);

      // Test correction
      component.feedbackGiven = FeedbackType.CORRECTION;
      expect(component.isPositive()).toBe(false);
      expect(component.isNegative()).toBe(false);
      expect(component.isCorrection()).toBe(true);
    });
  });

  describe('Event Emission', () => {
    it('should emit events with correct structure', (done) => {
      component.feedbackClick.subscribe((event: FeedbackEvent) => {
        expect(event).toEqual({
          messageId: 'msg-123',
          conversationId: 'conv-456',
          type: FeedbackType.POSITIVE
        });
        done();
      });

      component.onThumbsUp();
    });

    it('should emit correction events with correct structure', (done) => {
      component.correctionClick.subscribe((event) => {
        expect(event).toEqual({
          messageId: 'msg-123',
          conversationId: 'conv-456'
        });
        done();
      });

      component.onCorrection();
    });
  });

  describe('Compact Mode', () => {
    it('should support compact display mode', () => {
      component.compact = true;
      fixture.detectChanges();
      expect(component.compact).toBe(true);
    });

    it('should still emit events in compact mode', (done) => {
      component.compact = true;

      component.feedbackClick.subscribe((event: FeedbackEvent) => {
        expect(event.type).toBe(FeedbackType.POSITIVE);
        done();
      });

      component.onThumbsUp();
    });
  });
});
