import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js"
import { modalidadeModel } from "./modalidades.js";
import { seriesModel } from "./series.js";

export const equipeModel = conexao.define(
    "equipes",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        modalidadeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: modalidadeModel, key: "id" }
        },
        serieId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: seriesModel, key: "id" }
        },
        turma: {
            type: DataTypes.STRING(10),
            allowNull: true,
            validate: {
                len: {
                    args:[1,10],
                    msg: "A turma deve ter entre 1 e 10 caracteres."
                }
            }
        },
        nome: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                notEmpty: { msg: "O nome da equipe não pode ser vazio." },
                len: {
                    args:[3,120],
                    msg: "O nome da equipe deve ter entre 3 e 120 caracteres."
                }
            }
        },
        jogadores: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isInt: { msg: "O número de jogadores deve ser um número inteiro." },
                min: {
                    args:[1],
                    msg: "A quantidade de jogadores não pode ser negativa."
                },
                max: {
                    args:[15], // Ajuste conforme a regra do seu campeonato
                    msg: "Quantidade de jogadores excede o limite máximo permitido."
                }
            }
        },
        combinadaDe1Id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "combinada_de_1_id"
        },
        combinadaDe2Id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "combinada_de_2_id"
        },
        fundidaEmId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }
);
