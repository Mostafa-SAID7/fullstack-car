import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventsListComponent } from './pages/events-list/events-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: EventsListComponent },
      { 
        path: 'create', 
        loadComponent: () => import('./pages/event-create/event-create.component').then(m => m.EventCreateComponent)
      },
      { 
        path: 'calendar', 
        loadComponent: () => import('./pages/events-calendar/events-calendar.component').then(m => m.EventsCalendarComponent)
      },
      { 
        path: ':id', 
        loadComponent: () => import('./pages/event-detail/event-detail.component').then(m => m.EventDetailComponent)
      },
      { 
        path: ':id/edit', 
        loadComponent: () => import('./pages/event-edit/event-edit.component').then(m => m.EventEditComponent)
      },
      { 
        path: ':id/attendees', 
        loadComponent: () => import('./pages/event-attendees/event-attendees.component').then(m => m.EventAttendeesComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }