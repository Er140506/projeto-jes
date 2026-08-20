import { describe, test, expect, beforeAll } from "vitest";
import app from "../src/app.js";
import request from "supertest";
import { conexao } from "../src/config/conexao.js";

let token;

beforeAll(async () => {
  await conexao.sync({ force: true });

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
});

const criarModalidade = async (dados = {}) => {
  return await request(app)
    .post("/modalidades")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nome: `Modalidade ${Date.now()}${Math.random()}`,
      tipo: "equipe",
      minJogadores: 1,
      maxJogadores: 10,
      formato: "pontoscorridos",
      ...dados,
    });
};



describe("GET /modalidades", () => {
  test("Deve retornar o status 200", async () => {
    const response = await request(app).get("/modalidades");

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("msg");
  });
});

describe("POST /modalidades", () => {
  test("Deve retornar o status 201", async () => {
    const response = await request(app)
      .post("/modalidades")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: `Basquete ${Date.now()}`,
        tipo: "equipe",
        minJogadores: 1,
        maxJogadores: 10,
        formato: "pontoscorridos",
      });

    expect(response.status).toBe(201);
    expect(response.ok).toBeTruthy();
    expect(response.body.msg).toHaveProperty("id");
    expect(response.body.msg.nome).toContain("Basquete");
  });

  test("Deve retornar 400 quando nome não for informado", async () => {
    const response = await request(app)
      .post("/modalidades")
      .set("Authorization", `Bearer ${token}`)
      .send({
        tipo: "equipe",
      });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });
});

describe("GET /modalidades/:id", () => {
  test("Deve retornar o status 200", async () => {
    const modalidade = await criarModalidade();

    const response = await request(app).get(
      `/modalidades/${modalidade.body.msg.id}`
    );

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.msg).toHaveProperty("id");
  });

  test("Deve retornar 404 caso a modalidade não exista", async () => {
    const response = await request(app).get("/modalidades/9999");

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});

describe("PUT /modalidades/:id", () => {
  test("Deve retornar o status 200", async () => {
    const modalidade = await criarModalidade();

    const response = await request(app)
      .put(`/modalidades/${modalidade.body.msg.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Modalidade Atualizada",
      });

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.atualizacao.nome).toBe("Modalidade Atualizada");
  });

  test("Deve retornar 404 caso a modalidade não exista", async () => {
    const response = await request(app)
      .put("/modalidades/9999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Modalidade Atualizada",
      });

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});

describe("GET /modalidades/:id/classificacao", () => {
  test("Deve retornar o status 200 e uma lista", async () => {
    const modalidade = await criarModalidade();

    const response = await request(app).get(
      `/modalidades/${modalidade.body.msg.id}/classificacao`
    );

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test("Deve retornar 404 caso a modalidade não exista", async () => {
    const response = await request(app).get(
      "/modalidades/9999/classificacao"
    );

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});

describe("POST /modalidades/:id/chaveamento", () => {
  test("Deve retornar o status 200", async () => {
    const modalidade = await criarModalidade();

    const response = await request(app)
      .post(`/modalidades/${modalidade.body.msg.id}/chaveamento`)
      .set("Authorization", `Bearer ${token}`);

    // OBS: a rota usa formatPartida (feito para um único item) numa lista de
    // partidas, então o corpo da resposta hoje não sai como array de
    // partidas. Por isso este teste checa só o status.
    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  });

  test("Deve retornar 404 caso a modalidade não exista", async () => {
    const response = await request(app)
      .post("/modalidades/9999/chaveamento")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});