import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { UrlInfoComponent } from './url-info/url-info';
import { AboutComponent } from './about/about';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'info/:id', component: UrlInfoComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
