let querys = require('./querys');


let {reviseDateAndTime, printSqlError} = require('../helper');
let {neededQueryInfo, isAllowedToMakeAContract, createClientIfNotExist} = require('./common');
let {getTypeOfClientQuery, isClientExistQuery} = require('../client/querys');
let {checkIsBillExistQuery,createAllBillsQuery} = require('../bill/querys');

createContract = async (req, res) => {
    let umcn = req.params.umcn;
    let bodyInfo = req.body;

    try {
        let isClientExist = await isClientExistQuery(bodyInfo.client_id);
        let contractInfo = neededQueryInfo(bodyInfo, umcn);
        if (isClientExist.length) {
            let typeOfClient = await getTypeOfClientQuery(bodyInfo.client_id);
            let numberOfContract = await querys.getNumberOfContractForClientQuery(bodyInfo.client_id);
            let isAllowed = isAllowedToMakeAContract(typeOfClient, numberOfContract);
            if(isAllowed){
                await querys.createContractQuery(contractInfo);

                let billExist = await checkIsBillExistQuery(umcn, contractInfo.contract_date);
                if(billExist === 0){
                    let clientId = (await getClientIdQuery(contractInfo.cl_id))[0].client_id;
                    let clientInfo = {'pi_umcn': bodyInfo.umcn, 'client_id': clientId};
                    await createAllBillsQuery(clientInfo, contractInfo, clientId);
                    res.status(200).send("Contract successfully made!");
                }
                else{
                    res.send('Bill is already created!');
                }
            }
            else{
                res.status(200).send("You have maximum allowed contracts!");
            }
        } else {
            contractInfo.cl_id = bodyInfo.umcn;
            await createClientIfNotExist(bodyInfo);
            await querys.createContractQuery(contractInfo);
            //create bills
            res.status(200).send("Contract successfully made!");
        }
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

getAllContracts = async (req, res) => {
    try {
        let allContracts = await querys.getAllContractsQuery();
        reviseDateAndTime(allContracts);
        res.status(500).send(allContracts);
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

getContractsForSpecificClient = async (req, res) => {
    let umcn = req.params.umcn;
    try {
        let contracts = await querys.getContractsForSpecificClientQuery(umcn);
        reviseDateAndTime(contracts);
        res.status(500).send(contracts);
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

getContractsByService = async (req, res) => {
    let service = req.params.service;
    try {
        let contracts = await querys.getContractsByServiceQuery(service);
        reviseDateAndTime(contracts);
        res.status(500).send(contracts);
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

module.exports = {
    getAllContracts,
    createContract,
    getContractsForSpecificClient,
    getContractsByService
};
