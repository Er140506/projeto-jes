import{equipeModel}from"./equipe.js"
import{modalidadeModel}from"./modalidades.js"
import{partidasModel}from"./partidas.js"
import{provaModel}from"./prova.js"
import{resultadoModel}from"./resultado.js"
import{seriesModel}from"./series.js"
import { usuarioModel } from "./usuarioModel.js"



// Série <-> Equipe
seriesModel.hasMany(equipeModel, { foreignKey: 'serieId', as:"equipes" });
equipeModel.belongsTo(seriesModel, { foreignKey: 'serieId',as:"series" });

// Modalidade <-> Equipe
modalidadeModel.hasMany(equipeModel, { foreignKey: 'modalidadeId', as: 'equipes' });
equipeModel.belongsTo(modalidadeModel, { foreignKey: 'modalidadeId', as: 'modalidade' });

// Modalidade <-> Partida
modalidadeModel.hasMany(partidasModel, { foreignKey: 'modalidadeId', as: 'partidas' });
partidasModel.belongsTo(modalidadeModel, { foreignKey: 'modalidadeId', as: 'modalidade' });

// Equipe <-> Partida (duas relações: time A e time B)
equipeModel.hasMany(partidasModel, { foreignKey: 'timeAId', as: 'partidasComoTimeA' });
equipeModel.hasMany(partidasModel, { foreignKey: 'timeBId', as: 'partidasComoTimeB' });

partidasModel.belongsTo(equipeModel, { foreignKey: 'timeAId', as: 'timeA' });
partidasModel.belongsTo(equipeModel, { foreignKey: 'timeBId', as: 'timeB' });


// Partida -> Partida (para onde o vencedor avança no mata-mata)
partidasModel.belongsTo(partidasModel, { foreignKey: 'proximaPartidaId', as: 'proximaPartida' });
partidasModel.hasMany(partidasModel, { foreignKey: 'proximaPartidaId', as: 'partidasAnteriores' });

// Equipe -> Equipe (fusão de equipes por falta de jogadores)
equipeModel.belongsTo(equipeModel, { foreignKey: 'combinadaDe1Id', as: 'combinadaDe1' });
equipeModel.belongsTo(equipeModel, { foreignKey: 'combinadaDe2Id', as: 'combinadaDe2' });

equipeModel.belongsTo(equipeModel, { foreignKey: 'fundidaEmId', as: 'juntarequipe' });
equipeModel.hasMany(equipeModel, { foreignKey: 'fundidaEmId', as: 'equipesOrigem' });

// Modalidade <-> Prova (Atletismo)
modalidadeModel.hasMany(provaModel, { foreignKey: 'modalidadeId', as: 'provas' });
provaModel.belongsTo(modalidadeModel, { foreignKey: 'modalidadeId', as: 'modalidade' });


// Prova <-> Resultado / Equipe <-> Resultado
provaModel.hasMany(resultadoModel, { foreignKey: 'provaId', as: 'resultados' });
resultadoModel.belongsTo(provaModel, { foreignKey: 'provaId', as: 'prova' });
equipeModel.hasMany(resultadoModel, { foreignKey: 'equipeId', as: 'resultados' });
resultadoModel.belongsTo(equipeModel, { foreignKey: 'equipeId', as: 'equipe' });



export {equipeModel, partidasModel ,resultadoModel ,provaModel ,seriesModel ,modalidadeModel, usuarioModel}