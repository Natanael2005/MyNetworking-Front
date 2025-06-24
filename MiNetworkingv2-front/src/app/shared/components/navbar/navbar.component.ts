import { Component, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  active: string = 'home';
  isSmall = false;
  disableAnimation = true;
  isMobileMenuOpen = false;
  private readonly isBrowser: boolean;
  private sections = ['home', 'how-it-works', 'benefits', 'plans', 'faqs', 'contact'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const hash = window.location.hash.substring(1);

      if(window.innerHeight>50){
        this.isSmall= true
      } else{
        this.isSmall = false
      };
      
      // 1. Configuración inicial sin transiciones
      if (hash && this.sections.includes(hash)) {
        this.disableAnimation = true; // Bloquea transiciones iniciales
        this.isSmall = true; // Logo pequeño inmediatamente
        this.active = hash;
        
        // 2. Scroll instantáneo y silencioso al recargar
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({ top: targetPosition, behavior: 'auto' });
          }
          this.disableAnimation = false; // Reactiva animaciones después
        }, 50);
      }
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    this.isMobileMenuOpen = false;
    const wasSmall = this.isSmall;
    this.isSmall = window.scrollY > 50;
    if (wasSmall !== this.isSmall) this.disableAnimation = false;

    this.detectActiveSection();
  }

  scrollTo(id: string): void {
    if (!this.isBrowser) return;
    this.active = id;
    this.smoothScroll(id);
    history.replaceState(null, '', `#${id}`);
    this.isMobileMenuOpen = false;
  }

  private smoothScroll(id: string): void {
    const element = document.getElementById(id);
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - (this.isSmall ? 70 : 120);
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = this.easeInOutQuad(progress);
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  private detectActiveSection(): void {
    const scrollPosition = window.scrollY + (this.isSmall ? 100 : 150);

    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (!element) continue;

      const { offsetTop, offsetHeight } = element;
      const sectionTop = offsetTop - 100;
      const sectionBottom = offsetTop + offsetHeight - 100;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        this.active = section;
        break;
      }
    }
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}