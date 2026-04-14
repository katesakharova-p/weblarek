import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogCard extends Card {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.id });
    });
  }

  render(data: IProduct): HTMLElement {
    this.id = data.id;
    this.title.textContent = data.title;
    this.image.src = data.image;
    this.price.textContent = String(data.price);

    return this.container;
  }
}