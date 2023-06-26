const functions = require("firebase-functions");
const Filter = require("bad-words");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// prettier-ignore
exports.detectEvilUsers = functions.firestore
    .document("messages/{msg.id}")
    .onCreate(async (doc, ctx) => {
      const filter = new Filter();
      const {text, uid} = doc.data();

      if (filter.isProfane(text)) {
        const cleaned = filter.clean(text);
        await doc.ref.update({text: "banned for saying " + cleaned});

        await db.collection("banned").doc(uid).set({});
      }
    });
