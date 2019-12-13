let date = require('date-and-time');
const randomInt = require('random-int');


checkWorkingHours = (hours) => {
    return hours === '40';
};

let getDaysInMonth = function (year, month) {
    //January 1
    //Day 0 is the last day in the previous month
    return new Date(year, month + 1, 0).getDate();

};

checkIfIsWeekend = (day) => {
    return day === 6 || day === 0;
};

whatDayIsIt = (day) => {
    let days = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    };

    if (day >= 0 && day <= 6) {
        let dayKeys = Object.keys(days);
        return dayKeys.reduce((acc, currValue) => {
            if (parseInt(day) === parseInt(currValue)) {
                acc = Object.values(days)[currValue];
            } else if (parseInt(day) === 0) {
                acc = Object.values(days)[0];
            }
            return acc;
        });
    } else {
        return 'Wrong parameter!';
    }

};

populateSchedule = (emInfo, year, month) => {

    if (month > 0 && month <= 12) {
        month = month - 1; // 0-11
        let daysInMonth = getDaysInMonth(year, month);

        let shift = {
            "first": 1,
            "second": 2,
            'halfFirst': 3,
            'halfSecond': 4,
            'OFF': 5
        };

        let day;
        let query = {};
        let array = [];
        let isWeekend = true;
        let weekShift;
        let nextWeekShift;
        let week = true;
        let flag = true;
        let randomShift;
        let workHours = "full";

        emInfo.map((item) => {
            if (!checkWorkingHours(item.working_hours)) {
                workHours = 'half'
            }

            randomShift = randomInt(1, 2);

            if (randomShift === 1) {
                weekShift = workHours === 'half' ? shift.halfFirst : shift.first;
                nextWeekShift = workHours === 'half' ? shift.halfSecond : shift.second;
            } else {
                weekShift = workHours === 'half' ? shift.halfSecond : shift.second;
                nextWeekShift = workHours === 'half' ? shift.halfFirst : shift.first;
            }

            for (var i = 1; i <= daysInMonth; i++) {
                day = new Date(year, month, i);
                if (!checkIfIsWeekend(day.getDay())) {
                    isWeekend = false;

                    if (week) {
                        query = {
                            employee_umcn: item.pi_umcn,
                            work_date: date.format(day, 'YYYY-MM-DD'),
                            day_of_week: whatDayIsIt(day.getDay()),
                            is_weekend: isWeekend,
                            shift_id: weekShift
                        };
                        array.push(query);
                        flag = false;

                    } else {
                        query = {
                            employee_umcn: item.pi_umcn,
                            work_date: date.format(day, 'YYYY-MM-DD'),
                            day_of_week: whatDayIsIt(day.getDay()),
                            is_weekend: isWeekend,
                            shift_id: nextWeekShift
                        };
                        array.push(query);
                        flag = true;
                    }

                } else {
                    isWeekend = true;
                    if (week && !flag)
                        week = false;
                    else if (!week && flag) {
                        week = true;
                    }
                    query = {
                        employee_umcn: item.pi_umcn,
                        work_date: date.format(day, 'YYYY-MM-DD'),
                        day_of_week: whatDayIsIt(day.getDay()),
                        is_weekend: isWeekend,
                        shift_id: shift.OFF
                    };
                    array.push(query);
                }

            }

        });

        return array;
    } else {
        return 'Wrong parameter! Try Again: [1-12]';
    }

};

module.exports = {
    populateSchedule
};