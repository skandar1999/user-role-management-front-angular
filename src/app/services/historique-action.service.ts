import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistoriqueAction {
  id?: number;
  action: string;
  entityId?: number;
  date: string; // ISO string (e.g., "2025-05-11T12:34:56")
}

@Injectable({
  providedIn: 'root',
})
export class HistoriqueActionService {
  private apiUrl = 'http://localhost:8082/api/historique';

  constructor(private http: HttpClient) {}

  getAllActions(): Observable<HistoriqueAction[]> {
    return this.http.get<HistoriqueAction[]>(this.apiUrl);
  }
}
