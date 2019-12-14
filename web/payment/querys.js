let conn = require('../database');


createPaymentQuery = (bodyInfo) => {
    let query;
    let info;
    query = `INSERT INTO
        payment(date_of_pay,time_of_pay, date_of_bill, price, bill_number, register_id, cl_id)
        VALUES(?, ?, ?, ?, ?, ?, ?)`;

    info = [bodyInfo.date_of_pay, bodyInfo.time_of_pay, bodyInfo.date_of_bill, bodyInfo.price,
        bodyInfo.bill_number, bodyInfo.register_id, bodyInfo.cl_id];

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

getAllPaymentsFromCurrentDayQuery = (date) => {
    let query;
    query = `SELECT register_id, cl_id, date_of_pay, time_of_pay,
       bill_number, date_of_bill, price
    FROM payment
    WHERE YEAR(date_of_pay) = ?
      AND MONTH(date_of_pay) = ?
      AND DAY(date_of_pay) = ?
      ORDER BY time_of_pay`;

    let info = [date.year, date.month, date.day];

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

getAllPaymentsByDateQuery = (date) => {
    let query;
    query = `SELECT register_id, cl_id, date_of_pay, time_of_pay,
       bill_number, date_of_bill, price
    FROM payment
    WHERE YEAR(date_of_pay) = ?
      AND MONTH(date_of_pay) = ?
      AND DAY(date_of_pay) = ?
      ORDER BY time_of_pay`;

    let info = [date.year, date.month, date.day];

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

getAllPaymentsByClientQuery = (umcn) => {
    let query;
    query = `SELECT register_id, cl_id, date_of_pay, time_of_pay,
       bill_number, date_of_bill, price
    FROM payment
    WHERE cl_id = ?
      ORDER BY date_of_bill`;


    return new Promise((resolve, reject) => {
        conn.query(query, [umcn], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    createPaymentQuery,
    getAllPaymentsFromCurrentDayQuery,
    getAllPaymentsByDateQuery,
    getAllPaymentsByClientQuery
};