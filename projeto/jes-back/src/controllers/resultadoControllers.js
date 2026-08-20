/**
 * src/controllers/resultadoControllers.js
 * CRUD de resultados (marca de uma equipe em uma prova específica).
 */

import { resultadoModel, provaModel, equipeModel } from "../model/index.js"
import { tratarErro } from "../utils/erroHandler.js"
import { formatResultado } from "../views/provaView.js"

// Campos que o cliente tem permissão de alterar via PATCH
const CAMPOS_PERMITIDOS = ["provaId", "equipeId", "marca"]

// GET /resultados - Lista todos os resultados cadastrados
export const ListaResultados = async (request, response) => {
    try {
        const resultados = await resultadoModel.findAll()
        return response.status(200).json(resultados.map(formatResultado))
    } catch (error) {
        console.error("Erro ao listar resultados:", error.message)
        return tratarErro(error, response)
    }
}

// POST /resultados - Cria um novo resultado
export const CriarResultado = async (request, response) => {
    try {
        const { provaId, equipeId, marca } = request.body

        if (!provaId) {
            return response.status(400).json({ msg: "O campo 'provaId' é obrigatório" })
        }

        if (!equipeId) {
            return response.status(400).json({ msg: "O campo 'equipeId' é obrigatório" })
        }

        if (marca === undefined || marca === null) {
            return response.status(400).json({ msg: "O campo 'marca' é obrigatório" })
        }

        // Confere se a prova e a equipe informadas realmente existem antes de criar o resultado
        const provaExiste = await provaModel.findByPk(provaId)
        if (!provaExiste) {
            return response.status(404).json({ msg: "Prova informada não existe" })
        }

        const equipeExiste = await equipeModel.findByPk(equipeId)
        if (!equipeExiste) {
            return response.status(404).json({ msg: "Equipe informada não existe" })
        }

        const novoResultado = await resultadoModel.create({ provaId, equipeId, marca })

        return response.status(201).json({
            msg: "Resultado criado com sucesso!",
            resultado: formatResultado(novoResultado)
        })
    } catch (error) {
        console.error("Erro ao criar resultado:", error.message)
        return tratarErro(error, response)
    }
}

// PUT /resultados/:id - Substitui todos os campos do resultado (atualização completa)
export const AtualizarResultado = async (request, response) => {
    try {
        const { id } = request.params
        const { provaId, equipeId, marca } = request.body

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Id inválido" })
        }

        if (!provaId || !equipeId || marca === undefined || marca === null) {
            return response.status(400).json({ msg: "Os campos 'provaId', 'equipeId' e 'marca' são obrigatórios" })
        }

        const resultado = await resultadoModel.findByPk(id)
        if (!resultado) {
            return response.status(404).json({ msg: "Resultado não encontrado" })
        }

        await resultado.update({ provaId, equipeId, marca })

        return response.status(200).json({
            msg: "Resultado atualizado com sucesso!",
            resultado: formatResultado(resultado)
        })
    } catch (error) {
        console.error("Erro ao atualizar resultado:", error.message)
        return tratarErro(error, response)
    }
}

// PATCH /resultados/:id - Atualiza somente os campos enviados no corpo da requisição
export const AtualizarParcialResultado = async (request, response) => {
    try {
        const { id } = request.params
        const dadosParaAtualizar = request.body

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Id inválido" })
        }

        if (!dadosParaAtualizar || Object.keys(dadosParaAtualizar).length === 0) {
            return response.status(400).json({ msg: "Envie ao menos um campo para atualizar" })
        }

        const dadosFiltrados = {}
        for (const campo of CAMPOS_PERMITIDOS) {
            if (dadosParaAtualizar[campo] !== undefined) {
                dadosFiltrados[campo] = dadosParaAtualizar[campo]
            }
        }

        if (Object.keys(dadosFiltrados).length === 0) {
            return response.status(400).json({ msg: "Nenhum campo válido foi enviado para atualização" })
        }

        const resultado = await resultadoModel.findByPk(id)
        if (!resultado) {
            return response.status(404).json({ msg: "Resultado não encontrado" })
        }

        await resultado.update(dadosFiltrados)

        return response.status(200).json({
            msg: "Resultado atualizado parcialmente com sucesso!",
            resultado: formatResultado(resultado)
        })
    } catch (error) {
        console.error("Erro ao atualizar parcialmente resultado:", error.message)
        return tratarErro(error, response)
    }
}

// DELETE /resultados/:id - Remove um resultado do banco
export const DeletarResultado = async (request, response) => {
    try {
        const { id } = request.params

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Id inválido" })
        }

        const resultado = await resultadoModel.findByPk(id)
        if (!resultado) {
            return response.status(404).json({ msg: "Resultado não encontrado" })
        }

        await resultado.destroy()

        return response.status(200).json({ msg: "Resultado deletado com sucesso!" })
    } catch (error) {
        console.error("Erro ao deletar resultado:", error.message)
        return tratarErro(error, response)
    }
}