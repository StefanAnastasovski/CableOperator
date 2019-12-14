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

checkRegisterIsBusyQuery = (terminal, isBusy) => {
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

getRegisterIdQuery = (date, terminal) => {
    const query = `SELECT *
                   FROM cash_register
                   WHERE  terminal = ? AND YEAR(workday) = ?
                     AND MONTH(workday) = ?
                     AND DAY(workday) = ?`;
    return new Promise((resolve, reject) => {
        conn.query(query, [terminal, date.year, date.month, date.day], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

getAllFreeTerminalQuery = (date) => {
    const query = `SELECT * 
    FROM cash_register
    WHERE is_busy = ? 
      AND YEAR(workday) = ? 
      AND MONTH(workday) = ?
      AND DAY(workday) = ?`;
    return new Promise((resolve, reject) => {
        conn.query(query, [0, date.year, date.month, date.day], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

changeTerminalBalancelQuery = (terminal, addBalance, date) => {
    const query = `UPDATE cash_register 
    SET balance = balance + ?
    WHERE terminal = ?
      AND YEAR(workday) = ?
      AND MONTH(workday) = ?
      AND DAY(workday) = ?`;
    let info = [parseInt(addBalance), terminal, date.year, date.month, date.day];
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

getRegisterBalanceFromAllTerminalQuery = (date) => {
    const query = `SELECT terminal, balance, is_busy
                   FROM cash_register
                   WHERE YEAR(workday) = ?
                   AND MONTH(workday) = ?
                   AND DAY(workday) = ?`;
    return new Promise((resolve, reject) => {
        conn.query(query, [date.year, date.month, date.day], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                results = results.reduce((acc, currItem) =>{
                    return acc + parseInt(currItem.balance);
                }, 0);
                resolve(results);
            }
        });
    });
};

module.exports = {
    getRegisterInfoQuery,
    checkRegisterIsBusyQuery,
    getRegisterBalanceCurrentDayQuery,
    getRegisterBalanceSpecificMonthQuery,
    registerChangeQuery,
    createRegisterQuery,
    getRegisterIdQuery,
    getAllFreeTerminalQuery,
    changeTerminalBalancelQuery,
    getRegisterBalanceFromAllTerminalQuery
};