import { Injectable, inject } from '@angular/core';
import { ContactService } from './contact.service';

@Injectable({
  providedIn: 'root'
})
export class ContactModalService {
  private contactService = inject(ContactService);

  get isOpen() {
    return this.contactService.isOpen;
  }

  openModal(subject?: string) {
    this.contactService.openModal(subject);
  }

  closeModal() {
    this.contactService.closeModal();
  }

  toggleModal() {
    if (this.contactService.isOpen()) {
      this.contactService.closeModal();
    } else {
      this.contactService.openModal();
    }
  }
}
