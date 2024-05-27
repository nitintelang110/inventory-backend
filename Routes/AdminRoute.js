import express from 'express';
import db from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer'; //to handle image upload
import path from 'path'


const router = express.Router();

//for get public folder in front to show images
//app.use(express.static('Public'))

//for login cross check
router.post('/adminlogin', (req, res) => {
    /* to check input usr name and id with data base for login  */
 console.log(req.body)
    const sql = "SELECT * from `admin` Where email =? and passward =?"
     db.query(sql, [req.body.email, req.body.passward], (err, result) => {
        
        if (err) return res.json({ loginStatus: false, Error: "Query Error"});
        if (result.length > 0) {
            const email = result[0].email; /*match here email */

            /*agar email match hai to genereate token */
            const token = jwt.sign({/*payload */ role: "admin", /*for payload match*/ email: email ,id:result[0].id /*decoding id for roll base accessing*/}, /*secrete key */"jwt_secret_key", { expiresIn: "15m" });

            res.cookie('token', token) /*to match the token and stored it in coockies */
            
        return res.json({ loginStatus: true ,Result:result });
        }else{
        return res.json({ loginStatus: false, Error:"provide correct userId & passward" })
    }
})
})

//for add new admin
router.post("/register", (req, res) => {
    
    const sql = "INSERT INTO admin (`name`,`email`,`passward`) VALUES (?)"
      const values = [
        req.body.name,
        req.body.email,
       req.body.passward     
]
    db.query(sql,[values],(err,result)=>{
if (err) {
    return res.json({ Status: false, Error: "network error" + err });
} else {
    return res.json({ Status: true, Result: result });  
}
    }) 
})

//for add new category
router.post("/addcategory", (req,res)=>{
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    db.query(sql,[req.body.category.toUpperCase()],(err,result)=>{
if (err) {
    return result.json({Status:false, Error:"Network Error"})
} else {
  return res.json({Status:true})  
}
    }) 
})

//for add new party
router.post("/addparty", (req,res)=>{
    
    const sql = "INSERT INTO party (`party_name`) VALUES (?)"
    db.query(sql,[req.body.party.toUpperCase()],(err,result)=>{
if (err) {
    return res.json({Status:false, Error:"Network Error"})
} else {
  return res.json({Status:true})  
}
    }) 
})



//for add new order
router.post("/addorder", (req,res)=>{

    const data = req.body;


    
    const sql = `INSERT INTO order_table (order_product_name,order_qty,rcd_order_qty,order_date,order_status,order_category,order_party,order_remark,order_no) VALUES ?`;

    let values = data.map(item => [item.order_product_name.toUpperCase(), item.order_qty,item.rcd_order_qty, item.order_date, item.order_status, item.order_category,item.order_party,item.order_remark.toUpperCase(),item.order_no]);

    

    db.query(sql,[values],(err,results,fields)=>{
if (err) {
    return res.json({Status:false, Error:"Network Error"})
} else {
  return res.json({Status:true, Result:results})  
}
    }) 
})




//for add new repair
router.post("/add_repair", (req,res)=>{

    const data = req.body;
    
    const sql = `INSERT INTO repair_process_table (order_product_name,order_qty,rcd_order_qty,order_date,order_status,order_category,order_party,order_remark,order_no) VALUES ?`;

    let values = data.map(item => [item.order_product_name.toUpperCase(), item.order_qty,item.rcd_order_qty, item.order_date, item.order_status, item.order_category,item.order_party,item.order_remark.toUpperCase(),item.order_no]);

    

    db.query(sql,[values],(err,results,fields)=>{
if (err) {
    return res.json({Status:false, Error:"Network Error"})
} else {
  return res.json({Status:true, Result:results})  
}
    }) 
})



//for access admin name
router.get("/adminname", (req, res) => {
     const id = req.params.id;
    const sql = "SELECT * FROM `admin`"
    db.query(sql,(err, result) => {
       
        if (err) {
            return result.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})


//for access new added category
router.get("/addcategory",(req,res)=>{
    const sql = "SELECT * FROM `category`"
    db.query(sql, (err, result) => {
       
        if (err) {
            return result.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})

//for access new added party
router.get("/party",(req,res)=>{
    const sql = "SELECT * FROM `party`"
    db.query(sql, (err, result) => {
       
        if (err) {
            return result.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})

//for access category for edit
router.get("/editcategory/:id", (req, res) => {
    
    const id = req.params.id;
 
    const sql = "SELECT * FROM category WHERE id = ?"
  
    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result[0].name})  
          
        }
    
    })
})

//for access party for edit
router.get("/editparty/:id", (req, res) => {
    
    const id = req.params.id;
 
    const sql = "SELECT * FROM party WHERE id = ?"
  
    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result[0].party_name})  
          
        }
    
    })
})

