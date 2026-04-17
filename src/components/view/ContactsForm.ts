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

    this.events.on("contacts:errors", (errors: any) => {
      this.error.textContent = errors.email || errors.phone || "";

      const isValid = !errors.email && !errors.phone;
      this.submitButton.disabled = !isValid;
    });
  }

  private emitChange() {
    this.events.emit("contacts:change", {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    });
  }

  protected handleSubmit(): void {
    this.events.emit("contacts:submit", {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    });
  }
}
