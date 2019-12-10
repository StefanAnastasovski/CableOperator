let conn = require('../database');

getBankAccountQuery = (accNumber) => {
    let query;
    if (accNumber) {
        query = `SELECT account_name,
                        account_number,
                        balance,
                        last_modified
                 FROM bank_account
                 WHERE account_number = ?`;
    } else {
        query = `SELECT account_name, account_number, balance, last_modified
                 FROM bank_account`;
    }

    return new Promise((resolve, reject) => {
        conn.query(query, accNumber, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                if (results.length === 0) {
                    resolve(0);
                }
                resolve(results);
            }
        });
    });

};

createBankAccountQuery = (bodyInfo) => {
    let info = [];
    let query;

    if (!bodyInfo.balance) {
        query = "insert into bank_account(account_name, account_number, last_modified) values(?, ?, NOW())";
        info = [bodyInfo.account_name, bodyInfo.account_number]
    } else {
        query = "insert into bank_account(account_name, account_number, balance, last_modified) values(?, ?, ?, NOW())";
        info = [bodyInfo.account_name, bodyInfo.account_number, bodyInfo.balance]
    }

    return new Promise((resolve, reject) => {
        conn.query(query, info, (error, results, field) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }

        });
    });
};

changeBankAccountQuery = (bodyInfo, lastModified, accountNumber, op) => {
    let query;
    let info = [];

    //op salary paid
    if (op) {
        if (op === "+") {
            query = `UPDATE bank_account
                     SET balance       = balance + ?,
                         last_modified = ?
                     WHERE account_number = ?`;
            info = [bodyInfo.balance, lastModified, accountNumber];
            // }
        } else if (op === "-") {
            query = `UPDATE bank_account
                     SET balance       = balance - ?,
                         last_modified = ?
                     WHERE account_number = ?`;
            info = [bodyInfo.balance, lastModified, accountNumber];
        }
    }

    return new Promise((resolve, reject) => {
        conn.query(query, info, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

};

getBalanceQuery = (accountId) => {
    const query = `
        SELECT account_name, account_number, balance, last_modified
        FROM bank_account
        WHERE account_number = ?`;

    return new Promise((resolve, reject) => {
        conn.query(query, [accountId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};


getCompanyBalanceQuery = (accountId) => {
    const query = `
        SELECT balance
        FROM bank_account
        WHERE account_number = ?`;

    return new Promise((resolve, reject) => {
        conn.query(query, [accountId], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    createBankAccountQuery,
    getBankAccountQuery,
    changeBankAccountQuery,
    getBalanceQuery,
    getCompanyBalanceQuery
};