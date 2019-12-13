//доделува на вработен кој мора да е слободен и да е од тип монтер,
// за да може да изврши приклучување на клиентот, и притоа да
// искористи пакет со матријал од анекс кој е потребен за да може
// да се изврши приклучување на клиентот. Во анекс се чуваат информации
// за пакет со матријал и опис што вклучува тој пакет. За секој приклучок
// треба да се знае кој монтер, кој клиент го има приклучено и притоа да
// се знае датумот кога е извршен приклучокот, за кој договор е извршен,
// и статус(завршено/незавршено).
//7. Приклучок – табела од релација
// 	- Креирање на приклучок ( и кажува која опрема се користи од Анекс )
// 	- Листање на приклучоци(по датум или сите)
// 	- Промена на статус(незавршен/завршен)

let querys = require('./querys');
let {enterInfoInWarehouseQuery} = require('../warehouse/querys');

// let {neededEmployeeQueryInfo} = require('./common');
// let {reviseDateAndTime, printSqlError} = require('../helper');
// let {createBankAccountQuery} = require('../bank_account/querys');
// let {createPersonalInformationQuery} = require('../personal_information/querys');
// let {addSalaryForNewEmployeeQuery} = require('../salary/querys');


getAllInstallations = async (req, res) => {
    try {
        const installations = await querys.getAllInstallationsQuery();
        reviseDateAndTime(installations);
        res.status(200).send(installations);
    } catch (error) {
        res.status(500).send(error);
    }
};

getAllInstallationsByDate = async (req, res) => {
    let year = req.params.year;
    let month = req.params.month;
    let day = req.params.day;
    let date = day ?
        {year : year, month: month, day:day} :
        {year : year, month: month};
    try {
        const installations = await querys.getAllInstallationsByDateQuery(date);
        reviseDateAndTime(installations);
        res.status(200).send(installations);
    } catch (error) {
        res.status(500).send(error);
    }
};
changeIsFinished = async (req, res) => {
    let isFinished = req.params.isFinished;
    let contract = req.body.contract;
    let date = req.body.date;
    try {
        if(date){
            await querys.changeIsFinishedQuery(isFinished, contract, date);
            res.status(200).send('Successfully updated!');
        }
        else{
            await querys.changeIsFinishedQuery(isFinished, contract);
            res.status(200).send('Successfully updated!');
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

createInstallation =   async (req, res) => {
    let bodyInfo = req.body;
    try {

        res.status(200).send('Successfully created!');
    } catch (error) {
        res.status(500).send(error);
    }
};


module.exports = {
    getAllInstallations,
    getAllInstallationsByDate,
    changeIsFinished,
    createInstallation
};