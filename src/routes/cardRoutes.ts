import { NextFunction, Request, Response, Router } from "express";
import { isAuth } from "../middlewares/isAuth";
import { applyForCard } from "../controllers/cardControllers";

const router = Router();
router.post(
  "/apply",
  (req: Request, res: Response, next: NextFunction) => {
    isAuth(req, res, next);
  },
  (req: Request, res: Response) => {
    applyForCard(req, res);
  }
);
export default router