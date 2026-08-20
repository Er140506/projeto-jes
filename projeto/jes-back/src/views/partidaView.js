/**
 * src/views/partidaView.js
 * Formata Partida pra resposta da API (limpa dados pesados ou internos do banco).
 * Reaproveita formatEquipe para formatar os dados dos times A e B com segurança.
 */

import { formatEquipe } from "./equipesViews.js";

// Formata um único objeto de partida, extraindo somente o que a tela do celular vai usar.
export const formatPartida = (partida) => {
  // Transforma o dado do banco (Sequelize) em um objeto puro, se necessário. Se já for puro, mantém.
  const p = partida.get ? partida.get({ plain: true }) : partida;
  
  // Retorna o objeto enxuto e seguro para o front-end.
  return {
    id: p.id,
    modalidadeId: p.modalidadeId,
    formato: p.formato,
    rodada: p.rodada,
    faseNome: p.faseNome,
    slot: p.slot,
    timeAId: p.timeAId,
    timeBId: p.timeBId,
    // Se existir o time A, formata ele chamando a outra view; se não, retorna null.
    timeA: p.timeA ? formatEquipe(p.timeA) : null,
    // Mesma lógica para o time B.
    timeB: p.timeB ? formatEquipe(p.timeB) : null,
    placarA: p.placarA,
    placarB: p.placarB,
    status: p.status,
    data: p.data,
    hora: p.hora,
    local: p.local,
    duracao: p.duracao,
    iniciadaEm: p.iniciadaEm,
    nextMatchId: p.nextMatchId,
    nextMatchSlot: p.nextMatchSlot,
  };
};

// Pega uma lista de partidas e aplica a formatação em cada item usando o .map() de forma rápida.
export const formatPartidaList = (lista) => {
  return lista.map(formatPartida);
};
