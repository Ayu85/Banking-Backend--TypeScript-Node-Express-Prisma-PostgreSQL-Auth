import { Router, Request, Response, NextFunction } from "express";
import { login, logout, signUp } from "../controllers/authControllers";

const router = Router();

// Explicitly typed route handler
router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  signUp(req, res);
});
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  login(req, res);
});
router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  logout(req, res);
});

export default router;
