import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../services/url.service';

@Component({
  selector: 'app-url-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './url-info.html',
  styleUrl: './url-info.scss'
})
export class UrlInfoComponent implements OnInit {
  urlInfo: any = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = Number(idParam);
        this.urlService.getUrlById(id).subscribe({
          next: (data) => {
            this.urlInfo = data;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Помилка завантаження деталей:', err);
            this.errorMessage = 'Не вдалося завантажити інформацію про посилання.';
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
