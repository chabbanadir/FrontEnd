// cable-data.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CableDataService {
  private cableDataSubject = new BehaviorSubject<{ cableType: string, lead: any } | null>(null);
  cableData$ = this.cableDataSubject.asObservable();

  setCableData(cableType: string, lead: any) {
    this.cableDataSubject.next({ cableType, lead });
  }
}
