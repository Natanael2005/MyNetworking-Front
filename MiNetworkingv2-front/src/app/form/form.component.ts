import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';


// Indicador y título genérico
import { StepsIndicatorComponent, Step } from './sections/steps-indicator/steps-indicator.component';

// Tus pasos ya creados
import { ContactFormComponent, ContactFormData } from './sections/01-contact-form/contact-form.component';
import { PaymentComponent } from './sections/02-payment/payment.component';
import { PersonalInfoComponent, PersonalInfoData } from './sections/03-personal-info/personal-info.component';
import { HighlightsComponent, HighlightsData } from './sections/04-highlights/highlights.component';
import { ProfessionalInfoComponent, ProfessionalInfoData } from './sections/05-professional-info/professional-info.component';
import { InfoReviewComponent } from './sections/06-info-review/info-review.component';

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
export default class FormComponent {

  stepList: Step[] = [
    { id: 1, title: 'Contacto', description: 'Datos de contacto' },
    { id: 2, title: 'Pago', description: 'Confirmación de pago' },
    { id: 3, title: 'Información personal', description: 'Tus datos personales' },
    { id: 4, title: 'Momentos destacados', description: 'Tus logros importantes' },
    { id: 5, title: 'Información profesional', description: 'Tu experiencia laboral' },
    { id: 6, title: 'Resumen', description: 'Revisión final y envío' }
  ];

  step = 0;
  wizardData: WizardData = {};

  onStep1Complete(data: ContactFormData) {
    this.wizardData.step1 = data;
    this.step = 1;
  }
  onStep2Complete(data: any) {
    this.wizardData.step2 = data;
    this.step = 2;
  }
  onStep3Complete(data: PersonalInfoData) {
    this.wizardData.step3 = data;
    this.step = 3;
  }

  onStep4Complete(data: HighlightsData) {
    this.wizardData.step4 = data;
    this.step = 4;
  }

  onStep5Complete(data: ProfessionalInfoData) {
    this.wizardData.step5 = data;
    this.step = 5;
  }

  onStep6Complete() {
    console.log("Revisión completa:", this.wizardData);
    print
    // Aquí puedes enviar wizardData al servidor o mostrar una alerta final
  }


  goBack() {
    if (this.step > 0) {
      this.step--;
    }
  }
}


