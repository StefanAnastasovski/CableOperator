
logger = (req, res, next) => {
    console.log(`Logged ${req.url} - ${req.method} --- ${new Date()}`);
    next();
};

emptyBody = (req, res, next) => {
    let method = req.method;
    let keys = Object.keys(req.body);
    let values = Object.values(req.body);
    if (keys.length === 0 && values.length === 0)
        if ((method === "POST" || method === "PUT" || method === "PATCH")) {
            var error = new Error("Empty Body!");
            error.status = 400;
            error.method = method;
            console.log(`Logged ${method} with empty body!`);
        }
            next();
};

wrongRoute = (req, res, next) => {
    var error = new Error("Not found. Please try with another route!");
    error.status = 404;
    error.method = req.method;
    next(error);
};

errorHandler = (err, req, res, next) => {
    var errorObj = {
        status: err.status,
        method: err.method,
        error: {
            message: err.message
        }
    };

    res.status(err.status).json(errorObj);
};

module.exports = {
    logger,
    wrongRoute,
    errorHandler,
    emptyBody
};