let querys = require('./querys');

let {checkBodyArgs} = require('./common');
let {reviseDateAndTime, checkUmcnOrAccNumber} = require('../helper');

getPersonalInformation = async (req, res) => {
    try {
        const client = await querys.getPersonalInformationQuery();
        reviseDateAndTime(client);
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error);
    }

};

createPersonalInformation = async(req, res) => {
        let bodyInfo = req.body;

        try {
            await querys.createPersonalInformationQuery(bodyInfo);
            res.status(200).send("Create is successful");
        } catch (error) {
            console.log("Error: " + error.sqlMessage);
            res.status(500).send(error);
        }

};

changePersonalInformation = async (req, res) => {
    let bodyInfo = req.body;
    let umcn = req.params.umcn;

    if (checkUmcnOrAccNumber(umcn) && checkBodyArgs(bodyInfo)) {
        try {
            let client = await querys.changePersonalInformationQuery(bodyInfo, umcn);

            if (client === 0) {
                res.status(400).send("Client Does Not Exist!");
            } else {
                res.status(200).send("Update is successful!");
            }
        } catch (error) {
            res.status(500).send(error);
        }

    } else {
        res.status(400).send("Wrong UMCN, must have 13 characters or something is wrong with body!");
    }

};

module.exports = {
    createPersonalInformation,
    getPersonalInformation,
    changePersonalInformation
};