import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements OnInit {
  aboutText: string =
    "Наш сервіс використовує високоефективний алгоритм Base62 для генерації коротких і унікальних посилань. \n\n" +
    "Base62 використовує букви латинського алфавіту (a-z, A-Z) та цифри (0-9). " +
    "Це дозволяє створювати компактні ідентифікатори без використання спецсимволів, що робить посилання безпечними та зручними для поширення.";

  successMessage: string = '';
  isAdminUser: boolean = false;

  ngOnInit(): void {
    this.checkRole();
  }

  checkRole(): void {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('user_role');
      this.isAdminUser = role === 'Admin';
    }
  }

  saveChanges(): void {
    if (this.isAdminUser) {
      this.successMessage = 'Опис успішно збережено!';

      setTimeout(() => this.successMessage = '', 3000);
    }
  }
}
