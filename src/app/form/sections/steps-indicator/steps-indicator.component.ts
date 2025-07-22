import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


/** Interfaz que define la estructura de cada paso */
export interface Step {
  id: number;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-steps-indicator',
  templateUrl: './steps-indicator.component.html',
  styleUrls: ['./steps-indicator.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StepsIndicatorComponent {
  /** Lista completa de pasos con estructura clara */
  @Input() steps: Step[] = [];

  /** Paso actual (ej. 1 para el primer paso) */
  @Input() currentStep: number = 1;

  /** Total de pasos (ej. 6) */
  @Input() totalSteps: number = 6;

  /** Indica si un paso ya fue completado */
  isCompletedStep(stepId: number): boolean {
    return this.currentStep > stepId;
  }

  /** Indica si es el paso actual */
  isCurrentStep(stepId: number): boolean {
    return this.currentStep === stepId;
  }

  /** Devuelve la clase CSS según el estado del paso */
  getStepClass(stepId: number): string {
    if (this.isCompletedStep(stepId)) return 'completed';
    if (this.isCurrentStep(stepId)) return 'active';
    return '';
  }
}
