/**
 * src/services/bracketServiceConst.js
 * ===================================================================
 * Abordagem funcional usando const e arrow functions.
 * Mantém a lógica pura e isolada, sem efeitos colaterais externos.
 * ===================================================================
 */

const criarGeradorIdTemp = () => {
  let contadorTemp = 0;
  return () => {
    contadorTemp += 1;
    return `tmp_${contadorTemp}_${Math.random().toString(36).slice(2, 8)}`;
  };
};

const idTemporario = criarGeradorIdTemp();

const embaralhar = (lista) => {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copia[i];
    copia[i] = copia[j];
    copia[j] = tmp;
  }
  return copia;
};

 const nomeDaFase = (numeroRodada, totalRodadas) => {
  const restantes = totalRodadas - numeroRodada;
  if (restantes === 0) return 'Final';
  if (restantes === 1) return 'Semifinal';
  if (restantes === 2) return 'Quartas de Final';
  if (restantes === 3) return 'Oitavas de Final';
  return `Rodada ${numeroRodada}`;
};

export const gerarPontosCorridos = (equipes, modalidadeId) => {
  const arr = equipes.map(e => e.id);
  if (arr.length < 2) return [];
  if (arr.length % 2 !== 0) arr.push(null);
  const n = arr.length;
  const totalRodadas = n - 1;
  const partidas = [];
  const rot = [...arr];

  for (let r = 0; r < totalRodadas; r++) {
    for (let i = 0; i < n / 2; i++) {
      const a = rot[i];
      const b = rot[n - 1 - i];
      if (a && b) {
        partidas.push({
          id: idTemporario(),
          modalidadeId,
          formato: 'pontoscorridos',
          rodada: r + 1,
          faseNome: `Rodada ${r + 1}`,
          timeAId: a,
          timeBId: b,
          status: 'agendado',
          nextMatchId: null,
          nextMatchSlot: null,
          slot: null,
        });
      }
    }
    rot.splice(1, 0, rot.pop());
  }
  return partidas;
};

 const resolverByesDaPrimeiraRodada = (primeiraRodada, mapaPartidas) => {
  for (const partida of primeiraRodada) {
    const temA = !partida.timeAId;
    const temB = !partida.timeBId;
    if (temA !== temB && partida.nextMatchId) {
      const vencedorId = temA ? partida.timeAId : partida.timeBId;
      partida.status = 'bye';
      const proxima = mapaPartidas.get(partida.nextMatchId);
      if (proxima) {
        if (partida.nextMatchSlot === 'A') proxima.timeAId = vencedorId;
        else proxima.timeBId = vencedorId;
      }
    }
  }
};

export const gerarEliminatoria = (equipes, modalidadeId) => {
  const n = equipes.length;
  if (n < 2) return [];
  const tamanho = Math.pow(2, Math.ceil(Math.log2(n)));
  const totalRodadas = Math.log2(tamanho);
  const preenchido = embaralhar(equipes);
  while (preenchido.length < tamanho) preenchido.push(null);

  const rodadas = [];
  for (let r = 0; r < totalRodadas; r++) {
    const numPartidas = tamanho / Math.pow(2, r + 1);
    const rodadaAtual = [];
    for (let i = 0; i < numPartidas; i++) {
      rodadaAtual.push({
        id: idTemporario(),
        modalidadeId,
        formato: 'eliminatoria',
        rodada: r + 1,
        faseNome: nomeDaFase(r + 1, totalRodadas),
        slot: i,
        timeAId: null,
        timeBId: null,
        status: 'agendado',
        nextMatchId: null,
        nextMatchSlot: null,
      });
    }
    rodadas.push(rodadaAtual);
  }

  for (let r = 0; r < totalRodadas - 1; r++) {
    rodadas[r].forEach((partida, i) => {
      const proxima = rodadas[r + 1][Math.floor(i / 2)];
      partida.nextMatchId = proxima.id;
      partida.nextMatchSlot = i % 2 === 0 ? 'A' : 'B';
    });
  }

  rodadas[0].forEach((partida, i) => {
    const timeA = preenchido[i];
    const timeB = preenchido[tamanho - 1 - i];
    partida.timeAId = timeA ? timeA.id : null;
    partida.timeBId = timeB ? timeB.id : null;
  });

 const mapa = new Map(rodadas.flat().map(p => [p.id, p]));
  resolverByesDaPrimeiraRodada(rodadas[0], mapa);
  return Array.from(mapa.values());
};

 export const propagarVencedor = (partidas, partidaId) => {
  const mapa = new Map(partidas.map(p => [p.id, { ...p }]));
  const partida = mapa.get(partidaId);
  
  if (!partida || partida.status !== 'finalizado' || partida.placarA == null || partida.placarB == null || partida.placarA === partida.placarB) {
    return Array.from(mapa.values());
  }

  const vencedorId = partida.placarA > partida.placarB ? partida.timeAId : partida.timeBId;

  if (partida.nextMatchId) {
    const proxima = mapa.get(partida.nextMatchId);
    if (proxima) {
      if (partida.nextMatchSlot === 'A') proxima.timeAId = vencedorId;
      else proxima.timeBId = vencedorId;
    }
  }

  return Array.from(mapa.values());
};



