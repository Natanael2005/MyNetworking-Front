import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

export interface PlanOption {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('paymentElement') paymentElementRef!: ElementRef;
  @Output() completed = new EventEmitter<{ planId: string; paymentData: any }>();
  @Output() goBack = new EventEmitter<void>();
  @Input() clientSecret?: string; // Debe ser proporcionado por el backend

  paymentForm: FormGroup;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  paymentElement: StripePaymentElement | null = null;
  isProcessing = false;
  paymentErrors: string | null = null;
  selectedPlan: PlanOption | null = null;

  // Planes disponibles
  plans: PlanOption[] = [
    {
      id: 'basic-monthly',
      name: 'Plan Básico',
      price: 9.99,
      currency: 'USD',
      interval: 'month',
      description: 'Perfecto para empezar',
      features: ['5 proyectos', 'Soporte por email', '10GB almacenamiento']
    },
    {
      id: 'basic-yearly',
      name: 'Plan Básico',
      price: 99.99,
      currency: 'USD',
      interval: 'year',
      description: 'Ahorra 2 meses',
      features: ['5 proyectos', 'Soporte por email', '10GB almacenamiento', '2 meses gratis'],
      popular: true
    },
    {
      id: 'pro-monthly',
      name: 'Plan Pro',
      price: 19.99,
      currency: 'USD',
      interval: 'month',
      description: 'Para profesionales',
      features: ['Proyectos ilimitados', 'Soporte prioritario', '100GB almacenamiento', 'Analytics avanzados']
    },
    {
      id: 'pro-yearly',
      name: 'Plan Pro',
      price: 199.99,
      currency: 'USD',
      interval: 'year',
      description: 'Ahorra 2 meses',
      features: ['Proyectos ilimitados', 'Soporte prioritario', '100GB almacenamiento', 'Analytics avanzados', '2 meses gratis']
    }
  ];

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required]],
      planId: ['', [Validators.required]]
    });
  }

  async ngAfterViewInit() {
    await this.initializeStripe();
  }

  private async initializeStripe() {
    try {
      this.stripe = await loadStripe(environment.stripePublishableKey);
      if (!this.stripe) {
        throw new Error('Error cargando Stripe.js');
      }

      // Esperar a que se seleccione un plan para inicializar el Payment Element
      this.paymentForm.get('planId')?.valueChanges.subscribe(async (planId) => {
        if (planId && this.selectedPlan?.id !== planId) {
          this.selectedPlan = this.plans.find(p => p.id === planId) || null;
          await this.initializePaymentElement();
        }
      });

    } catch (error) {
      console.error('Error inicializando Stripe:', error);
      this.paymentErrors = 'Error al cargar el sistema de pagos. Por favor, recarga la página.';
    }
  }

  private async initializePaymentElement() {
    if (!this.stripe || !this.selectedPlan) return;

    try {
      // En un caso real, deberías obtener el clientSecret de tu backend
      // basado en el plan seleccionado
      if (!this.clientSecret) {
        // Simular llamada al backend para obtener clientSecret
        this.clientSecret = await this.createPaymentIntent(this.selectedPlan);
      }

      if (this.elements) {
        this.elements = null;
      }

      this.elements = this.stripe.elements({
        clientSecret: this.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#007bff',
            colorBackground: '#ffffff',
            colorText: '#32325d',
            colorDanger: '#fa755a',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          }
        }
      });

      this.paymentElement = this.elements.create('payment', {
        layout: 'tabs'
      });

      this.paymentElement.mount(this.paymentElementRef.nativeElement);

      this.paymentElement.on('change', (event: any) => {
        if (event?.error && event.error.message) {
          this.paymentErrors = event.error.message;
        } else {
          this.paymentErrors = null;
        }
      });

    } catch (error) {
      console.error('Error inicializando Payment Element:', error);
      this.paymentErrors = 'Error al cargar los métodos de pago.';
    }
  }

  private async createPaymentIntent(plan: PlanOption): Promise<string> {
    // Esta función debería hacer una llamada a tu backend
    // Por ahora retorna un clientSecret simulado
    // En tu backend deberías crear el PaymentIntent con Stripe

    /*
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: plan.id,
        amount: Math.round(plan.price * 100), // Stripe usa centavos
        currency: plan.currency.toLowerCase()
      }),
    });

    const { clientSecret } = await response.json();
    return clientSecret;
    */

    // Simulación - reemplazar con llamada real al backend
    return 'pi_test_client_secret_placeholder';
  }

  selectPlan(plan: PlanOption) {
    this.selectedPlan = plan;
    this.paymentForm.patchValue({ planId: plan.id });
  }

  getPlansByInterval(interval: 'month' | 'year') {
    return this.plans.filter(plan => plan.interval === interval);
  }

  getSelectedPlanPrice(): string {
    if (!this.selectedPlan) return '';
    const price = this.selectedPlan.price.toFixed(2);
    const interval = this.selectedPlan.interval === 'month' ? 'mes' : 'año';
    return `$${price} USD/${interval}`;
  }

  async onSubmit() {
    if (this.paymentForm.invalid || !this.stripe || !this.elements || !this.selectedPlan) {
      this.paymentForm.markAllAsTouched();
      if (!this.selectedPlan) {
        this.paymentErrors = 'Por favor selecciona un plan.';
      }
      return;
    }

    this.isProcessing = true;
    this.paymentErrors = null;

    try {
      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          payment_method_data: {
            billing_details: {
              name: this.paymentForm.value.fullName,
              email: this.paymentForm.value.email,
              address: {
                country: this.paymentForm.value.country
              }
            }
          }
        },
        redirect: 'if_required'
      });

      if (error) {
        this.paymentErrors = error.message || 'Error procesando el pago.';
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Pago exitoso
        this.completed.emit({
          planId: this.selectedPlan.id,
          paymentData: {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            customerDetails: this.paymentForm.value
          }
        });
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      this.paymentErrors = 'Error inesperado. Por favor, inténtalo de nuevo.';
    } finally {
      this.isProcessing = false;
    }
  }

  onGoBack() {
    this.goBack.emit();
  }

  ngOnDestroy() {
    if (this.paymentElement) {
      this.paymentElement.destroy();
    }
  }
}
