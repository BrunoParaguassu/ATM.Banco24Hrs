// Constantes do sistema
module.exports = {
    // Mensagens
    MESSAGES: {
        WELCOME: 'Bem Vindo! Banco do Brasil',
        GOODBYE: 'Obrigado por usar o Banco do Brasil!',
        ACCOUNT_EXISTS: 'Esta conta já existe, escolha outro nome!',
        ACCOUNT_NOT_FOUND: 'Esta conta não existe, escolha outra conta!',
        ACCOUNT_CREATED: 'Parabéns, sua conta foi criada!',
        INVALID_VALUE: 'Valor inválido. Por favor, insira um número positivo.',
        INSUFFICIENT_FUNDS: 'Saldo insuficiente para realizar a operação.',
        ERROR_TRY_AGAIN: 'Ocorreu um erro, tente novamente mais tarde!',
    },

    // Limites de transações
    LIMITS: {
        MAX_DEPOSIT: 50000,
        MAX_WITHDRAWAL: 5000,
        MIN_BALANCE: 0,
    },

    // Configurações de arquivo
    FILES: {
        ACCOUNTS_DIR: 'Contas',
        LOGS_DIR: 'Logs',
        TRANSACTION_HISTORY_DIR: 'Historico',
    },

    // Tipos de transações
    TRANSACTION_TYPES: {
        DEPOSIT: 'DEPOSITO',
        WITHDRAWAL: 'SAQUE',
        TRANSFER: 'TRANSFERENCIA',
    }
}
