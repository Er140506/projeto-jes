import { Router } from "express"
import {
    ListaEquipes,
    CriarEquipe,
    AtualizarEquipe,
    AtualizarParcialEquipe,
    DeletarEquipe
} from "../controllers/equipesControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { permitirProfessor } from "../middlewares/permitirProfessor.js"

const router = Router()

router.get("/", ListaEquipes)

router.post("/", authMiddleware, permitirProfessor, CriarEquipe)
router.put("/:id", authMiddleware, permitirProfessor, AtualizarEquipe)
router.patch("/:id", authMiddleware, permitirProfessor, AtualizarParcialEquipe)
router.delete("/:id", authMiddleware, permitirProfessor, DeletarEquipe)

export default router