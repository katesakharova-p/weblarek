import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

interface ICatalogCard {
  category: string;
}

export class CatalogCard extends Card<ICatalogCard> {
  private categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions: { onClick: () => void }) {
    super(container);

    this.categoryElement = this.container.querySelector(".card__category")!;
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
}