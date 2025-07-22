import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsComponent { }
