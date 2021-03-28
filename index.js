const express = require('express')
const bodyParser=require ('body-parser');
const cors= require ('cors')
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfjfv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors())
const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const emaCollection = client.db("ema-john-data").collection("ema-products");
  const ordersCollection = client.db("ema-john-data").collection("orders");
  console.log('database connected');

  app.post('/addProduct', (req, res) => {
      const products=req.body;
    emaCollection.insertMany(products)
    .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount);
    })
      
  })

  app.get('/products', (req, res) => {
      emaCollection.find({})
      .toArray((err, documents)=>{
          res.send(documents);
      })
  });

  app.get('/product/:key', (req, res) => {
    emaCollection.find({key:req.params.key})
    .toArray((err, documents)=>{
        res.send(documents[0]);
    })
});
app.post('/productsBuyKey', (req, res) => {
    const productkeys=req.body;
    emaCollection.find({key:{$in:productkeys}})
    .toArray((err,documents)=>{
        res.send(documents);
    })
});

app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})
  
});




// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(process.env.PORT || port)