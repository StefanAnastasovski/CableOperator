let {expirationDate, yearChange} = require('../contract/common');
returnDuration = (duration) => {

    if (parseInt(duration) === 1 || duration === 'Weekly') {
        return {contract: 'weekly', day: 7}
    } else if (parseInt(duration) === 2 || duration === 'Monthly') {
        return {contract: 'monthly', month: 1}
    } else if (parseInt(duration) === 3 || duration === '6 Months') {
        return {contract: '6 months', month: 6}
    } else if (parseInt(duration) === 4 || duration === '12 Months') {
        return {contract: '12 months', month: 12}
    } else if (parseInt(duration) === 5 || duration === '24 Months') {
        return {contract: '24 months', month: 24}
    }
};

neededBillQueryInfo = (billInfo, clientUmcn, date, billId, exDate) =>{
    if(!exDate){
        return {
            monthly_bill: billInfo.contract_date,
            service: billInfo.service,
            payment_due: date.year + "-" + date.month + "-" + date.day,
            bill_id: billId,
            is_paid: 0,
            price: billInfo.monthly_price,
            cl_umcn: clientUmcn.pi_umcn,
            contract_number: billInfo.contract_number
        }
    }
    else if(exDate){
        return {
            monthly_bill: billInfo.contract_date,
            service: billInfo.service,
            payment_due: exDate,
            bill_id: billId,
            is_paid: 0,
            price: billInfo.monthly_price,
            cl_umcn: clientUmcn.pi_umcn,
            contract_number: billInfo.contract_number
        }
    }

};

createBillsByDuration = (duration, date, billInfo, clientUmcn, clientId) => {
    let array = [];
    let object;
    date.day ='15';
    let billId;
    for (let i = 0; i < duration; i++) {
        billId = createBillId(sixDigitRandom(), clientId, date.year, date.month);
        if(date.month.toString() === '12'){
            yearChange(date);
        }
        else{
            date.month = parseInt(date.month) + 1;
        }
        object = neededBillQueryInfo(billInfo, clientUmcn, date, billId);
        array.push(object);
    }
    return array;
};

populateBills = async (clientUmcnAndId, billInfo, clientId) => {
    let date;

    let duration = returnDuration(billInfo.duration);
    date = billInfo.contract_date;
    date = date.split('-');
    date = {
        year: date[0],
        month: date[1],
        day: date[2]
    };
    let billId;
    if (duration.contract === 'weekly') {
        let exDate = expirationDate(billInfo.contract_date, 1);
        billId = createBillId(sixDigitRandom(), clientId, date.year, date.month);
        return neededBillQueryInfo(billInfo, clientUmcnAndId, date, billId, exDate);
    } else if (duration.contract === 'monthly') {
        let exDate =expirationDate(billInfo.contract_date, 2);
        billId = createBillId(sixDigitRandom(), clientId, date.year, date.month);
        return neededBillQueryInfo(billInfo, clientUmcnAndId, date, billId, exDate);

    } else if (duration.contract === '6 months') {
        return createBillsByDuration(duration.month, date, billInfo, clientUmcnAndId, clientId);
    }
    else if (duration.contract === '12 months') {
        return createBillsByDuration(duration.month, date, billInfo, clientUmcnAndId, clientId);
    } else if (duration.contract === '24 months') {
        return createBillsByDuration(duration.month, date, billInfo, clientUmcnAndId, clientId);
    }

};

createBillId = (str1, str2, year, month) => {
    str1.toString();
    str2.toString();
    year.toString();
    if(month.toString().length === 1){
        month = '0' + month;
    }
    return year.toString() + month.toString() + str1.toString() + str2.toString()
};

sixDigitRandom = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

module.exports = {
    populateBills,
    sixDigitRandom,
    createBillId
};