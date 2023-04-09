const { body, validationResult } = require('express-validator');
const jwt =  require('jsonwebtoken');

const expressValidate = require('./expressValidate')

const login_middleware = expressValidate([
    body('email').notEmpty().withMessage("Required field"),
    body('password').notEmpty().isLength({ min: 8 }).withMessage("Required field")
])
const signup_middleware = expressValidate([
    body('name').notEmpty().withMessage("Required field"),
    body('email').notEmpty().withMessage("Required field"),
    body('role').notEmpty().withMessage("Required field"),
    body('password').notEmpty().isLength({ min: 8 }).withMessage("Required field"),
])
const checkAuthentication = async (req,res,next) => {
    let logged =  false;

    let token  =  req.headers.authorization?.split(" ")[1] || null
    if(token){
        try{
            let decoded = await jwt.verify(token, 'shhhhh');
            req.user = decoded;
            if(decoded){
                return next();
            }
        }catch(err){

        }
    }
    res.status(401).send({
        data: "not logged in."
    })
}
const isSeller = (req,res,next) => {
    if(req.user.role == "seller"){
        next()
    }else{
        return res.status(403).send({
            data: "Access denied"
        })
    }
}
const isBuyer = (req,res,next) => {
    if(req.user.role == "buyer"){
        next()
    }else{
        return res.status(403).send({
            data: "Access denied"
        })
    }
}

module.exports = {
    login_middleware,
    signup_middleware,
    checkAuthentication,
    isSeller,
    isBuyer
}