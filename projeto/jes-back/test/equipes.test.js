import { describe, test, expect, beforeAll } from "vitest";
import app from "../src/app.js";
import request from "supertest";
import { conexao } from "../src/config/conexao.js";

let token;
let modalidade;

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



const criarEquipe = async (dados = {}) => {
  return await request(app)
    .post("/equipes")
    .set("Authorization", `Bearer ${token}`)
    .send({
      nome: `Equipe ${Date.now()}${Math.random()}`,
      modalidadeId: modalidade.id,
      turma: "3A",
      jogadores: 5,
      ...dados,
    });
};

// EQUIPES

describe("GET /equipes", () => {
  test("Deve retornar o status 200 e uma lista", async () => {
    await criarEquipe();

    const response = await request(app).get("/equipes");

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});

describe("POST /equipes", () => {
  test("Deve retornar o status 201 e criar uma equipe", async () => {
    const response = await criarEquipe({
      nome: "Carlos e Wilton",
    });

    expect(response.status).toBe(201);
    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("id");
    expect(response.body.equipe.nome).toBe("Carlos e Wilton");
    expect(response.body.equipe.modalidade).toBeDefined();
  });

  test("Deve retornar 401 sem token", async () => {
    const response = await request(app)
      .post("/equipes")
      .send({
        nome: "Equipe sem token",
        modalidadeId: modalidade.id,
      });

    expect(response.status).toBe(401);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 400 sem nome", async () => {
    const response = await request(app)
      .post("/equipes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: modalidade.id,
      });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 404 quando a modalidade informada não existir", async () => {
    const response = await criarEquipe({
      modalidadeId: 9999,
    });

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});

describe("PUT /equipes/:id", () => {
  test("Deve retornar o status 200", async () => {
    const equipe = await criarEquipe();

    const response = await request(app)
      .put(`/equipes/${equipe.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Equipe Atualizada",
        modalidadeId: modalidade.id,
        turma: "4A",
        jogadores: 6,
      });

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.equipe.nome).toBe("Equipe Atualizada");
  });

  test("Deve retornar 404 caso a equipe não exista", async () => {
    const response = await request(app)
      .put("/equipes/9999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Equipe Atualizada",
        modalidadeId: modalidade.id,
      });

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 400 sem nome", async () => {
    const equipe = await criarEquipe();

    const response = await request(app)
      .put(`/equipes/${equipe.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        modalidadeId: modalidade.id,
      });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 400 sem modalidadeId", async () => {
    const equipe = await criarEquipe();

    const response = await request(app)
      .put(`/equipes/${equipe.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Equipe Atualizada",
      });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });
});

describe("PATCH /equipes/:id", () => {
  test("Deve retornar o status 200 atualizando somente um campo", async () => {
    const equipe = await criarEquipe();

    const response = await request(app)
      .patch(`/equipes/${equipe.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        turma: "3B",
      });

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body.equipe.turma).toBe("3B");
  });

  test("Deve retornar 400 quando nenhum campo for enviado", async () => {
    const equipe = await criarEquipe();

    const response = await request(app)
      .patch(`/equipes/${equipe.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 404 caso a equipe não exista", async () => {
    const response = await request(app)
      .patch("/equipes/9999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        turma: "3B",
      });

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});

describe("DELETE /equipes/:id", () => {
  test("Deve retornar o status 200", async () => {
    const equipe = await criarEquipe();

    const response = await request(app)
      .delete(`/equipes/${equipe.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
  });

  test("Deve retornar 404 caso a equipe não exista", async () => {
    const response = await request(app)
      .delete("/equipes/9999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.ok).toBeFalsy();
  });
});


