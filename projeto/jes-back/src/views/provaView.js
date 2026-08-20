/**
 * src/views/provaView.js
 * Formata Prova e seus Resultados para a resposta da API, limpando dados do banco.
 */

import { formatEquipe } from "./equipesViews.js";

// Formata um único resultado de uma prova específica
export const formatResultado = (resultado) => {
  // Transforma o dado do banco (Sequelize) em objeto puro, se necessário.
  const r = resultado.get ? resultado.get({ plain: true }) : resultado;
  
  // Retorna os dados essenciais do resultado e formata a equipe vinculada, se houver.
  return {
    id: r.id,
    provaId: r.provaId,
    equipeId: r.equipeId,
    //w
    // Converte a 'marca' (pontuação/tempo) para número caso ela não seja nula.
    marca: r.marca != null ? Number(r.marca) : null,
    // Se houver dados da equipe, chama a view correspondente; senão, retorna null.
    equipe: r.equipe ? formatEquipe(r.equipe) : null,
  };
};

// Formata uma prova e mapeia todos os resultados relacionados a ela
export const formatProva = (prova) => {
  // Transforma o objeto do banco (Sequelize) em um objeto puro, se necessário.
  const p = prova.get ? prova.get({ plain: true }) : prova;
  
  // Retorna o objeto limpo da prova, verificando se 'resultados' é um array para rodar o map com segurança.
  return {
    id: p.id,
    modalidadeId: p.modalidadeId,
    nome: p.nome,
    tipoMarca: p.tipoMarca,
    resultados: Array.isArray(p.resultados) ? p.resultados.map(formatResultado) : [],
  };
};

// Pega uma lista inteira de provas e formata item por item rapidamente.
export const formatProvaList = (lista) => {
  return lista.map(formatProva);
};
