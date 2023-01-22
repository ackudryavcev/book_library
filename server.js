const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');



const data = require("./books.json");

// READ   - GET     - /books
// CREATE - POST    - /books
// UPDATE - PUT     - /books/:id
// DELETE - DELETE  - /books/:id


app.use(express.json());


app.get('/books', function(req, res) { readBooks(req, res); });
app.post('/books', function(req, res) { createBook(req, res); });
app.put('/books/:id', function(req, res) { updateBook(req, res); });
app.delete('/books/:id', function(req, res) { deleteBook(req, res); });


function readBooks(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(data);
}


function createBook(req, res) {
    const { title, author } = req.body;
    const id = uuidv4();
    if (!title || !author) {
        res.status(400).send("invalid request");
        return;
    }

    const newBook = {
        id,
        title,
        author
    }
    data.push(newBook);
    res.status(201).send(newBook);
}

function updateBook(req, res) {
    const { title, author } = req.body;
    const id = req.params.id;
    if (!title || !author || !id) {
        res.status(400).send("invalid request");
        return;
    }
    const bookToUpdate = data.find(book => book.id === id);
    if (!bookToUpdate) {
        res.status(404).send("Book didn't find");
        return;
    }
    bookToUpdate.title = title;
    bookToUpdate.author = author;
    res.status(200).send(bookToUpdate);
}

function deleteBook(req, res) {
    const id = req.params.id;
    if (!id) {
        res.status(400).send("invalid request");
        return;
    }
    const bookToDelete = data.find(book => book.id === id);
    if (!bookToDelete) {
        res.status(404).send("Book didn't find");
        return;
    }
    data.splice(data.indexOf(bookToDelete), 1);
    res.status(200).send("Book was deleted");
}

app.listen(3000)