import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { TimeEntry } from './models/time-entry';

const API_URL =
  'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

@Injectable({
  providedIn: 'root',
})
export class TableData {
  constructor(private readonly http: HttpClient) {}

  getData(): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(API_URL);
  }
}
