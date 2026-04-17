import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

const CDN_URL = "https://larek-api.nomoreparties.co/content/weblarek";

export class PreviewCard {
  private image: HTMLImageElement;
  private title: HTMLElement;
  private description: HTMLElement;
  private button: HTMLButtonElement;
  private price: HTMLElement;

  constructor(
    private container: HTMLElement,
    private events: IEvents,
  ) {
    this.image = container.querySelector(".card__image")!;
    this.title = container.querySelector(".card__title")!;
    this.description = container.querySelector(".card__text")!;
    this.button = container.querySelector(".card__button")!;
    this.price = container.querySelector(".card__price")!;
  }

  render(
    product: IProduct,
    isInCart: boolean,
    isAvailable: boolean,
  ): HTMLElement {
    this.title.textContent = product.title;
    this.description.textContent = product.description;
    this.image.src = `${CDN_URL}${product.image}`;

    this.price.textContent =
      product.price === null ? "Бесценно" : `${product.price} синапсов`;

    this.button.disabled = !isAvailable;

    if (!isAvailable) {
      this.button.textContent = "Недоступно";
    } else {
      this.button.textContent = isInCart ? "Удалить из корзины" : "В корзину";
    }

    this.button.onclick = () => {
      this.events.emit("card:action", { id: product.id });
    };

    return this.container;
  }
}
