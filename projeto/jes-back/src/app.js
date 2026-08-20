import "dotenv/config"
import express from "express"
import cors from "cors"
import {
    equipesRoute,
    modalidadesRouter,
    partidasRouter,
    seriesRoute,
    provaRoute,
    resultadoRoute,
    authRoute
} from "./router/indexRoute.js"

const app = express()

app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"],
    credentials: true
}))

app.use(express.json())

app.use("/auth", authRoute)
app.use("/equipes", equipesRoute)
app.use('/modalidades', modalidadesRouter)
app.use('/partidas', partidasRouter)
app.use('/series', seriesRoute)
app.use('/provas', provaRoute)
app.use('/resultados', resultadoRoute)

app.use((request,response)=>{
    response.status(400).json({mensagem:"Rota não encontrada"})
})

export default app