import { Router, Request, Response, NextFunction } from 'express'
import {
  checkAuth,
  login,
  logout,
  signUp
} from '../controllers/authControllers'
import { isAuth } from '../middlewares/isAuth'

const router = Router()

// Explicitly typed route handler
router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
  signUp(req, res)
})
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  login(req, res)
})
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  logout(req, res)
})
router.get(
  '/checkauth',
  (req: Request, res: Response, next: NextFunction) => {
    isAuth(req, res, next)
  },
  (req: Request, res: Response) => {
    checkAuth(req, res)
  }
)

export default router
