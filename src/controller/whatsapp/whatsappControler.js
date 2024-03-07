const { Client, RemoteAuth, LocalAuth } = require("whatsapp-web.js");
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const { MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const store = new MongoStore({ mongoose: mongoose });

let client = new Client({
    authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000,
    }),
    authStrategy: new LocalAuth({
        dataPath: "whatsappDb",
    }),
    puppeteer: {
        args: ["--no-sandbox"],
    },
});

let urlString = null;

const connectWhatsApp = async () => {
    try {
        mongoose
            .connect(
                "mongodb+srv://Tctt_BookingEngine_TestUser:sPny3hwDu9sFikg3@tcttbookingengine-test.c3jxpfz.mongodb.net/TcttBookingEngineTest"
            )
            .then(() => {
                client.on("qr", (qr) => {
                    try {
                        qrcode.toDataURL(qr, (err, url) => {
                            if (err) {
                                console.error("Error generating QR code:", err);
                                // reject(err);
                            } else {
                                urlString = url;
                                console.log(url);
                                // resolve(url);
                            }
                        });
                    } catch (err) {
                        // reject(err);
                        throw err;
                    }
                });
                console.log("whatsapp connect");
                client.initialize();
            });
    } catch (err) {
        console.log(err);
    }
};

const getQrCodeHelper = async (req, res) => {
    try {
        const state = await client.getState();
        console.log(state, "state");
        if (state !== "CONNECTED") {
            // client.initialize();
            // new Promise((resolve, reject) => {

            // });

            res.status(200).json(urlString);
        } else {
            throw new Error("Please logout before changing number"); // Throw a new Error object
        }
    } catch (err) {
        throw err;
    }
};

const getReadyCheckHelper = async (req, res) => {
    try {
        const state = await client.getState();
        console.log(state, "state");
        if (state === "CONNECTED") {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }
    } catch (err) {
        console.log("Error in getReadyCheckHelper:", err);
        return false;
    }
};

const logoutHelper = async (req, res) => {
    try {
        const state = await client.getState();
        console.log(state, "state");
        if (state === "CONNECTED") {
            await client.logout();
            client.initialize();
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }
    } catch (err) {
        console.log(err, "err");
        return err;
    }
};

// const sendMessageHelper = async ({ number, message }) => {
//     try {
//         client
//             .sendMessage(`${number}@c.us`, message)
//             .then(() => {
//                 console.error("message sended");

//                 return { status: "success", message, number };
//             })
//             .catch((err) => {
//                 console.error("Error sending message:", err);
//                 throw Error("Internal Server Error");
//             });
//     } catch (err) {
//         console.log(err);
//     }
// };

const stateHelper = async (req, res) => {
    try {
        const state = await client?.getState();

        console.log(state, "state check helper");
        if (state === "CONNECTED") {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }
    } catch (err) {
        console.log(err);
    }
};

const sendMessageHelper = async (req, res) => {
    try {
        const { type, url, path, message, number } = req.body;

        const state = await client?.getState();

        console.log(state, "state message helper");
        if (state === "CONNECTED") {
            if (type === "path") {
                const filePath = path.join(
                    __dirname,
                    "../../public/pdf",
                    "quotation1691768192294-352642073.pdf"
                );

                const media = MessageMedia.fromFilePath(filePath);

                // Send the message with the PDF attachment
                await client.sendMessage(`${number}@c.us`, media);
            } else if (type === "url") {
                const url =
                    // "https://api.travellerschoice.ae/api/v1/b2b/attractions/orders/65e72dd9bb3a328b978254dc/ticket/65e72dd9bb3a328b978254dd";
                    "https://via.placeholder.com/350x150.png";
                const media = MessageMedia.fromUrl(url);
                await client.sendMessage(`${number}@c.us`, media);
            } else if (type === "message") {
                await client.sendMessage(
                    `${number.replace(/\+/g, "")}@c.us`,
                    message
                );
            }
            res.status(200).json(true);
        } else {
            console.log(state, "state message helper false");

            res.status(200).json(false);
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    getQrCodeHelper,
    connectWhatsApp,
    sendMessageHelper,
    getReadyCheckHelper,
    logoutHelper,
    stateHelper,
};
