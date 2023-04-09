const express = require('express');
const jwt =  require('jsonwebtoken');
const multer  = require('multer')
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

const upload = multer({ storage:storage })

const Product = require('../model/Product')
const {checkAuthentication,isSeller} = require('../middleware/auth')

const router = express.Router();

router.get("/products", async (req,res,next) => {
    // let products = await Product.find({
    //     name: RegExp(`${req.query.search_term}`, "i")
    // })
    let per_page = parseInt(req.query.per_page) || 2;
    let page = parseInt(req.query.page) || 1;
    let products = await Product.aggregate([
        {
            $match: {
                name: RegExp(`${req.query.search_term}`, "i")
            }
        },
        {
            $match: {
                price: { $lt: 1000 }
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "created_by"
            }
        },
        {
            $unwind:"$created_by"
        },
        {
          $project: {
            "created_by.password":0
          }    
        },
        {
            $skip: (page-1) * per_page
        },
        {
            $limit: per_page   
        }
    ])
    let productsCount = await Product.aggregate([
        {
            $match: {
                name: RegExp(`${req.query.search_term}`, "i")
            }
        },
        {
            $match: {
                price: { $lt: 1000 }
            }
        },
        {
            $count: "total"
        }
    ])
    res.send({
        meta:{
            total: productsCount[0].total,
            page,
            per_page
        },
        data:products
    })
})




router.put("/products/:id", checkAuthentication, isSeller, upload.array('images', 12), async (req,res,next) => {
    try{
        let db_product = await Product.findById(req.params.id)
        let seller_id  = db_product.created_by
        if(req.user._id != seller_id){
            res.status(403).send({
                data: "Not valid seller"
            })
        }
        console.log(req.params);
        let product = await Product.findByIdAndUpdate(req.params.id, {...req.body}, { new: true })
        res.send(product)
    }catch(err){
        next(err)
    }
})

router.post("/products", checkAuthentication, isSeller, upload.array('images', 12), async (req,res,next) => {
    try{
        let images = req.files.map(file=> file.filename)
        let products = await Product.create({ ...req.body,created_by: req.user._id, images})
        
        res.send(products)
    }catch(err){
        next(err)
    }
})

router.delete("/products/:id", checkAuthentication, isSeller, async (req,res,next) => {
    try{
        let db_product = await Product.findById(req.params.id)
        let seller_id  = db_product.created_by
        if(req.user._id != seller_id){
            res.status(403).send({
                data: "Not valid seller"
            })
        }
        console.log(req.params);
        let product = await Product.findByIdAndDelete(req.params.id)
        res.send({
            data: product
        })
    }catch(err){
        next(err)
    }
})

module.exports = router