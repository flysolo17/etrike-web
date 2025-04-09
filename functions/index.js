const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
require("dotenv").config();
const functions = require("firebase-functions");

const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const payment = require("./routes/payment-routes");
const crashDetection = require("./routes/crash-detection-route");
const { onDocumentCreated } = require("firebase-functions/firestore");
const {
  sendAlertMessage,
  sendSMS,
  isCrashStillPending,
} = require("./services/crash-detection-service");
app.use("/payment", payment);
app.use("/crash-detection", crashDetection);

const db = admin.firestore();
exports.onEmergencyCreate = onDocumentCreated(
  "crashes/{crashId}",
  async (event) => {
    const emergencyData = event.data.data();
    const passengerID = emergencyData.passengerID;
    const location = emergencyData.location;

    console.log("⏳ Waiting 30 seconds...");

    await new Promise((resolve) => setTimeout(resolve, 30000));
    const crashId = event.data.id;
    const isAlertStillPending = await isCrashStillPending(crashId);
    if (!isAlertStillPending) {
      console.log("🚫 Alert is no longer pending. Exiting...");
      return;
    }
    sendAlertMessage(passengerID, crashId, location);
  }
);

exports.api = functions.https.onRequest(app);
