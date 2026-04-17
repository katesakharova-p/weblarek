import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

export abstract class Card {
  protected container: HTMLElement;
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected button?: HTMLButtonElement;
  protected category?: HTMLElement;

  protected id!: string;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    this.container = container;

    this.title = container.querySelector(".card__title")!;
    this.price = container.querySelector(".card__price")!;
    this.button = container.querySelector(".card__button") || undefined;
    this.category = container.querySelector(".card__category") || undefined;

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
    this.setCategory(data.category);

    return this.container;
  }

  protected setTitle(value: string): void {
    this.title.textContent = value;
  }

  protected setPrice(price: number | null): void {
    this.price.textContent = price === null ? "Бесценно" : `${price} синапсов`;
  }

  protected setCategory(category: string): void {
    if (!this.category) return;

    this.category.textContent = category;

    const className = categoryMap[category as keyof typeof categoryMap];

    if (className) {
      this.category.classList.add(className);
    }
  }
}
