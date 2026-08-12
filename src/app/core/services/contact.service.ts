import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContactMessage } from '../models/portfolio.models';
import { EmailJsService } from './emailjs.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private emailJsService = inject(EmailJsService);

  isOpen = signal<boolean>(false);
  defaultSubject = 'Job Proposal / Project Inquiry';

  openModal(subject?: string): void {
    if (subject) {
      this.defaultSubject = subject;
    }
    this.isOpen.set(true);
  }

  closeModal(): void {
    this.isOpen.set(false);
  }

  sendMessage(data: ContactMessage): Observable<{ success: boolean; message: string }> {
    const targetEmail = 'steven.piedra02@gmail.com';
    const subject = encodeURIComponent(data.subject || this.defaultSubject);
    const body = encodeURIComponent(
      `Hello Steven,\n\nMy name is: ${data.name}\nMy contact email is: ${data.email}\n\nMessage:\n${data.message}`
    );

    // Open user's default email client prefilled
    try {
      const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
    } catch (e) {
      console.warn('Mailto trigger notice:', e);
    }

    // Also attempt EmailJS as secondary background dispatch
    this.emailJsService.sendEmail({
      name: data.name,
      email: data.email,
      subject: data.subject || this.defaultSubject,
      message: data.message
    }).subscribe();

    return of({
      success: true,
      message: 'Message generated successfully! Your email client has been opened to complete the sending to steven.piedra02@gmail.com.'
    });
  }
}
