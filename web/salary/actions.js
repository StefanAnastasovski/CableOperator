let querys = require('./querys');

let {getEmployeesUmcnQuery, getNeededSalaryInfoQuery, getNumberOfEmployeesQuery} = require('../employee/querys');
let {getCompanyBalanceQuery} = require('../bank_account/querys');

let {reviseDateAndTime} = require('../helper');
let {employeeIsPaid, checkIfCompanyBalanceIsEnough, reviseDateFromBody} = require('./common');

require('dotenv/config');

addSalaryForSpecificEmployeeAndMonth = async (req, res) => {
    let umcn = req.params.umcn;
    let bodyInfo = req.body;
    let revisedDateFromBody = reviseDateFromBody(bodyInfo.date);

    try {
        let companyBalance = await getCompanyBalanceQuery(process.env.ACCOUNTID);
        let salaryInfo = await getNeededSalaryInfoQuery(umcn);

        if (checkIfCompanyBalanceIsEnough(companyBalance, salaryInfo[0].em_salary)) {
            let paymant = await querys.getPayrollForEmployeeQuery(revisedDateFromBody, umcn);

            //check if payment is empty
            if (paymant.length === 0) {
                //if is_paid = 1 -> employee is paid
                if (bodyInfo.is_paid) {
                    await querys.createPayrollQuery(umcn, bodyInfo);
                    await employeeIsPaid(companyBalance, salaryInfo);
                    res.status(200).send("Salary successfully paid!");
                }
                //if is_paid = 0 -> employee is not paid
                else {
                    await querys.createPayrollQuery(umcn, bodyInfo);
                    res.status(200).send("We can not pay you!");
                }

            }
            //if exist and is_paid = 0, -> is_paid = 1, employee is paid
            else {

                let isPaid = await querys.getIsPaidQuery(umcn, revisedDateFromBody);
                if (isPaid[0].is_paid === 0) {
                    await querys.changeIsPaidQuery(umcn, revisedDateFromBody);
                    await employeeIsPaid(companyBalance, salaryInfo);
                    res.status(200).send("Salary successfully paid!");
                } else {
                    res.status(200).send(`${umcn} : Monthly salary is already paid!`);
                }

            }
        } else {
            res.status(200).send("We do not have enough money!");
        }

    } catch (error) {
        console.log("Error: " + error.sqlMessage);
        res.status(500).send(error);
    }

};

createMonthlyPayroll = async (req, res) => {
    let bodyInfo = req.body;
    let fixedDateFromBody = reviseDateFromBody(bodyInfo.date);
    try {
        let companyBalance = await getCompanyBalanceQuery(process.env.ACCOUNTID);
        let numberOfEmployees = await getNumberOfEmployeesQuery();
        let umcn = await getEmployeesUmcnQuery();

        //check if someone is already paid, if there is, pay the rest
        let specificEmployeeSalary = 0;
        let employeesUmcn = umcn.map(async (employee, index) => {
            let payment = await querys.getPayrollForEmployeeQuery(fixedDateFromBody, employee.pi_umcn);
            if (payment.length && payment[0].is_paid === 1) {
                umcn.splice(index, 1);
                specificEmployeeSalary = 1;
            }
        });

        await Promise.all(employeesUmcn);

        let allEmployeesSalary = 0;
        let salaryInfo = umcn.map(async (employee) => {
            let employeeInfo = await getNeededSalaryInfoQuery(employee.pi_umcn);
            allEmployeesSalary += parseInt(employeeInfo[0].em_salary);
            let object = {
                pi_umcn: employeeInfo[0].pi_umcn,
                account_number: employeeInfo[0].account_number,
                em_salary: employeeInfo[0].em_salary
            };
            return object;
        });
        const employeesSalaryInfo = await Promise.all(salaryInfo);

        if (checkIfCompanyBalanceIsEnough(companyBalance, allEmployeesSalary)) {
            //isEmpty contain rows where is_paid : 1 or is_paid : 0
            let isEmpty = await querys.getMonthlyPayrollQuery(fixedDateFromBody);
            //payment contain rows where is_paid : 0
            let payment = await querys.getPayrollForEmployeeQuery(fixedDateFromBody);
            //if empty
            // res.send(isEmpty);

            if (isEmpty.length === 0 || specificEmployeeSalary) {
                console.log(`${isEmpty.length}    ${umcn.length}`);
                if (isEmpty.length === numberOfEmployees) {
                    res.status(200).send("All employees are paid!");
                } else {
                    if (bodyInfo.is_paid) {
                        await querys.createMonthlyPayrollQuery(employeesSalaryInfo, fixedDateFromBody, bodyInfo.is_paid);
                        await employeeIsPaid(companyBalance, employeesSalaryInfo);
                        res.status(200).send("Monthly salary for all employees is paid!");
                    } else {
                        await querys.createMonthlyPayrollQuery(employeesSalaryInfo, fixedDateFromBody, bodyInfo.is_paid);
                        res.status(200).send("We can not pay you!");
                    }
                }

            }
            //not empty && is_paid = 0 in table, but body have is_paid = 1;
            else if (payment.length > 0 && bodyInfo.is_paid) {
                //if exist -> is_paid = 1
                payment.map(async (employee) => {
                    await querys.changeIsPaidQuery(employee.employee_id, fixedDateFromBody);
                });
                await employeeIsPaid(companyBalance, employeesSalaryInfo);
                //others paid
                if (payment.length !== umcn.length) {
                    await querys.createMonthlyPayrollQuery(employeesSalaryInfo, fixedDateFromBody, bodyInfo.is_paid);
                    await employeeIsPaid(companyBalance, employeesSalaryInfo);
                    res.status(200).send("Monthly salary for all employees is paid");
                }
                // res.status(200).send("Monthly payroll is completed!");
            } else if (payment.length > 0 && !bodyInfo.is_paid) {
                await querys.createMonthlyPayrollQuery(employeesSalaryInfo, fixedDateFromBody, bodyInfo.is_paid);
                res.status(200).send("We can not pay you!");
            } else {
                res.status(400).send("Monthly salary is already paid!");
            }
        } else {
            res.status(200).send("We do not have enough money to pay all employees");
        }


    } catch (error) {
        if (error.sqlMessage)
            console.log("Error: " + error.sqlMessage);
        res.status(500).send(error);
    }

};


getPayrolls = async (req, res) => {

    try {
        if (req.params.umcn) {
            const date = {
                year: req.params.year,
                month: req.params.month
            };
            let umcn = req.params.umcn;
            let salary = await querys.getPayrollsQuery(date, umcn);
            reviseDateAndTime(salary);
            res.status(200).send(salary);
        } else if (req.params.year && req.params.month) {
            const date = {
                year: req.params.year,
                month: req.params.month
            };
            let salary = await querys.getPayrollsQuery(date);
            reviseDateAndTime(salary);
            res.status(200).send(salary);
        } else {
            let salary = await querys.getPayrollsQuery();
            reviseDateAndTime(salary);
            res.status(200).send(salary);
        }

    } catch (error) {
        if (error.sqlMessage)
            console.log("Error: " + error.sqlMessage);
        res.status(500).send(error);
    }

};

module.exports = {
    addSalaryForSpecificEmployeeAndMonth,
    getPayrolls,
    createMonthlyPayroll
};