export const calcularClassificacao = (equipes, partidas, modalidadeId) => {
  // Cria um objeto vazio sem protótipo padrão, tornando a busca por ID mais rápida e leve na memória.
  const tabela = Object.create(null);

  // Percorre a lista de equipes para inicializar os dados de cada time na tabela com zero pontos e jogos.
  equipes.forEach((e) => {
    tabela[e.id] = {
      timeId: e.id,
      jogos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      pontosPro: 0,
      pontosContra: 0,
      pontos: 0,
    };
  });

  // Usa um loop tradicional 'for' (mais rápido em celulares) guardando o tamanho do array na variável 'len'.
  for (let i = 0, len = partidas.length; i < len; i++) {
    const p = partidas[i]; // Pega a partida atual da lista.
    
    // Se a partida não for desta modalidade, não estiver finalizada ou faltar placar, pula para a próxima (ignora).
    if (p.modalidadeId !== modalidadeId || p.status !== 'finalizado' || p.placarA == null || p.placarB == null) {
      continue;
    }

    // Busca os dados do time A e do time B dentro da nossa tabela.
    const a = tabela[p.timeAId];
    const b = tabela[p.timeBId];
    
    // Se algum dos times não existir na tabela (ex: foi excluído), pula essa partida.
    if (!a || !b) continue;

    // Adiciona +1 jogo para o histórico de ambas as equipes.
    a.jogos++;
    b.jogos++;
    
    // Atualiza os pontos marcados a favor (pro) e contra de cada time com base nos placares.
    a.pontosPro += p.placarA;
    a.pontosContra += p.placarB;
    b.pontosPro += p.placarB;
    b.pontosContra += p.placarA;

    // Verifica quem venceu, empatou ou perdeu para atualizar vitórias, derrotas e pontuação na tabela (3 pts vitória, 1 pt empate).
    if (p.placarA > p.placarB) {
      a.vitorias++;
      b.derrotas++;
      a.pontos += 3;
    } else if (p.placarB > p.placarA) {
      b.vitorias++;
      a.derrotas++;
      b.pontos += 3;
    } else {
      a.empates++;
      b.empates++;
      a.pontos++;
      b.pontos++;
    }
  }

  // Transforma o objeto da tabela em um array e ordena os times por: 1º Pontos, 2º Saldo de Gols/Pontos, 3º Gols Pró.
  return Object.values(tabela).sort((x, y) => {
    if (y.pontos !== x.pontos) return y.pontos - x.pontos; // Compara os pontos totais.
    const saldoX = x.pontosPro - x.pontosContra;          // Calcula o saldo do time X.
    const saldoY = y.pontosPro - y.pontosContra;          // Calcula o saldo do time Y.
    if (saldoY !== saldoX) return saldoY - saldoX;        // Compara os saldos.
    return y.pontosPro - x.pontosPro;                     // Desempate por pontos pró.
  });
};
