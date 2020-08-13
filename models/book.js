// title, _id[comments], commentcount.

//Require Mongoose
const mongoose = require('mongoose')

//Define a schema
const Schema = mongoose.Schema

let bookSchema = new Schema({
  title: {type: String, required: true},
  comments:[String]
},{ toJSON: { virtuals: true } }) //include virtual fields when using Express res.json

//Virtual for comment count
bookSchema.virtual('commentcount')
  .get(function(){
  return this.comments.length
  })


//Export function to create "Book" model class
module.exports = mongoose.model('Book', bookSchema );