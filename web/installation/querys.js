let conn = require('../database');

getAllInstallationsQuery = () =>{
    const query = `SELECT
                       cl_id, contract_number,
       installation_date, contract_number, is_finished,
       wh_id, package, description,
       em_id  FROM installation as i, warehouse as wh
       WHERE i.wh_id = wh.cl_contract`;

    return new Promise((resolve, reject) => {
        conn.query(query,  (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

getAllInstallationsByDateQuery = (date) =>{
    let query;
    let info;
    if(date.day){

        query = `SELECT * 
        FROM installation
        WHERE YEAR(installation_date) = ?
        AND MONTH(installation_date) = ?
        AND DAY(installation_date) = ?`;
        info = [date.year, date.month, date.day];
    }
    else{
        query = `SELECT * 
        FROM installation
        WHERE YEAR(installation_date) = ?
        AND MONTH(installation_date) = ?`;
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

changeIsFinishedQuery = (isFinished, contract, date) => {
    let query;
    let info;

    if(date){
        console.log(date)
        query = `UPDATE installation 
        SET is_finished = ?, installation_date = ?
        WHERE contract_number = ?`;
        info = [isFinished, date, contract];

    }
    else{
        query = `UPDATE installation 
        SET is_finished = ?
        WHERE contract_number = ?`;
        info = [isFinished, contract];
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

createInstallationQuery = (bodyInfo) => {
    let query;
    let info;
    query = `INSERT INTO 
        installation(installation_date, contract_number, is_finished, em_id, cl_id, wh_id)
        VALUES(?, ?, ?, ?, ?, ?)`;
    info = [bodyInfo.installation_date, bodyInfo.contract_number, 0,
        bodyInfo.em_id, bodyInfo.cl_id, bodyInfo.wh_id
    ];

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
    getAllInstallationsByDateQuery,
    getAllInstallationsQuery,
    changeIsFinishedQuery,
    createInstallationQuery
};