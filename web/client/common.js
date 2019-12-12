let {bankAccountName} = require('../helper');

generateClientId = () => {
    return (Math.floor(100000 + Math.random() * 900000)).toString();
};

neededClientQueryInfo = async (bodyInfo) => {

    return {
        "first_name": bodyInfo.first_name,
        "last_name": bodyInfo.last_name,
        "umcn": bodyInfo.umcn,
        "birth_date": bodyInfo.birth_date,
        "gender": bodyInfo.gender,
        "address": bodyInfo.address,
        "identity_card": bodyInfo.identity_card,
        "phone_number": bodyInfo.phone_number,
        "cl_status": bodyInfo.cl_status,
        "cl_type": bodyInfo.cl_type,
        "pi_umcn": bodyInfo.umcn,
        "ba_accNum" : bodyInfo.account_number,
        "client_id" : generateClientId(),
        "account_number": bodyInfo.account_number,
        "account_name" : bankAccountName(bodyInfo)
    };
};

module.exports = {
    neededClientQueryInfo
};