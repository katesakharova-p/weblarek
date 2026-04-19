import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  private counterElement: HTMLElement;
  private button: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.counterElement = this.container.querySelector(
      ".header__basket-counter"
    ) as HTMLElement;

    this.button = this.container.querySelector(
      ".header__basket"
    ) as HTMLElement;

    this.button.addEventListener("click", () => {
      events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}