let conn = require('../database');

getEmployeeInfoQuery = (umcn) => {
    let query;
    //get specific employee
    if (umcn) {
        query = `
            SELECT first_name,
                   last_name,
                   umcn,
                   birth_date,
                   gender,
                   address,
                   identity_card,
                   phone_number,
                   hire_date,
                   em_status,
                   working_hours,
                   em_salary,
                   salary_bonus,
                   em_type,
                   account_number
            FROM employee as e,
                 personal_information as pi,
                 bank_account as ba
            WHERE e.pi_umcn = ?
              and pi.umcn = e.pi_umcn
              and e.ba_accNum = ba.account_number`;
    }
    // get all employees
    else {
        query = `
            SELECT first_name,
                   last_name,
                   umcn,
                   birth_date,
                   gender,
                   address,
                   identity_card,
                   phone_number,
                   hire_date,
                   em_status,
                   working_hours,
                   em_salary,
                   salary_bonus,
                   em_type,
                   account_number
            FROM employee as e,
                 personal_information as pi,
                 bank_account as ba
            WHERE pi.umcn = e.pi_umcn
              and e.ba_accNum = ba.account_number`;
    }

    return new Promise((resolve, reject) => {
        conn.query(query, umcn, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

createEmployeeQuery = (body, umcn) => {
    const query = `
        INSERT INTO employee(hire_date, em_status, working_hours, em_salary,
                             salary_bonus, em_type, pi_umcn, ba_accNum)
        VALUES (?, ?, ?, ?, '0', ?, ?, ?)`;

    let info = [body.hire_date, body.em_status, body.working_hours, body.em_salary, body.em_type, body.umcn, body.account_number, umcn];
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

getAllEmployeesWorkStatusQuery = (status) => {
    const query = `
        SELECT first_name,
               last_name,
               umcn,
               birth_date,
               gender,
               address,
               identity_card,
               phone_number,
               hire_date,
               em_status,
               working_hours,
               em_salary,
               salary_bonus,
               em_type,
               account_number
        FROM employee as e,
             personal_information as pi,
             bank_account as ba
        WHERE e.em_status = ?
          and pi.umcn = e.pi_umcn
          and e.ba_accNum = ba.account_number`;

    return new Promise((resolve, reject) => {
        conn.query(query, status, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                console.log(results);
                resolve(results);
            }
        });
    });
};

getAllEmployeesByTypeQuery = (type) => {
    const query = `
        SELECT first_name,
               last_name,
               umcn,
               birth_date,
               gender,
               address,
               identity_card,
               phone_number,
               hire_date,
               em_status,
               working_hours,
               em_salary,
               salary_bonus,
               em_type,
               account_number
        FROM employee as e,
             personal_information as pi,
             bank_account as ba
        WHERE e.em_type = ?
          and pi.umcn = e.pi_umcn
          and e.ba_accNum = ba.account_number`;

    return new Promise((resolve, reject) => {
        conn.query(query, type, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                console.log(results);
                resolve(results);
            }
        });
    });
};

changeEmployeeStatusOrBonusQuery = (body, umcn) => {
    let query;
    let info;
    if (body.status && body.bonus) {
        info = [body.status, body.bonus, umcn];
        query = `
            UPDATE
                employee as e
            SET e.em_status    = ?,
                e.salary_bonus = ?
            WHERE e.pi_umcn = ?`;
    } else {
        if (body.status) {
            info = [body.status, umcn];
            query = `
                UPDATE
                    employee as e
                SET e.em_status = ?
                WHERE e.pi_umcn = ?`;
        } else {
            info = [body.bonus, umcn];
            query = `
                UPDATE
                    employee as e
                SET e.salary_bonus = ?
                WHERE e.pi_umcn = ?`;
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

getAllEmployeesUmcnQuery = () => {
    const query = `
        SELECT pi_umcn, working_hours
        FROM employee`;

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

getEmployeesUmcnQuery = () => {
    const query = `
        SELECT pi_umcn
        FROM employee`;

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

getNeededSalaryInfoQuery  = (umcn) => {
    let query;
    if(umcn) {
        query = `
        SELECT pi_umcn, account_number, em_salary
        FROM employee as e, bank_account as ba
        WHERE
             (pi_umcn = ? and e.ba_accNum = ba.account_number)
             `;
    }
    else{
        query = `
        SELECT pi_umcn, account_number, em_salary
        FROM employee as e, bank_account as ba
        WHERE
             e.ba_accNum = ba.account_number`;
    }


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

getNumberOfEmployeesQuery = () => {
    const query = `
        SELECT count(pi_umcn) as total
        FROM employee`;

    return new Promise((resolve, reject) => {
        conn.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].total);
            }
        });
    });
};

module.exports = {
    getEmployeeInfoQuery,
    createEmployeeQuery,
    getAllEmployeesWorkStatusQuery,
    getAllEmployeesByTypeQuery,
    changeEmployeeStatusOrBonusQuery,
    getAllEmployeesUmcnQuery,
    getNeededSalaryInfoQuery,
    getEmployeesUmcnQuery,
    getNumberOfEmployeesQuery
};