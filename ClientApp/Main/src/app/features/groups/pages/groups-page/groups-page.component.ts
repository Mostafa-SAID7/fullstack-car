import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Group, GroupSearchFilters, CreateGroupRequest } from '../../../../core/models/group.model';
import { GroupService } from '../../../../core/services/group.service';
import { GroupListComponent } from '../../components/group-list/group-list.component';
import { CreateGroupModalComponent } from '../../components/create-group-modal/create-group-modal.component';
import { NotificationService } from '../../../../shared/services/notification/notification.service';