//for edited party
router.put("/editedparty/:id", (req, res) => {

  
    const id = req.params.id;
    const sql = "UPDATE `party` set party_name=? Where id = ?" 
    const values = [
      
        req.body.editParty.toUpperCase()
    ]
   
    db.query(sql, [values, id], (err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//for edited category
router.put("/editedcategory/:id", (req, res) => {

  
    const id = req.params.id;
    const sql = "UPDATE `category` set name=? Where id = ?" 
    const values = [
      
        req.body.category.toUpperCase()
    ]
   
    db.query(sql, [values, id], (err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})




//uploaded image stored in our public folder and help to find path and help to show
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    } //cb=callback , null =err , upload date 
})

const upload = multer({
    storage: storage    //for upload
})


//for add avl product to avl table
router.post("/add_avl_product", (req, res) => {

  const sql = "INSERT INTO `avl_product`(`avl_name`, `avl_qty`, `avl_category`,`avl_price`,`avl_total`, `order_no`,`order_id`, `given_qty`, `total_order_qty`, `total_rcd_qty`) VALUES (?)";
  
   //for multi input we use back tick for whole query
 
   const values = [

    req.body.avl_name.toUpperCase(),
    req.body.avl_qty,
    req.body.avl_category,
    req.body.avl_price,
    req.body.avl_total,
    req.body.order_no,
    req.body.order_id,
    req.body.given_qty,
    req.body.total_order_qty,
    req.body.total_rcd_qty,

   ]
   


   
    db.query(sql,[values],(err,result)=>{
if (err) {
    return res.json({Status:false, Error:"Network Error" + err})
} else {
  return res.json({Status:true ,Result:result})  
}
    })
       
}) 


//for edited order re submit
router.put("/update_exist_avl_product/:id", (req, res) => {

    const id = req.params.id;
    const begunTotal = req.body.avl_product_sum;
    const total = req.body.avl_price * req.body.rcd_order_qty;

    const sql = `UPDATE avl_product set avl_qty=${req.body.avl_qty},avl_total=${total + begunTotal},total_rcd_qty=${req.body.total_rcd_qty} Where order_id = ?` //for multi input we use back tick for whole query
    
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})



  

//for add avl product from direct purchase to avl table
router.post("/direct_purchase_add_avl_product", (req, res) => {
 
       const data = req.body;
       const sql = `INSERT INTO avl_product(avl_name,avl_qty,avl_category,avl_price,avl_total,order_no,order_id,given_qty,total_order_qty,total_rcd_qty) VALUES ?`; //for multi input we use back tick for whole query
 
    let values = data.map(item => [item.direct_rcd_name.toUpperCase(), item.direct_rcd_qty, item.direct_rcd_category,item.direct_rcd_price,item.direct_rcd_price*item.direct_rcd_qty, item.direct_order_no, item.direct_order_id, item.direct_given_qty,item.direct_rcd_qty,item.direct_rcd_qty] );
   
    db.query(sql,[values],(err,results,fields)=>{
if (err) {
    return res.json({Status:false, Error:"Network Error" + err})
} else {
  return res.json({Status:true ,Result:results})  
}
    })
       
}) 



//for add new received product into received product table
router.post("/receivedproduct",upload.single('image') ,(req, res) => {


  
    const sql = "INSERT INTO `received_product`(`rcd_name`, `order_qty`, `rcd_qty`, `rcd_category`,`rcd_party`, `rcd_price`,`rcd_total`, `rcd_description`,`order_date`,`rcd_date`, `rcd_status`, `rcd_image`,`order_no`,`order_id`) VALUES (?)" //for multi input we use back tick for whole query
 
    const values = [
      
            req.body.name.toUpperCase(),
            req.body.qty,
            req.body.rcd_qty,
            req.body.category,
            req.body.party,
            req.body.price,
            req.body.total,
            req.body.description.toUpperCase(),
            req.body.order_date,
            req.body.rcd_date,
            req.body.rcd_status,
            req.file.filename || '',
            req.body.order_no ,
            req.body.order_id
           
    ]
   
    db.query(sql,[values],(err,result)=>{
if (err) {
    return res.json({Status:false, Error:"Network Error" + err})
} else {
  return res.json({Status:true ,Result:result})  
}
    })
       
}) 
    

//for add new received product into received product table
router.post("/received_repair_product",upload.single('image') ,(req, res) => {


  
    const sql = "INSERT INTO `received_repair_order_table` (`rcd_rep_name`, `rcd_rep_category`, `rcd_rep_party`, `rep_qty`,`rcd_rep_qty`, `rep_status`,`repair_price`, `rep_order_date`,`rcd_rep_order_date`,`repair_order_id`, `repair_order_no`, `repair_description`,`rep_invoice_image`) VALUES (?)" //for multi input we use back tick for whole query
 
    const values = [

            req.body.name.toUpperCase(),
            req.body.category,
            req.body.party,
            req.body.qty,
            req.body.rcd_qty,
            req.body.rcd_status,
            req.body.price,
            req.body.order_date,
            req.body.rcd_date,
            req.body.order_id,
            req.body.order_no ,
            req.body.description.toUpperCase(),        
            req.file.filename || '',
    ]
   
    db.query(sql,[values],(err,result)=>{
if (err) {
    return res.json({Status:false, Error:"Network Error" + err})
} else {
  return res.json({Status:true ,Result:result})  
}
    })
       
}) 

//for add direct received product into received product table
router.post("/direct_purchase",(req, res) => {

    const data = req.body;
   // const img = req.file.filename;

      const sql = `INSERT INTO received_product(rcd_name,order_qty,rcd_qty,rcd_category,rcd_party,rcd_price,rcd_total,rcd_description,order_date,rcd_date,rcd_status,order_no,order_id) VALUES ?` //for multi input we use back tick for whole query
    
    let values = data.map(item => [ item.direct_rcd_name.toUpperCase(), item.direct_rcd_qty, item.direct_rcd_qty, item.direct_rcd_category, item.direct_rcd_party, item.direct_rcd_price, item.direct_rcd_price*item.direct_rcd_qty, item.direct_rcd_description.toUpperCase(), item.direct_order_date, item.direct_rcd_date, item.direct_rcd_status, item.direct_order_no, item.direct_order_id] );
     
      db.query(sql,[values],(err,results,fields)=>{
  if (err) {
      return res.json({Status:false, Error:"Network Error" + err})
  } else {
    return res.json({Status:true ,Result:results})  
  }
      })
         
  }) 



//for add new given product
router.post("/givethisproduct", (req, res) => {
 
    const sql = "INSERT INTO givenproduct(`name`, `givenqty`, `category`, `given_suply_price`,`given_total_price`, `description`, `order_no`, `order_id`, `given_date`,`given_time`) VALUES (?)" //for multi input we use back tick for whole query
 
    const values = [
        req.body.given_name.toUpperCase(),
        req.body.given_qty,
        req.body.given_category,
        req.body.given_suply_price,
        req.body.given_total_price,
        req.body.description.toUpperCase(),
        req.body.order_no,
        req.body.order_id,
        req.body.given_date,
        req.body.given_time,
      
]

    db.query(sql,[values],(err,result)=>{
if (err) {

    return res.json({Status:false, Error:"Network Error" + err})
} else {
  return res.json({Status:true ,Result:result})  
}
    })
       
    }) 



    //for add out of stock product
router.post("/outofstock", (req, res) => {
 
    const sql = "INSERT INTO outofstock(`order_no`,`name`,  `rcdqty`,`givenqty`, `avlqty`, `category`,  `order_id`) VALUES (?)" //for multi input we use back tick for whole query
 
    const values = [
        req.body.order_no,
        req.body.given_name.toUpperCase(),
        req.body.given_qty,
        req.body.given_qty,
        req.body.given_qty - req.body.given_qty,
        req.body.given_category,
        req.body.order_id,
      
    ]
    console.log(values)

    db.query(sql,[values],(err,result)=>{
if (err) {

    return res.json({Status:false, Error:"Network Error" + err})
} else {
  return res.json({Status:true ,Result:result})  
}
    })
       
    }) 


//for access all avl products from rceivable table
router.get("/avl_product",(req,res)=>{
    const sql = "SELECT * FROM `avl_product`"
     
    db.query(sql, (err, result) => {
     
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})


//for access all outofstock products from outofstock table
router.get("/outofstock_product",(req,res)=>{
    const sql = "SELECT * FROM `outofstock`"
     
    db.query(sql, (err, result) => {
     
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})


// for delete outofstock product
router.delete("/delete_outofstock_product/:id", (req, res) => {
  
    const id = req.params.id;
    const sql = "DELETE FROM `outofstock` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//for access order list
router.get("/getorder",(req,res)=>{
    const sql = "SELECT * FROM `order_table`"
     
    db.query(sql, (err, result) => {
     
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})


//for access order list
router.get("/received_inprocess_order",(req,res)=>{
    const sql = "SELECT * FROM `received_repair_order_table`"
     
    db.query(sql, (err, result) => {
     
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})








//for access old order product sum from avl product

router.get("/total_amount/:id", (req, res) => {
    
    const orderid = req.params.id;
    
    const sql = "SELECT `avl_product`.`avl_total` FROM `avl_product` Where `avl_product`.`order_id` = ? "
    db.query(sql, [orderid], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//for access order list
router.get("/get_repair_process",(req,res)=>{
    const sql = "SELECT * FROM `repair_process_table`"
     
    db.query(sql, (err, result) => {
     
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})


//for access given product
router.get("/givenproducts",(req,res)=>{
    const sql = "SELECT * FROM `givenproduct`"
     
    db.query(sql, (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})

//for access received product total amount
router.get("/receivedTotalReceivedAmount",(req,res)=>{
    const sql = "SELECT * FROM `avl_product`"
     
    db.query(sql, (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})

//for access received product
router.get("/receivedproducts",(req,res)=>{
    const sql = "SELECT * FROM `received_product`"
     
    db.query(sql, (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
        }
    })
})

// edit avl product to suply
router.get("/avl_suply_product/:id", (req, res) => {
    
    const id = req.params.id;
    const sql = "SELECT * FROM `avl_product` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})



// for edit order
router.get("/edit_order/:id", (req, res) => {
    
    const id = req.params.id;
    const sql = "SELECT * FROM `order_table` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//for edited order re submit
router.put("/edited_order/:id", (req, res) => {

    const id = req.params.id;
    const sql = `UPDATE order_table set order_product_name=?,order_qty=?,order_date=?,order_status=?,order_category=?,order_party=?,order_remark=? Where id = ?` //for multi input we use back tick for whole query
    const values = [
        req.body.order_product_name.toUpperCase(),
        req.body.order_qty,
        req.body.order_date,
        req.body.order_status,
        req.body.order_category,
        req.body.order_party,
        req.body.order_remark.toUpperCase()
       // req.file.filename, 
    ]
    
    db.query(sql, [...values, id], (err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//for add update when order received
router.put("/order_table_update/:id", (req,res)=>{
    const id = req.params.id;
    
    const sql = `UPDATE order_table set rcd_order_qty=?,order_status=? where id = ?`;
   
    let values =[

        req.body.rcd_order_qty,
        req.body.order
    ]
    db.query(sql,[...values,id],(err,results)=>{
if (err) {
    return res.json({Status:false, Error:"Network Error"})
} else {
  return res.json({Status:true, Result:results})  
}
    }) 
})


//for add update when repair order received
router.put("/repair_process_table_update/:id", (req,res)=>{
    const id = req.params.id;
   
    const sql = "UPDATE `repair_process_table` set rcd_order_qty=?,order_status=? Where `repair_process_table`.`id` = ?";
   
    let values =[

        req.body.rcd_order_qty,
        req.body.order
    ]

   

    db.query(sql,[...values,id],(err,results)=>{
if (err) {
    return res.json({Status:false, Error:"Network Error"})
} else {
  return res.json({Status:true, Result:results})  
}
    }) 
})

// for edit order to complete 
router.get("/getorder/:id", (req, res) => {
    
    const id = req.params.id;
    const sql = "SELECT * FROM order_table WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

// for edit order to complete 
router.get("/get_given_order_qty/:id", (req, res) => {
    
    const id = req.params.id;
    const sql = "SELECT `avl_product`.`given_qty` FROM `avl_product` WHERE `avl_product`.`order_id` = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})



// for edit order to complete 
router.get("/get_repair_order/:id", (req, res) => {
    
    const id = req.params.id;

 

    const sql = "SELECT * FROM `repair_process_table` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

// for edit received product 
router.get("/editreceivedproduct/:id", (req, res) => {
    
    const id = req.params.id;
    const sql = "SELECT * FROM `received_product` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})






// for getting direct purchase order id  product 
router.get("/order_id_for_direct_avl_product", (req, res) => {
    
  
    const sql = "SELECT MAX(id) AS last_id FROM received_product"
    db.query(sql,(err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})


// for delete employee
router.delete("/delete_avl_product/:id", (req, res) => {
  
    const id = req.params.id;
    const sql = "DELETE FROM `avl_product` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

// for delete employee
router.delete("/deleteOrder/:id", (req, res) => {
  
    const id = req.params.id;
    const sql = "DELETE FROM `order_table` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})


// for delete received repair order
router.delete("/delete_rcd_repair_Order/:id", (req, res) => {
  
    const id = req.params.id;
    const sql = "DELETE FROM `received_repair_order_table` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})



// for delete employee
router.delete("/deleteRepairOrder/:id", (req, res) => {
  
    const id = req.params.id;
    const sql = "DELETE FROM `repair_process_table` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})


// for delete from received products
router.delete("/deletereceivedproduct/:id", (req, res) => {
  
    const id = req.params.id;
    const sql = "DELETE FROM `received_product` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

// for delete from received products
router.delete("/deletegivenproduct/:id", (req, res) => {
  
    const id = req.params.id;
    const sql = "DELETE FROM `givenproduct` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})


// for delete party
router.delete("/delete_party/:id", (req, res) => {
    
    const id = req.params.id;
    
    const sql = "DELETE FROM `party` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

// for delete category
router.delete("/delete_category/:id", (req, res) => {
    
    const id = req.params.id;
    
    const sql = "DELETE FROM `category` WHERE id = ?"
    db.query(sql, [id], (err, result) => {
       
        if (err) {
            return res.json({Status:false, Error:"Network Error"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})



//for edited employee
router.put("/editedmployee/:id", (req, res) => {
   
    const id = req.params.id;
    const sql = `UPDATE product set name=?,qty=?,category=?,price=?,total=?,description=? Where id = ?` //for multi input we use back tick for whole query
    const values = [
         req.body.name.toUpperCase(),
        req.body.qty,
       req.body.category,
        req.body.price,
         req.body.total,
        req.body.description.toUpperCase()
       // req.file.filename, 
    ]
    
    db.query(sql, [...values, id], (err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//for edited received product
router.put("/updatereceivedproduct/:id", (req, res) => {
   
    const id = req.params.id;
    const sql = `UPDATE received_product set rcd_name=?,rcd_qty=?,rcd_category=?,rcd_party=?,rcd_price=?,rcd_total=?,rcd_description=? Where id = ?` //for multi input we use back tick for whole query
    const values = [
         req.body.rcd_name.toUpperCase(),
        req.body.rcd_qty,
       req.body.rcd_category,
       req.body.rcd_party,
        req.body.rcd_price,
         req.body.rcd_total,
        req.body.rcd_description.toUpperCase()
       // req.file.filename, 
    ]
    
    db.query(sql, [...values, id], (err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//for update avl qty
router.put("/updateavlqty/:id", (req, res) => { 
    const id = req.params.id;
       const values = [
       
           req.body.updateAvlQty,
            req.body.allGivenQty,
           // req.body.updateAvlTotal
    ]

  

    const sql = `UPDATE avl_product set avl_qty=?,given_qty=? where id = ?` //for multi input we use back tick for whole query 
 
    
    db.query(sql, [...values,id], (err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})



//for admin count on dashboard
router.get("/admin_count", (req, res) => {
    const sql = 'SELECT count(id) as admin from admin'
       db.query(sql,(err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//for employee count on dashboard
router.get("/employee_count", (req, res) => {
    const sql = 'SELECT count(id) as product from avl_product'
       db.query(sql,(err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//API for salary count on dashboard
router.get("/salary_count", (req, res) => {
    const sql = 'SELECT sum(avl_total) as total from avl_product'
       db.query(sql,(err, result) => {
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
          
        }
    })
})

//API for category count on dashboard
router.get("/category_count", (req, res) => {
    const sql = 'SELECT count(id) as name from category'
    db.query(sql, (err, result) => {
           
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
         
           }
           
    })
})

//API for party count on dashboard
router.get("/party_count", (req, res) => {
    const sql = 'SELECT count(id) as party_name from party'
    db.query(sql, (err, result) => {
           
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
         
           }
           
    })
})

//API for avl product count on dashboard
router.get("/avl_count", (req, res) => {
    const sql = `SELECT COUNT(CASE WHEN avl_qty > 0 THEN 1 END) AS avlqty 
      ,COUNT(CASE WHEN avl_qty = 0 THEN 1 END) AS outofstock
      FROM avl_product`
    db.query(sql, (err, result) => {
        
        if (err) {
            return res.json({Status:false, Error:"Network Error ahe bhau"})
        } else {
          return res.json({Status:true ,Result:result})  
         
           }
           
    })
})



//api for logout
router.get('/logout',(req,res) => {
res.clearCookie('token')
return res.json({Status:true})
})

export { router as adminRouter }