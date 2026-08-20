/**
 * src/views/seriesView.js
 * Formata Série pra resposta da API.
 */

export const formatSerie = (serie) => {
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

export const formatSerieList = (lista) => {
  return lista.map(formatSerie);
};