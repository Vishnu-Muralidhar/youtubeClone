import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"


export const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN, //allowed origins
    credentials: true//Allow the browser to send cookies, authorization headers, or TLS client certificates along with cross-origin requests.
    //“It’s okay to include authentication data when calling this backend from another origin.”
}))

/* 
You’ll definitely need credentials: true if:

You store JWT in HTTP-only cookies
You use session-based authentication
You want auto-login after refresh
*/


app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true, limit:"20kb"})) // extended means it can allow nested objects also
app.use(express.static("public")) //to serve static files from public folder
app.use(cookieParser()) // so that u can access the browser coookies and also able to set it


// routes import
import userRouter from "./routes/user.routes.js"

// routes declarartion
app.use("/api/v1/users", userRouter)