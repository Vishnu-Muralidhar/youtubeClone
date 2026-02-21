// require("dotenv").config({path:"./.env"});
import dotenv from "dotenv";
import connectDB from "./db/db_init.js";


dotenv.config({path:"./.env"});
connectDB();







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