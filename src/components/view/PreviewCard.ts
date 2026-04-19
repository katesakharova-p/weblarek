import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";

interface IPreviewCard {
  category: string;
  description: string;
  image: string;
}

export class PreviewCard extends Card<IPreviewCard> {
  private imageElement: HTMLImageElement;
  private descriptionElement: HTMLElement;
  private button: HTMLButtonElement;
  private categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions: { onClick: () => void }) {
    super(container);

    this.imageElement = container.querySelector(".card__image")!;
    this.descriptionElement = container.querySelector(".card__text")!;
    this.button = container.querySelector(".card__button")!;
    this.categoryElement = this.container.querySelector(".card__category")!;

    this.button.addEventListener("click", (e) => {
      e.stopPropagation();
      actions.onClick();
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    this.categoryElement.classList.remove(...Object.values(categoryMap));

    const className = categoryMap[value as keyof typeof categoryMap];
    if (className) {
      this.categoryElement.classList.add(className);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set image(value: string) {
    this.setImage(
      this.imageElement,
      value,
      this.titleElement.textContent || ""
    );
  }

  set buttonState({
    isInCart,
    isAvailable,
  }: {
    isInCart: boolean;
    isAvailable: boolean;
  }) {
    this.button.disabled = !isAvailable;

    if (!isAvailable) {
      this.button.textContent = "Недоступно";
      return;
    }

    this.button.textContent = isInCart
      ? "Удалить из корзины"
      : "В корзину";
  }
}