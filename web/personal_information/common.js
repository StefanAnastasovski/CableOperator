checkBodyArgs = (body) =>{
    return Object.keys(body).length === 2;
};

isEmpty = (client) => {
    return client.length === 0;
};

module.exports = {
    checkBodyArgs,
    isEmpty
};