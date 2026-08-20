import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false, // Garante um arquivo por vez
    sequence: {
      concurrent: false,   // Garante que testes internos também não rodem juntos
    },
    singleThread: true,    // Executa tudo na mesma linha de processo para não encavalar conexões
  },
});
