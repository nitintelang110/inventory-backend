import mysql from 'mysql2';


const db = mysql.createConnection({
    
    host:"localhost",
    user:"root",
    password:"usbw",
    database:"inventory"
    
})

db.connect(function (err){
    if (err){ 
    console.log(err)
} else {
       
        console.log("connected")
    }
})

export default db;