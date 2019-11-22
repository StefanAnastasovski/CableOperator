let {dateFormatReceiving} = require('../helper');

fixWorkday = (register) =>{
    register.forEach((item) =>{
        item.workday = dateFormatReceiving(item.workday);
    });
    return register;
};

currentDate = () =>{
    let now = new Date();
    now = dateFormatSending(now);
    return now;
};

sum2Numbers= (a, b) =>{
    let c = parseInt(a) + parseInt(b);
    return c;
};

module.exports = {
    fixWorkday,
    currentDate,
    sum2Numbers
};
