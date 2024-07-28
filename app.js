require('dotenv').config();
const mongoose = require('mongoose')
const express=require('express');
const path = require('path');
const ShortUrl = require('./models/shortUrl')

const BaseUrl="http://localhost:3000/";

const dbUrl =process.env.MONGODBURL;
console.log(dbUrl)
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    
    useUnifiedTopology: true,
   
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
app=express();


app.set('view engine','ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.get('/',async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('index.ejs',{shortUrls: shortUrls})
})

app.post('/shortUrls',async (req,res)=>{
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })

app.listen(3000,()=>{
    console.log('serving on port 3000')
})