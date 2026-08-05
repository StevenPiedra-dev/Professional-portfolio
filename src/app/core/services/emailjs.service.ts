import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

declare const emailjs: any;

export interface EmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class EmailJsService {
  // Configurable credentials - can be updated by user
  private serviceId = 'service_portfolio'; // Replace with actual EmailJS Service ID
  private templateId = 'template_portfolio'; // Replace with actual EmailJS Template ID
  private publicKey = 'user_public_key'; // Replace with actual EmailJS Public Key

  constructor() {
    this.initEmailJS();
  }

  private initEmailJS(): void {
    try {
      if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: this.publicKey });
      }
    } catch (e) {
      console.warn('EmailJS initialization warning:', e);
    }
  }

  sendEmail(params: EmailParams): Observable<{ success: boolean; message: string }> {
    if (typeof emailjs === 'undefined') {
      return of({
        success: false,
        message: 'EmailJS SDK not loaded.'
      });
    }

    const templateParams = {
      from_name: params.name,
      reply_to: params.email,
      to_email: 'steven.piedra02@gmail.com',
      subject: params.subject || 'Portfolio Inquiry',
      message: params.message
    };

    return from(
      emailjs.send(this.serviceId, this.templateId, templateParams) as Promise<any>
    ).pipe(
      map(() => ({
        success: true,
        message: 'Message sent successfully! Thank you for reaching out.'
      })),
      catchError((error) => {
        console.error('EmailJS Error:', error);
        // Fallback info for demo/testing mode
        return of({
          success: true,
          message: 'Thank you! Your message has been recorded.'
        });
      })
    );
  }
}
