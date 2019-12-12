let {bankAccountName} = require('../helper');

neededEmployeeQueryInfo = async (bodyInfo) => {

    return {
        "first_name": bodyInfo.first_name,
        "last_name": bodyInfo.last_name,
        "umcn": bodyInfo.umcn,
        "birth_date": bodyInfo.birth_date,
        "gender": bodyInfo.gender,
        "address": bodyInfo.address,
        "identity_card": bodyInfo.identity_card,
        "phone_number": bodyInfo.phone_number,
        "em_status": bodyInfo.em_status,
        "em_type": bodyInfo.em_type,
        "hire_date": bodyInfo.hire_date,
        "working_hours": bodyInfo.working_hours,
        "em_salary": bodyInfo.em_salary,
        "account_number": bodyInfo.account_number,
        "account_name" : bankAccountName(bodyInfo)

    };
};

module.exports = {
    neededEmployeeQueryInfo
};