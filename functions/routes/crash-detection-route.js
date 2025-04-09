const express = require("express");
const router = express.Router();
const {
  login,
  getOngoingTransactions,
  createEmergency,
  sendSMS,
} = require("../services/crash-detection-service");
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the crash detection route",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await login({ email, password });

    if (result.error) {
      return res.status(401).json({ error: result.error });
    }

    return res.json({
      uid: result.uid,
      token: result.token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    const transactions = await getOngoingTransactions(uid);
    res.status(200).json({ transactions });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch transactions", details: error.message });
  }
});

router.post("/create-emergency", async (req, res) => {
  try {
    const { driverID, location, impact } = req.body;

    if (!driverID || !location || !impact) {
      return res
        .status(400)
        .json({ error: "Driver ID, location, and impact are required" });
    }

    await createEmergency({ driverID, location, impact });
    res.status(201).json({ message: "Emergency created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create emergency", details: error.message });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { message, uid } = req.body;

    if (!message || !uid) {
      return res.status(400).json({ error: "Message and UID are required" });
    }

    const recipient = "09776989425,09073262189";

    // Call the sendSMS function
    const result = await sendSMS(message, recipient);

    if (result.success) {
      return res.status(200).json({
        message: "SMS sent successfully",
        data: result.data,
      });
    } else {
      return res.status(500).json({
        error: "Failed to send SMS",
        details: result.error,
      });
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = router;
