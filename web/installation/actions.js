let querys = require('./querys');

getAllInstallations = async (req, res) => {
    try {
        const installations = await querys.getAllInstallationsQuery();
        reviseDateAndTime(installations);
        res.status(200).send(installations);
    } catch (error) {
        res.status(500).send(error);
    }
};

getAllInstallationsByDate = async (req, res) => {
    let year = req.params.year;
    let month = req.params.month;
    let day = req.params.day;
    let date = day ?
        {year : year, month: month, day:day} :
        {year : year, month: month};
    try {
        const installations = await querys.getAllInstallationsByDateQuery(date);
        reviseDateAndTime(installations);
        res.status(200).send(installations);
    } catch (error) {
        res.status(500).send(error);
    }
};

changeIsFinished = async (req, res) => {
    let isFinished = req.params.isFinished;
    let contract = req.body.contract;
    let date = req.body.date;
    try {
        if(date){
            await querys.changeIsFinishedQuery(isFinished, contract, date);
            res.status(200).send('Successfully updated!');
        }
        else{
            await querys.changeIsFinishedQuery(isFinished, contract);
            res.status(200).send('Successfully updated!');
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    changeIsFinished,
    getAllInstallationsByDate,
    getAllInstallations

};