import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlInfo } from './url-info';

describe('UrlInfo', () => {
  let component: UrlInfo;
  let fixture: ComponentFixture<UrlInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
