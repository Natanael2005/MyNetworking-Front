import { Component, HostListener, OnInit, Inject, PLATFORM_ID, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginBtnComponent } from "./login-btn/login-btn.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LoginBtnComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private cdRef = inject(ChangeDetectorRef);

  @ViewChild('navContainer') navContainer!: ElementRef;

  isMenuOpen = false;
  isScrolled = false;
  activeSection = 'home';
  menuIcon = 'pi pi-bars';
  indicatorPosition = { left: '0', width: '0' };
  disableAnimation = true; // Para animaciones iniciales

  sections = [
    { id: 'home', name: 'Inicio' },
    { id: 'how-it-works', name: 'Cómo funciona' },
    { id: 'benefits', name: 'Beneficios' },
    { id: 'plans', name: 'Planes' },
    { id: 'faqs', name: 'FAQs' },
    { id: 'contact', name: 'Contacto' }
  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Manejo inicial del hash en la URL
      const hash = window.location.hash.substring(1);
      if (hash && this.sections.some(s => s.id === hash)) {
        this.activeSection = hash;
        this.disableAnimation = true;
        setTimeout(() => {
          this.smoothScroll(hash, true); // Scroll instantáneo al inicio
          this.disableAnimation = false;
        }, 50);
      }

      this.setupIntersectionObserver();
      setTimeout(() => this.disableAnimation = false, 1000); // Habilita animaciones después de 1s
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 50;
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth > 800 && this.isMenuOpen) {
        this.isMenuOpen = false;
        this.menuIcon = 'pi pi-bars';
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuIcon = this.isMenuOpen ? 'pi pi-times' : 'pi pi-bars';
    if (this.isMenuOpen) {
      setTimeout(() => this.updateActiveIndicator(), 100);
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.menuIcon = 'pi pi-bars';
  }

  scrollTo(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.activeSection = sectionId;
      this.smoothScroll(sectionId);
      history.replaceState(null, '', `#${sectionId}`);
      this.closeMenu();
    }
  }

  private smoothScroll(id: string, instant: boolean = false) {
    const element = document.getElementById(id);
    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - (this.isScrolled ? 5 : 10);
    
    if (instant) {
      window.scrollTo({ top: targetPosition, behavior: 'auto' });
      this.updateActiveIndicator();
      return;
    }

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
      } else {
        this.updateActiveIndicator();
      }
    };

    requestAnimationFrame(animation);
  }

  private updateActiveIndicator() {
    const activeItem = document.querySelector(`.nav-item[data-section="${this.activeSection}"]`);
    if (!activeItem || !this.navContainer?.nativeElement) return;
    
    const itemRect = activeItem.getBoundingClientRect();
    const containerRect = this.navContainer.nativeElement.getBoundingClientRect();
    
    this.indicatorPosition = {
      left: `${itemRect.left - containerRect.left}px`,
      width: `${itemRect.width}px`
    };
    this.cdRef.detectChanges();
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.disableAnimation) {
          this.activeSection = entry.target.id;
          this.updateActiveIndicator();
        }
      });
    }, options);

    this.sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}