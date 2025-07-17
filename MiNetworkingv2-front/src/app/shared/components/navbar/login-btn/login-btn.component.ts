import { MessageService } from 'primeng/api';
import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from "primeng/toast";
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-btn',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, ToastModule, FormsModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './login-btn.component.html',
  styleUrl: './login-btn.component.scss',
})
export class LoginBtnComponent {
  visible: boolean = false;
  @Input() isMobile: boolean = false;
  loginForm: FormGroup;
  touchedFields: { [key: string]: boolean } = {};

  constructor(private messageService: MessageService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }

    showDialog() {
        this.visible = true;
    }

    onBlur(fieldName: string){
      this.touchedFields[fieldName] = true;
      this.validateField(fieldName);
    }

      validateField(fieldName: string) {
    const control = this.loginForm.get(fieldName);
    
    if (control?.invalid && (control.dirty || control.touched)) {
      let errorMessage = '';
      
      if (control.errors?.['required']) {
        errorMessage = this.getRequiredMessage(fieldName);
      } else if (control.errors?.['email']) {
        errorMessage = 'Por favor ingresa un correo electrónico válido';
      }
      
      if (errorMessage) {
        this.messageService.add({
          severity: 'error',
          summary: 'Dato necesario',
          detail: errorMessage,
          life: 2000
        });
      }
    }
  }

   private getRequiredMessage(fieldName: string): string {
    switch (fieldName) {
      case 'email': return 'Correo electrónico requerido';
      case 'password': return 'Se necesita la contraseña';
      default: return 'Este campo es requerido';
    }
  }


 handleSubmit(): void {
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      control?.markAsTouched();
      this.validateField(field);
    });

    if (this.loginForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Sesión exitosa',
        detail: 'Se ha iniciado sesión',
        life: 2000
      });
      this.loginForm.reset();
      this.touchedFields = {}; 
      console.log(this.loginForm.value);
    }
  }


}
