const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

const axios = require("axios");

async function getPayPalAccessToken() {
  const response = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
}

async function captureOrder(orderID) {
  try {
    const accessToken = await getPayPalAccessToken();

    // Capture the order using PayPal API
    const captureResponse = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const orderData = captureResponse.data;

    return orderData;
  } catch (error) {
    console.error(
      "Error capturing order:",
      error.response?.data || error.message
    );
    throw new Error("Failed to capture PayPal order.");
  }
}

async function createPaymentActivity(
  orderID,
  capturedData,
  walletID,
  totalAmount,
  items
) {
  const paymentActivity = {
    id: orderID,
    walletID: walletID,
    payer: capturedData.payer,
    totalAmount: totalAmount,
    items: items,
    type: "CASH_IN",
    status: capturedData.status,
    capturedTime: new Date(),
  };

  return paymentActivity;
}

async function batchPayout(payload) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await axios.post(
      `${PAYPAL_API}/v1/payments/payouts`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error processing batch payout:",
      error.response?.data || error.message
    );
    throw new Error("Failed to process PayPal batch payout.");
  }
}

module.exports = {
  getPayPalAccessToken,
  captureOrder,
  createPaymentActivity,
  batchPayout,
};
