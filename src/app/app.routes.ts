// src/app/app.routes.ts
import { Routes } from '@angular/router';

import LandingComponent                 from "./landing/landing.component";
import { FormComponent }                    from './form/form.component';
import { ContactFormComponent }         from './form/sections/01-contact-form/contact-form.component';
import { PaymentComponent }             from './form/sections/02-payment/payment.component';
import { PersonalInfoComponent }        from './form/sections/03-personal-info/personal-info.component';
import { HighlightsComponent }          from './form/sections/04-highlights/highlights.component';
import { ProfessionalInfoComponent }    from './form/sections/05-professional-info/professional-info.component';
import { InfoReviewComponent }          from './form/sections/06-info-review/info-review.component';

export const routes: Routes = [
  // Landing
  { path: '', component: LandingComponent },

  // Wizard: FormComponent actúa como “shell” para los pasos
  {
    path: 'form',
    component: FormComponent,
    children: [
      { path: '',         redirectTo: 'paso1', pathMatch: 'full' },
      { path: 'paso1',    component: ContactFormComponent },
      { path: 'paso2',    component: PaymentComponent },
      { path: 'paso3',    component: PersonalInfoComponent },
      { path: 'paso4',    component: HighlightsComponent },
      { path: 'paso5',    component: ProfessionalInfoComponent },
      { path: 'paso6',    component: InfoReviewComponent },
    ]
  },

  // Cualquier otro path redirige a landing
  { path: '**', redirectTo: '' }
];
