import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";

import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { WebLarekApi } from "./components/api/WebLarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

import { Header } from "./components/view/Header";
import { CatalogView } from "./components/view/CatalogView";
import { Modal } from "./components/view/Modal";
import { BasketView } from "./components/view/BasketView";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { PreviewCard } from "./components/view/PreviewCard";
import { SuccessView } from "./components/view/SuccessView";

import { cloneTemplate } from "./utils/utils";

import { Presenter } from "./Presenter";

const events = new EventEmitter();

const api = new WebLarekApi(new Api(API_URL));

const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const catalogContainer = document.querySelector(".gallery") as HTMLElement;
const modalElement = document.getElementById("modal-container") as HTMLElement;

const header = new Header(document.body, events);
const catalogView = new CatalogView(catalogContainer);
const modal = new Modal(modalElement, events);

const previewCard = new PreviewCard(cloneTemplate("#card-preview"), {
  onClick: () => events.emit("preview:action"),
});

const basketView = new BasketView(cloneTemplate("#basket"), events);

const orderForm = new OrderForm(
  cloneTemplate("#order") as HTMLFormElement,
  events,
);

const contactsForm = new ContactsForm(
  cloneTemplate("#contacts") as HTMLFormElement,
  events,
);

const successView = new SuccessView(cloneTemplate("#success"), events);

new Presenter(
  events,
  productsModel,
  cartModel,
  buyerModel,
  catalogView,
  modal,
  header,
  api,
  previewCard,
  basketView,
  orderForm,
  contactsForm,
  successView,
);

api.getProducts()
  .then((data) => {
    productsModel.setProducts(data.items);
  })
  .catch(console.error);
