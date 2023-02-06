export interface IProductRequest {
  listName: string;
  data: IDataItems[];
}

export interface IProductIdRequest extends IProductRequest {
  id: number;
}

export interface IDataItems {
  name: string;
  quantity: string;
}

export type IListRequiredtKeys = "listName" | "data";

export type IProdRequiredKeys = "name" | "quantity";
