/**
 * src/views/equipeView.js
 * Formata Equipe pra resposta da API (mantém compatibilidade com Sequelize e equipes combinadas).
 */

export const formatSerieResumo = (serie) => {
  if (!serie) return null;
  const s = serie.get ? serie.get({ plain: true }) : serie;
  return {
    id: s.id,
    nome: s.nome,
    nivel: s.nivel,
    pais: s.pais,
    corPrimaria: s.corPrimaria,
    corSecundaria: s.corSecundaria,
  };
};

export const formatEquipe = (equipe) => {
  const e = equipe.get ? equipe.get({ plain: true }) : equipe;
  return {
    id: e.id,
    modalidadeId: e.modalidadeId,
    serieId: e.serieId,
    turma: e.turma,
    nome: e.nome,
    jogadores: e.jogadores,
    combinadaDe1Id: e.combinadaDe1Id,
    combinadaDe2Id: e.combinadaDe2Id,
    fundidaEmId: e.fundidaEmId,
    serie: e.serie ? formatSerieResumo(e.serie) : null,
    combinadaDe1: e.combinadaDe1 ? { id: e.combinadaDe1.id, nome: e.combinadaDe1.nome, serie: formatSerieResumo(e.combinadaDe1.serie) } : null,
    combinadaDe2: e.combinadaDe2 ? { id: e.combinadaDe2.id, nome: e.combinadaDe2.nome, serie: formatSerieResumo(e.combinadaDe2.serie) } : null,
  };
};

export const formatEquipeList = (lista) => {
  return lista.map(formatEquipe);
};
