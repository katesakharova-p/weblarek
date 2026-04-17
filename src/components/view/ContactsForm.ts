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
      'input[name="email"]'
    ) as HTMLInputElement;

    this.phoneInput = form.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement;

    this.submitButton = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    this.error = form.querySelector(".form__errors") as HTMLElement;

    this.emailInput.addEventListener("input", () => this.validate());
    this.phoneInput.addEventListener("input", () => this.validate());

    this.validate();
  }

  private validate() {
    let errorText = "";

    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    if (!email) {
      errorText = "Введите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorText = "Некорректный email";
    } else if (!phone) {
      errorText = "Введите телефон";
    }

    this.error.textContent = errorText;
    this.submitButton.disabled = !!errorText;
  }

  protected handleSubmit(): void {
    console.log("SUBMIT WORKS"); // 👈 временно для проверки

    if (this.submitButton.disabled) return;

    this.events.emit("contacts:submit", {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    });
  }
}