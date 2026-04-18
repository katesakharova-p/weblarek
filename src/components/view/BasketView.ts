import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class BasketView extends Component<null> {
  private list: HTMLElement;
  private totalElement: HTMLElement;
  private button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private events: IEvents,
  ) {
    super(container);

    this.list = this.container.querySelector(".basket__list") as HTMLElement;
    this.totalElement = this.container.querySelector(
      ".basket__price",
    ) as HTMLElement;
    this.button = this.container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    this.list.replaceChildren(...items);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set valid(value: boolean) {
    this.button.disabled = !value;
  }

  getContainer(): HTMLElement {
    return this.container;
  }
}
