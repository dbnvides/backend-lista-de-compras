import { Request, Response } from "express";
import { dataBase, idSort } from "./database";
import { IProductIdRequest, IProductRequest } from "./interfaces";

let counter: number = 1;

const idSortNumbersValidate = () => {
  while (idSort.includes(counter)) {
    counter++;
  }
  idSort.push(counter);
  return counter;
};

export const createList = (request: Request, response: Response) => {
  try {
    const listData: IProductRequest = request.body;
    const newListData: IProductIdRequest = {
      listName: listData.listName,
      data: listData.data,
      id: idSortNumbersValidate(),
    };
    dataBase.push(newListData);
    return response.status(201).json(newListData);
  } catch (error) {
    return response.status(500).json({ message: "Internal server error!" });
  }
};

export const listAllProd = (request: Request, response: Response) => {
  return response.status(200).json(dataBase);
};

export const listOneProd = (request: Request, response: Response) => {
  const dataId = request.params.id;
  const filterList = dataBase.filter((item) => item.id === Number(dataId));
  return response.status(200).json(...filterList);
};

export const updateItemList = (request: Request, response: Response) => {
  const editData = Object.assign(dataBase[request.indexProdItem].data, request.itemDataBody.data);

  return response.status(200).json(editData);
};

export const deleteListProd = (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id);
  const validated: IProductIdRequest[] = dataBase;
  const filterIndex = validated.findIndex((itemID) => itemID.id === id);

  if (filterIndex !== -1) {
    dataBase.splice(filterIndex, 1);
    return response.status(204).json();
  }

  return response.status(404).json({ message: "List not found!" });
};

export const deleteItemList = (request: Request, response: Response) => {
  dataBase[request.indexProdItem].data.splice(request.itemDataBody.indexNumber!, 1);
  return response.status(204).json();
};
