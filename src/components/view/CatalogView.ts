export class CatalogView {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(items: HTMLElement[]): void {
    this.container.replaceChildren(...items);
  }
}
