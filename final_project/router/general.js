const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({message: "Invalid username or password"});
    }
    if (isValid(username)) {
        return res.status(400).json({message: "Username already exists"});
    }
    if (username.length < 6 || password.length < 6) {
        return res.status(400).json({message: "Username or password too short"});
    }
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let filteredBooks = Object.values(books).filter((book) => {
    return book["ISBN"] === isbn;
  });
    if (filteredBooks.length === 1) {
        return res.status(200).json(filteredBooks[0]);
    } else if (filteredBooks.length > 1) {
        return res.status(403).json({message: "Multiple books found with the same ISBN number"});
    } else {
        return res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let filteredBooks = Object.values(books).filter((book) => {
        return book["author"] === author;
    });
    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({message: "Author not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let filteredBooks = Object.values(books).filter((book) => {
        return book["title"] === title;
    });
    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({message: "Title not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let filteredBooks = Object.values(books).filter((book) => {
        return book["ISBN"] === isbn;
    });
    if (filteredBooks.length === 1) {
        return res.status(200).json(filteredBooks[0]["reviews"]);
    } else if (filteredBooks.length > 1) {
        return res.status(403).json({message: "Multiple books found with the same ISBN number"});
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
