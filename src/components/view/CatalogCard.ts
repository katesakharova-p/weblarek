import { Card } from "./Card";
import { IProduct } from "../../types";

export class CatalogCard extends Card<IProduct> {
  constructor(container: HTMLElement, actions: { onClick: () => void }) {
    super(container);

    this.container.addEventListener("click", actions.onClick);
  }

  set data(data: IProduct) {
    this.setTitle(data.title);
    this.setPrice(data.price);
    this.setCategory(data.category);
  }
}
