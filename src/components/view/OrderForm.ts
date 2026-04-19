import { IEvents } from "../base/Events";
import { BaseForm } from "./BaseForm";
import { TPayment } from "../../types";

interface IOrderForm {
  payment: TPayment | null;
  address: string;
}

export class OrderForm extends BaseForm<IOrderForm> {
  private addressInput: HTMLInputElement;
  private paymentButtons: HTMLButtonElement[];

  constructor(form: HTMLFormElement, events: IEvents) {
    super(form, events);

    this.addressInput = form.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement;

    this.paymentButtons = Array.from(
      form.querySelectorAll(".button_alt")
    ) as HTMLButtonElement[];

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.events.emit<Partial<IOrderForm>>("order:change", {
          payment: btn.name as TPayment,
        });
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit<Partial<IOrderForm>>("order:change", {
        address: this.addressInput.value,
      });
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle("button_alt-active", btn.name === value);
    });
  }

  protected handleSubmit(): void {
    this.events.emit("order:submit");
  }
}