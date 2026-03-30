import "./scss/styles.scss";

import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { WebLarekApi } from "./components/api/WebLarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

import { apiProducts } from "./utils/data";

// ==================== ProductsModel ====================
console.log("========== ProductsModel ==========");

const productsModel = new ProductsModel();

productsModel.setProducts(apiProducts.items);

console.log("Все товары:", productsModel.getProducts());

const firstProduct = productsModel.getProducts()[0];

console.log(
  "Товар по id:",
  productsModel.getProductById(firstProduct.id)
);

productsModel.setSelectedProduct(firstProduct);

console.log(
  "Выбранный товар:",
  productsModel.getSelectedProduct()
);

// ==================== CartModel ====================
console.log("\n========== CartModel ==========");

const cart = new CartModel();

cart.addItem(firstProduct);

console.log("Товары в корзине:", cart.getItems());
console.log("Есть ли товар:", cart.contains(firstProduct.id));
console.log("Количество:", cart.getCount());
console.log("Сумма:", cart.getTotal());

cart.removeItem(firstProduct);

console.log("После удаления:", cart.getItems());

cart.clear();

console.log("После очистки:", cart.getItems());

// ==================== BuyerModel ====================

console.log("\n========== BuyerModel ==========");

const buyer = new BuyerModel();

// Пустые данные
console.log("Ошибки (пустые данные):", buyer.validate());

// Частично заполненные данные
buyer.setData({
  payment: "card",
  address: "г. Ташкент, ул. Байсун, д. 2",
});

console.log("Ошибки (частично заполнено):", buyer.validate());

// Полностью заполненные данные
buyer.setData({
  email: "test@mail.com",
  phone: "+998712222222",
});

console.log("Ошибки (все данные заполнены):", buyer.validate());

// Получение данных
console.log("Данные покупателя:", buyer.getData());

// Очистка
buyer.clear();

console.log("После очистки:", buyer.getData());

// ==================== API ====================
console.log("\n========== API ==========");

const api = new WebLarekApi(new Api(API_URL));

api.getProducts()
  .then((products) => {
    console.log("Товары с сервера:", products);

    productsModel.setProducts(products);

    console.log(
      "Каталог сохранен:",
      productsModel.getProducts()
    );
  })
  .catch((error) => {
    console.error("Ошибка:", error);
  });