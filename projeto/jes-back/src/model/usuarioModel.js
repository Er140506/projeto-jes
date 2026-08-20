import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js"

export const usuarioModel = conexao.define(
    "usuarios",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O nome é obrigatório"
                },
                len: {
                    args: [3, 100],
                    msg: "O nome deve possuir 3 e 100 caracteres"
                }
            }
        },
        email: {
            type: DataTypes.STRING(160),
            allowNull: false,
            unique: {
                msg: "Já existe um usuário cadastrado com esse e-mail"
            },
            validate: {
                notEmpty: {
                    msg: "O e-mail é obrigatório"
                },
                isEmail: {
                    msg: "Informe um e-mail válido"
                }
            }
        },
        senha: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "A senha é obrigatória"
                },
                len: {
                    args: [8, 100],
                    msg: "A senha deve ter entre 8 e 100 caracteres"
                }
            }
        },
        // Todo usuário cadastrado é professor (aluno não tem conta - só acompanha os
        // jogos pelas rotas de leitura). O campo fica salvo mesmo assim porque é ele
        // que o middleware "permitirProfessor" usa para liberar as rotas de escrita.
        tipo: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "professor"
        },
    }
)