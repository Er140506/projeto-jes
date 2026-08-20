import { equipeModel, partidasModel, modalidadeModel, provaModel, seriesModel, resultadoModel } from "../model/index.js"
import { tratarErro } from "../utils/erroHandler.js"

// GET - Lista todas as equipes
export const ListaEquipes = async (request, response) => {
    try {
        const equipe = await equipeModel.findAll()
        response.status(200).json(equipe)
    } catch (error) {
        console.log("erro ao listar equipes:", error.message)
        response.status(500).json({ mensagem: "Erro ao listar equipes" })
    }
}

// POST - Cria uma equipe e retorna o id da modalidade vinculada + um texto de confirmação
export const CriarEquipe = async (request, response) => {
    try {
        const { modalidadeId, serieId, turma, nome, jogadores } = request.body

        // Validações básicas dos campos obrigatórios
        if (!nome || nome.trim() === "") {
            return response.status(400).json({ msg: "O campo 'nome' é obrigatório" })
        }

        if (!modalidadeId) {
            return response.status(400).json({ msg: "O campo 'modalidadeId' é obrigatório" })
        }

        // Confere se a modalidade informada realmente existe
        const modalidadeExiste = await modalidadeModel.findByPk(modalidadeId)
        if (!modalidadeExiste) {
            return response.status(404).json({ msg: "Modalidade informada não existe" })
        }

        // Cria a nova equipe no banco
        const novaEquipe = await equipeModel.create({
            modalidadeId,
            serieId,
            turma,
            nome,
            jogadores
        })

        // Busca a equipe criada aplicando INCLUDE e EXCLUDE para tirar informações estruturais/ID
        const equipeCriada = await equipeModel.findByPk(novaEquipe.id, {
            include: {
                model: modalidadeModel,
                as: "modalidade",
                attributes: {
                    exclude: ['id', 'createdAt', 'updatedAt']
                }
            }
        })

        return response.status(201).json({
            texto: "Equipe criada com sucesso!",
            id: equipeCriada.id,
            modalidadeId: modalidadeId, // Mantém o ID enviado na requisição original
            equipe: equipeCriada
        })
    } catch (error) {
        console.error("Erro ao criar equipe:", error.message)
        return tratarErro(error, response)
    }
}

// PUT - Atualiza a equipe por completo
export const AtualizarEquipe = async (request, response) => {
    try {
        const { id } = request.params
        const { modalidadeId, serieId, turma, nome, jogadores } = request.body

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Id inválido" })
        }

        if (!nome || nome.trim() === "") {
            return response.status(400).json({ msg: "O campo 'nome' é obrigatório" })
        }

        if (!modalidadeId) {
            return response.status(400).json({ msg: "O campo 'modalidadeId' é obrigatório" })
        }

        const equipe = await equipeModel.findByPk(id)
        if (!equipe) {
            return response.status(404).json({ msg: "Equipe não encontrada" })
        }

        await equipe.update({ modalidadeId, serieId, turma, nome, jogadores })

        return response.status(200).json({
            msg: "Equipe atualizada com sucesso!",
            equipe
        })
    } catch (error) {
        console.error("Erro ao atualizar equipe:", error.message)
        return tratarErro(error, response)
    }
}

// PATCH - Atualiza a equipe parcialmente (só os campos enviados)
export const AtualizarParcialEquipe = async (request, response) => {
    try {
        const { id } = request.params
        const dadosParaAtualizar = request.body

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Id inválido" })
        }

        if (!dadosParaAtualizar || Object.keys(dadosParaAtualizar).length === 0) {
            return response.status(400).json({ msg: "Envie ao menos um campo para atualizar" })
        }

        const equipe = await equipeModel.findByPk(id)
        if (!equipe) {
            return response.status(404).json({ msg: "Equipe não encontrada" })
        }

        await equipe.update(dadosParaAtualizar)

        return response.status(200).json({
            msg: "Equipe atualizada parcialmente com sucesso!",
            equipe
        })
    } catch (error) {
        console.error("Erro ao atualizar parcialmente equipe:", error.message)
        return tratarErro(error, response)
    }
}

// DELETE - Remove a equipe
export const DeletarEquipe = async (request, response) => {
    try {
        const { id } = request.params

        if (isNaN(id)) {
            return response.status(400).json({ msg: "Id inválido" })
        }

        const equipe = await equipeModel.findByPk(id)
        if (!equipe) {
            return response.status(404).json({ msg: "Equipe não encontrada" })
        }

        await equipe.destroy()

        return response.status(200).json({
            msg: "Equipe deletada com sucesso!"
        })
    } catch (error) {
        console.error("Erro ao deletar equipe:", error.message)
        return tratarErro(error, response)
    }
}