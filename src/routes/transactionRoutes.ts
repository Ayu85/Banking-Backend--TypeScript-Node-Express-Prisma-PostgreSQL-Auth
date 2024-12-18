import { NextFunction, Request, Response, Router } from "express";
import { isAuth } from "../middlewares/isAuth";
import { sendMoney } from "../controllers/transactionController";

const router = Router();
router.post(
  "/send",
  (req: Request, res: Response, next: NextFunction) => {
    isAuth(req, res, next);
  },
  (req: Request, res: Response, next: NextFunction) => {
    sendMoney(req, res);
  }
);
export default router 