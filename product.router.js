const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
router.use(bodyParser.json())

const myLogger = (req,res,next) => {  // This is a middleware that logs the req and response 
    console.log('Incoming... req Method is :',req.method)
    // res.send({test:'Tesing by hacking the app and bypassing the response !'}) 
    next()  
    // The next method is the propagate the request without it none of the below code will be executed
}
// to furthur cleear doubts regarding the next method try commenting out the line where the next method si called and then
// make a request and see what happens
// Ans: the request is pot processed at all as the middleware that sits in between is blocking it
const reqTime = (req,res,next) => { // this middlewrare adds a reqTime prop to the req object
    req.reqTime = new Date()
    console.log(req.reqTime)
    next()
}

const showParams = ({params},_,next) => {
    console.log('The Params are:' , params)
    next()
}

router.use(myLogger,reqTime)
router.use("/:id",showParams)

const products = [
    {
        id: 1,
        name: 'banana 🍌'
    },
    {
        id: 2,
        name: 'apple 🍎'
    },
    {
        id: 3,
        name: 'blue berry 🫐'
    },
    {
        id: 4,
        name: 'cheese 🧀'
    },
    {
        id: 5,
        name: 'donut 🍩'
    },
]

let idCounter = 6

router.route('/') // this will handle all get and post actions on the path : '/products'
.get((req,res) => {
    res.json({products})
})
.post((req,res) => {
    const {name,price} = req.body
    products.push({id:idCounter++,name,price}) // This will update the DB
    res.send({success:true,message:'Item Added with id:',idCounter}) // this will be returned on success
})

router.route('/:id')
.get((req,res) => {
    console.log(req.query)
    const {id} = req.params
    const product = products.find(product => product.id===parseInt(id))
    product ? res.json(product) : res.status(404).json({success:false,message:'product not found :('})
})
.post((req,res) => {
    const {id} = req.params
    const updateProduct = req.body
    products.forEach(product => {
        if(product.id===parseInt(id,10)){
            Object.keys(updateProduct).forEach(key => {
                if(key in product){
                    product[key] = updateProduct[key]
                }
            })
        }
    })
    res.json({success:true,products})
})


module.exports = router