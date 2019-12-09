
let {sum2Numbers, currentDate} = require('../helper');
let {changeBankAccountQuery, createBankAccountQuery} = require('../bank_account/querys');
sub2Numbers = (a, b) => {
    return parseInt(a) - parseInt(b);
};

let querys = require('./querys');

require('dotenv/config');


employeeIsPaid = async (companyBalance, salaryInfo) => {

    let bodyInfo;
    let date = currentDate();

    try {
        if(salaryInfo.length === 1){
            bodyInfo = {
                balance: salaryInfo[0].em_salary
            };
            //company balance - em_salary
            await changeBankAccountQuery(bodyInfo, date, process.env.ACCOUNTID, "-");

            //employee balance + em_salary
            await changeBankAccountQuery(bodyInfo, date, salaryInfo[0].account_number, "+");
            return true;
        }
        else if(salaryInfo.length > 1){
            for(var i=0; i < salaryInfo.length; i++){
                bodyInfo = {
                    balance: salaryInfo[i].em_salary
                };
                //company balance - em_salary
                await changeBankAccountQuery(bodyInfo, date, process.env.ACCOUNTID, "-");
                //problem

                //employee balance + em_salary
                await changeBankAccountQuery(bodyInfo, date, salaryInfo[i].account_number, "+");
            }
            return true;
        }

    } catch (error) {
        return error;
    }

};

checkIfCompanyBalanceIsEnough = (companyBalance, neededBalance) =>{
    return companyBalance[0].balance > neededBalance;
};

reviseDateFromBody = (date) =>{
    date = date.split("-");
    return {
        year: date[0],
        month: date[1],
        day: date[2]
    };
};

fullDate = (date) =>{
    return date.year + "-" + date.month + "-" + date.day;
};

module.exports = {
    employeeIsPaid,
    checkIfCompanyBalanceIsEnough,
    reviseDateFromBody,
    fullDate
};