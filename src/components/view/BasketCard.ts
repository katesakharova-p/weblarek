import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketCard {
private container: HTMLElement;
private title: HTMLElement;
private price: HTMLElement;
private deleteButton: HTMLButtonElement;
private indexElement: HTMLElement;

private id!: string;

constructor(container: HTMLElement, private events: IEvents) {
this.container = container;


this.title = container.querySelector('.card__title')!;
this.price = container.querySelector('.card__price')!;
this.deleteButton = container.querySelector('.card__button')!;
this.indexElement = container.querySelector('.basket__item-index')!;

this.deleteButton.addEventListener('click', (evt) => {
  evt.stopPropagation();
  this.events.emit('basket:remove', { id: this.id });
});


}

render(data: IProduct, index: number): HTMLElement {
this.id = data.id;


this.indexElement.textContent = String(index + 1);
this.title.textContent = data.title;
this.price.textContent = `${data.price ?? 0} синапсов`;

return this.container;


}
}
