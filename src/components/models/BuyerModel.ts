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
      payment: this._payment as TPayment,
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

    this.events.emit("buyer:changed");
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this._payment) errors.payment = "Выберите способ оплаты";
    if (!this._address.trim()) errors.address = "Введите адрес";

    if (!this._email.match(/^\S+@\S+\.\S+$/)) {
      errors.email = "Некорректный email";
    }

    if (!this._phone.match(/^\+?\d{10,}$/)) {
      errors.phone = "Некорректный телефон";
    }

    return errors;
  }
}
