
import express from 'express';
import db from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router()

router.post('/employeelogins', (req, res) => {
    /* to check input usr name and id with data base for login  */

    const sql = "SELECT * FROM `employee` WHERE email = ?"
     db.query(sql,[req.body.email],(err,result) => {
  
        if (err) return res.json({ loginStatus: false, Error: "Query Error"});
        if (result.length > 0) {

            bcrypt.compare(req.body.password,result[0].password, (err,response)=>{
                if (err) return res.json({ loginStatus: false, Error: "Wrong Password"});  
                if(response){
                 
                    const email = result[0].email; /*match here email */

                    /*agar email match hai to genereate token */
                    const token = jwt.sign({/*payload */ role: "employee", /*for payload match*/ email: email, id:result[0].id /*decode id for access role base access*/}, /*secrete key */"jwt_secret_key", { expiresIn: "1d" });
                    res.cookie('token', token) /*to match the token and stored it in coockies */
            
                    return res.json({ loginStatus: true, id:result[0].id });


                }
            })
        }else{
        return res.json({ Status: false, Error:"provide correct userId & passward" })
    }
})
})



//fetching employee details for employee page of users
router.get('/employeeDetails/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM `product` WHERE id = ?";
    db.query(sql,[id] ,(err, result) => {
        if (err) return res.json({ Status: false });
        return res.json(result);
        
    })
})


//logout users
router.get('/logout',(req,res) => {
res.clearCookie('token')
return res.json({Status:true})
})

export {router as employeeRouter}