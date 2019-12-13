let date = require('date-and-time');

sum2Numbers = (a, b) => {
    return parseInt(a) + parseInt(b);
};

reviseDateAndTime = (data) => {
    data.forEach((item) => {
        if(item.last_modified){
            item.last_modified = date.format(item.last_modified, 'YYYY-MM-DD HH:mm:ss') + "h";
        }
        if(item.birth_date){
            item.birth_date = date.format(item.birth_date, 'YYYY-MM-DD');
        }
        if(item.hire_date){
            item.hire_date = date.format(item.hire_date, 'YYYY-MM-DD');
        }
        if(item.work_date){
            item.work_date = date.format(item.work_date, 'YYYY-MM-DD');
        }
        if(item.workday){
            item.workday = date.format(item.workday, 'YYYY-MM-DD');
        }
        if(item.monthly_bill && item.payment_due){
            item.monthly_bill = date.format(item.monthly_bill, 'YYYY-MM');
            item.payment_due = date.format(item.payment_due, 'YYYY-MM-DD');
        }
        if(item.salary_payment_date){
            item.salary_payment_date = date.format(item.salary_payment_date, 'YYYY-MM-DD') ;
        }
        if(item.contract_date && item.expiration_date){
            item.contract_date =  date.format(item.contract_date, 'YYYY-MM-DD') ;
            item.expiration_date =  date.format(item.expiration_date, 'YYYY-MM-DD') ;
        }
        if(item.installation_date){
            item.installation_date =  date.format(item.installation_date, 'YYYY-MM-DD') ;
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
        return concat2Strings(body.first_name, body.last_name);
};

currentDate = () => {
    return new Date();
};

module.exports = {
    sum2Numbers,
    reviseDateAndTime,
    checkUmcnOrAccNumber,
    printSqlError,
    bankAccountName,
    currentDate
};
