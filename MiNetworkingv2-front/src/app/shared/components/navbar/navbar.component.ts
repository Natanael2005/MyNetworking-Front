import { ChangeDetectionStrategy, Component, HostListener, OnInit, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  isSmall = false; // Iniciar siempre pequeño por defecto
  isHome = false;
  disableAnimation = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.disableAnimation = false;
      
      // Verificar la ruta actual inmediatamente
      this.checkRoute();

      // Escuchar cambios de navegación
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.ngZone.run(() => {
            this.handleNavigation();
          });
        });

      // Manejar scroll después de la navegación
      setTimeout(() => {
        this.checkScrollPosition();
        this.checkHomeSection();
      }, 100);
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (isPlatformBrowser(this.platformId) && this.isHome) {
      this.checkScrollPosition();
    }
  }

  private handleNavigation(): void {
    this.disableAnimation = true;
    this.checkRoute();
    
    setTimeout(() => {
      this.checkHomeSection();
      this.disableAnimation = false;
    }, 50);
  }

  private checkRoute(): void {
    const hash = window.location.hash;
    this.isHome = !hash || hash === '#hero';
  }

  private checkHomeSection(): void {
    if (this.isHome) {
      this.isSmall = window.scrollY > 50;
    } else {
      this.isSmall = true;
    }
  }

  private checkScrollPosition(): void {
    if (this.isHome) {
      this.isSmall = window.scrollY > 50;
    }
  }





  handleMenuClick(event: Event): void {
  if (isPlatformBrowser(this.platformId)) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    
    if (link) {
      this.disableAnimation = true;
      const hash = link.getAttribute('href') || '';
      
      // Actualizar estado inmediatamente
      this.isHome = hash === '#hero';
      this.isSmall = !this.isHome || window.scrollY > 50;
      
      // Navegar después de actualizar el estado
      setTimeout(() => {
        window.location.hash = hash;
        this.disableAnimation = false;
      }, 10);
    }
  }
}



}