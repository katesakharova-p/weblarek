import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class SuccessView extends Component<null> {
  private description: HTMLElement;
  private button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private events: IEvents,
  ) {
    super(container);

    this.description = this.container.querySelector(
      ".order-success__description",
    )!;
    this.button = this.container.querySelector(".order-success__close")!;

    this.button.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}
