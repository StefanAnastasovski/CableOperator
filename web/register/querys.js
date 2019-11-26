let conn = require('../database');

getRegisterInfoQuery = (terminal) => {
    let query;
    if (terminal) {
        query = `SELECT terminal, workday, balance, is_busy
                 FROM cash_register
                 WHERE terminal = ?`;
    } else {
        query = `SELECT terminal, workday, is_busy, balance
                 FROM cash_register`;

    }

    return new Promise((resolve, reject) => {
        conn.query(query, terminal, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

createRegisterQuery = (regInfo) => {
    const query = `INSERT INTO cash_register(terminal, workday, is_busy, balance)
                   VALUES (?, CURDATE(), ?, ?)`;
    return new Promise((resolve, reject) => {
        conn.query(query, regInfo, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

CheckRegisterIsBusyQuery = (terminal, isBusy) => {
    if (terminal) {
        const query = `SELECT terminal, workday, is_busy, balance
                       FROM cash_register
                       WHERE terminal = ?
                         AND is_busy = ?`;
        return new Promise((resolve, reject) => {
            conn.query(query, [terminal, isBusy], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } else {
        const query = `SELECT terminal, workday, is_busy, balance
                       FROM cash_register
                       WHERE is_busy = ?`;
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

getRegisterBalanceCurrentDayQuery = (terminal, date) => {
    const query = `SELECT terminal, workday, balance, is_busy
                   FROM cash_register
                   WHERE workday = ?
                     AND terminal = ?`;
    return new Promise((resolve, reject) => {
        conn.query(query, [date, terminal], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

getRegisterBalanceSpecificMonthQuery = (terminal, date) => {
    if (terminal) {
        const query = 'SELECT terminal,workday,balance, is_busy FROM cash_register WHERE MONTH(workday) = ? AND terminal = ?';
        return new Promise((resolve, reject) => {
            conn.query(query, [date, terminal], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } else {
        const query = `SELECT terminal, workday, balance, is_busy
                       FROM cash_register
                       WHERE MONTH(workday) = ?`;
        return new Promise((resolve, reject) => {
            conn.query(query, [date], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
};


registerChangeQuery = (changeBody, terminal, date) => {
    const query = `UPDATE cash_register
                   SET is_busy = ?,
                       balance = balance + ?
                   WHERE terminal = ?
                     AND workday = ?`;
    return new Promise((resolve, reject) => {
        conn.query(query, [changeBody.is_busy, changeBody.balance, terminal, date], (error, results, fields) => {
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
    registerChangeQuery,
    createRegisterQuery
};