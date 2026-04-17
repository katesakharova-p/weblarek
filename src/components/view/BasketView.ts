import { IEvents } from "../base/Events";

export class BasketView {
  private list: HTMLElement;
  private total: HTMLElement;
  private button: HTMLButtonElement;

  constructor(private container: HTMLElement, private events: IEvents) {
    this.list = this.container.querySelector(".basket__list") as HTMLElement;
    this.total = this.container.querySelector(".basket__price") as HTMLElement;
    this.button = this.container.querySelector(".basket__button") as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  render(items: HTMLElement[], total: number) {
    if (items.length === 0) {
      this.list.innerHTML = "<p>Корзина пуста</p>";
      this.button.disabled = true;
    } else {
      this.list.replaceChildren(...items);
      this.button.disabled = false;
    }

    this.total.textContent = `${total} синапсов`;
  }
}