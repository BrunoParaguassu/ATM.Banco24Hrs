const inquirer = require('inquirer');
const chalk = require('chalk');
const { MESSAGES } = require('./src/config/constants');
const accountService = require('./src/services/accountService');

async function operation() {
    try {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: chalk.bgYellow.green(MESSAGES.WELCOME),
                choices: [
                    'Criar Conta',
                    'Consultar Saldo',
                    'Depositar',
                    'Sacar',
                    'Extrato',
                    'Sair'
                ]
            }
        ]);

        switch (action) {
            case 'Criar Conta':
                await createAccount();
                break;
            case 'Consultar Saldo':
                await checkBalance();
                break;
            case 'Depositar':
                await deposit();
                break;
            case 'Sacar':
                await withdraw();
                break;
            case 'Extrato':
                await getStatement();
                break;
            case 'Sair':
                console.log(chalk.bgBlue.black(MESSAGES.GOODBYE));
                process.exit();
        }
    } catch (error) {
        console.error(chalk.red(error.message));
        await operation();
    }
}

async function createAccount() {
    try {
        const { accountName, pin, confirmPin } = await inquirer.prompt([
            {
                name: 'accountName',
                message: 'Digite o nome da sua conta:',
                validate: input => input.length >= 3 || 'O nome deve ter pelo menos 3 caracteres'
            },
            {
                type: 'password',
                name: 'pin',
                message: 'Digite seu PIN (4 dígitos):',
                validate: input => /^\d{4}$/.test(input) || 'O PIN deve ter 4 dígitos numéricos'
            },
            {
                type: 'password',
                name: 'confirmPin',
                message: 'Confirme seu PIN:',
                validate: (input, answers) => input === answers.pin || 'Os PINs não correspondem'
            }
        ]);

        accountService.createAccount(accountName, pin);
        console.log(chalk.green(MESSAGES.ACCOUNT_CREATED));
    } catch (error) {
        console.error(chalk.red(error.message));
    }
    await operation();
}

async function checkBalance() {
    try {
        const { accountName, pin } = await getAccountCredentials();
        const balance = accountService.getBalance(accountName, pin);
        console.log(chalk.green(`Saldo atual: R$ ${balance.toFixed(2)}`));
    } catch (error) {
        console.error(chalk.red(error.message));
    }
    await operation();
}

async function deposit() {
    try {
        const { accountName, pin } = await getAccountCredentials();
        const { amount } = await inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual valor deseja depositar?',
                validate: input => !isNaN(input) && parseFloat(input) > 0 || 'Digite um valor válido'
            }
        ]);

        const newBalance = accountService.deposit(accountName, pin, parseFloat(amount));
        console.log(chalk.green(`Depósito realizado! Novo saldo: R$ ${newBalance.toFixed(2)}`));
    } catch (error) {
        console.error(chalk.red(error.message));
    }
    await operation();
}

async function withdraw() {
    try {
        const { accountName, pin } = await getAccountCredentials();
        const { amount } = await inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual valor deseja sacar?',
                validate: input => !isNaN(input) && parseFloat(input) > 0 || 'Digite um valor válido'
            }
        ]);

        const newBalance = accountService.withdraw(accountName, pin, parseFloat(amount));
        console.log(chalk.green(`Saque realizado! Novo saldo: R$ ${newBalance.toFixed(2)}`));
    } catch (error) {
        console.error(chalk.red(error.message));
    }
    await operation();
}

async function getStatement() {
    try {
        const { accountName, pin } = await getAccountCredentials();
        const transactions = accountService.getTransactionHistory(accountName, pin);
        
        console.log(chalk.yellow('\n=== Extrato de Transações ==='));
        transactions.forEach(transaction => {
            const color = transaction.type === 'DEPOSITO' ? chalk.green : chalk.red;
            console.log(color(
                `${new Date(transaction.date).toLocaleString()}: ${transaction.type} - R$ ${transaction.amount.toFixed(2)}`
            ));
        });
        console.log(chalk.yellow('==========================\n'));
    } catch (error) {
        console.error(chalk.red(error.message));
    }
    await operation();
}

async function getAccountCredentials() {
    return inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome da conta:'
        },
        {
            type: 'password',
            name: 'pin',
            message: 'Digite seu PIN:',
            validate: input => /^\d{4}$/.test(input) || 'O PIN deve ter 4 dígitos numéricos'
        }
    ]);
}

operation();