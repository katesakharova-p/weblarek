import { Card } from "./Card";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";

export class PreviewCard extends Card {
  private image: HTMLImageElement;
  private category: HTMLElement;
  private description: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.image = container.querySelector(".card__image")!;
    this.category = container.querySelector(".card__category")!;
    this.description = container.querySelector(".card__text")!;
  }

  render(data: IProduct): HTMLElement {
    super.render(data);

    this.setImage(data.image, data.title);
    this.setCategory(data.category);
    this.setDescription(data.description);

    this.updateButton(data.price);

    return this.container;
  }

  private setImage(src: string, alt: string): void {
    this.image.src = src;
    this.image.alt = alt;
  }

  private setCategory(category: string): void {
    this.category.textContent = category;
    this.category.className = `card__category ${categoryMap[category as keyof typeof categoryMap]}`;
  }

  private setDescription(text: string): void {
    this.description.textContent = text;
  }

  private updateButton(price: number | null): void {
    if (!this.button) return;

    if (price === null) {
      this.button.disabled = true;
      this.button.textContent = "Недоступно";
    } else {
      this.button.disabled = false;
      this.button.textContent = "В корзину";
    }
  }
}
