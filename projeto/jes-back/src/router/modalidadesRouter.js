import { Router } from "express"
import {
    listarModalidades,
    buscarporId,
    cadastrarModalidades,
    atualizarModalidades,
    classificacao,
    gerarChaveamento
} from '../controllers/modalidadesControllers.js'
import asyncHandler from "../utils/asyncHandler.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { permitirProfessor } from "../middlewares/permitirProfessor.js"

const router = Router()

router.get('/', asyncHandler(listarModalidades))
router.get('/:id', asyncHandler(buscarporId))
router.get('/:id/classificacao', asyncHandler(classificacao))

router.post('/', authMiddleware, permitirProfessor, asyncHandler(cadastrarModalidades))
router.put('/:id', authMiddleware, permitirProfessor, asyncHandler(atualizarModalidades))
router.post('/:id/chaveamento', authMiddleware, permitirProfessor, asyncHandler(gerarChaveamento))

export default router