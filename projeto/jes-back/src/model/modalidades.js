import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js";

export const modalidadeModel = conexao.define(
    "modalidades",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true, // Evita modalidades duplicadas (ex: dois "Futebol")
            validate: {
                notEmpty: { msg: "O nome da modalidade não pode ser vazio." },
                len: {
                    args:[2,60],
                    msg: "O nome deve ter entre 2 e 60 caracteres."
                }
            }
        },
        emoji: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: '',
            validate: {
                // Garante que se for preenchido, não passe de 10 caracteres (bom para conter o emoji)
                len: {
                    args:[0,10],
                    msg: "O campo emoji deve ter no máximo 10 caracteres."
                }
            }
        },
        tipo: {
            type: DataTypes.ENUM('equipe', 'individual'),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['equipe', 'individual']],
                    msg: "O tipo deve ser obrigatoriamente 'equipe' ou 'individual'."
                }
            }
        },
        minJogadores: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                isInt: { msg: "O mínimo de jogadores deve ser um número inteiro." },
                min: {
                    args:[1],
                    msg: "O mínimo de jogadores deve ser pelo menos 1."
                }
            }
        },
        maxJogadores: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                isInt: { msg: "O máximo de jogadores deve ser um número inteiro." },
                min: {
                    args:[1],
                    msg: "O máximo de jogadores deve ser pelo menos 1."
                }
            }
        },
        formato: {
            type: DataTypes.ENUM('pontoscorridos', 'eliminatoria', 'ranking'),
            allowNull: false,
            defaultValue: 'pontoscorridos',
            validate: {
                isIn: {
                    args: [['pontoscorridos', 'eliminatoria', 'ranking']],
                    msg: "Formato inválido. Escolha entre pontoscorridos, eliminatoria ou ranking."
                }
            }
        },
        duracaoPadrao: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: { msg: "A duração padrão (em minutos) deve ser um número inteiro." },
                min: {
                    args:[1],
                    msg: "A duração padrão deve ser de pelo menos 1 minuto."
                }
            }
        },
        minDinamico: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        ranking: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }
);
