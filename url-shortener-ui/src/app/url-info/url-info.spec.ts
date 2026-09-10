import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { UrlInfoComponent } from './url-info';

describe('UrlInfoComponent', () => {
  let component: UrlInfoComponent;
  let fixture: ComponentFixture<UrlInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlInfoComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
