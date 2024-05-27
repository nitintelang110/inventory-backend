import express from 'express';
import cors from 'cors';
import { adminRouter } from './Routes/AdminRoute.js';
import { employeeRouter } from './Routes/EmployeeRoute.js';
import Jwt  from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors({
    /*store the token in browser cookies and to allow that token we use following code we provide three things */
    origin: ["https://inventory-frontend-puce.vercel.app/"],
    methods: ['GET', 'POST', 'PUT','DELETE'],
    credentials:true

}))
app.use(express.json());
app.use(cookieParser());
app.use('/auth', adminRouter);
app.use('/employee', employeeRouter);
app.use(express.static('Public')) //to access images from public

//verifying auth here is it login or not
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(token) {
        Jwt.verify(token, "jwt_secrete_key", (err, decoded) => {
            if(err) return res.json({Status:false,Error:"Wrong Token"})
        req.id = decoded.email;
        req.role = decoded.role;
        next()
        
        })
    } else {
        return res.json({Status:false,Error:"Not authenticated user"})
    }
}
app.get('/verify', verifyUser, (req, res) => {
  return res.json({Status:true,role:req.role,id:req.id})  
})

app.listen(3306,()=>{
    console.log("on port 3306")
})