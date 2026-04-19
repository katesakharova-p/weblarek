import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<HTMLElement> {
  protected content: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

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

  render(content: HTMLElement): HTMLElement {
    this.content.replaceChildren(content);
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
    return this.container;
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.content.innerHTML = "";
    this.events.emit("modal:close");
  }
}