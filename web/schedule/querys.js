let conn = require('../database');
let {populateSchedule} = require('./common');


createMonthlyScheduleQuery = (umcn, year, month) => {

    let schedule = populateSchedule(umcn, year, month);

    let query;
    let info;

    //map
    schedule.forEach((item) => {

        query = `
            INSERT INTO employee_schedule
            (employee_umcn,
             work_date,
             day_of_week,
             is_weekend,
             shift_id)
            VALUES (?, ?, ?, ?, ?)`;
        info =
            [
                item.employee_umcn, item.work_date,
                item.day_of_week, item.is_weekend,
                item.shift_id
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

    });

};

getMonthlyScheduleQuery = (year, month, umcn) => {
    let query;
    let info;
    if (umcn) {
        info = [year, month, umcn];
        query = `
            select first_name,
                   last_name,
                   work_date,
                   day_of_week,
                   is_weekend,
                   shift,
                   hours_of_work,
                   start_at,
                   end_at

            FROM employee_schedule AS em,
                 shift AS s,
                 employee AS e,
                 personal_information AS pi
            WHERE  YEAR (work_date) = ?
              AND MONTH (work_date) = ?
              AND pi.umcn = ?
              AND em.shift_id = s.id
              AND em.employee_umcn = e.pi_umcn
            ORDER BY work_date`;
    } else {
        info = [year, month];

        query = `
            select first_name,
                   last_name,
                   work_date,
                   day_of_week,
                   is_weekend,
                   shift,
                   hours_of_work,
                   start_at,
                   end_at

            FROM employee_schedule AS em,
                 shift AS s,
                 employee AS e,
                 personal_information AS pi
            WHERE YEAR(work_date) = ?
              AND MONTH(work_date) = ?
              AND pi.umcn = e.pi_umcn
              AND em.shift_id = s.id
              AND em.employee_umcn = e.pi_umcn
            ORDER BY work_date`;
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

getScheduleByDayQuery = (year, month, day) => {
    let query;
    let info;

        info = [year, month, day];
        query = `
            select first_name,
                   last_name,
                   work_date,
                   day_of_week,
                   is_weekend,
                   shift,
                   hours_of_work,
                   start_at,
                   end_at

            FROM employee_schedule AS em,
                 shift AS s,
                 employee AS e,
                 personal_information AS pi
            WHERE  YEAR (work_date) = ?
              AND MONTH (work_date) = ?
              AND DAY(work_date) = ?
              AND em.shift_id = s.id
              AND em.employee_umcn = e.pi_umcn
            ORDER BY work_date`;

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



getScheduleForSpecificEmployeeQuery = (umcn, year, month) => {
    const query = `
        SELECT first_name,
               last_name,
               work_date,
               day_of_week,
               is_weekend,
               shift,
               hours_of_work,
               start_at,
               end_at
        FROM employee_schedule as em,
             shift as s,
             employee as e,
             personal_information as pi
        WHERE MONTH(work_date) = ?
          AND YEAR(work_date) = ?
          AND pi.umcn = ?
          AND pi.umcn = em.employee_umcn`;

    return new Promise((resolve, reject) => {
        conn.query(query, [month, year, umcn], (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    createMonthlyScheduleQuery,
    getMonthlyScheduleQuery,
    getScheduleForSpecificEmployeeQuery,
    getScheduleByDayQuery
};