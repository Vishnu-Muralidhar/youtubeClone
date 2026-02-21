class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors = [],
        stack =[]
       
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.messagee = message
        this.success = false
        this.errors = errors

        if(stack){ // this u can avoid for now
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
    
}

export {ApiError}