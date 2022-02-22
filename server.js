const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
mongoose.connect(process.env.mongoDB,{
    useNewUrlParser: true
}).then(() => {
    console.log("DataBase Connected");
})
    .catch((err) => {
        console.log(err);
    })
require('./models/book');
const app = require('./app');
const Port = 3000;
const server = app.listen(Port, () => {
    console.log(`Server Running at Port ${server.address().port}`)
})