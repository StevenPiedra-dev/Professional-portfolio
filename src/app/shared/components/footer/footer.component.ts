import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  private portfolioService = inject(PortfolioService);

  currentYear = new Date().getFullYear();

  get aboutInfo() {
    return this.portfolioService.getAboutInfo();
  }

  get fullName(): string {
    return this.aboutInfo.fullName || 'Steven Piedra Villalta';
  }

  get roleTitle(): string {
    return this.aboutInfo.roleTitle || 'Full Stack Developer | AI Developer | Product Manager';
  }

  get copyrightHolder(): string {
    return this.fullName.split(' ')[0] + '-Dev';
  }

  get contactLinks() {
    return this.portfolioService.getContactLinks();
  }
}
