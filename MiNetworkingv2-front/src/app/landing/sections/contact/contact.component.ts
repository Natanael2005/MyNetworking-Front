import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputTextModule,
    FormsModule,
    InputTextareaModule,
    ButtonModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
  ],
  providers: [MessageService],
})
export class ContactComponent {
  contactEmail: string = 'contacto@dappertechnologies';
  contactForm: FormGroup;
  touchedFields: { [key: string]: boolean } = {};

  constructor(private messageService: MessageService) {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required]),
    });
  }

  onBlur(fieldName: string) {
    this.touchedFields[fieldName] = true;
    this.validateField(fieldName);
  }

  
  validateField(fieldName: string) {
    const control = this.contactForm.get(fieldName);
    
    if (control?.invalid && (control.dirty || control.touched)) {
      let errorMessage = '';
      
      if (control.errors?.['required']) {
        errorMessage = this.getRequiredMessage(fieldName);
      } else if (control.errors?.['email']) {
        errorMessage = 'Por favor ingresa un correo electrónico válido';
      }
      
      if (errorMessage) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Dato necesario',
          detail: errorMessage,
          life: 3000
        });
      }
    }
  }


  private getRequiredMessage(fieldName: string): string {
    switch (fieldName) {
      case 'name': return 'El nombre es requerido';
      case 'lastName': return 'El apellido es requerido';
      case 'userEmail': return 'El correo electrónico es requerido';
      case 'message': return 'Por favor describe tu situación';
      default: return 'Este campo es requerido';
    }
  }

  handleSubmit(): void {
    Object.keys(this.contactForm.controls).forEach(field => {
      const control = this.contactForm.get(field);
      control?.markAsTouched();
      this.validateField(field);
    });

    if (this.contactForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Correo enviado',
        detail: 'Se ha enviado el correo de manera satisfactoria',
        life: 3000
      });
      this.contactForm.reset();
      this.touchedFields = {}; 
      console.log(this.contactForm.value);
    }
  }
}