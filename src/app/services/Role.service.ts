import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Role {
  id?: number;
  nom: string;
  description: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  nom: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:8082/api/roles';
  private permissionUrl = 'http://localhost:8082/api/permissions';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchRolesByName(nom: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/search/${nom}`);
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.permissionUrl);
  }

  addPermissionToRole(roleId: number, permissionId: number): Observable<Role> {
    return this.http.post<Role>(
      `${this.apiUrl}/${roleId}/permissions/${permissionId}`,
      {}
    );
  }

  removePermissionFromRole(
    roleId: number,
    permissionId: number
  ): Observable<Role> {
    return this.http.delete<Role>(
      `${this.apiUrl}/${roleId}/permissions/${permissionId}`
    );
  }
}
