import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class BaseForm<T> extends Component<T> {
  protected events: IEvents;
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);

    this.events = events;

    this.submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    this.errorElement = container.querySelector(".form__errors") as HTMLElement;

    container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  set errors(value: Record<string, string>) {
    const messages = Object.values(value).filter(Boolean);
    this.errorElement.innerHTML = messages.join("<br>");
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  protected abstract handleSubmit(): void;
}
