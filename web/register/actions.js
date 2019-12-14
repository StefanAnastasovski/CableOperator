let querys = require('./querys');

let {currentDate, createRegister} = require('./common');
let {reviseDateAndTime} = require('../helper');
let {changeBankAccountQuery, getBankAccountQuery} = require('../bank_account/querys');
let {getRegisterBalanceFromAllTerminalQuery} = require('../register/querys');

getRegisterInfo = async (req, res) => {
    try {
        const register = await querys.getRegisterInfoQuery();
        reviseDateAndTime(register);
        res.status(200).send(register);
    } catch (error) {
        res.status(500).send(error);
    }

};

createRegisterForToday = async (req, res) => {
    try {
        await createRegister();
        res.status(200).send('Register is created!');
    } catch (error) {
        res.status(500).send(error);
    }

};

getRegisterInfoSpecificTerminal = async (req, res) => {
    let terminal = req.params.terminal;

    try {
        if (!(terminal === '1' || terminal === '2' || terminal === '3')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            const register = await querys.getRegisterInfoQuery(terminal);
            reviseDateAndTime(register);
            res.status(200).send(register);
        }
    } catch (error) {
        res.status(500).send(error);
    }

};

checkRegisterIsBusy = async (req, res) => {
    let isBusy = req.params.isBusy;
    let terminal = req.params.terminal;

    try {
        if (!(isBusy === '0' || isBusy === '1')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            const register = await querys.checkRegisterIsBusyQuery(terminal, isBusy);
            reviseDateAndTime(register);
            res.status(200).send(register);
        }
    } catch (error) {
        res.status(500).send(error);
    }

};

getRegisterBalanceCurrentDay = async (req, res) => {
    let terminal = req.params.terminal;
    let now = currentDate();

    try {
        if (!(terminal === '1' || terminal === '2' || terminal === '3')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            const register = await querys.getRegisterBalanceCurrentDayQuery(terminal, now);
            reviseDateAndTime(register);
            res.status(200).send(register);
        }
    } catch (error) {
        res.status(500).send(error);
    }

};

getRegisterBalanceSpecificMonth = async (req, res) => {
    let terminal = req.params.terminal;
    let now = req.params.month;

    try {
        if (terminal && !(terminal === '1' || terminal === '2' || terminal === '3')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            const register = await querys.getRegisterBalanceSpecificMonthQuery(terminal, now);
            reviseDateAndTime(register);
            res.status(200).send(register);
        }
    } catch (error) {
        res.status(500).send(error);
    }

};

registerChange = async (req, res) => {
    let terminal = req.params.terminal;
    let body = req.body;
    let date = currentDate();

    try {
        if (!(terminal === '1' || terminal === '2' || terminal === '3')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            await querys.getRegisterInfoQuery(terminal);
            await querys.registerChangeQuery(body, terminal, date);
            res.status(200).send("Update completed successfully!");
        }
    } catch (error) {
        res.status(500).send(error);
    }

};

enterBalanceInBankAccount = async (req, res) => {
    let bodyInfo = req.body;
    try {
        let bankAccount = await getBankAccountQuery(process.env.ACCOUNTID);
        if (bankAccount === 0) {
            res.status(400).send("Non-exist Bank Account!");
        } else if (bodyInfo.op === '+') {
            let date = currentDate();
            let dateForQuery = date.split('-');
            dateForQuery = {
                    year : dateForQuery[0],
                    month : dateForQuery[1],
                    day : dateForQuery[2]
            };
            let registerBalance = await getRegisterBalanceFromAllTerminalQuery(dateForQuery);
            let neededBAQueryInfo = {balance : registerBalance};
            console.log(neededBAQueryInfo)
            await changeBankAccountQuery(neededBAQueryInfo, new Date, process.env.ACCOUNTID, bodyInfo.op);
        }
        res.status(200).send("Update completed successfully!");
    } catch (error) {
        res.status(500).send(error);
    }

};


module.exports = {
    getRegisterInfo,
    getRegisterInfoSpecificTerminal,
    checkRegisterIsBusy,
    getRegisterBalanceCurrentDay,
    getRegisterBalanceSpecificMonth,
    registerChange,
    createRegisterForToday,
    enterBalanceInBankAccount
};