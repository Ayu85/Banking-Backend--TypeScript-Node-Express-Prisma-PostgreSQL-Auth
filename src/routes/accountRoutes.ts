import { Router, Request, Response, NextFunction } from "express";
import { createAccount, getAllAccounts } from "../controllers/accountControllers";
import { isAuth } from "../middlewares/isAuth";

const accountRoutes = Router();

// Explicitly typed route handler
accountRoutes.post(
  "/create",
  (req: Request, res: Response, next: NextFunction) => {
    isAuth(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    createAccount(req, res);
  }
);

accountRoutes.get(
  "/getaccounts",
  (req: Request, res: Response, next: NextFunction) => {
    isAuth(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    getAllAccounts(req, res);
  }
);


export default accountRoutes;
