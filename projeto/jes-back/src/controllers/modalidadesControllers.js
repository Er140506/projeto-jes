/**
 * src/controllers/modalidadesControllers.js
 * CRUD de modalidades + geração de chaveamento + classificação.
 */

import { equipeModel } from '../model/equipe.js'
import { modalidadeModel } from '../model/modalidades.js'
import { partidasModel } from "../model/partidas.js"
import { tratarErro } from "../utils/erroHandler.js"
import { gerarEliminatoria, gerarPontosCorridos } from "../service/bracketService.js"
import { conexao } from "../config/conexao.js"

import { formatPartida } from "../views/partidaView.js"
import { calcularClassificacao } from "../service/standingsService.js"
import { formatEquipe } from "../views/equipesViews.js"

// GET /modalidades - Lista todas as modalidades
export const listarModalidades = async (req, res) => {
    try {
        const modalidades = await modalidadeModel.findAll({
            order: [['id', 'ASC']]
        })

        return res.status(200).json({ msg: modalidades })
    } catch (error) {
        return tratarErro(error, res)
    }
}

// POST /modalidades - Cadastra uma modalidade
export const cadastrarModalidades = async (req, res) => {
    const {
        nome,
        emoji,
        tipo,
        minJogadores,
        maxJogadores,
        formato,
        duracaoPadrao,
        minDinamico,
        ranking
    } = req.body

    if (!nome || !tipo) {
        return res.status(400).json({
            msg: "Informe ao menos o 'nome' e o 'tipo' da modalidade"
        })
    }

    try {
        const modalidades = await modalidadeModel.create({
            nome,
            emoji: emoji || "",
            tipo,
            minJogadores: minJogadores || 1,
            maxJogadores: maxJogadores || 1,
            formato: formato || 'pontoscorridos',
            duracaoPadrao: duracaoPadrao ?? null,
            minDinamico: !!minDinamico,
            ranking: !!ranking
        })

        return res.status(201).json({ msg: modalidades })
    } catch (error) {
        return tratarErro(error, res)
    }
}

// GET /modalidades/:id - Busca modalidade pelo ID
export const buscarporId = async (req, res) => {
    const { id } = req.params

    try {
        const modalidades = await modalidadeModel.findByPk(id)

        if (!modalidades) {
            return res.status(404).json({ msg: "Modalidade não encontrada" })
        }

        return res.status(200).json({ msg: modalidades })
    } catch (error) {
        return tratarErro(error, res)
    }
}

// PUT /modalidades/:id - Atualiza uma modalidade
export const atualizarModalidades = async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ msg: "ID da modalidade não informado" })
    }

    try {
        const modalidade = await modalidadeModel.findByPk(id)

        if (!modalidade) {
            return res.status(404).json({ msg: "Modalidade não encontrada" })
        }

        const campos = [
            "nome",
            "emoji",
            "tipo",
            "minJogadores",
            "maxJogadores",
            "formato",
            "duracaoPadrao",
            "minDinamico",
            "ranking"
        ]

        const atualizacao = {}
        campos.forEach(campo => {
            if (req.body[campo] !== undefined) {
                atualizacao[campo] = req.body[campo]
            }
        })

        await modalidade.update(atualizacao)

        return res.status(200).json({
            msg: "Modalidade atualizada com sucesso",
            atualizacao
        })
    } catch (error) {
        return tratarErro(error, res)
    }
}

// POST /modalidades/:id/chaveamento - Gera o chaveamento (mata-mata ou pontos corridos)
export const gerarChaveamento = async (req, res) => {
    const { id } = req.params

    try {
        const modalidade = await modalidadeModel.findByPk(id)

        if (!modalidade) {
            return res.status(404).json({ msg: "Modalidade não encontrada" })
        }

        if (modalidade.ranking) {
            return res.status(400).json({
                msg: "Modalidades de ranking não usam chaveamentos - cadastre provas ou resultados"
            })
        }

        const equipes = await equipeModel.findAll({
            where: { modalidadeId: modalidade.id, fundidaEmId: null }
        })

        const geradas = modalidade.formato === "eliminatoria"
            ? gerarEliminatoria(equipes, modalidade.id)
            : gerarPontosCorridos(equipes, modalidade.id)

        const partidasFinais = await conexao.transaction(async (t) => {
            await partidasModel.destroy({ where: { modalidadeId: modalidade.id }, transaction: t })

            const idReal = {}
            const criadas = []

            for (const partidaGerada of geradas) {
                const linha = await partidasModel.create(
                    {
                        modalidadeId: modalidade.id,
                        formato: partidaGerada.formato,
                        rodada: partidaGerada.rodada,
                        faseNome: partidaGerada.faseNome,
                        slot: partidaGerada.slot ?? null,
                        timeAId: partidaGerada.timeAId || null,
                        timeBId: partidaGerada.timeBId || null,
                        status: partidaGerada.status || 'agendado',
                    },
                    { transaction: t }
                )
                idReal[partidaGerada.id] = linha.id
                criadas.push({ linha, nextMatchIdTemp: partidaGerada.nextMatchId, nextMatchSlot: partidaGerada.nextMatchSlot })
            }

            for (const item of criadas) {
                if (item.nextMatchIdTemp) {
                    await item.linha.update(
                        { nextMatchId: idReal[item.nextMatchIdTemp], nextMatchSlot: item.nextMatchSlot },
                        { transaction: t }
                    )
                }
            }

            return partidasModel.findAll({
                where: { modalidadeId: modalidade.id },
                include: [
                    { association: 'timeA', include: ['series'] },
                    { association: 'timeB', include: ['series'] }
                ],
                order: [['rodada', 'ASC'], ['id', 'ASC']],
                transaction: t
            })
        })

        return res.json(formatPartida(partidasFinais))
    } catch (error) {
        return tratarErro(error, res)
    }
}

// GET /modalidades/:id/classificacao - Mostra a classificação
export const classificacao = async (req, res) => {
    const { id } = req.params

    try {
        const modalidade = await modalidadeModel.findByPk(id)
        if (!modalidade) {
            return res.status(404).json({ msg: "Modalidade não encontrada" })
        }

        const equipes = await equipeModel.findAll({
            where: { modalidadeId: modalidade.id, fundidaEmId: null }
        })

        const partidas = await partidasModel.findAll({
            where: { modalidadeId: modalidade.id }
        })

        const tabela = calcularClassificacao(equipes, partidas, modalidade.id)

        const equipesporID = new Map(equipes.map(e => [e.id, e]))

        const resultado = tabela.map(linha => ({
            ...linha,
            equipe: equipesporID.has(linha.timeId)
                ? formatEquipe(equipesporID.get(linha.timeId))
                : null
        }))

        return res.status(200).json(resultado)
    } catch (error) {
        return tratarErro(error, res)
    }
}