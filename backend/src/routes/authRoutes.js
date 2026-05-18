import { Router } from "express"

import {
  register,
  login
} from "../controllers/authController.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"

const router = Router()

router.post("/register",adminMiddleware, register)
router.post("/login", login)

export default router