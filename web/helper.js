let date = require('date-and-time');

dateFormatSending = (wData) => {
    wData = wData.getUTCFullYear() + "-" + (wData.getUTCMonth() + 1) + "-" + (wData.getUTCDate());
    return wData;
};

dateFormatReceiving = (wData) => {
    wData = wData.getUTCFullYear() + "-" + (wData.getUTCMonth() + 1) + "-" + (wData.getUTCDate() + 1);
    return wData;
};

sum2Numbers = (a, b) => {
    return parseInt(a) + parseInt(b);
};
fixDateAndTime = (account) => {
    account.forEach((item) => {
        if(item.last_modified){
            item.last_modified = date.format(item.last_modified, 'YYYY-MM-DD HH:mm:ss') + "h";
        }
        if(item.birth_date){
            item.birth_date = date.format(item.birth_date, 'YYYY-MM-DD');
        }
        if(item.hire_date){
            item.hire_date = date.format(item.hire_date, 'YYYY-MM-DD');

        }
    });
};

checkUmcnOrAccNumber = (umcn) =>{
    return umcn.length === 13;
};
printSqlError = (error) =>{
    console.log("Error: " + error.sqlMessage);
    console.log("SQL: " + error.sql);
};
concat2Strings = (str1, str2) =>{

    return str1.concat(" " + str2);
};
bankAccountName= (body) =>{
    if (body.first_name && body.last_name)
        body.account_name = concat2Strings(body.first_name, body.last_name);
};
module.exports = {
    dateFormatSending,
    dateFormatReceiving,
    sum2Numbers,
    fixDateAndTime,
    checkUmcnOrAccNumber,
    printSqlError,
    bankAccountName
};
