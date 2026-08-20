import jwt from "jsonwebtoken"
import { getToken } from "../utils/getToken.js"

export const authMiddleware = (request, response, next) => {
    const token = getToken(request)

    if (!token) {
        return response.status(401).json({ msg: "Token não informado" })
    }

    try {
        const dadosUsuario = jwt.verify(token, process.env.JWT_SECRET)
        request.usuario = dadosUsuario 
        next()
    } catch (error) {
        return response.status(401).json({ msg: "Token inválido ou expirado" })
    }
}

// import jwt from "jsonwebtoken";
// import { getToken } from "../utils/getToken.js";

// export const authMiddleware = (request, response, next) => {
//     const token = getToken(request);

//     if (!token) {
//         return response.status(401).json({ msg: "Acesso negado. Token não informado." });
//     }

//     // 1. Defesa contra Tokens Gigantes (Prevenção de ReDoS / Algorithmic DoS)
//     // Impede que o servidor gaste CPU tentando decodificar strings absurdamente longas
//     if (token.length > 2048) {
//         return response.status(401).json({ msg: "Token inválido." });
//     }

//     try {
//         // 2. Restrição de Algoritmo Seguros
//         // Força o JWT a aceitar APENAS o algoritmo definido (geralmente HS256).
//         // Isso mitiga ataques do tipo "algorithm: none" ou substituição por chaves públicas/assimétricas.
//         const dadosUsuario = jwt.verify(token, process.env.JWT_SECRET, {
//             algorithms: ["HS256"] 
//         });

//         // 3. Sanitização e Validação do Payload
//         // Garante que o token possui os dados mínimos esperados e evita poluição de protótipo.
//         if (!dadosUsuario || typeof dadosUsuario !== 'object' || !dadosUsuario.id) {
//             return response.status(401).json({ msg: "Token com estrutura inválida." });
//         }

//         // 4. Armazenamento Seguro no Request
//         // Repassa apenas os dados necessários do usuário filtrados, sem expor propriedades infladas do JWT (como iat, exp).
//         request.usuario = {
//             id: dadosUsuario.id,
//             nome: dadosUsuario.nome || null,
//             role: dadosUsuario.role || 'user' // Se o seu sistema usar níveis de acesso (ex: admin)
//         };

//         return next();
//     } catch (error) {
//         // 5. Tratamento de Erros Silencioso (Defensivo)
//         // Se o token expirou ou a assinatura é falsa, retorna a mesma mensagem genérica.
//         // Nunca dê detalhes internos do erro (como stack traces) para o cliente.
//         if (error.name === 'TokenExpiredError') {
//             return response.status(401).json({ msg: "Sessão expirada. Faça login novamente." });
//         }
        
//         return response.status(401).json({ msg: "Token inválido." });
//     }
// };
