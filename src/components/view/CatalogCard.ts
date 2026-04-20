import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

interface ICatalogCard {
  category: string;
  image: string;
}

export class CatalogCard extends Card<ICatalogCard> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions: { onClick: () => void }) {
    super(container);

    this.categoryElement = this.container.querySelector(".card__category")!;
    this.imageElement = this.container.querySelector(".card__image")!;

    this.container.addEventListener("click", actions.onClick);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    this.categoryElement.classList.remove(...Object.values(categoryMap));

    const className = categoryMap[value as keyof typeof categoryMap];
    if (className) {
      this.categoryElement.classList.add(className);
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }
}
