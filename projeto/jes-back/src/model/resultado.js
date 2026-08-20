import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js";
import { equipeModel } from "./equipe.js";
import { provaModel } from "./prova.js";

export const resultadoModel = conexao.define(
    "resultado",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        provaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'prova_id',
            references: {
                model: provaModel,
                key: "id"
            }
        },
        equipeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'equipe_id',
            references: {
                model: equipeModel,
                key: "id"
            }
        },
        marca: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: { msg: "A marca deve ser um número decimal válido." },
                min: {
                    args: [0.01],
                    msg: "A marca deve ser um valor maior do que zero."
                }
            }
        }
    },
    {
        // 1. Índice de Unicidade Composto:
        // Garante que uma equipe só tenha UM resultado por prova.
        indexes: [
            {
                unique: true,
                fields: ['prova_id', 'equipe_id'],
                name: 'unique_equipe_por_prova'
            }
        ]
    }
);
