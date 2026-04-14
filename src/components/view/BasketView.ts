export class BasketView {
  private container: HTMLElement;
  private totalElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.totalElement = container.querySelector('.basket__price') as HTMLElement;
  }

  render(items: HTMLElement[], total: number): void {
    this.container.replaceChildren(...items);
    this.totalElement.textContent = String(total);
  }
}