let querys = require('./querys');
let {dateFormatSending} = require('../helper');
let {fixWorkday,currentDate, sum2Numbers} = require('./common');

getRegisterInfo = async (req, res) => {
    try {
        const register = await querys.getRegisterInfoQuery();
        fixWorkday(register);
        res.status(200).send(register);
    } catch (error) {
        res.status(500).send(error);
    }
};

CheckRegisterIsBusy = async (req, res) => {
    let isBusy = req.params.isBusy;
    let id = req.params.id;
    try {
        if (!(isBusy === '0' || isBusy === '1')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            const register = await querys.CheckRegisterIsBusyQuery(id, isBusy);
            fixWorkday(register);
            res.status(200).send(register);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

getRegisterBalanceCurrentDay = async (req, res) => {
    let id = req.params.id;
    let now = new Date();
    now = dateFormatSending(now);
    console.log(now);
    try {
        if (!(id === '1' || id === '2' || id === '3')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            const register = await querys.getRegisterBalanceCurrentDayQuery(id, now);
            fixWorkday(register);
            res.status(200).send(register);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

getRegisterBalanceSpecificMonth = async (req, res) => {
    let id = req.params.id;
    let now = req.params.month;
    try {
        if (id && !(id === '1' || id === '2' || id === '3')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            const register = await querys.getRegisterBalanceSpecificMonthQuery(id, now);
            fixWorkday(register);
            res.status(200).send(register);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

getRegisterInfoSpecificTerminal = async (req, res) => {
    let id = req.params.id;
    try {
        if (!(id === '1' || id === '2' || id === '3')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            const register = await querys.getRegisterInfoSpecificTerminalQuery(id);
            console.log(register.workday);
            fixWorkday(register);
            res.status(200).send(register);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

registerChange = async (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let date = currentDate();

    try {
        if (!(id === '1' || id === '2' || id === '3')) {
            res.status(400).send("Try again! Invalid Parametar. ");
        } else {
            let terminal = await querys.getRegisterInfoSpecificTerminalQuery(id);

            body.balance = sum2Numbers(terminal[0].balance,body.balance);

            await querys.registerChangeQuery(body, id, date);
            res.status(200).send("Update is completed successfully!");
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    getRegisterInfo,
    CheckRegisterIsBusy,
    getRegisterBalanceCurrentDay,
    getRegisterBalanceSpecificMonth,
    getRegisterInfoSpecificTerminal,
    registerChange
};