import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [],
  templateUrl: './benefits.component.html',
  styleUrl: './benefits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BenefitsComponent { }
