# ATM Banco24Hrs

Sistema de caixa eletrônico desenvolvido em Node.js com interface via terminal.

## Funcionalidades

- Criar conta com PIN de segurança
- Consultar saldo
- Realizar depósitos
- Efetuar saques
- Visualizar extrato de transações
- Sistema de logs para todas as operações
- Validações de segurança
- Interface amigável no terminal

## Requisitos

- Node.js (versão 12 ou superior)
- NPM (Node Package Manager)

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Como Usar

1. Inicie o sistema:
```bash
npm start
```

2. Siga as instruções no terminal para:
   - Criar uma nova conta
   - Acessar sua conta existente
   - Realizar operações bancárias

## Segurança

- PIN de 4 dígitos criptografado
- Validação de todas as entradas
- Registro de todas as operações
- Limites de valores para transações

## Estrutura do Projeto

- `index.js`: Arquivo principal com a interface do usuário
- `src/config/constants.js`: Configurações e constantes do sistema
- `src/services/accountService.js`: Serviço de gerenciamento de contas
- `Contas/`: Diretório com dados das contas
- `Logs/`: Registros de operações
- `Historico/`: Histórico detalhado de transações