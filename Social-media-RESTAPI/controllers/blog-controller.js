const Blog = require('../models/Blog');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getAllBlogs = async(req, res, next) => {
    let blogs;

    try{
        blogs = await Blog.find();
    }catch(err){
        return console.log(err)
    }

    if(!blogs){
        return res.status(404).json({
            message: 'No blogs found'
        })
    }
    return res.status(200).json({blogs})

}

exports.createBlogs = async(req, res, next) => {
    const { title, description, image, user } = req.body;

    let existingUser;
    try{
        existingUser = await User.findById(user);
    }catch(err){
        console.log(err)
    }

    if(!existingUser){
        return res.status(500).json({
            message:'Unable to find user by this ID'
        })
    }

    const blogs = new Blog({
        title, description, image, user
    })

    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await blogs.save({session});
        existingUser.blogs.push(blogs);
        await existingUser.save({ session })
        await session.commitTransaction();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:err
        })
    }

    return res.status(200).json({blogs});
}

exports.updateBlogs = async(req, res, next) => {
    const blogId = req.params.id
    const { title, description } = req.body
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId, {
                title,
                description
            })
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(500).json({
            message: 'Unable to update blog'
        })
    }
    return res.status(200).json({blog})
}

exports.getById = async(req, res, next) => {
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(id);
    }catch(err){
        return console.log(err);
    }

    if(!blog){
        return res.status(404).json({
            message: 'No blogs found'
        })
    }

    return res.status(200).json({ blog })
}

exports.deleteBlog = async(req, res, next) => {
    const id = req.params.id;

    let blog;
    try{
        blog = await Blog.findByIdAndRemove(id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }catch(err){
        console.log(err)
    }

    if(!blog){
        return res.status(500).json({
            message: 'Unable to delete'
        })
    }

    return res.status(200).json({
        message:'Blog deleted successfully'
    })
}

exports.getByUserId = async(req, res, next) => {
    let userId = req.params.id;

    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate('blogs');
    }catch(err){
        return console.log(err)
    }

    if(!userBlogs){
        return res.status(404).json({
            message:'Blogs not found'
        })
    }

    return res.status(200).json({blogs: userBlogs})
}