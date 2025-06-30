import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardData } from '../../form.component';

@Component({
  selector: 'app-info-review',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './info-review.component.html',
  styleUrls: ['./info-review.component.scss']
})
export class InfoReviewComponent {
  /** Recibe todos los datos de los pasos anteriores */
  @Input() data!: WizardData;

  /** Dispara cuando el usuario confirma */
  @Output() completed = new EventEmitter<WizardData>();

  /** Dispara cuando el usuario quiere retroceder */
  @Output() back = new EventEmitter<void>();

  onConfirm() {
    this.completed.emit(this.data);
  }

  onBack() {
    this.back.emit();
  }
}
