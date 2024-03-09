const router = require("express").Router();

const {
    connectWhatsApp,
    getQrCodeHelper,
    getReadyCheckHelper,
    logoutHelper,
    sendMessageHelper,
    stateHelper,
} = require("../../controller/whatsapp/whatsappControler");

const requestQueue = [];
let isProcessing = false;
// function randomDelay(req, res, next) {
//     const delay = Math.floor(Math.random() * 10) + 1; // Random delay between 1 and 10 seconds
//     setTimeout(next, delay * 1000); // Delay in milliseconds
// }
// Function to process the next request in the queue
function processQueue() {
    if (requestQueue.length > 0 && !isProcessing) {
        const nextRequest = requestQueue.shift(); // Get the next request from the queue
        isProcessing = true;

        // Process the request
        nextRequest(() => {
            isProcessing = false;
            processQueue(); // Process the next request in the queue
        });
    }
}

// Middleware to add requests to the queue
function addToQueue(req, res, next) {
    // Define a function to handle the request
    const requestHandler = () => {
        next(); // Continue to the next middleware or route handler
    };

    // Add the request handler function to the queue
    requestQueue.push(requestHandler);

    // Process the queue
    processQueue();
}

router.get("/connect", connectWhatsApp);
router.get("/qr-code", getQrCodeHelper);
router.get("/check-connected", getReadyCheckHelper);
router.get("/logout", logoutHelper);
router.get("/state-helper", stateHelper);
router.post("/send-message", addToQueue, sendMessageHelper);

module.exports = router;
