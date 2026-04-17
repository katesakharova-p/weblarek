import { BaseForm } from "./BaseForm";
import { IEvents } from "../base/Events";

export class OrderForm extends BaseForm {
private addressInput: HTMLInputElement;
private paymentButtons: NodeListOf<HTMLButtonElement>;

constructor(form: HTMLFormElement, events: IEvents) {
super(form, events);


this.addressInput = this.form.querySelector(
  "input[name='address']"
) as HTMLInputElement;

this.paymentButtons = this.form.querySelectorAll(".button_alt");

this.paymentButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    this.paymentButtons.forEach((b) =>
      b.classList.remove("button_alt-active")
    );

    btn.classList.add("button_alt-active");

    this.events.emit("order:payment", {
      method: btn.name,
    });
  });
});


}

protected handleSubmit(): void {
this.events.emit("order:submit", {
address: this.addressInput.value,
});
}
}
