import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class CartModel extends EventEmitter {
  private _items: IProduct[] = [];

  getItems(): IProduct[] {
    return [...this._items];
  }

  addItem(product: IProduct): void {
    if (!this.contains(product.id)) {
      this._items.push(product);
      this.emit('cart:changed', this._items);
    }
  }

  removeItem(productId: string): void {
    this._items = this._items.filter((item) => item.id !== productId);
    this.emit('cart:changed', this._items);
  }

  clear(): void {
    this._items = [];
    this.emit('cart:changed', this._items);
  }

  getTotal(): number {
    return this._items.reduce((sum, item) => {
      return sum + (item.price ?? 0);
    }, 0);
  }

  getItemCount(): number {
    return this._items.length;
  }

  contains(productId: string): boolean {
    return this._items.some((item) => item.id === productId);
  }
}