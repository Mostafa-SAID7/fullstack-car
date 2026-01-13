import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, Subject, BehaviorSubject } from 'rxjs';

// Mock QA Services since they don't exist yet
class MockQAService {
  getQuestions() { return of([]); }
  getAnswers() { return of([]); }
}

class MockQASignalRService {
  connect() { return Promise.resolve(); }
  disconnect() { return Promise.resolve(); }
}