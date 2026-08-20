/**
 * src/controllers/provaControllers.js
 * CRUD de provas (usadas em modalidades no formato "ranking", ex: atletismo).
 */

import { provaModel, modalidadeModel } from "../model/index.js"
import { tratarErro } from "../utils/erroHandler.js"
import { formatProva, formatProvaList } from "../views/provaView.js"

// Campos que o cliente tem permissão de alterar via PATCH
const CAMPOS_PERMITIDOS = ["modalidadeId", "nome", "tipoMarca"]

// GET /provas - Lista todas as provas cadastradas
export const ListaProvas = async (request, response) => {
    try {
        const provas = await provaModel.findAll()
        return response.status(200).json(formatProvaList(provas))
    } catch (error) {
        console.error("Erro ao listar provas:", error.message)
        return tratarErro(error, response)
    }
}

// POST /provas - Cria uma nova prova
export const CriarProva = async (request, response) => {
    try {
        const { modalidadeId, nome, tipoMarca } = request.body

        if (!nome || nome.trim() === "") {
            return response.status(400).json({ msg: "O campo 'nome' é obrigatório" })
        }

        if (!modalidadeId) {
            return response.status(400).json({ msg: "O campo 'modalidadeId' é obrigatório" })
        }

        // Confere se a modalidade informada realmente existe antes de criar a prova
        const modalidadeExiste = await modalidadeModel.findByPk(modalidadeId)
        if (!modalidadeExiste) {
            return response.status(404).json({ msg: "Modalidade informada não existe" })
        }

        const novaProva = await provaModel.create({ modalidadeId, nome, tipoMarca })

        return response.status(201).json({
            msg: "Prova criada com sucesso!",
            prova: formatProva(novaProva)
        })
    } catch (error) {
        console.error("Erro ao criar prova:", error.message)
        return tratarErro(error, response)
    }
}

// PUT /provas/:id - Substitui todos os campos da prova (atualização completa)
export const AtualizarProva = async (request, response) => {
    try {
        const { id } = request.params
        const { modalidadeId, nome, tipoMarca } = request.body

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Id inválido" })
        }

        if (!nome || nome.trim() === "") {
            return response.status(400).json({ msg: "O campo 'nome' é obrigatório" })
        }

        if (!modalidadeId) {
            return response.status(400).json({ msg: "O campo 'modalidadeId' é obrigatório" })
        }

        const prova = await provaModel.findByPk(id)
        if (!prova) {
            return response.status(404).json({ msg: "Prova não encontrada" })
        }

        await prova.update({ modalidadeId, nome, tipoMarca })

        return response.status(200).json({
            msg: "Prova atualizada com sucesso!",
            prova: formatProva(prova)
        })
    } catch (error) {
        console.error("Erro ao atualizar prova:", error.message)
        return tratarErro(error, response)
    }
}

// PATCH /provas/:id - Atualiza somente os campos enviados no corpo da requisição
export const AtualizarParcialProva = async (request, response) => {
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

        if (dadosFiltrados.nome !== undefined && dadosFiltrados.nome.trim() === "") {
            return response.status(400).json({ msg: "O campo 'nome' não pode ficar vazio" })
        }

        const prova = await provaModel.findByPk(id)
        if (!prova) {
            return response.status(404).json({ msg: "Prova não encontrada" })
        }

        await prova.update(dadosFiltrados)

        return response.status(200).json({
            msg: "Prova atualizada parcialmente com sucesso!",
            prova: formatProva(prova)
        })
    } catch (error) {
        console.error("Erro ao atualizar parcialmente prova:", error.message)
        return tratarErro(error, response)
    }
}

// DELETE /provas/:id - Remove uma prova do banco
export const DeletarProva = async (request, response) => {
    try {
        const { id } = request.params

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Id inválido" })
        }

        const prova = await provaModel.findByPk(id)
        if (!prova) {
            return response.status(404).json({ msg: "Prova não encontrada" })
        }

        await prova.destroy()

        return response.status(200).json({ msg: "Prova deletada com sucesso!" })
    } catch (error) {
        console.error("Erro ao deletar prova:", error.message)
        return tratarErro(error, response)
    }
}