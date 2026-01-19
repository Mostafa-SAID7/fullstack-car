import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  Group,
  GroupMember,
  GroupPost,
  GroupJoinRequest,
  GroupEvent,
  GroupDiscussion,
  GroupReport,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupSearchFilters
} from '../models/group.model';
import { ApiResponse, PaginatedResponse } from '../../../../core/models/a