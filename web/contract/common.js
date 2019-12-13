let {currentDate} = require('../helper');
let {neededClientQueryInfo} = require('../client/common');
let {createSpecificClientQuery} = require('../client/querys');
let {createBankAccountQuery} = require('../bank_account/querys');
let {createPersonalInformationQuery} = require('../personal_information/querys');

getDaysInMonth = function (year, month) {
    //January 1
    //Day 0 is the last day in the previous month
    return new Date(year, month + 1, 0).getDate();

};

yearChange = (date) => {
    date.year = (parseInt(date.year) + 1).toString();
    date.month = '1';
    return date;
};
concatDate = (date) =>{
    return date.year + "-" + date.month + "-" + date.day;
};

expirationDate = (dateOfContract, duration) => {
    //duration
    // 1, 2, 3, 4, 5
    //'Weekly', 'Monthly', '6 Month', '12 Month', '24 Month'
    let date = dateOfContract.split('-');
    //month 1-12
    date = {
        year: date[0],
        // month: (parseInt(date[1])+1).toString(),
        month: date[1],
        day: date[2]
    };
    let checkMonth;
    let checkDay;

    let daysInMonth = getDaysInMonth(date.year, date.month);
    duration = parseInt(duration);
    if (duration === 1 || duration === 'Weekly') {
        checkDay = parseInt(date.day) + 7;
        let checkDaysInMonth = Math.floor(checkDay / parseInt(daysInMonth));
        let putTheRestOfTheDaysInNextMonth = ((checkDay % parseInt(daysInMonth)));
        if (checkDaysInMonth === 0) {
            date.day = (parseInt(date.day) + 7).toString();
        } else if (checkDaysInMonth === 1 && parseInt(date.month) === 12) {
            yearChange(date);
            date.day = putTheRestOfTheDaysInNextMonth.toString();
        } else if (checkDaysInMonth === 1) {
            date.month = (parseInt(date.month) + 1).toString();
            date.day = putTheRestOfTheDaysInNextMonth.toString();
        }
        return concatDate(date);
    } else if (duration === 2 || duration.toString() === 'Monthly') {
        checkMonth = parseInt(date.month) + 1;
        if (Math.floor(checkMonth / 12) === 0) {
            date.month = checkMonth.toString();
        } else if (parseInt(date.month) === 12) {
            // if(Math.floor(checkMonth / 12) === 1)
            yearChange(date);
        }
        return concatDate(date);
    } else if (duration === 3 || duration === '6 Months') {
        checkMonth = parseInt(date.month) + 6;
        let checkMonthInYear = Math.floor(checkMonth / 12);
        if (checkMonthInYear === 0) {
            date.month = checkMonth.toString();
        } else if (checkMonth === 12) {
            date.month = checkMonth.toString();
        } else if (checkMonth === 13) {
            yearChange(date);
        } else if (checkMonthInYear === 1) {
            date.year = (parseInt(date.year) + 1).toString();
            date.month = (checkMonth % 12).toString();
        }
        return concatDate(date);

    } else if (duration === 4 || duration === '12 Months') {
        checkMonth = parseInt(date.month) + 12;
        let checkMonthInYear = Math.floor(checkMonth / 12);
        let incrementYear = (parseInt(date.year) + 1).toString();
        if (checkMonthInYear === 1) {
            date.year = incrementYear;
            date.month = (checkMonth % 12).toString();
        } else if (checkMonthInYear === 2) {
            date.year = incrementYear;
            date.month = '12';
        }
        return concatDate(date);

    } else if (duration === 5 || duration === '24 Months') {
        checkMonth = parseInt(date.month) + 24;
        if (Math.floor(checkMonth / 24) === 1) {
            date.year = (parseInt(date.year) + 2).toString();
            date.month = (checkMonth % 24).toString();
        }
        return concatDate(date);
    } else {
        return "Error!"
    }

};

generateContractNumber = () => {
    return (Math.floor(1000000000000 + Math.random() * 9000000000000)).toString();
};


neededQueryInfo = (bodyInfo, employeeUmcn) => {
    let date = currentDate().getFullYear() +
        "-" + (currentDate().getMonth()+1) +
        "-" + currentDate().getDate();
    let common = bodyInfo.service;
    let exDate = expirationDate(date, bodyInfo.duration);
    return {
        contract_date: date,
        contract_number: generateContractNumber(),
        duration: bodyInfo.duration,
        expiration_date: exDate,
        address: bodyInfo.contract_address,
        //price, service, description have same order in enum
        monthly_price: common,
        service: common,
        description_service: common,
        em_id: employeeUmcn,
        cl_id: bodyInfo.client_id
    };
};
isAllowedToMakeAContract = (typeOfClient, numberOfContract) =>{

    typeOfClient = typeOfClient.toLowerCase();

    if(typeOfClient === 'employee' && (numberOfContract < 3)){
        return true;
    }
    else if(typeOfClient === 'retiree' && numberOfContract <2){
        return true;
    }
    else return typeOfClient === 'other' && numberOfContract === 0;

};

createClientIfNotExist = async (bodyInfo) => {
    let neededClientInfo = await neededClientQueryInfo(bodyInfo);
    await createPersonalInformationQuery(neededClientInfo);
    console.log("Personal Information is created!");
    await createBankAccountQuery(neededClientInfo);
    console.log("Bank Account is created!");
    await createSpecificClientQuery(neededClientInfo);
    console.log("Client is created!");
};


module.exports = {
    expirationDate,
    neededQueryInfo,
    isAllowedToMakeAContract,
    createClientIfNotExist,
    yearChange
};
