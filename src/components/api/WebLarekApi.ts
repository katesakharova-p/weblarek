import {
  IApi,
  IProduct,
  IOrder,
  IOrderResult,
  IProductsResponse,
} from "../../types";
import { API_URL } from "../../utils/constants";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api
      .get<IProductsResponse>(`${API_URL}/product`)
      .then((data) => {
        return data.items;
      });
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post(`${API_URL}/order`, order);
  }
}
