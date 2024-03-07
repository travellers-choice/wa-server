// Importing required modules
const express = require("express");
const { connectWhatsApp } = require("./controller/whatsapp/whatsappControler");

// Creating an instance of Express
const app = express();

const { whatsappRouter } = require("./router");
// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

connectWhatsApp();

app.use("/whatsapp", whatsappRouter);

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
