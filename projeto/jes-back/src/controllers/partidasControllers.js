/**
 * src/controllers/partidasControllers.js
 * CRUD de partidas.
 */

import { partidasModel } from "../model/index.js"
import { tratarErro } from "../utils/erroHandler.js"

// Campos que o cliente tem permissão de alterar via PUT.
// Evita que o body sobrescreva colunas internas do chaveamento (nextMatchId, etc).
const CAMPOS_PERMITIDOS = [
    "modalidadeId", "formato", "rodada", "faseNome", "slot",
    "timeAId", "timeBId", "placarA", "placarB", "status", "data", "hora",
    "local", "duracao", "iniciadaEm", "proximaPartidaId", "proximaPartidaVaga"
]

// GET /partidas - Lista todas as partidas
export const listarPartidas = async (request, response) => {
    try {
        const partidas = await partidasModel.findAll()
        response.status(200).json(partidas)
    } catch (error) {
        await tratarErro(error, response)
    }
}

// POST /partidas - Cria uma partida
export const cadastrarPartidas = async (request, response) => {
    try {
        const dadosPartida = {}
        for (const campo of CAMPOS_PERMITIDOS) {
            if (request.body[campo] !== undefined) {
                dadosPartida[campo] = request.body[campo]
            }
        }

        await partidasModel.create(dadosPartida)

        response.status(201).json({ message: "Partida Criada" })
    } catch (error) {
        await tratarErro(error, response)
    }
}

// GET /partidas/:id - Busca uma partida pelo ID
export const buscarPartidaPorId = async (request, response) => {
    try {
        const partida = await partidasModel.findByPk(request.params.id)

        if (!partida) {
            response.status(404).json({ message: "Partida não encontrada" })
            return
        }

        response.status(200).json(partida)
    } catch (error) {
        await tratarErro(error, response)
    }
}

// PUT /partidas/:id - Atualiza uma partida
export const atualizarPartida = async (request, response) => {
    try {
        const { id } = request.params
        const partida = await partidasModel.findByPk(id)

        if (!partida) {
            return response.status(404).json({ message: "Partida não encontrada" })
        }

        const dadosPartida = {}
        for (const campo of CAMPOS_PERMITIDOS) {
            if (request.body[campo] !== undefined) {
                dadosPartida[campo] = request.body[campo]
            }
        }

        await partida.update(dadosPartida)

        response.status(200).json({
            message: "Partida atualizada com sucesso",
            partida
        })
    } catch (error) {
        await tratarErro(error, response)
    }
}