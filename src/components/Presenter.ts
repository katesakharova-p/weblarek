import { IEvents } from './base/Events';
import { ProductsModel } from './models/ProductsModel';
import { CartModel } from './models/CartModel';

import { CatalogView } from './view/CatalogView';
import { BasketView } from './view/BasketView';
import { Modal } from './view/Modal';

import { CatalogCard } from './view/CatalogCard';
import { PreviewCard } from './view/PreviewCard';
import { BasketCard } from './view/BasketCard';

export class Presenter {
  constructor(
    private events: IEvents,
    private productsModel: ProductsModel,
    private cartModel: CartModel,
    private catalogView: CatalogView,
    private basketView: BasketView,
    private modal: Modal
  ) {
    this.subscribeEvents();
    this.renderCatalog();
  }

  private subscribeEvents() {
    // открыть карточку
    this.events.on('card:select', (data: { id: string }) => {
      const product = this.productsModel
        .getProducts()
        .find((p) => p.id === data.id);

      if (!product) return;

      const template = document.querySelector(
        '#card-preview-template'
      ) as HTMLTemplateElement;

      const container = template.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;

      const card = new PreviewCard(container, this.events);

      this.modal.open(card.render(product));
    });

    // добавить в корзину
    this.events.on('card:action', (data: { id: string }) => {
      const product = this.productsModel
        .getProducts()
        .find((p) => p.id === data.id);

      if (!product) return;

      this.cartModel.addItem(product);
      this.renderBasket();
    });

    // удалить из корзины
    this.events.on('basket:remove', (data: { id: string }) => {
      const product = this.cartModel
        .getItems()
        .find((p) => p.id === data.id);

      if (!product) return;

      this.cartModel.removeItem(product);
      this.renderBasket();
    });
  }

  private renderCatalog() {
    const template = document.querySelector(
      '#card-catalog-template'
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
      '#card-basket-template'
    ) as HTMLTemplateElement;

    const items = this.cartModel.getItems().map((product) => {
      const container = template.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;

      const card = new BasketCard(container, this.events);
      return card.render(product);
    });

    this.basketView.render(items, this.cartModel.getTotal());
  }
}