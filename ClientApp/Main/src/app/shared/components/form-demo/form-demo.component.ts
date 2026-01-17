import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// UI Components
import { FormComponent, FormFieldComponent, FormLabelComponent, FormMessageComponent, FormDescriptionComponent } from '../ui/form/form.component';
import { InputComponent, TextareaComponent } from '../ui/input/input.component';
import { SelectComponent, SelectOption } from '../ui/select/select.component';
import { CheckboxComponent, CheckboxWithLabelComponent } from '../ui/checkbox/checkbox.component';
import { RadioGroupComponent, RadioOption } from '../ui/radio/radio.component';
import { ButtonComponent } from '../ui/button/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../ui/card/card.component';

// Services
import { FormValidationService } from '../../services/form-validation.service';

/**
 * Form Demo Component
 * 
 * Demonstrates enhanced Shadcn/UI form components with Angular 19 features:
 * - Reactive forms with comprehensive validation
 * - Angular Signals for form state
 * - Enhanced accessibility with ARIA support
 * - New control flow syntax
 * - Tailwind CSS styling
 */
@Component({
  selector: 'app-form-demo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormComponent,
    FormFieldComponent,
    FormLabelComponent,
    FormMessageComponent,
    FormDescriptionComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    CheckboxComponent,
    CheckboxWithLabelComponent,
    RadioGroupComponent,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent
  ],
  template: `
    <div class="max-w-6xl mx-auto p-6 space-y-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Enhanced Form Components Demo
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Demonstrating form components with validation, accessibility, and Angular 19 features
        </p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- User Registration Form -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>User Registration</ui-card-title>
          </ui-card-header>
          <ui-card-content>
            <ui-form 
              [formGroup]="registrationForm" 
              [showErrorSummary]="true"
              (formSubmit)="onRegistrationSubmit()"
              (formInvalid)="onRegistrationInvalid($event)">
              <div class="space-y-6">
                <!-- Personal Information -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold">Personal Information</h3>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ui-form-field>
                      <ui-form-label htmlFor="firstName" [required]="true">First Name</ui-form-label>
                      <ui-input
                        id="firstName"
                        formControlName="firstName"
                        placeholder="Enter your first name"
                        [required]="true"
                        autocomplete="given-name" />
                      <ui-form-message 
                        [control]="registrationForm.get('firstName')"
                        fieldName="First Name" />
                    </ui-form-field>

                    <ui-form-field>
                      <ui-form-label htmlFor="lastName" [required]="true">Last Name</ui-form-label>
                      <ui-input
                        id="lastName"
                        formControlName="lastName"
                        placeholder="Enter your last name"
                        [required]="true"
                        autocomplete="family-name" />
                      <ui-form-message 
                        [control]="registrationForm.get('lastName')"
                        fieldName="Last Name" />
                    </ui-form-field>
                  </div>

                  <ui-form-field>
                    <ui-form-label htmlFor="email" [required]="true">Email Address</ui-form-label>
                    <ui-input
                      id="email"
                      type="email"
                      formControlName="email"
                      placeholder="Enter your email address"
                      [required]="true"
                      autocomplete="email" />
                    <ui-form-description>
                      We'll use this email for account verification and important updates.
                    </ui-form-description>
                    <ui-form-message 
                      [control]="registrationForm.get('email')"
                      fieldName="Email" />
                  </ui-form-field>

                  <ui-form-field>
                    <ui-form-label htmlFor="phone">Phone Number</ui-form-label>
                    <ui-input
                      id="phone"
                      type="tel"
                      formControlName="phone"
                      placeholder="+1 (555) 123-4567"
                      autocomplete="tel" />
                    <ui-form-message 
                      [control]="registrationForm.get('phone')"
                      fieldName="Phone Number" />
                  </ui-form-field>
                </div>

                <!-- Account Information -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold">Account Information</h3>
                  
                  <ui-form-field>
                    <ui-form-label htmlFor="password" [required]="true">Password</ui-form-label>
                    <ui-input
                      id="password"
                      type="password"
                      formControlName="password"
                      placeholder="Create a strong password"
                      [required]="true"
                      autocomplete="new-password" />
                    <ui-form-description>
                      Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
                    </ui-form-description>
                    <ui-form-message 
                      [control]="registrationForm.get('password')"
                      fieldName="Password" />
                  </ui-form-field>

                  <ui-form-field>
                    <ui-form-label htmlFor="confirmPassword" [required]="true">Confirm Password</ui-form-label>
                    <ui-input
                      id="confirmPassword"
                      type="password"
                      formControlName="confirmPassword"
                      placeholder="Confirm your password"
                      [required]="true"
                      autocomplete="new-password" />
                    <ui-form-message 
                      [control]="registrationForm.get('confirmPassword')"
                      fieldName="Confirm Password" />
                  </ui-form-field>

                  <ui-form-field>
                    <ui-form-label htmlFor="country" [required]="true">Country</ui-form-label>
                    <ui-select
                      id="country"
                      formControlName="country"
                      placeholder="Select your country"
                      [options]="countryOptions()"
                      [required]="true" />
                    <ui-form-message 
                      [control]="registrationForm.get('country')"
                      fieldName="Country" />
                  </ui-form-field>
                </div>

                <!-- Preferences -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold">Preferences</h3>
                  
                  <ui-form-field>
                    <ui-form-label>Account Type</ui-form-label>
                    <ui-radio-group
                      formControlName="accountType"
                      [options]="accountTypeOptions()"
                      [required]="true" />
                    <ui-form-message 
                      [control]="registrationForm.get('accountType')"
                      fieldName="Account Type" />
                  </ui-form-field>

                  <div class="space-y-3">
                    <ui-form-label>Communication Preferences</ui-form-label>
                    
                    <ui-checkbox-with-label
                      formControlName="emailNotifications"
                      label="Email notifications"
                      description="Receive email notifications about your account activity and updates." />
                    
                    <ui-checkbox-with-label
                      formControlName="smsNotifications"
                      label="SMS notifications"
                      description="Receive text messages for important account alerts." />
                    
                    <ui-checkbox-with-label
                      formControlName="marketingEmails"
                      label="Marketing emails"
                      description="Receive promotional emails about new features and offers." />
                  </div>
                </div>

                <!-- Terms and Conditions -->
                <ui-form-field>
                  <ui-checkbox-with-label
                    formControlName="agreeToTerms"
                    label="I agree to the Terms of Service and Privacy Policy"
                    description="You must agree to our terms to create an account."
                    [required]="true" />
                  <ui-form-message 
                    [control]="registrationForm.get('agreeToTerms')"
                    fieldName="Terms Agreement" />
                </ui-form-field>

                <!-- Submit Button -->
                <ui-button
                  type="submit"
                  [disabled]="registrationForm.invalid || isSubmitting()"
                  class="w-full">
                  @if (isSubmitting()) {
                    <span class="mr-2">Creating Account...</span>
                  } @else {
                    <span>Create Account</span>
                  }
                </ui-button>
              </div>
            </ui-form>
          </ui-card-content>
        </ui-card>

        <!-- Contact Form -->
        <ui-card>
          <ui-card-header>
            <ui-card-title>Contact Us</ui-card-title>
          </ui-card-header>
          <ui-card-content>
            <ui-form 
              [formGroup]="contactForm" 
              (formSubmit)="onContactSubmit()">
              <div class="space-y-6">
                <ui-form-field>
                  <ui-form-label htmlFor="contactName" [required]="true">Your Name</ui-form-label>
                  <ui-input
                    id="contactName"
                    formControlName="name"
                    placeholder="Enter your full name"
                    [required]="true" />
                  <ui-form-message 
                    [control]="contactForm.get('name')"
                    fieldName="Name" />
                </ui-form-field>

                <ui-form-field>
                  <ui-form-label htmlFor="contactEmail" [required]="true">Email Address</ui-form-label>
                  <ui-input
                    id="contactEmail"
                    type="email"
                    formControlName="email"
                    placeholder="Enter your email address"
                    [required]="true" />
                  <ui-form-message 
                    [control]="contactForm.get('email')"
                    fieldName="Email" />
                </ui-form-field>

                <ui-form-field>
                  <ui-form-label htmlFor="subject" [required]="true">Subject</ui-form-label>
                  <ui-select
                    id="subject"
                    formControlName="subject"
                    placeholder="Select a subject"
                    [options]="subjectOptions()"
                    [required]="true" />
                  <ui-form-message 
                    [control]="contactForm.get('subject')"
                    fieldName="Subject" />
                </ui-form-field>

                <ui-form-field>
                  <ui-form-label htmlFor="priority">Priority</ui-form-label>
                  <ui-radio-group
                    formControlName="priority"
                    [options]="priorityOptions()"
                    orientation="horizontal" />
                </ui-form-field>

                <ui-form-field>
                  <ui-form-label htmlFor="message" [required]="true">Message</ui-form-label>
                  <ui-textarea
                    id="message"
                    formControlName="message"
                    placeholder="Please describe your inquiry in detail..."
                    [rows]="6"
                    [required]="true"
                    [maxLength]="1000" />
                  <ui-form-description>
                    Maximum 1000 characters. {{ getMessageCharacterCount() }}/1000 characters used.
                  </ui-form-description>
                  <ui-form-message 
                    [control]="contactForm.get('message')"
                    fieldName="Message" />
                </ui-form-field>

                <ui-form-field>
                  <ui-checkbox-with-label
                    formControlName="copyToSelf"
                    label="Send me a copy of this message"
                    description="We'll send a copy to your email address for your records." />
                </ui-form-field>

                <ui-button
                  type="submit"
                  variant="outline"
                  [disabled]="contactForm.invalid"
                  class="w-full">
                  Send Message
                </ui-button>
              </div>
            </ui-form>
          </ui-card-content>
        </ui-card>
      </div>

      <!-- Form State Display -->
      <ui-card>
        <ui-card-header>
          <ui-card-title>Form State (Debug)</ui-card-title>
        </ui-card-header>
        <ui-card-content>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold mb-2">Registration Form</h4>
              <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <pre class="text-xs overflow-auto">{{ getFormState(registrationForm) }}</pre>
              </div>
            </div>
            <div>
              <h4 class="font-semibold mb-2">Contact Form</h4>
              <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <pre class="text-xs overflow-auto">{{ getFormState(contactForm) }}</pre>
              </div>
            </div>
          </div>
        </ui-card-content>
      </ui-card>
    </div>
  `
})
export class FormDemoComponent {
  private fb = inject(FormBuilder);

