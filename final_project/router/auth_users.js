const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let fitleredUsers = users.filter((user) => {
    return user["username"] === username;
  });
  return fitleredUsers.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  if (isValid(username)) {
    let fitleredUsers = users.filter((user) => {
      return user["username"] === username && user["password"] === password;
    });
    return fitleredUsers.length > 0;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({message: "Invalid username or password"});
    }
    if (authenticatedUser(username,password)) {
      let token = jwt.sign({
        username: username,
        password: password
      }, 'fingerprint_customer', { expiresIn: '1h' });
      req.session.authorization = {"accessToken": token};
      return res.status(200).json({message: "User logged in successfully"});
    } else {
      return res.status(403).json({message: "Invalid username or password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    let review = req.body.review;
    if (!review) {
        return res.status(400).json({message: "Invalid review"});
    }
    let filteredBooks = Object.values(books).filter((book) => {
        return book["ISBN"] === isbn;
    });
    if (filteredBooks.length === 1) {
        let filterBook = filteredBooks[0];
        filterBook["reviews"][req.user.username] = review;
        return res.status(200).json({message: "Review added successfully"});
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    let filteredBooks = Object.values(books).filter((book) => {
        return book["ISBN"] === isbn;
    });
    if (filteredBooks.length === 1) {
        let filterBook = filteredBooks[0];
        delete filterBook["reviews"][req.user.username];
        return res.status(200).json({message: "Review deleted successfully"});
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
