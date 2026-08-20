/**
 * Middleware que só deixa passar usuários do tipo "professor".
 * Na prática, hoje só existem contas de professor (aluno não faz login),
 * mas o middleware continua aqui como uma segunda camada de proteção -
 * garante que só um token válido de professor libera escrita nos dados.
 * Deve ser usado sempre depois do authMiddleware (precisa de request.usuario).
 */
export const permitirProfessor = (request, response, next) => {
    if (!request.usuario) {
        return response.status(401).json({ msg: "Token não informado" })
    }

    if (request.usuario.tipo !== "professor") {
        return response.status(403).json({ msg: "Apenas professores podem acessar esse recurso" })
    }

    next()
}

