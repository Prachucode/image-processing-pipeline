// way to implement global error handler in express

const errorhandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode).json({
        success: false,
        message: err.message
    })
}


export default errorhandler
// pass the message and status code in the controller 