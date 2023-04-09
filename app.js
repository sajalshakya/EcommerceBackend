const express = require('express');

const auth_route = require('./route/auth');
const product_route =  require('./route/product');
const order_route =  require('./route/order');


const app = express();

app.use(express.static('uploads'))

app.use(express.json())

app.use('/api', auth_route);
app.use('/api', product_route);
app.use('/api', order_route);


app.use((err,req,res,next) => {
    console.log(err.message);
    let status_code = 500;
    let msg = "Server Error"
    let errors = [];

    if(err.name === "ValidationError"){
        status_code = 400;
        msg = "Bad request"
        Object.entries(err.errors).map(error => {
            errors.push({
                params: error[0],
                msg:error[0].message
            })
        })
    }else{
        if(err.code === 11000){
            status_code = 400;
            msg = "Bad request"
            errors.push({
                params: "email",
                msg:"duplicate Emails"
            })
        }
    }
    
    res.status(status_code).send({
        msg:msg,
        errors,
        error: err.message
    })
})


require('dotenv').config()
require("./config/database")
app.listen(process.env.PORT, () => {
    console.log("Server Started");
})