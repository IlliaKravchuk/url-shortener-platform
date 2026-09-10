import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponseDto } from '../models/url.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5260/api/Auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const res = response || {};
        if (res.token && typeof window !== 'undefined' && localStorage) {
          const token = res.token;
          const email = res.email || credentials.email;
          const incomingRole = res.role;

          // Визначаємо роль без затягування старих даних із localStorage
          let role = 'User';
          if (email === 'admin@ukr.net' || incomingRole === 'Admin' || incomingRole === 'admin') {
            role = 'Admin';
          } else {
            role = incomingRole || 'User';
          }

          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_email', email);
          localStorage.setItem('user_role', role);
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_role');
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined' || !localStorage) return null;
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
