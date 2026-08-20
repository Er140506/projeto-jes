import { describe, test, expect, beforeAll } from "vitest";
import app from "../src/app.js";
import request from "supertest";
import { conexao as conn } from "../src/config/conexao.js";
import { partidasModel } from "../src/model/index.js";

let token;
let modalidade;

beforeAll(async () => {
  await conn.sync({ force: true });

  const usuario = await request(app)
    .post("/auth/registrar")
    .send({
      nome: "Professor Teste",
      email: `professor${Date.now()}@email.com`,
      senha: "123456789",
      codigoProfessor: process.env.CODIGO_PROFESSOR,
    });

  expect(usuario.status).toBe(201);

  token = usuario.body.token;

  const respostaModalidade = await request(app)
    .post("/modalidades")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nome: `Futebol ${Date.now()}`,
      tipo: "equipe",
      minJogadores: 1,
      maxJogadores: 15,
      formato: "pontoscorridos",
    });

  expect(respostaModalidade.status).toBe(201);

  modalidade = respostaModalidade.body.msg;
});

// PARTIDAS

describe("GET /partidas", () => {
  test("Deve retornar o status 200", async () => {
    const response = await request(app).get("/partidas");

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});

describe("POST /partidas", () => {
  test("Deve retornar o status 201", async () => {
    const response = await request(app)
      .post("/partidas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: modalidade.id,
        formato: "pontoscorridos",
        rodada: 1,
        faseNome: "Fase de Grupos",
      });

    expect(response.status).toBe(201);
    expect(response.ok).toBeTruthy();
    expect(response.body.message).toBe("Partida Criada");
  });
});

describe("GET /partidas/:id", () => {
  test("Deve retornar o status 200", async () => {
    await request(app)
      .post("/partidas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: modalidade.id,
        formato: "pontoscorridos",
        rodada: 1,
        faseNome: "Fase de Grupos",
      });

    const partida = await partidasModel.findOne({
      order: [["id", "DESC"]],
    });

    const response = await request(app)
      .get(`/partidas/${partida.id}`);

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.id).toBeDefined();
  });

  test("Deve retornar 404 quando a partida não existir", async () => {
    const response = await request(app).get("/partidas/9999");

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});

describe("PUT /partidas/:id", () => {
  test("Deve retornar o status 200", async () => {
    await request(app)
      .post("/partidas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: modalidade.id,
        formato: "pontoscorridos",
        rodada: 1,
        faseNome: "Fase de Grupos",
      });

    const partida = await partidasModel.findOne({
      order: [["id", "DESC"]],
    });

    const response = await request(app)
      .put(`/partidas/${partida.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "finalizado",
        placarA: 2,
        placarB: 1,
      });

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.message).toBe("Partida atualizada com sucesso");
  });

  test("Deve retornar 404 caso a partida não exista", async () => {
    const response = await request(app)
      .put("/partidas/9999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "finalizado",
        placarA: 2,
        placarB: 1,
      });

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});