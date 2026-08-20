import { DataTypes } from "sequelize";
import { conexao } from "../config/conexao.js";
import { modalidadeModel } from "./modalidades.js";
import { equipeModel } from "./equipe.js";

export const partidasModel = conexao.define(
    "partidas",
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
        formato: {
            type: DataTypes.ENUM('pontoscorridos', 'eliminatoria'),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['pontoscorridos', 'eliminatoria']],
                    msg: "Formato inválido. Escolha 'pontoscorridos' ou 'eliminatoria'."
                }
            }
        },
        rodada: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: { msg: "A rodada deve ser um número inteiro." },
                min: { args:[1], msg: "A rodada deve ser no mínimo 1." }
            }
        },
        faseNome: {
            type: DataTypes.STRING(60),
            allowNull: false,
            field: 'fase_nome',
            validate: {
                notEmpty: { msg: "O nome da fase não pode ser vazio (ex: 'Fase de Grupos', 'Quartas de Final')." }
            }
        },
        slot: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: { msg: "O slot deve ser um número inteiro." }
            }
        },
        timeAId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: equipeModel, key: "id" }
        },
        timeBId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: equipeModel, key: "id" }
        },
        placarA: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: { msg: "O placar do Time A deve ser um número inteiro." },
                min: { args: [0], msg: "O placar do Time A não pode ser negativo." }
            }
        },
        placarB: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: { msg: "O placar do Time B deve ser um número inteiro." },
                min: {
                     args: [0],
                     msg: "O placar do Time B não pode ser negativo."
                    }
            }
        },
        status: {
            type: DataTypes.ENUM('agendado', 'ao_vivo', 'finalizado'),
            allowNull: false,
            defaultValue: 'agendado',
            validate: {
                isIn: {
                    args: [['agendado', 'ao_vivo', 'finalizado']],
                    msg: "Status inválido. Use 'agendado', 'ao_vivo' ou 'finalizado'."
                }
            }
        },
        data: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        hora: {
            type: DataTypes.TIME,
            allowNull: true
        },
        local: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        duracao: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: { args: [1], msg: "A duração da partida deve ser de pelo menos 1 minuto." }
            }
        },
        iniciadaEm: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'iniciada_em'
        },
        proximaPartidaId: { 
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'proxima_partida_id', 
            references: { model: "partidas", key: "id" }
        },
        proximaPartidaVaga: { 
            type: DataTypes.ENUM('A', 'B'),
            allowNull: true,
            field: 'proxima_partida_vaga',
            validate: {
                isIn: {
                    args: [['A', 'B']],
                    msg: "A vaga da próxima partida deve ser 'A' ou 'B'."
                }
            }
        }
    }
);