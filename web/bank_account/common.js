let {bankAccountName} = require('../helper');

neededBankAccountQueryInfo = async (bodyInfo) => {
    let accountName = bankAccountName(bodyInfo);
    if(bodyInfo.balance){
        return {
            "account_name": accountName,
            "account_number": bodyInfo.account_number,
            "balance": bodyInfo.balance
        }
    }
    else{
        return {
            "account_name": accountName,
            "account_number": bodyInfo.account_number
        }
    }

};

module.exports = {
    neededBankAccountQueryInfo
};