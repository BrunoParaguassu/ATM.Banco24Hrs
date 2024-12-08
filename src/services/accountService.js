const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { MESSAGES, LIMITS, FILES, TRANSACTION_TYPES } = require('../config/constants');

class AccountService {
    constructor() {
        this.setupDirectories();
    }

    setupDirectories() {
        [FILES.ACCOUNTS_DIR, FILES.LOGS_DIR, FILES.TRANSACTION_HISTORY_DIR].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });
    }

    createAccount(accountName, pin) {
        const hashedPin = this.hashPin(pin);
        const accountData = {
            balance: 0,
            pin: hashedPin,
            createdAt: new Date().toISOString(),
            transactions: []
        };

        const accountPath = this.getAccountPath(accountName);
        
        if (fs.existsSync(accountPath)) {
            throw new Error(MESSAGES.ACCOUNT_EXISTS);
        }

        fs.writeFileSync(accountPath, JSON.stringify(accountData, null, 2));
        this.logTransaction(accountName, 'CONTA_CRIADA', 0);
        return true;
    }

    deposit(accountName, pin, amount) {
        this.validatePin(accountName, pin);
        
        if (!this.isValidAmount(amount) || amount > LIMITS.MAX_DEPOSIT) {
            throw new Error(MESSAGES.INVALID_VALUE);
        }

        const account = this.getAccount(accountName);
        account.balance += parseFloat(amount);
        account.transactions.push({
            type: TRANSACTION_TYPES.DEPOSIT,
            amount: amount,
            date: new Date().toISOString()
        });

        this.saveAccount(accountName, account);
        this.logTransaction(accountName, TRANSACTION_TYPES.DEPOSIT, amount);
        return account.balance;
    }

    withdraw(accountName, pin, amount) {
        this.validatePin(accountName, pin);
        
        if (!this.isValidAmount(amount) || amount > LIMITS.MAX_WITHDRAWAL) {
            throw new Error(MESSAGES.INVALID_VALUE);
        }

        const account = this.getAccount(accountName);
        
        if (account.balance < amount) {
            throw new Error(MESSAGES.INSUFFICIENT_FUNDS);
        }

        account.balance -= parseFloat(amount);
        account.transactions.push({
            type: TRANSACTION_TYPES.WITHDRAWAL,
            amount: amount,
            date: new Date().toISOString()
        });

        this.saveAccount(accountName, account);
        this.logTransaction(accountName, TRANSACTION_TYPES.WITHDRAWAL, amount);
        return account.balance;
    }

    getBalance(accountName, pin) {
        this.validatePin(accountName, pin);
        const account = this.getAccount(accountName);
        return account.balance;
    }

    getTransactionHistory(accountName, pin) {
        this.validatePin(accountName, pin);
        const account = this.getAccount(accountName);
        return account.transactions;
    }

    // Métodos auxiliares privados
    hashPin(pin) {
        return crypto.createHash('sha256').update(pin).digest('hex');
    }

    validatePin(accountName, pin) {
        const account = this.getAccount(accountName);
        const hashedPin = this.hashPin(pin);
        if (account.pin !== hashedPin) {
            throw new Error('PIN inválido');
        }
    }

    isValidAmount(amount) {
        return !isNaN(amount) && amount > 0;
    }

    getAccountPath(accountName) {
        return path.join(FILES.ACCOUNTS_DIR, `${accountName}.json`);
    }

    getAccount(accountName) {
        const accountPath = this.getAccountPath(accountName);
        if (!fs.existsSync(accountPath)) {
            throw new Error(MESSAGES.ACCOUNT_NOT_FOUND);
        }
        return JSON.parse(fs.readFileSync(accountPath, 'utf8'));
    }

    saveAccount(accountName, accountData) {
        fs.writeFileSync(
            this.getAccountPath(accountName),
            JSON.stringify(accountData, null, 2)
        );
    }

    logTransaction(accountName, type, amount) {
        const logEntry = {
            accountName,
            type,
            amount,
            timestamp: new Date().toISOString()
        };

        const logFile = path.join(FILES.LOGS_DIR, `${new Date().toISOString().split('T')[0]}.log`);
        fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    }
}

module.exports = new AccountService();
