import { IBuyer, TPayment } from '../../types';

export class BuyerModel {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _phone: string = '';
  private _email: string = '';

  setPayment(payment: TPayment): void {
    this._payment = payment;
  }

  setAddress(address: string): void {
    this._address = address;
  }

  setPhone(phone: string): void {
    this._phone = phone;
  }

  setEmail(email: string): void {
    this._email = email;
  }

  getData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  clear(): void {
    this._payment = null;
    this._address = '';
    this._phone = '';
    this._email = '';
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this._address) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this._phone) {
      errors.phone = 'Укажите телефон';
    }

    if (!this._email) {
      errors.email = 'Укажите email';
    }

    return errors;
  }
}