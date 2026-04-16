import { IEvents } from "../base/Events";

export abstract class BaseForm {
  protected form: HTMLFormElement;
  protected events: IEvents;

  constructor(form: HTMLFormElement, events: IEvents) {
    this.form = form;
    this.events = events;

    this.form.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.form.addEventListener("input", () => {
      this.events.emit("form:change");
    });
  }

  protected abstract handleSubmit(): void;

  render(): HTMLElement {
    return this.form;
  }
}
