import { Router } from "express"
import { registrar, login } from "../controllers/authControllers.js"

const router = Router()

router.post("/registrar", registrar)
router.post("/login", login)
export default router