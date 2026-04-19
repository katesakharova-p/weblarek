import { Component } from "../base/Component";

interface ICatalogView {
  items: HTMLElement[];
}

export class CatalogView extends Component<ICatalogView> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}