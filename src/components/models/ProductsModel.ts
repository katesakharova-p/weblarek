import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class ProductsModel extends EventEmitter {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this._products = products;
    this.emit('products:changed', this._products);
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProductById(id: string): IProduct | undefined {
    return this._products.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
    this.emit('selected:changed', this._selectedProduct);
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}