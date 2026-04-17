import { IEvents } from "./base/Events";
import { ProductsModel } from "./models/ProductsModel";
import { CartModel } from "./models/CartModel";
import { BuyerModel } from "./models/BuyerModel";

import { CatalogView } from "./view/CatalogView";
import { Modal } from "./view/Modal";

import { CatalogCard } from "./view/CatalogCard";
import { PreviewCard } from "./view/PreviewCard";
import { BasketCard } from "./view/BasketCard";
import { BasketView } from "./view/BasketView";
import { OrderForm } from "./view/OrderForm";
import { ContactsForm } from "./view/ContactsForm";

import { WebLarekApi } from "./api/WebLarekApi";
import { IProduct, TPayment } from "../types";

export class Presenter {
  constructor(
    private events: IEvents,
    private productsModel: ProductsModel,
    private cartModel: CartModel,
    private buyerModel: BuyerModel,
    private catalogView: CatalogView,
    private modal: Modal,
    private api: WebLarekApi,
  ) {
    this.subscribeEvents();
  }

  private subscribeEvents() {
    const counter = document.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;

    // каталог
    this.events.on("products:changed", () => {
      this.renderCatalog();
    });

    // корзина
    this.events.on("cart:changed", () => {
      counter.textContent = String(this.cartModel.getCount());
    });

    // открыть товар
    this.events.on("card:select", (data: { id: string }) => {
      const product = this.productsModel.getProductById(data.id);
      if (!product) return;
      this.openPreview(product);
    });

    // добавить / удалить товар
    this.events.on("card:action", (data: { id: string }) => {
      const product = this.productsModel.getProductById(data.id);
      if (!product) return;

      const exists = this.cartModel.getItems().some((p) => p.id === data.id);

      exists
        ? this.cartModel.removeItem(product)
        : this.cartModel.addItem(product);

      this.modal.close();
    });

    // удалить из корзины
    this.events.on("basket:remove", (data: { id: string }) => {
      const product = this.cartModel.getItems().find((p) => p.id === data.id);
      if (!product) return;

      this.cartModel.removeItem(product);
      this.renderBasket();
    });

    // открыть корзину
    this.events.on("basket:open", () => {
      this.renderBasket();
    });

    // открыть форму заказа
    this.events.on("order:open", () => {
      this.openOrder();
    });

    // шаг 1
    this.events.on(
      "order:submit",
      (data: { payment: TPayment; address: string }) => {
        this.buyerModel.setData(data);

        const errors = this.buyerModel.validate();

        if (errors.payment || errors.address) {
          return;
        }

        this.openContacts();
      },
    );

    this.events.on("order:change", (data) => {
      this.buyerModel.setData(data);
    });

    // шаг 2
    this.events.on(
      "contacts:submit",
      async (data: { email: string; phone: string }) => {
        this.buyerModel.setData(data);

        const errors = this.buyerModel.validate();

        if (errors.email || errors.phone) {
          return;
        }

        const buyer = this.buyerModel.getData();

        const order = {
          ...buyer,
          total: this.cartModel.getTotal(),
          items: this.cartModel.getItems().map((p) => p.id),
        };

        try {
          const result = await this.api.postOrder(order);

          this.cartModel.clear();
          this.buyerModel.clear();

          this.showSuccess(result.total);
        } catch (e) {
          console.error(e);
        }
      },
    );

    this.events.on("contacts:change", (data) => {
      this.buyerModel.setData(data);
    });
  }

  private openPreview(product: IProduct) {
    const template = document.querySelector(
      "#card-preview",
    ) as HTMLTemplateElement;

    const container = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    const isInCart = this.cartModel.getItems().some((p) => p.id === product.id);

    const isAvailable = product.price !== null;

    const card = new PreviewCard(container, this.events);

    this.modal.open(card.render(product, isInCart, isAvailable));
  }

  private openOrder() {
    const template = document.querySelector("#order") as HTMLTemplateElement;

    const container = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    const form = new OrderForm(container as HTMLFormElement, this.events);

    this.modal.open(form.render());
  }

  private openContacts() {
    const template = document.querySelector("#contacts") as HTMLTemplateElement;

    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const formElement = fragment.querySelector("form") as HTMLFormElement;

    const form = new ContactsForm(formElement, this.events);

    this.modal.open(form.render());
  }

  private showSuccess(total: number) {
    const template = document.querySelector("#success") as HTMLTemplateElement;

    const container = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    const text = container.querySelector(
      ".order-success__description",
    ) as HTMLElement;

    text.textContent = `Списано ${total} синапсов`;

    const button = container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;

    button.addEventListener("click", () => {
      this.modal.close();
      this.renderCatalog();
    });

    this.modal.open(container);
  }

  private renderCatalog() {
    const template = document.querySelector(
      "#card-catalog",
    ) as HTMLTemplateElement;

    const items = this.productsModel.getProducts().map((product) => {
      const container = template.content.firstElementChild!.cloneNode(
        true,
      ) as HTMLElement;

      return new CatalogCard(container, this.events).render(product);
    });

    this.catalogView.render(items);
  }

  private renderBasket() {
    const template = document.querySelector("#basket") as HTMLTemplateElement;

    const container = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    const basketView = new BasketView(container, this.events);

    const items = this.cartModel.getItems().map((product, index) => {
      const itemTemplate = document.querySelector(
        "#card-basket",
      ) as HTMLTemplateElement;

      const el = itemTemplate.content.firstElementChild!.cloneNode(
        true,
      ) as HTMLElement;

      return new BasketCard(el, this.events).render(product, index);
    });

    basketView.render(items, this.cartModel.getTotal());

    this.modal.open(container);
  }
}
