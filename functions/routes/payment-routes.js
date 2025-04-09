const express = require("express");
const router = express.Router();
const {
  captureOrder,
  createPaymentActivity,
  batchPayout,
} = require("../services/paypal-service");
const {
  addCashByWalletId,
  isOrderAlreadySaved,
  createActivity,
} = require("../services/wallet-service");

router.post("/capture-order", async (req, res) => {
  try {
    const { orderID, walletID } = req.body;

    if (!orderID || !walletID) {
      return res.status(400).json({ error: "Missing orderID or walletID" });
    }

    // Check if the order has already been processed
    const isSaved = await isOrderAlreadySaved(orderID);

    if (isSaved) {
      return res.status(400).json({ error: "Order already processed" });
    }

    // Capture the order using PayPal API
    const capturedData = await captureOrder(orderID);

    // Extract total amount and items from capturedData
    let totalAmount = 0;
    let items = [];
    capturedData.purchase_units.forEach((unit) => {
      totalAmount += parseFloat(unit.payments.captures[0].amount.value);

      if (unit.items && unit.items.length > 0) {
        unit.items.forEach((item) => {
          items.push({
            name: item.name,
            quantity: item.quantity,
            unitAmount: item.unit_amount.value,
            totalAmount: item.quantity * item.unit_amount.value,
          });
        });
      }
    });

    const paymentActivity = await createPaymentActivity(
      orderID,
      capturedData,
      walletID,
      totalAmount,
      items
    );

    await createActivity(paymentActivity);
    await addCashByWalletId(walletID, totalAmount);

    return res.status(200).json({
      totalAmount: totalAmount,
    });
  } catch (error) {
    console.error("Error capturing order:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/batch-payout", async (req, res) => {
  try {
    const payload = req.body;
    console.log(payload);
    if (
      !payload.sender_batch_header ||
      !payload.items ||
      !payload.items.length
    ) {
      return res
        .status(400)
        .json({ error: "Invalid request: Missing required fields." });
    }

    const payoutResponse = await batchPayout(payload);

    res.status(200).json({
      message: "Batch payout processed successfully.",
      data: payoutResponse,
    });
  } catch (error) {
    console.error("Batch payout error:", error.message);
    res.status(500).json({ error: "Failed to process batch payout." });
  }
});

module.exports = router;
