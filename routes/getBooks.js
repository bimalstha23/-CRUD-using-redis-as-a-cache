const express =  require('express');
const router = express.Router();
const books = require('../models/book');
const redis  = require('redis');


const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
  })

const GET_ASYNC = promisify(client.get).bind(client)
const SET_ASYNC = promisify(client.set).bind(client)
//get all data from the database
router.get('/',async(req,res)=>{
    try{
        const book = await GET_ASYNC('books')
        if (book) {
          console.log('using cached data')
          res.send(JSON.parse(book))
          return
        }
        const book = await books.find();
        const saveData = await SET_ASYNC(
            'books',
            JSON.stringify(book.data),
            'EX',
            20
          )
          console.log("the values are cached");
        res.json(book);
    }catch(err){
        res.send(err);
    }
})
//add data to the datebase
router.post('/',async(req,res)=>{
    const book  = new books({
    title:req.body.title,
    author:req.body.author,
    genre: req.body.genre,
    })
    try{
        const book1  = await book.save();
        res.json(book1);
    }catch(err){
        res.send(err);
    }
})
//get data by id
router.get('/:id',async(req,res)=>{
    try{
        const book = await books.findById(req.params.id);
        res.json(book);
    }catch(err){
        res.send(err);
    }
})
//patch data by id
router.patch('/:id',async(req,res)=>{
    try{
        const book = await  books.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.genre = req.body.genre;
        const book1 = await book.save();
        res.json(book1);
    }catch(err){
        res.send(err);
    }
})

router.delete()
module.exports = router;