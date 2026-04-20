import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.contentElement = container.querySelector(".modal__content")!;
    this.closeButton = container.querySelector(".modal__close")!;

    this.contentElement.addEventListener("click", (evt) => {
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

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentElement.innerHTML = "";
    this.events.emit("modal:close");
  }
}
