import { IEvents } from "../base/Events";

export class Modal {
  protected container: HTMLElement;
  protected content: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    this.container = container;

    this.content = container.querySelector(".modal__content")!;
    this.closeButton = container.querySelector(".modal__close")!;

    this.content.addEventListener("click", (evt) => {
      evt.stopPropagation();
    });

    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (evt) => {
      if (evt.target === this.container) {
        this.close();
      }
    });
  }

  open(content: HTMLElement): void {
    this.setContent(content);
    this.container.classList.add("modal_active");

    this.events.emit("modal:open");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.clearContent();

    this.events.emit("modal:close");
  }

  setContent(content: HTMLElement): void {
    this.content.replaceChildren(content);
  }

  clearContent(): void {
    this.content.innerHTML = "";
  }
}
