let date = require('date-and-time');

let {createRegisterQuery} = require('./querys');


currentDate = () =>{
    let now = new Date();
    now = date.format(now, 'YYYY-MM-DD');
    return now;
};

createRegister = async () =>{
    try{

        for(var i = 1; i <= 3; i++){
            var regInfo = [i, 0, 0];
            await createRegisterQuery(regInfo);
        }
    }
    catch (e) {
        console.log("Error: " + e.sqlMessage);
    }
};


module.exports = {
    currentDate,
    createRegister
};
