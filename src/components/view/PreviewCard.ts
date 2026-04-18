import { IProduct } from "../../types";
import { Card } from "./Card";

export class PreviewCard extends Card<IProduct> {
  private image: HTMLImageElement;
  private description: HTMLElement;
  private button: HTMLButtonElement;

  constructor(container: HTMLElement, actions: { onClick: () => void }) {
    super(container);

    this.image = container.querySelector(".card__image")!;
    this.description = container.querySelector(".card__text")!;
    this.button = container.querySelector(".card__button")!;

    this.button.addEventListener("click", (e) => {
      e.stopPropagation();
      actions.onClick();
    });
  }

  set data(data: IProduct) {
    this.setTitle(data.title);
    this.setPrice(data.price);
    this.setCategory(data.category);

    this.description.textContent = data.description;

    this.image.src = data.image;
    this.image.alt = data.title;
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

    this.button.textContent = isInCart ? "Удалить из корзины" : "В корзину";
  }
}
