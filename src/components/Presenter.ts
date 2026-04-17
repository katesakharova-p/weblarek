import { IEvents } from "./base/Events";
import { ProductsModel } from "./models/ProductsModel";
import { CartModel } from "./models/CartModel";

import { CatalogView } from "./view/CatalogView";
import { Modal } from "./view/Modal";

import { CatalogCard } from "./view/CatalogCard";
import { PreviewCard } from "./view/PreviewCard";
import { BasketCard } from "./view/BasketCard";
import { BasketView } from "./view/BasketView";
import { OrderForm } from "./view/OrderForm";
import { ContactsForm } from "./view/ContactsForm";

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

    // каталог
    this.events.on("products:changed", () => {
      this.renderCatalog();
    });

    // счётчик корзины
    this.events.on("cart:changed", () => {
      if (counter) {
        counter.textContent = String(this.cartModel.getCount());
      }
    });

    // открыть карточку
    this.events.on("card:select", (data: { id: string }) => {
      const product = this.productsModel.getProductById(data.id);
      if (!product) return;

      const template = document.querySelector(
        "#card-preview"
      ) as HTMLTemplateElement;

      const container = template.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;

      const isInCart = this.cartModel
        .getItems()
        .some((p) => p.id === product.id);

      const card = new PreviewCard(container, this.events);

      this.modal.open(card.render(product, isInCart));
    });

    // добавить / удалить
    this.events.on("card:action", (data: { id: string }) => {
      const product = this.productsModel.getProductById(data.id);
      if (!product) return;

      const exists = this.cartModel
        .getItems()
        .some((p) => p.id === product.id);

      if (exists) {
        this.cartModel.removeItem(product);
      } else {
        this.cartModel.addItem(product);
      }

      // перерисовка
      const template = document.querySelector(
        "#card-preview"
      ) as HTMLTemplateElement;

      const container = template.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;

      const isInCart = this.cartModel
        .getItems()
        .some((p) => p.id === product.id);

      const card = new PreviewCard(container, this.events);

      this.modal.open(card.render(product, isInCart));
    });

    // удалить из корзины
    this.events.on("basket:remove", (data: { id: string }) => {
      const product = this.cartModel
        .getItems()
        .find((p) => p.id === data.id);

      if (!product) return;

      this.cartModel.removeItem(product);
      this.renderBasket();
    });

    // открыть корзину
    this.events.on("basket:open", () => {
      this.renderBasket();
    });

    // шаг 1
    this.events.on("order:open", () => {
      const template = document.querySelector(
        "#order"
      ) as HTMLTemplateElement;

      const container = template.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;

      const form = new OrderForm(
        container as HTMLFormElement,
        this.events
      );

      this.modal.open(form.render());
    });

    // шаг 2
    this.events.on("order:submit", () => {
      const template = document.querySelector(
        "#contacts"
      ) as HTMLTemplateElement;

      const fragment = template.content.cloneNode(true) as DocumentFragment;

      const formElement = fragment.querySelector("form") as HTMLFormElement;

      const form = new ContactsForm(formElement, this.events);

      this.modal.open(form.render());
    });

    //  финал
    this.events.on("contacts:submit", (data) => {
      const total = this.cartModel.getTotal();

      this.cartModel.clear();

      const template = document.querySelector(
        "#success"
      ) as HTMLTemplateElement;

      const container = template.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;

      // сумма
      const text = container.querySelector(
        ".order-success__description"
      ) as HTMLElement;

      text.textContent = `Списано ${total} синапсов`;

      // кнопка
      const button = container.querySelector(
        ".order-success__close"
      ) as HTMLButtonElement;

      button.addEventListener("click", () => {
        this.modal.close();
      });

      this.modal.open(container);
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

  private renderBasket() {
    const template = document.querySelector(
      "#basket"
    ) as HTMLTemplateElement;

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