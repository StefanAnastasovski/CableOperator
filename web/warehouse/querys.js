let conn = require('../database');

getWarehouseInfoQuery = () => {
    const query = `
        SELECT *
        FROM warehouse`;

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

enterInfoInWarehouseQuery = (bodyInfo) => {

    let info = [bodyInfo.cl_contract, bodyInfo.package, bodyInfo.description];

    const query = `
        INSERT INTO warehouse(cl_contract, package, description)
        VALUES (?, ?, ?) `;

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
    getWarehouseInfoQuery,
    enterInfoInWarehouseQuery
};
