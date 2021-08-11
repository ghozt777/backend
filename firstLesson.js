const express = require('express')
const app = express()


const products = require('./product.router.js')
const categories = require('./categories.router')
app.use("/products",products) // for futher reference read the express router documentation
app.use("/categories",categories)

app.get('/',(req,res) => {
    res.send("<h1> Hello Express App </h1>")
})


app.post('/products')

const PORT = 5000

app.listen(PORT,() => console.log('Server Started on PORT: ', PORT))