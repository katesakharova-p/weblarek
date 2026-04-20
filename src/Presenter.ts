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
    private successView: SuccessView,
  ) {
    this.subscribeEvents();
  }

  private subscribeEvents() {
    // продукты
    this.events.on("products:changed", () => {
      this.renderCatalog();
    });

    // корзина
    this.events.on("cart:changed", () => {
      this.header.counter = this.cartModel.getCount();
      this.renderBasket();
    });

    // выбор товара
    this.events.on<IProduct>("card:select", (product) => {
      this.productsModel.setSelectedProduct(product);
    });

    this.events.on("product:selected", () => {
      const product = this.productsModel.getSelectedProduct();
      if (!product) return;

      this.openPreview(product);
    });

    // действие в превью
    this.events.on("preview:action", () => {
      const product = this.productsModel.getSelectedProduct();
      if (!product) return;

      if (this.cartModel.hasItem(product.id)) {
        this.cartModel.removeItem(product);
      } else {
        this.cartModel.addItem(product);
      }

      this.modal.close();
    });

    // удаление из корзины
    this.events.on<IProduct>("cart:remove", (product) => {
      this.cartModel.removeItem(product);
    });

    // открыть корзину
    this.events.on("basket:open", () => {
      this.renderBasket();

      this.modal.render({
        content: this.basketView.render(),
      });
    });

    // открыть заказ
    this.events.on("order:open", () => {
      const buyer = this.buyerModel.getData();

      this.orderForm.payment = buyer.payment;
      this.orderForm.address = buyer.address;

      this.modal.render({
        content: this.orderForm.render(),
      });
    });

    // изменение данных (ТОЛЬКО модель!)
    this.events.on("order:change", (data) => {
      this.buyerModel.setData(data);
    });

    this.events.on("contacts:change", (data) => {
      this.buyerModel.setData(data);
    });

    // обработчик состояния
    this.events.on("buyer:changed", () => {
      const buyer = this.buyerModel.getData();
      const errors = this.buyerModel.validate();

      // заказ
      this.orderForm.payment = buyer.payment;
      this.orderForm.address = buyer.address;

      const orderErrors = {
        payment: errors.payment,
        address: errors.address,
      };

      this.orderForm.errors = Object.values(orderErrors)
        .filter(Boolean)
        .join("<br>");

      this.orderForm.valid = !orderErrors.payment && !orderErrors.address;

      // контакты
      this.contactsForm.email = buyer.email;
      this.contactsForm.phone = buyer.phone;

      const contactErrors = {
        email: errors.email,
        phone: errors.phone,
      };

      this.contactsForm.errors = Object.values(contactErrors)
        .filter(Boolean)
        .join("<br>");

      this.contactsForm.valid =
        !contactErrors.email && !contactErrors.phone;
    });

    // переход ко 2 шагу
    this.events.on("order:submit", () => {
      const buyer = this.buyerModel.getData();

      this.contactsForm.email = buyer.email;
      this.contactsForm.phone = buyer.phone;

      this.modal.render({
        content: this.contactsForm.render(),
      });
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

        this.modal.render({
          content: this.successView.render({
            total: result.total,
          }),
        });
      } catch (e) {
        console.error(e);
      }
    });

    this.events.on("success:close", () => {
      this.modal.close();
    });
  }

  private openPreview(product: IProduct) {
    this.modal.render({
      content: this.previewCard.render({
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
      }),
    });

    this.previewCard.buttonState = {
      isInCart: this.cartModel.hasItem(product.id),
      isAvailable: product.price !== null,
    };
  }

  private renderCatalog() {
    const items = this.productsModel.getProducts().map((product) => {
      const container = cloneTemplate("#card-catalog");

      const card = new CatalogCard(container, {
        onClick: () => this.events.emit("card:select", product),
      });

      return card.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
      });
    });

    this.catalogView.render({ items });
  }

  private renderBasket() {
    const items = this.cartModel.getItems().map((product, index) => {
      const container = cloneTemplate("#card-basket");

      const card = new BasketCard(container, {
        onRemove: () => this.events.emit("cart:remove", product),
      });

      return card.render({
        title: product.title,
        price: product.price,
        index: index,
      });
    });

    this.basketView.render({
      items,
      total: this.cartModel.getTotal(),
      valid: items.length > 0,
    });
  }
}