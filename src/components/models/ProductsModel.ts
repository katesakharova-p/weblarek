import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductsModel {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  constructor(private events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this._products = products;
    this.events.emit("products:changed");
  }

  getProducts(): IProduct[] {
    return this._products;
  }

  getProductById(id: string): IProduct | undefined {
    return this._products.find((p) => p.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
    this.events.emit("product:selected", product);
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}
