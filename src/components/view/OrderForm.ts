import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";
import { TPayment } from "../../types";

export class OrderForm extends BaseForm {
  private addressInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private paymentButtons: HTMLButtonElement[];
  private error: HTMLElement;

  private payment: TPayment | null = null;

  constructor(form: HTMLFormElement, events: IEvents) {
    super(form, events);

    this.addressInput = form.querySelector(
      'input[name="address"]',
    ) as HTMLInputElement;

    this.submitButton = form.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    this.error = form.querySelector(".form__errors") as HTMLElement;

    this.paymentButtons = Array.from(
      form.querySelectorAll(".button_alt"),
    ) as HTMLButtonElement[];

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.payment = btn.name as TPayment;

        this.paymentButtons.forEach((b) =>
          b.classList.remove("button_alt-active"),
        );

        btn.classList.add("button_alt-active");

        this.emitChange();
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.emitChange();
    });

    this.events.on("order:errors", (errors: any) => {
      this.error.textContent = errors.payment || errors.address || "";

      const isValid = !errors.payment && !errors.address;
      this.submitButton.disabled = !isValid;
    });
  }

  private emitChange() {
    this.events.emit("order:change", {
      payment: this.payment,
      address: this.addressInput.value.trim(),
    });
  }

  protected handleSubmit(): void {
    this.events.emit("order:submit", {
      payment: this.payment,
      address: this.addressInput.value.trim(),
    });
  }
}
