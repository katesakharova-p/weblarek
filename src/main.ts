import './scss/styles.scss';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';


const api = new Api(import.meta.env.VITE_API_ORIGIN);
const webLarekApi = new WebLarekApi(api);
const productsModel = new ProductsModel();
const cart = new CartModel();
const buyer = new BuyerModel();

webLarekApi.getProducts().then((products) => {
  productsModel.setProducts(products);

  console.log('📦 Товары с сервера:', productsModel.getProducts());

  const firstProduct = productsModel.getProducts()[0];
  if (firstProduct) {
    cart.addItem(firstProduct);
  }

  console.log('🛒 Корзина:', cart.getItems());
  console.log('💰 Сумма:', cart.getTotal());

  buyer.setEmail('test@test.ru');
  console.log('👤 Ошибки валидации:', buyer.validate());
});