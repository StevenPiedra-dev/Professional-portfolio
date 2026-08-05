import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactModalService {
  isOpen = signal<boolean>(false);

  openModal() {
    this.isOpen.set(true);
  }

  closeModal() {
    this.isOpen.set(false);
  }

  toggleModal() {
    this.isOpen.update(val => !val);
  }
}
