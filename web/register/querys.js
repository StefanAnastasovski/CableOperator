let conn = require('../database');

getRegisterInfoQuery = () => {
    const query = 'SELECT terminal,workday,is_busy,balance FROM cash_register';
    return new Promise((resolve, reject) => {
        conn.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

CheckRegisterIsBusyQuery = (id, isBusy) => {
    if(id) {
        const query = 'SELECT terminal,workday,is_busy,balance FROM cash_register WHERE terminal = ? AND is_busy = ?';
        return new Promise((resolve, reject) => {
            conn.query(query, [id, isBusy], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
    else{
        const query = 'SELECT terminal,workday,is_busy,balance FROM cash_register WHERE is_busy = ?';
        return new Promise((resolve, reject) => {
            conn.query(query, [isBusy], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
};

getRegisterBalanceCurrentDayQuery = (id, date) => {
    const query = 'SELECT terminal,workday,balance, is_busy FROM cash_register WHERE workday = ? AND terminal = ?';
    return new Promise((resolve, reject) => {
        conn.query(query,[date, id],(error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

getRegisterBalanceSpecificMonthQuery = (id, date) => {
    if(id){
        const query = 'SELECT terminal,workday,balance, is_busy FROM cash_register WHERE MONTH(workday) = ? AND terminal = ?';
        return new Promise((resolve, reject) => {
            conn.query(query,[date, id],(error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
    else{
        const query = 'SELECT terminal,workday,balance,is_busy FROM cash_register WHERE MONTH(workday) = ?';
        return new Promise((resolve, reject) => {
            conn.query(query,[date],(error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
};

getRegisterInfoSpecificTerminalQuery= (id) => {
    const query = 'SELECT terminal,workday,balance, is_busy FROM cash_register WHERE terminal = ?';
    return new Promise((resolve, reject) => {
        conn.query(query,[id],(error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

registerChangeQuery = (changeBody, id, date) =>{
    const query = 'UPDATE cash_register SET is_busy = ?, balance = ? WHERE terminal = ? AND workday = ?';
    return new Promise((resolve, reject) => {
        conn.query(query,[changeBody.is_busy, changeBody.balance, id, date],(error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getRegisterInfoQuery,
    CheckRegisterIsBusyQuery,
    getRegisterBalanceCurrentDayQuery,
    getRegisterBalanceSpecificMonthQuery,
    getRegisterInfoSpecificTerminalQuery,
    registerChangeQuery
};