import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  nom: string;
  description: string;
}

export interface Utilisateur {
  id?: number;
  nom: string;
  email: string;
  motDePasse: string;
  role: Role;
  actif: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8082/api/utilisateurs';

  constructor(private http: HttpClient) {}

  addUser(utilisateur: Utilisateur): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, utilisateur);
  }

  getAllUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(
      `${this.baseUrl}/update/${id}`,
      utilisateur
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
