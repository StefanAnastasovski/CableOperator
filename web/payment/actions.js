let querys = require('./querys');
let date = require('date-and-time');

let {currentDate, printSqlError, reviseDateAndTime} = require('../helper');
let {getBillByBillIdQuery, changeIsPaidBillQuery} = require('../bill/querys');
let {getAllFreeTerminalQuery, changeTerminalBalancelQuery} = require('../register/querys');
let randomInt = require('random-int');

createPayment = async (req, res) => {
    let bodyInfo = req.body ;
    try {
        let billId = bodyInfo.bill_id;
        let bill = await getBillByBillIdQuery(billId);
        if(!bill[0].is_paid){
            let monthlyBill = bill[0].monthly_bill;
            monthlyBill = date.format(monthlyBill, "YYYY-MM-DD");
            let now = currentDate();
            let currDate = date.format(now, 'YYYY-MM-DD');
            let currTime = date.format(now, 'HH:mm:ss');
            let dateForQuery = currDate.split('-');
            dateForQuery = {year: dateForQuery[0],
                month: dateForQuery[1],
                day: dateForQuery[2]};
            let getAllFreeTerminals = await getAllFreeTerminalQuery(dateForQuery);
            let freeTerminal = getAllFreeTerminals[randomInt(0, getAllFreeTerminals.length-1)];
            let neededPaymentQueryInfo = {
                "date_of_pay": currDate,
                "time_of_pay": currTime,
                "date_of_bill" : monthlyBill,
                "price" : bill[0].price,
                "bill_number" : billId,
                "register_id": freeTerminal.id,
                "cl_id": bill[0].cl_umcn
            };
            await querys.createPaymentQuery(neededPaymentQueryInfo);
            monthlyBill = monthlyBill.split('-');
            monthlyBill = {year: monthlyBill[0],
                month: monthlyBill[1],
                day: monthlyBill[2]};
            await changeIsPaidBillQuery('1',neededPaymentQueryInfo.cl_id,monthlyBill);
            await changeTerminalBalancelQuery(freeTerminal.terminal, bill[0].price, dateForQuery);

            res.status(200).send('Payment Successfully Completed ');
        }
        else{
            res.status(200).send('You have already paid this bill!');
        }
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

getAllPaymentsFromCurrentDay = async (req, res) => {
    try {
        let now = currentDate();
        let currDate = date.format(now, 'YYYY-MM-DD');
        let dateForQuery = currDate.split('-');
        dateForQuery = {year: dateForQuery[0],
            month: dateForQuery[1],
            day: dateForQuery[2]};
            let allPayments = await querys.getAllPaymentsFromCurrentDayQuery(dateForQuery);
            reviseDateAndTime(allPayments);
            res.status(200).send(allPayments);

    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

getAllPaymentsByDate = async (req, res) => {
    let dateForQuery = {
        year: req.params.year,
        month: req.params.month,
        day: req.params.day
    };
    try{
        let allPayments = await querys.getAllPaymentsByDateQuery(dateForQuery);
        reviseDateAndTime(allPayments);
        res.status(200).send(allPayments);

    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};

getAllPaymentsByClient = async (req, res) => {
    let umcn = req.params.umcn;
    try {
        let allPayments = await querys.getAllPaymentsByClientQuery(umcn);
        reviseDateAndTime(allPayments);
        res.status(200).send(allPayments);
    } catch (error) {
        printSqlError(error);
        res.status(500).send(error);
    }
};


module.exports = {
    createPayment,
    getAllPaymentsFromCurrentDay,
    getAllPaymentsByDate,
    getAllPaymentsByClient
};
