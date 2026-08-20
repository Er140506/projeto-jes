import {describe, test, expect } from "vitest"
import app from "../src/app.js";
import request from "supertest";
import { conexao } from "../src/config/conexao.js";
import {beforeAll} from "vitest"
import { provaModel } from "../src/model/prova.js";
import { equipeModel } from "../src/model/equipe.js";

beforeAll(async()=>{
    await conexao.sync({force:true})//limpa o banco depois dos testes

})


    const gerarProva = async(dados = {}) =>{
    return await provaModel.create({
    nome: `Futsal${Math.random()}`,
    ...dados
})

}

    const gerarEquipe = async(dados = {}) =>{
    return await equipeModel.create({
    nome: `Equipe A${Math.random()}`,
    ...dados
})

}


    const resultados = async(dados = {}) =>{
    return await request(app)
    .post('/resultados')
    .send({
        provaId: dados.provaId,
        equipeId: dados.equipeId,
        marca: 10
    })
    }

describe("GET /resultados", ()=>{
    test("deve retornar 200 com uma lista junto das propriedades corretas ",async()=>{

        const equipe = await gerarEquipe()
        const prova = await gerarProva()

         await resultados({
            provaId: prova.id,
            equipeId: equipe.id,
            marca: 14.2
        })

        expect(response.status).toBe(200)
        expect(response.ok).toBeTruthy()

       const response = await request(app).get('/resultados')
    })

     test('Deve retornar 400 caso equipeId for vazio', async()=>{

            const equipe = await gerarEquipe()
            const prova = await gerarProva()

            await resultados({
                provaId: prova.id,
                equipeId: null,
                marca: 14.2
            })

            const response = await request(app).get('/resultados')

            expect(response)

            expect(response.status).toBe(400)
            expect(response.ok).toBeFalsy()
        })
    test('Deve retornar 400 caso provaId for vazio', async()=>{

            const equipe = await gerarEquipe()
            const prova = await gerarProva()

            await resultados({
                provaId: null,
                equipeId: equipe.id,
                marca: 14.2
            })

            const response = await request(app).get('/resultados')

            expect(response)

            expect(response.status).toBe(400)
            expect(response.ok).toBeFalsy()
        })
})  

describe('POST /resultados', async()=>{
    
    test('Deve devolver 201 com as credenciais corretas', async()=>{

        const prova = gerarProva()
        const equipe = gerarEquipe()

        const dados = {
            provaId: prova.id,
            equipeId: equipe.id,
            marca: 14.2
            }

        const response = await resultados(dados)

        expect(response.status).toBe(200)
        expect(response.ok).toBeTruthy()
    })
    test('Deve devolver 400 caso as credenciais erradas', async()=>{

        const prova = gerarProva()
        const equipe = gerarEquipe()

        const dados = {
            provaId: null,
            equipeId: null,
            marca: 14.2
            }

        const response = await resultados(dados)

        expect(response.status).toBe(400)
        expect(response.ok).toBeFalsy()
    })
})

describe('PUT /resultados/:id', ()=>{
    test('atualizar os resultados e voltar 200', async()=>{

        const prova = await gerarProva()
        const equipe =  await gerarEquipe()

        const resultado = await resultados()

        const dadosAtualizados = {
            provaId: prova.id,
            equipeId: equipe.id,
            marca: 10.2
        }

        const response = await request(app)
        .put(`/resultados/${resultado.body.id}`)
        send(dadosAtualizados)

        expect(response.status).toBe(200)
        expect(response.ok).toBeTruthy()

        expect(response.body).toEqual({
            id: resultado.body.id,
            ...dadosAtualizados
        })
    })
})

describe('DELETE /resultados/:id',()=>{
    test('Deve retornar o status 204', async()=>{

        const resultado = await resultados()

        const response = await request(app)
        .delete(`/resultados/${resultado.body.id}`)
        
        expect(response.status).toBe(204)
        expect(response.ok).toBeTruthy()
    })
})
