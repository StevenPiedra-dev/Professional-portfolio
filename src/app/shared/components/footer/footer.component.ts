import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  fullName = 'Steven Piedra Villalta';
  copyrightHolder = 'StevenPiedra-Dev';

  socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/StevenPiedra-devv',
      icon: 'github'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/stevenpiedra/',
      icon: 'linkedin'
    },
    {
      name: 'Email',
      url: 'mailto:steven.piedra02@gmail.com',
      icon: 'email'
    }
  ];
}
