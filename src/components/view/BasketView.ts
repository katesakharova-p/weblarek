import { IEvents } from "../base/Events";

export class BasketView {
private list: HTMLElement;
private totalElement: HTMLElement;
private orderButton: HTMLButtonElement;

constructor(container: HTMLElement, private events: IEvents) {
this.list = container.querySelector(".basket__list") as HTMLElement;
this.totalElement = container.querySelector(".basket__price") as HTMLElement;
this.orderButton = container.querySelector(".basket__button") as HTMLButtonElement;


this.orderButton.addEventListener("click", () => {
  this.events.emit("order:open");
});


}

render(items: HTMLElement[], total: number): void {
this.list.replaceChildren(...items);


if (items.length === 0) {
  this.list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
}

this.totalElement.textContent = `${total} синапсов`;

this.orderButton.disabled = items.length === 0;


}
}
