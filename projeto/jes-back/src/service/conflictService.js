// Converte horário "HH:MM" em minutos totais do dia
export const paraMinutos = (hora) => {
  const [horas, minutos] = hora.split(':').map(Number);
  return horas * 60 + minutos;
};

// Verifica se duas partidas acontecem na mesma data e local
const mesmoLocalEDia = (p1, p2) => {
  return p1.data === p2.data && p1.local === p2.local;
};

// Evita conflito com a própria partida caso seja uma edição
const mesmaPartida = (p1, p2) => {
  return p1.id === p2.id;
};

// A mágica matemática de sobreposição de horários
const horariosColidem = (inicioA, fimA, inicioB, fimB) => {
  return inicioA < fimB && inicioB < fimA;
};

// Função principal limpa e legível
export const verificarConflito = (partidas, candidata) => {
  const inicioCandidata = paraMinutos(candidata.hora);
  const fimCandidata = inicioCandidata + (candidata.duracao || 30);

  return partidas.find((partida) => {
    if (mesmaPartida(partida, candidata)) return false;
    if (!mesmoLocalEDia(partida, candidata)) return false;

    const inicioPartida = paraMinutos(partida.hora);
    const fimPartida = inicioPartida + (partida.duracao || 30);

    return horariosColidem(inicioCandidata, fimCandidata, inicioPartida, fimPartida);
  }) || null;
};

//tets

