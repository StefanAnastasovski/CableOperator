let conn = require('../database');

let {populateBills} = require('./common');

getAllBillsForClientQuery = (umcn) => {
    const query = `
        SELECT first_name,
               last_name,
               bill_id,
               monthly_bill,
               service,
               payment_due,
               price,
               is_paid

        FROM bill as b,
             personal_information as pi
        WHERE cl_umcn = ?
          and b.cl_umcn = pi.umcn;
    `;

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

createAllBillsQuery = async (clientInfo, billInfo, clientId) => {
    let query;
    let info;
    query = `
        INSERT INTO bill
            (monthly_bill, service, payment_due, bill_id, is_paid, price, cl_umcn, contract_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    let bills = await populateBills(clientInfo, billInfo, clientId);
    if(bills.length > 1){
        bills.forEach((item) => {
            info = [item.monthly_bill, item.service, item.payment_due,
                item.bill_id, item.is_paid, item.price, item.cl_umcn,
                item.contract_number];
            return new Promise((resolve, reject) => {
                conn.query(query, info,  (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        });
    } // bills.length === 1
    else if(typeof bills === 'object'){
        info = [bills.monthly_bill, bills.service, bills.payment_due,
            bills.bill_id, bills.is_paid, bills.price, bills.cl_umcn,
            bills.contract_number];
        return new Promise((resolve, reject) => {
            conn.query(query, info,  (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

};

checkIsBillExistQuery = (umcn, billInfo) =>{
        let date = billInfo.split('-');
        let query;
        let info;
        query = `
            SELECT COUNT(*) as total FROM bill
            WHERE cl_umcn = ?
                AND YEAR(monthly_bill) = ?
                AND MONTH(monthly_bill) = ?
    `;
        info = [umcn, date[0], date[1]];
            return new Promise((resolve, reject) => {
                conn.query(query, info,  (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results[0].total);
                    }
                });
            });
};

changeIsPaidBillQuery = (isPaid, umcn, date) => {
    let query;
    query = `
        UPDATE bill
        SET is_paid = ?
        WHERE cl_umcn = ?
          AND YEAR(monthly_bill) = ?
          AND MONTH(monthly_bill) = ?
    `;
    let info = [isPaid, umcn, date.year, date.month];
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

getBillForSpecificClientQuery = (umcn, date) => {
    let query;
    query = `
        SELECT first_name,
               last_name,
               bill_id,
               monthly_bill,
               service,
               payment_due,
               price,
               is_paid

        FROM bill as b,
             personal_information as pi
        WHERE cl_umcn = ?
          AND b.cl_umcn = pi.umcn
          AND YEAR(monthly_bill) = ?
          AND MONTH(monthly_bill) = ?`;

    return new Promise((resolve, reject) => {
        conn.query(query, [umcn, date.year, date.month], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

};

module.exports = {
    getAllBillsForClientQuery,
    createAllBillsQuery,
    changeIsPaidBillQuery,
    getBillForSpecificClientQuery,
    checkIsBillExistQuery
};
