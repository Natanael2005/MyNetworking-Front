import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanService, Plan } from '../../../services/plan.service';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
} from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('cardNumber', { static: false }) cardNumberRef!: ElementRef;
  @ViewChild('cardExpiry', { static: false }) cardExpiryRef!: ElementRef;
  @ViewChild('cardCvc', { static: false }) cardCvcRef!: ElementRef;

  plans: Plan[] = [];
  selectedPlan: Plan | null = null;

  stripe: Stripe | null = null;
  elements!: StripeElements;
  cardNumber!: StripeCardNumberElement;
  cardExpiry!: StripeCardExpiryElement;
  cardCvc!: StripeCardCvcElement;
  errorMessage: string | null = null;
  stripeMounted = false;

  private isProcessing: boolean = false;
  private paymentSuccess: boolean = false;

  private cardNumberComplete: boolean = false;
  private cardExpiryComplete: boolean = false;
  private cardCvcComplete: boolean = false;
  private cardNumberValid: boolean = false;
  private cardExpiryValid: boolean = false;
  private cardCvcValid: boolean = false;

  billing = {
    firstName: '',
    lastName: '',
    country: 'MX',
    address1: '',
    address2: '',
    postalCode: '',
    city: '',
    state: '',
  };

  cardholderName: string = '';
  cardholderEmail: string = '';

  constructor(private planSvc: PlanService, private router: Router) {}

  ngOnInit() {
    this.planSvc.getPlans().subscribe({
      next: (data) => (this.plans = data),
      error: () => {
        this.errorMessage = 'No se pudieron cargar los planes.';
      },
    });
  }

  selectPlan(plan: Plan) {
    this.selectedPlan = plan;
    this.stripeMounted = false;
    this.paymentSuccess = false;
    this.isProcessing = false;
    this.errorMessage = null;
    this.resetStripeStates();
  }

  goBack() {
    this.selectedPlan = null;
    this.cardNumber?.destroy();
    this.cardExpiry?.destroy();
    this.cardCvc?.destroy();
    this.stripeMounted = false;
    this.paymentSuccess = false;
    this.isProcessing = false;
    this.errorMessage = null;
    this.resetStripeStates();
  }

  private resetStripeStates() {
    this.cardNumberComplete = false;
    this.cardExpiryComplete = false;
    this.cardCvcComplete = false;
    this.cardNumberValid = false;
    this.cardExpiryValid = false;
    this.cardCvcValid = false;
  }

  ngAfterViewChecked() {
    if (
      this.selectedPlan &&
      !this.stripeMounted &&
      this.cardNumberRef &&
      this.cardExpiryRef &&
      this.cardCvcRef
    ) {
      this.initStripeElements();
      this.stripeMounted = true;
    }
  }

  async initStripeElements() {
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripePublishableKey);
    }
    this.elements = this.stripe!.elements({
      fonts: [
        {
          cssSrc:
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
        },
      ],
      locale: 'es',
    });

    const style = {
      base: {
        color: '#374151',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '16px',
        fontWeight: '400',
        '::placeholder': { color: '#9ca3af' },
        lineHeight: '1.5',
        padding: '12px 16px',
      },
      invalid: { color: '#ef4444', iconColor: '#ef4444' },
      complete: { color: '#10b981', iconColor: '#10b981' },
    };

    this.cardNumber = this.elements.create('cardNumber', {
      style,
      showIcon: true,
      placeholder: '•••• •••• •••• ••••',
    });
    this.cardNumber.mount(this.cardNumberRef.nativeElement);

    this.cardNumber.on('change', (ev) => {
      this.errorMessage = ev.error ? ev.error.message : null;
      this.cardNumberComplete = ev.complete;
      this.cardNumberValid = !ev.error;
      const element = this.cardNumberRef.nativeElement;
      this.updateElementClasses(element, ev);
    });
    this.cardNumber.on('focus', () => {
      this.cardNumberRef.nativeElement.classList.add('StripeElement--focus');
    });
    this.cardNumber.on('blur', () => {
      this.cardNumberRef.nativeElement.classList.remove('StripeElement--focus');
    });

    this.cardExpiry = this.elements.create('cardExpiry', { style });
    this.cardExpiry.mount(this.cardExpiryRef.nativeElement);
    this.cardExpiry.on('change', (ev) => {
      if (ev.error) this.errorMessage = ev.error.message;
      this.cardExpiryComplete = ev.complete;
      this.cardExpiryValid = !ev.error;
      const element = this.cardExpiryRef.nativeElement;
      this.updateElementClasses(element, ev);
    });
    this.cardExpiry.on('focus', () => {
      this.cardExpiryRef.nativeElement.classList.add('StripeElement--focus');
    });
    this.cardExpiry.on('blur', () => {
      this.cardExpiryRef.nativeElement.classList.remove('StripeElement--focus');
    });

    this.cardCvc = this.elements.create('cardCvc', { style });
    this.cardCvc.mount(this.cardCvcRef.nativeElement);
    this.cardCvc.on('change', (ev) => {
      if (ev.error) this.errorMessage = ev.error.message;
      this.cardCvcComplete = ev.complete;
      this.cardCvcValid = !ev.error;
      const element = this.cardCvcRef.nativeElement;
      this.updateElementClasses(element, ev);
    });
    this.cardCvc.on('focus', () => {
      this.cardCvcRef.nativeElement.classList.add('StripeElement--focus');
    });
    this.cardCvc.on('blur', () => {
      this.cardCvcRef.nativeElement.classList.remove('StripeElement--focus');
    });
  }

  private updateElementClasses(element: HTMLElement, event: any) {
    element.classList.remove(
      'StripeElement--invalid',
      'StripeElement--complete',
      'StripeElement--empty'
    );
    if (event.error) {
      element.classList.add('StripeElement--invalid');
    } else if (event.complete) {
      element.classList.add('StripeElement--complete');
    } else if (event.empty) {
      element.classList.add('StripeElement--empty');
    }
  }

  async processPayment(): Promise<void> {
    if (!this.stripe || !this.cardNumber) {
      this.errorMessage = 'Error al inicializar el sistema de pagos';
      return;
    }
    if (!this.isFormCompletelyValid()) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }
    this.isProcessing = true;
    this.errorMessage = null;
    try {
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardNumber,
        billing_details: {
          name: `${this.billing.firstName} ${this.billing.lastName}`,
          email: this.cardholderEmail,
          address: {
            line1: this.billing.address1,
            line2: this.billing.address2,
            city: this.billing.city,
            state: this.billing.state,
            postal_code: this.billing.postalCode,
            country: this.billing.country,
          },
        },
      });

      if (error) {
        this.errorMessage = error.message || 'Error al procesar el pago';
        this.isProcessing = false;
        return;
      }

      // Simular procesamiento exitoso por ahora
      setTimeout(() => {
        this.isProcessing = false;
        this.paymentSuccess = true;
        this.showSuccessToast('¡Pago procesado exitosamente!');

        // Espera 2 segundos antes de avanzar al siguiente paso
        setTimeout(() => {
          this.router.navigate(['/form/paso3']);
        }, 2000);
      }, 500);
    } catch (error) {
      this.errorMessage = 'Error inesperado al procesar el pago';
      this.isProcessing = false;
    }
  }

  private showSuccessToast(message: string): void {
    // Implementa toasts si deseas
    console.log('Success:', message);
  }

  isFormCompletelyValid(): boolean {
    const billingValid = !!(
      this.billing.firstName &&
      this.billing.lastName &&
      this.billing.address1 &&
      this.billing.city &&
      this.billing.state &&
      this.billing.postalCode &&
      this.billing.country
    );
    const cardInputsValid = !!(this.cardholderName && this.cardholderEmail);
    const stripeElementsValid = !!(
      this.cardNumberComplete &&
      this.cardNumberValid &&
      this.cardExpiryComplete &&
      this.cardExpiryValid &&
      this.cardCvcComplete &&
      this.cardCvcValid
    );
    const planValid = !!this.selectedPlan;

    return billingValid && cardInputsValid && stripeElementsValid && planValid;
  }

  get processing(): boolean {
    return this.isProcessing;
  }

  get success(): boolean {
    return this.paymentSuccess;
  }

  ngOnDestroy() {
    this.cardNumber?.destroy();
    this.cardExpiry?.destroy();
    this.cardCvc?.destroy();
  }
}
