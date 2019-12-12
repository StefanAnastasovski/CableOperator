let querys = require('./querys');

let {neededClientQueryInfo} = require('./common');
let {createBankAccountQuery} = require("../bank_account/querys");
let {createPersonalInformationQuery} = require("../personal_information/querys");
let {reviseDateAndTime, printSqlError} = require('../helper');


getAllClientsInfo = async (req, res) => {
    try {
        const client = await querys.getClientInfoQuery();
        reviseDateAndTime(client);
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error);
    }
};

getSpecificClientInfo = async (req, res) => {
    let umcn = req.params.umcn;
    try {
        const client = await querys.getClientInfoQuery(umcn);
        reviseDateAndTime(client);
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error);
    }
};

getClientTableInfo = async (req, res) => {
    try {
        const client = await querys.getClientTableInfoQuery();
        console.log(client);
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error);
    }
};

getClientsStatus = async (req, res) => {
    let status = req.params.status;
    try {
        const client = await querys.getClientsStatusQuery(status);
        reviseDateAndTime(client);
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error);
    }
};

createClient = async (req, res) => {
    let bodyInfo = req.body;
    try {
        let neededClientInfo = await neededClientQueryInfo(bodyInfo);
        await createPersonalInformationQuery(neededClientInfo);
        console.log("Personal Information is created!");
        await createBankAccountQuery(neededClientInfo);
        console.log("Bank Account is created!");
        await querys.createSpecificClientQuery(neededClientInfo);
        console.log("Client is created!");
        res.status(200).send("Client is created!");
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

changeClient = async (req, res) => {
    let bodyInfo = req.body;
    let umcn = req.params.umcn;

    try {
        await querys.changeClientQuery(bodyInfo, umcn);
        res.status(200).send("Update completed successfully!");
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

module.exports = {
    getAllClientsInfo,
    getSpecificClientInfo,
    getClientTableInfo,
    createClient,
    getClientsStatus,
    changeClient
};