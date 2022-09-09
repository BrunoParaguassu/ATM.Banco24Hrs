//Modulos Externos
const inquirer = require('inquirer');
const chalk = require('chalk');

//Modulos Internos
const fs = require('fs');

operation()

//função usando o modulo Inquirer para visualização no terminal!
function operation(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: console.log(chalk.bgYellow.green('Bem Vindo! Banco do Brasil ')),
            choices: [
                'Desbloquear Cartão',
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair',
                'Outras Opções',
            ]
        }
    ])
    .then((answer) => {

        const action = answer['action']

        if (action === 'Criar Conta'){
            createAccount()
        }
    })
    .catch((err) => console.log (err));
}

//create an account

function createAccount(){
    console.log(chalk.bgYellow.green('Parabéns por escolher o Banco do Brasil! '));
    console.log(chalk.green('Defina as opções da sua conta a seguir '));

    buildAccount();
}

function buildAccount(){
    inquirer.prompt([
        {
            name:'Nome da Conta:',
            message:'Digite o nome da sua conta: ',
        }
    ]).then(answer => {
        const nomeDaConta = answer['Nome da Conta'];

        console.info(nomeDaConta);

        if(!fs.existsSync('Contas')){
            fs.mkdirSync('Contas');
        }


    }).catch((err) => console.log(err))
}