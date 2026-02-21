// // wrapper for async functions for better reusability, it's a higher order function
//This is a higher-order error wrapper used in production Express apps to handle async errors cleanly
const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err)=> next(err))
    }
}


export default {asyncHandler}


// const asyncHandler = ()=>{}
// const asyncHandler = (func)=> () =>{}
// const asyncHandler = (fn)=> async(req,res,next) =>{
//     try{
//         await fn(req,res,next)

//     } catch(error){
//         res.status(error.status || 500).json({
//             success:false,
//             error: error.message
//         })
//     }
// }