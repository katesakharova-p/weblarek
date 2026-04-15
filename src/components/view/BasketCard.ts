import { Card } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketCard extends Card {
  private deleteButton?: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.deleteButton = this.container.querySelector('.card__button') as HTMLButtonElement;

    if (this.deleteButton) {
      this.deleteButton.addEventListener('click', (evt) => {
        evt.stopPropagation();
        this.events.emit('basket:remove', { id: this.id });
      });
    }
  }

  render(data: IProduct): HTMLElement {
    super.render(data);
    return this.container;
  }
}