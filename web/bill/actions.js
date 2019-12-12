let querys = require('./querys');

let {reviseDateAndTime} = require('../helper');


// createBills = async (req, res) => {
//     let umcn = req.params.umcn;
//     try {
//         //list of all clients pi_umcn and client_id
//         // let clientUmcnAndId =  await  getAllClientsUmcnAndIdQuery();
//         // let client = await getClientInfoQuery(umcn);
//         // let clientInfo = {'pi_umcn': umcn, 'client_id': client[0].client_id};
//         // // let bills = await populateBills(clientInfo);
//         // let billInfo = (await getContractsForSpecificClientQuery(clientInfo.pi_umcn));
//         // reviseDateAndTime(billInfo);
//         // let billExist = await  querys.checkIsBillExistQuery(umcn, billInfo[0].contract_date);
//         // if(billExist === 0){
//         //     let clientId = (await getClientIdQuery(clientInfo.pi_umcn))[0].client_id;
//         //     await querys.createAllBillsQuery(clientInfo, billInfo, clientId);
//         //     res.send('Bills successfully created');
//         // }
//         // else{
//         //     res.send('Bill is already created!');
//         // }
//         // // console.log(bills);
//         // console.log("");
//     } catch (error) {
//         res.status(500).send(error);
//     }
//
// };

getAllBills = async (req, res) => {
    const umcn = req.params.umcn;
    try {

        let clientBills = await querys.getAllBillsForClientQuery(umcn);
        reviseDateAndTime(clientBills);
        res.status(200).send(clientBills);

    } catch (error) {
        res.status(500).send(error);
    }

};


changeIsPaidBill = async (req, res) => {

    const umcn = req.params.umcn;
    const date = {
        year : req.params.year,
        month : req.params.month
    };
    const isPaid = req.body.is_paid;

    try {

        let clientBills = await querys.changeIsPaidBillQuery(isPaid, umcn, date);
        reviseDateAndTime(clientBills);
        res.status(200).send(clientBills);

    } catch (error) {
        res.status(500).send(error);
    }

};

getBillForSpecificClient  = async (req, res) => {
    const umcn = req.params.umcn;
    const date = {
        year : req.params.year,
        month : req.params.month
    };
    try {

        let clientBill = await querys.getBillForSpecificClientQuery(umcn, date);
        reviseDateAndTime(clientBill);
        res.status(200).send(clientBill);

    } catch (error) {
        res.status(500).send(error);
    }

};


module.exports = {
    getAllBills,
    changeIsPaidBill,
    getBillForSpecificClient
};