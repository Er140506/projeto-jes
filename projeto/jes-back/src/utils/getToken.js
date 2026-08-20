/**
 * Extrai o token do header "Authorization: Bearer <token>".
 */
export const getToken = (request) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
        return null
    }

    const [, token] = authHeader.split(" ")
    return token || null
}