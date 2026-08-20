import { Router } from "express"
import {
    cadastrarPartidas,
    listarPartidas,
    buscarPartidaPorId,
    atualizarPartida,
} from "../controllers/partidasControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { permitirProfessor } from "../middlewares/permitirProfessor.js"

const router = Router()

router.get("/", listarPartidas)
router.get("/:id", buscarPartidaPorId)

router.post("/", authMiddleware, permitirProfessor, cadastrarPartidas)
router.put("/:id", authMiddleware, permitirProfessor, atualizarPartida)

export default router