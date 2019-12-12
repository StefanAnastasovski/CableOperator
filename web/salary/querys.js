let conn = require('../database');
let {fullDate} = require('./common');

createPayrollQuery = (umcn, bodyInfo) => {
    let info = [umcn, bodyInfo.date, bodyInfo.is_paid];
    const query = `
        INSERT INTO salary(employee_id, salary_payment_date, is_paid)
        VALUES (?, ?, ?)
    `;

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

createMonthlyPayrollQuery = (employeeUmcn, date, isPaid) => {
    let query;
    date = date.year + "-" + date.month + "-" + date.day;

    employeeUmcn.map((item) => {
        query = `
            INSERT INTO salary(employee_id, salary_payment_date, is_paid)
            VALUES (?, ?, ?)

        `;

        return new Promise((resolve, reject) => {
            conn.query(query, [item.pi_umcn, date, isPaid], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

    });

};

getMonthlyPayrollQuery = (date) => {
    const query = `
        SELECT employee_id,
               salary_payment_date,
               is_paid
        FROM salary
        WHERE YEAR(salary_payment_date) = ?
          AND MONTH(salary_payment_date) = ?
    `;

    return new Promise((resolve, reject) => {
        conn.query(query, [date.year, date.month], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

};

getPayrollsQuery = (date, umcn) => {
    let query;
    let info;

    if (umcn) {
        query = `
            SELECT employee_id,
                   salary_payment_date,
                   is_paid
            FROM salary
            WHERE employee_id = ?
        `;
        info = [umcn];
    } else if (date) {
        query = `
            SELECT employee_id,
                   salary_payment_date,
                   is_paid
            FROM salary
            WHERE YEAR(salary_payment_date) = ?
              AND MONTH(salary_payment_date) = ?
        `;
        info = [date.year, date.month];
    } else {
        query = `
            SELECT employee_id,
                   salary_payment_date,
                   is_paid
            FROM salary`;
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

getIsPaidQuery = (umcn, date) => {
    let info = [umcn, date.year, date.month];
    let query = `
        SELECT is_paid
        FROM salary
        WHERE employee_id = ?
          AND YEAR(salary_payment_date) = ?
          AND MONTH(salary_payment_date) = ?
    `;

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

changeIsPaidQuery = (umcn, date) => {
    let query = `
        UPDATE salary
        SET is_paid             = 1,
            salary_payment_date = ?
        WHERE employee_id = ?
          AND YEAR(salary_payment_date) = ?
          AND MONTH(salary_payment_date) = ?
    `;

    let fullDay = fullDate(date);
    let info = [fullDay, umcn, date.year, date.month];

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


getPayrollForEmployeeQuery = (date, umcn) => {
    let query;
    let info;

    if (date && umcn) {
        query = `
            SELECT employee_id,
                   salary_payment_date,
                   is_paid
            FROM salary
            WHERE employee_id = ?
              AND YEAR(salary_payment_date) = ?
              AND MONTH(salary_payment_date) = ?
        `;
        info = [umcn, date.year, date.month];
    } else if (date) {
        query = `
            SELECT employee_id,
                   salary_payment_date,
                   is_paid
            FROM salary
            WHERE is_paid = 0
              AND YEAR(salary_payment_date) = ?
              AND MONTH(salary_payment_date) = ?
        `;
        info = [date.year, date.month];
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

addSalaryForNewEmployeeQuery = (body) =>{
    let query;
    let info;

        query = `
            INSERT INTO salary(employee_id, salary_payment_date, is_paid)
            VALUES(?,?,?);
        `;
        info = [body.umcn, body.hire_date, 0];


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

module.exports = {
    createPayrollQuery,
    createMonthlyPayrollQuery,
    getMonthlyPayrollQuery,
    getPayrollsQuery,
    getIsPaidQuery,
    changeIsPaidQuery,
    getPayrollForEmployeeQuery,
    addSalaryForNewEmployeeQuery
};