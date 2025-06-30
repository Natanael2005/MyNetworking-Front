import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from "@angular/forms"

// Interfaz que describe exactamente los datos del formulario
export interface ContactFormData {
  nombres: string
  apellidos: string
  puesto: string
  telefono: string
  correo: string
}

@Component({
  selector: "app-contact-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit {
  @Input() initialData: Partial<ContactFormData> = {}
  @Output() formSubmit = new EventEmitter<ContactFormData>()

  contactForm!: FormGroup
  isSubmitting = false
  submitSuccess = false
  focusedFields: Set<string> = new Set()

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nombres: [
        this.initialData.nombres || "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.noWhitespaceValidator
        ]
      ],
      apellidos: [
        this.initialData.apellidos || "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.noWhitespaceValidator
        ]
      ],
      puesto: [
        this.initialData.puesto || "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          this.noWhitespaceValidator
        ]
      ],
      telefono: [
        this.initialData.telefono || "",
        [Validators.required, Validators.pattern(/^\+?[\d\s\-()]{10,15}$/)]
      ],
      correo: [
        this.initialData.correo || "",
        [Validators.required, Validators.email, Validators.maxLength(100)]
      ]
    })
  }

  private noWhitespaceValidator(control: AbstractControl) {
    const val = control.value as string
    return val.trim().length === 0 ? { whitespace: true } : null
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    try {
      await new Promise((r) => setTimeout(r, 2000))
      this.formSubmit.emit(this.contactForm.value as ContactFormData)
      this.submitSuccess = true
      setTimeout(() => {
        this.submitSuccess = false
        this.contactForm.reset()
        this.focusedFields.clear()
      }, 3000)
    } finally {
      this.isSubmitting = false
    }
  }

  onFieldFocus(field: string) {
    this.focusedFields.add(field)
  }

  onFieldBlur(field: string) {
    this.focusedFields.delete(field)
  }

  isFieldFocused(field: string): boolean {
    return this.focusedFields.has(field)
  }

  hasFieldValue(field: string): boolean {
    const v = this.contactForm.get(field)?.value
    return typeof v === "string" && v.trim().length > 0
  }

  hasFieldError(field: string): boolean {
    const ctrl = this.contactForm.get(field)
    return !!(ctrl && ctrl.invalid && ctrl.touched)
  }

  getFieldError(field: string): string {
    const ctrl = this.contactForm.get(field)
    if (!ctrl || !ctrl.touched || !ctrl.errors) return ""

    const errs = ctrl.errors
    if (errs["required"]) return "Este campo es requerido"
    if (errs["minlength"])
      return `Mínimo ${errs["minlength"]["requiredLength"]} caracteres`
    if (errs["maxlength"])
      return `Máximo ${errs["maxlength"]["requiredLength"]} caracteres`
    if (errs["email"]) return "Ingrese un correo válido"
    if (errs["pattern"]) return "Formato inválido"
    if (errs["whitespace"]) return "No puede ser solo espacios"
    return ""
  }

  getInputClasses(field: string): string {
    const base = "form-control"
    const focus = this.isFieldFocused(field) ? "focused" : ""
    const error = this.hasFieldError(field) ? "error" : ""
    const filled = this.hasFieldValue(field) ? "filled" : ""
    return [base, focus, error, filled].filter(Boolean).join(" ")
  }

  getWrapperClasses(field: string): string {
    const base = "input-wrapper"
    const focus = this.isFieldFocused(field) ? "focused" : ""
    const error = this.hasFieldError(field) ? "error" : ""
    return [base, focus, error].filter(Boolean).join(" ")
  }
}
