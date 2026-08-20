
import {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
    DatabaseError
} from "sequelize"


// Função responsável por centralizar o tratamento dos erros.
export const tratarErro = (error, response) => {

    // Mostra o erro completo no terminal.
    // Isso ajuda durante o desenvolvimento.
    console.error("================================")
    console.error("ERRO:", error)
    console.error("MENSAGEM:", error.message)
    console.error("================================")


    // ==================================================
    // ERRO DE CAMPO ÚNICO
    // ==================================================
    //
    // Acontece quando tentamos cadastrar um valor
    // que deveria ser único, mas já existe.
    //
    // Exemplo:
    // duas modalidades com o mesmo nome,
    // caso nome tenha unique: true.
    //
    if (error instanceof UniqueConstraintError) {

        return response.status(409).json({
            msg: "Já existe um registro com esse valor"
        })
    }


    // ==================================================
    // ERRO DE VALIDAÇÃO
    // ==================================================
    //
    // Acontece quando alguma validação do Sequelize
    // não foi satisfeita.
    //
    // Exemplo:
    // allowNull: false
    // validate: { ... }
    //
    if (error instanceof ValidationError) {

        return response.status(400).json({
            msg: error.errors[0]?.message || "Dados inválidos"
        })
    }


    // ==================================================
    // ERRO DE CHAVE ESTRANGEIRA
    // ==================================================
    //
    // Acontece quando tentamos criar ou alterar um
    // registro usando um ID que não existe na tabela
    // relacionada.
    //
    // Exemplo:
    // modalidadeId = 999
    // mas a modalidade 999 não existe.
    //
    if (error instanceof ForeignKeyConstraintError) {

        return response.status(400).json({
            msg: "O registro informado possui uma referência inválida"
        })
    }


    // ==================================================
    // ERRO DO BANCO DE DADOS
    // ==================================================
    //
    // Trata erros relacionados diretamente ao banco.
    //
    if (error instanceof DatabaseError) {

        return response.status(500).json({
            msg: "Erro ao acessar o banco de dados"
        })
    }


    // ==================================================
    // ERRO DESCONHECIDO
    // ==================================================
    //
    // Se o erro não for nenhum dos anteriores,
    // consideramos um erro interno do servidor.
    //
    return response.status(500).json({
        msg: "Erro interno do servidor"
    })
}
