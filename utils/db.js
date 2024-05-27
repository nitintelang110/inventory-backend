import mysql from 'mysql2';


const db = mysql.createConnection({
    
    host:"localhost",
    user:"ntcoder1_inventory_app",
    password:"HoB%9nOMPHUA",
    database:"ntcoder1_inventory"
    
})

db.connect(function (err){
    if (err){ 
    console.log(err)
} else {
       
        console.log("connected")
    }
})

export default db;