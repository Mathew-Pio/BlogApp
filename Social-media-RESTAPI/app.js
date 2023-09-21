const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/user-routes');
const blogRouter = require('./routes/blog-routes');

const app = express();

app.use(express.json());
app.use('/api/user',router);  // localhost:5000/api/user/route
app.use('/api/blog', blogRouter);

mongoose.connect('mongodb+srv://MathewPio:myPassword@cluster0.rsj3csu.mongodb.net/Blog?retryWrites=true&w=majority')
.then(() => {
    app.listen(5000);
    console.log('Connection established!!')
})
.catch(err => {
    console.log(err);
});

