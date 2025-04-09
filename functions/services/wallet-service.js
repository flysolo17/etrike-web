const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
admin.initializeApp();

const db = admin.firestore();

const WALLET_COLLECTION = "wallets";
const PAYMENT_ACTIVITY_COLLECTION = "activity";

/**
 * Adds cash to the user's wallet based on the payment activity.
 * @param {string} walletID - The wallet ID to update.
 * @param {number} totalAmount - The payment activity containing the transaction details.
 */

async function addCashByWalletId(walletID, totalAmount) {
  await db
    .collection(WALLET_COLLECTION)
    .doc(walletID)
    .update({
      amount: FieldValue.increment(totalAmount),
    });
}
/**
 * Checks if an order has already been saved in the payment activity collection.
 * @param {string} orderId - The PayPal order ID.
 * @returns {Promise<boolean>} - Returns true if the order exists, otherwise false.
 */
async function isOrderAlreadySaved(orderId) {
  try {
    const docRef = db.collection(PAYMENT_ACTIVITY_COLLECTION).doc(orderId);
    const doc = await docRef.get();
    return doc.exists;
  } catch (error) {
    console.error("Error checking order:", error.message);
    throw new Error("Failed to check order existence.");
  }
}

/**
 * Saves the payment activity in Firestore.
 * @param {object} paymentActivity - The payment activity object.
 */
async function createActivity(paymentActivity) {
  try {
    const activityRef = db
      .collection(PAYMENT_ACTIVITY_COLLECTION)
      .doc(paymentActivity.id);

    await activityRef.set(paymentActivity);
    console.log(`Payment activity ${paymentActivity.id} saved successfully.`);

    return true;
  } catch (error) {
    console.error("Error saving payment activity:", error.message);
    throw new Error("Failed to save payment activity.");
  }
}

module.exports = { addCashByWalletId, isOrderAlreadySaved, createActivity };
