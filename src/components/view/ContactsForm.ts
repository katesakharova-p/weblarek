import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";
import { IBuyer } from "../../types";

export class ContactsForm extends BaseForm<IBuyer> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(form: HTMLFormElement, events: IEvents) {
    super(form, events);

    this.emailInput = form.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement;

    this.phoneInput = form.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement;

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:change", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:change", {
        phone: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  protected handleSubmit(): void {
    this.events.emit("contacts:submit", {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    });
  }
}
