let querys = require('./querys');

let {reviseDateAndTime, checkUmcnOrAccNumber, bankAccountName, printSqlError, currentDate} = require('../helper');

getAllBankAccounts = async (req, res) => {
    try {
        let account = await querys.getBankAccountQuery();
        reviseDateAndTime(account);
        res.status(200).send(account);
    } catch (error) {
        res.status(500).send(error);
    }

};

getSpecificBankAccount = async (req, res) => {
    const accNumber = req.params.accNumber;

    try {
        let account = await querys.getBankAccountQuery(accNumber);
        reviseDateAndTime(account);
        res.status(200).send(account);
    } catch (error) {
        res.status(500).send(error);
    }

};

createBankAccount = async (req, res) => {
    let bodyInfo = req.body;
    bankAccountName(bodyInfo);
    try {
        if (checkUmcnOrAccNumber(bodyInfo.account_number)) {
            await querys.createBankAccountQuery(bodyInfo);
            res.status(200).send("Bank Account is created!");
        } else {
            res.status(400).send("Wrong Account Number!");
        }
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

changeBankAccount = async (req, res) => {
    const accNumber = req.params.accNumber;
    const bodyInfo = req.body;

    try {
        let bankAccount = await querys.getBankAccountQuery(accNumber);

        if (bankAccount === 0) {
            res.status(400).send("Non-exist Bank Account!");
        } else if (bodyInfo.op) {
            let date = currentDate();
            await querys.changeBankAccountQuery(bodyInfo, date, accNumber, bodyInfo.op);
            res.status(200).send("Update completed successfully!");
        } else {
            let date = currentDate();
            await querys.changeBankAccountQuery(bodyInfo, date, accNumber);
            res.status(200).send("Update completed successfully!");
        }
    } catch (error) {
        res.status(500).send(error);
    }

};

module.exports = {
    getAllBankAccounts,
    getSpecificBankAccount,
    createBankAccount,
    changeBankAccount
};