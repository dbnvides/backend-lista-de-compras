import * as express from "express";
import { IDataItems } from "../../interfaces";

declare global {
  namespace Express {
    interface Request {
      itemDataBody: {
        data: IDataItems[] | undefined;
        indexNumber?: number | undefined;
      };
      indexProdItem: number;
    }
  }
}
