import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShortUrlDto, AuthResponseDto } from '../models/url.model';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private apiUrl = 'http://localhost:5260/api/Urls';
  private authUrl = 'http://localhost:5260/api/Auth';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUrls(): Observable<ShortUrlDto[]> {
    return this.http.get<ShortUrlDto[]>(this.apiUrl);
  }

  getUrlById(id: number): Observable<ShortUrlDto> {
    return this.http.get<ShortUrlDto>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  shortenUrl(data: { originalUrl: string }): Observable<ShortUrlDto> {
    return this.http.post<ShortUrlDto>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  updateUrl(id: number, data: { originalUrl: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteUrl(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.authUrl}/login`, credentials);
  }

  register(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, data);
  }
}
