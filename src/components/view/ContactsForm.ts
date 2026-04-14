import { BaseForm } from './BaseForm';
import { IEvents } from '../base/Events';

export class ContactsForm extends BaseForm {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(form: HTMLFormElement, events: IEvents) {
    super(form, events);

    this.emailInput = this.form.querySelector("input[name='email']") as HTMLInputElement;
    this.phoneInput = this.form.querySelector("input[name='phone']") as HTMLInputElement;
  }

  protected handleSubmit(): void {
    this.events.emit('contacts:submit', {
      email: this.emailInput.value,
      phone: this.phoneInput.value
    });
  }
}