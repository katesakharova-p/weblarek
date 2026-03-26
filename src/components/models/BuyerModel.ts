import { IBuyer, TPayment } from '../../types';

export class BuyerModel {
  private _payment: TPayment | '' = '';
  private _email: string = '';
  private _phone: string = '';
  private _address: string = '';

  setPayment(payment: TPayment): void {
    this._payment = payment;
  }

  setEmail(email: string): void {
    this._email = email;
  }

  setPhone(phone: string): void {
    this._phone = phone;
  }

  setAddress(address: string): void {
    this._address = address;
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
    this._payment = '';
    this._email = '';
    this._phone = '';
    this._address = '';
  }

  validateStep1(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this._address) {
      errors.address = 'Введите адрес доставки';
    }

    return errors;
  }

  validateStep2(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._email) {
      errors.email = 'Введите email';
    }

    if (!this._phone) {
      errors.phone = 'Введите телефон';
    }

    return errors;
  }
}