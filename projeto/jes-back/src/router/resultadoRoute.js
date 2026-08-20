import { Router } from "express"
import {
    ListaResultados,
    CriarResultado,
    AtualizarResultado,
    AtualizarParcialResultado,
    DeletarResultado
} from "../controllers/resultadoControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { permitirProfessor } from "../middlewares/permitirProfessor.js"

const router = Router()

router.get("/", ListaResultados)

router.post("/", authMiddleware, permitirProfessor, CriarResultado)
router.put("/:id", authMiddleware, permitirProfessor, AtualizarResultado)
router.patch("/:id", authMiddleware, permitirProfessor, AtualizarParcialResultado)
router.delete("/:id", authMiddleware, permitirProfessor, DeletarResultado)

export default router