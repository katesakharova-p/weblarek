import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel {
  private _payment: TPayment | null = null;
  private _email = "";
  private _phone = "";
  private _address = "";

  constructor(private events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;

    this.events.emit("buyer:changed", this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear(): void {
    this._payment = null;
    this._email = "";
    this._phone = "";
    this._address = "";

    this.events.emit("buyer:changed", this.getData());
  }

  // ШАГ 1
  validateOrder(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this._payment) {
      errors.payment = "Выберите способ оплаты";
    }

    if (!this._address.trim()) {
      errors.address = "Необходимо указать адрес доставки";
    }

    return errors;
  }

  // ШАГ 2
  validateContacts(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this._email.trim()) {
      errors.email = "Введите email";
    }

    if (!this._phone.trim()) {
      errors.phone = "Введите телефон";
    }

    return errors;
  }
}
