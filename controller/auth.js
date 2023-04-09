const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');


const login = async (req,res,next) => {
    try{
            let user = await User.findOne({
                email:req.body.email
            })
            
            if(user){
                let user_pass_obj = await User.findOne({email:req.body.email}).select("password")
                let match_status = await bcrypt.compare(req.body.password, user_pass_obj.password)
                if(match_status){
                    let token = jwt.sign(user.toObject(), 'shhhhh');
                    return res.send({
                        token:token
                    })
                }
            }
        return res.status(401).send({
            msg: "invalid credential"
        });
    }catch(err){
       next(err); 
    }
    
}

const signup = async (req,res,next) => {
    let hashed_password= "";
    if(req.body.password){
       hashed_password = await bcrypt.hash(req.body.password, 10);
    }
    try{
        let user = await User.create({
            name:req.body.name,
            email:req.body.email,
            role:req.body.role,
            password:hashed_password
        })
        user = user.toObject();
        delete user.password

        res.send(user);
    }catch (err){
        next(err)
    }

}

module.exports = {
    login,
    signup
}