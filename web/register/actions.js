let querys = require('./querys');

let {fixWorkday, currentDate, createRegister} = require('./common');


getRegisterInfo = async (req, res) => {
    try {
        await createRegister();
        const register = await querys.getRegisterInfoQuery();
        fixWorkday(register);
        res.status(200).send(register);
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
            fixWorkday(register);
            res.status(200).send(register);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

CheckRegisterIsBusy = async (req, res) => {
    let isBusy = req.params.isBusy;
    let terminal = req.params.terminal;
    try {
        if (!(isBusy === '0' || isBusy === '1')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            const register = await querys.CheckRegisterIsBusyQuery(terminal, isBusy);
            fixWorkday(register);
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
            fixWorkday(register);
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
            fixWorkday(register);
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
            await querys.getRegisterInfoSpecificTerminalQuery(terminal);

            // body.balance = sum2Numbers(terminal[0].balance,body.balance);

            await querys.registerChangeQuery(body, terminal, date);
            res.status(200).send("Update completed successfully!");
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    getRegisterInfo,
    getRegisterInfoSpecificTerminal,
    CheckRegisterIsBusy,
    getRegisterBalanceCurrentDay,
    getRegisterBalanceSpecificMonth,
    registerChange
};