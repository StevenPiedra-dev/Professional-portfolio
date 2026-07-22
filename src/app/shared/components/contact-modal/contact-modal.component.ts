import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent {
  contactForm: FormGroup;
  selectedFiles: File[] = [];
  isSubmitting = signal<boolean>(false);
  submitSuccess = signal<boolean>(false);
  submitErrorMessage = signal<string | null>(null);
  dragOver = signal<boolean>(false);

  constructor(
    public contactService: ContactService,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      subject: [this.contactService.defaultSubject, Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  closeModal() {
    this.contactService.closeModal();
    this.resetFormState();
  }

  resetFormState() {
    this.contactForm.reset({
      subject: this.contactService.defaultSubject
    });
    this.selectedFiles = [];
    this.isSubmitting.set(false);
    this.submitSuccess.set(false);
    this.submitErrorMessage.set(null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
  }

  addFiles(files: File[]) {
    // Filter duplicates or add new files
    files.forEach(file => {
      if (!this.selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        this.selectedFiles.push(file);
      }
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitErrorMessage.set(null);

    const formValues = {
      ...this.contactForm.value,
      files: this.selectedFiles
    };

    this.contactService.sendContactMessage(formValues).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.submitSuccess.set(true);
        } else {
          this.submitErrorMessage.set(res.message || 'Error al enviar el mensaje');
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitErrorMessage.set('Ocurrió un error al contactar al servidor. Por favor intenta de nuevo.');
      }
    });
  }
}
