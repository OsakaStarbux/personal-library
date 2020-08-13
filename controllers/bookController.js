const Book = require("../models/book");

// Route '/api/books'
//  GET a list of all books
exports.book_list_get = function(req, res, next) {
  Book.find({}, function(err, books){
    if (err){
      return next(err)
    }
  //response will be array of book objects
  //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    res.json(books)
  })
};

//   Create a new book on POST
exports.book_create_post = function(req, res, next) {
  const title = req.body.title;
  
  if (!title) {
    
    return res.send("No title provided");
  }
  let newBook = new Book({
    title: title
  });

  newBook.save(function(err, doc) {
    if (err) {
      return next(err);
    }
    // send the newly created book obj back to user
    //response will contain new book object including atleast _id and title
    res.json(doc);
  });
};

//   DELETE all books
exports.books_delete = function(req, res, next) {
  Book.deleteMany({}, function(err) {
    if (err) return next(err);
    // deleted all book documents
    // successful response 'complete delete successful'
    res.send("complete delete successful");
  });
};

// '/api/books/:id'
//  Retrieve a single object of a book on GET

exports.book_detail_get = function(req, res, next) {
  var bookid = req.params.id;
  Book.findById(bookid, function(err, doc) {
    if (err) {
      return res.send("no book exists");
    }
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    res.json(doc);
  });
};

//    Add comment on POST
exports.comment_create_post = function(req, res, next) {
  var bookid = req.params.id;
  var comment = req.body.comment;
  Book.findByIdAndUpdate(
    bookid,
    { $push: { comments: comment } },
    { new: true },
    function(err, result) {
      if (err) {
        return next(err);
      }

      res.json(result);
    }
  );
};

//     DELETE a book from the collection
exports.book_delete = function(req, res, next) {
  var bookid = req.params.id;
  if (!bookid){
    return res.send('No book ID provideed')
  }
  Book.findByIdAndDelete(bookid, function(err, result){
    if (err){
      return res.send('COuld not delete')
    }
     // successful. response: 'delete successful'
    res.send('delete successful')
  })
 
};
