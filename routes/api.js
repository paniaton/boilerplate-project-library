/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
require('dotenv').config();
var Book = require('../model/book')

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(MONGODB_CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(ok => console.log("Connected to MongoDB!"))
  .catch(error => console.log(error));


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      let jsonBooks = [];
      //response will be array of book objects
      Book.find((err,booksCollection) => {
        if(err){
          res.status(404)
          .type('error')
          .send('Not Found');
        }
        if(booksCollection.length>0)
          booksCollection.forEach(b => jsonBooks.push({ _id:b._id, title:b.title, commentcount:b.__v }))
        res.json(jsonBooks)
      })
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      let newBook = new Book({ title: title, comment: [] })
      newBook.save((err,newBookDoc) => {
        if(err){
          res.status(404)
          .type('error')
          .send('Not Found');
        }
        let newjson = {title: newBookDoc.title, comments: newBookDoc.comments, _id: newBookDoc._id}
        res.json(newjson)
      })
    })
    
    .delete(function(req, res){
      Book.deleteMany((err,done) => {
        if(err){
          res.status(404)
          .type('error')
          .send('No pudo borrar los libros');
        }
        res.send('complete delete successful')
      })
      //if successful response will be 'complete delete successful'
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findById(bookid,(err,bookDoc)=>{
        if(err)
          res.send('Buscar un id') 
        let docJson = {_id: bookid, title: bookDoc.title, comments: bookDoc.comments }
        res.json(docJson)
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      
      Book.findById(bookid,(err,bookDoc) => {
        if(err)
          res.send('No se encontro el libro')
        
        bookDoc.comments.push(comment);

        bookDoc.save((err,bookUpdated) => {
        if(err)
          res.send('No se pudo actualizar el libro');
        let bookJson = { _id: bookUpdated._id, title:bookUpdated.title, comments: bookUpdated.comments }
        res.json(bookJson);
        })
      })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      Book.findByIdAndRemove(bookid,(err,done) => {
        if(err)
          res.json('error al borrar el libro')
        res.json('delete successful')
      })
      //if successful response will be 'delete successful'
    });
  
    app.use((req, res, next) => { //va ultimo para que en el caso de no encontrar ruta tirar este por default
      res.status(404)
      .type('text')
      .send('Not Found');
  });
};
