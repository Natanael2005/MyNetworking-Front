import { ChangeDetectionStrategy, Component } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { ButtonModule } from 'primeng/button';
import { BenefitsComponent } from "../benefits/benefits.component";

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputTextModule, FormsModule, InputTextareaModule, ButtonModule,],
})
export class ContactComponent {
  value: string | undefined;

  email:string = 'contacto@dappertechnologies';
 }
