const mongoose = require('mongoose')

let conUrl = "";

if(process.env.NODE_ENV == "production"){
    conUrl = 'mongodb://mukul:ms1234@ds129762.mlab.com:29762/heroku_vkb4dhv1';
} 
else if (process.env.NODE_ENV == "development"){
    conUrl = 'mongodb://127.0.0.1:27017/assign2-auth';
} 

console.log(conUrl)

mongoose.connect(conUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});