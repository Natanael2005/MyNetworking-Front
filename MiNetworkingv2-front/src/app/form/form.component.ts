import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperModule } from 'primeng/stepper';


// Indicador y título genérico
// import { StepsIndicatorComponent } from './sections/steps-indicator/steps-indicator.component';
// import { StepTitleComponent }      from '../shared/components/step-title/step-title.component';

// Tus pasos ya creados
import { StepTitleComponent } from '../shared/components/step-title/step-title.component';
import { ContactFormComponent, ContactFormData}    from './sections/01-contact-form/contact-form.component';
import { PaymentComponent, PaymentData}        from './sections/02-payment/payment.component';
import { PersonalInfoComponent }   from './sections/03-personal-info/personal-info.component';
import { HighlightsComponent }     from './sections/04-highlights/highlights.component';
import { ProfessionalInfoComponent } from './sections/05-professional-info/professional-info.component';
import { InfoReviewComponent }     from './sections/06-info-review/info-review.component';

export interface WizardData {
  step1?: ContactFormData;
  step2?: PaymentData;
  step3?: any;
  step4?: any;
  step5?: any;
  step6?: any;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    StepperModule,
    // StepsIndicatorComponent,
    StepTitleComponent,
    ContactFormComponent,
    PaymentComponent,
    // PersonalInfoComponent,
    // HighlightsComponent,
    // ProfessionalInfoComponent,
     InfoReviewComponent
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export default class FormComponent {
  step = 0;
  wizardData: WizardData = {};

  onStep1Complete(data: ContactFormData) {
    this.wizardData.step1 = data;
    this.step = 1;   // avanzar al paso 2
  }
  onStep2Complete(data: PaymentData) {
    this.wizardData.step2 = data;
    this.step = 2;
  }
  // … igual para onStep3Complete … onStep5Complete …

  onStep6Complete(data: any) {
    this.wizardData.step6 = data;
    // Aquí terminas el wizard: envías wizardData al servidor, etc.
  }

  goBack() {
    if (this.step > 0) {
      this.step--;
    }
  }
}

