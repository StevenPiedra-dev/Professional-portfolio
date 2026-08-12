import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent {
  private fb = inject(FormBuilder);
  public contactService = inject(ContactService);

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['Job Proposal'],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  closeModal() {
    this.contactService.closeModal();
    this.resetFormState();
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = {
      name: this.contactForm.value.name || '',
      email: this.contactForm.value.email || '',
      subject: this.contactForm.value.subject || 'Job Proposal',
      message: this.contactForm.value.message || ''
    };

    // Use formsubmit.co to send email without backend/api keys.
    fetch("https://formsubmit.co/ajax/steven.piedra02@gmail.com", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        _subject: formData.subject,
        _template: "table"
      })
    })
    .then(response => response.json())
    .then(data => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      this.contactForm.reset({ subject: 'Job Proposal' });
    })
    .catch(error => {
      console.error(error);
      this.isSubmitting.set(false);
      this.errorMessage.set('Error sending message. Please try again later or contact me directly via email.');
    });
  }

  resetFormState() {
    this.submitSuccess.set(false);
    this.errorMessage.set(null);
    this.contactForm.reset({ subject: 'Job Proposal' });
  }
}
