let conn = require('../database');

let {isEmpty} = require('./common');

getPersonalInformationQuery = () => {
    const query = 'SELECT first_name, last_name, umcn, birth_date, gender, address, identity_card, phone_number FROM personal_information';
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

createPersonalInformationQuery = (info) => {
    const query = 'INSERT INTO personal_information(first_name, last_name, umcn, birth_date, gender, address, identity_card, phone_number) VALUES (?,?,?,?,?,?,?,?)';
    let arrayInfo = [info.first_name, info.last_name, info.umcn, info.birth_date, info.gender, info.address, info.identity_card, info.phone_number];
    return new Promise((resolve, reject) => {
        conn.query(query, arrayInfo, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

getPersonalInformationByUmcnQuery = (umcn) => {
    const query = 'SELECT * FROM personal_information  WHERE umcn = ?';
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

changePersonalInformationQuery = async (bodyInfo, umcn) => {
    let client = await getPersonalInformationByUmcnQuery(umcn);

    if (!isEmpty(client)) {
        const query = 'UPDATE personal_information SET address = ?, phone_number = ? WHERE umcn = ?';
        return new Promise((resolve, reject) => {
            conn.query(query, [bodyInfo.address, bodyInfo.phone_number, umcn], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
    else{
       let flag = 0;
       return flag;
    }
};

module.exports = {
    getPersonalInformationQuery,
    createPersonalInformationQuery,
    changePersonalInformationQuery,
    getPersonalInformationByUmcnQuery
};