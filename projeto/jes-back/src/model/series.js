import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js";

export const seriesModel = conexao.define(
    "series",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true, // Impede a criação de duas séries com o mesmo nome (ex: duas "Série A")
            validate: {
                notEmpty: { msg: "O nome da série não pode ser vazio." },
                len: {
                    args:[2,60],
                    msg: "O nome da série deve ter entre 2 e 60 caracteres."
                }
            }
        },
        nivel: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: {
                len: {
                    args:[2,30],
                    msg: "O nível deve ter entre 2 e 30 caracteres se for preenchido."
                }
            }
        },
        pais: {
            type: DataTypes.STRING(60),
            allowNull: true,
            validate: {
                len: {
                    args:[2,60],
                    msg: "O nome do país deve ter entre 2 e 60 caracteres."
                }
            }
        },
        corPrimaria: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'cor_primaria',
            validate: {
                // Garante que seja um código Hexadecimal válido (ex: #FFF, #000000, #ff33a1)
                is: {
                    args: /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
                    msg: "A cor primária deve ser um código hexadecimal válido (ex: #FFFFFF)."
                }
            }
        },
        corSecundaria: {
            type: DataTypes.STRING(10),
            allowNull: true,
            field: 'cor_secundaria',
            validate: {
                // Mesma validação de cor hexadecimal
                is: {
                    args: /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
                    msg: "A cor secundária deve ser um código hexadecimal válido (ex: #000000)."
                }
            }
        },
    }
);
