import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";

export class ContactsForm extends BaseForm {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private error: HTMLElement;

  constructor(form: HTMLFormElement, events: IEvents) {
    super(form, events);

    this.emailInput = form.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;

    this.phoneInput = form.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement;

    this.submitButton = form.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    this.error = form.querySelector(".form__errors") as HTMLElement;

    this.emailInput.addEventListener("input", () => this.emitChange());
    this.phoneInput.addEventListener("input", () => this.emitChange());
  }

  private emitChange() {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    let error = "";

    if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
      error = "Некорректный email";
    } else if (!phone || !phone.match(/^\+?\d{10,}$/)) {
      error = "Некорректный телефон";
    }

    this.error.textContent = error;

    const isValid = email !== "" && phone !== "" && error === "";

    this.submitButton.disabled = !isValid;

    this.events.emit("contacts:change", { email, phone });
  }

  protected handleSubmit(): void {
    this.events.emit("contacts:submit", {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    });
  }
}
