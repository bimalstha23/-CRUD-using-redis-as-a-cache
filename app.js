const express  =  require('express');
const app =express();
const mongoose = require('mongoose');



app.use(express.json());
app.get('/',(req,res)=>{
    res.send('server is Running');
});
const booksRouter = require('./routes/getBooks');
app.use('/books',booksRouter);
module.exports=app;