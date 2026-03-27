import {
  IApi,
  IProduct,
  IOrder,
  IOrderResult,
  IProductsResponse,
} from "../../types";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api
      .get<IProductsResponse>(`/product`)
      .then((data) => {
        return data.items;
      });
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>(`/order`, order);
  }
}