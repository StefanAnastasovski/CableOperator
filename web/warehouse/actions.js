let querys = require('./querys');

let {reviseDateAndTime} = require('../helper');

getWarehouseInfo = async (req, res) => {
    try {
        let warehouse = await querys.getWarehouseInfoQuery();
        reviseDateAndTime(warehouse);
        res.status(200).send(warehouse);
    } catch (error) {
        console.log("Error: " + error.sqlMessage);
        res.status(500).send(error);
    }

};

enterInfoInWarehouse = async (req, res) => {
    let bodyInfo = req.body;

    try {
        await querys.enterInfoInWarehouseQuery(bodyInfo);
        res.status(200).send("Information successfully entered!");
    } catch (error) {
        console.log("Error: " + error.sqlMessage);
        res.status(500).send(error);
    }

};

module.exports = {
    getWarehouseInfo,
    enterInfoInWarehouse
};