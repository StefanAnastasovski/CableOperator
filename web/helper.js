let date = require('date-and-time');

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
        if(item.work_date){
            item.work_date = date.format(item.work_date, 'YYYY-MM-DD');
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



currentDate = () => {
    return new Date();
};

module.exports = {
    sum2Numbers,
    fixDateAndTime,
    checkUmcnOrAccNumber,
    printSqlError,
    currentDate
};
