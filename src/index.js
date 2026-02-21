// require("dotenv").config({path:"./.env"});
import dotenv from "dotenv";
import connectDB from "./db/db_init.js";
import { app } from "./app.js";

// config the env  
dotenv.config({path:"./.env"});

//listen for app errors
app.on("error", (err)=>{
    console.log("Express ERROR", err);
    throw err
})
// connect the database
connectDB() // it's an async method so returns a promise so handle that uing tehn and catch or u should have gone with try catch
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server Listening on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Error in connecting to database !!!: ", err);
    process.exit(1); //exit with failure
})































/**
import mongoose from "mongoose";
import {DB_NAME} from "./constants.js"
import express from "expres";
const app = express();
// db connection in iife
(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error", (err)=>{
            console.log("ERROR", err);
            throw err
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`Listening on port ${process.env.PORT}`);
        })
    }catch(error){
        console.log("ERROR", error);
        throw err
    }
})();   
*/