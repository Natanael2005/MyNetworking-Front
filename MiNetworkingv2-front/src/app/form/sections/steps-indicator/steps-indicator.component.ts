import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

export interface Step {
  id: number
  title: string
  description?: string
  completed: boolean
}

@Component({
  selector: "app-steps-indicator",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./steps-indicator.component.html",
  styleUrl: "./steps-indicator.component.scss",
})
export class StepsIndicatorComponent {
  @Input() currentStep = 1
  @Input() totalSteps = 6

  steps: Step[] = [
    {
      id: 1,
      title: "Registro",
      description: "Informacion de contacto",
      completed: false,
    },
    {
      id: 2,
      title: "Pago",
      description: "Informacion de pago",
      completed: false,
    },
    {
      id: 3,
      title: "Paso 3",
      description: "Pendiente",
      completed: false,
    },
    {
      id: 4,
      title: "Paso 4",
      description: "Pendiente",
      completed: false,
    },
    {
      id: 5,
      title: "Paso 5",
      description: "Pendiente",
      completed: false,
    },
    {
      id: 6,
      title: "Paso 6",
      description: "Pendiente",
      completed: false,
    },
  ]

  ngOnInit() {
    this.updateStepsStatus()
  }

  ngOnChanges() {
    this.updateStepsStatus()
  }

  private updateStepsStatus() {
    this.steps.forEach((step) => {
      step.completed = step.id < this.currentStep
    })
  }

  isCurrentStep(stepId: number): boolean {
    return stepId === this.currentStep
  }

  isCompletedStep(stepId: number): boolean {
    return stepId < this.currentStep
  }

  getStepClass(stepId: number): string {
    if (this.isCompletedStep(stepId)) {
      return "completed"
    } else if (this.isCurrentStep(stepId)) {
      return "current"
    } else {
      return "pending"
    }
  }
}
