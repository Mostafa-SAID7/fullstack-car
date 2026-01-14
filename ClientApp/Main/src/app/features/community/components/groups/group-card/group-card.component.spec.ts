import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { GroupCardComponent } from './group-card.component';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../../../core/models/group.model';

describe('GroupCardComponent', () => {
  let component: GroupCardComponent;
  let fixture: ComponentFixture<GroupCardComponent>;
  let translateService: TranslateService;
  let groupService: jasmine.SpyObj<GroupService>;

  const mockGroup: Group = {
    id: '1',
    name: 'Test Group',
    description: 'Test Description',
    type: 0,
    privacy: 0, // Public
    membersCount: 10,
    postsCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    ownerId: 'owner1',
    ownerFirstName: 'John',
    ownerLastName: 'Doe'
  };

  beforeEach(async () => {
    const groupServiceSpy = jasmine.createSpyObj('GroupService', ['joinGroup']);

    await TestBed.configureTestingModule({
      imports: [
        GroupCardComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: GroupService, useValue: groupServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupCardComponent);
    component = fixture.componentInstance;
    component.group = { ...mockGroup }; // Create a copy to avoid mutation between tests
    
    translateService = TestBed.inject(TranslateService);
    groupService = TestBed.inject(GroupService) as jasmine.SpyObj<GroupService>;
    
    // Set up translation service
    translateService.setDefaultLang('en-US');
    translateService.use('en-US');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get correct privacy label for public group', () => {
    spyOn(translateService, 'instant').and.returnValue('Public');
    
    const result = component.getPrivacyLabel(0);
    
    expect(translateService.instant).toHaveBeenCalledWith('privacy.public');
    expect(result).toBe('Public');
  });

  it('should get correct privacy label for private group', () => {
    spyOn(translateService, 'instant').and.returnValue('Private');
    
    const result = component.getPrivacyLabel(1);
    
    expect(translateService.instant).toHaveBeenCalledWith('privacy.private');
    expect(result).toBe('Private');
  });

  it('should get correct privacy label for secret group', () => {
    spyOn(translateService, 'instant').and.returnValue('Secret');
    
    const result = component.getPrivacyLabel(2);
    
    expect(translateService.instant).toHaveBeenCalledWith('privacy.secret');
    expect(result).toBe('Secret');
  });

  it('should default to public privacy label for unknown privacy level', () => {
    spyOn(translateService, 'instant').and.returnValue('Public');
    
    const result = component.getPrivacyLabel(999);
    
    expect(translateService.instant).toHaveBeenCalledWith('privacy.public');
    expect(result).toBe('Public');
  });

  it('should get correct privacy description', () => {
    spyOn(translateService, 'instant').and.returnValue('Public Group');
    
    const result = component.getPrivacyDescription(0);
    
    expect(translateService.instant).toHaveBeenCalledWith('groups.public');
    expect(result).toBe('Public Group');
  });

  it('should call joinGroup and increment member count on success', () => {
    const initialCount = component.group.membersCount;
    groupService.joinGroup.and.returnValue(of({ succeeded: true }));
    
    component.joinGroup();
    
    expect(groupService.joinGroup).toHaveBeenCalledWith('1');
    expect(component.group.membersCount).toBe(initialCount + 1);
  });

  it('should not increment member count when join fails', () => {
    const initialCount = component.group.membersCount;
    groupService.joinGroup.and.returnValue(of({ succeeded: false }));
    
    component.joinGroup();
    
    expect(groupService.joinGroup).toHaveBeenCalledWith('1');
    expect(component.group.membersCount).toBe(initialCount); // Should remain unchanged
  });

  it('should handle join group error gracefully', () => {
    const initialCount = component.group.membersCount;
    spyOn(console, 'error'); // Spy on console.error to verify error handling
    groupService.joinGroup.and.returnValue(throwError(() => new Error('Network error')));
    
    component.joinGroup();
    
    expect(groupService.joinGroup).toHaveBeenCalledWith('1');
    expect(component.group.membersCount).toBe(initialCount); // Should remain unchanged
    expect(console.error).toHaveBeenCalledWith('Failed to join group:', jasmine.any(Error));
  });
});