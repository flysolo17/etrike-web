const axios = require("axios");
const FIREBASE_API_KEY = process.env.API_KEY;
const admin = require("firebase-admin");
const db = admin.firestore();
const TRANSACTION_COLLECTION = "transactions";
const CRASH_DETECTION_COLLECTION = "crashes";
async function getOngoingTransactions(uid) {
  try {
    const snapshot = await db
      .collection(TRANSACTION_COLLECTION)
      .where("status", "==", "OTW")
      .where("driverID", "==", uid)
      .orderBy("updatedAt", "desc")
      .limit(1)
      .get();
    if (snapshot.empty) {
      console.log("No ongoing transactions found.");
      return [];
    }

    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return transactions;
  } catch (error) {
    console.error("Error fetching ongoing transactions:", error);
    throw error;
  }
}

async function login(params) {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email: params.email,
        password: params.password,
        returnSecureToken: true,
      }
    );

    return {
      uid: response.data.localId,
      token: response.data.idToken,
      message: "Login successful",
    };
  } catch (error) {
    return { error: error.response?.data?.error?.message || "Login failed" };
  }
}

async function createEmergency(params) {
  try {
    const driverID = params.driverID;
    const ongoingTransactions = await getOngoingTransactions(driverID);
    const passengerID = ongoingTransactions[0].passengerID;
    params.passengerID = passengerID;

    const location = params.location;
    params.location = `https://www.google.com/maps?q=${location}`;
    await db.collection(CRASH_DETECTION_COLLECTION).add({
      ...params,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { message: "Emergency created successfully" };
  } catch (error) {
    return {
      error: error.response?.data?.error || "Failed to create emergency",
    };
  }
}
async function sendAlertMessage(passengerID, crashId, location) {
  try {
    await db
      .collection(CRASH_DETECTION_COLLECTION)
      .doc(crashId)
      .update({ status: "ALERTED" });

    const passengerSnapshot = await db
      .collection("users")
      .doc(passengerID.trim())
      .get();
    let loc = `https://www.google.com/maps?q=${location}`;
    if (!passengerSnapshot.exists) {
      console.log(`Passenger with ID ${passengerID} not found.`);
      return;
    }

    const contactsSnapshot = await db
      .collection("users")
      .doc(passengerID)
      .collection("contacts")
      .get();

    if (contactsSnapshot.empty) {
      console.log(
        `No emergency contacts found for passenger ID ${passengerID}.`
      );
      return;
    }

    let message = `A high G impact is detected. Please contact ${
      passengerSnapshot.data().name
    } \n View Location here: ${loc} \n\n This is an automated message.`;

    let phoneNumbers = contactsSnapshot.docs.map(
      (contactDoc) => contactDoc.data().phone
    );
    await sendSMS(phoneNumbers, message);
  } catch (error) {
    console.error("Error sending emergency alerts:", error);
  }
}

async function sendSMS(phone, message) {
  try {
    const payload = new URLSearchParams();
    payload.append("apikey", process.env.SEMAPHORE_KEY);
    payload.append("number", Array.isArray(phone) ? phone.join(",") : phone);
    payload.append("message", message);
    payload.append("sendername", "ETRIKE");

    const response = await axios.post(
      "https://semaphore.co/api/v4/messages",
      payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: false,
      }
    );

    if (response.status >= 200 && response.status < 300) {
      console.log(`📲 SMS sent to ${phone}:`, response.data);
    } else {
      console.error(
        `❌ Semaphore API error: ${response.status} -`,
        response.data
      );
    }
  } catch (error) {
    console.error(
      `❌ Failed to send SMS to ${phone}:`,
      error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
    );
  }
}

async function isCrashStillPending(crashId) {
  try {
    const crashSnapshot = await db
      .collection(CRASH_DETECTION_COLLECTION)
      .doc(crashId)
      .get();

    if (!crashSnapshot.exists) {
      console.log(`Crash with ID ${crashId} not found.`);
      return false;
    }

    const crashData = crashSnapshot.data();
    return crashData.status === "PENDING";
  } catch (error) {
    console.error("Error checking crash status:", error);
    return false;
  }
}

module.exports = {
  login,
  getOngoingTransactions,
  createEmergency,
  sendAlertMessage,
  sendSMS,
  isCrashStillPending,
};
