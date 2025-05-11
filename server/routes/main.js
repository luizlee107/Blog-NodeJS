const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Message = require('../models/Message');
const mainLayout = '../views/layouts/main';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('', async (req, res) => {
  try {
    const locals = {
      title: "Wee Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
    
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    let categoryFilter = req.body.category; // Get the selected category
   
    // Create a filter object based on the selected category
    let categoryFilterQuery = {};
    if (categoryFilter && categoryFilter !== 'all') {
      categoryFilterQuery = { category: categoryFilter };
    }
 


    const data = await Post.find({
      $and: [
        { $or: [{ title: { $regex: new RegExp(searchNoSpecialChar, 'i') } }, 
                { category: { $regex: new RegExp(searchNoSpecialChar, 'i') } }, 
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }] },
        categoryFilterQuery // Apply category filter
      ]
    });
    console.log(req.body);
    console.log(data)

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });
  } catch (error) {
    console.log(error);
  }
});



/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});



router.get('/projects', (req, res) => {
  res.render('projects', {
    currentRoute: '/projects'
  });
});



router.get('/contact', async (req, res) => {
  try {
    const locals = {
      name: 'Name',
      email:'email',
      body: 'Simple Blog created with NodeJs, Express & MongoDb.',
      currentRoute:'/contact',
      
    }

    const data = await Post.find();
    res.render('contact', {
      locals,
      layout: mainLayout
    });

  } catch (error) {
    console.log(error);
  }

});router.post('/contact', async (req, res) => {
  
  try {
    const { name, email, body } = req.body;

    const newMessage = new Message({
      name,
      email,
      body,
    });

    await newMessage.save();
    res.redirect('/contact');
  } catch (error) {
    console.error(error);
    // Handle the error appropriately, e.g., send an error response
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;