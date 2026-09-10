import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UrlService } from '../../services/url.service';

@Component({
  selector: 'app-url-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './url-info.html',
  styleUrls: ['./url-info.scss']
})
export class UrlInfoComponent implements OnInit {
  urlData: any = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.urlService.getUrlById(id).subscribe({
        next: (data) => {
          this.urlData = data;
        },
        error: () => {
          this.errorMessage = 'Не вдалося завантажити інформацію про посилання або доступ заборонено.';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
