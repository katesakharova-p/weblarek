import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";

import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { WebLarekApi } from "./components/api/WebLarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

import { CatalogView } from "./components/view/CatalogView";
import { Modal } from "./components/view/Modal";

import { Presenter } from "./components/Presenter";

// события
const events = new EventEmitter();

// API
const api = new WebLarekApi(new Api(API_URL));

// модели
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events); // ✅ ДОБАВИЛИ

// view
const catalogContainer = document.querySelector(".gallery") as HTMLElement;
const modalElement = document.getElementById("modal-container") as HTMLElement;

const catalogView = new CatalogView(catalogContainer);
const modal = new Modal(modalElement, events);

// презентер
new Presenter(
  events,
  productsModel,
  cartModel,
  buyerModel,
  catalogView,
  modal,
  api,
);

// загрузка данных
api
  .getProducts()
  .then((products) => {
    productsModel.setProducts(products);
  })
  .catch(console.error);

// корзина
const basketButton = document.querySelector(".header__basket") as HTMLElement;

basketButton.addEventListener("click", () => {
  events.emit("basket:open");
});
