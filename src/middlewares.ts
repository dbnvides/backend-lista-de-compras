import { Request, Response, NextFunction } from "express";
import { dataBase } from "./database";
import { IDataItems, IListRequiredtKeys, IProductRequest } from "./interfaces";

export const validatedBodyList = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(request.body);
  const valuesItem: Array<IProductRequest> = Object.values(request.body);

  const requiredListKeys: Array<IListRequiredtKeys> = ["listName", "data"];

  const validatedKeys: boolean = requiredListKeys.every((key: string) => keys.includes(key));
  if (!validatedKeys || keys.length !== 2) {
    return response.status(400).json({ message: `Invalid input - expected ${requiredListKeys}` });
  }

  if (typeof valuesItem[0] !== "string" || Array.isArray(valuesItem[1]) !== true) {
    return response.status(400).json({ message: "Invalid input value type" });
  }
  next();
};

export const validatedDataList = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const requiredProdKeys: Array<string> = ["name", "quantity"];
  const dataProd: IDataItems[] = request.body.data;

  const validated: boolean = dataProd.every((obj: IDataItems) => {
    const keysData = Object.keys(obj);
    if (keysData[0] === "name" && keysData[1] === "quantity" && keysData.length === 2) {
      return true;
    } else {
      return false;
    }
  });
  if (!validated) {
    return response.status(400).json({ message: `Invalid input - expected ${requiredProdKeys}` });
  }

  const dataValues = dataProd.map((element: IDataItems) => {
    return Object.values(element);
  });

  const validatedData: boolean = dataValues.every((element: string[]) => {
    if (typeof element[0] !== "string" || typeof element[1] !== "string") {
      return false;
    } else {
      return true;
    }
  });

  if (!validatedData) {
    return response.status(400).json({ message: "Invalid input value type" });
  }

  next();
};

export const validatedDataListBody = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const requiredProdKeys: Array<string> = ["name", "quantity"];
  const nameItem: string = request.params.name;
  const idList: number = parseInt(request.params.id);
  const bodyRequest: IDataItems = request.body;
  const keyBody = Object.keys(bodyRequest);
  const filterList = dataBase.find((list) => list.id === idList);
  const findItem = filterList?.data.findIndex((data) => data.name === nameItem);

  const valitedBodyRequest: boolean = requiredProdKeys.every((key: string) =>
    keyBody.includes(key)
  );

  const validatedProp = (): boolean | void => {
    if (typeof bodyRequest.name === "string" || typeof bodyRequest.quantity === "string") {
      return true;
    }
    return false;
  };

  if (findItem === -1) {
    return response.status(404).json({ message: `Item with name "${nameItem}" does not exist` });
  }

  if (!validatedProp()) {
    return response
      .status(400)
      .json({ message: `Invalid type input - expected ${requiredProdKeys}` });
  }

  if (!valitedBodyRequest) {
    return response.status(400).json({ message: `Invalid input - expected ${requiredProdKeys}` });
  }

  const updateItem = filterList?.data.map((item) => {
    if (item.name === nameItem) {
      return { ...dataBase[request.indexProdItem].data[findItem!], ...bodyRequest };
    }
    return item;
  });

  request.itemDataBody = {
    data: updateItem,
  };

  next();
};

export const deleteValidatedData = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const nameItem: string = request.params.name;
  const idList: number = parseInt(request.params.id);

  const filterList = dataBase.find((list) => list.id === idList);
  const findItem = filterList?.data.findIndex((data) => data.name === nameItem);
  const newArr = filterList?.data.filter((data) => data.name !== nameItem);

  if (findItem === -1) {
    return response.status(404).json({ message: `Item with name "${nameItem}" does not exist` });
  }

  request.itemDataBody = {
    data: newArr,
    indexNumber: findItem,
  };

  next();
};

export const prodItemExist = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const id: number = parseInt(request.params.id);

  const indexProdItem = dataBase.findIndex((el) => el.id === id);
  if (indexProdItem === -1) {
    return response.status(404).json({
      message: "List not found!",
    });
  }

  request.indexProdItem = indexProdItem;

  return next();
};
