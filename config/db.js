const mongoose = require('mongoose')

let conUrl = 'mongodb://mukul:ms1234@ds129762.mlab.com:29762/heroku_vkb4dhv1' || 'mongodb://127.0.0.1:27017/assign2-auth';

mongoose.connect(conUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})