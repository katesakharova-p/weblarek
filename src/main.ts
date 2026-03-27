import "./scss/styles.scss";

import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { WebLarekApi } from "./components/api/WebLarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

import { apiProducts } from "./utils/data";

const productsModel = new ProductsModel();

productsModel.setProducts(apiProducts.items);

console.log("Все товары:", productsModel.getProducts());

const firstProduct = productsModel.getProducts()[0];

console.log("Товар по id:", productsModel.getProductById(firstProduct.id));

productsModel.setSelectedProduct(firstProduct);

console.log("Выбранный товар:", productsModel.getSelectedProduct());

const cart = new CartModel();

cart.addItem(firstProduct);

console.log("Товары в корзине:", cart.getItems());
console.log("Есть ли товар:", cart.contains(firstProduct.id));
console.log("Количество:", cart.getItemCount());
console.log("Сумма:", cart.getTotal());

cart.removeItem(firstProduct.id);

console.log("После удаления:", cart.getItems());

cart.clear();

console.log("После очистки:", cart.getItems());

const buyer = new BuyerModel();

buyer.setPayment("card");
buyer.setAddress("Tashkent");

console.log("Шаг 1 ошибки:", buyer.validateStep1());

buyer.setEmail("test@mail.com");
buyer.setPhone("+998901234567");

console.log("Шаг 2 ошибки:", buyer.validateStep2());

console.log("Данные покупателя:", buyer.getData());

buyer.clear();

console.log("После очистки:", buyer.getData());

const api = new WebLarekApi(new Api(API_URL));

api.getProducts().then((products) => {
  productsModel.setProducts(products);
  console.log("Товары с сервера:", productsModel.getProducts());
});
