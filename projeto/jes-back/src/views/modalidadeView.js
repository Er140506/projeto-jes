/**
 * Formata um único objeto de modalidade, removendo sujeiras do banco de dados 
 * e deixando apenas os campos essenciais que o aplicativo precisa.
 */
export const formatModalidade = (modalidade) => {
  // Verifica se o dado veio do Sequelize (banco) usando '.get()'. Se sim, transforma em um objeto JavaScript puro ('plain: true'). Se já for puro, mantém como está.
  const m = modalidade.get ? modalidade.get({ plain: true }) : modalidade;
  
  // Retorna um objeto novo contendo apenas as propriedades estritamente necessárias para a interface do celular.
  return {
    id: m.id,
    nome: m.nome,
    emoji: m.emoji,
    tipo: m.tipo,
    minJogadores: m.minJogadores,
    maxJogadores: m.maxJogadores,
    formato: m.formato,
    duracaoPadrao: m.duracaoPadrao,
    minDinamico: !!m.minDinamico, // O '!!' garante que o valor seja rigorosamente verdadeiro (true) ou falso (false).
    ranking: !!m.ranking,
  };
};

/**
 * Pega uma lista inteira de modalidades e aplica a formatação em cada item de forma rápida usando o '.map()'.
 */
export const formatModalidadeList = (lista) => {
  return lista.map(formatModalidade);
};
