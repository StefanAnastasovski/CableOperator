let querys = require('./querys');

const randomInt = require('random-int');
let {reviseDateAndTime, printSqlError} = require('../helper');
let {neededQueryInfo, isAllowedToMakeAContract, createClientIfNotExist} = require('./common');
let {getTypeOfClientQuery, isClientExistQuery, getClientIdQuery} = require('../client/querys');
let {checkIsBillExistQuery,createAllBillsQuery} = require('../bill/querys');
let {enterInfoInWarehouseQuery} = require('../warehouse/querys');
let {createInstallationQuery} = require('../installation/querys');
let {getAllEmployeesByTypeQuery, getEmployeeInfoQuery} = require('../employee/querys');


createContract = async (req, res) => {
    let umcn = req.params.umcn;
    let bodyInfo = req.body;
    try {
        let isTO = await getEmployeeInfoQuery(umcn);
        if(isTO.length && (isTO[0].em_type === "Technical Operator")){
            let clientExistInfo = {client_id : bodyInfo.umcn};
            let isClientExist = await isClientExistQuery(clientExistInfo.client_id);
            let contractInfo = neededQueryInfo(bodyInfo, umcn);
            if (isClientExist.length) {
                let typeOfClient = await getTypeOfClientQuery(clientExistInfo.client_id);
                let numberOfContract = await querys.getNumberOfContractForClientQuery(clientExistInfo.client_id);
                let isAllowed = isAllowedToMakeAContract(typeOfClient, numberOfContract);

                if(isAllowed){
                    await querys.createContractQuery(contractInfo);
                    //em_type = 2 -> cable operator
                    let freeCableInstallers = await getAllEmployeesByTypeQuery(2);
                    let randomCableInstaller = freeCableInstallers[randomInt(0,freeCableInstallers.length-1)].umcn;
                    let contractNumberAndDate = await querys.getContractNumberAndDateQuery(bodyInfo.umcn); // last contract
                    let warehouseInfo = {
                        cl_contract : contractNumberAndDate.contract_number,
                        package : bodyInfo.service,
                        description : bodyInfo.service,
                    };

                    let installationInfo = {
                        "contract_number": contractNumberAndDate.contract_number,
                        "em_id" : randomCableInstaller,
                        "cl_id" : bodyInfo.umcn,
                        "installation_date" : contractNumberAndDate.contract_date,
                        "wh_id" : contractNumberAndDate.contract_number
                    };
                    await enterInfoInWarehouseQuery(warehouseInfo);
                    await createInstallationQuery(installationInfo);
                    let billExist = await checkIsBillExistQuery(contractNumberAndDate.contract_number,
                        contractInfo.contract_date,
                        clientExistInfo.client_id);
                    if(billExist === 0){
                        let clientId = (await getClientIdQuery(contractInfo.cl_id))[0].client_id;
                        let clientInfo = {'pi_umcn': clientExistInfo.client_id, 'client_id': clientId};
                        await createAllBillsQuery(clientInfo, contractInfo, clientId);
                        res.status(200).send("Contract successfully made!");
                    }
                    else{
                        res.status(200).send('Bill is already created!');
                    }

                }
                else{
                    res.status(200).send("You have maximum allowed contracts!");
                }
            } else {
                contractInfo.cl_id = bodyInfo.umcn;
                await createClientIfNotExist(bodyInfo);
                await querys.createContractQuery(contractInfo);
                let billExist = await checkIsBillExistQuery(contractNumberAndDate.contract_number,
                    contractInfo.contract_date,
                    clientExistInfo.client_id);
                if(billExist === 0){
                    let clientId = (await getClientIdQuery(contractInfo.cl_id))[0].client_id;
                    let clientInfo = {'pi_umcn': clientExistInfo.client_id, 'client_id': clientId};
                    await createAllBillsQuery(clientInfo, contractInfo, clientId);
                    res.status(200).send("Contract successfully made!");
                }
                else{
                    res.status(200).send('Bill is already created!');
                }

            }
        }

        else{
            res.status(200).send('Wrong employee id');
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
