/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MONGO_URI = process.env.MONGO_URI;
const mongoose = require('mongoose')
const ObjectId = mongoose.ObjectID
const book_controller = require('../controllers/bookController')

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
})

module.exports = function (app) {

  app.route('/api/books')
    .get(book_controller.book_list_get)
    
    .post(book_controller.book_create_post)
    
    .delete(book_controller.books_delete);

  app.route('/api/books/:id')
    .get(book_controller.book_detail_get)
    
    .post(book_controller.comment_create_post)
    
    .delete(book_controller.book_delete);
  
};
