import express from 'express'
import product from "./routes/productRoute.js"
import user from "./routes/userRoute.js"
import order from "./routes/orderRoute.js"
import payment from "./routes/paymentRoute.js"
import errorMiddleware from './middleware/error.js'
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import path from 'path'

if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({ path: "Backend/config/config.env" })
    }
const __dirname = path.resolve();
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

app.use("/api/v1",product)
app.use("/api/v1",user)
app.use('/api/v1',order)
app.use('/api/v1',payment)

app.use(express.static(path.join(__dirname,"./Frontend/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"./Frontend/build/index.html"))
})
app.use(errorMiddleware)

export default app