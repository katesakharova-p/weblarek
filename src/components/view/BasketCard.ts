import { Card } from "./Card";

interface IBasketCard {
  index: number;
}

export class BasketCard extends Card<IBasketCard> {
  private indexElement: HTMLElement;
  private button: HTMLButtonElement;

  constructor(container: HTMLElement, actions: { onRemove: () => void }) {
    super(container);

    this.indexElement = container.querySelector(".basket__item-index")!;
    this.button = container.querySelector(".basket__item-delete")!;

    this.button.addEventListener("click", (evt) => {
      evt.stopPropagation();
      actions.onRemove();
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value + 1);
  }
}