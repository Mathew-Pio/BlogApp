const express = require('express');

const { getAllBlogs , createBlogs, updateBlogs, getById, deleteBlog, getByUserId } = require('../controllers/blog-controller');

const blogRouter = express.Router();

blogRouter.get('/', getAllBlogs);

blogRouter.post('/add', createBlogs);

blogRouter.put('/update/:id', updateBlogs);

blogRouter.get('/:id', getById);

blogRouter.delete('/:id', deleteBlog);

blogRouter.get('/user/:id', getByUserId)

module.exports = blogRouter;

