import "./scss/styles.scss";

import { ProductsModel } from "./components/models/ProductsModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { WebLarekApi } from "./components/api/WebLarekApi";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

import { apiProducts } from "./utils/data";

// ==================== Тестирование ProductsModel ====================
console.log("========== Тестирование ProductsModel ==========");

const productsModel = new ProductsModel();

// Подписка на события
productsModel.on('products:changed', (data) => {
  console.log("Событие products:changed - каталог обновлен:", data);
});

productsModel.on('selected:changed', (data) => {
  console.log("Событие selected:changed - выбран товар:", data);
});

// Тестирование setProducts и getProducts
productsModel.setProducts(apiProducts.items);
console.log("Все товары:", productsModel.getProducts());

// Тестирование getProductById
const firstProduct = productsModel.getProducts()[0];
console.log("Товар по id:", productsModel.getProductById(firstProduct.id));

// Тестирование setSelectedProduct и getSelectedProduct
productsModel.setSelectedProduct(firstProduct);
console.log("Выбранный товар:", productsModel.getSelectedProduct());

// ==================== Тестирование CartModel ====================
console.log("\n========== Тестирование CartModel ==========");

const cart = new CartModel();

// Подписка на события
cart.on('cart:changed', (data) => {
  console.log("Событие cart:changed - корзина обновлена:", data);
});

// Тестирование addItem
cart.addItem(firstProduct);
console.log("Товары в корзине:", cart.getItems());
console.log("Есть ли товар:", cart.contains(firstProduct.id));
console.log("Количество:", cart.getItemCount());
console.log("Сумма:", cart.getTotal());

// Тестирование removeItem
cart.removeItem(firstProduct.id);
console.log("После удаления:", cart.getItems());

// Тестирование clear
cart.clear();
console.log("После очистки:", cart.getItems());

// ==================== Тестирование BuyerModel ====================
console.log("\n========== Тестирование BuyerModel ==========");

const buyer = new BuyerModel();

// Подписка на события
buyer.on('buyer:changed', (data) => {
  console.log("Событие buyer:changed - данные покупателя изменены:", data);
});

buyer.on('validation:step1', (errors) => {
  console.log("Событие validation:step1 - ошибки шага 1:", errors);
});

buyer.on('validation:step2', (errors) => {
  console.log("Событие validation:step2 - ошибки шага 2:", errors);
});

// Тестирование установки данных
buyer.setPayment("card");
buyer.setAddress("г. Москва, ул. Тверская, д. 1");

console.log("Шаг 1 ошибки:", buyer.validateStep1());
console.log("Шаг 1 валиден:", buyer.isStep1Valid());

// Тестирование email и phone
buyer.setEmail("test@mail.com");
buyer.setPhone("+79991234567");

console.log("Шаг 2 ошибки:", buyer.validateStep2());
console.log("Шаг 2 валиден:", buyer.isStep2Valid());

// Тестирование некорректных данных
buyer.setEmail("invalid-email");
buyer.setPhone("123");

console.log("Шаг 2 ошибки (некорректные данные):", buyer.validateStep2());

// Тестирование getData
console.log("Данные покупателя:", buyer.getData());

// Тестирование clear
buyer.clear();
console.log("После очистки:", buyer.getData());

// ==================== Работа с сервером ====================
console.log("\n========== Запрос к серверу ==========");

const api = new WebLarekApi(new Api(API_URL));

// Запрос товаров с сервера
api.getProducts()
  .then((products) => {
    console.log("Товары получены с сервера:", products);
    productsModel.setProducts(products);
    console.log("Каталог сохранен в модели:", productsModel.getProducts());
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });