const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article.js');
const app = express();
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override'); // Allows for use of PUT and DELETE methods on forms


mongoose.connect('mongodb://localhost/markdown_blog')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method')); // Uses _method to override GET or POST method and use PUT or DELETE instead
app.use(express.static('public'))

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/articles_index', { articles: articles });
});

app.use('/articles', articleRouter);

app.listen(3000);
