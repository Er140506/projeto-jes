import jwt from "jsonwebtoken"

export const gerarToken = (usuario) => {
    return jwt.sign(
        { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
    )
}