import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class CartModel {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  addItem(product: IProduct) {
    if (this.items.some((p) => p.id === product.id)) return;

    this.items.push(product);
    this.events.emit("cart:changed");
  }

  removeItem(product: IProduct) {
    this.items = this.items.filter((p) => p.id !== product.id);
    this.events.emit("cart:changed");
  }

  clear() {
    this.items = [];
    this.events.emit("cart:changed");
  }

  hasItem(productId: string): boolean {
    return this.items.some((p) => p.id === productId);
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount() {
    return this.items.length;
  }
}