  // Signals for component state
  isSubmitting = signal(false);
  
  // Form options
  countryOptions = signal<SelectOption[]>([
    { value: 'us', label: 'United States', description: 'United States of America' },
    { value: 'uk', label: 'United Kingdom', description: 'United Kingdom of Great Britain' },
    { value: 'ca', label: 'Canada', description: 'Canada' },
    { value: 'au', label: 'Australia', description: 'Commonwealth of Australia' },
    { value: 'de', label: 'Germany', description: 'Federal Republic of Germany' },
    { value: 'fr', label: 'France', description: 'French Republic' },
    { value: 'jp', label: 'Japan', description: 'Japan' }
  ]);

  accountTypeOptions = signal<RadioOption[]>([
    { value: 'personal', label: 'Personal', description: 'For individual use' },
    { value: 'business', label: 'Business', description: 'For business and organizations' },
    { value: 'developer', label: 'Developer', description: 'For developers and technical users' }
  ]);

  subjectOptions = signal<SelectOption[]>([
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'other', label: 'Other' }
  ]);

  priorityOptions = signal<RadioOption[]>([
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]);

  // Registration Form
  registrationForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [FormValidationService.phoneNumber()]],
    password: ['', [Validators.required, FormValidationService.passwordStrength(8)]],
    confirmPassword: ['', [Validators.required, FormValidationService.confirmPassword('password')]],
    country: ['', Validators.required],
    accountType: ['personal', Validators.required],
    emailNotifications: [true],
    smsNotifications: [false],
    marketingEmails: [false],
    agreeToTerms: [false, Validators.requiredTrue]
  });

  // Contact Form
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    priority: ['medium'],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    copyToSelf: [false]
  });

  getMessageCharacterCount = computed(() => {
    const message = this.contactForm.get('message')?.value || '';
    return message.length;
  });

  async onRegistrationSubmit(): Promise<void> {
    if (this.registrationForm.valid) {
      this.isSubmitting.set(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Registration data:', this.registrationForm.value);
        
        // Show success message (in real app, use toast/notification)
        alert('Account created successfully!');
        
        // Reset form
        this.registrationForm.reset();
        FormValidationService.resetValidationState(this.registrationForm);
      } catch (error) {
        console.error('Error creating account:', error);
        alert('Error creating account. Please try again.');
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  onRegistrationInvalid(errors: { [key: string]: any }): void {
    console.log('Registration form errors:', errors);
  }

  onContactSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Contact form data:', this.contactForm.value);
      alert('Message sent successfully!');
      
      // Reset form
      this.contactForm.reset({ priority: 'medium' });
      FormValidationService.resetValidationState(this.contactForm);
    }
  }

  getFormState(form: FormGroup): string {
    return JSON.stringify({
      valid: form.valid,
      dirty: form.dirty,
      touched: form.touched,
      value: form.value,
      errors: FormValidationService.getAllFormErrors(form)
    }, null, 2);
  }
}