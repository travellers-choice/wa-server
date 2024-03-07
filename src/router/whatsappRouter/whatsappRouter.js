const router = require("express").Router();

const {
    connectWhatsApp,
    getQrCodeHelper,
    getReadyCheckHelper,
    logoutHelper,
    sendMessageHelper,
} = require("../../controller/whatsapp/whatsappControler");

router.get("/connect", connectWhatsApp);
router.get("/qr-code", getQrCodeHelper);
router.get("/check-connected", getReadyCheckHelper);
router.get("/logout", logoutHelper);
router.get("/state-helper", logoutHelper);

router.post("/send-message", sendMessageHelper);

module.exports = router;
