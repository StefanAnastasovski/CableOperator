let querys = require('./querys');

let {getAllEmployeesUmcnQuery} = require('../employee/querys');

let {fixDateAndTime, currentDate} = require('../helper');

createMonthlySchedule = async (req, res) => {
    try {
        let nextMonth = currentDate().getMonth() + 2;
        let year = currentDate().getFullYear();
        if (nextMonth === 13) {
            nextMonth = 1;
            year += 1;
        }
        //check if schedule already created
        let isCreatedSchedule = await querys.getMonthlyScheduleQuery(year, nextMonth);
        if (isCreatedSchedule.length !== 0) {
            console.log('Is already created');
            res.status(200).send("Next Month's Schedule is already created!");
        } else {
            let employeesInfo = await getAllEmployeesUmcnQuery();
            await querys.createMonthlyScheduleQuery(employeesInfo, year, nextMonth);
            res.status(200).send("Next Month's Schedule is created!");
        }

    } catch (error) {
        res.status(500).send("error");
    }

};

createScheduleForSpecificMonth = async (req, res) => {
    let month = req.params.month;
    let year = req.params.year;
    try {

        let isCreateSchedule = await querys.getMonthlyScheduleQuery(year, month);
        if (isCreateSchedule.length !== 0) {
            console.log('is already created');
            res.status(200).send(`The schedule for ${year}-${month} is already created!`);
        } else {
            let employeeInfo = await getAllEmployeesUmcnQuery();
            await querys.createMonthlyScheduleQuery(employeeInfo, year, month);
            res.status(200).send("Next Month's Schedule is created!");
        }

    } catch (error) {
        res.status(500).send(error);
    }

};

getMonthlySchedule = async (req, res) => {

    try {
        if(req.params.month && req.params.year && req.params.umcn){
            let month = req.params.month;
            let year = req.params.year;
            let umcn = req.params.umcn;

            let schedule = await querys.getMonthlyScheduleQuery(year, month, umcn);
            fixDateAndTime(schedule);

            res.status(200).send(schedule);
        }
        else if (req.params.month && req.params.year) {
            let month = req.params.month;
            let year = req.params.year;

            let schedule = await querys.getMonthlyScheduleQuery(year, month);
            fixDateAndTime(schedule);

            res.status(200).send(schedule);
        }
        else{
            let nextMonth = currentDate().getMonth() + 2;
            let year = currentDate().getFullYear();
            if (nextMonth === 13) {
                nextMonth = 1;
                year += 1;
            }

            let schedule = await querys.getMonthlyScheduleQuery(year, nextMonth);
            fixDateAndTime(schedule);

            res.status(200).send(schedule);
        }

    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createMonthlySchedule,
    createScheduleForSpecificMonth,
    getMonthlySchedule
};