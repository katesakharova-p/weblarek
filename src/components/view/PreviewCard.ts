import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class PreviewCard {
private title: HTMLElement;
private image: HTMLImageElement;
private description: HTMLElement;
private button: HTMLButtonElement;
private price: HTMLElement;

constructor(private container: HTMLElement, private events: IEvents) {
this.title = container.querySelector(".card__title")!;
this.image = container.querySelector(".card__image")!;
this.description = container.querySelector(".card__text")!;
this.button = container.querySelector(".card__button")!;
this.price = container.querySelector(".card__price")!;
}

render(product: IProduct, inCart: boolean): HTMLElement {
this.title.textContent = product.title;
this.description.textContent = product.description;
this.image.src = `/images/${product.image}`;
this.image.alt = product.title;
this.price.textContent = `${product.price} синапсов`;


this.button.textContent = inCart
  ? "Удалить из корзины"
  : "В корзину";

this.button.onclick = () => {
  this.events.emit("card:action", { id: product.id });
};

return this.container;


}
}
