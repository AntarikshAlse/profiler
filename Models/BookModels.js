const bookSchema = require("../Schemas/BookSchema");

const Book = class {
  constructor(data) {
    this.title = data.title;
    this.author = data.author;
    this.category = data.category;
    this.price = data.price;
  }

  static getBooks() {
    return new Promise(async (resolve, reject) => {
      try {
        let books = await bookSchema.find();
        resolve(books);
      } catch (error) {
        reject(error);
      }
    });
  }

  createBook() {
    let newBook = new bookSchema(this);
    return new Promise(async (resolve, reject) => {
      try {
        let newbook = await newBook.save();
        resolve(newbook);
      } catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = Book;
