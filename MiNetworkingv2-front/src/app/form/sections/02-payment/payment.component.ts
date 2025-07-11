import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PaymentData {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  country: string;
  customerName: string;
  bank: string;
  accountNumber: string;
  totalAmount: number;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  @Output() completed = new EventEmitter<PaymentData>();
  @Output() goBack = new EventEmitter<void>();

  paymentForm: FormGroup;
  isProcessing = false;

  // Datos del resumen
  summaryData = {
    serviceName: 'Servicio Premium',
    customerName: 'Boki Delgado Rodríguez',
    bank: 'BBVA',
    accountNumber: '1234567887456123',
    subtotal: 450,
    taxes: 50,
    totalAmount: 500
  };

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      country: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.paymentForm.valid) {
      this.isProcessing = true;

      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentData: PaymentData = {
        ...this.paymentForm.value,
        customerName: this.summaryData.customerName,
        bank: this.summaryData.bank,
        accountNumber: this.summaryData.accountNumber,
        totalAmount: this.summaryData.totalAmount
      };

      this.isProcessing = false;
      this.completed.emit(paymentData);
    } else {
      this.markFormGroupTouched();
    }
  }

  onGoBack() {
    this.goBack.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      control?.markAsTouched();
    });
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.paymentForm.patchValue({ cardNumber: value });
    event.target.value = formattedValue;
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.paymentForm.patchValue({ expiryDate: value });
  }

  getCardType(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'generic';
  }
}
