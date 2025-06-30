import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-title.component.html',
  styleUrls: ['./step-title.component.scss']
})
export class StepTitleComponent {
  /** Título principal del paso */
  @Input() title!: string;
  /** Subtítulo opcional del paso */
  @Input() subtitle?: string;
}
