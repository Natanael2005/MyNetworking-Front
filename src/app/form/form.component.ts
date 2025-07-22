import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter }           from 'rxjs/operators';

import { StepperModule }                  from 'primeng/stepper';
import { StepsIndicatorComponent, Step }  from './sections/steps-indicator/steps-indicator.component';
import { ContactFormComponent, ContactFormData } from './sections/01-contact-form/contact-form.component';
import { PaymentComponent }               from './sections/02-payment/payment.component';
import { PersonalInfoComponent, PersonalInfoData } from './sections/03-personal-info/personal-info.component';
import { HighlightsComponent, HighlightsData }     from './sections/04-highlights/highlights.component';
import { ProfessionalInfoComponent, ProfessionalInfoData } from './sections/05-professional-info/professional-info.component';
import { InfoReviewComponent }            from './sections/06-info-review/info-review.component';

/** Interfaz para acumular los datos de cada paso */
export interface WizardData {
  step1?: ContactFormData;
  step2?: any;
  step3?: PersonalInfoData;
  step4?: HighlightsData;
  step5?: ProfessionalInfoData;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    StepperModule,
    StepsIndicatorComponent,
    ContactFormComponent,
    PaymentComponent,
    PersonalInfoComponent,
    HighlightsComponent,
    ProfessionalInfoComponent,
    InfoReviewComponent
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  /** Lista de pasos para el indicador y el navbar */
  stepList: Step[] = [
    { id: 1, title: 'Contacto',                description: 'Datos de contacto' },
    { id: 2, title: 'Pago',                    description: 'Confirmación de pago' },
    { id: 3, title: 'Información personal',    description: 'Tus datos personales' },
    { id: 4, title: 'Momentos destacados',     description: 'Tus logros importantes' },
    { id: 5, title: 'Información profesional', description: 'Tu experiencia laboral' },
    { id: 6, title: 'Resumen',                 description: 'Revisión final y envío' }
  ];

  /** Índice interno 0–5 para tu *ngSwitch* en el navbar y *ngIf* de pasos */
  step = 0;

  /** Acumula los datos del wizard */
  wizardData: WizardData = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Sincroniza `step` con la URL: /form/paso1 → step=0, /form/paso2 → step=1, etc.
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e) => {
      const m = e.urlAfterRedirects.match(/\/form\/paso(\d+)/);
      this.step = m ? +m[1] - 1 : 0;
    });
  }

  onStep1Complete(data: ContactFormData) {
    this.wizardData.step1 = data;
    this.router.navigate(['/form/paso2']);
  }

  onStep2Complete(data: any) {
    this.wizardData.step2 = data;
    this.router.navigate(['/form/paso3']);
  }

  onStep3Complete(data: PersonalInfoData) {
    this.wizardData.step3 = data;
    this.router.navigate(['/form/paso4']);
  }

  onStep4Complete(data: HighlightsData) {
    this.wizardData.step4 = data;
    this.router.navigate(['/form/paso5']);
  }

  onStep5Complete(data: ProfessionalInfoData) {
    this.wizardData.step5 = data;
    this.router.navigate(['/form/paso6']);
  }

  onStep6Complete() {
    console.log('Revisión completa:', this.wizardData);
    // Aquí envías wizardData al servidor o muestras confirmación
  }

  goBack() {
    // Retrocede un paso en la URL, mínimo a paso1
    const prev = Math.max(this.step, 1);
    this.router.navigate([`/form/paso${prev}`]);
  }
}
