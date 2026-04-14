import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export abstract class Card {
  protected container: HTMLElement;
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected button?: HTMLButtonElement;

  protected id!: string;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    this.container = container;

    this.title = container.querySelector(".card__title")!;
    this.price = container.querySelector(".card__price")!;
    this.button = container.querySelector(".card__button") || undefined;

    this.container.addEventListener("click", () => {
      this.events.emit("card:select", { id: this.id });
    });

    if (this.button) {
      this.button.addEventListener("click", (evt) => {
        evt.stopPropagation();

        this.events.emit("card:action", {
          id: this.id,
        });
      });
    }
  }

  render(data: IProduct): HTMLElement {
    this.id = data.id;

    this.setTitle(data.title);
    this.setPrice(data.price);

    return this.container;
  }

  protected setTitle(value: string): void {
    this.title.textContent = value;
  }

  protected setPrice(price: number | null): void {
    if (price === null) {
      this.price.textContent = "Бесценно";

      if (this.button) {
        this.button.disabled = true;
        this.button.textContent = "Недоступно";
      }
    } else {
      this.price.textContent = `${price} синапсов`;
    }
  }
}
