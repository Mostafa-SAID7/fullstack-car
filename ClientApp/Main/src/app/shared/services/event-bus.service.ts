import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface EventData {
    name: string;
    value?: any;
}

@Injectable({
    providedIn: 'root'
})
export class EventBusService {
    private subject$ = new Subject<EventData>();

    emit(event: EventData) {
        this.subject$.next(event);
    }

    on(eventName: string): Observable<any> {
        return this.subject$.pipe(
            filter((e: EventData) => e.name === eventName),
            map((e: EventData) => e.value)
        );
    }
}
