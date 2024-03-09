const router = require("express").Router();

const {
    connectWhatsApp,
    getQrCodeHelper,
    getReadyCheckHelper,
    logoutHelper,
    sendMessageHelper,
    stateHelper,
} = require("../../controller/whatsapp/whatsappControler");

function randomDelay(req, res, next) {
    const delay = Math.floor(Math.random() * 10) + 1;
    setTimeout(next, delay * 1000);
}
router.get("/connect", connectWhatsApp);
router.get("/qr-code", getQrCodeHelper);
router.get("/check-connected", getReadyCheckHelper);
router.get("/logout", logoutHelper);
router.get("/state-helper", stateHelper);
router.post("/send-message", randomDelay, sendMessageHelper);

module.exports = router;
