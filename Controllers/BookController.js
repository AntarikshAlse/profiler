const express = require("express");
const BookRouter = express.Router();
const Book = require("../Models/BookModels");
const { isAuth } = require("../Middlewares/AuthMiddleware");

BookRouter.get("/books", async (req, res) => {
  try {
    let books = await Book.getBooks({});
    res.status(200).json({ data: books, message: "Success" });
  } catch (error) {
    res.status(400).json({ data: error.message, message: "Database Error" });
  }
});
// create a new book

BookRouter.post("/book", isAuth, async (req, res) => {
  let book = new Book({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    category: req.body.category,
  });
  try {
    let newBook = await book.createBook(req.body);
    res.status(201).json({ data: newBook, message: "Success" });
  } catch (error) {
    res.status(400).json({ data: error.message, message: "Database Error" });
  }
});

module.exports = BookRouter;
