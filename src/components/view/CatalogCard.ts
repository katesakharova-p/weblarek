import { Card } from "./Card";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogCard extends Card {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
  }

  render(data: IProduct): HTMLElement {
    super.render(data);

    return this.container;
  }
}
