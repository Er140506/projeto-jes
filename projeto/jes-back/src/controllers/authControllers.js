/**
 * src/controllers/authControllers.js
 * Cadastro e login - exclusivos para professores.
 *
 * Alunos não têm conta: eles só acompanham os jogos pelas rotas de
 * leitura (GET), que são públicas e não passam por aqui.
 */

import bcrypt from "bcryptjs"
import { usuarioModel } from "../model/index.js"
import { tratarErro } from "../utils/erroHandler.js"
import { gerarToken } from "../utils/gerarToken.js"

// POST /auth/registrar - Cria um novo usuário professor
export const registrar = async (request, response) => {
    try {
        const { nome, email, senha, codigoProfessor } = request.body

        if (!nome || nome.trim() === "") {
            return response.status(400).json({ msg: "O campo 'nome' é obrigatório" })
        }

        if (!email || email.trim() === "") {
            return response.status(400).json({ msg: "O campo 'email' é obrigatório" })
        }

        if (!senha || senha.length < 8) {
            return response.status(400).json({ msg: "A senha deve ter ao menos 8 caracteres" })
        }

        // Só professor tem conta no sistema. Sem o código certo, nem cadastra.
        if (!codigoProfessor || codigoProfessor !== process.env.CODIGO_PROFESSOR) {
            return response.status(403).json({
                msg: "Apenas professores podem se cadastrar. Informe o código de acesso correto."
            })
        }

        const emailNormalizado = email.trim().toLowerCase()

        // Confere se já existe um usuário com esse email
        const usuarioExiste = await usuarioModel.findOne({ where: { email: emailNormalizado } })
        if (usuarioExiste) {
            return response.status(409).json({ msg: "Já existe um usuário com esse email" })
        }

        // Nunca salva a senha em texto puro - sempre criptografada
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoUsuario = await usuarioModel.create({
            nome,
            email: emailNormalizado,
            senha: senhaCriptografada,
            tipo: "professor",
        })

        const token = gerarToken(novoUsuario)

        return response.status(201).json({
            msg: "Usuário criado com sucesso!",
            usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email, tipo: novoUsuario.tipo },
            token
        })
    } catch (error) {
        console.error("Erro ao registrar usuário:", error.message)
        return tratarErro(error, response)
    }
}

// POST /auth/login - Autentica um professor já cadastrado
export const login = async (request, response) => {
    try {
        const { email, senha } = request.body

        if (!email || email.trim() === "") {
            return response.status(400).json({ msg: "O campo 'email' é obrigatório" })
        }

        if (!senha) {
            return response.status(400).json({ msg: "O campo 'senha' é obrigatório" })
        }

        const emailNormalizado = email.trim().toLowerCase()
        const usuario = await usuarioModel.findOne({ where: { email: emailNormalizado } })

        // Mensagem genérica de propósito: não revela se o problema foi o e-mail ou a senha
        if (!usuario) {
            return response.status(401).json({ msg: "E-mail ou senha inválidos" })
        }

        const senhaConfere = await bcrypt.compare(senha, usuario.senha)
        if (!senhaConfere) {
            return response.status(401).json({ msg: "E-mail ou senha inválidos" })
        }

        const token = gerarToken(usuario)

        return response.status(200).json({
            msg: "Login realizado com sucesso!",
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
            token
        })
    } catch (error) {
        console.error("Erro ao fazer login:", error.message)
        return tratarErro(error, response)
    }
}

