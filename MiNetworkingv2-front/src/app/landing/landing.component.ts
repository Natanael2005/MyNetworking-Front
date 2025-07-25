import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { StepsComponent } from './sections/steps/steps.component';
import { BenefitsComponent } from './sections/benefits/benefits.component';
import { PortfolioComponent } from './sections/portfolio/portfolio.component';
import { PlansComponent } from './sections/plans/plans.component';
import { ContactComponent } from "./sections/contact/contact.component";
import { FaqsComponent } from "./sections/faqs/faqs.component";
import { FComponent } from "../shared/components/footer/footer.component";
import { NavbarComponent } from "../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeroComponent,
    StepsComponent,
    BenefitsComponent,
    PortfolioComponent,
    PlansComponent,
    ContactComponent,
    FaqsComponent,
    FComponent,
    NavbarComponent
],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingComponent {}
