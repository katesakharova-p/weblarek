import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';

// Каталог
const productsModel = new ProductsModel();
productsModel.setProducts(apiProducts.items);

console.log('📦 Товары:', productsModel.getProducts());

// Корзина
const cart = new CartModel();
cart.addItem(productsModel.getProducts()[0]);

console.log('🛒 Корзина:', cart.getItems());
console.log('💰 Сумма:', cart.getTotal());

// Покупатель
const buyer = new BuyerModel();
buyer.setEmail('test@test.ru');

console.log('👤 Ошибки валидации:', buyer.validate());