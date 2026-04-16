import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CartModel {
  private _items: IProduct[] = [];

  constructor(private events: IEvents) {}

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(product: IProduct): void {
    if (this.contains(product.id)) return;

    this._items.push(product);
    this.events.emit('cart:changed');
  }

  removeItem(product: IProduct): void {
    this._items = this._items.filter((p) => p.id !== product.id);
    this.events.emit('cart:changed');
  }

  clear(): void {
    this._items = [];
    this.events.emit('cart:changed');
  }

  getTotal(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  contains(id: string): boolean {
    return this._items.some((p) => p.id === id);
  }
}