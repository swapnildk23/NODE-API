const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Product = require('./models/productmodel')
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended:false}));
// Create a .env file and save your MongoDB connection URL with key as 'DB_URL'
mongoose.connect(process.env.DB_URL).then(()=>{
    app.listen(3000, function(){
        console.log('Node API listening on port 3000')
    })
console.log('Connected to MongoDB')

})

.catch((error)=>{
    console.log('Failed to connect to MongoDB')
})

app.get('/', function(req, res) {
    res.send("Hello Node API")
})

app.get('/blog', function(req, res) {
    res.send("Hello Blog")
})

app.post('/product',async(req, res)=> {
try {
    const product = await Product.create(req.body)
    res.status(200).json(product)
    
} catch (error) {
    console.log(error.message)
    res.status(500).json({message: error.message})
}
})

app.get('/products', async (req, res)=>{
    try {
        const products = await Product.find({});
        res.status(200).json(products)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }

})
app.get('/products/:id', async(req,res) => {
   
        try {
            const {id} =req.params;
            const product = await Product.findById(id);
            res.status(200).json(product)
        } catch (error) {
            console.log(error.message)
    res.status(500).json({message: error.message})

        }
})

app.put('/products/:id', async (req, res) => {
    try {
        const {id}= req.params;
        const product = await Product.findByIdAndUpdate(id,req.body);
        if(!product) {
            return res.status(404).json({message:'Cannot find product with id '+ id});
        }
        const updatedProduct = await Product.findById(id);
            res.status(200).json(updatedProduct);
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
}
)

app.delete('/products/:id',async function(req, res) {
    try {
        const{id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({message: 'Product not found'+id});
        }
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})