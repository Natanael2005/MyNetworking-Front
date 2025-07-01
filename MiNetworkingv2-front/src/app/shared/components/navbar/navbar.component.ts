// navbar.component.ts
import { Component, HostListener, OnInit, Inject, PLATFORM_ID, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})  
export class NavbarComponent implements OnInit {
  private viewportScroller = inject(ViewportScroller);
  private platformId = inject(PLATFORM_ID);
  private cdRef = inject(ChangeDetectorRef);

  @ViewChild('navContainer') navContainer!: ElementRef;

  isMenuOpen = false;
  isScrolled = false;
  activeSection = 'home';
  menuIcon = 'pi pi-bars';
  indicatorPosition = { left: '0', width: '0' };

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
      this.setupIntersectionObserver();
      this.setupSmoothScroll();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 50;
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
      this.viewportScroller.scrollToAnchor(sectionId);
      setTimeout(() => this.updateActiveIndicator(), 300);
      this.closeMenu();
    }
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
        if (entry.isIntersecting) {
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

  private setupSmoothScroll() {
    if ('scrollBehavior' in document.documentElement.style === false) {
      import('smoothscroll-polyfill').then(module => {
        module.polyfill();
      });
    }
  }
}