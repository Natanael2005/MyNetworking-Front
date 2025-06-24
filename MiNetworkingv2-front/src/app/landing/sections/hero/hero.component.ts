import {
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,  // 👈 Esto cubre NgIf, NgFor, etc. mejor opción que solo NgIf
    ButtonModule
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  // ✅ Inyección del platformId compatible con SSR
  private platformId = inject(PLATFORM_ID);

  // ✅ Getter para saber si se ejecuta en cliente
  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
