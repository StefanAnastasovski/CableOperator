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
let { yearChange} = require('../contract/common');

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
        let nextMonth = bills[0].monthly_bill;
        let flagForFirstMonth = 0;
        bills.forEach((item) => {
            if(flagForFirstMonth === 1){
                nextMonth = nextMonth.split('-');
                if(nextMonth[1] === '12'){
                    nextMonth = {
                        year : nextMonth[0],
                        month : nextMonth[1],
                        day : nextMonth[2]
                    };
                    nextMonth = yearChange(nextMonth);
                    nextMonth = nextMonth.year + "-" +
                        nextMonth.month + "-01";
                    console.log(nextMonth)
                }
                else{
                    nextMonth[1] =(parseInt(nextMonth[1]) + 1).toString();
                    nextMonth = nextMonth[0] + "-" + nextMonth[1] + "-1"
                }
                info = [nextMonth, item.service, item.payment_due,
                    item.bill_id, item.is_paid, item.price, item.cl_umcn,
                    item.contract_number];
            }
            else{
                info = [item.monthly_bill, item.service, item.payment_due,
                    item.bill_id, item.is_paid, item.price, item.cl_umcn,
                    item.contract_number];
                flagForFirstMonth = 1;
            }


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

checkIsBillExistQuery = (umcn, billInfo, contractNumber) =>{
        let date = billInfo.split('-');
        let query;
        let info;
        query = `
            SELECT COUNT(*) as total FROM bill
            WHERE cl_umcn = ?
                AND YEAR(monthly_bill) = ?
                AND MONTH(monthly_bill) = ?
                AND contract_number = ?
    `;
        info = [umcn, date[0], date[1], contractNumber];
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
