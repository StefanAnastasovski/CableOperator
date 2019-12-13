let conn = require('../database');


createContractQuery = (contractInfo) => {
    const query = `INSERT INTO contract(contract_date, contract_number, duration,
                                        expiration_date, address, monthly_price,
                                        service, description_service,
                                        em_id, cl_id)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let info = [contractInfo.contract_date, contractInfo.contract_number,
        contractInfo.duration, contractInfo.expiration_date,
        contractInfo.address, contractInfo.monthly_price,
        contractInfo.service, contractInfo.description_service,
        contractInfo.em_id, contractInfo.cl_id
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

getNumberOfContractForClientQuery = (umcn) => {
    const query = `SELECT COUNT(*) as total
                   FROM contract 
                   WHERE cl_id = ?`;

    return new Promise((resolve, reject) => {
        conn.query(query, umcn, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0].total);
            }
        });
    });
};

getAllContractsQuery = () => {
    const query = `SELECT first_name, last_name, contract_number, 
                    contract_date,  duration, expiration_date, 
                        c.address as contract_address, pi.address as client_address,
                        service, description_service, monthly_price
                   FROM contract as c, personal_information as pi
                   WHERE c.cl_id = pi.umcn
                   ORDER BY c.cl_id`;


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

getContractsForSpecificClientQuery = (umcn) => {
    const query = `SELECT first_name, last_name, contract_number, 
                    contract_date,  duration, expiration_date, 
                        c.address as contract_address, pi.address as client_address,
                        service, description_service, monthly_price, contract_number
                   FROM contract as c, personal_information as pi
                   WHERE c.cl_id = ? AND c.cl_id = pi.umcn
                   ORDER BY c.cl_id`;


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

getContractsByServiceQuery = (service) => {
    const query = `SELECT first_name, last_name, contract_number, 
                    contract_date,  duration, expiration_date, 
                        c.address as contract_address, pi.address as client_address,
                        service, description_service, monthly_price
                   FROM contract as c, personal_information as pi
                   WHERE c.service = ? AND c.cl_id = pi.umcn
                   ORDER BY c.cl_id`;

    return new Promise((resolve, reject) => {
        conn.query(query, service, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};


getContractNumberAndDateQuery = (clientUmcn) => {
    const query = `SELECT contract_number, contract_date
                FROM contract
                WHERE cl_id = ?
                ORDER BY id desc `;


    return new Promise((resolve, reject) => {
        conn.query(query, [clientUmcn], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
};

module.exports = {
    createContractQuery,
    getNumberOfContractForClientQuery,
    getAllContractsQuery,
    getContractsForSpecificClientQuery,
    getContractsByServiceQuery,
    getContractNumberAndDateQuery
};