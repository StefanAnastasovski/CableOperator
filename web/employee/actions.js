let querys = require('./querys');

let {reviseDateAndTime, bankAccountName} = require('../helper');

getAllEmployeesInfo = async (req, res) => {
    try {
        const employee = await querys.getEmployeeInfoQuery();
        reviseDateAndTime(employee);
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};

getSpecificEmployeeInfo = async (req, res) => {
    let umcn = req.params.umcn;
    try {
        const employee = await querys.getEmployeeInfoQuery(umcn);
        reviseDateAndTime(employee);
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};

createEmployee = async (req, res) => {
    let bodyInfo = req.body;
    bankAccountName(bodyInfo);
    try {
        await createPersonalInformationQuery(bodyInfo);
        console.log("Personal Information is created!");
        await createBankAccountQuery(bodyInfo);
        console.log("Bank Account is created!");
        await querys.createEmployeeQuery(bodyInfo);
        console.log("Employee is created!");
        res.status(200).send("Employee is created!");
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

getAllEmployeesWorkStatus = async (req, res) => {
    let status = req.params.status;

    try {
        const employee = await querys.getAllEmployeesWorkStatusQuery(status);
        reviseDateAndTime(employee);
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};

getAllEmployeesByType = async (req, res) => {
    let type = req.params.type;

    try {
        const employee = await querys.getAllEmployeesByTypeQuery(type);
        reviseDateAndTime(employee);
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};

changeEmployeeStatusOrBonus = async (req, res) => {
    let umcn = req.params.umcn;
    let bodyInfo = req.body;

    try {
        await querys.changeEmployeeStatusOrBonusQuery(bodyInfo, umcn);
        res.status(200).send("Update completed successfully!");
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    getAllEmployeesInfo,
    getSpecificEmployeeInfo,
    createEmployee,
    getAllEmployeesWorkStatus,
    getAllEmployeesByType,
    changeEmployeeStatusOrBonus
};