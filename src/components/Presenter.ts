import { IEvents } from "./base/Events";
import { ProductsModel } from "./models/ProductsModel";
import { CartModel } from "./models/CartModel";

import { CatalogView } from "./view/CatalogView";
import { Modal } from "./view/Modal";

import { CatalogCard } from "./view/CatalogCard";
import { PreviewCard } from "./view/PreviewCard";
import { BasketCard } from "./view/BasketCard";
import { BasketView } from "./view/BasketView";

export class Presenter {
constructor(
private events: IEvents,
private productsModel: ProductsModel,
private cartModel: CartModel,
private catalogView: CatalogView,
private modal: Modal
) {
this.subscribeEvents();
}

private subscribeEvents() {
const counter = document.querySelector(
".header__basket-counter"
) as HTMLElement;


this.events.on("products:changed", () => {
  this.renderCatalog();
});

this.events.on("cart:changed", () => {
  if (counter) {
    counter.textContent = String(this.cartModel.getCount());
  }
});

this.events.on("card:select", (data: { id: string }) => {
  const product = this.productsModel.getProductById(data.id);
  if (!product) return;

  const template = document.querySelector(
    "#card-preview"
  ) as HTMLTemplateElement;

  const container = template.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;

  const card = new PreviewCard(container, this.events);

  this.modal.open(card.render(product));
});

this.events.on("card:action", (data: { id: string }) => {
  const product = this.productsModel.getProductById(data.id);
  if (!product) return;

  this.cartModel.addItem(product);
});

this.events.on("basket:remove", (data: { id: string }) => {
  const product = this.cartModel.getItems().find((p) => p.id === data.id);
  if (!product) return;

  this.cartModel.removeItem(product);
});

// 🔥 ВАЖНО: правильный вызов
this.events.on("basket:open", () => {
  this.renderBasket();
});


}

private renderCatalog() {
const template = document.querySelector(
"#card-catalog"
) as HTMLTemplateElement;

const items = this.productsModel.getProducts().map((product) => {
  const container = template.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;

  const card = new CatalogCard(container, this.events);
  return card.render(product);
});

this.catalogView.render(items);


}

private renderBasket(): void {
const template = document.querySelector("#basket") as HTMLTemplateElement;


const container = template.content.firstElementChild!.cloneNode(
  true
) as HTMLElement;

const basketView = new BasketView(container, this.events);

const items = this.cartModel.getItems().map((product, index) => {
  const itemTemplate = document.querySelector(
    "#card-basket"
  ) as HTMLTemplateElement;

  const itemContainer = itemTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;

  const card = new BasketCard(itemContainer, this.events);
  return card.render(product, index);
});

const total = this.cartModel.getTotal();

basketView.render(items, total);

this.modal.open(container);


}
}
