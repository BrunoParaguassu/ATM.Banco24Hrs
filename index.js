//Modulos Externos
const inquirer = require('inquirer');
const chalk = require('chalk');

//Modulos Internos
const fs = require('fs');
const { parse } = require('path');

operation()

//função usando o modulo Inquirer para visualização no terminal!
function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: console.log(chalk.bgYellow.green('Bem Vindo! Banco do Brasil ')),
            choices: [
                'Desbloquear Cartão',
                'Criar Conta',
                'Consultar Saldo',
                'Deposito',
                'Sacar',
                'Sair',
                'Outras Opções',
            ]
        }
    ])
        .then((answer) => {

            const action = answer['action']

            if (action === 'Criar Conta') {
                createAccount()
            } else if (action === 'Consultar Saldo') {

            } else if (action === 'Deposito') {
                deposit()
            } else if (action === 'Sacar') {

            } else if (action === 'Sair') {
                console.log(chalk.bgBlue.black('Obrigado por usar o Banco do Brasil ! '))
                process.exit()
            }
        })
        .catch((err) => console.log(err));
}

//criando a conta

function createAccount() {
    console.log(chalk.bgYellow.green('Parabéns por escolher o Banco do Brasil! '));
    console.log(chalk.green('Defina as opções da sua conta a seguir '));

    buildAccount();
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'nomeDaConta',
            message: 'Digite o nome da sua conta: ',
        }
    ]).then(answer => {
        const nomeDaConta = answer['nomeDaConta'];

        console.info(nomeDaConta);

        if (!fs.existsSync('Contas')) {
            fs.mkdirSync('Contas');
        }

        if (fs.existsSync(`Contas/${nomeDaConta}.json`)) {
            console.log(
                chalk.bgRed.black('Está conta já existe, escolha outro nome!')
            )
            buildAccount()
            return
        }

        fs.writeFileSync(`Contas/${nomeDaConta}.json`, '{"balance": 0}',
            function (err) {
                console.log(err);
            },
        )
        console.log(chalk.green('Parabéns, sua conta foi criada!'));
        operation()
    })
        .catch((err) => console.log(err))
}

//Adicionar valor na conta

function deposit() {
    inquirer.prompt([
        {
            name: 'nomeDaConta',
            message: 'Qual o nome da sua conta ? '
        }
    ])
        .then((answer) => {

            const nomeDaConta = answer['nomeDaConta']

            //Verificar se a conta existe
            if (!checkaccount(nomeDaConta)) {
                return;
            }

            inquirer.prompt([
                {
                    name: 'Valor',
                    message: 'Qual valor deseja depositar ? '
                },
            ]).then((answer) => {

                const Valor = answer['Valor']

                //Adicionar valor
                adicionarValor(nomeDaConta, Valor)
                operation()

            })

                .catch(err => console.log(err));

        })
        .catch(err => console.log(err))
}

function checkaccount(nomeDaConta) {

    if (!fs.existsSync(`Contas/${nomeDaConta}.json`)) {
        console.log(chalk.bgRed.black(`Esta conta não existe, escolha outra conta ! `))
        return false
    }
    return true

}

function adicionarValor(nomeDaConta, Valor) {

    const accountData = getaccount(nomeDaConta)

    if (!Valor) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde !'))
        return deposit()
    }

    accountData.balance = parseFloat(Valor) + parseFloat(accountData.balance)

    fs.writeFileSync(

        `Contas/${nomeDaConta}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )
    console.log(chalk.green(`Foi depositado o valor de R$${Valor} na sua conta !`))
}

function getaccount(nomeDaConta) {

    const accountJSON = fs.readFileSync(`Contas/${nomeDaConta}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}