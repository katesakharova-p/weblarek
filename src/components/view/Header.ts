import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Header extends Component<null> {
  private counter: HTMLElement;
  private button: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.counter = this.container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;

    this.button = this.container.querySelector(
      ".header__basket",
    ) as HTMLElement;

    this.button.addEventListener("click", () => {
      events.emit("basket:open");
    });
  }

  setCounter(value: number): void {
    this.counter.textContent = String(value);
  }
}
