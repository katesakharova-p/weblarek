import { IEvents } from "./components/base/Events";
import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { CatalogView } from "./components/view/CatalogView";
import { Modal } from "./components/view/Modal";
import { Header } from "./components/view/Header";

import { CatalogCard } from "./components/view/CatalogCard";
import { BasketCard } from "./components/view/BasketCard";
import { PreviewCard } from "./components/view/PreviewCard";
import { BasketView } from "./components/view/BasketView";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { SuccessView } from "./components/view/SuccessView";

import { WebLarekApi } from "./components/api/WebLarekApi";
import { IProduct } from "./types";

import { cloneTemplate } from "./utils/utils";

export class Presenter {
  constructor(
    private events: IEvents,
    private productsModel: ProductsModel,
    private cartModel: CartModel,
    private buyerModel: BuyerModel,
    private catalogView: CatalogView,
    private modal: Modal,
    private header: Header,
    private api: WebLarekApi,
    private previewCard: PreviewCard,
    private basketView: BasketView,
    private orderForm: OrderForm,
    private contactsForm: ContactsForm,
    private successView: SuccessView
  ) {
    this.subscribeEvents();
  }

  private subscribeEvents() {
    // каталог
    this.events.on("products:changed", () => {
      this.renderCatalog();
    });

    // корзина
    this.events.on("cart:changed", () => {
      this.header.setCounter(this.cartModel.getCount());
    });

    // выбор товара
    this.events.on("product:selected", () => {
      const product = this.productsModel.getSelectedProduct();
      if (!product) return;

      this.openPreview(product);
    });

    // действие в превью
    this.events.on("preview:action", () => {
      const product = this.productsModel.getSelectedProduct();
      if (!product) return;

      this.cartModel.hasItem(product.id)
        ? this.cartModel.removeItem(product)
        : this.cartModel.addItem(product);

      this.modal.close();
    });

    // открыть корзину
    this.events.on("basket:open", () => {
      this.renderBasket();
      this.modal.open(this.basketView.getContainer());
    });

    // открыть форму заказа
    this.events.on("order:open", () => {
      const buyer = this.buyerModel.getData();

      this.orderForm.payment = buyer.payment;
      this.orderForm.address = buyer.address;

      this.modal.open(this.orderForm.render());
    });

    // изменения шага 1
    this.events.on("order:change", (data) => {
      this.buyerModel.setData(data);

      const buyer = this.buyerModel.getData();
      const errors = this.buyerModel.validateOrder();

      this.orderForm.payment = buyer.payment;
      this.orderForm.address = buyer.address;

      const isValid =
        !errors.payment &&
        !errors.address &&
        buyer.payment &&
        buyer.address?.trim();

      this.orderForm.errors = errors;
      this.orderForm.valid = Boolean(isValid);
    });

    // переход ко 2 шагу
    this.events.on("order:submit", () => {
      const buyer = this.buyerModel.getData();

      this.contactsForm.email = buyer.email;
      this.contactsForm.phone = buyer.phone;

      this.modal.open(this.contactsForm.render());
    });

    // изменения шага 2
    this.events.on("contacts:change", (data) => {
      this.buyerModel.setData(data);

      const buyer = this.buyerModel.getData();
      const errors = this.buyerModel.validateContacts();

      this.contactsForm.email = buyer.email;
      this.contactsForm.phone = buyer.phone;

      const isValid =
        !errors.email &&
        !errors.phone &&
        buyer.email?.trim() &&
        buyer.phone?.trim();

      this.contactsForm.errors = errors;
      this.contactsForm.valid = Boolean(isValid);
    });

    // отправка заказа
    this.events.on("contacts:submit", async () => {
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

        this.successView.total = result.total;
        this.modal.open(this.successView.render());
      } catch (e) {
        console.error(e);
      }
    });

    // закрытие success
    this.events.on("success:close", () => {
      this.modal.close();
    });
  }

  private openPreview(product: IProduct) {
    this.previewCard.data = product;

    this.previewCard.buttonState = {
      isInCart: this.cartModel.hasItem(product.id),
      isAvailable: product.price !== null,
    };

    this.modal.open(this.previewCard.render());
  }

  private renderCatalog() {
    const items = this.productsModel.getProducts().map((product) => {
      const container = cloneTemplate("#card-catalog");

      const card = new CatalogCard(container, {
        onClick: () => this.productsModel.setSelectedProduct(product),
      });

      card.data = product;

      return card.render();
    });

    this.catalogView.render(items);
  }

  private renderBasket() {
    const items = this.cartModel.getItems().map((product, index) => {
      const container = cloneTemplate("#card-basket");

      const card = new BasketCard(container, {
        onRemove: () => this.cartModel.removeItem(product),
      });

      card.data = product;
      card.index = index;

      return card.render();
    });

    this.basketView.items = items;
    this.basketView.total = this.cartModel.getTotal();
    this.basketView.valid = items.length > 0;
  }
}