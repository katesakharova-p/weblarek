import { IEvents } from "../base/Events";

export abstract class BaseForm {
  protected form: HTMLFormElement;
  protected events: IEvents;

  constructor(form: HTMLFormElement, events: IEvents) {
    this.form = form;
    this.events = events;

    this.form.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.form.addEventListener('input', () => {
  const isValid = this.form.checkValidity();
  this.events.emit('form:change', { valid: isValid });
});
  }

  protected abstract handleSubmit(): void;

  render(): HTMLElement {
    return this.form;
  }

  
}
