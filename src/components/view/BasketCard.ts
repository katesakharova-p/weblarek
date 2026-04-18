import { Card } from "./Card";
import { IProduct } from "../../types";

export class BasketCard extends Card<IProduct> {
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

  set data(data: IProduct) {
    this.setTitle(data.title);
    this.setPrice(data.price);
  }
}
