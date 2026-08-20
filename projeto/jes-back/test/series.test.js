import { describe, test, expect, beforeAll } from "vitest";
import app from "../src/app.js";
import request from "supertest";
import jwt from "jsonwebtoken";
import { conexao } from "../src/config/conexao.js";

beforeAll(async () => {
  await conexao.sync({ force: true });
});

// Gera um payload de registro único a cada chamada, evitando conflito de email
const dadosRegistro = (dados = {}) => ({
  nome: "Professor Teste",
  email: `professor${Date.now()}${Math.random()}@email.com`,
  senha: "123456789",
  codigoProfessor: process.env.CODIGO_PROFESSOR,
  ...dados,
});

describe("POST /auth/registrar", () => {
  test("Deve retornar 201 e um token ao registrar um usuário válido", async () => {
    const response = await request(app)
      .post("/auth/registrar")
      .send(dadosRegistro());

    expect(response.status).toBe(201);
    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    expect(response.body.usuario).toHaveProperty("id");
    expect(response.body.usuario).not.toHaveProperty("senha");
  });

  test("O token retornado deve ser um JWT válido e conter os dados do usuário", async () => {
    const registro = dadosRegistro();
    const response = await request(app).post("/auth/registrar").send(registro);

    const payload = jwt.verify(response.body.token, process.env.JWT_SECRET);

    expect(payload.id).toBe(response.body.usuario.id);
    expect(payload.email).toBe(registro.email.toLowerCase());
    expect(payload.tipo).toBe("professor");
  });

  test("Deve retornar 400 quando o nome não for informado", async () => {
    const { nome, ...resto } = dadosRegistro();

    const response = await request(app).post("/auth/registrar").send(resto);

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 400 quando o email não for informado", async () => {
    const { email, ...resto } = dadosRegistro();

    const response = await request(app).post("/auth/registrar").send(resto);

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 400 quando a senha tiver menos de 8 caracteres", async () => {
    const response = await request(app)
      .post("/auth/registrar")
      .send(dadosRegistro({ senha: "123" }));

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 403 quando o codigoProfessor não for informado", async () => {
    const { codigoProfessor, ...resto } = dadosRegistro();

    const response = await request(app).post("/auth/registrar").send(resto);

    expect(response.status).toBe(403);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 403 quando o codigoProfessor for incorreto", async () => {
    const response = await request(app)
      .post("/auth/registrar")
      .send(dadosRegistro({ codigoProfessor: "codigo-invalido-123" }));

    expect(response.status).toBe(403);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 409 quando o email já estiver cadastrado", async () => {
    const registro = dadosRegistro();

    await request(app).post("/auth/registrar").send(registro);
    const response = await request(app).post("/auth/registrar").send(registro);

    expect(response.status).toBe(409);
    expect(response.ok).toBeFalsy();
  });
});

describe("POST /auth/login", () => {
  test("Deve retornar 200 e um token ao logar com credenciais corretas", async () => {
    const registro = dadosRegistro();
    await request(app).post("/auth/registrar").send(registro);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: registro.email, senha: registro.senha });

    expect(response.status).toBe(200);
    expect(response.ok).toBeTruthy();
    expect(response.body).toHaveProperty("token");
  });

  test("O token do login deve ser válido e decodificável", async () => {
    const registro = dadosRegistro();
    await request(app).post("/auth/registrar").send(registro);

    const login = await request(app)
      .post("/auth/login")
      .send({ email: registro.email, senha: registro.senha });

    const payload = jwt.verify(login.body.token, process.env.JWT_SECRET);
    expect(payload.email).toBe(registro.email.toLowerCase());
  });

  test("Deve aceitar o email com letras maiúsculas e espaços (normalização)", async () => {
    const registro = dadosRegistro();
    await request(app).post("/auth/registrar").send(registro);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: `  ${registro.email.toUpperCase()}  `, senha: registro.senha });

    expect(response.status).toBe(200);
  });

  test("Deve retornar 400 quando o email não for informado", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ senha: "123456789" });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 400 quando a senha não for informada", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "professor@email.com" });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 401 quando o email não estiver cadastrado", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "naoexiste@email.com", senha: "123456789" });

    expect(response.status).toBe(401);
    expect(response.ok).toBeFalsy();
  });

  test("Deve retornar 401 quando a senha estiver incorreta", async () => {
    const registro = dadosRegistro();
    await request(app).post("/auth/registrar").send(registro);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: registro.email, senha: "senhaErrada123" });

    expect(response.status).toBe(401);
    expect(response.ok).toBeFalsy();
  });
});

describe("Validação do token (authMiddleware)", () => {
  // Usa a rota POST /modalidades como referência, pois é protegida pelo authMiddleware
  const rotaProtegida = "/modalidades";
  const corpoValido = () => ({
    nome: `Modalidade ${Date.now()}${Math.random()}`,
    tipo: "individual",
    minJogadores: 1,
    maxJogadores: 10,
    formato: "ranking",
  });

  test("Deve retornar 401 quando nenhum token for enviado", async () => {
    const response = await request(app).post(rotaProtegida).send(corpoValido());

    expect(response.status).toBe(401);
    expect(response.body.msg).toMatch(/token/i);
  });

  test("Deve retornar 401 quando o header Authorization não seguir o padrão 'Bearer <token>'", async () => {
    const registro = dadosRegistro();
    const usuario = await request(app).post("/auth/registrar").send(registro);

    const response = await request(app)
      .post(rotaProtegida)
      .set("Authorization", usuario.body.token) // sem o prefixo "Bearer "
      .send(corpoValido());

    expect(response.status).toBe(401);
  });

  test("Deve retornar 401 quando o token for inválido/adulterado", async () => {
    const response = await request(app)
      .post(rotaProtegida)
      .set("Authorization", "Bearer token.invalido.aqui")
      .send(corpoValido());

    expect(response.status).toBe(401);
    expect(response.body.msg).toMatch(/inválido|expirado/i);
  });

  test("Deve retornar 401 quando o token estiver expirado", async () => {
    const tokenExpirado = jwt.sign(
      { id: 1, email: "professor@email.com", tipo: "professor" },
      process.env.JWT_SECRET,
      { expiresIn: -10 } // já expirado
    );

    const response = await request(app)
      .post(rotaProtegida)
      .set("Authorization", `Bearer ${tokenExpirado}`)
      .send(corpoValido());

    expect(response.status).toBe(401);
  });

  test("Deve retornar 401 quando o token for assinado com um segredo diferente", async () => {
    const tokenForjado = jwt.sign(
      { id: 1, email: "professor@email.com", tipo: "professor" },
      "segredo-errado-nao-confere",
      { expiresIn: "1h" }
    );

    const response = await request(app)
      .post(rotaProtegida)
      .set("Authorization", `Bearer ${tokenForjado}`)
      .send(corpoValido());

    expect(response.status).toBe(401);
  });

  test("Deve permitir o acesso quando o token for válido", async () => {
    const registro = dadosRegistro();
    const usuario = await request(app).post("/auth/registrar").send(registro);

    const response = await request(app)
      .post(rotaProtegida)
      .set("Authorization", `Bearer ${usuario.body.token}`)
      .send(corpoValido());

    expect(response.status).toBe(201);
  });
});