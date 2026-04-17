import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";

export class OrderForm extends BaseForm {
  private addressInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private error: HTMLElement;
  private paymentButtons: HTMLButtonElement[];

  private payment: string | null = null;

  constructor(form: HTMLFormElement, events: IEvents) {
    super(form, events);

    this.addressInput = form.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement;

    this.submitButton = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    this.error = form.querySelector(".form__errors") as HTMLElement;

    this.paymentButtons = Array.from(
      form.querySelectorAll(".button_alt")
    ) as HTMLButtonElement[];

    // выбор оплаты
    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.payment = btn.name;

        // сброс активных
        this.paymentButtons.forEach((b) =>
          b.classList.remove("button_alt-active")
        );

        // активная кнопка
        btn.classList.add("button_alt-active");

        this.validate();
      });
    });

    // ввод адреса
    this.addressInput.addEventListener("input", () => {
      this.validate();
    });

    this.validate();
  }

  private validate() {
    let errorText = "";

    if (!this.payment) {
      errorText = "Выберите способ оплаты";
    } else if (!this.addressInput.value.trim()) {
      errorText = "Необходимо указать адрес";
    }

    this.error.textContent = errorText;

        this.submitButton.disabled = !!errorText;
  }

  protected handleSubmit(): void {
  
    if (this.submitButton.disabled) return;

    this.events.emit("order:submit", {
      payment: this.payment,
      address: this.addressInput.value.trim(),
    });
  }
}