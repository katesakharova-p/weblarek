import { IBuyer, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export class BuyerModel extends EventEmitter {
  private _payment: TPayment | null = null;
  private _email: string = "";
  private _phone: string = "";
  private _address: string = "";

  setPayment(payment: TPayment): void {
    this._payment = payment;
    this.emit('buyer:changed', this.getData());
    this.emit('validation:step1', this.validateStep1());
  }

  setEmail(email: string): void {
    this._email = email;
    this.emit('buyer:changed', this.getData());
    this.emit('validation:step2', this.validateStep2());
  }

  setPhone(phone: string): void {
    this._phone = phone;
    this.emit('buyer:changed', this.getData());
    this.emit('validation:step2', this.validateStep2());
  }

  setAddress(address: string): void {
    this._address = address;
    this.emit('buyer:changed', this.getData());
    this.emit('validation:step1', this.validateStep1());
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
    this.emit('buyer:changed', this.getData());
    this.emit('validation:step1', this.validateStep1());
    this.emit('validation:step2', this.validateStep2());
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+\d][\d\(\)\-\s]{8,20}$/;
    return phoneRegex.test(phone);
  }

  validateStep1(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this._address || this._address.trim() === "") {
      errors.address = "Введите адрес доставки";
    }

    return errors;
  }

  validateStep2(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this._email || this._email.trim() === "") {
      errors.email = "Введите email";
    } else if (!this.validateEmail(this._email)) {
      errors.email = "Введите корректный email (example@domain.com)";
    }

    if (!this._phone || this._phone.trim() === "") {
      errors.phone = "Введите телефон";
    } else if (!this.validatePhone(this._phone)) {
      errors.phone = "Введите корректный номер телефона";
    }

    return errors;
  }

  isStep1Valid(): boolean {
    return Object.keys(this.validateStep1()).length === 0;
  }

  isStep2Valid(): boolean {
    return Object.keys(this.validateStep2()).length === 0;
  }
}