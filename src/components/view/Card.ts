import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";

export abstract class Card<T> extends Component<T> {
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected category?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.title = this.container.querySelector(".card__title")!;
    this.price = this.container.querySelector(".card__price")!;
    this.category =
      this.container.querySelector(".card__category") || undefined;
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

    this.category.classList.remove(...Object.values(categoryMap));

    const className = categoryMap[category as keyof typeof categoryMap];
    if (className) {
      this.category.classList.add(className);
    }
  }
}
