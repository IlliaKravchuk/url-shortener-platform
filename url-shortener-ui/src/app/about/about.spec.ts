import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({}) } // Мокаємо роутер
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('повинен успішно створити компонент', () => {
    expect(component).toBeTruthy();
  });

  it('повинен містити згадку про алгоритм Base62 у початковому тексті', () => {
    expect(component.aboutText).toContain('Base62');
  });

  it('повинен показувати повідомлення про успіх при збереженні адміном', () => {
    // Встановлюємо роль адміна
    component.isAdminUser = true;

    // Викликаємо метод збереження
    component.saveChanges();

    // Перевіряємо результат
    expect(component.successMessage).toBe('Опис успішно збережено!');
  });
});
