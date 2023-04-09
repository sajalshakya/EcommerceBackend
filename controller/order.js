const Order = require('../model/Order')

const getOrders = async (req,res,next) => {
    let order = await Order.find({created_by: req.user._id});
    res.send(order)
}
const storeOrders = async (req,res,next) => {
    try{
        if(req.body.products?.length > 0){
            let order = await Order.create({
                products: req.body.products,
                created_by: req.user._id
            })
            res.send(order)
        }else{
            res.status(400).send({
                data:"There should be atleast 1 product"
            })
        }
    }catch(err){
        next(err);
    }
}

module.exports = {
    getOrders,
    storeOrders
}