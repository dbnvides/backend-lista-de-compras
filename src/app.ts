import express, { Application } from "express";
import {
  createList,
  updateItemList,
  listAllProd,
  deleteListProd,
  listOneProd,
  deleteItemList,
} from "./logic";
import {
  deleteValidatedData,
  prodItemExist,
  validatedBodyList,
  validatedDataList,
  validatedDataListBody,
} from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/purchaseList", validatedBodyList, validatedDataList, createList);
app.get("/purchaseList", listAllProd);
app.get("/purchaseList/:id", prodItemExist, listOneProd);
app.delete("/purchaseList/:id", prodItemExist, deleteListProd);
app.delete("/purchaseList/:id/:name", prodItemExist, deleteValidatedData, deleteItemList);
app.patch(
  "/purchaseList/:id/:name",
  prodItemExist,
  validatedDataListBody,
  updateItemList,
  deleteItemList
);

app.listen(3000, () => {
  console.log("Server is running!");
});
