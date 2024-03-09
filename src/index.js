// Importing required modules
const express = require("express");
const { connectWhatsApp } = require("./controller/whatsapp/whatsappControler");
const bodyParser = require("body-parser");

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Creating an instance of Express

const { whatsappRouter } = require("./router");
// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

connectWhatsApp();

function randomDelay(req, res, next) {
    const delay = Math.floor(Math.random() * 10) + 1; // Random delay between 1 and 10 seconds
    setTimeout(next, delay * 1000); 
}

app.use("/whatsapp", randomDelay, whatsappRouter);

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
