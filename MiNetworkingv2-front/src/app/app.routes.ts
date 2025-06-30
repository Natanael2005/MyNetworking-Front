import { Routes } from '@angular/router';
import LandingComponent from './landing/landing.component';
import FormComponent from './form/form.component';
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: LandingComponent
  },
  {
    path: 'form',
    component: FormComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

