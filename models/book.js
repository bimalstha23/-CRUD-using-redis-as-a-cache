const mongoose  = require('mongoose');


const booksSchema = new mongoose.Schema({
    title:{
        type: String
        
    },
    author:{
        type:String
    },
    genre:{
        type:String
    }
    
});

let books = mongoose.model('books',booksSchema);
module.exports = books;