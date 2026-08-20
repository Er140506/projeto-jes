import "./model/index.js"
import app from "./app.js"
import { conexao } from "./config/conexao.js"

const PORT = process.env.PORT || 3000

const iniciarServidor = async () => {
    try {
       
        // await conexao.sync({force:true})
        await conexao.sync()

        app.listen(PORT, () => {
            console.log("Servidor iniciado na porta", PORT)
        })
    } catch (error) {
        console.log("Erro ao iniciar o servidor:", error.message)
    }
}

await iniciarServidor()