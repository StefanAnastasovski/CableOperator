let conn = require('../database');

getClientInfoQuery = (umcn) => {
    let query;
    //get specific client
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
                   cl_type,
                   cl_status,
                   account_number
            FROM client_information as ci,
                 personal_information as pi,
                 bank_account as ba

            WHERE ci.pi_umcn = ?
              and pi.umcn = ci.pi_umcn
              and ci.ba_accNum = ba.account_number`;
    }
    //get all clients
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
                   cl_type,
                   cl_status,
                   account_number
            FROM client_information as ci,
                 personal_information as pi,
                 bank_account as ba
            WHERE pi.umcn = ci.pi_umcn
              and ci.ba_accNum = ba.account_number`;
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

getClientTableInfoQuery = () => {
    const query = 'select cl_status, cl_type from client_information';
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

getClientsStatusQuery = (status) => {
    const query = `
        SELECT first_name,
               last_name,
               umcn,
               birth_date,
               address,
               identity_card,
               phone_number,
               cl_type,
               cl_status
        FROM client_information as ci,
             personal_information as pi,
             bank_account as ba
        WHERE ci.cl_status = ?
          and pi.umcn = ci.pi_umcn
          and ci.ba_accNum = ba.account_number`;

    return new Promise((resolve, reject) => {
        conn.query(query, status, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

createSpecificClientQuery = (body) => {
    const query = 'INSERT INTO  client_information(cl_status, cl_type, pi_umcn, ba_accNum) VALUES(?, ?, ?, ?)';
    let info = [body.cl_status, body.cl_type, body.umcn, body.account_number];
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

changeClientQuery = (body, umcn) => {
    let query = `
        UPDATE
            client_information as ci,
            personal_information as pi
        SET ci.cl_status = ?
        WHERE ci.pi_umcn = ?
          and pi.umcn = ci.pi_umcn`;

    var info = [body.cl_status, umcn];

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
    getClientInfoQuery,
    getClientTableInfoQuery,
    getClientsStatusQuery,
    createSpecificClientQuery,
    changeClientQuery
};