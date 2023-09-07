import Errorhandler from "../utils/errorHandler.js"

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "internal server error"


    if(err.name==="CastError"){
        const message=`Resource not found. Invalid ${err.path}`
        err=new Errorhandler(message,400)
    }

    res.status(err.statusCode).json({
        message: err.message
    })

    if(err.name==='JsonWebTokenError'){
        const message="Json web token is Invalid try again"
        err=new Errorhandler(message,400)
    }
    if(err.name==='TokenExpiredError'){
        const message='Json web token is expired. try again'
        err=new Errorhandler(message,400)
    }
    console.log(err)
}

export default errorMiddleware