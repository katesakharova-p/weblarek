import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketCard extends Card {
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.deleteButton = this.container.querySelector('.card__button') as HTMLButtonElement;

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this.id });
    });
  }

  render(data: IProduct): HTMLElement {
    this.id = data.id;
    this.title.textContent = data.title;
    this.price.textContent = String(data.price);

    return this.container;
  }
}