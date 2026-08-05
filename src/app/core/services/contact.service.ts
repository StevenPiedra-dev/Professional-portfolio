import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.emailJsService.sendEmail({
      name: data.name,
      email: data.email,
      subject: data.subject || this.defaultSubject,
      message: data.message
    });
  }
}
