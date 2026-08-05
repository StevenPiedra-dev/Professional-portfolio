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

    this.contactService.sendMessage(formData).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.submitSuccess.set(true);
          this.contactForm.reset({ subject: 'Job Proposal' });
        } else {
          this.errorMessage.set(res.message);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Could not send email. Please try again or email directly at steven.piedra02@gmail.com.');
      }
    });
  }

  private resetFormState() {
    this.submitSuccess.set(false);
    this.errorMessage.set(null);
    this.contactForm.reset({ subject: 'Job Proposal' });
  }
}
