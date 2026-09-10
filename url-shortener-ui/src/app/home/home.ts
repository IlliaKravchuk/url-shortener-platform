import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UrlService } from '../services/url.service';
import { AuthService } from '../services/auth.service';
import { ShortUrlDto } from '../models/url.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  urls: ShortUrlDto[] = [];
  originalUrl: string = '';
  errorMessage: string = '';

  email: string = '';
  password: string = '';
  loginError: string = '';

  regEmail: string = '';
  regPassword: string = '';
  regError: string = '';
  regSuccess: string = '';

  currentEmail: string | null = null;
  currentRole: string | null = null;

  constructor(
    private urlService: UrlService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.restoreSession();
    this.loadUrls();
  }

  restoreSession(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const storedEmail = localStorage.getItem('user_email');
      if (storedEmail && storedEmail.trim() !== '') {
        this.currentEmail = storedEmail;
      }
      const storedRole = localStorage.getItem('user_role');
      if (storedRole && storedRole.trim() !== '') {
        this.currentRole = storedRole;
      }
    }
  }

  loadUrls(): void {
    this.urlService.getUrls().subscribe({
      next: (data: ShortUrlDto[]) => this.urls = data,
      error: (err: unknown) => console.error(err)
    });
  }

  isLoggedIn(): boolean {
    return !!this.currentEmail || (typeof window !== 'undefined' && !!localStorage.getItem('auth_token'));
  }

  isAdmin(): boolean {
    const isEmailAdmin = this.currentEmail ? this.currentEmail.trim().toLowerCase() === 'admin@ukr.net' : false;
    const isRoleAdmin = this.currentRole ? this.currentRole.trim().toUpperCase() === 'ADMIN' : false;
    return isEmailAdmin || isRoleAdmin;
  }

  getUserEmail(): string | null {
    return this.currentEmail;
  }

  getUserRole(): string {
    return this.isAdmin() ? 'ADMIN' : (this.currentRole ? this.currentRole.toUpperCase() : 'USER');
  }

  // Надійна перевірка прав на редагуванн
  canModify(createdBy?: string): boolean {
    if (this.isAdmin()) return true; // Адміну можна все
    if (!this.currentEmail || !createdBy) return false;
    return this.currentEmail.trim().toLowerCase() === createdBy.trim().toLowerCase();
  }

  getDisplayOwner(createdBy?: string): string {
    if (this.isAdmin()) {
      return (createdBy && createdBy.trim() !== '') ? createdBy : 'Невідомо';
    }
    return 'Анонімно';
  }

  onLogin(): void {
    this.loginError = '';
    // Беремо оригінальну пошту (без примусового нижнього регістру, щоб зберегти форматування)
    const typedEmail = (this.email || '').trim();

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res && (res.token || res.Token) && typeof window !== 'undefined' && localStorage) {
          const token = res.token || res.Token;
          const serverEmail = (res.email || res.Email || '').trim();
          const incomingEmail = typedEmail || serverEmail || localStorage.getItem('user_email') || '';
          const incomingRole = (res.role || res.Role || '').trim();

          let finalRole = 'User';
          if (incomingEmail.toLowerCase() === 'admin@ukr.net' || incomingRole.toLowerCase() === 'admin') {
            finalRole = 'Admin';
          } else {
            finalRole = incomingRole || 'User';
          }

          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_role', finalRole);

          if (incomingEmail) {
            localStorage.setItem('user_email', incomingEmail);
            this.currentEmail = incomingEmail;
          }

          this.currentRole = finalRole;

          this.email = '';
          this.password = '';
          this.loadUrls();
        }
      },
      error: (err: any) => {
        this.loginError = err.error?.message || 'Невірний email або пароль.';
      }
    });
  }

  onRegister(): void {
    this.regError = '';
    this.regSuccess = '';
    this.urlService.register({ email: this.regEmail, password: this.regPassword }).subscribe({
      next: () => {
        this.regSuccess = 'Реєстрація успішна!';
        this.regEmail = '';
        this.regPassword = '';
      },
      error: (err: any) => {
        this.regError = err.error?.message || 'Помилка реєстрації.';
      }
    });
  }

  onLogout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_role');
    }
    this.currentEmail = null;
    this.currentRole = null;
    this.loadUrls();
  }

  shorten(): void {
    if (!this.originalUrl.trim()) return;

    this.urlService.shortenUrl({ originalUrl: this.originalUrl }).subscribe({
      next: (res: any) => {
        if (res) {
          const ownerEmail = this.currentEmail || 'Невідомо';
          if (!res.createdBy || res.createdBy.trim() === '' || res.createdBy === 'Невідомо') {
            res.createdBy = ownerEmail;
          }
          this.urls = [res, ...this.urls];
        }
        this.originalUrl = '';
        this.errorMessage = '';
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Помилка скорочення.';
      }
    });
  }

  edit(url: ShortUrlDto): void {
    const newUrl = prompt('Введіть новий URL:', url.originalUrl);
    if (!newUrl || !newUrl.trim()) return;

    this.urlService.updateUrl(url.id, { originalUrl: newUrl }).subscribe({
      next: () => this.loadUrls(),
      error: (err: any) => alert(err.error?.message || 'Недостатньо прав.')
    });
  }

  delete(id: number): void {
    this.urlService.deleteUrl(id).subscribe({
      next: () => this.urls = this.urls.filter(u => u.id !== id),
      error: (err: any) => alert(err.error?.message || 'Недостатньо прав.')
    });
  }

  viewInfo(id: number): void {
    this.router.navigate(['/info', id]);
  }
}
