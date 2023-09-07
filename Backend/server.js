import app from "./app.js";
import dotenv from 'dotenv'
import connectDatabase from "./config/database.js"
import cloudinary from 'cloudinary'
if(process.env.NODE_ENV!=="PRODUCTION"){
dotenv.config({ path: "Backend/config/config.env" })
}
connectDatabase()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

process.on("uncaughtException",err=>{
    console.log(`Error:${err.message}`)
    console.log(`Shutting down server due to uncaught exception`)
    process.exit(1)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`server is running`)
})
process.on("unhandledRejection", err => {
    console.log(`Error:${err.message}`)
    console.log(`shutting down server due to unhandled promise rejection`)
    server.close(() => {
        process.exit(1)
    })
})