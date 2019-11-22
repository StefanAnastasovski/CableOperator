

dateFormatSending = (wData) =>{
    wData = wData.getUTCFullYear() +"-" + (wData.getUTCMonth()+1) + "-" + (wData.getUTCDate());
    return wData;
};

dateFormatReceiving = (wData) =>{
    wData = wData.getUTCFullYear() +"-" + (wData.getUTCMonth()+1) + "-" + (wData.getUTCDate()+1);
    return wData;
};

module.exports = {
  dateFormatSending,
    dateFormatReceiving
};
