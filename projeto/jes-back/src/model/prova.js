import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js";
import { modalidadeModel } from "./modalidades.js";

export const provaModel = conexao.define(
    "prova",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        modalidadeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'modalidade_id',
            references: {
                model: modalidadeModel,
                key: "id"
            }
        },
        nome: {
            type: DataTypes.STRING(80),
            allowNull: false,
            validate: {
                notEmpty: { msg: "O nome da prova não pode ser vazio." },
                len: {
                    args:[3,80],
                    msg: "O nome da prova deve ter entre 3 e 80 caracteres."
                }
            }
        },
        tipoMarca: {
            type: DataTypes.ENUM('menor', 'maior'),
            allowNull: false,
            defaultValue: 'menor',
            field: 'tipo_marca',
            validate: {
                isIn: {
                    args: [['menor', 'maior']],
                    msg: "O tipo de marca deve ser obrigatoriamente 'menor' ou 'maior'."
                }
            }
        }
    }
);
